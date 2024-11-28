import { recipes } from './recipes.js';

const recipeSection = document.querySelector('.recipe-section');
const ingredientFilter = document.querySelector('#ingredient-selector');
const applianceFilter = document.querySelector('#appliance-selector');
const ustensilFilter = document.querySelector('#utensil-selector');
const recipeCountElement = document.querySelector('#total-recipes');

const selectedFilters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
    searchQuery: ''
};

const searchButton = document.querySelector('.button');
const searchInput = document.querySelector('.text-input');

const ingredientButton = document.querySelector('#ingredient-button');
const applianceButton = document.querySelector('#appliance-button');
const utensilButton = document.querySelector('#utensil-button');

const ingredientInput = document.querySelector('#ingredient-selector');
const applianceInput = document.querySelector('#appliance-selector');
const utensilInput = document.querySelector('#utensil-selector');


const searchClearButton = document.createElement('span');
searchClearButton.classList.add('clear-search');
searchClearButton.textContent = '×';
searchInput.parentElement.appendChild(searchClearButton);


searchClearButton.style.display = 'none';


searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) {
        searchClearButton.style.display = 'inline';
    } else {
        searchClearButton.style.display = 'none';
    }
});

searchButton.addEventListener('click', () => {
    selectedFilters.searchQuery = searchInput.value.trim();  
    filterRecipes();  
});

searchClearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchClearButton.style.display = 'none';
    selectedFilters.searchQuery = '';
    filterRecipes();
});


const ingredientClearButton = document.createElement('span');
ingredientClearButton.classList.add('clear-input');
ingredientClearButton.textContent = '×';
ingredientInput.parentElement.appendChild(ingredientClearButton);
ingredientClearButton.style.display = 'none';

const applianceClearButton = document.createElement('span');
applianceClearButton.classList.add('clear-input');
applianceClearButton.textContent = '×';
applianceInput.parentElement.appendChild(applianceClearButton);
applianceClearButton.style.display = 'none';

const utensilClearButton = document.createElement('span');
utensilClearButton.classList.add('clear-input');
utensilClearButton.textContent = '×';
utensilInput.parentElement.appendChild(utensilClearButton);
utensilClearButton.style.display = 'none';


ingredientInput.addEventListener('input', () => {
    if (ingredientInput.value.trim()) {
        ingredientClearButton.style.display = 'inline';
    } else {
        ingredientClearButton.style.display = 'none';
    }
});

applianceInput.addEventListener('input', () => {
    if (applianceInput.value.trim()) {
        applianceClearButton.style.display = 'inline';
    } else {
        applianceClearButton.style.display = 'none';
    }
});

utensilInput.addEventListener('input', () => {
    if (utensilInput.value.trim()) {
        utensilClearButton.style.display = 'inline';
    } else {
        utensilClearButton.style.display = 'none';
    }
});


ingredientClearButton.addEventListener('click', () => {
    ingredientInput.value = '';
    ingredientClearButton.style.display = 'none';
    selectedFilters.ingredients = [];
    updateSelectedTags();
    filterRecipes();
});

applianceClearButton.addEventListener('click', () => {
    applianceInput.value = '';
    applianceClearButton.style.display = 'none';
    selectedFilters.appliances = [];
    updateSelectedTags();
    filterRecipes();
});

utensilClearButton.addEventListener('click', () => {
    utensilInput.value = '';
    utensilClearButton.style.display = 'none';
    selectedFilters.ustensils = [];
    updateSelectedTags();
    filterRecipes();
});


ingredientButton.addEventListener('click', () => {
    const ingredientContainer = document.querySelector('#containeur-input-and-suggestions-ingredient');
    ingredientContainer.style.display = ingredientContainer.style.display === 'none' ? 'block' : 'none';
    ingredientInput.focus();
});

applianceButton.addEventListener('click', () => {
    const applianceContainer = document.querySelector('#containeur-input-and-suggestions-appliance');
    applianceContainer.style.display = applianceContainer.style.display === 'none' ? 'block' : 'none';
    applianceInput.focus();
});

utensilButton.addEventListener('click', () => {
    const utensilContainer = document.querySelector('#containeur-input-and-suggestions-utensil');
    utensilContainer.style.display = utensilContainer.style.display === 'none' ? 'block' : 'none';
    utensilInput.focus();
});


class RecipeCard {
    constructor(recipe) {
        this.recipe = recipe;
    }

    static createCard(recipe) {
        const card = new RecipeCard(recipe);
        return card.createCardContent();
    }

