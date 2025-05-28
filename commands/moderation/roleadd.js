const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'roleadd',
     description: 'Adds a role to a user (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageRoles,
  async execute(message, args) {
    const user = message.mentions.users.first();
    const role = message.mentions.roles.first();
    if (!user || !role) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Input')
            .setDescription('Please mention a user and a role.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const member = message.guild.members.cache.get(user.id);
    try {
      await member.roles.add(role);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Role Added')
        .setDescription(`Successfully added ${role} to ${user.tag}.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to add role. Please check my permissions or role hierarchy.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};