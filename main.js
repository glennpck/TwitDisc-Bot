const Twitter = require('twitter-v2')
const Discord = require('discord.js');
const client = new Discord.Client({ intents: 2048 });

require('dotenv').config()

var twitter = new Twitter({
    // consumer_key: process.env.TWITTER_CONSUMER_KEY,
    // consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    // access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    // timeout_ms: 60*1000,
    // strictSSL: true,
    bearer_token:  process.env.BEARER_TOKEN,
})

async function sendMessage (tweet, client){
    console.log(tweet)
    const url = "https://twitter.com/user/status/" + tweet.id;
    try {
      const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
      channel.send(`${process.env.CHANNEL_MESSAGE} ${url}`)
    } catch (error) {
          console.error(error);
    }
}

async function listenForever(streamFactory, dataConsumer) {
    try {
        for await (const { data } of streamFactory()) {
            dataConsumer(data);
        }
        console.log('Stream disconnected healthily. Reconnecting.');
        listenForever(streamFactory, dataConsumer);
        } catch (error) {
        console.warn('Stream disconnected with error. Retrying.', error);
    }
}

async function setup () {
    const endpointParams = {
        'tweet.fields': [ 'author_id', 'conversation_id' ],
        'expansions': [ 'author_id', 'referenced_tweets.id' ],
        'media.fields': [ 'url' ]
    }
    try {
        console.log('Setting up Twitter...')
        const body = {
            "add": [
                {"value": "from" + process.env.TWITTER_USER_NAME, "tag": "from Me!!"}
            ]
        }
        const r = await twitter.post("tweets/search/stream/rules", body);
        console.log(r);
    } catch (err) {
        console.log(err)
    }

    listenForever(
        () => twitter.stream('tweets/search/stream', endpointParams),
        (data) => sendMessage(data, client)
    );
}

client.login(process.env.DISCORD_TOKEN);
client.once('ready', () => {
    setup()
})