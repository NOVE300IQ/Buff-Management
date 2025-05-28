const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'slowmode',
     description: 'Sets slowmode for a channel in seconds (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageChannels,
  async execute(message, args) {
    const duration = parseInt(args[0]);
    const channel = message.mentions.channels.first() || message.channel;
    if (isNaN(duration) || duration < 0 || duration > 21600) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Duration')
            .setDescription('Please provide a duration between 0 and 21600 seconds.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    try {
      await channel.setRateLimitPerUser(duration);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Slowmode Set')
        .setDescription(`Slowmode set to ${duration} seconds in ${channel}.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to set slowmode. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};