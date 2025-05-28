const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'unlock',
     description: 'Unlocks a previously locked channel (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageChannels,
  async execute(message, args) {
    const channel = message.mentions.channels.first() || message.channel;
    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: null,
      });
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Channel Unlocked')
        .setDescription(`Successfully unlocked ${channel}. Users can now send messages.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to unlock the channel. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};