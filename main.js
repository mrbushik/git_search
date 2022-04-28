'use strict';
const url = "https://api.github.com/search/repositories?q=";

const main = document.getElementById('main');
const search = document.getElementById('search');
const repositoriesCountText = document.querySelector('.search-resault_count');


let repositoryBtn;
let repositoryData;
let count = 0;


const searchElement = document.createElement('div');
main.append(searchElement);


search.addEventListener('input', () => {
  let searchText = search.value;
  deleteElements();

  getUser(searchText);
});


const getUser = async (repositoryName) => {
  const repository = await fetch(url + repositoryName);
  repositoryData = await repository.json();
  let repositoriesCount = repositoryData.total_count;
  repositoriesCountText.textContent = repositoriesCount;
  count = 0;
  createUserCards(repositoriesCount, repositoryData);
  repositoryBtn = document.querySelectorAll('.repository-btn');
};

const createUserCards = (repositoriesCount, repositoryValue) => {

  if (repositoriesCount > 10) {

    while (count < 10) {
      createElements(repositoryValue, count);
      count++;
    }
  }
};



main.addEventListener('click', (e) => {

  const userInfoElement = document.querySelectorAll('.user-info');

  if (e.target.tagName === 'A') {
    repositoryBtn.forEach((item, i) => {
      if (e.target === item) {
        renderDescription(repositoryData, i, userInfoElement);
      }
    });

  }
});


const createElements = (repositoryValue, i = 0) => {
  let element = document.createElement('div');
  element.className = "element";
  element.innerHTML = `<div class="user-info">
  <div class="repository-main_item">
  <h2>Имя: ${repositoryValue.items[i].name}</h2> 
<a class="repository-btn">Больше информации</a>
  </div>  
     </div>`;
  searchElement.append(element);
};


const renderDescription = (repositoryData, i, parrantItem) => {
  let description = document.createElement('div');
  description.className = "element";
  description.innerHTML = `
  <div class="repository-description_item">     
    <p class="repository-views_count">Просмотры ${repositoryData.items[i].watchers}</p>
    <p class="repository-link">Ссылка <a href="${repositoryData.items[i].html_url}"> ${repositoryData.items[i].html_url}</a></p>
     </div>`;
  parrantItem[i].append(description);
};


const deleteElements = () => searchElement.innerHTML = "";