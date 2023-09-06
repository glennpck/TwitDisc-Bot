const { Client, WebhookClient } = require('discord.js');
const async = require('async');
let tweets={},apiurls=[],N=[];


require('dotenv').config();

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });


client.login(process.env.DISCORDJS_BOT_TOKEN);