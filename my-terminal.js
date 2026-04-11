//all the js and jquery for the terminal-based portfolio site! this is where the magic happens :>


// OLD title on page, b4 fonts were added
//const greetings ='\n\n     ░█▀▀░█▀▀░█░█░█▀▀░█▀█░█░░░▀█▀░█▀█\n     ░▀▀█░▀▀█░█▀█░█▀▀░█░█░█░░░░█░░█░█\n     ░▀▀▀░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀      * a hack club round 2 project by victoria chernobay';
//const term = $('body').terminal(commands, {
 //   greetings
//});

//all the js and jquery for the terminal-based portfolio site! this is where the magic happens :>

//terminal formatting throughout
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

//commands in the terminal
const commands = {
    help() {
        term.echo(`available commands: ${help} \n`);
    },
    echo(...args) {
        term.echo(args.join(" "));
    },
    hatch() {
        term.echo(`\n  opening hatch sequence...\n`);
        setTimeout(() => {
            Object.keys(directories).forEach(dir => {
                term.echo(`  [[bu;;]cd ${dir}]   — ${directories[dir].desc}`);
            });
            term.echo(`\n  [[bu;;]rainbow!] — ✦ secret command ✦\n`);
        }, 400);
    },
    cd(dir) {
        if (!dir) { term.echo(`  usage: cd [directory]\n`); return; }
        if (dir === '..') { term.echo(`\n  back to main. type [[bu;;]hatch] to explore again.\n`); return; }
        if (!directories[dir]) { term.echo(`  directory not found: ${dir}\n`); return; }
        if (dir === 'demo') { spawnDemoPopup(); return; }
        if (dir === 'prizes') {
            term.echo(directories[dir].content, {ansi: true});
            spawnConfetti();
            return;
        }
        term.echo(directories[dir].content, {ansi: true});
    },
    'rainbow'() {
        spawnRainbow();
    },
    demo() {
        spawnDemoPopup();
    }
}

//all the available directories in the terminal
const directories = {
    instructions: {
        desc: "how to build your termigotchi",
        content: `
┌─────────────────────────────────────┐
│         HOW TO BUILD                │
│          a termigotchi              │
└─────────────────────────────────────┘

  ／l、  your pet must follow these rules:
（>､ < ７
  l、~ヽ  ► under 10KB — extreme optimization
  じしf_,)ノ ► plain text only — no images, no emojis
           ► python standard library only
           ► persistence — lives when app is closed
           ► tamagotchi vibe — needs-based & playable

┌─ ASCII ART TIPS ────────────────────┐
│                                     │
│  ／l、  simple beats a jpeg.        │
│（ﾟ､ ｡７  use characters like:       │
│  l、~ヽ  ─ │ ┌ ┐ └ ┘ ▓ ░ ▄ ▀ █   │
│  じしf_,)ノ                          │
└─────────────────────────────────────┘

  type [[bu;;]cd ..] to go back ~
        `
    },
    prizes: {
        desc: "what you can win",
        content: `
┌─────────────────────────────────────┐
│              PRIZES                 │
│         what you can win            │
└─────────────────────────────────────┘

  ship your pet and you'll receive...

  ┌─ EVERY BUILDER ─────────────────┐
  │  ▓▓▓ blind box USB keychain ▓▓▓ │
  │      [ common / rare / 1-of-1 ] │
  └─────────────────────────────────┘

  ┌─ GRAND PRIZE ───────────────────┐
  │                                 │
  │   ┌───┐  most creative &        │
  │   │>ω<│  whimsical pet wins     │
  │   └───┘  a real tamagotchi!     │
  │                                 │
  │  (what's better than 2 pets ^.^)│
  └─────────────────────────────────┘

  type [[bu;;]cd ..] to go back ~
        `
    },
    about: {
        desc: "what is termigotchi",
        content: `
┌─────────────────────────────────────┐
│               ABOUT                 │
│           termigotchi               │
└─────────────────────────────────────┘

  a hack club YSWS for 50 teenagers.
  build a 10KB ASCII terminal pet.
  ship it. earn a prize.

  ┌─────────────────────────────────┐
  │  ／l、                           │
  │（ﾟ､ ｡７  terminals built         │
  │  l、~ヽ  the internet.           │
  │  じしf_,)ノ                       │
  │                                 │
  │  websites are just terminals    │
  │  that discovered CSS and        │
  │  never looked back.             │
  └─────────────────────────────────┘

  ► no frameworks. no shortcuts.
  ► just you, python, and the terminal.

  type [[bu;;]cd ..] to go back ~
        `
    },
    gallery: {
        desc: "submitted projects",
        content: `
┌─────────────────────────────────────┐
│             GALLERY                 │
│         submitted pets              │
└─────────────────────────────────────┘

  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░                                 ░
  ░   ／l、                          ░
  ░ （T､ T７  no pets yet...         ░
  ░   l、~ヽ  be the first to ship   ░
  ░   じしf_,)ノ                      ░
  ░                                 ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  submit → [[bu;;]cd demo] to see one live

  type [[bu;;]cd ..] to go back ~
        `
    },
    demo: {
        desc: "see a live termigotchi",
        content: null
    }
}

