const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
 // ... (rest of the file remains unchanged)
   data: {
     name: 'poll',
     description: 'Creates a poll with up to 5 options.',
   },
   // ... (rest of the file remains unchanged)
  permissions: PermissionsBitField.Flags.ManageMessages,
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Input')
            .setDescription('Usage: !poll "Question" "Option1" "Option2" ... (up to 5 options)')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    const question = args[0].replace(/"/g, '');
    const options = args.slice(1).map((opt) => opt.replace(/"/g, '')).slice(0, 5);
    if (options.length < 2) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Invalid Options')
            .setDescription('Please provide at least two options.')
            .setTimestamp()
            .setFooter({ text: 'Bot Management System' }),
        ],
      });
    }

    try {
      const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].slice(0, options.length);
      const description = options
        .map((opt, i) => `${emojis[i]} ${opt}`)
        .join('\n');
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('📊 Poll: ' + question)
        .setDescription(description)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });

      const pollMessage = await message.channel.send({ embeds: [embed] });
      for (const emoji of emojis) {
        await pollMessage.react(emoji);
      }

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Poll Created')
        .setDescription('Poll has been created successfully!')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error('Error creating poll:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Failed to create poll. Please check my permissions.')
        .setTimestamp()
        .setFooter({ text: 'Bot Management System' });
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};