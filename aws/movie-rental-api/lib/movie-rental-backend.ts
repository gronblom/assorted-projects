import * as cdk from '@aws-cdk/core'
import {
    Stack,
    StackProps,
    aws_ec2 as ec2,
    aws_cloudformation,
    Token,
    Duration,
    CfnOutput,
    aws_rds as rds,
    aws_lambda as lambda,
    RemovalPolicy
} from 'aws-cdk-lib';
import { CdkResourceInitializer } from '../lib/resource-init'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { Construct } from 'constructs';

export class MovieRentalBackend extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const instanceIdentifier = 'postgresql-movie-rental-01'
    const credsSecretName = `/${id}/rds/creds/${instanceIdentifier}`.toLowerCase()
    const creds = new rds.DatabaseSecret(this, 'PostgresRdsCredentials', {
      secretName: credsSecretName,
      username: 'postgres',
    })

    const vpc = new ec2.Vpc(this, 'MyVPC', {
      natGateways: 1,
      maxAzs: 3,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'ingress',
        subnetType: ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 24,
        name: 'compute',
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },{
        cidrMask: 28,
        name: 'rds',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }]
    })

    const dbServer = new rds.DatabaseInstance(this, 'PostgresRdsInstance', {
      vpcSubnets: {
        onePerAz: true,
        // for ease of development, put on public subnet
        //subnetType: ec2.SubnetType.PRIVATE_ISOLATED 
        subnetType: ec2.SubnetType.PUBLIC
      },
      credentials: rds.Credentials.fromSecret(creds),
      vpc: vpc,
      port: 1521,
      databaseName: 'main',
      allocatedStorage: 20,
      instanceIdentifier,
      engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_12_8,
          
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      backupRetention: Duration.days(0),
      removalPolicy: RemovalPolicy.DESTROY,
    })
    // potentially allow connections to the RDS instance...
    // dbServer.connections.allowFrom ...

    const initializer = new CdkResourceInitializer(this, 'MyRdsInit', {
      config: {
        credsSecretName
      },
      fnLogRetention: RetentionDays.THREE_DAYS,
      fnCode: lambda.DockerImageCode.fromImageAsset(`${__dirname}/db-init`, {}),
      fnTimeout: Duration.minutes(2),
      fnSecurityGroups: [],
      vpc,
      subnetsSelection: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      })
    })
    // manage resources dependency
    initializer.customResource.node.addDependency(dbServer)

    // allow the initializer function to connect to the RDS instance
    dbServer.connections.allowFrom(initializer.function, ec2.Port.tcp(1521))

    // allow initializer function to read RDS instance creds secret
    creds.grantRead(initializer.function)

    /* eslint no-new: 0 */
    new CfnOutput(this, 'RdsInitFnResponse', {
      value: Token.asString(initializer.response)
    })

    new CfnOutput(this, 'dbEndpoint', {
      value: dbServer.instanceEndpoint.hostname,
    });

    new CfnOutput(this, 'secretName', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: dbServer.secret?.secretName!,
    });
  }
}