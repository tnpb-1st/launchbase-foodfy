// var declaration

const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');

// function declaration
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

function main() {
    activateModal();
    closeModal();
}



// Call Functions

main();