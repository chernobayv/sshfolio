#followed https://python.plainenglish.io/how-to-build-a-virtual-pet-in-python-like-a-tamagotchi-366b5343480a as the base, and added my own flair ontop of it!
import time
import os
import sys
import select
import msvcrt
import json
import pathlib

#diff colors im going to use
PINK  = "\033[38;5;213m"
CYAN  = "\033[38;5;117m"
RESET = "\033[0m"
BOLD  = "\033[1m"
CLEAR = "\033[2J\033[H" 

SOUL_FILE = pathlib.Path(__file__).parent / ".soul"

#different states of the cat
CAT_STATES = {
    "happy":  ("^ω^ ", "purr～"),
    "idle":   ("ﾟ､ ｡", "MEOW"),
    "sleepy": ("-､ . ", "z z z..."),
    "hungry": (">､ < ", "feed me～"),
    "sad":    ("T､ T ", "；～；"),
}

#draw the cat based on its current state
def draw_cat(state="idle"):
    eyes, bubble = CAT_STATES[state]
    print(f"  ／l、      {BOLD}{bubble}{RESET}")
    print(f"（{CYAN}{eyes}{RESET} ７")
    print(f"  l、~ヽ")
    print(f"  じしf_, )ノ")

#stats bar
def bar(val, width=10, reverse=False):
    filled = int((val/100)*width)
    if reverse:
        color = "\033[38;5;203m" if val > 60 else "\033[38;5;228m" if val > 30 else "\033[38;5;113m"
    else:
        color = "\033[38;5;113m" if val > 60 else "\033[38;5;228m" if val > 30 else "\033[38;5;203m"
    return color + "█" * filled + RESET + "░" * (width - filled)

#core pet values when opened
class Pet:
    #what the initial values of the pet are when the game is opened
    def __init__(self, name):
        self.name = name
        self.hunger = 30
        self.energy = 80
        self.happiness = 70
        self.alive = True
        self.age = 0
        self.last = time.time()
        self.hours_gone = 0
    
    #how the pet changes over time, and how it dies
    def tick(self):
        now = time.time()
        minutes = (now - self.last) / 60
        self.last = now

        self.hunger = min(100, self.hunger + 3 * minutes)
        self.happiness = max(0, self.happiness - 1.5 * minutes)
        self.energy = max(0, self.energy - 2 * minutes)
        self.age += minutes / 60

        if self.hunger >= 100 or self.energy <= 0:
            self.alive = False

    #how the user can interact with the pet
    def feed(self):
        self.hunger = max(0, self.hunger - 35)
        self.happiness = min(100, self.happiness + 5)
        return "nom nom nom"

    def play(self):
        if self.energy < 15:
            return "too sleepy to play..."
        self.happiness = min(100, self.happiness + 20)
        self.energy    = max(0,   self.energy    - 15)
        self.hunger    = min(100, self.hunger    + 8)
        return "yay!!"

    def sleep(self):
        self.energy    = min(100, self.energy    + 50)
        self.happiness = min(100, self.happiness + 5)
        return "zzz..."

    #
    def get_state(self):
        if self.energy < 20: return "sleepy"
        if self.hunger > 70: return "hungry"
        if self.happiness < 30: return "sad"
        if self.happiness > 65: return "happy"
        return "idle"

def save_soul(pet):
    if not pet.alive:
        try:
            SOULF_FILE.unlink()
        except FileNotFoundError:
            pass
        return
    with open(SOUL_FILE, "w") as f:
        json.dump({
            "name": pet.name,
            "age": pet.age,
            "hunger": pet.hunger,
            "energy": pet.energy,
            "happiness": pet.happiness,
            "last_seen": time.time(),
        }, f)

def load_soul():
    try: 
        with open(SOUL_FILE) as f:
            d = json.load(f)
        pet = Pet(d["name"])
        pet.hunger    = d["hunger"]
        pet.happiness = d["happiness"]
        pet.energy    = d["energy"]
        pet.age       = d["age"]

        hours_gone = (time.time() - d["last_seen"]) / 3600

        if hours_gone > 48:
            pet.alive      = False
            pet.hours_gone = hours_gone
        elif hours_gone > 24:
            pet.hunger     = 100
            pet.happiness  = max(0, pet.happiness - 40)
            pet.hours_gone = hours_gone
        else:
            minutes_gone  = hours_gone * 60
            pet.hunger    = min(100, pet.hunger    + 3   * minutes_gone)
            pet.happiness = max(0,   pet.happiness - 1.5 * minutes_gone)
            pet.hours_gone = hours_gone

        return pet
    except FileNotFoundError:
        return None

