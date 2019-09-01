import Validator from 'validator';
import isEmpty from '../../../validations/is-empty';

export const validationCreateCategory = (data) =>{
    let errors = {
        // category_type:[]
    };
 
    data.category_name = !isEmpty(data.category_name) ? data.category_name : '';
    data.tag_id = !isEmpty(data.tag_id) ? data.tag_id : '';

    if (!Validator.isLength(data.category_name,{min:2,max:60})){
        errors.category_name = 'Must be at least 2 until 60 character';
    }
    if (Validator.isEmpty(data.category_name)){
        errors.category_name = 'Must be provided';
    }
    if (isEmpty(data.tag_id)) {
        errors.tag_id = 'Must be provided';
    }
  

    // data.category_type.forEach((ct,i)=>{
    //     if(isEmpty(ct.name)){
    //         errors.category_type.push({ message:"Must be provided",error:true,index:i})
    //     }
    // })

    // if(errors.category_type.length === 0){
    //     delete errors.category_type
    // }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }

}

export const validationUpdateCategory = (data)=>{
    let errors = {
        category_type: []
    };

    data.category_name = !isEmpty(data.category_name) ? data.category_name : '';
    data.tag_id = !isEmpty(data.tag_id) ? data.tag_id : '';

    if (!Validator.isLength(data.category_name, { min: 2, max: 60 })) {
        errors.category_name = 'Must be at least 2 until 60 character';
    }
    if (Validator.isEmpty(data.category_name)) {
        errors.category_name = 'Must be provided';
    }
    if (isEmpty(data.tag_id)) {
        errors.tag_id = 'Must be provided';
    }


    data.category_type.forEach((ct, i) => {
        if (isEmpty(ct.name)) {
            errors.category_type.push({ message: "Must be provided", error: true, index: i })
        }
    })

    if (errors.category_type.length === 0) {
        delete errors.category_type
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

export const validationUpdateCategoryTag = (data)=>{
    let errors = {
     
    };
 
    

    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isLength(data.name, { min: 2, max: 60 })) {
        errors.name = 'Must be at least 2 until 60 character';
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Must be provided';
    }
    if (typeof data.tag_id == "undefined") {
        errors.tag_id = 'Must be provided';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

export const validationCreateCategoryTag = (data) => {
    let errors = {

    };



    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isLength(data.name, { min: 2, max: 60 })) {
        errors.name = 'Must be at least 2 until 60 character';
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Must be provided';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

export const validationUpdateCategoryBanner= (data) => {
    let errors = {

    };

    if (Object.keys(data.image_desktop).length > 0 && Object.keys(data.image_mobile).length === 0 ){
        errors.image_mobile = `IMAGE MOBILE MUST BE PROVIDED`;
    }
    if (Object.keys(data.image_desktop).length === 0 && Object.keys(data.image_mobile).length > 0) {
        errors.image_desktop = `IMAGE DESKTOP MUST BE PROVIDED`;
    }

    if(data.promo){
        if (Object.keys(data.image_desktop_promo).length > 0 && Object.keys(data.image_mobile_promo).length === 0) {
            errors.image_mobile_promo = `IMAGE MOBILE PROMO MUST BE PROVIDED`;
        }
        if (Object.keys(data.image_desktop_promo).length === 0 && Object.keys(data.image_mobile_promo).length > 0) {
            errors.image_desktop_promo = `IMAGE DESKTOP PROMO MUST BE PROVIDED`;
        }
        if (Object.keys(data.image_desktop_promo).length === 0 && Object.keys(data.image_mobile_promo).length === 0) {
            errors.image_desktop_promo = `IMAGE DESKTOP PROMO MUST BE PROVIDED`;
            errors.image_mobile_promo = `IMAGE MOBILE PROMO MUST BE PROVIDED`;
        }
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}

