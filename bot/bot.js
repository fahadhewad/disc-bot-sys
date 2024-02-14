require('dotenv').config({ path: 'keys.env' });
const { Client, GatewayIntentBits } = require('discord.js');

const botToken = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'counter') {
    await interaction.reply('Counter command invoked! ');
  }

  else if (interaction.commandName === 'vote') {
    await interaction.reply('Vote command invoked! (logic not implemented)');
  }
});


client.login(botToken);