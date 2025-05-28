const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'warn',
     description: 'Warns a user and logs the warning (moderation).',
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
            .setDescription('Please mention a user to warn.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const warningsFile = path.join(__dirname, '../../warnings.json');
    let warnings = {};

    try {
      // Load existing warnings
      try {
        const data = await fs.readFile(warningsFile, 'utf8');
        warnings = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }

      // Initialize user warnings if not exists
      if (!warnings[user.id]) warnings[user.id] = [];
      warnings[user.id].push({
        reason,
        moderator: message.author.tag,
        timestamp: new Date().toISOString(),
      });

      // Save warnings
      await fs.writeFile(warningsFile, JSON.stringify(warnings, null, 2));

      const embed = new EmbedBuilder()
        .setColor('#FF4500')
        .setTitle('User Warned')
        .setDescription(`${user.tag} has been warned.\n**Reason:** ${reason}`)
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error saving warning:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to warn user. Please try again.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};