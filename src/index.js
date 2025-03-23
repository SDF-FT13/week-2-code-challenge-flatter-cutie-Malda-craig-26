// Your code here

document.addEventListener('DOMContentLoaded', () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const votesForm = document.getElementById("votes-form");
    let selectedCharacter = null;

    fetch('http://localhost:3000/characters')
    .then(response => response.json())
    .then(characters => {
        characters.forEach(character => {
            const span = document.createElement('span');
            span.textContent = character.name;
            span.addEventListener('click', () => displayCharacterDetails(character));
            characterBar.appendChild(span);
        });
    });

    votesForm.addEventListener('submit', event => {
        event.preventDefault();
        if (selectedCharacter) {
            fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({votes: selectedCharacter.votes + 1})
            })
            .then(response => response.json())
            .then(updatedCharacter => {
                selectedCharacter.votes = updatedCharacter.votes;
                document.getElementById('vote-count').textContent = updatedCharacter.votes;
            });
        }
    });
});

function displayCharacterDetails(character) {
    selectedCharacter = character;
    detailedInfo.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p id="vote-count">${character.votes}</p>
    `;
}
