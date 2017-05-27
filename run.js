const commands = require('./src/commands/index.js');
const term = require('terminal-kit').terminal;
const package = require('./package.json');

const argv = process
  .argv
  .slice(2)
  .reduce((args, arg) => {
    const match = arg.match(/^\-\-([a-z\-_]+)=?(.*)$/i);
    if (match !== null) {
      args.parameters[match[1].toLowerCase()] = match[2];
    } else {
      args.commands.push(arg.toLowerCase());
    }
    return args;
  }, { commands: [], parameters: {} })
;

const commandsAvailable = Object
  .keys(commands)
  .filter((command) => !commands[command].private)
;
 
const command = (argv.commands.length && commandsAvailable.includes(argv.commands[0]) && commands[argv.commands[0]]); 

if (Object.keys(argv.parameters).includes('help') || argv.commands.length <= 0 || argv.commands.length > 1 || !command) {
  term(`Usage : ${package.name} `).brightWhite('<command>').green(' --parameters-a --parameters-b\n\n');

  if (command && command.help) {
    command.help();
  } else {
    term('Commands list : \n\n');
    commandsAvailable
      .forEach((command) => {
        if (commands[command].help) {
          commands[command].help();
        }
      })
    ;
  }

  process.exit(0);
}

command(argv.parameters)
  .catch((e) => {
    term.red(e.message)('\n');
  })
  .then(() => process.exit(0))
;