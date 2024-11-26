import { recipes } from './recipes.js';

const recipeSection = document.querySelector('.recipe-section');
const ingredientFilter = document.querySelector('#ingredient-selector');
const applianceFilter = document.querySelector('#appliance-selector');
const ustensilFilter = document.querySelector('#utensil-selector');
const selectedTagsContainer = document.querySelector('#selected-tags');
const recipeCountElement = document.querySelector('#total-recipes');

const selectedFilters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
    searchQuery: ''
};

const searchButton = document.querySelector('.button');
const searchInput = document.querySelector('.text-input');

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
        card.setAttribute('data-recipe-id', this.recipe.id);  // Correction ici

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
    selectedTagsContainer.innerHTML = '';

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
    selectedTagsContainer.appendChild(tagElement);
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

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    selectedFilters.searchQuery = query;
    filterRecipes();
});

function filterRecipes() {
    let filteredRecipes = recipes.filter(recipe => {
        let ingredientMatch = true;
        let applianceMatch = true;
        let ustensilMatch = true;
        let searchMatch = true;

        if (selectedFilters.ingredients.length > 0) {
            ingredientMatch = false;
            selectedFilters.ingredients.forEach(ingredient => {
                recipe.ingredients.forEach(ing => {
                    if (ing.ingredient.toLowerCase().includes(ingredient.toLowerCase())) {
                        ingredientMatch = true;
                    }
                });
            });
        }

        if (selectedFilters.appliances.length > 0) {
            applianceMatch = false;
            selectedFilters.appliances.forEach(appliance => {
                if (recipe.appliance.toLowerCase().includes(appliance.toLowerCase())) {
                    applianceMatch = true;
                }
            });
        }

        if (selectedFilters.ustensils.length > 0) {
            ustensilMatch = false;
            selectedFilters.ustensils.forEach(ustensil => {
                recipe.ustensils.forEach(ust => {
                    if (ust.toLowerCase().includes(ustensil.toLowerCase())) {
                        ustensilMatch = true;
                    }
                });
            });
        }

        if (selectedFilters.searchQuery !== '') {
            searchMatch = recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase());
        }

        return ingredientMatch && applianceMatch && ustensilMatch && searchMatch;
    });

    displayRecipes(filteredRecipes);
}

initializeFilters(recipes);
filterRecipes();





























































































































