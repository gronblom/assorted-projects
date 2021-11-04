import dataclasses
from dataclasses import dataclass
import datetime
import hashlib
import json


@dataclass(frozen=True)
class Signature:
    dataId: str
    firstHash: str
    keyId: str
    timestamp: str
    secondHash: str
    type: str="signature"


@dataclass(frozen=True)
class SignatureValidation:
    valid: bool
    type: str="signatureValidation"


@dataclass(frozen=True)
class SignatureRequest:
    data: str
    dataId: str
    type: str="signatureRequest"


@dataclass(frozen=True)
class SignatureValidationRequest:
    data: str
    signature: Signature
    type: str="signatureValidationRequest"


def handler(event, context):
    jsonRequest = json.dumps(event)
    print(f'request: {jsonRequest}')
    # TODO data validation

    # Hardcoded test key. Would need a centralized key storage service.
    key = 'abcdef0123456789'
    keyId = 'test_key_2021-11-04'

    requestType = event.get('type')
    if not requestType:
        return _errorResponse('Missing requestType')
    elif requestType == "signatureRequest":
        return _create_signature(event, key, keyId)
    elif requestType == "signatureValidationRequest":
        return _validate_signature(event, key, keyId)
    else:
        return _errorResponse('Invalid request type')


def _create_signature(event, key: str, keyId: str):
    timestamp = datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
    signature = _sign(event['data'], event['dataId'], key, keyId, timestamp)
    return _response(dataclasses.asdict(signature))


def _validate_signature(event, key: str, keyId: str):
        signatureToValidate = event['signature']
        if signatureToValidate['keyId'] == keyId:
            signature = _sign(event['data'], signatureToValidate['dataId'], key, keyId,
                signatureToValidate['timestamp'])
            valid = signatureToValidate['firstHash'] == signature.firstHash and \
                signatureToValidate['secondHash'] == signature.secondHash
            return _response({"valid": valid})

        else:
            return _errorResponse('KeyId not found')


def _sign(data: str, dataId: str, key: str, keyId: str, timestamp: str) -> Signature:
    blake2Hash = hashlib.blake2b(data.encode(), key=bytes.fromhex(key))
    firstHash = blake2Hash.hexdigest()
    blake2Hash.update(keyId.encode())
    blake2Hash.update(timestamp.encode())
    secondHash = blake2Hash.hexdigest()
    return Signature(dataId=dataId, firstHash=firstHash, keyId=keyId, timestamp=timestamp, secondHash=secondHash)


def _response(body: str):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': body
    }


def _errorResponse(errorMessage: str):
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': {'error': errorMessage}
    }   


timestamp = datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
print(dataclasses.asdict(_sign("nisse", "nummer1", 'abcdef0123456789', "nyckel1", timestamp)))
