import { recipes } from './recipes.js';
import { RecipeCard } from './card.js';

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
    const query = searchInput.value.trim();
    searchClearButton.style.display = query ? 'inline' : 'none';

    if (query.length >= 3 || query.length === 0) {
        selectedFilters.searchQuery = query;
        filterRecipes();
    }
});

searchClearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchClearButton.style.display = 'none';
    selectedFilters.searchQuery = '';
    filterRecipes();
});

const ingredientClearButton = createClearButton(ingredientInput);
const applianceClearButton = createClearButton(applianceInput);
const utensilClearButton = createClearButton(utensilInput);

const toggleClearButtonVisibility = (inputElement, clearButton) => {
    clearButton.style.display = inputElement.value.trim() ? 'inline' : 'none';
};

ingredientInput.addEventListener('input', () => toggleClearButtonVisibility(ingredientInput, ingredientClearButton));
applianceInput.addEventListener('input', () => toggleClearButtonVisibility(applianceInput, applianceClearButton));
utensilInput.addEventListener('input', () => toggleClearButtonVisibility(utensilInput, utensilClearButton));

const handleClearButtonClick = (filterType, clearButton, inputElement) => {
    inputElement.value = '';
    clearButton.style.display = 'none';
    selectedFilters[filterType] = [];
    updateSelectedTags();
    filterRecipes();
};

ingredientClearButton.addEventListener('click', () => handleClearButtonClick('ingredients', ingredientClearButton, ingredientInput));
applianceClearButton.addEventListener('click', () => handleClearButtonClick('appliances', applianceClearButton, applianceInput));
utensilClearButton.addEventListener('click', () => handleClearButtonClick('ustensils', utensilClearButton, utensilInput));

const toggleSuggestions = (containerId, inputElement, data, suggestionContainerId) => {
    const container = document.querySelector(`#${containerId}`);
    container.style.display = 'block';
    inputElement.focus();

    if (!inputElement.value.trim()) {
        showSuggestions('', Array.from(data), suggestionContainerId);
    }
};

ingredientButton.addEventListener('click', () =>
    toggleSuggestions(
        'containeur-input-and-suggestions-ingredient',
        ingredientInput,
        new Set(filteredRecipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase()))),
        'ingredient-suggestions'
    )
);

applianceButton.addEventListener('click', () =>
    toggleSuggestions(
        'containeur-input-and-suggestions-appliance',
        applianceInput,
        new Set(filteredRecipes.map(recipe => recipe.appliance.toLowerCase())),
        'appliance-suggestions'
    )
);

utensilButton.addEventListener('click', () =>
    toggleSuggestions(
        'containeur-input-and-suggestions-utensil',
        utensilInput,
        new Set(filteredRecipes.flatMap(recipe => recipe.ustensils.map(ut => ut.toLowerCase()))),
        'utensil-suggestions'
    )
);

function updateRecipeCount(recipes) {
    const recipeCount = recipes.length;
    recipeCountElement.textContent = `${recipeCount} recette${recipeCount > 1 ? 's' : ''}`;
}

function displayRecipes(recipes) {
    recipeSection.innerHTML = '';
    let i = 0;
    while (i < recipes.length) {
        const card = RecipeCard.createCard(recipes[i]);
        recipeSection.appendChild(card);
        i++;
    }
    updateRecipeCount(recipes);
}

function initializeFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    let i = 0;
    while (i < recipes.length) {
        const recipe = recipes[i];
        let j = 0;
        while (j < recipe.ingredients.length) {
            ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
            j++;
        }
        appliances.add(recipe.appliance.toLowerCase());
        let k = 0;
        while (k < recipe.ustensils.length) {
            ustensils.add(recipe.ustensils[k].toLowerCase());
            k++;
        }
        i++;
    }

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

    const filteredSuggestions = value
        ? data.filter((item) => item.includes(value.toLowerCase()))
        : data;

    if (!filteredSuggestions.length) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';
    }

    let i = 0;
    while (i < filteredSuggestions.length) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = filteredSuggestions[i];
        suggestionItem.addEventListener('click', () =>
            handleSuggestionClick(filteredSuggestions[i], suggestionContainerId)
        );
        suggestionsContainer.appendChild(suggestionItem);
        i++;
    }
}

