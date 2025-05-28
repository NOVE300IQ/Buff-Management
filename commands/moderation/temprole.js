const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'purgeuser',
     description: 'Deletes messages from a specific user in the channel (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageRoles,
  async execute(message, args) {
    const user = message.mentions.users.first();
    const role = message.mentions.roles.first();
    const duration = parseInt(args[2]);
    if (!user || !role || isNaN(duration) || duration < 1) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Input')
            .setDescription('Usage: !temprole @user @role <minutes>')
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
        .setTitle('Temporary Role Assigned')
        .setDescription(`Assigned ${role} to ${user.tag} for ${duration} minutes.`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });

      // Remove role after duration
      setTimeout(async () => {
        try {
          await member.roles.remove(role);
          const followupEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Temporary Role Removed')
            .setDescription(`Removed ${role} from ${user.tag} after ${duration} minutes.`)
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' });
          await message.channel.send({ embeds: [followupEmbed] });
        } catch (error) {
          console.error('Error removing temporary role:', error);
        }
      }, duration * 60 * 1000);
    } catch (error) {
      console.error('Error assigning temporary role:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to assign role. Please check my permissions or role hierarchy.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};