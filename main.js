const url = "https://api.github.com/search/repositories?q=";

const main = document.getElementById('main-list');
const search = document.getElementById('search');
const repositoriesCountText = document.querySelector('.search-resault_count');
const checkPopularRepository = document.getElementById('popular-btn');
const jsBtn = document.getElementById('js-btn');

let repositoryBtn;
let repositoryData;
let count = 0;
let timer;

const searchElement = document.createElement('div');
main.append(searchElement);


search.addEventListener('input', () => {
  const searchText = search.value;
  clearTimeout(timer);
  timer = setTimeout(() => {
    deleteElements();
    getUser(searchText);
  }, 500);

});


jsBtn.addEventListener('click', () => {
  if (repositoryData === undefined) {
    return;
  }
  const repositoryLength = repositoryData.items.length;
  const languageArr = [];

  const resaultArr = [];
  let counter = 0;
  const findValue = 'JavaScript';

  while (counter < repositoryLength) {
    languageArr.push(repositoryData.items[counter].language);
    counter++;
  }

  let indexOfValue = languageArr.indexOf(findValue);

  while (indexOfValue !== -1) {
    resaultArr.push(indexOfValue);
    indexOfValue = languageArr.indexOf(findValue, indexOfValue + 1);
  }

  deleteElements();
  resaultArr.forEach((item) => {
    createMostViewedElement(repositoryData, item);
  });
});


main.addEventListener('click', e => {
  const userInfoElement = document.querySelectorAll('.repository-info');

  if (e.target.tagName === 'A') {

    repositoryBtn.forEach((item, i) => {

      if (e.target === item) {
        renderDescription(repositoryData, i, userInfoElement);
      }
    });
  }
});

checkPopularRepository.addEventListener('click', () => {
  if (repositoryData === undefined) {
    return;
  }
  const repositoryVievsArr = [];
  const repositoryLength = repositoryData.items.length;

  let i = 0;

  while (i < repositoryLength) {
    repositoryVievsArr.push(repositoryData.items[i].watchers);
    i++;
  }
  formingMostViewedElement(repositoryVievsArr);
});


const formingMostViewedElement = repositoryVievsArr => {
  const maxElement = Math.max(...repositoryVievsArr);
  const indexElement = repositoryVievsArr.indexOf(maxElement);

  deleteElements();
  createMostViewedElement(repositoryData, indexElement);
};


const getUser = async repositoryName => {
  const repository = await fetch(url + repositoryName);

  repositoryData = await repository.json();
  const repositoriesCount = repositoryData.total_count;
  repositoriesCountText.textContent = repositoriesCount;
  count = 0;

  createRepositoryCards(repositoriesCount, repositoryData);
  repositoryBtn = document.querySelectorAll('.repository-btn');
};


const createRepositoryCards = (repositoriesCount, repositoryValue) => {

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
  const element = document.createElement('div');
  element.className = "element";
  element.innerHTML = `<div class="repository-info">
  <div class="repository-main_item">
  <h2>Имя: ${repositoryValue.items[i].name}</h2> 
  </div> 
  <div class="repository-description_item">     
  <p class="repository-views_count">Просмотры ${repositoryData.items[i].watchers}</p>
  <p class="repository-views_count">Доступ ${repositoryData.items[i].visibility}</p>
  <p class="repository-views_count">Преобладающий язык ${repositoryData.items[i].language}</p>
  <p class="repository-link">Ссылка <a href="${repositoryData.items[i].html_url}">
   ${repositoryData.items[i].html_url}</a></p>
   </div> 
     </div>`;

  searchElement.append(element);
};


const createElements = (repositoryValue, i = 0) => {
  const element = document.createElement('div');
  element.className = "element";
  element.innerHTML = `<div class="repository-info">
  <div class="repository-main_item">
  <h2>Имя: ${repositoryValue.items[i].name}</h2> 
  <a class="repository-btn">Больше информации</a>
  </div>  
     </div>`;

  searchElement.append(element);
};


const renderDescription = (repositoryData, i, parrantItem) => {
  const description = document.createElement('div');

  description.className = "description";
  description.innerHTML = `
  <div class="repository-description_item">     
    <p class="repository-views_count">Просмотры ${repositoryData.items[i].watchers}</p>
    <p class="repository-views_count">Доступ ${repositoryData.items[i].visibility}</p>
    <p class="repository-views_count">Преобладающий язык ${repositoryData.items[i].language}</p>
    <p class="repository-link">Ссылка <a href="${repositoryData.items[i].html_url}">
     ${repositoryData.items[i].html_url}</a></p>
     </div>`;

  parrantItem[i].appendChild(description);
};


const deleteElements = () => searchElement.innerHTML = "";