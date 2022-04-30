'use strict';
const url = "https://api.github.com/search/repositories?q=";

const main = document.getElementById('main');
const search = document.getElementById('search');
const repositoriesCountText = document.querySelector('.search-resault_count');
const checkPopularRepository = document.getElementById('popular-btn')

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


main.addEventListener('click', (e) => {
  const userInfoElement = document.querySelectorAll('.user-info');

  if (e.target.tagName === 'A') {
    repositoryBtn.forEach((item, i) => {
      renderDescription(repositoryData, i, userInfoElement);
    });

  }
});


checkPopularRepository.addEventListener('click', () => {

  const repositoryVievsArr = [];
  const repositoryLength = repositoryData.items.length;

  let i = 0;

  while (i < repositoryLength) {
    repositoryVievsArr.push(repositoryData.items[i].watchers)
    i++;
  }

  formingMostViewedElement(repositoryVievsArr);
})


const formingMostViewedElement = (repositoryVievsArr) => {
  let maxElement = Math.max(...repositoryVievsArr)
  let indexElement = repositoryVievsArr.indexOf(maxElement);

  deleteElements();
  createMostViewedElement(repositoryData, indexElement)
}


const getUser = async (repositoryName) => {
  const repository = await fetch(url + repositoryName);

  repositoryData = await repository.json()
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
  } else if (repositoriesCount <= 10) {

    while (count < repositoriesCount) {
      createElements(repositoryValue, count);
      count++;
    }
  }
};


const createMostViewedElement = (repositoryValue, i) => {
  console.log('working');
  let element = document.createElement('div');
  element.className = "element";
  element.innerHTML = `<div class="user-info">
  <div class="repository-main_item">
  <h2>Имя: ${repositoryValue.items[i].name}</h2> 

  </div> 
  <div class="repository-description_item">     
  <p class="repository-views_count">Просмотры ${repositoryData.items[i].watchers}</p>
  <p class="repository-views_count">Доступ ${repositoryData.items[i].visibility}</p>
  <p class="repository-views_count">преобладающий язык ${repositoryData.items[i].language}</p>
  <p class="repository-link">Ссылка <a href="${repositoryData.items[i].html_url}"> ${repositoryData.items[i].html_url}</a></p>
   </div> 
     </div>`;
  searchElement.append(element);
}


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