require("dotenv").config();

// Pour pouvoir deployers les commandes
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];

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
      commands.push(command.data.toJSON());
    } else {
      console.log(`Au moins un des deux attributs est manquant`);
    }
  }
}

// Initialise le module REST
const rest = new REST().setToken(BOT_TOKEN);

// Deployer les commandes
(async () => {
  try {
    console.log(`Début de rafraichissement des ${commands.length} commandes`);

    // On envoie le tableau command en json
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(`Fin de rafraichissement des ${data.length} commandes`);
  } catch (err) {
    console.error(err);
  }
})();
