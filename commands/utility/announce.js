const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  // ... (rest of the file remains unchanged)
   data: {
     name: 'announce',
     description: 'Sends an announcement to a specified channel.',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageMessages,
  async execute(message, args) {
    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Channel')
            .setDescription('Please mention a channel to send the announcement.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const announcement = args.slice(1).join(' ');
    if (!announcement) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Announcement')
            .setDescription('Please provide an announcement message.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    try {
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('📢 Announcement')
        .setDescription(announcement)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await channel.send({ embeds: [embed] });

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Announcement Sent')
        .setDescription(`Successfully sent announcement to ${channel}.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to send announcement. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};