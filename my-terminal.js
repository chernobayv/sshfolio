//all the js and jquery for the terminal-based portfolio site! this is where the magic happens :>


// OLD title on page, b4 fonts were added
//const greetings ='\n\n     ░█▀▀░█▀▀░█░█░█▀▀░█▀█░█░░░▀█▀░█▀█\n     ░▀▀█░▀▀█░█▀█░█▀▀░█░█░█░░░░█░░█░█\n     ░▀▀▀░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀      * a hack club round 2 project by victoria chernobay';
//const term = $('body').terminal(commands, {
 //   greetings
//});

//terminal formatting throughout
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

//commands in the terminal
const commands = {
    help(){
        term.echo(`List of available commands: ${help} \n`);
    },
    echo(...args){
        term.echo(args.join(" "));
    }

};


//all the available directories in the terminal, will be used for the "cd" command and to make it feel more like a real terminal
const directories = {
    //end of 04.08.2026 progress

}

const command_list = Object.keys(commands);
const help = formatter.format(command_list);

//import fonts that will be used for ascii art
const font = 'ANSI Shadow';
figlet.defaults({fontPath:'https://unpkg.com/figlet/fonts'});
figlet.preloadFonts([font], ready);

//disable original greeting
const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    clear: false,
    completion: true
});
term.pause();

//function that will render the ascii art
function render(text){
    const cols = term.cols();
    const ascii = figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
    return trim(ascii);

}

//remove extra whitespace from ascii art
function trim(str){
return str.replace(/[\n\s]+$/, '');

}

//when everything is loaded, this will be displayed
function ready(){
    term.echo(() => {
        const ascii = render(' termigotchi');
        return `\n\n${ascii}     * a hack club round 2 project by victoria chernobay\n \n \n > love at first byte \n\n > most teens have never opened a terminal. (zzz) \n > [[i;;]termigotchi changes that, (& you earn a prize :> )] raise an ASCII cat, write real python, and master the command line without even realising it \n > type the command [[bu;;]hatch] to grow your own termigotchi. ☆ \n \n > or type [[bu;;]help] for a list of commands... your pet is waiting... \n`;
    }, {ansi: true}).resume();

}

