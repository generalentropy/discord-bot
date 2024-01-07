const { SlashCommandBuilder } = require("discord.js");

// Logique  de la commande
async function responseHello(interaction) {
  // Implémentez ici la logique complexe
  const result = "test de réponse";
  return result;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Répond avec hello!"),
  async execute(interaction) {
    await interaction.reply("Hello!");
  },
};