//confetti rain for the prizes command
function spawnConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;`;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const chars = [',',',',',','*','.','~','♡'];
    const colors = ['#ff6b9d','#c084fc','#60a5fa','#34d399','#fbbf24','#f87171'];
    const pieces = Array.from({length: 80}, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -200,
        vy: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        char: chars[Math.floor(Math.random()*chars.length)],
        color: colors[Math.floor(Math.random()*colors.length)],
        size: 12 + Math.random() * 10
    }));
    let frame = 0;
    const anim = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.vy; p.x += p.vx;
            if(p.y > canvas.height) { p.y = -10; p.x = Math.random()*canvas.width; }
            ctx.fillStyle = p.color;
            ctx.font = `${p.size}px monospace`;
            ctx.fillText(p.char, p.x, p.y);
        });
        if(++frame > 250) { clearInterval(anim); canvas.remove(); }
    }, 30);
}

//rainbow mode — cycles terminal text through colors for 5 seconds
function spawnRainbow() {
    const colors = ['#ff6b9d','#c084fc','#60a5fa','#34d399','#fbbf24','#f87171'];
    let i = 0;
    const targets = document.querySelectorAll('.terminal, .terminal span, .cmd');
    const interval = setInterval(() => {
        targets.forEach(el => { el.style.color = colors[i % colors.length]; });
        i++;
    }, 120);
    setTimeout(() => {
        clearInterval(interval);
        targets.forEach(el => { el.style.color = ''; });
    }, 5000);
}

//demo popup — circular tamagotchi frame with embedded replit
function spawnDemoPopup() {
    term.echo(`\n  loading demo...\n`);
    const overlay = document.createElement('div');
    overlay.id = 'tchi-overlay';
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;`;
    overlay.innerHTML = `
        <div style="position:relative;width:480px;height:480px;">
            <img src="YOUR_IMAGE_HERE.png" style="width:480px;height:480px;border-radius:50%;object-fit:cover;display:block;"/>
            <iframe src="YOUR_REPLIT_LINK_HERE" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:260px;border:none;border-radius:50%;overflow:hidden;"></iframe>
            <span onclick="document.getElementById('tchi-overlay').remove()" style="position:absolute;top:8px;right:8px;color:#fff;cursor:pointer;font-family:monospace;font-size:16px;">x</span>
        </div>
    `;
    overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

const command_list = Object.keys(commands);
const help = formatter.format(command_list);

//import fonts that will be used for ascii art
const font = 'ANSI Shadow';
figlet.defaults({fontPath:'https://unpkg.com/figlet/fonts'});
figlet.preloadFonts([font], ready);

//disable original greeting, set terminal options
const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    clear: false,
    completion: true
});
term.pause();

//renders ascii art using figlet
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

//when everything is loaded, display the greeting
function ready(){
    term.echo(() => {
        const ascii = render(' termigotchi');
        return `\n\n${ascii}     * a hack club round 2 project by victoria chernobay\n \n \n > love at first byte \n\n > most teens have never opened a terminal. (zzz) \n > [[i;;]termigotchi changes that, (& you earn a prize :> )] raise an ASCII cat, write real python, and master the command line without even realising it \n > type the command [[bu;;]hatch] to grow your own termigotchi. ☆ \n \n > or type [[bu;;]help] for a list of commands... your pet is waiting... \n`;
    }, {ansi: true}).resume();
}