import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigateway';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'EmojiCasinoBets', {
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: { name: 'username', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'betId', type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED 
    });

    const casinoLambda = new lambda.Function(this, 'CasinoLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'emoji_casino.handler'
    });
    casinoLambda.addEnvironment('TABLE_NAME', table.tableName);
    table.grantReadWriteData(casinoLambda);

    const gateway = new apigw.LambdaRestApi(
      this, 'Endpoint', {
      handler: casinoLambda,
      defaultCorsPreflightOptions: { allowOrigins: ["http://localhost:3000"] }
    });
  }
}
