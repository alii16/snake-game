const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Mendapatkan skor tinggi dari penyimpanan lokal
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Melewati nilai acak 1 - 30 sebagai posisi makanan
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Menghapus timer dan memuat ulang halaman saat game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    // Mengubah nilai kecepatan berdasarkan penekanan tombol
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key === " " || e.key === "Space") {
        // Menjeda game saat bilah spasi ditekan
        togglePause();
    }
}


// Memanggil changeDirection pada setiap klik tombol dan meneruskan nilai himpunan data utama sebagai objek
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Mendorong posisi makanan ke susunan tubuh ular
        score++; // Skor kenaikan sebesar 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Memperbarui posisi kepala ular berdasarkan kecepatan saat ini
    snakeX += velocityX;
    snakeY += velocityY;

    // Menggeser ke depan nilai-nilai elemen dalam tubuh ular satu per satu
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Mengatur elemen pertama tubuh ular ke posisi ular saat ini

    // Memeriksa apakah kepala ular keluar dari dinding, jika demikian mengatur gameOver ke true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Menambahkan div untuk setiap bagian tubuh ular
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Memeriksa apakah kepala ular mengenai tubuh, jika demikian atur gameOver ke true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);

let isPaused = false;

function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(setIntervalId); // Jeda permainan
        console.log("Game Paused");
    } else {
        setIntervalId = setInterval(initGame, 100); // Melanjutkan permainan
        console.log("Game Resumed");
    }
}

