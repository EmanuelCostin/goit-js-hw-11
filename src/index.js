import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '42663788-0d7166a9b5363ec403591a61e';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;
let currentPage = 1;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();
  currentPage = 1;
  gallery.innerHTML = ''; // Clear gallery

  const searchQuery = event.target.searchQuery.value;
  await fetchImages(searchQuery);
}

async function fetchImages(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });


    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderImages(hits);
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    currentPage++;

  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
}

function renderImages(images) {
  const fragment = document.createDocumentFragment();
  images.forEach(image => {
    const photoCard = createPhotoCard(image);
    fragment.appendChild(photoCard);
  });
  gallery.appendChild(fragment);
}

function createPhotoCard(image) {
  const photoCard = document.createElement('div');

  photoCard.classList.add('photo-card');
  const imageElement = document.createElement('img');
  imageElement.src = image.webformatURL;
  imageElement.alt = image.tags;
  imageElement.loading = 'lazy';

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');
  const likes = document.createElement('p');
  likes.classList.add('info-item');

  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;
  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;
  const downloads = document.createElement('p');
  downloads.classList.add('info-item');

  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;
  infoDiv.append(likes, views, comments, downloads);
  photoCard.append(imageElement, infoDiv);
  return photoCard;
}

loadMoreBtn.addEventListener('click', () => {
  const searchQuery = searchForm.searchQuery.value;
  fetchImages(searchQuery);
});
