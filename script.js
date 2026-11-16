
// =========================
// CREATE TWINKLING STARS
// =========================

const stars = document.getElementById("stars");

if (stars) {
    for (let i = 0; i < 80; i++) {
        const star = document.createElement("span");

        star.className = "star";
        star.textContent = "✦";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";

        stars.appendChild(star);
    }
}


// =========================
// COUNTDOWN ELEMENTS
// =========================

const countdownScreen = document.getElementById("countdownScreen");
const welcomeScreen = document.getElementById("welcomeScreen");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const countdownAudio = document.getElementById("countdownAudio");

// TEMPORARY TEST: 60 SECONDS
// After testing, restore the actual birthday date below.
// NIMMIWON'S BIRTHDAY: 18 NOVEMBER 2026, 12:00 AM IST
const birthdayDate = new Date("2026-11-18T00:00:00+05:30").getTime();
// ACTUAL BIRTHDAY DATE:
// const birthdayDate = new Date("2026-11-18T00:00:00+05:30").getTime();

let countdownFinished = false;
let tickingStarted = false;
let audioPermissionUnlocked = false;


// =========================
// PREPARE COUNTDOWN AUDIO
// =========================

if (countdownAudio) {
    countdownAudio.loop = true;
    countdownAudio.preload = "auto";
    countdownAudio.volume = 1;
}

function startTickingSound() {
    if (
        tickingStarted ||
        !countdownAudio ||
        !audioPermissionUnlocked
    ) {
        return;
    }

    countdownAudio.currentTime = 0;
    countdownAudio.volume = 1;
    countdownAudio.muted = false;

    countdownAudio.play()
        .then(() => {
            tickingStarted = true;
            console.log("Ticking sound started!");
        })
        .catch(error => {
            console.log("Ticking sound error:", error);
        });
}


// Unlock audio after the user's first interaction
function unlockCountdownAudio() {
    if (!countdownAudio || audioPermissionUnlocked) return;

    countdownAudio.muted = true;

    countdownAudio.play()
        .then(() => {
            countdownAudio.pause();
            countdownAudio.currentTime = 0;
            countdownAudio.muted = false;

            audioPermissionUnlocked = true;

            console.log("Countdown audio unlocked!");

            // If already within the final 30 seconds, start now
            const remaining = birthdayDate - Date.now();

            if (remaining > 0 && remaining <= 30000) {
                startTickingSound();
            }
        })
        .catch(error => {
            countdownAudio.muted = false;
            console.log("Audio permission error:", error);
        });
}

document.addEventListener(
    "pointerdown",
    unlockCountdownAudio
);


// =========================
// FINISH COUNTDOWN
// =========================

function unlockBirthdayWebsite() {
    if (countdownFinished) return;

    countdownFinished = true;

    if (countdownAudio) {
        countdownAudio.pause();
        countdownAudio.currentTime = 0;
    }

    if (countdownScreen) {
        countdownScreen.classList.remove("last-ten");
        countdownScreen.classList.add("hidden");
    }

    if (welcomeScreen) {
        welcomeScreen.classList.add("unlocked");
    }
}


// =========================
// UPDATE COUNTDOWN
// =========================

