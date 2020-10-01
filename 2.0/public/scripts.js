// var declaration
const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');
const buttons = document.querySelectorAll('.toggle-button');

// function declaration ---> first foodfy version
function changeModalContent(card) {
    modalOverlay.querySelector(".modal-food-image").src = card.querySelector(".food-image").src;
    modalOverlay.querySelector(".modal-food-author").innerText = card.querySelector(".food-author").innerText;
    modalOverlay.querySelector(".modal-food-title").innerText = card.querySelector(".food-title").innerText;
}

function activateModal() {
    for (let card of cards) {
        card.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            changeModalContent(card);
        });
    }
}

function closeModal() {
    document.querySelector('.close-modal').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

function openRecipe() {
    for (let card of cards) {
        card.addEventListener('click', () => {
            window.location.href =  `/recipes/${card.id}`;
            console.log(`/recipes/${card.id}`);
        });
    }
}

function activateButton() {
    for (let btn of buttons) {
        btn.addEventListener('click', () => {
            if (btn.parentElement.parentElement.lastElementChild.style.visibility === 'hidden') {
                btn.innerText = 'Esconder';
                btn.parentElement.parentElement.lastElementChild.style.visibility = 'visible';
                btn.parentElement.parentElement.lastElementChild.style.position = 'relative';
                btn.parentElement.parentElement.lastElementChild.style.top = '0';
                
            }else {
                btn.innerHTML = "Mostrar";
                btn.parentElement.parentElement.lastElementChild.style.visibility = 'hidden';
                btn.parentElement.parentElement.lastElementChild.style.position = 'absolute';
                btn.parentElement.parentElement.lastElementChild.style.top = '-1000px';
            }
        });
    }
}

function main() {
    openRecipe();
    activateButton();
}



// Call Functions

main();