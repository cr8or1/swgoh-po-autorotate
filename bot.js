// Init project
const http = require('http');
const express = require('express');
const Discord = require("discord.js");
const fs = require("fs");

const app = express();
const client = new Discord.Client();

// Channel discord id 1 (squad arena)

var writeChannelShard;
var writeChannelPest;
var messageShard;
var messagePest;

// Parse a JSON data file
const matesShardData = parseData(JSON.parse(fs.readFileSync("./po-shard-data.json", "utf8")));
const matesPestData = parseData(JSON.parse(fs.readFileSync("./po-pest-data.json", "utf8")));

// Keeping the project "alive"
app.get("/", (request, response) => {
    console.log(new Date().toISOString().replace("T", " ").substring(0, 19) + " Ping Received");
    main().catch(ex => console.error(ex.message));
    response.sendStatus(200);
});
app.listen(process.env.PORT || 8000);
setInterval(() => {
    http.get(process.env.url);
}, process.env.timePeriod);

// Initialize the bot
client.on("ready", async () => {
    client.user.setPresence({game: {name: "live payout countdowns", type: 0}});
    writeChannelShard = await client.channels.fetch(process.env.channelIdShard);
    writeChannelPest = await client.channels.fetch(process.env.channelIdPest);

    // Initial call
    await main();
});
client.login(process.env.botToken);

console.log("App restarted");
console.log(process.env.url);

async function main() {
    if (!messageShard) {
        messageShard = await initializeMessageObject(writeChannelShard);
    }
    if (!messagePest) {
        messagePest = await initializeMessageObject(writeChannelPest);
    }

    if (messageShard) {
        await sendToChannel(matesShardData, writeChannelShard, messageShard);
    } else {
        console.error("Shard message object not initialized");
    }

    if (messagePest) {
        await sendToChannel(matesPestData, writeChannelPest, messagePest);
    } else {
        console.error("Pest message object not initialized");
    }
}

// Below are the rest of the functions that make up the bot
async function sendToChannel(mates, writeChannel, message) {
    try {
        calculateSecondsUntilPayout(mates);
        await sendMessage(mates, message);
    } catch (err) {
        console.log(err);
    }
}

async function initializeMessageObject(writeChannel) {
    // fetch message, create a new one if necessary
    console.log('Start initializing message object');
    try {
        const messages = await writeChannel.messages.fetch();

        if (messages.array().length === 0) {
            return await writeChannel.send({embed: new Discord.MessageEmbed()});
        } else {
            if (messages.first().embeds.length === 0) {
                await messages.first().delete();
                return await writeChannel.send({embed: new Discord.MessageEmbed()});
            } else {
                return messages.first();
            }
        }
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        console.log('Finished initializing message object');
    }
}

function parseData(shardData) {
    const mates = [];

    for (let i in shardData) {
        const user = shardData[i];
        mates.push({
            name: user.Name,
            payout: parseInt(user.UTC.substr(0, 2) + user.UTC.substr(-2, user.UTC.length)),
            po: {
                hours: parseInt(user.UTC.substr(0, 2)),
                minutes: parseInt(user.UTC.substr(-2, user.UTC.length))
            },
            flag: user.Flag,
            swgoh: user.SWGOH,
            utc: user.UTC
        });
    }

    const matesByTime = {};
    for (let i in mates) {
        const mate = mates[i];
        if (!matesByTime[mate.payout]) {
            matesByTime[mate.payout] = {
                payout: mate.payout,
                mates: [],
                po: mate.po
            }
        }
        matesByTime[mate.payout].mates.push(mate);
    }
    return Object.values(matesByTime);
}

function calculateSecondsUntilPayout(mates) {
    const now = new Date();
    for (let i in mates) {
        const mate = mates[i];
        const p = new Date();
        p.setUTCHours(mate.po.hours, mate.po.minutes, 0, 0);
        if (p < now) p.setDate(p.getDate() + 1);
        mate.timeUntilPayout = p.getTime() - now.getTime();
        let dif = new Date(mate.timeUntilPayout);
        const round = dif.getTime() % 60000;
        if (round < 30000) {
            dif.setTime(dif.getTime() - round);
        } else {
            dif.setTime(dif.getTime() + 60000 - round);
        }
        mate.time = `${String(dif.getUTCHours()).padStart(2, '00')}:${String(dif.getUTCMinutes()).padStart(2, '00')}`;
    }

    mates.sort((a, b) => {
        return a.timeUntilPayout - b.timeUntilPayout;
    })
}

async function sendMessage(mates, message) {
    let embed = new Discord.MessageEmbed().setThumbnail(process.env.thumbnail);
    let desc = '**Time until next payout**:';
    for (let i in mates) {
        let fieldName = "\n" + "------------------" + "\n" + "PO in " + String(mates[i].time) + " - (UTC " + String(mates[i].po.hours).padStart(2, '00') + ":" + String(mates[i].po.minutes).padStart(2, '00') + "):";
        let fieldText = '';
        for (const mate of mates[i].mates) {
            fieldText += `${mate.flag} [${mate.name}](${mate.swgoh})\n`; // Discord automatically trims messages
        }
        embed.addField(fieldName, fieldText, true);
    }
    embed.setDescription(desc);
    embed.setFooter('Last refresh', process.env.thumbnail);
    embed.setTimestamp();
    await message.edit({embed});
    console.log('Message send');
}