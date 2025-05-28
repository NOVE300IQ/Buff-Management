const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 data: {
     name: 'clear',
     description: 'Clears a specified number of messages (moderation).',
   },
  permissions: PermissionsBitField.Flags.ManageMessages,
  async execute(message, args) {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Input')
            .setDescription('Please provide a number between 1 and 100.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System | by Team Buff' }),
        ],
      });
    }

    await message.channel.bulkDelete(amount, true);
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('Messages Cleared')
      .setDescription(`Successfully deleted ${amount} messages.`)
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};