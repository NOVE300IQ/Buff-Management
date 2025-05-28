const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionsBitField, ActivityType } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();
const prefix = '!';
const statusMessages = [
  { type: ActivityType.Playing, name: 'Managing the server' },
  { type: ActivityType.Watching, name: 'over users' },
  { type: ActivityType.Listening, name: 'Commands' },
  { type: ActivityType.Competing, name: 'in moderation tasks' },
  
];

// Load commands
async function loadCommands() {
  try {
    const commandFolders = await fs.readdir(path.join(__dirname, 'commands'));
    for (const folder of commandFolders) {
      const commandFiles = await fs.readdir(path.join(__dirname, 'commands', folder));
      for (const file of commandFiles) {
        if (file.endsWith('.js')) {
          const command = require(path.join(__dirname, 'commands', folder, file));
          client.commands.set(command.data.name, command);
          console.log(`Loaded command: ${command.data.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
}

// Rotate status
async function rotateStatus() {
  try {
    const status = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    await client.user.setActivity(status.name, { type: status.type });
    console.log(`Updated status to: ${status.type} ${status.name}`);
  } catch (error) {
    console.error('Error setting status:', error);
  }
}

// Error embed
function createErrorEmbed(errorMessage) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Error')
    .setDescription(errorMessage)
    .setTimestamp()
    .setFooter({ text: 'Bot Management System | by Team Buff' });
}

// Success embed
function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Bot Management System' });
}

// Client ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await loadCommands();
  await rotateStatus();
  setInterval(async () => await rotateStatus(), 30000); // Rotate status every 30 seconds
});

// Message event
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  // Permission check
  if (command.permissions && !message.member.permissions.has(command.permissions)) {
    return message.reply({
      embeds: [createErrorEmbed('You do not have permission to use this command!')],
    });
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`Error executing ${commandName}:`, error);
    message.reply({
      embeds: [createErrorEmbed('An error occurred while executing the command.')],
    });
  }
});

// Login
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error('Failed to login:', error);
});

// Error handling
client.on('error', (error) => console.error('Client error:', error));
process.on('unhandledRejection', (error) => console.error('Unhandled promise rejection:', error));