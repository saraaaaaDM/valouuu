const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const loseScreen = document.getElementById("loseScreen");

let score = 0;
let lives = 3;
const maxScore = 15;

let gameInterval;
let gameRunning = false;

/* Empêche le scroll sur mobile */
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

/* Mouvement du panier */
document.addEventListener("touchmove", e => {
  player.style.left = e.touches[0].clientX + "px";
});

/* Démarrage du jeu */
function startGame() {
  startScreen.classList.remove("active");
  gameRunning = true;
  gameInterval = setInterval(spawn, 850);
}

/* Génération des objets */
function spawn() {
  if (!gameRunning) return;

  const item = document.createElement("div");
  item.classList.add("fall");

  const rand = Math.random();
  if (rand < 0.6) {
    item.style.backgroundImage = "url('coeur.png')";
    item.dataset.type = "heart";
  } else {
    item.style.backgroundImage = "url('obstacle.png')";
    item.dataset.type = "obstacle";
  }

  item.style.left = Math.random() * (window.innerWidth - 60) + "px";
  item.style.top = "-60px";

  document.body.appendChild(item);

  const fall = setInterval(() => {
    if (!gameRunning) { clearInterval(fall); item.remove(); return; }

    item.style.top = (parseInt(item.style.top) + 6) + "px";

    const r1 = item.getBoundingClientRect();
    const r2 = player.getBoundingClientRect();

    // Collision
    if (r1.bottom >= r2.top && r1.left <= r2.right && r1.right >= r2.left) {
      if (item.dataset.type === "heart") {
        score++;
        scoreDisplay.textContent = "Cœurs : " + score;
        if (score >= 2) player.style.backgroundImage = "url('panier_plein.png')";
      } else {
        lives--;
        updateLives();
        if (lives <= 0) loseGame();
      }
      clearInterval(fall);
      item.remove();
    }

    // Objet sorti de l’écran
    if (parseInt(item.style.top) > window.innerHeight) {
      clearInterval(fall);
      item.remove();
    }

    // Vérification victoire
    if (score >= maxScore) endGame();

  }, 30);
}

/* Mise à jour des vies */
function updateLives() {
  livesDisplay.textContent = "Vies : " + "❤️".repeat(lives);
}

/* Victoire */
function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  document.getElementById("finalScore").textContent =
    "Score final : " + score + " cœurs attrapés ❤️";
  endScreen.classList.add("active");
}

/* Défaite */
function loseGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  loseScreen.classList.add("active");
}

/* Rejouer */
function restartGame() {
  score = 0;
  lives = 3;
  updateLives();
  scoreDisplay.textContent = "Cœurs : 0";
  player.style.backgroundImage = "url('panier_vide.png')";

  endScreen.classList.remove("active");
  loseScreen.classList.remove("active");

  gameRunning = true;
  gameInterval = setInterval(spawn, 850);
}