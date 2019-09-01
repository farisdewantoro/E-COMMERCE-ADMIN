import Validator from 'validator';
import isEmpty from '../../../validations/is-empty';
export const validationCreateLookbook =(data)=>{
    let errors={}
    if(data.name) data.name = !isEmpty(data.name) ? data.name : '';
    if (!Validator.isLength(data.name, { min: 2, max: 100 })) {
        errors.name = 'Must be at least 2 until 100 character';
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Must be provided';
    }

    if(data.image instanceof Array && data.image.length === 0 ){
        errors.image = 'Must be provided';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}