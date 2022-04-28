'use strict'
const API_URL = "https://api.github.com/search/repositories?q=";

const main = document.getElementById('main');
const form = document.getElementById('form')
const search = document.getElementById('search')
const repositoriesCount = document.querySelector('.repository-count')


search.addEventListener('input', () => {
  let searchText = search.value;
  getUser(searchText);


})


const getUser = async (repositoryName) => {
  const repository = await fetch(API_URL + repositoryName)
  const repositoryData = await repository.json();
  createUserCard(repositoryData)
}


const createUserCard = (repositoryValue) => {
  const cardHTML = `
  <div class="card">
  <div>

  </div>
  <div class="user-info">
  <h2>Имя ${repositoryValue.items[0].name}</h2>
 <p>Просмотры ${repositoryValue.items[0].watchers}</p>
 <p>Ссылка <a href="${repositoryValue.items[0].html_url}"> ${repositoryValue.items[0].html_url}</a></p>
  </div>
  </div>`
  main.innerHTML = cardHTML;
}