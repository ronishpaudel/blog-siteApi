const fs = require("fs");
const { exec } = require("child_process");

// Specify the path to the directory
const directoryPath = "prisma/migrations";

// Read the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.log("Error reading directory:", err);
    return;
  }

  // Filter out directories
  const directories = files.filter(file => {
    return fs.statSync(`${directoryPath}/${file}`).isDirectory();
  });

  const r = directories.sort((a, b) => {
    return b.localeCompare(a);
  });
  const migrateCommand = `turso db shell my-blogsite-db < ./prisma/migrations/${r[0]}/migration.sql`;
  console.log("Running...\n", migrateCommand, "\n");

  // Execute the command
  exec(migrateCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the command: ${error}`);
      return;
    }

    // Print the output
    console.log(`Command output:\n${stdout}`);
  });
});
