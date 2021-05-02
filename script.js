const sentence = document.querySelector('.sentence');
const trialContainer = document.querySelector('.trialContainer');
const trial = document.querySelector('.trial');
const cellContainer = document.querySelector('.cellContainer');
const inputSize = document.querySelector('#inputSize');
const selectSize = document.querySelector('.selectSize');
const newGrid = document.querySelector('.newGrid');
const blur = document.querySelector('.blur');
const close = document.querySelector('.close');
const playAgain = document.querySelector('.newGame');

// Determine number of cards we can put on a row according to the screen device
let cellContainerWidth = cellContainer.offsetWidth;
let nbrOfCard = (8 * 70 < cellContainerWidth) ? 8 : 4;

// Each card is not flipped 
let flippedCard = false;
// We can click the grid
let lockGrid = false;

let firstCard = null;
let secondCard = null;

let winCards;
let trials;

/**
 * 
 * @returns the size entered by the player
 * 
 */
function getSize() {
    return parseInt(inputSize.value, 10);
}

/**
 * 
 * We are on the play page, so the input size, confimation size button and the sentence 'Select the number of cards you want !' are not displayed, but the button to generate a new grid is displayed.
 * 
 * We initialize the card to find and the trials to do.
 * 
 */
function generateBtn() {
    sentence.style.display = 'none';
    trialContainer.style.display = 'block';
    trials = 0;
    inputSize.style.display = 'none';
    selectSize.style.display = 'none';
    newGrid.style.display = 'block';
    winCards = 0;
}

/**
 * 
 * We are on the home page, so the input size, confimation size button and the sentence 'Select the number of cards you want !' are displayed, but the button to generate a new grid is not displayed.
 * 
 */
function newGame() {
    sentence.style.display = 'block';
    trialContainer.style.display = 'none';
    trial.innerHTML = '';
    cellContainer.innerHTML = '';
    inputSize.style.display = 'block';
    selectSize.style.display = 'block';
    newGrid.style.display = 'none';
    blur.style.display = 'none';
}

/**
 * 
 * This function will genrate the play page.
 *      - We get the size entered by the user
 *      - We get the icon array entirely shuffled
 *      - Regarding the size of the grid and the width of the screen, we are generating rows with the same amount of cards.
 * 
 */
function createHTML() {
    let size = getSize(); 
    let colorArray = shuffle();

    for (let i = 0; i < size/nbrOfCard; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        cellContainer.appendChild(row);

        for (let j = 0; j < nbrOfCard; j++) {
            row.innerHTML += 
                `<div class="cell done" data-card=${colorArray[i][j]}><img src="Images/` + colorArray[i][j] + '.svg"></div>';
        }
    }

    generateBtn()
}

/**
 * 
 * @returns icon array entirely shuffled
 * 
 * First we just shuffle the initial array, and then we create an array of arrays to simulate the grid of the memory game
 */
function shuffle() {
    let size = getSize()
    let grid =  [];
    let row = [];
    let array = ["book_outline","book_outline","cube_outline","cube_outline","puzzle_outline","puzzle_outline","star_outline","star_outline","game_outline","game_outline","rubiks_outline","rubiks_outline","hanoi_outline","hanoi_outline","dice_outline","dice_outline","dodecahedron_outline","dodecahedron_outline","cylinder_outline","cylinder_outline","pyramid_outline","pyramid_outline","sphere_outline","sphere_outline","gear_outline","gear_outline","double_outline","double_outline","hint_outline","hint_outline","pencil_outline","pencil_outline","book_fill","book_fill","cube_fill","cube_fill","puzzle_fill","puzzle_fill","star_fill","star_fill","game_fill","game_fill","rubiks_fill","rubiks_fill","hanoi_fill","hanoi_fill","dice_fill","dice_fill","dodecahedron_fill","dodecahedron_fill","cylinder_fill","cylinder_fill","pyramid_fill","pyramid_fill","sphere_fill","sphere_fill","gear_fill","gear_fill","double_fill","double_fill","hint_fill","hint_fill","pencil_fill","pencil_fill"];
    
    for (let i = size - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let currentValue = array[i]; 

        array[i] = array[randomIndex];
        array[randomIndex] = currentValue;
    }

    for (let i = 0; i < size; i++) {
        row.push(array[i]);

        if (row.length === nbrOfCard) {
            grid.push(row);
            row = [];
        }
    }

    return grid;
}

/**
 * 
 * @param {*} evt 
 * Since we add an event listener on the whole container, we are targeting only elements with the 'done' class.
	- The following will fix two bugs : First if we have two cards which are flipped but not the same, i.e. card with a circle and card with a pyramid, or if we have clicked on a card, and we click a second time on the same card, then nothing happened. The grid is locked.
	
	- We are not in the above situations, then we can flip the clicked card.
	
	- If there is no flipped card : The card we clicked become flipped, and therefore there is a flipped card, so isThereFlipppedCard become true, and the flipped card is the first one for a pair of cards.
	
	- If there already is a flipped card, then it is the second card of the pair. Therefore, we need to know if it is a match or not between these two cards. We also increase the number of trials.
 *
 */
function cardState(evt) {
    let size = getSize();

    if (evt.target.classList.contains('done')) {
        if (lockGrid || evt.target === firstCard) {
            return;
        }

        evt.target.children[0].classList.add('flip');

        if (!flippedCard) {
            flippedCard = true;
            firstCard = evt.target;
        }
        else {
            secondCard = evt.target;
            trials++;
            trial.innerHTML = trials;

            matchCard();
        }

        youWin();     
    }
}

/**
 * 
 * This function allows us to know what we have to do according to the second card, i.e. the same as the first one or not.
 * 
 */
function matchCard() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        sameCards();
    }
    else {
        notSameCards();
    }
}

/**
 * 
 * If the second card is the same as the first one, then, we can not clicked these two cards anymore, and to do that, we remove the class 'done'. There is no more click event on these cards. Finally we reset the grid.
 * 
 * We increse the number of cards we have found.
 * 
 */
function sameCards() {
    firstCard.classList.remove('done');
    secondCard.classList.remove('done');
    winCards++;
    resetGrid();
}

/**
 * 
 * If the second card is not the same as the first one, we lock the grid, so we can't click another card, and we set a timer to be able to see the pair we just clicked.
 * 
 */
function notSameCards() {
        lockGrid = true;

        setTimeout(() => {
            firstCard.children[0].classList.remove('flip');
            secondCard.children[0].classList.remove('flip');
            resetGrid();
        }, 1000);
}

/**
 * 
 * This function will reset the grid, in the sense that, the grid is not locked, (we can click on cards), and no cards are flipped for a new pair.
 * 
 */
function resetGrid() {
    firstCard = null;
    secondCard = null;
    flippedCard = false;
    lockGrid = false;
}

/**
 * 
 * When you win, a pop - up appears to congrat you and ask if you want to play again.
 * 
 */
function youWin() {
    let size = getSize();

    if (winCards === size/2) {
        setTimeout(() => {
            blur.style.display = 'block';
        }, 1000);
    }   
}

/**
 * 
 * Close the pop - up.
 * 
 */
function closePopUp() {
    blur.style.display = 'none';
}

cellContainer.addEventListener('click', cardState);
selectSize.addEventListener('click', createHTML);
newGrid.addEventListener('click', newGame);
close.addEventListener('click', closePopUp);
playAgain.addEventListener('click', newGame);
