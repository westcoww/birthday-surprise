const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const belly = document.getElementById("belly");
const speech = document.getElementById("speech");
const catImage = document.getElementById("catImage");

const blushLeft = document.querySelector(".blush.left");
const blushRight = document.querySelector(".blush.right");

const fart = document.getElementById("fart");

const birthdayScreen =
document.getElementById("birthdayScreen");

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

            updateBlush();
            updateReaction();

        }

    }

    lastX = currentX;

});

function updateBlush() {

    let opacity = petCount / 32;

    if(opacity > 1){
        opacity = 1;
    }

    blushLeft.style.opacity = opacity;
    blushRight.style.opacity = opacity;

}

// 기존 showSuspiciousFace 함수를 덮어씌워 주세요.
function showSuspiciousFace(message) {
    catImage.src = "images/cat-sus.png";
    speech.textContent = message;
    
    // ★ 배경을 붉게 변경
    document.body.classList.add("bg-sus");

    setTimeout(() => {
        catImage.src = "images/cat-normal.png";
        speech.textContent = "";
        
        // ★ 1초 뒤에 원래 배경색으로 복구
        document.body.classList.remove("bg-sus");
    }, 1000);
}

// updateReaction 함수 안에서 32번 달성했을 때의 코드도 살짝 수정해 줍니다.
function updateReaction() {
    if (petCount === 7) {
        showSuspiciousFace("...");
    } else if (petCount === 15) {
        showSuspiciousFace("잠깐...");
    } else if (petCount === 25) {
        showSuspiciousFace("......");
    } else if (petCount === 32) {
        catImage.src = "images/cat-sus.png";
        speech.textContent = "뿌우우우우웅!!!!!!";
        
        // ★ 대망의 방귀 폭발 순간에도 배경을 붉게!
        document.body.classList.add("bg-sus");

        fartExplosion();

        setTimeout(() => {
            showBirthday();
        }, 5000);
    }
}

function fartExplosion(){

    fart.innerHTML = "";

    for(let i=0;i<10;i++){

        const gas=document.createElement("div");

        gas.className="gas";

        gas.style.left=(45+Math.random()*10)+"%";
        gas.style.top=(58+Math.random()*6)+"%";

        gas.style.animationDelay=(i*0.12)+"s";

        fart.appendChild(gas);

    }

}

function showBirthday() {
    // 1. 생일 화면을 먼저 띄워둠
    birthdayScreen.style.visibility = "visible";
    birthdayScreen.style.opacity = "1";

    const gases = document.querySelectorAll(".gas");
    
    gases.forEach((gas) => {
        const delay = Math.random() * 0.8;
        
        // ★ forwards를 both로 변경! 
        // (대기 시간 동안에도 하얗게 커져 있는 0% 상태를 꽉 유지하게 만듦)
        gas.style.animation = `evaporate 2s ease-in both ${delay}s`;
    });
}