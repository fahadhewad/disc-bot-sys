require('dotenv').config({ path: 'keys.env' });
const { REST, Routes } = require('discord.js');

const botToken = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;


const commands = [
  {
    name: 'counter',
    description: 'Displays the amount of trolls',
  },
  {
    name: 'vote',
    description: 'Starts a vote to increment the counter',
  },
];

const rest = new REST({ version: '10' }).setToken(botToken);

async function registerCommands() {
    try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
    console.error(error);
    }
}

registerCommands();