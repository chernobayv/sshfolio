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
(  ̳• · • ̳)
/    づ♡ explore!
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

//demo popup — simple box with replit embed, press q to close
function spawnDemoPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'tchi-overlay';
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;`;
    overlay.innerHTML = `
        <div style="position:relative;width:480px;height:520px;border:1px solid #444;background:#0a0a0a;">
            <div style="background:#1a1a1a;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;">
                <span style="color:#888;font-size:12px;font-family:monospace;">termigotchi — demo</span>
                <span style="color:#555;font-size:11px;font-family:monospace;">[ q ] close</span>
                <span onclick="document.getElementById('tchi-overlay').remove()" style="color:#888;cursor:pointer;font-family:monospace;font-size:14px;">✕</span>
            </div>
            <iframe src="https://feline-thankful-tasks--vickach.replit.app" style="width:100%;height:calc(100% - 32px);border:none;display:block;"></iframe>
        </div>
    `;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    function qClose(e) {
        if (e.key === 'q' || e.key === 'Q') {
            const ol = document.getElementById('tchi-overlay');
            if (ol) { ol.remove(); }
            document.removeEventListener('keydown', qClose);
        }
    }
    document.addEventListener('keydown', qClose);
}

//fixed bottom hint bar
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

//hatching intro sequence — egg wiggles, cracks, pet emerges, then launches menu
function playIntro(callback) {
    term.freeze(true);
    term.clear();

    const frames = [
        // egg sitting still
        `\n\n\n\n\n\n
        ╭───╮
       │     │
        ╰───╯

        ...`,

        // wiggle left
        `\n\n\n\n\n\n
       ╭───╮
      │     │
       ╰───╯

        ..?`,

        // wiggle right
        `\n\n\n\n\n\n
         ╭───╮
        │     │
         ╰───╯

        ..!`,

        // wiggle left harder
        `\n\n\n\n\n\n
      ╭───╮
     │     │
      ╰───╯

        !!`,

        // first crack
        `\n\n\n\n\n\n
        ╭─/─╮
       │  /  │
        ╰───╯

        *crack*`,

        // bigger crack
        `\n\n\n\n\n\n
        ╭─/─╮
       │ /// │
        ╰─/─╯

        *CRACK*`,

        // shell splits
        `\n\n\n\n\n\n
       ╭╮   ╭╮
      ╰╯   ╰╯
      ／l、
    （･ω･７

        !!!`,

        // pet fully out
        `\n\n\n\n\n
  ／l、
（ﾟ､ ｡７
  l、~ヽ
  じしf_,)ノ

  *hatched!*`,

        // pet says hi
        `\n\n\n\n\n
  ／l、
（ﾟ､ ｡７  hello!! :>
  l、~ヽ
  じしf_,)ノ

  welcome to termigotchi ♡`,
    ];

    const delays = [700, 350, 350, 300, 500, 400, 450, 700, 1400];
    let i = 0;

    function showFrame() {
        term.clear();
        term.echo(frames[i]);
        i++;
        if (i < frames.length) {
            setTimeout(showFrame, delays[i - 1]);
        } else {
            setTimeout(callback, 900);
        }
    }

    showFrame();
}

//when everything is loaded, play intro then launch menu directly
function ready(){
    term.resume();

    //mobile warning
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        term.clear();
        term.echo(`\n  ／l、  hey! termigotchi is best on a laptop.\n（>､ < ７  the terminal needs a real keyboard :>\n  l、~ヽ  come back on desktop!\n  じしf_,)ノ\n`);
        return;
    }

    term.clear();
    playIntro(() => {
        term.freeze(false);
        spawnMenu();
    });
}