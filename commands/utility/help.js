const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'help',
    description: 'Displays a list of all available commands.',
  },
  async execute(message, args) {
    const { commands } = message.client;
    const moderationCommands = commands.filter((cmd) => cmd.data.name !== 'help' && cmd.data.description.includes('moderation'));
    const utilityCommands = commands.filter((cmd) => cmd.data.name === 'help' || !cmd.data.description.includes('moderation'));

    // Format command lists
    const formatCommandList = (cmdCollection) => cmdCollection
      .map((cmd) => {
        const perms = cmd.permissions ? ` (Requires: ${new PermissionsBitField(cmd.permissions).toArray().join(', ')})` : '';
        return `**${cmd.data.name}**: ${cmd.data.description}${perms}`;
      });

    const moderationList = formatCommandList(moderationCommands);
    const utilityList = formatCommandList(utilityCommands);

    // Split moderation commands if too long
    const maxFieldLength = 1024;
    const moderationFields = [];
    let currentField = '';
    let fieldIndex = 1;

    for (const command of moderationList) {
      const potentialField = currentField ? `${currentField}\n${command}` : command;
      if (potentialField.length <= maxFieldLength) {
        currentField = potentialField;
      } else {
        moderationFields.push({
          name: `Moderation Commands (Part ${fieldIndex})`,
          value: currentField || 'No commands available.',
          inline: false,
        });
        currentField = command;
        fieldIndex++;
      }
    }
    if (currentField) {
      moderationFields.push({
        name: `Moderation Commands (Part ${fieldIndex})`,
        value: currentField,
        inline: false,
      });
    }

    // Utility commands (usually shorter, but check anyway)
    const utilityField = {
      name: 'Utility Commands',
      value: utilityList.join('\n') || 'No utility commands available.',
      inline: false,
    };

    // Create embed
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('📖 Bot Command Help')
      .setDescription('Below is a list of all available commands, grouped by category.')
      .addFields([...moderationFields, utilityField])
      .setAuthor({ name: message.client.user.tag, iconURL: message.client.user.displayAvatarURL() })
      .setTimestamp()
      .setFooter({ text: 'Bot Management System | Use !command for more details' });

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending help embed:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to display help. Please try again.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};