const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'lock',
     description: 'Locks a channel to prevent users from sending messages (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageChannels,
  async execute(message, args) {
    const channel = message.mentions.channels.first() || message.channel;
    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Channel Locked')
        .setDescription(`Successfully locked ${channel}. Users can no longer send messages.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to lock the channel. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};