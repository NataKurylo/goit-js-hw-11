'use strict';

import Notiflix from 'notiflix';
import { fetchFotos } from './pixabay-api.js';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";


const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let page;
let searchQuery = '';
let amountCards = 0;
var gallery = new SimpleLightbox('.photo-card a');

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick)

async function handleSearchFormSubmit(event) {
    event.preventDefault();
    loadMoreBtnEl.classList.add('is-hidden');
    galleryListEl.innerHTML = '';
    page = 1;
    searchQuery = event.target.elements.searchQuery.value.trim();
    console.log(searchQuery);
   
    if (searchQuery === '') {
        Notiflix.Notify.info('Please, enter a search word.');
        return
    }
    try {
        const { hits, totalHits } = await fetchFotos(searchQuery, page);
            amountCards = hits.length;
            console.log({ hits, totalHits });
            console.log(amountCards);
            console.log(totalHits);
            if (amountCards === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return
            }
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            galleryListEl.innerHTML = createGalleryCards({ hits });
            loadMoreBtnEl.classList.remove('is-hidden');
            gallery.refresh();
            if (amountCards === totalHits) {
                loadMoreBtnEl.classList.add('is-hidden');
                return
            }
    } catch (error) {
        console.log(error);
        }
}

async function handleLoadMoreBtnClick() {
    try {
        page += 1;
        const { hits, totalHits } = await fetchFotos(searchQuery, page);
        amountCards += hits.length;
        console.log({hits, totalHits});
        console.log(page);
        console.log(amountCards);
        console.log(totalHits);
        galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards({ hits }));
        gallery.refresh();
        addSmoothScroll();
        if (amountCards >= totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtnEl.classList.add('is-hidden');
            return
        }
        loadMoreBtnEl.classList.remove('is-hidden');
    } catch (error) {
        console.log(error);
        }
}

function createGalleryCards({hits}) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `
        <div class="photo-card">
            <a href="${largeImageURL}" alt="${tags}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
        </div>
    `}).join('');
}

function addSmoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}

