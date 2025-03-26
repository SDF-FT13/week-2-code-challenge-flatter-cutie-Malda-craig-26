// Your code here

document.addEventListener('DOMContentLoaded', () => {
    const detailedName = document.getElementById("name");
    const detailedImage = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetBtn = document.getElementById("reset-btn");
    const characterBar = document.getElementById("character-bar");

function fetchCharacters() {
    fetch('http://localhost:3000/characters')
    .then(response => response.json())
    .then(characters => {
        characterBar.innerHTML = "";
        characters.forEach(character => {
            const span = document.createElement('span');
            span.className = "character";
            span.textContent = character.name;
            span.setAttribute("data-id", character.id);
            span.setAttribute("data-image", character.image);
            span.addEventListener('click', () => displayCharacterDetails(character));
            characterBar.appendChild(span);
        }
            });
            })
            .catch(err => console.error("Error loading characters:", err));
        

    
    fetchCharacters();


function displayCharacterDetails(character) {
    const selectedCharacter = character;
    detailedName.textContent = character.name;
    detailedImage.src = character.image;
    detailedImage.alt = character.name;
    voteCount.textContent = character.votes;

    votesForm.onsubmit = (e) => {
        e.preventDefault();
        const votesToAdd = parseInt(document.getElementById("votes").value) || 0;
        selectedCharacter.votes += votesToAdd;
        voteCount.textContent = selectedCharacter.votes;

        fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: selectedCharacter.votes })
        });
        votesForm.reset();
    };

    resetBtn.onclick = () => {
        selectedCharacter.votes = 0;
        voteCount.textContent = selectedCharacter.votes;

        fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        });
    };
}

const characterForm = document.getElementById("character-form");

characterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = document.getElementById("name").value.trim();
    const newImage = document.getElementById("image-url").value.trim();

    if (newName && newImage) {
        const newCharacter = {
            name: newName,
            image: newImage,
            votes: 0,
        };
        characterVotes.textContent = selectedCharacter.votes;
        voteInput.value = "";
    }
});
