//load fonts from figlet font lib, not needed atm
//const font = 'ANSI Shadow';
//figlet.defaults({fontPath: 'https://unpkg.com/figlet/fonts/'});
//figlet.preloadFonts([font], ready);

//title on page
//const greetings ='\n\n     ░█▀▀░█▀▀░█░█░█▀▀░█▀█░█░░░▀█▀░█▀█\n     ░▀▀█░▀▀█░█▀█░█▀▀░█░█░█░░░░█░░█░█\n     ░▀▀▀░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀      * a hack club round 2 project by victoria chernobay';
//const term = $('body').terminal(commands, {
 //   greetings
//});

//terminal commands
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

const commands = {
    help: function(){
        this.echo('Available commands: help, about, contact');
    }

};

const font = 'ANSI Shadow';

figlet.defaults({fontPath:'https://unpkg.com/figlet/fonts'});
figlet.preloadFonts([font], ready);

const term = $('body').terminal(commands, {
    greetings: false
});
term.pause();

function render(text){
    const cols = term.cols();
    const ascii = figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
    return trim(ascii);

}

function trim(str){
return str.replace(/[\n\s]+$/, '');

}

function ready(){
    term.echo(() => {
        const ascii = render(' sshfolio');
        return `\n\n${ascii}     * a hack club round 2 project by victoria chernobay\n \n \n> the internet is flooded with portfolios that all look the same, look vibecoded, or just have nothing to make them stand out. (zzz) \n> [[i;;]if you want to make something cool, (& earn a prize :> )] ditch the standard ui for a terminal-based site that feels like a real build! \n> type the command [[bu;;]interested] to find out how you can be a part of the next big thing. ☆ \n\n> or type [[bu;;]help] for a list of commands... you never know what you will find... \n`;
    }, {ansi: true}).resume();

}

