
exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const payload = JSON.parse(event.body);

    result = {};
    const randomUnicodeCodePoints = (n) => {
        return Array.from({ length: n }, () => Math.floor(127500 + Math.random() * 2400));

    }
    result.timestamp = (new Date()).toISOString();
    result.username = payload.username;
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