function handleSuggestionClick(suggestion, suggestionContainerId) {
    const filterKey = suggestionContainerId.split('-')[0];
    const keyMapping = {
        ingredient: 'ingredients',
        appliance: 'appliances',
        utensil: 'ustensils'
    };
    const key = keyMapping[filterKey];

    if (key && !selectedFilters[key].includes(suggestion)) {
        selectedFilters[key].push(suggestion);
        updateSelectedTags();
        filterRecipes();
    }
}

function updateSelectedTags() {
    const ingredientTagsContainer = document.getElementById('ingredient-tags');
    const applianceTagsContainer = document.getElementById('appliance-tags');
    const utensilTagsContainer = document.getElementById('utensil-tags');

    ingredientTagsContainer.innerHTML = '';
    let i = 0;
    while (i < selectedFilters.ingredients.length) {
        const tag = createTag(selectedFilters.ingredients[i], 'ingredients');
        ingredientTagsContainer.appendChild(tag);
        i++;
    }

    applianceTagsContainer.innerHTML = '';
    i = 0;
    while (i < selectedFilters.appliances.length) {
        const tag = createTag(selectedFilters.appliances[i], 'appliances');
        applianceTagsContainer.appendChild(tag);
        i++;
    }

    utensilTagsContainer.innerHTML = '';
    i = 0;
    while (i < selectedFilters.ustensils.length) {
        const tag = createTag(selectedFilters.ustensils[i], 'ustensils');
        utensilTagsContainer.appendChild(tag);
        i++;
    }
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
    }
    updateSelectedTags();
    filterRecipes();
}

let filteredRecipes = [];

function matchesSearchQuery(recipe, searchQuery) {
    if (!searchQuery) return true;
    const lowerCaseQuery = searchQuery.toLowerCase();

    let match = false;
   
    const fieldsToCheck = [
        recipe.name.toLowerCase(),
        recipe.description.toLowerCase(),
        ...recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase())
    ];
    
    let i = 0;
    while (i < fieldsToCheck.length) {
        if (fieldsToCheck[i].includes(lowerCaseQuery)) {
            match = true;
        }
        i++;
    }

    return match;
}

function filterRecipes() {
    filteredRecipes = [];  

    let i = 0;
    while (i < recipes.length) {
        const recipe = recipes[i];
        const searchMatch = matchesSearchQuery(recipe, selectedFilters.searchQuery);

        const matchesIngredients =
            !selectedFilters.ingredients.length ||
            selectedFilters.ingredients.every((ingredient) =>
                recipe.ingredients.some(
                    (ingredientObj) => ingredientObj.ingredient.toLowerCase() === ingredient.toLowerCase()
                )
            );

        const matchesAppliances =
            !selectedFilters.appliances.length ||
            selectedFilters.appliances.includes(recipe.appliance.toLowerCase());

        const matchesUstensils =
            !selectedFilters.ustensils.length ||
            selectedFilters.ustensils.every((ustensil) =>
                recipe.ustensils.includes(ustensil.toLowerCase())
            );

        if (searchMatch && matchesIngredients && matchesAppliances && matchesUstensils) {
            filteredRecipes.push(recipe); 
        }
        i++;
    }

    displayRecipes(filteredRecipes);
    updateSuggestions(filteredRecipes);
}

document.querySelector('button').addEventListener('click', () => {
    console.log(filteredRecipes);
});

function updateSuggestions(filteredRecipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    let i = 0;
    while (i < filteredRecipes.length) {
        const recipe = filteredRecipes[i];
        let j = 0;
        while (j < recipe.ingredients.length) {
            ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
            j++;
        }
        appliances.add(recipe.appliance.toLowerCase());
        let k = 0;
        while (k < recipe.ustensils.length) {
            ustensils.add(recipe.ustensils[k].toLowerCase());
            k++;
        }
        i++;
    }

    showSuggestions('', Array.from(ingredients), 'ingredient-suggestions');
    showSuggestions('', Array.from(appliances), 'appliance-suggestions');
    showSuggestions('', Array.from(ustensils), 'utensil-suggestions');
}

initializeFilters(recipes);
displayRecipes(recipes);
