const { EmbedBuilder } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'serverinfo',
     description: 'Displays information about the server.',
   },
   // ... (rest of the file remains unchanged)
  async execute(message) {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('Server Information')
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
        { name: 'Created On', value: guild.createdAt.toDateString(), inline: true },
        { name: 'Owner', value: (await guild.fetchOwner()).user.tag, inline: true },
        { name: 'Region', value: guild.preferredLocale, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};