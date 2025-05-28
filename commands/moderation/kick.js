const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'kick',
     description: 'Kicks a user from the server (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.KickMembers,
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid User')
            .setDescription('Please mention a user to kick.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System | by Team Buff' }),
        ],
      });
    }

    const member = message.guild.members.cache.get(user.id);
    const reason = args.slice(1).join(' ') || 'No reason provided';

    await member.kick(reason);
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('User Kicked')
      .setDescription(`${user.tag} has been kicked.\n**Reason:** ${reason}`)
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};