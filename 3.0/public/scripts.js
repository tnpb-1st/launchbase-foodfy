// var declaration
const currentPage = location.pathname; // retorna o enderço atual
const menuItems = document.querySelectorAll('#admin-header-menu a');
const siteHeaderLinks = document.querySelectorAll('#general-header-links a');
const cards = document.querySelectorAll('.recipe-card');
const buttons = document.querySelectorAll('.show-recipe-toggle-button');

// function declaration ---> first foodfy version
function highlightLink(currentPage, menuItems) {
    for (item of menuItems) {
        if (currentPage.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    }
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
                
            }else {
                btn.innerHTML = "Mostrar";
                btn.parentElement.parentElement.lastElementChild.style.visibility = 'hidden';
            }
        });
    }
}

// paginação

function pageGeneration() {
    function paginate(selectedPage, totalPages) {
        let pages = [],
            firstOrLast = 1 || totalPages,
            pagesAfter = selectedPage + 2,
            pagesBefore = selectedPage - 2,
            lastPage = 1
        
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            if ((currentPage == firstOrLast) || (pagesBefore <= currentPage <= pagesAfter)) {
                
                if ((currentPage - lastPage) > 2) {
                    pages.push('...');
                }
                
                if ((currentPage - lastPage) == 2) {
                    pages.push(lastPages + 1);
                }
                
                lastPage = currentPage;
                pages.push(currentPage);
            }
        } return pages; 
    }

    const pagination = document.querySelector('.pagination');

    if (pagination) {
        const filter = pagination.dataset.filter;
        const page = +pagination.dataset.page;
        const total = +pagination.dataset.total;
        const pages = paginate(page, total);
        let elements = "";

        for (let page of pages) {
            if (String(page).includes("...")) {
                elements += `<span>${page}</span>`;
            } else {
                if (filter) {
                    elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
                }else {
                    elements += `<a href="?page=${page}">${page}</a>`;
                }
            }
        }

        pagination.innerHTML = elements;
    }

}

function hideRecipesSearch() {
    if (currentPage.includes('/chefs') || (currentPage.includes('/about'))) {
        document.querySelector('.recipe-search').style = 'visibility: hidden;';
    }
}

// searchRecipes
function hideSearchTitle() {
    let adress = window.location.href;
    const searchTitle = document.querySelector('#search-heading');

    if (searchTitle) {
        
        if (!(adress.includes('filter'))) {
            searchTitle.style = 'visibility: hidden;margin-bottom: 0;'
        } else {
            searchTitle.style = 'visibility: visible;'
        }
    }

}

function main() {
    highlightLink(currentPage, menuItems);
    highlightLink(currentPage, siteHeaderLinks);
    openRecipe();
    activateButton();
    pageGeneration();
    hideRecipesSearch();
    hideSearchTitle();
}



// Call Functions

main();