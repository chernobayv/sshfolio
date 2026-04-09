#followed https://python.plainenglish.io/how-to-build-a-virtual-pet-in-python-like-a-tamagotchi-366b5343480a as the base, and added my own flair ontop of it!

#core pet values when opened
class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 50
        self.energy = 50
        self.happiness = 50

#how the user can interact with the pet
def feed(self):
    self.hunger = max(self.hunger - 20,0)
    print(f"{self.name} : nom nom nom")

def play(self):
    if self.energy >= 20:
        self.happiness = min(self.happiness +20, 100)
        self.energy -= 20
        print(f"{self.name} : yayy!!")
    else: 
        print(f"{self.name} : too sleepy to play...")

def sleep(self):
    self.energy = min(self.energy + 30, 100)
    self.hunger = min(self.hunger + 10, 100)
    print(f"{self.name} : zzz...")

#actually play the game!
def main():
    name = input("name your cat :  ")
    pet = Pet(name)
    msg = ""

    print("\nstarting... (press enter after each command)\n")

    while True:
        os.system("cls" if os.name == "nt" else "clear")

        