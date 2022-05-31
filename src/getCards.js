const axios = require('axios');

const API_KEY = '27665107-be973549318970a9f466382f1';
const BASE_URL = "https://pixabay.com/api/";
const searchParams = new URLSearchParams({
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
});

const URL = `${BASE_URL}?key=${API_KEY}&${searchParams}`;

export async function getImages(searchName, page, perPage) {
    const response = await axios.get(URL + `&q=${searchName}` + `&page=${page}` + `&per_page=${perPage}`);
    return response.data;
};

