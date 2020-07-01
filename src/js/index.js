// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, stopLoader } from './views/base';
import Like from "./models/Likes";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 * 
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () =>{
    // 1. Get the query from view
    const query = searchView.getInput(); //TODO

    if(query){
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Add rendering
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.resultField);

        try {
            // 4.Search for recipes
            await state.search.getResults();

            // 5.Display the results to the UI
            // searchView
            stopLoader();
            searchView.renderRecipes(state.search.result);
        } catch (error) {
            alert('Search failed.');
            stopLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        // could have also done using btn.dataset.goto
        searchView.clearResults();
        searchView.renderRecipes(state.search.result,goToPage);

    }
})

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () =>{
    // get the id of the element.
    let id = window.location.hash;
    id = id.substr(1,id.length-1);

    if(id){

        //  Prepare UI for changes

        // Create a new Recipe Object
        state.recipe = new Recipe(id);

        // show loader
        
        
        try {
            // Clear the recipe area before loadingg any
            recipeView.clearRecipe();
            renderLoader(elements.recipe);

            // Highlight the selected recipe
            if(state.search){
                searchView.highlightSelected(id);
            }

            // get the recipe data and parseIngredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            // display the data
            stopLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id));

        } catch (error) {
            stopLoader();
            alert("Error processing the recipe.")
            console.log(error);
            
        }  

    }
};


/**
 * LIST CONTROLLER
 */


const controlList = () => {
    // 1. Create a new list if list doesnt exist yet
    if(!state.list){
        state.list = new List();
    }

    // 2. Add Each ingredient to the list
    state.recipe.ingredients.forEach( el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
    
};


/**
 * LIKES CONTROLLER
 */

const controlLike = () => {
    // Create likes if not already present
    if(!state.likes){
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)){
        // Recipe not in likes list

        // 1. Add like to state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        

        // 2. Toggle Like Button
        likesView.toggleLikeBtn(true);

        // 3. Add like to UI
        likesView.renderLike(newLike);
        

    } else {
        // Recipe in likes list

        // 1.Remove like from state
        state.likes.deleteLike(currentID);

        // 2. Toggle Like Button
        likesView.toggleLikeBtn(false);

        // 3. Remove like from UI
        likesView.deleteLike(currentID);
        

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};

// window.addEventListener('hashchange',controlRecipe)
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, controlRecipe)
})

// Restore liked recipes on page load
window.addEventListener("load", () => {
    state.likes = new Likes();
    // get the likes back
    state.likes.readStorage();

    // toggle the menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the liked recipes
    state.likes.likes.forEach(el => likesView.renderLike(el))

})



// handle recipe and adding to list item events

elements.recipe.addEventListener('click', function(e){
    // Update the counts of ingredients and the servings
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        // Add ingredients to list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        // Like Controller
        controlLike();
    }
})

// handle delete and update list events

elements.shoppingList.addEventListener('click', function(e){
    // Get the id of clicked element
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the Update
    if(e.target.matches('.shopping__count-value')){
        const newCount = parseFloat(e.target.value, 10);
        state.list.updateCount(id,newCount);
    } 
    
    // Handling the delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        listView.deleteItem(id);
        state.list.deleteItem(id);
    }
})