#when you start, what the hatch seq is like
def hatch_sequence(name):
    lines =[
        "  initialising soul kernel...",
        "  mapping ASCII genome...",
        f"  name hash: {hash(name) & 0xFFFF:04X}",
        "  hunger: nominal",
        "  happiness: nominal",
        "  EGG INTEGRITY: 100%",
        "  hatching...",
    ]
    print(CLEAR, end="", flush=True)
    for line in lines:
        print(line)
        time.sleep(0.35)

    frames=[
        "     ( )\n    (   )\n   (     )",
        "     ( )\n    ( ' )\n   (     )",
        "     ( )\n    (*'*)\n   ( /_\ )",
        "  ／l、\n（ﾟ､ ｡ ７\n  l、~ヽ\n  じしf_, )ノ",
    ]
    for frame in frames:
        print(CLEAR, end="")
        print("\n\n" + frame)
        time.sleep(0.7)
    print (f"\n  {name} has hatched! ♡\n")
    time.sleep(1.5)

#actually play the game!
def main():
    existing = load_soul()
    if existing:
        pet = existing
        if not pet.alive:
            print(CLEAR, end="", flush=True)
            draw_cat("sad")
            print(f"\n  {pet.name} waited {pet.hours_gone/24:.1f} days...")
            print(f"  they didn't make it...")
            print(f"  press n for a new life, or q to quit\n")
            while True:
                if msvcrt.kbhit():
                    key = msvcrt.getwche().strip().lower()
                    if key == "n":
                        print(CLEAR, end="", flush=True)
                        name = input("  name your new cat: ").strip() or "neko"
                        pet  = Pet(name)
                        hatch_sequence(name)
                        save_soul(pet)
                        break
                    elif key == "q":
                        print(f"\n  goodbye.\n")
                        sys.exit()
                time.sleep(0.05)
        elif pet.hours_gone > 1:
            print(CLEAR, end="", flush=True)
            draw_cat("hungry" if pet.hunger > 70 else "sad")
            print(f"\n  you were gone {pet.hours_gone:.1f} hours...")
            if pet.hours_gone > 24:
                print(f"  {pet.name} is sick. feed them now.")
            else:
                print(f"  {pet.name} missed you.")
            time.sleep(2)
    else:
        name = input("  name your cat: ").strip() or "neko"
        pet  = Pet(name)
        hatch_sequence(name)
        save_soul(pet)
    msg = ""

    while pet.alive:
        print(CLEAR, end="")

        pet.tick()
        save_soul(pet)
        state = pet.get_state()

        print(f"  ── {pet.name} ── age {pet.age:.1f}h ──\n")
        draw_cat(state)
        print()
        print(f"  hunger    [{bar(pet.hunger, reverse=True)}] {int(pet.hunger):3d}%")
        print(f"  happiness [{bar(pet.happiness)}] {int(pet.happiness):3d}%")
        print(f"  energy    [{bar(pet.energy)}] {int(pet.energy):3d}%")
        print()

        if msg:
            print(f"  → {msg}\n")

        print("  [f] feed   [p] play   [s] sleep   [q] quit")

        deadline = time.time() + 4
        cmd = ""
        while time.time() < deadline:
            if msvcrt.kbhit():
                cmd = msvcrt.getwche().strip().lower()
                break
            time.sleep(0.05)

        if cmd == "f": msg = pet.feed()
        elif cmd == "p": msg = pet.play()
        elif cmd == "s": msg = pet.sleep()
        elif cmd == "q": break
        else:            msg = ""

    if not pet.alive:
        print(CLEAR, end="")
        draw_cat("sad")
        print(f"\n  {pet.name} didn't make it... ")
        print(f"  they lived for {pet.age:.1f} hours.\n")
        print(f"  press n to start a new life, or q to quit\n")

        while True:
            if msvcrt.kbhit():
                key = msvcrt.getwche().strip().lower()
                if key == "n":
                    print(CLEAR, end="")
                    name = input("  name your new cat: ").strip() or "neko"
                    pet  = Pet(name)
                    hatch_sequence(name)
                    save_soul(pet)
                    main()   # restart
                    return
                elif key == "q":
                    print(f"\n  see you later!\n")
                    break
            time.sleep(0.05)

if __name__ == "__main__":
    main()

