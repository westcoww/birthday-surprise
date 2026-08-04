const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const belly = document.getElementById("belly");
const speech = document.getElementById("speech");
const catImage = document.getElementById("catImage");
const blushLeft = document.querySelector(".blush.left");
const blushRight = document.querySelector(".blush.right");
const fart = document.getElementById("fart");
const birthdayScreen = document.getElementById("birthdayScreen");
const confettiContainer = document.getElementById("confettiContainer");
const charBubble = document.getElementById("charBubble");

let petCount = 0;
let isDragging = false;
let lastX = 0;
let lastDirection = 0;
let halfStroke = 0;
let bubbleTimer;

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
});

// ★ 드래그 앤 터치 로직 (배 문지르기)
function startDrag(e) {
    isDragging = true;
    lastX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

function stopDrag() {
    isDragging = false;
    lastDirection = 0;
}

function doDrag(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const move = currentX - lastX;
    
    if (Math.abs(move) < 15) return; 

    const currentDirection = move > 0 ? 1 : -1;
    if (lastDirection === 0) {
        lastDirection = currentDirection;
    } else if (currentDirection !== lastDirection) {
        halfStroke++;
        lastDirection = currentDirection;
        
        if (halfStroke % 2 === 0) {
            petCount++;
            updateBlush();
            updateReaction();
        }
    }
    lastX = currentX;
}

belly.addEventListener("mousedown", startDrag);
belly.addEventListener("touchstart", startDrag, { passive: true });
window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);
belly.addEventListener("mousemove", doDrag);
belly.addEventListener("touchmove", doDrag, { passive: true });

function updateBlush() {
    let opacity = petCount / 32;
    if(opacity > 1) opacity = 1;
    blushLeft.style.opacity = opacity;
    blushRight.style.opacity = opacity;
}

function showSuspiciousFace(message) {
    catImage.src = "images/cat-sus.png";
    speech.textContent = message;
    document.body.classList.add("bg-sus");
    
    setTimeout(() => {
        catImage.src = "images/cat-normal.png";
        speech.textContent = "";
        document.body.classList.remove("bg-sus");
    }, 1000);
}

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
        document.body.classList.add("bg-sus");
        
        belly.style.pointerEvents = "none";

        setTimeout(() => {
            fartExplosion();
        }, 800);

        setTimeout(() => {
            showBirthday();
        }, 4000);
    }
}

// ★ 안개 & 지진 효과
function fartExplosion() {
    fart.innerHTML = "";
    
    document.body.classList.add("shake");
    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 800);

    const mist = document.createElement("div");
    mist.className = "fart-mist";
    fart.appendChild(mist);
}

// ==========================
// ★ 퀘스트 로직 & 대화창 제어 ★
// ==========================
let clickedCharacters = new Set(); 
let currentMsgIndex = 0;
let typingTimer;
let isTyping = false;

const gameDialog = document.getElementById("gameDialog");
const dialogText = document.getElementById("dialogText");
const dialogName = document.getElementById("dialogName");

const scriptMessages = [
    "야르 ㅋㅋ 생일축하해 떵미!",
    "오빠의 생일파티에 축하해주러 온 친구들을 모두 클릭해바 ㅋㅋ",
    "그리고 오빠가 제일 기다리던 선물 공개 시간이야...",
    "뭐일지 궁금하지 ㅋ",
    "궁금하면..... 노트북 밑을 확인해바ㅋ"
];

function showMessage(index) {
    gameDialog.classList.remove("hidden");
    dialogText.innerHTML = "";
    let text = scriptMessages[index];
    let i = 0;
    isTyping = true;
    clearTimeout(typingTimer);

    function type() {
        if (i < text.length) {
            dialogText.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            i++;
            typingTimer = setTimeout(type, 50); 
        } else {
            isTyping = false;
        }
    }
    type();
}

