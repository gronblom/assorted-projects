import json
import pytest

from aws_cdk import core
from digital_signature_lambda.digital_signature_lambda_stack import DigitalSignatureLambdaStack


def get_template():
    app = core.App()
    DigitalSignatureLambdaStack(app, "digital-signature-lambda")
    return json.dumps(app.synth().get_stack("digital-signature-lambda").template)


def test_sqs_queue_created():
    assert("AWS::SQS::Queue" in get_template())


def test_sns_topic_created():
    assert("AWS::SNS::Topic" in get_template())
