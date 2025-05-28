const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
// ... (rest of the file remains unchanged)
   data: {
     name: 'mute',
     description: 'Mutes a user for a specified duration (moderation).',
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
            .setDescription('Please mention a user to mute.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const duration = parseInt(args[1]);
    if (isNaN(duration) || duration < 1) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Duration')
            .setDescription('Please provide a valid duration in minutes.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System | by Team Buff' }),
        ],
      });
    }

    const member = message.guild.members.cache.get(user.id);
    await member.timeout(duration * 60 * 1000);
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('User Muted')
      .setDescription(`${user.tag} has been muted for ${duration} minutes.`)
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | by Team Buff' });

    await message.channel.send({ embeds: [embed] });
  },
};