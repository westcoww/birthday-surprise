const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const belly = document.getElementById("belly");
const speech = document.getElementById("speech");

let petCount = 0;
let isDragging = false;

let lastX = 0;
let lastDirection = 0;
let halfStroke = 0;

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
});

belly.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
});

window.addEventListener("mouseup", () => {

    isDragging = false;

    lastDirection = 0;

});

belly.addEventListener("mousemove", (e) => {

    if (!isDragging) return;

    const currentX = e.clientX;
    const move = currentX - lastX;

    // 너무 조금 움직인 건 무시
    if (Math.abs(move) < 15) return;

    // 방향 계산
    const currentDirection = move > 0 ? 1 : -1;

    // 처음 움직였을 때
    if (lastDirection === 0) {
        lastDirection = currentDirection;
    }

    // 방향이 바뀌면
    else if (currentDirection !== lastDirection) {

        halfStroke++;

        lastDirection = currentDirection;

        // 왕복 1번 = 1회
        if (halfStroke % 2 === 0) {

            petCount++;

            updateReaction();

        }

    }

    lastX = currentX;

});

function updateReaction() {

    if (petCount === 7) {
        speech.textContent = "...";
    }

    else if (petCount === 15) {
        speech.textContent = "잠깐...";
    }

    else if (petCount === 25) {
        speech.textContent = "......";
    }

    else if (petCount === 32) {
        speech.textContent = "💨 푸우우우우우웅!!!!";
    }

}