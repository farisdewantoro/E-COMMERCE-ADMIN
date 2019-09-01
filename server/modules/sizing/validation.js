
import Validator from 'validator';
import isEmpty from '../../../validations/is-empty';


export const validationCreateSizing = (data)=>{
    let errors = {
    }

    data.name = !isEmpty(data.name) ? data.name : '';
    if (Validator.isEmpty(data.name)) {
        errors.name = `MUST BE PROVIDED`;
    }
    if(!data.image instanceof Array || data.image.length == 0){
        errors.image = `MUST BE PROVIDED`;
    }
    if (data.image instanceof Array && data.image.length > 1){
        errors.image = `MAX IMAGE IS 1`;
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}







