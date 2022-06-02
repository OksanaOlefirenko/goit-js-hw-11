import './css/styles.css';
import { getImages } from "./getCards";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { onScroll, onBtnTop } from './scroll';

let lightbox = new SimpleLightbox('.gallery a');
let searchQuery = "";
let page = 1;
const perPage = 40;
let lastCard = "";

const refs = {
    searchForm: document.querySelector("#search-form"),
    galleryContainer: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector (".load-more"),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

onScroll();
onBtnTop();

function onSearch(event) {
    event.preventDefault();
    window.scrollTo({ top: 0 });
    searchQuery = event.currentTarget.elements.searchQuery.value;
    if (searchQuery.trim() === "") {
        return Notiflix.Notify.warning('The search string cannot be empty. Please, enter your search term');
    }
    resetPage();
    getImages(searchQuery, page, perPage).then(data => {

        clearGalleryContainer();
        
        if (data.totalHits === 0) {
            refs.loadMoreBtn.classList.add("is-hidden");
            return Notiflix.Notify.failure ("Sorry, there are no images matching your search query. Please try again.")
        };
        Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images."`);
        renderImagesList(data.hits);

        if (data.totalHits > perPage) {
            refs.loadMoreBtn.classList.remove("is-hidden")
        };
        lightbox.refresh();

        if (lastCard) {
        infiniteObserver.observe(lastCard);
        };
        })
        .catch (error => console.log (error.message));
};

function onLoadMore() {
        incrementPage();
        getImages(searchQuery, page, perPage).then(data => {
        renderImagesList(data.hits);
        lightbox.refresh();
        if (page > (data.totalHits / perPage)) {
            refs.loadMoreBtn.classList.add("is-hidden");
            return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        };
        if (lastCard) {
        infiniteObserver.observe(lastCard);
        };
        })
        .catch(error => console.log (error.message));
};

function resetPage() {
    page = 1;
};

function incrementPage() {
    page += 1;
};

function renderImagesList(images) {
    const markup = images.map(
        image => `<div class="photo-card">
        <a class="photo-link" href="${image.largeImageURL}">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" height = "200 px" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${image.downloads}
    </p>
  </div>
  </a>
</div>`
    ).join("");
    refs.galleryContainer.insertAdjacentHTML("beforeend", markup);
    lastCard = document.querySelector(".photo-card:last-child");
};

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = "";
}

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    // проверяем что достигли последнего элемента
    if (entry.isIntersecting) {
      // перестаем его отслеживать
      observer.unobserve(entry.target);
      // и загружаем новую порцию контента
      onLoadMore();
    }
  },
  { threshold: 0.5 }
);