    createCardContent() {
        const card = document.createElement('article');
        card.classList.add('recipe-card');
        card.setAttribute('data-recipe-id', this.recipe.id);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const img = document.createElement('img');
        img.src = `recipes/${this.recipe.image}`;
        img.alt = `Image de ${this.recipe.name}`;
        img.classList.add('recipe-image');
        img.onerror = () => {
            img.style.display = 'none';
            message.textContent = "Désolé, l'image est indisponible.";
        };

        const timeTag = document.createElement('span');
        timeTag.classList.add('time-tag');
        timeTag.textContent = `${this.recipe.time} min`;

        imageContainer.appendChild(img);
        imageContainer.appendChild(timeTag);

        const cardContentContainer = document.createElement('div');
        cardContentContainer.classList.add('card-content-container');

        const title = document.createElement('h2');
        title.id = `recipe-${this.recipe.id}`;
        title.textContent = this.recipe.name;

        const recetteTitle = document.createElement('h3');
        recetteTitle.classList.add('recette-title');
        recetteTitle.textContent = 'RECETTE';

        const description = document.createElement('p');
        description.classList.add('recipe-description');
        description.textContent = this.recipe.description;

        const ingredientsTitle = document.createElement('h4');
        ingredientsTitle.classList.add('ingredients-title');
        ingredientsTitle.textContent = 'Ingrédients';

        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            const ingredientName = document.createElement('div');
            ingredientName.classList.add('ingredient-name');
            ingredientName.textContent = ingredient.ingredient;

            const ingredientQuantity = document.createElement('div');
            ingredientQuantity.classList.add('ingredient-quantity');
            ingredientQuantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`;

            ingredientItem.appendChild(ingredientName);
            ingredientItem.appendChild(ingredientQuantity);
            ingredientsList.appendChild(ingredientItem);
        });

        cardContentContainer.appendChild(title);
        cardContentContainer.appendChild(recetteTitle);
        cardContentContainer.appendChild(description);
        cardContentContainer.appendChild(ingredientsTitle);
        cardContentContainer.appendChild(ingredientsList);

        card.appendChild(imageContainer);
        card.appendChild(cardContentContainer);

        return card;
    }
}


function updateRecipeCount(recipes) {
    const recipeCount = recipes.length;
    recipeCountElement.textContent = `${recipeCount} recette${recipeCount > 1 ? 's' : ''}`;
}


function displayRecipes(recipes) {
    recipeSection.innerHTML = '';
    recipes.forEach(recipe => {
        const card = RecipeCard.createCard(recipe);
        recipeSection.appendChild(card);
    });
    updateRecipeCount(recipes);
}


function initializeFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => ingredients.add(ingredient.ingredient.toLowerCase()));
        appliances.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil => ustensils.add(ustensil.toLowerCase()));
    });

    ingredientFilter.setAttribute('placeholder', '');
    ingredientFilter.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(ingredients), 'ingredient-suggestions');
    });

    applianceFilter.setAttribute('placeholder', '');
    applianceFilter.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(appliances), 'appliance-suggestions');
    });

    ustensilFilter.setAttribute('placeholder', '');
    ustensilFilter.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(ustensils), 'utensil-suggestions');
    });
}


function showSuggestions(value, data, suggestionContainerId) {
    const suggestionsContainer = document.querySelector(`#${suggestionContainerId}`);
    suggestionsContainer.innerHTML = '';

    if (value === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredSuggestions = data.filter(item => item.toLowerCase().includes(value.toLowerCase()));

    if (filteredSuggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';
    }

    filteredSuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            handleSuggestionClick(suggestion, suggestionContainerId);
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}


function handleSuggestionClick(suggestion, suggestionContainerId) {
    if (suggestionContainerId === 'ingredient-suggestions') {
        if (!selectedFilters.ingredients.includes(suggestion)) {
            selectedFilters.ingredients.push(suggestion);
            updateSelectedTags();
        }
    } else if (suggestionContainerId === 'appliance-suggestions') {
        if (!selectedFilters.appliances.includes(suggestion)) {
            selectedFilters.appliances.push(suggestion);
            updateSelectedTags();
        }
    } else if (suggestionContainerId === 'utensil-suggestions') {
        if (!selectedFilters.ustensils.includes(suggestion)) {
            selectedFilters.ustensils.push(suggestion);
            updateSelectedTags();
        }
    }
    filterRecipes();
}


function updateSelectedTags() {

    const ingredientTagsContainer = document.querySelector('#ingredient-tags');
    ingredientTagsContainer.innerHTML = '';
    selectedFilters.ingredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.classList.add('selected-tag');
        tag.textContent = ingredient;


        const closeButton = document.createElement('span');
        closeButton.classList.add('close-tag');
        closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
        closeButton.addEventListener('click', () => {
            selectedFilters.ingredients = selectedFilters.ingredients.filter(i => i !== ingredient);
            updateSelectedTags();
            filterRecipes();
        });

        tag.appendChild(closeButton);
        ingredientTagsContainer.appendChild(tag);
    });


    const applianceTagsContainer = document.querySelector('#appliance-tags');
    applianceTagsContainer.innerHTML = '';
    selectedFilters.appliances.forEach(appliance => {
        const tag = document.createElement('div');
        tag.classList.add('selected-tag');
        tag.textContent = appliance;

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-tag');
        closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
        closeButton.addEventListener('click', () => {
            selectedFilters.appliances = selectedFilters.appliances.filter(a => a !== appliance);
            updateSelectedTags();
            filterRecipes();
        });

        tag.appendChild(closeButton);
        applianceTagsContainer.appendChild(tag);
    });


    const utensilTagsContainer = document.querySelector('#utensil-tags');
    utensilTagsContainer.innerHTML = '';
    selectedFilters.ustensils.forEach(utensil => {
        const tag = document.createElement('div');
        tag.classList.add('selected-tag');
        tag.textContent = utensil;

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-tag');
        closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
        closeButton.addEventListener('click', () => {
            selectedFilters.ustensils = selectedFilters.ustensils.filter(u => u !== utensil);
            updateSelectedTags();
            filterRecipes();
        });

        tag.appendChild(closeButton);
        utensilTagsContainer.appendChild(tag);
    });
}


function filterRecipes() {
    let filteredRecipes = recipes;

    if (selectedFilters.searchQuery) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()))
        );
    }

    if (selectedFilters.ingredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.ingredients.every(ingredient => recipe.ingredients.some(i => i.ingredient.toLowerCase() === ingredient.toLowerCase()))
        );
    }

    if (selectedFilters.appliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.appliances.includes(recipe.appliance.toLowerCase())
        );
    }

    if (selectedFilters.ustensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.ustensils.every(ustensil => recipe.ustensils.map(u => u.toLowerCase()).includes(ustensil))
        );
    }

    displayRecipes(filteredRecipes);
}

initializeFilters(recipes);
displayRecipes(recipes);

