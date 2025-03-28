const characterBar = document.querySelector("#character-bar");
let currentCharacter = null;
const resetBtn = document.querySelector("#reset-btn");
console.log(resetBtn);

async function displayCharacters() {
  try {
    const response = await fetch("http://localhost:3000/characters");
    if (!response.ok) {
      throw new Error("Failed to fetch data!");
    }
    const data = await response.json();
    characterBar.innerHTML = "";

    data.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.textContent = character.name;

      characterSpan.addEventListener("click", () => {
        displayDetailedCharacter(character);
      });

      characterBar.appendChild(characterSpan);
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}
displayCharacters();

const detailedInfo = document.querySelector("#detailed-info");
const votesInput = document.querySelector("#vote-count");

function displayDetailedCharacter(character) {
  currentCharacter = character;

  const myName = document.querySelector("#name");
  const img = document.querySelector("#image");

  myName.textContent = character.name;
  img.src = character.image;
  votesInput.textContent = character.votes;
}

const form = document.querySelector("#votes-form");
const inputValue = document.querySelector("#votes");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const votesAdded = parseInt(inputValue.value, 10);
  console.log(votesAdded);

  if (currentCharacter) {
    if (!isNaN(votesAdded)) {
      currentCharacter.votes += votesAdded;

      fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          votes: currentCharacter.votes,
        }),
      })
        .then((response) => response.json())
        .then((updatedCharacter) => {
          console.log(updatedCharacter);
          const votesCount = document.querySelector("#vote-count");
          votesCount.textContent = updatedCharacter.votes;
        })
        .catch((error) => {
          console.error("Error updating votes", error);
        });

      form.reset();
    }
  }
});

resetBtn.addEventListener("click", () => {
  if (currentCharacter) {
    console.log(currentCharacter.votes);
    currentCharacter.votes = 0;
    votesInput.textContent = currentCharacter.votes;
    
    fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes: 0,
      }),
    })
    .then(response => response.json())
    .then(updatedCharacter => {
      console.log("Reset successful:", updatedCharacter);
    })
    .catch(error => {
      console.error("Error resetting votes", error);
    });
  }
});

const characterForm = document.querySelector("#character-form");
console.log(characterForm);

characterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("clicked");
  const nwName = document.querySelector("#new-name").value.trim();
  const nwImage = document.querySelector("#image-url").value.trim();
  console.log(nwName);
  
  if (nwName && nwImage) {
    const newCharacter = {
      name: nwName,  
      image: nwImage, 
      votes: 0,
    };
    console.log(newCharacter);

   
    fetch("http://localhost:3000/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    })
    .then(response => response.json())
    .then(createdCharacter => {
      console.log("Character created:", createdCharacter);
      const characterSpan = document.createElement("span");
      characterSpan.textContent = createdCharacter.name;
      characterSpan.addEventListener("click", () => {
        displayDetailedCharacter(createdCharacter);
      });
      characterBar.appendChild(characterSpan);
      
      characterForm.reset();
    })
    .catch(error => {
      console.error("Error creating character", error);
    });
  }
});