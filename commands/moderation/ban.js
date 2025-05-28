const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'ban',
    description: 'Bans a user from the server.',
  },
  permissions: PermissionsBitField.Flags.BanMembers,
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid User')
            .setDescription('Please mention a user to ban.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System | by Team Buff' }),
        ],
      });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await message.guild.members.ban(user, { reason });
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('User Banned')
      .setDescription(`${user.tag} has been banned.\n**Reason:** ${reason}`)
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};