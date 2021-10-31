import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from '@aws-cdk/aws-iam'
import * as path from 'path';
import { KeyPair } from 'cdk-ec2-key-pair';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { VpnConnection } from '@aws-cdk/aws-ec2';
import {readdirSync, readFileSync} from 'fs';

export class QuizAppAwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Key Pair to be used with this EC2 Instance
    const key = new KeyPair(this, 'KeyPair', {
      name: 'quiz-app-cdk-keypair',
      description: 'Key Pair created with CDK Deployment',
    });
    key.grantReadOnPublicKey

    // Create new VPC with 2 Subnetsls
    const vpc = new ec2.Vpc(this, 'VPC', {
      enableDnsSupport:  true,
      enableDnsHostnames: true,
      natGateways: 1,
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "frontend",
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: "backend",
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        }
      ]
    });

    const frontendSecurityGroup = new ec2.SecurityGroup(this, 'FrontendSecurityGroup', {
      vpc: vpc,
      description: 'Allow HTTP (port 80) and SSH (TCP port 22) in',
      allowAllOutbound: true
    });
    frontendSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')
    frontendSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP Access')

    const role = new iam.Role(this, 'ec2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    })

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'))

    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64
    });

    // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
    const ec2Frontend = new ec2.Instance(this, 'Frontend', {
      vpc: vpc,
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: frontendSecurityGroup,
      keyName: key.keyPairName,
      role: role
    });

    const backendSecurityGroup = new ec2.SecurityGroup(this, 'BackendSecurityGroup', {
      vpc: vpc,
      description: 'Allow HTTP (port 80), graphql at port 4000 and SSH (TCP port 22) in',
      allowAllOutbound: true
    });
    backendSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')
    backendSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP Access')
    backendSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(4000), 'Allow graphql Access')

    //Backend
    const ec2Backend = new ec2.Instance(this, 'Backend', {
      vpc: vpc,
      vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE_WITH_NAT},
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: backendSecurityGroup,
      keyName: key.keyPairName,
      role: role,
    });
    
    const assetBackend = new Asset(this, 'BackendAsset', {
      path: path.join(__dirname, '../../../quiz-app-backend')
    });
    const backendLocalPath = ec2Backend.userData.addS3DownloadCommand({
      bucket: assetBackend.bucket,
      bucketKey: assetBackend.s3ObjectKey,
    });

    const backendInstallCommands = [`unzip ${backendLocalPath} -d /home/ec2-user/app`,
      'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash',
      'export NVM_DIR="$HOME/.nvm"', '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"',
      'nvm install 14', 'cd /home/ec2-user/app', 'rm -rf node_modules', 'npm install',
      'cp src/graphql/schemas build/graphql/ -rv', 'node /home/ec2-user/app/build/index.js'];

    ec2Backend.userData.addCommands(...backendInstallCommands)
    assetBackend.grantRead(ec2Backend.role);

    // Frontend
    const quizAppFrontendAsset = new Asset(this, 'FrontendQuizAsset', {
      path: path.join(__dirname, '../../../quiz-app-frontend')
    });
    const quizAppPath = ec2Frontend.userData.addS3DownloadCommand({
      bucket: quizAppFrontendAsset.bucket,
      bucketKey: quizAppFrontendAsset.s3ObjectKey,
    });

    const httpServerAsset = new Asset(this, 'FrontendHttpServerAsset', {
      path: path.join(__dirname, '../src/http-server')
    });
    const httpServerPath = ec2Frontend.userData.addS3DownloadCommand({
      bucket: httpServerAsset.bucket,
      bucketKey: httpServerAsset.s3ObjectKey,
    });

    const frontendInstallCommands = [
      `unzip ${httpServerPath} -d /home/ec2-user/app`,
      `unzip ${quizAppPath} -d /home/ec2-user/app/quiz-app`,
      'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash',
      'export NVM_DIR="$HOME/.nvm"', '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"',
      'nvm install 14',
      'cd /home/ec2-user/app/quiz-app',
      'rm -rf node_modules', 'npm install', 'rm .env', 'touch .env.production',
      `echo "REACT_APP_BACKEND_URL=http://${ec2Backend.instancePrivateIp}:4000/graphql" >> .env.production`,
      `echo "REACT_APP_BACKEND_WEBSOCKET_URL=ws://${ec2Backend.instancePrivateIp}:4000" >> .env.production`,
      'npm run build', 'mkdir ../public', 'cp -Rv build/* ../public',
      'cd /home/ec2-user/app', 'rm -rf node_modules', 'npm install',
      `npm start`];
    ec2Frontend.userData.addCommands(...frontendInstallCommands)
    quizAppFrontendAsset.grantRead(ec2Frontend.role);

    //const userDataScript = readFileSync('build/backend_build');
    //ec2Backend.addUserData(userDataScript);

    /**  Add this to .bashrc for setting node command for ec2-user
     export NVM_DIR="/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    **/

    // User data script log: /var/log/cloud-init-output.log

    // Create outputs for connecting
    new cdk.CfnOutput(this, 'Frontend IP Address', { value: ec2Frontend.instancePublicIp });
    new cdk.CfnOutput(this, 'Key Name', { value: key.keyPairName })
    new cdk.CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/quiz-app-cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
    new cdk.CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Frontend.instancePublicIp })
    new cdk.CfnOutput(this, 'Backend IP Address', { value: ec2Backend.instancePrivateIp });
  }
}
