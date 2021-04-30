const sentence = document.querySelector('.sentence');
const cellContainer = document.querySelector('.cellContainer');
const inputSize = document.querySelector('#inputSize');
const selectSize = document.querySelector('.selectSize');
const newGrid = document.querySelector('.newGrid');
let cellContainerWidth = cellContainer.offsetWidth

let nbrOfCard = (8 * 70 < cellContainerWidth) ? 8 : 4;

let flippedCard = false;
let lockGrid = false;
let firstCard = null;
let secondCard = null;

function getSize() {
    return parseInt(inputSize.value, 10);
}

function generateBtn() {
    inputSize.style.display = 'none';
    selectSize.style.display = 'none';
    newGrid.style.display = 'block';
    sentence.style.display = 'none';
}

function newGame() {
    cellContainer.innerHTML = ''
    inputSize.style.display = 'block';
    selectSize.style.display = 'block';
    newGrid.style.display = 'none';
    sentence.style.display = 'block';

}

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

function shuffle() {
    let size = getSize()
    let grid =  [];
    let row = [];
    let array = ["book_outline","book_outline","cube_outline","cube_outline","puzzle_outline","puzzle_outline","star_outline","star_outline","game_outline","game_outline","rubiks_outline","rubiks_outline","hanoi_outline","hanoi_outline","dice_outline","dice_outline","dodecahedron_outline","dodecahedron_outline","cylinder_outline","cylinder_outline","pyramid_outline","pyramid_outline","sphere_outline","sphere_outline","gear_outline","gear_outline","double_outline","double_outline","hint_outline","hint_outline","pencil_outline","pencil_outline","book_fill","book_fill","cube_fill","cube_fill","puzzle_fill","puzzle_fill","star_fill","star_fill","game_fill","game_fill","rubiks_fill","rubiks_fill","hanoi_fill","hanoi_fill","dice_fill","dice_fill","dodecahedron_fill","dodecahedron_fill","cylinder_fill","cylinder_fill","pyramid_fill","pyramid_fill","sphere_fill","sphere_fill","gear_fill","gear_fill","double_fill","double_fill","hint_fill","hint_fill","pencil_fill","pencil_fill"];
    
    for (let i = size - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let temporaryValue = array[i]; 
        array[i] = array[randomIndex];
        array[randomIndex] = temporaryValue;
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

function cardState(evt) {
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

            if (firstCard.dataset.card === secondCard.dataset.card) {
                firstCard.classList.remove('done');
                secondCard.classList.remove('done');
                resetGrid();
            }

            else {
                lockGrid = true;

                setTimeout(() => {
                    firstCard.children[0].classList.remove('flip');
                    secondCard.children[0].classList.remove('flip');
                    resetGrid();
                }, 1000)
            }
        }
    }

}

function resetGrid() {
    firstCard = null;
    secondCard = null;
    flippedCard = false;
    lockGrid = false;
}

cellContainer.addEventListener('click', cardState);
selectSize.addEventListener('click', createHTML);
newGrid.addEventListener('click', newGame)