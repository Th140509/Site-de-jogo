const BOARD_SIZE = 5;
const NUM_TERRITORIES = BOARD_SIZE * BOARD_SIZE;
const territories = [];
let currentPlayer = 1;
let selectedTerritory = null;
let gameOver = false;

function initializeBoard() {
    for (let i = 0; i < NUM_TERRITORIES; i++) {
        const owner = i < NUM_TERRITORIES / 2 ? 1 : 2;
        territories.push({
            id: i,
            owner: owner,
            troops: 3
        });
    }
    shuffleTerritories();
    renderBoard();
    updateTurnInfo();
}

function shuffleTerritories() {
    for (let i = territories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [territories[i], territories[j]] = [territories[j], territories[i]];
    }
}

function renderBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    territories.forEach((territory, index) => {
        const cell = document.createElement("div");
        cell.className = `territory player${territory.owner}`;
        cell.dataset.id = territory.id;
        cell.innerHTML = `
            <strong>${territory.troops}</strong><br>
            <small>Jogador ${territory.owner}</small>
        `;
        cell.onclick = () => handleTerritoryClick(index);
        board.appendChild(cell);
    });
}

function updateTurnInfo() {
    const info = document.getElementById("turn-info");
    if (gameOver) {
        info.innerText = `Jogador ${currentPlayer} venceu a partida!`;
    } else {
        info.innerText = `🎖️ Vez do Jogador ${currentPlayer}`;
    }
}

function handleTerritoryClick(index) {
    const clicked = territories[index];

    if (gameOver) return;

    if (clicked.owner === currentPlayer) {
        selectedTerritory = index;
        showAction(`Território ${index} selecionado`);
    } else if (selectedTerritory !== null) {
        attackTerritory(selectedTerritory, index);
    }
}

function attackTerritory(fromIndex, toIndex) {
    const attacker = territories[fromIndex];
    const defender = territories[toIndex];

    if (attacker.owner === defender.owner) {
        showAction("Você não pode atacar seus próprios territórios.");
        return;
    }

    if (attacker.troops <= 1) {
        showAction("Você precisa de mais de 1 tropa para atacar.");
        return;
    }

    const success = Math.random() < 0.6; // 60% chance de sucesso
    if (success) {
        showAction(`Ataque bem-sucedido! Jogador ${attacker.owner} conquistou o território ${toIndex}.`);
        defender.owner = attacker.owner;
        defender.troops = attacker.troops - 1;
        attacker.troops = 1;
    } else {
        showAction("Ataque falhou! Tropas perdidas.");
        attacker.troops--;
    }

    selectedTerritory = null;
    renderBoard();
    checkWinCondition();
}

function checkWinCondition() {
    const ownerSet = new Set(territories.map(t => t.owner));
    if (ownerSet.size === 1) {
        gameOver = true;
    }
    updateTurnInfo();
}

function showAction(message) {
    document.getElementById("action-panel").innerText = message;
}

document.getElementById("end-turn").onclick = () => {
    if (gameOver) return;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    selectedTerritory = null;
    updateTurnInfo();
    showAction(`Jogador ${currentPlayer}, é sua vez.`);
};

initializeBoard();
