"use strict";

import Notiflix from 'notiflix';
import axios from 'axios';
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";
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

form.addEventListener('submit', onSubmit);
button.addEventListener('click', getData);
loadMoreBtn.button.addEventListener('click', getData); // Adaugă un event listener pentru click-ul pe butonul "Load More".


function onSubmit(e) {
    e.preventDefault();
    queryPage = 1;
    articlesElement.innerHTML= '';
    loadMoreBtn.show();
  }

async function getData(event) {
    try {
        loadMoreBtn.disable();
	    const response = await axios.get(`${ENDPOINT}?key=${API_KEY}&q=${searchElement.value}
            &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${queryPage}`);
        queryPage += 1;
        const data = response.data.hits;

    if(response.data.total === 0) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
            );
            loadMoreBtn.hide();
            return;

    } else if(response.data.hits.length === 0) {
        Notiflix.Notify.failure(
            `We're sorry, but you've reached the end of search results.`
            );
        loadMoreBtn.hide();
        return;

    } else {
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.
        Showing ${data.length} images`);
    data.forEach(element => {
        let div = document.createElement('div')
        div.innerHTML = `
        <a class="gallery__link" href="${element.largeImageURL}">
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" class="photo"/>
        </a>
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
     loadMoreBtn.enable();
    });

}} catch (error) {
	console.log(error.message);
}};

function onGallleryClick(event) {
    event.preventDefault();
    const isGalleryImg = event.target.classList.contains("photo");

    if(!isGalleryImg) return;

    const imgSource = event.target.dataset.source;
    new SimpleLightbox('.gallery a', { captionDelay: 250, captionPosition: 'bottom', captionData: 'alt' });

}


articlesElement.addEventListener("click", onGallleryClick);