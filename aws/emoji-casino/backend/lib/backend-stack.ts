import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const casino_lambda = new lambda.Function(this, 'CasinoLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'emoji_casino.handler'
    });

    const gateway = new apigw.LambdaRestApi(
      this, 'Endpoint', {
      handler: casino_lambda,
      defaultCorsPreflightOptions: { allowOrigins: ["http://localhost:3000"]}
    });
  }
}
