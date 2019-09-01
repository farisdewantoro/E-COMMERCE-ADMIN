import Validator from 'validator';
import isEmpty from '../../../validations/is-empty';
import db from '../../config/conn';
export const ValidationLogin =(data)=>{
    let errors={

    }
    data.username = !isEmpty(data.username) ? data.username : '';
    if (Validator.isEmpty(data.username.toString())) errors.username = 'Must be provided';
    data.password = !isEmpty(data.password) ? data.password : '';
    if (Validator.isEmpty(data.password.toString())) errors.password = 'Must be provided';

    return {
        errors,
        isValid: isEmpty(errors)
    }



}