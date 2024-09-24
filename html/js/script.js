let gameConfig;
let needleAngle = 0;
let targetAngle;
let targetSize;
let targetsHit = 0;
let timeRemaining;
let gameInterval;
let currentButton;
let secureID;

$(document).ready(() => {
    window.addEventListener('message', (event) => {
        const data = event.data;

        switch (data.action) {
            case 'startHack':
                startGame(data);
                break;
            case 'setDebug':
                debug = data.debug;
                break;
            default:
                console.log(`Unknown NUI action: ${action}`);
        }
    });

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // For testing in browser
    if (debug) {
        $('body').on('keypress', (e) => {
            if (e.key === 's') {
                startGame({
                    difficulty: 'testing'
                });
            }
        });
    }

    $('#hack-container, #hack-frame, #loading-screen, #ending-screen').hide();
});

function startGame(data) {
    data = data || {};
    data.difficulty = data.difficulty || 'medium';

    gameConfig = config[data.difficulty] || config.medium;
    gameConfig.targets = data.targets || gameConfig.targets;
    gameConfig.speed = data.speed || gameConfig.speed;
    gameConfig.totalTime = data.totalTime || gameConfig.totalTime;
    gameConfig.lossTime = data.lossTime || gameConfig.lossTime;
    secureID = data.id;

    timeRemaining = gameConfig.totalTime;
    targetsHit = 0;

    showHackFrame();
    showLoadingScreen();
}

function gameLoop() {
    needleAngle += gameConfig.speed;
    if (needleAngle >= 360) needleAngle -= 360;
    $('#needle').css('transform', `rotate(${needleAngle}deg)`);

    timeRemaining -= 0.016;
    updateTimerBar();

    if (timeRemaining <= 0) {
        endGame(false);
    }
}

function generateTarget() {
    targetAngle = Math.random() * 360;
    targetSize = gameConfig.minSize + Math.random() * (gameConfig.maxSize - gameConfig.minSize);

    $('#target-zone').css({
        width: `${targetSize * 2}px`,
        height: `${136}px`,
        transform: `rotate(${targetAngle}deg)`,
        top: '0',
        left: '50%',
        marginLeft: `-${targetSize}px`
    });

    currentButton = Math.random() < 0.5 ? 'lmb' : 'rmb';
    $('#key-image').attr('src', `images/${currentButton}.png`);

    if (debug) {
        console.log("New target generated:", {
            targetAngle: targetAngle,
            targetSize: targetSize,
            currentButton: currentButton
        });
    }
}

function handleMouseClick(e) {
    e.preventDefault();
    const isLeftClick = e.button === 0;
    const isRightClick = e.button === 2;

    if (debug) { console.log("Mouse button clicked:", e.button); }

    if (isLeftClick || isRightClick) {
        const hitTarget = isTargetHit(isLeftClick, needleAngle);

        if (debug) {
            console.log("Attempt result:", {
                buttonClicked: isLeftClick ? 'left' : 'right',
                needleAngle: needleAngle,
                targetAngle: targetAngle,
                targetSize: targetSize,
                hitTarget: hitTarget
            });
        }

        if (hitTarget) {
            targetsHit++;
            if (debug) { console.log("Target hit! Total targets hit:", targetsHit); }
            animateRings(true);
            $('#hitSound')[0].play();
            if (targetsHit >= gameConfig.targets) {
                endGame(true);
            } else {
                generateTarget();
            }
        } else {
            timeRemaining -= gameConfig.lossTime;
            updateTimerBar();
            animateRings(false);
            $('#missSound')[0].play();
            $('#time').addClass('flash-red');

            setTimeout(() => {
                $('#time').removeClass('flash-red');
            }, 500);

            if (debug) { console.log("Target missed. Time remaining:", timeRemaining); }
        }
    }
}

