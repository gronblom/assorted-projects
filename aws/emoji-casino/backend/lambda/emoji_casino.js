var AWS = require('aws-sdk');

const uuid = require('uuid').v4;

exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const payload = JSON.parse(event.body);
    const dynamo = new AWS.DynamoDB();

    const randomUnicodeCodePoints = (n) => {
        return Array.from({ length: n }, () => Math.floor(127500 + Math.random() * 2400));

    }
    result = {};
    result.timestamp = (new Date()).toISOString();
    result.username = payload.username;
    result.betId = uuid();
    result.betCents = payload.betCents;
    const win = Math.floor(Math.random() * 100);
    let winFactor;
    if (win >= 99) {
        winFactor = 10000;
    } else if (win > 90) {
        winFactor = 500;
    } else if (win > 80) {
        winFactor = 100;
    } else {
        winFactor = 0;
    }
    result.winAmountCents = winFactor * payload.betCents;
    result.emojis = randomUnicodeCodePoints(payload.emojiNum);

    await dynamo.putItem({
        "TableName": process.env.TABLE_NAME,
        "Item": {
            "username":{
                "S": result.username
            },
            "betId": {
                "S": result.betId
            },
            "timestamp": {
                "S": result.timestamp
            },
            "betCents": {
                "N": `${result.betCents}`
            },
            "winAmountCents": {
                "N": `${result.winAmountCents}`
            }
        },
        
    }).promise();

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers' : 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify(result)
    };

}