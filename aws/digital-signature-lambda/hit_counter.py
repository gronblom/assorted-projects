from aws_cdk import (
    aws_lambda,
    aws_dynamodb ,
    core,
)

class HitCounter(core.Construct):

    @property
    def handler(self):
        return self._handler    

    def __init__(self, scope: core.Construct, id: str, downstream: aws_lambda.IFunction, **kwargs):
        super().__init__(scope, id, **kwargs)

        table = aws_dynamodb.Table(
            self, 'RequestNumbers',
            partition_key={'name': 'type', 'type': aws_dynamodb.AttributeType.STRING}
        )

        self._handler = aws_lambda.Function(
            self, 'HitCountHandler',
            runtime=aws_lambda.Runtime.PYTHON_3_9,
            handler='hit_count.handler',
            code=aws_lambda.Code.from_asset('lambda'),
            environment={
                'DOWNSTREAM_FUNCTION_NAME': downstream.function_name,
                'HITS_TABLE_NAME': table.table_name,
            }
        )
        table.grant_read_write_data(self.handler)
        downstream.grant_invoke(self.handler)