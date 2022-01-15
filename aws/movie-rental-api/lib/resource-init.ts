import {
    Duration,
    Stack, Tags,
    aws_ec2 as ec2,
    aws_lambda as lambda,
    aws_iam as iam,
    custom_resources,
} from  'aws-cdk-lib'
import { Construct } from 'constructs';
import { createHash } from 'crypto'
//import { calculateFunctionHash } from '@aws-cdk/aws-lambda/lib/function-hash'
import { RetentionDays } from '@aws-cdk/aws-logs'

export interface CdkResourceInitializerProps {
  vpc: ec2.IVpc
  subnetsSelection: ec2.SubnetSelection
  fnSecurityGroups: ec2.ISecurityGroup[]
  fnTimeout: Duration
  fnCode: lambda.DockerImageCode
  fnLogRetention: RetentionDays
  fnMemorySize?: number
  config: any
}

export class CdkResourceInitializer extends Construct {
  public readonly response: string
  public readonly customResource: custom_resources.AwsCustomResource
  public readonly function: lambda.Function

  constructor (scope: Construct, id: string, props: CdkResourceInitializerProps) {
    super(scope, id)

    const stack = Stack.of(this)

    const fnSg = new ec2.SecurityGroup(this, 'ResourceInitializerFnSg', {
      securityGroupName: `${id}ResourceInitializerFnSg`,
      vpc: props.vpc,
      allowAllOutbound: true
    })

    const fn = new lambda.DockerImageFunction(this, 'ResourceInitializerFn', {
      memorySize: props.fnMemorySize || 128,
      functionName: `${id}-ResInit${stack.stackName}`,
      code: props.fnCode,
      vpcSubnets: props.vpc.selectSubnets(props.subnetsSelection),
      vpc: props.vpc,
      securityGroups: [fnSg, ...props.fnSecurityGroups],
      timeout: props.fnTimeout,
      logRetention: props.fnLogRetention,
      allowAllOutbound: true
    })

    const payload: string = JSON.stringify({
      params: {
        config: props.config
      }
    })

    const physicalResIdHash = createHash('md5')
      //.update(calculateFunctionHash(fn) + payload) this does not work for new DockerImageFunction
      .update(payload)
      .update(`${Math.random()}`) // hack for always deploying the lambda db init image, as func hash does not currently work
      .digest('hex')

    const sdkCall: custom_resources.AwsSdkCall = {
      service: 'Lambda',
      action: 'invoke',
      parameters: {
        FunctionName: fn.functionName,
        Payload: payload
      },
      physicalResourceId: custom_resources.PhysicalResourceId.of(`${id}-AwsSdkCall-${physicalResIdHash}`)
    }
  
    const customResourceFnRole = new iam.Role(this, 'AwsCustomResourceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    })
    customResourceFnRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [`arn:aws:lambda:${stack.region}:${stack.account}:function:*-ResInit${stack.stackName}`],
        actions: ['lambda:InvokeFunction']
      })
    )
    this.customResource = new custom_resources.AwsCustomResource(this, 'AwsCustomResource', {
      policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE }),
      onUpdate: sdkCall,
      timeout: Duration.minutes(10),
      role: customResourceFnRole
    })

    this.response = this.customResource.getResponseField('Payload')

    this.function = fn
  }
}