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

// ★ 모바일 터치 & 마우스 드래그 통합 함수 ★
function startDrag(e) {
    isDragging = true;
    // 터치면 첫 번째 손가락 위치, 마우스면 마우스 위치
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

    if (Math.abs(move) < 15) return; // 너무 조금 움직인 건 무시

    const currentDirection = move > 0 ? 1 : -1;

    if (lastDirection === 0) {
        lastDirection = currentDirection;
    } else if (currentDirection !== lastDirection) {
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
}

// 이벤트 리스너 연결 (PC 마우스 + 모바일 터치 모두 지원)
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
        
        // 더 이상 드래그 안 되게 막기
        belly.style.pointerEvents = "none";

        setTimeout(() => {
            fartExplosion();
        }, 250);

        setTimeout(() => {
            showBirthday();
        }, 4000);
    }
}

function fartExplosion() {
    fart.innerHTML = "";
    for(let i = 0; i < 10; i++) {
        const gas = document.createElement("div");
        gas.className = "gas";
        gas.style.left = (40 + Math.random() * 20) + "%";
        gas.style.top = (50 + Math.random() * 20) + "%";
        gas.style.animationDelay = (i * 0.1) + "s";
        fart.appendChild(gas);
    }
}

// 캐릭터 대사 매핑
const giftData = {
    "aura": "나 좀 그만 좋아해 ㅋㅋ",
    "minion": "야르~ 생일 축하해 ㅋㅋ",
    "minion2": "엄~ ㅋㅋ 생축",
    "minion3": "생일선물? 아뇨아뇨아뇨~",
    "pri": "ㅅㅊ",
    "wall-e": "ㅇㅣㅂㅡ... (ㅅㅊ)",
    "mario": "지금 뛰느라 생일축하 못해준다 ㅋㅋ"
};

// 캐릭터 클릭 이벤트
document.querySelectorAll(".gift-char").forEach(char => {
    char.addEventListener("click", function(e) {
        const charId = this.id; 
        if (giftData[charId]) {
            charBubble.textContent = giftData[charId];
            const rect = this.getBoundingClientRect();
            
            charBubble.style.left = (rect.left + rect.width / 2) + "px";
            charBubble.style.top = (rect.top - 15) + "px";
            
            charBubble.classList.remove("hidden");
            
            // 애니메이션 리셋
            charBubble.style.animation = 'none';
            void charBubble.offsetWidth; 
            charBubble.style.animation = null;

            clearTimeout(bubbleTimer);
            bubbleTimer = setTimeout(() => {
                charBubble.classList.add("hidden");
            }, 3500);

            clearTimeout(bubbleTimer);
            bubbleTimer = setTimeout(() => {
                charBubble.classList.add("hidden");
            }, 3500);

            if (charId === "mario") {
                setTimeout(() => {
                    this.classList.add("slide-away");
                }, 1000); 
            }

        }
    });
});

function showBirthday() {
    birthdayScreen.style.visibility = "visible";
    birthdayScreen.style.opacity = "1";
    birthdayScreen.style.pointerEvents = "auto"; 

    // 가스 걷히는 애니메이션
    const gases = document.querySelectorAll(".gas");
    gases.forEach((gas) => {
        const delay = Math.random() * 0.8;
        gas.style.animation = `evaporate 2s ease-in both ${delay}s`;
    });

    // 0.5초 뒤 야르 컨페티 와르르 쏟아지기!
    setTimeout(createConfetti, 500); 

    setTimeout(() => {
        gameDialog.classList.remove("hidden");
        typeWriter();
    }, 1500);

}

// ★ 야르 컨페티 생성 함수 (안정적으로 개선됨) ★
function createConfetti() {
    const words = ["야르", "야르~", "야르??", "야르!!!", "야르 ㅋㅋ", "야르..."];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.className = "yaru";
        confetti.textContent = words[Math.floor(Math.random() * words.length)];

        // 1. 랜덤 가로 위치
        confetti.style.left = Math.random() * 100 + "%";
        
        // 2. 랜덤 폰트 크기
        confetti.style.fontSize = (12 + Math.random() * 10) + "px";

        // 3. 흩어지는 효과를 위한 랜덤 X 이동값 (CSS 변수 활용)
        const xOffset = (Math.random() * 200 - 100) + "px";
        confetti.style.setProperty('--x-offset', xOffset);

        // 4. 떨어지는 속도와 딜레이를 랜덤으로 줘서 와르르 쏟아지게
        const duration = 3 + Math.random() * 3; // 3~6초 동안 떨어짐
        const delay = Math.random() * 2; // 최대 2초까지 딜레이
        confetti.style.animation = `yaruFall ${duration}s linear ${delay}s forwards`;

        confettiContainer.appendChild(confetti);
    }
}