gameDialog.addEventListener("click", () => {
    if (isTyping) {
        clearTimeout(typingTimer);
        dialogText.innerHTML = scriptMessages[currentMsgIndex].replace(/\n/g, '<br>');
        isTyping = false;
        return;
    }

    if (currentMsgIndex === 1) {
        if (clickedCharacters.size < 8) {
            dialogName.textContent = "💖 시스템 (아직 안 누른 친구가 있어!)";
            dialogName.style.color = "#ff3333";
            setTimeout(() => { 
                dialogName.textContent = "💖 퀘스트 알림";
                dialogName.style.color = "#ffd54f"; 
            }, 1000);
        }
        return; 
    }

    if (currentMsgIndex >= scriptMessages.length - 1) return;

    currentMsgIndex++;
    showMessage(currentMsgIndex);
});

// ★ 캐릭터 대사 (마리오 포함!)
const giftData = {
    "aura": "나 좀 그만 좋아해 ㅋㅋ",
    "minion": "야르~ 생일 축하해 ㅋㅋ",
    "minion2": "엄~ ㅋㅋ 생축",
    "minion3": "생일선물? 아뇨아뇨아뇨~",
    "pri": "ㅅㅊ",
    "wall-e": "ㅇㅣㅂㅡ... (ㅅㅊ)",
    "mario": "지금 뛰어야돼서 생일축하 못해준다 ㅋㅋ",
    "princess": "앙! 오늘은 나의 날 ㅋㅋ 야르!"
};

document.querySelectorAll(".gift-char").forEach(char => {
    char.addEventListener("click", function(e) {
        const charId = this.id; 
        
        if (giftData[charId]) {
            charBubble.textContent = giftData[charId];
            
            const rect = this.getBoundingClientRect();
            charBubble.style.left = (rect.left + rect.width / 2) + "px";
            charBubble.style.top = (rect.top - 15) + "px";
            
            charBubble.classList.remove("hidden");
            
            charBubble.style.animation = 'none';
            void charBubble.offsetWidth; 
            charBubble.style.animation = null;

            clearTimeout(bubbleTimer);
            bubbleTimer = setTimeout(() => {
                charBubble.classList.add("hidden");
            }, 3500);

            // 마리오 미끄러짐 효과
            if (charId === "mario") {
                setTimeout(() => {
                    this.classList.add("slide-away");
                }, 1000); 
            }

            clickedCharacters.add(charId);

            if (currentMsgIndex === 1 && clickedCharacters.size === 8) {
                currentMsgIndex = 2; 
                setTimeout(() => {
                    showMessage(currentMsgIndex);
                }, 1500);
            }
        }
    });
});

// ★ 컨페티 효과
function createConfetti() {
    const words = ["야르", "야르~", "야르??", "야르!!!", "야르 ㅋㅋ", "야르..."];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.className = "yaru";
        confetti.textContent = words[Math.floor(Math.random() * words.length)];
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.fontSize = (12 + Math.random() * 10) + "px";
        const xOffset = (Math.random() * 200 - 100) + "px";
        confetti.style.setProperty('--x-offset', xOffset);
        
        const duration = 3 + Math.random() * 3; 
        const delay = Math.random() * 2; 
        confetti.style.animation = `yaruFall ${duration}s linear ${delay}s forwards`;
        
        confettiContainer.appendChild(confetti);
    }
}

// ★ 생일 파티 등장 (안개 증발 및 정리 완벽 해결)
function showBirthday() {
    birthdayScreen.style.visibility = "visible";
    birthdayScreen.style.opacity = "1";
    birthdayScreen.style.pointerEvents = "auto"; 

    const gases = document.querySelectorAll(".fart-mist");
    gases.forEach((gas) => {
        gas.classList.add("evaporate-mist");
    });

    setTimeout(() => {
        const fartContainer = document.getElementById("fart");
        if(fartContainer) fartContainer.innerHTML = ""; 
        document.getElementById("gameScreen").classList.add("hidden"); 
    }, 2000);

    setTimeout(createConfetti, 500); 

    setTimeout(() => {
        showMessage(0);
    }, 6000); 
}