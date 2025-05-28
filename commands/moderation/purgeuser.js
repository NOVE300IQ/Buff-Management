const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'purgeuser',
    description: 'Deletes messages from a specific user in the channel.',
  },
  permissions: PermissionsBitField.Flags.ManageMessages,
  async execute(message, args) {
    const user = message.mentions.users.first();
    const amount = parseInt(args[1]) || 100;
    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid User')
            .setDescription('Please mention a user to purge messages from.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Amount')
            .setDescription('Please provide a number between 1 and 100.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    try {
      const messages = await message.channel.messages.fetch({ limit: amount });
      const userMessages = messages.filter((msg) => msg.author.id === user.id);
      if (userMessages.size === 0) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF4500')
              .setTitle('No Messages Found')
              .setDescription(`No messages from ${user.tag} found in the last ${amount} messages.`)
              .setTimestamp()
              .setFooter({ text: 'Bot Management System' }),
          ],
        });
      }

      await message.channel.bulkDelete(userMessages);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Messages Purged')
        .setDescription(`Deleted ${userMessages.size} messages from ${user.tag}.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error purging messages:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to purge messages. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};