function isTargetHit(isLeftClick, needleAngleCheck) {
    const lowerBound = (targetAngle - targetSize / 2 + 360) % 360;
    const upperBound = (targetAngle + targetSize / 2) % 360;

    let inTargetZone;
    if (lowerBound < upperBound) {
        inTargetZone = needleAngleCheck >= lowerBound && needleAngleCheck <= upperBound;
    } else {
        inTargetZone = needleAngleCheck >= lowerBound || needleAngleCheck <= upperBound;
    }

    const correctButton = (currentButton === 'lmb' && isLeftClick) || (currentButton === 'rmb' && !isLeftClick);

    if (debug) {
        console.log("Target hit check:", {
            needleAngleCheck: needleAngleCheck,
            targetLowerBound: lowerBound,
            targetUpperBound: upperBound,
            inTargetZone: inTargetZone,
            correctButton: correctButton
        });
    }

    return inTargetZone && correctButton;
}

function updateTimerBar() {
    const secondsRemaining = timeRemaining;
    const percentage = (timeRemaining / gameConfig.totalTime) * 100;
    const seconds = secondsRemaining.toFixed(2).split('');

    $('#time').html(`${config.locale.timeRemaining}<span>${seconds.join('</span><span>')}</span> ${config.locale.seconds}`);
    $('#timer-bar').css('width', `${percentage}%`);

    if (debug) { console.log(`Updating timer bar: ${percentage.toFixed(2)}%`); }
}

function animateRings(success) {
    $('.outer-ring').removeClass('ring-animation');
    setTimeout(() => {
        $('.outer-ring').each((index, ring) => {
            setTimeout(() => {
                $(ring).addClass('ring-animation');
            }, index * 100);
        });
    }, 0);

    if (success) {
        $('.outer-ring').css('border-color', 'var(--primary-color)');
    } else {
        $('.outer-ring').css('border-color', 'var(--secondary-color)');
    }
}

function endGame(success) {
    clearInterval(gameInterval);
    $('body').off('mousedown', handleMouseClick);

    showEndingScreen(success);
}

function initializeGame() {
    updateTimerBar();
    generateTarget();
    gameInterval = setInterval(gameLoop, 16);

    $('body').on('mousedown', handleMouseClick);

    if (debug) {
        console.log("Game started with config:", gameConfig);
    }
}

function showLoadingScreen() {
    $('#loading-screen').show();

    let loadingTexts = [config.locale.analyzingEncryption, config.locale.loadingHack,];
    let currentTextIndex = 0;

    function updateLoadingText() {
        $('#loading-text').text(loadingTexts[currentTextIndex]);
        currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
    }

    function animateLoadingBar() {
        let progress = 0;
        let interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(revealHackScreen, 500);
            }
            $('#loading-bar').css('width', `${progress}%`);
        }, 200);
    }

    updateLoadingText();
    setInterval(updateLoadingText, 2000);
    animateLoadingBar();
}

function showEndingScreen(success) {
    $('#ending-screen').show().css('opacity', '1');

    if (success) {
        $('#ending-screen').addClass('success').removeClass('failure');
        $('#ending-text').text(config.locale.successfullyDecrypted);
        $('#successSound')[0].play();
    } else {
        $('#ending-screen').addClass('failure').removeClass('success');
        $('#ending-text').text(config.locale.decryptionFailed);
        $('#failureSound')[0].play();
    }

    setTimeout(() => {
        $('#ending-screen').css('opacity', '0');
        $('#hack-container').hide();
        $('#ending-screen').hide();
    }, 3000);

    $.post(`https://${GetParentResourceName()}/hackFinish`, JSON.stringify({ success: success, id: secureID }));
}

function showHackFrame() {
    $('#hack-container').show();
    $('#hack-frame').show();
    $('#loading-screen, #ending-screen').hide();
}

function revealHackScreen() {
    $('#split-top').css('transform', 'translateY(-100%)');
    $('#split-bottom').css('transform', 'translateY(100%)');
    setTimeout(() => {
        $('#loading-screen').hide();
        initializeGame();
    }, 500);
}