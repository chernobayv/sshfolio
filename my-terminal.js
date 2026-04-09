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
        term.echo(`List of available commands: ${help}`);
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
        return `\n\n${ascii}     * a hack club round 2 project by victoria chernobay\n \n \n> the internet is flooded with portfolios that all look the same, look vibecoded, or just have nothing to make them stand out. (zzz) \n> [[i;;]if you want to make something cool, (& earn a prize :> )] ditch the standard ui for a terminal-based site that feels like a real build! \n> type the command [[bu;;]interested] to find out how you can be a part of the next big thing. ☆ \n\n> or type [[bu;;]help] for a list of commands... you never know what you will find... \n`;
    }, {ansi: true}).resume();

}

