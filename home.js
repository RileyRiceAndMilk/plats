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


ingredientButton.addEventListener('click', () => {
    ingredientInput.style.display = ingredientInput.style.display === 'none' ? 'block' : 'none';
    ingredientInput.focus();
});

applianceButton.addEventListener('click', () => {
    applianceInput.style.display = applianceInput.style.display === 'none' ? 'block' : 'none';
    applianceInput.focus();
});

utensilButton.addEventListener('click', () => {
    utensilInput.style.display = utensilInput.style.display === 'none' ? 'block' : 'none';
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

    ingredientFilter.setAttribute('placeholder', 'Ingrédient');
    ingredientFilter.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(ingredients), 'ingredient-suggestions');
    });

    applianceFilter.setAttribute('placeholder', 'Appareil');
    applianceFilter.addEventListener('input', (event) => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(appliances), 'appliance-suggestions');
    });

    ustensilFilter.setAttribute('placeholder', 'Ustensile');
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
    document.querySelector('#ingredient-tags').innerHTML = '';
    document.querySelector('#appliance-tags').innerHTML = '';
    document.querySelector('#utensil-tags').innerHTML = '';

    selectedFilters.ingredients.forEach(tag => {
        createTag(tag, 'ingredient');
    });

    selectedFilters.appliances.forEach(tag => {
        createTag(tag, 'appliance');
    });

    selectedFilters.ustensils.forEach(tag => {
        createTag(tag, 'utensil');
    });
}

function createTag(tag, type) {
    const tagElement = document.createElement('div');
    tagElement.classList.add('selected-tag');
    tagElement.textContent = tag;

    const removeButton = document.createElement('span');
    removeButton.classList.add('remove-tag');
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => removeTag(tag, type));

    tagElement.appendChild(removeButton);

    if (type === 'ingredient') {
        document.querySelector('#ingredient-tags').appendChild(tagElement);
    } else if (type === 'appliance') {
        document.querySelector('#appliance-tags').appendChild(tagElement);
    } else if (type === 'utensil') {
        document.querySelector('#utensil-tags').appendChild(tagElement);
    }
}

function removeTag(tag, type) {
    if (type === 'ingredient') {
        selectedFilters.ingredients = selectedFilters.ingredients.filter(item => item !== tag);
    } else if (type === 'appliance') {
        selectedFilters.appliances = selectedFilters.appliances.filter(item => item !== tag);
    } else if (type === 'utensil') {
        selectedFilters.ustensils = selectedFilters.ustensils.filter(item => item !== tag);
    }
    updateSelectedTags();
    filterRecipes();
}

function filterRecipes() {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesIngredients = selectedFilters.ingredients.every(ingredient => 
            recipe.ingredients.some(i => i.ingredient.toLowerCase() === ingredient)
        );
        const matchesAppliance = selectedFilters.appliances.length === 0 || selectedFilters.appliances.includes(recipe.appliance.toLowerCase());
        const matchesUstensils = selectedFilters.ustensils.every(ustensil => recipe.ustensils.includes(ustensil.toLowerCase()));
        const matchesSearchQuery = recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) || recipe.description.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase());
        return matchesIngredients && matchesAppliance && matchesUstensils && matchesSearchQuery;
    });

    displayRecipes(filteredRecipes);
}

searchButton.addEventListener('click', () => {
    selectedFilters.searchQuery = searchInput.value.trim().toLowerCase();
    filterRecipes();
});

initializeFilters(recipes);
displayRecipes(recipes);

