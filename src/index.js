"use strict";

import Notiflix from 'notiflix';
import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '45694916-26d3469d9465de46d8eb67fae';

const searchElement = document.querySelector('input[name="searchQuery"]');
const articlesElement = document.querySelector('.articlesWrapper');
const form = document.getElementById('search-form');
const button = document.querySelector('button[type="submit"]');

let queryPage = 1;

form.addEventListener('submit', onSubmit);
button.addEventListener('click', getData);

function onSubmit(e) {
    e.preventDefault();
  }

async function getData() {
    try {
	const response = await axios.get(`${ENDPOINT}?key=${API_KEY}&q=${searchElement.value}&image_type=photo&orientation=horizontal&safesearch=true`);
    const data = response.data.hits;
    data.forEach(element => {
        let div = document.createElement('div')
        div.innerHTML = `
        <div>
        <img src="${element.webformatURL}" alt="${element.tags} width="500" height="300"">
        <ul>
          <li>${element.likes}</li>
          <li>${element.views}</li>
          <li>${element.comments}</li>
          <li>${element.downloads}</li>
        </ul>
        </div>
      `;
      articlesElement.appendChild(div);
    });

} catch (error) {
	console.log(error.message);
}
};