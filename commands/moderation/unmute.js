const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
// ... (rest of the file remains unchanged)
   data: {
     name: 'unmute',
     description: 'Unmutes a user (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ModerateMembers,
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid User')
            .setDescription('Please mention a user to unmute.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System | by Team Buff' }),
        ],
      });
    }

    const member = message.guild.members.cache.get(user.id);
    await member.timeout(null);
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('User Unmuted')
      .setDescription(`${user.tag} has been unmuted.`)
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};