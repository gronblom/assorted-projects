#!/usr/bin/env python3

from aws_cdk import core

from digital_signature_lambda.digital_signature_lambda_stack import DigitalSignatureLambdaStack


app = core.App()
DigitalSignatureLambdaStack(app, "digital-signature-lambda")

app.synth()