// ==========================
// ★ 퀘스트 로직 & 대화창 제어 ★
// ==========================
let clickedCharacters = new Set(); // 클릭한 캐릭터들을 모아두는 주머니
let currentMsgIndex = 0;
let typingTimer;
let isTyping = false;

const gameDialog = document.getElementById("gameDialog");
const dialogText = document.getElementById("dialogText");
const dialogName = document.getElementById("dialogName");

// 직접 기획하신 명대사들!
const scriptMessages = [
    "야르 ㅋㅋ 생일축하해 떵미!",
    "오빠의 생일파티에 축하해주러 온 친구들을 모두 클릭해바 ㅋㅋ",
    "그리고 오빠가 제일 기다리던 선물 공개 시간이야...",
    "뭐일지 궁금하지 ㅋ",
    "궁금하면..... 노트북 밑을 확인해바ㅋ"
];

// 타이핑 효과 함수
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
            typingTimer = setTimeout(type, 50); // 타자 속도
        } else {
            isTyping = false;
        }
    }
    type();
}

// 팝업창 클릭 시 다음 대사로 넘어가기 이벤트
gameDialog.addEventListener("click", () => {
    // 1. 타이핑 중일 때 누르면 한 번에 다 보여주기
    if (isTyping) {
        clearTimeout(typingTimer);
        dialogText.innerHTML = scriptMessages[currentMsgIndex].replace(/\n/g, '<br>');
        isTyping = false;
        return;
    }

    // 2. "친구들 클릭해바" 상태일 때의 특별 퀘스트 로직
    if (currentMsgIndex === 1) {
        // 아직 7명 다 안 눌렀으면 안 넘어감! (힌트 줌)
        if (clickedCharacters.size < 7) {
            dialogName.textContent = "💖 시스템 (아직 안 누른 친구가 있어!)";
            dialogName.style.color = "#ff3333";
            setTimeout(() => { 
                dialogName.textContent = "💖 퀘스트 알림";
                dialogName.style.color = "#ffd54f"; 
            }, 1000);
        }
        return; 
    }

    // 3. 마지막 멘트면 더 이상 안 넘어감
    if (currentMsgIndex >= scriptMessages.length - 1) return;

    // 4. 문제 없으면 다음 대사로!
    currentMsgIndex++;
    showMessage(currentMsgIndex);
});

// 캐릭터 클릭 이벤트 (마리오 애니메이션 + 퀘스트 완료 로직 포함)
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

            // 마리오 퇴장 효과
            if (charId === "mario") {
                setTimeout(() => {
                    this.classList.add("slide-away");
                }, 1000); 
            }

            // ★ 캐릭터 클릭할 때마다 주머니에 이름 넣기
            clickedCharacters.add(charId);

            // "친구들 클릭해바" 대사(인덱스 1) 상태인데 7명을 다 눌렀다면?!
            if (currentMsgIndex === 1 && clickedCharacters.size === 7) {
                currentMsgIndex = 2; // 다음 대사("선물 공개 시간이야")로!
                
                // 마지막 말풍선 볼 시간 1.5초 정도 주고 팝업창 자동 변경
                setTimeout(() => {
                    showMessage(currentMsgIndex);
                }, 1500);
            }
        }
    });
});

// 시작 시점 제어 함수
function showBirthday() {
    birthdayScreen.style.visibility = "visible";
    birthdayScreen.style.opacity = "1";
    birthdayScreen.style.pointerEvents = "auto"; 

    const gases = document.querySelectorAll(".gas");
    gases.forEach((gas) => {
        const delay = Math.random() * 0.8;
        gas.style.animation = `evaporate 2s ease-in both ${delay}s`;
    });

    setTimeout(createConfetti, 500); 

    setTimeout(() => {
        showMessage(0);
    }, 6000); 
}