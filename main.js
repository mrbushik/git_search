'use strict';
const API_URL = "https://api.github.com/search/repositories?q=";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const repositoriesCountText = document.querySelector('.search-resault_count');

let count = 0;


search.addEventListener('input', () => {
  let searchText = search.value;
  getUser(searchText);
});


const getUser = async (repositoryName) => {
  const repository = await fetch(API_URL + repositoryName);
  const repositoryData = await repository.json();
  let repositoriesCount = repositoryData.total_count;
  repositoriesCountText.textContent = repositoriesCount;
  createUserCards(repositoriesCount, repositoryData);
};

const createUserCards = (repositoriesCount, repositoryValue) => {
  let i = 0;

  if (repositoriesCount > 10) {

    while (i < 10) {
      createElements(repositoryValue, i);
      i++;
    }
  }
};

const createElements = (repositoryValue, i = 0) => {
  let searchElement = document.createElement('div');
  searchElement.innerHTML = `<div class="user-info">
     <h2>Имя: ${repositoryValue.items[i].name}</h2>
    <p>Просмотры ${repositoryValue.items[i].watchers}</p>
    <p>Ссылка <a href="${repositoryValue.items[i].html_url}"> ${repositoryValue.items[i].html_url}</a></p>
     </div>`;
  main.append(searchElement);
};