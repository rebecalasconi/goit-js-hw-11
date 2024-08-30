"use strict";

import Notiflix from 'notiflix';
import axios from 'axios';
import LoadMoreBtn from './components/loadMoreButton.js';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '45694916-26d3469d9465de46d8eb67fae';

const searchElement = document.querySelector('input[name="searchQuery"]');
const articlesElement = document.querySelector('.gallery');
const form = document.getElementById('search-form');
const button = document.querySelector('button[type="submit"]');
const loadMoreBtn = new LoadMoreBtn({
    selector: '#loadMoreBtn',
    isHidden: true,
  });

let queryPage = 1;
let input = searchElement.value

form.addEventListener('submit', onSubmit);
button.addEventListener('click', getData);
loadMoreBtn.button.addEventListener('click', getData); // Adaugă un event listener pentru click-ul pe butonul "Load More".

function onSubmit(e) {
    e.preventDefault();
    queryPage = 1;
    loadMoreBtn.show();
  }
  

async function getData() {
    try {
        loadMoreBtn.disable(); 
	const response = await axios.get(`${ENDPOINT}?key=${API_KEY}&q=${searchElement.value}
        &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${queryPage}`);
    const data = response.data.hits;
    if(data.length === 0) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
            );
        searchElement.value=''
    } 
    loadMoreBtn.enable();
    Notiflix.Notify.success(`Hooray! We found ${response.data.hits.length} images.`);
    data.forEach(element => {
        let div = document.createElement('div')
        div.innerHTML = `
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" class="photo"/>
           <div class="info">
             <p class="info-item">
                <b>Likes</b>
                ${element.likes}
             </p>
             <p class="info-item">
                <b>Views</b>
                ${element.views}
             </p>
             <p class="info-item">
                <b>Comments</b>
                ${element.comments}
             </p>
             <p class="info-item">
                <b>Downloads</b>
                ${element.downloads}
             </p>
           </div>
     </div>`;
     div.classList.add(`photo-card`)
      articlesElement.appendChild(div);
      queryPage += 1;
    });

} catch (error) {
	console.log(error.message);
}
};
