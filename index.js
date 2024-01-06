require("dotenv").config();
const { Client, Collection, Events, IntentsBitField } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
// require("./deployCommands.js");

// Intents are a set of permissions that allow the bot to access various events. Each intent is associated with a specific set of events
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.login(BOT_TOKEN);

client.on("ready", (c) => {
  console.log(`🤖 Bot ${c.user.tag} ready`);

  // Status du bot : dnd, idle, online, invisible, offline
  client.user.setPresence({
    activities: [{ name: "Devenir un vrai bot" }],
    // status: "dnd",
  });
});

client.on("messageCreate", (msg) => {
  if (msg.content.toLocaleLowerCase() === "hello" && !msg.author.bot) {
    msg.reply("Hello!");
  }
});

// message.channel.send("Hello!");

const hello = new Set(["hello", "bonjour", "salut", "hi"]);
client.on("messageCreate", (msg) => {
  const msgContent = msg.content.toLowerCase();

  if (hello.has(msgContent)) {
    msg.reply("Hello!");
  }
});

client.commands = new Collection();

// Chemin du dossier commands
const commandsPath = path.join(__dirname, "commands");

// On récup dossier commands
const commandsFolders = fs.readdirSync(commandsPath);

// On boucle sur chaque dossier
for (const folder of commandsFolders) {
  // On crée le chemin vers le dossier
  const folderPath = path.join(commandsPath, folder);
  // On récupère les fichiers.js du dossier
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    // On crée le chemin du fichier
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    // On vérifie si data & execute dans le fichier

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`Au moins un des deux attributs est manquant`);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  // Check si command '/'
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply({ content: "Secret Pong!", ephemeral: true });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Si on est pas sur une commande / on ne fait rien
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hello") {
    const name = interaction.user.username;
    await interaction.reply({ content: `Hello ${name}`, ephemeral: true });
  }
});
