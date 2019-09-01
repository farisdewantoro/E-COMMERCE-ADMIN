import axios from 'axios';
import { SET_CSRF } from './types';


export const setCSRF = (data) => {
    return {
        type: SET_CSRF,
        payload: data
    }
}

