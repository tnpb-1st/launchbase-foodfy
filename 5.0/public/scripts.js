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
    if (!(currentPage.includes('admin')) && (currentPage.includes('/chefs') || (currentPage.includes('/about')))) {
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
            searchTitle.style.position = 'absolute'
            searchTitle.style.top = '-1000px'
        } else {
            searchTitle.style = 'visibility: visible;'
            searchTitle.style.position = 'relative'
            searchTitle.style.top = '0px'
        }
    }

}


// Objects

const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        PhotosUpload.input = event.target;

        if (PhotosUpload.hasLimit(event)) return;

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file);
            
            const reader = new FileReader(); // objeto para ler as imagens do usuário
            
            reader.onload = () => { // codigo a ser executado quando o arquivo termianr de ser lido
                const image = new Image(); // cria uma tag <img>
                image.src = String(reader.result);

                const div = PhotosUpload.getContainer(image);
                PhotosUpload.preview.appendChild(div);
            }

            reader.readAsDataURL(file);
        });

        PhotosUpload.input.files = PhotosUpload.getAllFiles();
    },
    
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload;
        const { files:fileList } = input;

        if ( fileList.length < 1 || fileList.length > uploadLimit) {
            if ( fileList.length < 1) {
                alert('Você precisa adicionar pelo menos uma imagem da receita!');
            } else {
                alert(`Você pode adicionar no máximo ${uploadLimit} fotos da receita!`);
            }
            event.preventDefault();
            return true;
        }

        const photosDiv = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item);
            }
        })

        const totalPhotos = fileList.length + photosDiv.length;

        if (totalPhotos > uploadLimit) {
            alert('você atingiu o limite máximo de fotos');
            event.preventDefault();
        }

        return false;
    },

    getAllFiles() {
        const dataTransfer = new DataTransfer() || new CLipboardEvent("").clipboardData;

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },

    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photo');
        
        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image);
        div.appendChild(PhotosUpload.getRemoveButton());
        return div;
    },

    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = "close";
        return button;
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();


        photoDiv.remove();
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove();
    }

}

const AvatarUpload = {
    fileDetails: document.querySelector('#file-details'),
    selectedFile: document.querySelector('#chef-avatar-details p:last-child'),
    
    setFilename(event) {
        const { name} = event.target.files[0];
        AvatarUpload.selectedFile.innerHTML = `${name}`;

        if (AvatarUpload.fileDetails.classList.contains('active')) {
            AvatarUpload.fileDetails.innerHTML = name;
        }
    },

    showEditFile() {
        if ((currentPage.includes('/admin/chefs')) && (currentPage.includes('/edit'))) {
            const div = AvatarUpload.fileDetails;
            if (div.innerHTML.length > 0 ) {
                div.classList.add('active');
                document.querySelector('#chef-avatar-input').style = 'top: 69px;';
            }
        }
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    preview: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const { target } = event;

        ImageGallery.preview.forEach(img => {img.classList.remove('active')})
        target.classList.add('active')

        ImageGallery.highlight.src = target.src;
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
    AvatarUpload.showEditFile()
}


// Call Main

main();