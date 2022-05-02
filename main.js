const URL = "https://api.github.com/search/repositories?q=";

const mainList = document.getElementById('main-list');
const searchField = document.getElementById('search');
const repositoriesCountText = document.querySelector('.search-result_count');
const checkPopularRepository = document.getElementById('popular-btn');
const sortByJsBtn = document.getElementById('js-btn');
const loader = document.querySelector('.loading');

let repositoryBtn, repositoryData, timer;
let count = 0;

const searchElement = document.createElement('div');
mainList.append(searchElement);

const formingMostViewedElement = (repositoryViewsArr) => {
  const maxElement = Math.max(...repositoryViewsArr);
  const indexElement = repositoryViewsArr.indexOf(maxElement);

  deleteElements();
  createMostViewedElement(repositoryData, indexElement);
};

const getRepo = (repositoryName) => {
  return fetch(URL + repositoryName)
}

const onGetRepositoryData = async (response) => {
  repositoryData = await response.json();
  const repositoriesCount = repositoryData.total_count;
  repositoriesCountText.textContent = repositoriesCount;
  count = 0;

  createRepositoryCards(repositoriesCount, repositoryData);
  repositoryBtn = document.querySelectorAll('.repository-btn');
  usingLoader(false);
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
  description.innerHTML = `<div class="repository-description_item">     
                           <p class="repository-views_count">Просмотры ${repositoryData.items[i].watchers}</p>
                           <p class="repository-views_count">Доступ ${repositoryData.items[i].visibility}</p>
                           <p class="repository-views_count">Преобладающий язык ${repositoryData.items[i].language}</p>
                           <p class="repository-link">Ссылка: <a href="${repositoryData.items[i].html_url}">
                            ${repositoryData.items[i].html_url}</a></p>
                         </div>`;

  parrantItem[i].appendChild(description);
};

const deleteElements = () => searchElement.innerHTML = "";

const usingLoader = (status = false) => {
  if (status) {
    return loader.style.display = 'block';
  }

  loader.style.display = 'none';
}

const init = () => {
  searchField.addEventListener('input', (e) => {
    const searchedRepo = searchField.value;
    usingLoader(true);
    deleteElements();

    if (timer) {
      clearTimeout(timer);
    }

    if (!searchedRepo) {
      deleteElements();
      repositoriesCountText.textContent = '0';
      return;
    }

    timer = setTimeout(() => {
      deleteElements();
      getRepo(searchedRepo)
        .then((response) => {
          onGetRepositoryData(response);
        })
        .catch((error) => {
          usingLoader(false);
          alert('Что-то пошло не так' + error)
        })
    }, 1000);


  });

  sortByJsBtn.addEventListener('click', () => {
    if (!repositoryData) return;

    const repositoryLength = repositoryData.items.length;
    const languageArr = [];
    const resultArr = [];
    const FIND_VALUE = 'JavaScript';

    let counter = 0;
    while (counter < repositoryLength) {
      languageArr.push(repositoryData.items[counter].language);
      counter++;
    }

    let indexOfValue = languageArr.indexOf(FIND_VALUE);
    while (indexOfValue !== -1) {
      resultArr.push(indexOfValue);
      indexOfValue = languageArr.indexOf(FIND_VALUE, indexOfValue + 1);
    }

    deleteElements();
    resultArr.forEach((item) => {
      createMostViewedElement(repositoryData, item);
    });
  });

  mainList.addEventListener('click', e => {
    const repositoryInfoElement = document.querySelectorAll('.repository-info');
    const moreBtn = document.querySelectorAll('.repository-btn');
    const SEARCHED_TAG = 'A';

    if (e.target.tagName === SEARCHED_TAG) {
      repositoryBtn.forEach((item, i) => {

        if (e.target === item) {
          moreBtn[i].style.display = 'none';
          renderDescription(repositoryData, i, repositoryInfoElement);
        }
      });
    }
  });

  checkPopularRepository.addEventListener('click', () => {
    if (!repositoryData) return;

    const repositoryViewsArr = [];
    const repositoryLength = repositoryData.items.length;

    let i = 0;
    while (i < repositoryLength) {
      repositoryViewsArr.push(repositoryData.items[i].watchers);
      i++;
    }

    formingMostViewedElement(repositoryViewsArr);
  });
}
init();