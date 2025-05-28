const { EmbedBuilder, PermissionsBitField, ActivityType } = require('discord.js');

module.exports = {
  // ... (rest of the file remains unchanged)
   data: {
     name: 'status',
     description: 'Checks or sets the bot’s status.',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.Administrator,
  async execute(message, args) {
    if (!args.length) {
      // Display current status
      const currentActivity = message.client.user.presence.activities[0];
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('Current Bot Status')
        .setDescription(
          currentActivity
            ? `**Type**: ${currentActivity.type}\n**Name**: ${currentActivity.name}`
            : 'No status set.'
        )
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      return message.channel.send({ embeds: [embed] });
    }

    // Set new status
    const typeInput = args[0].toUpperCase();
    const name = args.slice(1).join(' ');
    if (!name) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Input')
            .setDescription('Please provide a status message.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const validTypes = {
      PLAYING: ActivityType.Playing,
      WATCHING: ActivityType.Watching,
      LISTENING: ActivityType.Listening,
      COMPETING: ActivityType.Competing,
      STREAMING: ActivityType.Streaming,
    };

    const activityType = validTypes[typeInput];
    if (!activityType) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Type')
            .setDescription('Valid types: PLAYING, WATCHING, LISTENING, COMPETING, STREAMING')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    try {
      await message.client.user.setActivity(name, { type: activityType });
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Status Updated')
        .setDescription(`Set status to: **${typeInput}** ${name}`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System | by Team Buff' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error setting manual status:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to set status. Please try again.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System | by Team Buff' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};