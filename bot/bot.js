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
    await interaction.reply('Counter command invoked!');
  } else if (interaction.commandName === 'vote') {

    const voteChannel = await client.channels.fetch('1100368209858793574');
    const voteMessage = await voteChannel.send('React with 👍 to vote!');
    await voteMessage.react('👍');

    const filter = (reaction, user) => {
      return reaction.emoji.name === '👍' && !user.bot;
    };


    const collector = voteMessage.createReactionCollector({ filter, time: 15000 });

    collector.on('collect', (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });

    collector.on('end', collected => {

      console.log(collected);
      if (collected.first()?.count >= 1) {
        voteChannel.send('Vote passed!');
      } else {
        voteChannel.send('Vote did not pass.');
      }
    });

    await interaction.reply({ content: 'Vote started!', ephemeral: true });
  }
});

client.login(botToken);