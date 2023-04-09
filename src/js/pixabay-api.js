'use strict';
import axios from 'axios';
const API_KEY = '31000801-179358ed9db1a9fc0904af43d';
const BASE_URL = 'https://pixabay.com';


export const fetchFotos = async (name, page) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/`, {
            params: {
            key: `${ API_KEY }`,
            q: `${ name }`,
            image_type: 'photo',
            per_page: 40,
            page: `${ page }`,
            orientation: 'horizontal',
            safesearch: true,
            }
        });
        // console.log(data);
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}