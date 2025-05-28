const { EmbedBuilder } = require('discord.js');

module.exports = {
  // ... (rest of the file remains unchanged)
   data: {
     name: 'userinfo',
     description: 'Displays information about a user.',
   },
   // ... (rest of the file remains unchanged)
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('User Information')
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Username', value: user.tag, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
        { name: 'Roles', value: member.roles.cache.map((r) => r.name).join(', ') || 'None' },
      )
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};