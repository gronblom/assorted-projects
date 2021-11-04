from aws_cdk import (
    aws_apigateway,
    aws_iam as iam,
    aws_lambda,
    core
)

from hit_counter import HitCounter


class DigitalSignatureLambdaStack(core.Stack):

    def __init__(self, scope: core.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Defines an AWS Lambda resource
        my_lambda = aws_lambda.Function(
            self, 'DigitalSignature',
            runtime=aws_lambda.Runtime.PYTHON_3_9,
            code=aws_lambda.Code.from_asset('lambda'),
            handler='digital_signature.handler',
        )

        hello_with_counter = HitCounter(
            self, 'DigitalSignatureHitCounter',
            downstream=my_lambda,
        )

        aws_apigateway.LambdaRestApi(
            self, 'Endpoint',
            handler=hello_with_counter._handler,
        )