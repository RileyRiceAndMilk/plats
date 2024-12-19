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

const ingredientTagsContainer = document.querySelector('#ingredient-tags');
const applianceTagsContainer = document.querySelector('#appliance-tags');
const utensilTagsContainer = document.querySelector('#utensil-tags');

const createClearButton = (inputElement) => {
    const clearButton = document.createElement('span');
    clearButton.classList.add('clear-input', 'clear-input-search');
    clearButton.textContent = '×';
    inputElement.parentElement.appendChild(clearButton);
    clearButton.style.display = 'none';

    return clearButton;
};

const searchClearButton = createClearButton(searchInput);

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

const ingredientClearButton = createClearButton(ingredientFilter);
const applianceClearButton = createClearButton(applianceFilter);
const utensilClearButton = createClearButton(ustensilFilter);

const toggleClearButtonVisibility = (inputElement, clearButton) => {
    if (inputElement.value.trim()) {
        clearButton.style.display = 'inline';
    } else {
        clearButton.style.display = 'none';
    }
};

ingredientFilter.addEventListener('input', () => toggleClearButtonVisibility(ingredientFilter, ingredientClearButton));
applianceFilter.addEventListener('input', () => toggleClearButtonVisibility(applianceFilter, applianceClearButton));
ustensilFilter.addEventListener('input', () => toggleClearButtonVisibility(ustensilFilter, utensilClearButton));

const handleClearButtonClick = (filterType, clearButton, inputElement) => {
    inputElement.value = '';
    clearButton.style.display = 'none';
    selectedFilters[filterType] = [];
    updateSelectedTags();
    filterRecipes();
};

ingredientClearButton.addEventListener('click', () => handleClearButtonClick('ingredients', ingredientClearButton, ingredientFilter));
applianceClearButton.addEventListener('click', () => handleClearButtonClick('appliances', applianceClearButton, applianceFilter));
utensilClearButton.addEventListener('click', () => handleClearButtonClick('ustensils', utensilClearButton, ustensilFilter));

const toggleSuggestions = (buttonId, containerId, inputElement) => {
    const container = document.querySelector(`#${containerId}`);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    inputElement.focus();
};

ingredientButton.addEventListener('click', () => toggleSuggestions('ingredient-button', 'containeur-input-and-suggestions-ingredient', ingredientFilter));
applianceButton.addEventListener('click', () => toggleSuggestions('appliance-button', 'containeur-input-and-suggestions-appliance', applianceFilter));
utensilButton.addEventListener('click', () => toggleSuggestions('utensil-button', 'containeur-input-and-suggestions-utensil', ustensilFilter));

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
        recipe.ingredients.forEach(ingredient => {
            ingredients.add(ingredient.ingredient.toLowerCase());
        });
        appliances.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil => {
            ustensils.add(ustensil.toLowerCase());
        });
    });

    ingredientFilter.addEventListener('input', (event) =>
        showSuggestions(event.target.value, Array.from(ingredients), 'ingredient-suggestions')
    );
    applianceFilter.addEventListener('input', (event) =>
        showSuggestions(event.target.value, Array.from(appliances), 'appliance-suggestions')
    );
    ustensilFilter.addEventListener('input', (event) =>
        showSuggestions(event.target.value, Array.from(ustensils), 'utensil-suggestions')
    );
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
        suggestionItem.addEventListener('click', () => handleSuggestionClick(suggestion, suggestionContainerId));
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

function updateTagContainer(container, tags, filterType) {
    container.innerHTML = '';
    tags.forEach(tag => {
        const tagElement = createTag(tag, filterType);
        container.appendChild(tagElement);
    });
}

function createTag(value, filterType) {
    const tag = document.createElement('span');
    tag.classList.add('selected-tag');
    tag.textContent = value;

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeButton.addEventListener('click', () => removeTag(value, filterType));

    tag.appendChild(closeButton);
    return tag;
}

function removeTag(value, filterType) {
    const index = selectedFilters[filterType].indexOf(value);
    if (index !== -1) {
        selectedFilters[filterType].splice(index, 1);
        updateSelectedTags();
        filterRecipes();
    }
}

function updateSelectedTags() {
    updateTagContainer(ingredientTagsContainer, selectedFilters.ingredients, 'ingredients');
    updateTagContainer(applianceTagsContainer, selectedFilters.appliances, 'appliances');
    updateTagContainer(utensilTagsContainer, selectedFilters.ustensils, 'ustensils');
}

function filterRecipes() {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesIngredients = selectedFilters.ingredients.every(ingredient => recipe.ingredients.some(i => i.ingredient.toLowerCase().includes(ingredient.toLowerCase())));
        const matchesAppliance = selectedFilters.appliances.every(appliance => recipe.appliance.toLowerCase().includes(appliance.toLowerCase()));
        const matchesUstensil = selectedFilters.ustensils.every(ustensil => recipe.ustensils.some(u => u.toLowerCase().includes(ustensil.toLowerCase())));
        const matchesSearch = recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
                              recipe.description.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase());

        return matchesIngredients && matchesAppliance && matchesUstensil && matchesSearch;
    });

    displayRecipes(filteredRecipes);
}

initializeFilters(recipes);
filterRecipes();



