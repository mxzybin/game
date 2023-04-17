export default function initGame() {
    const start = document.getElementById('start-button');

    const buttonUp = document.getElementById('direction-up'),
        buttonDown = document.getElementById('direction-down'),
        buttonLeft = document.getElementById('direction-left'),
        buttonRight = document.getElementById('direction-right');

    const screen = document.getElementById('screen'),
        ship = document.getElementById('ship'),
        shipHeight = ship.clientHeight,
        shipWidth = ship.clientWidth;
    
    const numberOfPixelsToMove = 80;
    
    const scoreContainer = document.getElementById('score');

    let barrierMoveInterval, barrierCreateInterval;

    let counter = 0;
    
    const barriers = [
        {
            className: 'tie',
            image: 'images/tie.png',
            name: 'TIE FIGHTER',
        },{
            className: 'asteroid-small',
            image: 'images/asteroid-1.png',
            name: 'Asteroid',
        },{
            className: 'asteroid-fire',
            image: 'images/asteroid-2.png',
            name: 'Asteroid',
        },{
            className: 'asteroid-fire-blue',
            image: 'images/asteroid-3.png',
            name: 'Asteroid',
        },{
            className: 'tomato',
            image: 'images/tomato.png',
            name: 'Tomato',
        },{
            className: 'potato',
            image: 'images/potato.png',
            name: 'Potato',
        },
    ];

    const maxRandomValue = barriers.length;

    let isGameGoing = false,
        isGameOver = false;


    function gameCenter() {
        if (isGameOver) {
            clearInterval(barrierMoveInterval);
            clearInterval(barrierCreateInterval);

            endGame();
        }

        if (!isGameGoing) {
            isGameGoing = true;
            gameProcess();
        }
    }

    start.addEventListener('click', gameCenter);

    function endGame() {
        document.querySelector('.game-popup').classList.add('show');
        document.querySelector('.score-result').innerHTML = counter;

        function tryAgain() {
            counter = 0;
            scoreContainer.innerHTML = 0;
            isGameGoing = false;
            isGameOver = false;
            screen.innerHTML = '';
            ship.style.top = 'auto';
            ship.style.bottom = '10px';
            ship.style.left = '152px';
            screen.insertAdjacentElement('afterBegin', ship);

            document.querySelector('.game-popup').classList.remove('show');
        }

        document.querySelector('.try-again').addEventListener('click', tryAgain);
    }

    function gameProcess() {
        if (isGameOver) return

        barrierMoveInterval = setInterval(moveBarrier, 10);
        barrierCreateInterval = setInterval(createNewBarrier, 1200);

        function updateCounter() {
            counter++
            scoreContainer.innerHTML = counter;
        }
    
        function createNewBarrier() {
            const randomBarrier = barriers[Math.floor(Math.random() * maxRandomValue)],
                el = document.createElement('div');
            
            el.classList.add(randomBarrier.className);
            el.classList.add('barrier');
    
            el.innerHTML = `<img src="${randomBarrier.image}" alt="${randomBarrier.name}">`;
            screen.insertAdjacentElement('afterBegin', el);
    
            const randomPosition = Math.floor(Math.random() * (screen.clientWidth - el.clientWidth));
    
            el.style.left = `${randomPosition}px`;
            
    
            updateCounter();
    
            if (screen.children.length > 7) {
                screen.children[6].remove();
            }
        }
    
        function detectCrash() {
            const existBarriers = document.querySelectorAll('.barrier');

            existBarriers.forEach(barrier => {
                
                const condition = barrier.offsetLeft + barrier.clientWidth >= ship.offsetLeft &&
                                  barrier.offsetLeft <= ship.offsetLeft + ship.clientWidth &&
                                  barrier.offsetTop + barrier.clientHeight >= ship.offsetTop &&
                                  barrier.offsetTop <= ship.offsetTop + ship.clientHeight;

                if (condition) {
                    isGameOver = true;
                    gameCenter();
                }
            });
        }
    
        function moveBarrier() {
            const existBarriers = document.querySelectorAll('.barrier');
            detectCrash();
    
            existBarriers.forEach(existBarrier => {
                const currentLocation = existBarrier.offsetTop;
                existBarrier.style.top = `${currentLocation + 3}px`;
            });

        }
        
        function moveShipUp() {
            const currentY = ship.offsetTop;
            ship.style.top = `${currentY - numberOfPixelsToMove}px`;
    
            if (currentY <= numberOfPixelsToMove) {
                ship.style.top = `0px`;
                ship.style.bottom = 'auto';
            } else {
                ship.style.top = `${currentY - numberOfPixelsToMove}px`;
                ship.style.bottom = 'auto';
            }
        }
        function moveShipDown() {
            const currentY = ship.offsetTop;
    
            if (currentY + shipHeight + numberOfPixelsToMove >= screen.clientHeight) {
                ship.style.top = `${screen.clientHeight - shipHeight}px`;
                ship.style.bottom = 'auto';
            } else {
                ship.style.top = `${currentY + numberOfPixelsToMove}px`;
                ship.style.bottom = 'auto';

            }
        }
        function moveShipLeft() {
            const currentX = ship.offsetLeft;
    
            if (currentX <= numberOfPixelsToMove) {
                ship.style.left = `0px`
            } else {
                ship.style.left = `${currentX - numberOfPixelsToMove}px`;
            }
        }
        function moveShipRight() {
            const currentX = ship.offsetLeft;
    
            if (currentX + shipWidth + numberOfPixelsToMove >= screen.clientWidth) {
                ship.style.left = `${screen.clientWidth - shipWidth}px`;
            } else {
                ship.style.left = `${currentX + numberOfPixelsToMove}px`;
            }
        }
    
        if (isGameGoing) {
            buttonUp.addEventListener('click', moveShipUp);
            buttonDown.addEventListener('click', moveShipDown);
            buttonLeft.addEventListener('click', moveShipLeft);
            buttonRight.addEventListener('click', moveShipRight);
        
            window.onkeydown = function (e) {
                if (e.key === "ArrowUp" || e.code === "KeyW") moveShipUp();
                if (e.key === "ArrowDown" || e.code === "KeyS")  moveShipDown();
                if (e.key === "ArrowLeft" || e.code === "KeyA")  moveShipLeft();
                if (e.key === "ArrowRight" || e.code === "KeyD")  moveShipRight();
            };
        }
    }
}
