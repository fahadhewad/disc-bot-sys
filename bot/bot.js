require('dotenv').config({ path: 'keys.env' });
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');

const botToken = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'counter') {
    await interaction.deferReply();
    const voteChannel = await client.channels.fetch('1177955946396393544');

    try {
      const response = await axios.get('http://localhost:3000/counter');
      await interaction.editReply(response.data);
    } catch (error) {
      console.error('Error contacting the server:', error);
      await interaction.editReply('Failed to contact the server.');
    }
    voteChannel.send("https://tenor.com/view/fnaf-gif-24419090")
  } else if (interaction.commandName === 'vote') {

    const voteChannel = await client.channels.fetch('1177955946396393544');
    const voteMessage = await voteChannel.send('React with 👍 to vote!');
    await voteMessage.react('👍');

    const filter = (reaction, user) => {
      return reaction.emoji.name === '👍' && !user.bot;
    };


    const collector = voteMessage.createReactionCollector({ filter, time: 15000 });

    collector.on('collect', (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });

    collector.on('end', async collected => {

      if (collected.first()?.count >= 3) {
        voteChannel.send('Vote passed!');
        try {
          const response = await axios.get('http://localhost:3000/increment');
          console.log('Server response:', response.data);
          voteChannel.send('Server notified successfully!');
        } catch (error) {
          console.error('Error contacting the server:', error);
          voteChannel.send('Vote passed, but failed to contact the server.');
        }
      } else {
        voteChannel.send('Vote did not pass.');
      }

      try {
        const response = await axios.get('http://localhost:3000/counter');
        const count = response.data
        voteChannel.send(count);
      } catch (error) {
        console.error('Error contacting the server:', error);
        voteChannel.send('Failed to contact the server.');
      }

    });

    await interaction.reply({ content: 'Vote started!', ephemeral: true });
  }
});

client.login(botToken);