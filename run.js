const commands = require('./src/commands/index.js');
const term = require('terminal-kit').terminal;
const package = require('./package.json');

const argv = process
  .argv
  .slice(2)
  .reduce((args, arg) => {
    const match = arg.match(/^\-\-([a-z\-_]+)=?(.*)$/i);
    if (match !== null) {
      const name = match[1].toLowerCase().replace(/\-([a-z])/ig, (original, match) => match.toUpperCase());
      const value = match[2].trim();
      args.parameters[name] = (value.length > 0 ? value : true);
    } else {
      args.commands.push(arg.toLowerCase());
    }
    return args;
  }, { commands: [], parameters: {} })
;

const commandsAvailable = Object
  .keys(commands)
  .filter((command) => !commands[command].private)
  .sort()
;
 
const command = (argv.commands.length && commandsAvailable.includes(argv.commands[0]) && commands[argv.commands[0]]); 

if (Object.keys(argv.parameters).includes('help') || argv.commands.length <= 0 || argv.commands.length > 1 || !command) {
  term(`Usage : ${package.name} `).brightWhite('<command>').green(' --parameters-a --parameters-b')(`
  If one parameter is ommited the shell will became interactive
  ^g --non-interactive Disable y/n interactions \n\n`);

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