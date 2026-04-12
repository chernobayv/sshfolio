//all the js and jquery for the terminal-based portfolio site! this is where the magic happens :>

//terminal formatting throughout
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

//track menu state
let menuActive = false;
let menuIndex = 0;
const menuItems = ['instructions', 'prizes', 'about', 'gallery', 'demo'];

//commands in the terminal
const commands = {
    help() {
        term.echo(`
  ┌─────────────────────────────────────┐
  │            available commands       │
  └─────────────────────────────────────┘
  [[bu;;]hatch]       — open the main menu
  [[bu;;]cd [dir]]    — enter a directory
  [[bu;;]cd ..]       — go back to menu
  [[bu;;]clear]       — clear the screen
  [[bu;;]rainbow]     — psst try it out
  [[bu;;]demo]        — see a live termigotchi
\n`);
    },
    hatch() {
        spawnMenu();
    },
    cd(dir) {
        if (!dir) { term.echo(`  usage: cd [directory]\n`); return; }
        if (dir === '..') { spawnMenu(); return; }
        if (!directories[dir]) { term.echo(`  directory not found: ${dir}\n`); return; }
        if (dir === 'demo') { spawnDemoPopup(); return; }
        if (dir === 'prizes') { renderPage('prizes'); spawnConfetti(); return; }
        renderPage(dir);
    },
    clear() {
        term.clear();
        renderTitle();
    },
    rainbow() {
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
        `
    },
    demo: {
        desc: "see a live termigotchi",
        content: null
    }
}

//renders a page then shows the back prompt
function renderPage(dir) {
    menuActive = false;
    term.freeze(false);
    term.clear();
    renderTitle();
    term.echo(directories[dir].content, {ansi: true});
    term.echo(`\n  press [[bu;;]backspace] to go back\n`);

    function goBack(e) {
        if (e.key === 'Enter' || e.key === 'Backspace') {
            document.removeEventListener('keydown', goBack);
            spawnMenu();
        }
    }
    setTimeout(() => document.addEventListener('keydown', goBack), 300);
}

//renders just the ascii title
function renderTitle() {
    const ascii = render(' termigotchi');
    term.echo(`\n\n${ascii}     * a hack club round 2 project by victoria chernobay\n`);
}

//main navigable menu
function spawnMenu() {
    menuActive = true;
    menuIndex = 0;
    term.freeze(true);
    renderMenu();
}

function renderMenu() {
    term.clear();
    renderTitle();

    let output = `
  ／l、  use ↑ ↓ to move, enter to select
（ﾟ､ ｡７  or just click/type any option
  l、~ヽ
  じしf_,)ノ

  ∧,,,∧
(  ̳• · • ̳)
/    づ♡ explore!
  ┌───────────────────────────────────────────────┐\n`;

    menuItems.forEach((dir, i) => {
        const selected = i === menuIndex;
        const arrow = selected ? '[[b;#c084fc;]  >]' : '   ';
        const name  = selected
            ? `[[b;#c084fc;] ${dir}]`
            : `[[bu;;] ${dir}]`;
        output += `  │ ${arrow} ${name} — ${directories[dir].desc}\n`;
    });

    output += `  └───────────────────────────────────────────────┘\n`;
    output += `\n  ✦ psst try typing [[bu;;]rainbow]\n`;

    term.echo(output, {ansi: true});
}

//keyboard navigation for menu
document.addEventListener('keydown', (e) => {
    if (!menuActive) return;
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
        renderMenu();
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        menuIndex = (menuIndex + 1) % menuItems.length;
        renderMenu();
    }
    if (e.key === 'Enter') {
        menuActive = false;
        term.freeze(false);
        const selected = menuItems[menuIndex];
        if (selected === 'demo') { spawnDemoPopup(); return; }
        if (selected === 'prizes') { renderPage(selected); spawnConfetti(); return; }
        renderPage(selected);
    }
});

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
            if (p.y > canvas.height) { p.y = -10; p.x = Math.random()*canvas.width; }
            ctx.fillStyle = p.color;
            ctx.font = `${p.size}px monospace`;
            ctx.fillText(p.char, p.x, p.y);
        });
        if (++frame > 250) { clearInterval(anim); canvas.remove(); }
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
            <iframe src="https://feline-thankful-tasks--vickach.replit.app" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:260px;border:none;border-radius:0%;overflow:hidden;"></iframe>
            <span onclick="document.getElementById('tchi-overlay').remove()" style="position:absolute;top:8px;right:8px;color:#fff;cursor:pointer;font-family:monospace;font-size:16px;">x</span>
        </div>
    `;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

//fixed bottom hint bar — plain terminal text no colors
const hintBar = document.createElement('div');
hintBar.style.cssText = `position:fixed;bottom:0;left:0;width:100%;background:#0a0a0a;border-top:1px solid #333;padding:6px 16px;font-family:monospace;font-size:12px;color:#888;z-index:9998;box-sizing:border-box;`;
hintBar.innerHTML = `↑ ↓ navigate &nbsp;│&nbsp; enter select &nbsp;│&nbsp; backspace go back &nbsp;│&nbsp; hatch main menu`;
document.body.appendChild(hintBar);

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
    completion: true,
    fontSize: 16
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

//when everything is loaded, display greeting and wait for enter
function ready(){
    term.resume();

    //mobile warning
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        term.clear();
        term.echo(`\n  ／l、  hey! termigotchi is best on a laptop.\n（>､ < ７  the terminal needs a real keyboard :>\n  l、~ヽ  come back on desktop!\n  じしf_,)ノ\n`);
        return;
    }

    //show title and greeting
    term.clear();
    renderTitle();
    term.echo(`\n  > love at first byte\n  > most teens have never opened a terminal. termigotchi changes that.\n  > raise an ASCII cat, write real python, earn a prize :>\n\n  [[b;#c084fc;]  press enter to start ↓]\n`);

    //freeze terminal so keypresses dont register as commands
    term.freeze(true);

    //wait for enter then launch menu
    $(document).one('keydown', function(e) {
        if (e.key === 'Enter') {
            term.freeze(false);
            spawnMenu();
        }
    });
}