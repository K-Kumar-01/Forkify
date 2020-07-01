import {
    elements
} from "./base";
import{ limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'img/icons.svg#icon-heart' : "img/icons.svg#icon-heart-outlined"
    document.querySelector('.recipe__love use').setAttribute('href', iconString);
}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
}

export const renderLike = (el) => {
    let markup;
    try {
    markup = `
    <li>
        <a class="likes__link" href="#${el.id}">
            <figure class="likes__fig">
                <img src="${el.img}" alt="${el.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(el.title)}</h4>
                <p class="likes__author">${el.author}</p>
            </div>
        </a>
    </li>
    `;
    } catch (error) {
        console.log(error);
    }
    elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id =>{
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el){
        el.parentElement.removeChild(el);
    }
}