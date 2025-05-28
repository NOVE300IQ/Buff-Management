const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  // ... (rest of the file remains unchanged)
   data: {
     name: 'warnings',
     description: 'Displays a user’s warning history (moderation).',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ModerateMembers,
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const warningsFile = path.join(__dirname, '../../warnings.json');
    let warnings = {};

    try {
      // Load warnings
      try {
        const data = await fs.readFile(warningsFile, 'utf8');
        warnings = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }

      const userWarnings = warnings[user.id] || [];
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`${user.tag}'s Warnings`)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });

      if (userWarnings.length === 0) {
        embed.setDescription('No warnings found for this user.');
      } else {
        const warningList = userWarnings
          .map((w, i) => `**${i + 1}.** ${w.reason} (By ${w.moderator} on ${new Date(w.timestamp).toDateString()})`)
          .join('\n');
        embed.setDescription(warningList);
      }

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching warnings:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to fetch warnings. Please try again.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};