import {
    elements
} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.resultField.innerHTML = "";
    elements.searchResPages.innerHTML="";
}

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach( el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 20) => {
    if (title.length > limit) {
        title = title.substr(0, limit);
        title = title.substr(0, Math.min(title.length, title.lastIndexOf(" "))) + " ...";
    }
    return title;
}

const renderRecipe = recipe => {
    elements.resultField.innerHTML +=
        ` <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Image of ${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`
};

// type: prev or next
const createButton = (page, type) => `
    <button class = "btn-inline results__btn--${type}" data-goto = "${type === 'prev'? page - 1 : page + 1}">
        
        <span>Page ${type === 'prev'? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href = "img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;


const renderButtons = (page, numResults, resPerPage) => {
    elements.searchResPages.innerHTML='';
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Button to go forward
        button = createButton(page,'next');
    }else if(page<pages){
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // button to go backward
        button = createButton(page, 'prev');
    }
    elements.searchResPages.innerHTML = button;
}

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // show page buttons
    renderButtons(page,recipes.length,resPerPage);
};