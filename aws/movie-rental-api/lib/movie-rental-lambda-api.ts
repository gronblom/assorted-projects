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
  RemovalPolicy,
  aws_apigateway as apigateway
} from 'aws-cdk-lib';
import { CdkResourceInitializer } from './resource-init'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { Construct } from 'constructs';

export class MovieRentalLambdaApi extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = ec2.Vpc.fromLookup(this, process.env.VPC_ID || "", { isDefault: false })
    new CfnOutput(this, "MyVpc", { value: vpc.vpcId });
    new CfnOutput(this, "MyVpc2", { value: vpc.vpcArn });


    const lambdaHandler = new lambda.Function(this, 'dbApiLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('./lib/lambda/dbApiLambda/function.zip'),
      handler: 'index.handleApiRequest',
      vpc: vpc,
      environment: {
        'DB_USER': process.env.DB_USER as string,
        'DB_HOST': process.env.DB_HOST as string,
        'DB_NAME': process.env.DB_NAME as string,
        'DB_PASSWORD': process.env.DB_PASSWORD as string,
        'DB_PORT': process.env.DB_PORT as string
        //'dbArn': process.env.DB_ARN || "",
        //'dbSecretArn': process.env.DB_SECRET_ARN || ""
      },
      timeout: Duration.seconds(5),
      allowPublicSubnet: true
    });

    new apigateway.LambdaRestApi(this, 'LambdaRestApi', {
      handler: lambdaHandler,
      proxy: true
    });
  }
}