function updateCountdown() {
    if (countdownFinished) return;

    const now = Date.now();
    const remaining = birthdayDate - now;

    if (remaining <= 0) {
        if (daysElement) daysElement.textContent = "00";
        if (hoursElement) hoursElement.textContent = "00";
        if (minutesElement) minutesElement.textContent = "00";
        if (secondsElement) secondsElement.textContent = "00";

        unlockBirthdayWebsite();
        return;
    }

    const totalSeconds = Math.ceil(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysElement) {
        daysElement.textContent = String(days).padStart(2, "0");
    }

    if (hoursElement) {
        hoursElement.textContent = String(hours).padStart(2, "0");
    }

    if (minutesElement) {
        minutesElement.textContent = String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    // START TICKING AT 30 SECONDS
    if (totalSeconds <= 30 && audioPermissionUnlocked) {
        startTickingSound();
    }

    // SHOW GIANT RED COUNTDOWN AT 10 SECONDS
    if (totalSeconds <= 10) {
        if (countdownScreen) {
            countdownScreen.classList.add("last-ten");
        }
    }
}


// Start countdown
updateCountdown();

const countdownInterval = setInterval(() => {
    updateCountdown();

    if (countdownFinished) {
        clearInterval(countdownInterval);
    }
}, 100);


// =========================
// GET BIRTHDAY PAGE ELEMENTS
// =========================

const birthdayMusic = document.getElementById("birthdayMusic");
const enterButton = document.getElementById("enterButton");
const birthdayWorld = document.getElementById("birthdayWorld");

const photoReveal = document.getElementById("photoReveal");
const deliveryScene = document.getElementById("deliveryScene");
const deliveryDog = document.getElementById("deliveryDog");
const deliveryMessage = document.getElementById("deliveryMessage");

const letterButton = document.getElementById("letterButton");
const letterContent = document.getElementById("letterContent");

const worldContent = birthdayWorld
    ? birthdayWorld.querySelector(".world-content")
    : null;

let deliveryStarted = false;
let letterOpened = false;
let hasEntered = false;


// =========================
// PREVENT RETURN TO HOME PAGE
// =========================

function preventHomeScroll() {
    if (!hasEntered || !birthdayWorld) return;

    const worldTop =
        birthdayWorld.getBoundingClientRect().top + window.scrollY;

    if (window.scrollY < worldTop) {
        window.scrollTo(0, worldTop);
    }
}


// =========================
// ENTER THE MAGICAL WORLD
// =========================

if (enterButton && birthdayWorld) {
    enterButton.addEventListener("click", () => {

        if (hasEntered) return;

        hasEntered = true;
        enterButton.disabled = true;

        if (welcomeScreen) {
            welcomeScreen.classList.add("hidden");
            welcomeScreen.style.display = "none";
        }

        // START BIRTHDAY MUSIC IMMEDIATELY
        if (birthdayMusic) {
            birthdayMusic.volume = 0.7;

            birthdayMusic.play().catch(error => {
                console.log("Birthday music could not start:", error);
            });
        }

        birthdayWorld.classList.add("active");

        if (photoReveal) {
            photoReveal.classList.add("show");
        }

        if (worldContent) {
            worldContent.style.display = "none";
        }

        requestAnimationFrame(() => {
            window.scrollTo(0, birthdayWorld.offsetTop);

            if (photoReveal) {
                photoReveal.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        // SHOW BIRTHDAY CONTENT AND START DOG DELIVERY
        setTimeout(() => {

            if (worldContent) {
                worldContent.style.display = "";

                worldContent.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            if (!deliveryStarted && deliveryScene) {
                deliveryStarted = true;

                if (deliveryMessage) {
                    deliveryMessage.textContent =
                        "Your little messenger is on the way! 💙";
                }

                setTimeout(() => {
                    deliveryScene.classList.add("start");
                }, 4000);
            }

        }, 5000);
    });
}

window.addEventListener("scroll", preventHomeScroll);


// =========================
// DOG LETTER DELIVERY
// =========================

if (deliveryDog) {
    deliveryDog.addEventListener("animationend", (event) => {

        if (
            event.animationName === "dogDelivery" &&
            deliveryScene
        ) {
            deliveryScene.classList.add("delivered");

            if (deliveryMessage) {
                deliveryMessage.textContent =
                    "Your special birthday letter has arrived! 💌";
            }

            setTimeout(() => {

                if (letterButton) {
                    letterButton.disabled = false;
                    letterButton.textContent = "Open Your Letter 💙";
                }

            }, 1200);
        }
    });
}


// =========================
// OPEN AND CLOSE BIRTHDAY LETTER
// =========================

if (letterButton && letterContent) {
    letterButton.addEventListener("click", () => {

        letterOpened = !letterOpened;

        if (letterOpened) {
            letterContent.classList.add("open");

            letterButton.textContent = "Close Your Letter 💌";

            letterContent.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } else {
            letterContent.classList.remove("open");

            letterButton.textContent = "Open Your Letter 💙";
        }
    });
}
