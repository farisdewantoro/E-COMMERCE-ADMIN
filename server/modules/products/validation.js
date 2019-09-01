import Validator from 'validator';
import isEmpty from '../../../validations/is-empty';
import moment from 'moment';
export const validationCreateProduct = (data) => {

    let errors = {
        product:{},
        product_attribute:[],
        product_variant:{},
        product_discount:{},
        product_category:{},
        images:{}
    };
    let newErrors={}
    data.product.name = !isEmpty(data.product.name) ? data.product.name : '';
    data.product.regular_price = !isEmpty(data.product.regular_price) ? data.product.regular_price : '';
 
    data.product_attribute.size = !isEmpty(data.product_attribute.size) ? data.product_attribute.size :  '';
    data.product_attribute.stock = !isEmpty(data.product_attribute.stock) ? data.product_attribute.stock : '';

    data.product_variant.hex_color = !isEmpty(data.product_variant.hex_color) ? data.product_variant.hex_color:'';
    data.product_variant.original_color = !isEmpty(data.product_variant.original_color) ? data.product_variant.original_color : '';
    
    if (data.isDiscountCard){
        data.product_discount.discount_percentage = !isEmpty(data.product_discount.discount_percentage) ? data.product_discount.discount_percentage : '';
        data.product_discount.discount_value = !isEmpty(data.product_discount.discount_value) ? data.product_discount.discount_value : '';
        data.product_discount.valid_from = !isEmpty(data.product_discount.valid_from) ? data.product_discount.valid_from : '';
        data.product_discount.valid_until = !isEmpty(data.product_discount.valid_until) ? data.product_discount.valid_until : '';
        data.product_discount.date_created = !isEmpty(data.product_discount.date_created) ? data.product_discount.date_created : '';

        if (Validator.isEmpty(data.product_discount.discount_percentage)) errors.product_discount.discount_percentage='Must be provieded';
        if (Validator.isEmpty(data.product_discount.discount_value)) errors.product_discount.discount_value = 'Must be provieded';
        if (Validator.isEmpty(data.product_discount.valid_from)) errors.product_discount.valid_from = 'Must be provieded';
        if (Validator.isEmpty(data.product_discount.valid_until)) errors.product_discount.valid_until = 'Must be provieded';
        if (Validator.isEmpty(data.product_discount.date_created)) errors.product_discount.date_created = 'Must be provieded';
    }

    if (!Validator.isLength(data.product.name, { min: 2, max: 50 }))errors.product.name = 'Must be at least 2 until 50 character';
    if (Validator.isEmpty(data.product_category.value.toString())) errors.product_category = 'Must be provided';
    if (typeof data.product_variant.category_type_id !== "undefined" && data.product_variant.category_type_id !== null && data.product_variant.category_type_id !== '' ){
        if (Validator.isEmpty(data.product_variant.category_type_id.value.toString())) errors.product_variant.category_type_id = 'Must be provided';
    } else {
        errors.product_variant.category_type_id = 'Must be provided';
    }

   
    if (Validator.isEmpty(data.product.name)) errors.product.name = 'Must be provided';
    if (Validator.isEmpty(data.product.regular_price)) errors.product.regular_price = 'Must be provided';
    if (Validator.isEmpty(data.product_attribute.size)) errors.product_attribute.size ='Must be provided';
    if (Validator.isEmpty(data.product_attribute.stock)) errors.product_attribute.stock = 'Must be provided';
    if (Validator.isEmpty(data.product_variant.hex_color)) errors.product_variant.hex_color = 'Must be provided';
    if (Validator.isEmpty(data.product_variant.original_color)) errors.product_variant.original_color = 'Must be provided';
    if (data.images.length < 1) errors.images.image = 'Must be at least 1 until 5 Image';
    if (data.product_attribute.length === 0) errors.product_attribute = 'Must be provided';
    if (data.product_attribute.length > 0){
        data.product_attribute.forEach((p_att,i)=>{
            if (isEmpty(p_att.size) || isEmpty(p_att.stock)){
                if (isEmpty(p_att.size)) {
                    p_att.size = 'Must be provided';
                }else{
                    p_att.size = '';
                }
                if (isEmpty(p_att.stock)) {
                    p_att.stock = 'Must be provided';
                } else {
                    p_att.stock = '';
                }
                errors.product_attribute.push({ size: p_att.size, stock:p_att.stock});
            }  
        })
    }



    if (Object.keys(errors).length > 0 && errors.constructor === Object) {
        for (var key in errors) {

            if ( !(errors.hasOwnProperty(key) && Object.keys(errors[key]).length > 0) || errors[key].length === 0) {
                delete errors[key];
            }
        }

    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


export const validationUpdateProduct = (data) => {

    let errors = {
        product: {},
        product_attribute: [],
        product_variant: {},
        product_discount: {},
        product_category: {},
        images: {}
    };
    let newErrors = {}
    data.product.name = !isEmpty(data.product.name) ? data.product.name : '';
    data.product.regular_price = !isEmpty(data.product.regular_price) ? data.product.regular_price : '';
  

    
    data.product_variant.hex_color = !isEmpty(data.product_variant.hex_color) ? data.product_variant.hex_color : '';
    data.product_variant.original_color = !isEmpty(data.product_variant.original_color) ? data.product_variant.original_color : '';

    if (data.isDiscountCard) {
    
        data.product_discount.discount_percentage = !isEmpty(data.product_discount.discount_percentage) ? data.product_discount.discount_percentage : '';
        // data.product_discount.discount_value = !isEmpty(data.product_discount.discount_value) ? data.product_discount.discount_value : '';
        data.product_discount.valid_from = !isEmpty(data.product_discount.valid_from) ? data.product_discount.valid_from : '';
        data.product_discount.valid_until = !isEmpty(data.product_discount.valid_until) ? data.product_discount.valid_until : '';
  
        
        if (typeof data.product_discount.discount_percentage == "number" && data.product_discount.discount_percentage.length === 0 ) errors.product_discount.discount_percentage = 'Must be provieded';
        if (typeof data.product_discount.discount_percentage == "string" &&data.product_discount.discount_percentage.length === 0) errors.product_discount.discount_percentage = 'Must be provieded';
        if (typeof data.product_discount.discount_value == "string" &&  Validator.isEmpty (data.product_discount.discount_value) ) errors.product_discount.discount_value = 'Must be provieded';
        if (isEmpty(data.product_discount.discount_value)){
            errors.product_discount.discount_value = 'Must be provieded';
        }
        if (Validator.isEmpty(data.product_discount.valid_from)) errors.product_discount.valid_from = 'Must be provieded';
        if (Validator.isEmpty(data.product_discount.valid_until)) errors.product_discount.valid_until = 'Must be provieded';
       
    }

    if (!Validator.isLength(data.product.name, { min: 2, max: 50 })) errors.product.name = 'Must be at least 2 until 50 character';
    if (!isEmpty(data.product_category)){
        if (Validator.isEmpty(data.product_category.value.toString())) errors.product_category = 'Must be provided';
    }else{
        errors.product_category = 'Must be provided';
    }

    if (!isEmpty(data.product_variant)){
        if (!isEmpty(data.product_variant.category_type_id)){
            if (Validator.isEmpty(data.product_variant.category_type_id.value.toString())) errors.product_variant.category_type_id = 'Must be provided';
        }else{
            errors.product_variant.category_type_id = 'Must be provided'; 
        }
        if (Validator.isEmpty(data.product_variant.hex_color)) errors.product_variant.hex_color = 'Must be provided';
        if (Validator.isEmpty(data.product_variant.original_color)) errors.product_variant.original_color = 'Must be provided';
    }else{
        errors.product_variant.hex_color = 'Must be provided';
        errors.product_variant.original_color = 'Must be provided';
        errors.product_variant.category_type_id = 'Must be provided'; 
    }
 
    
    if (Validator.isEmpty(data.product.name)) errors.product.name = 'Must be provided';
    if (typeof data.product.regular_price !== "number" && Validator.isEmpty(data.product.regular_price)) errors.product.regular_price = 'Must be provided';

    if (data.images.length < 1) errors.images.image = 'Must be at least 1 until 5 Image';
    if (data.product_attribute.length === 0) errors.product_attribute = 'Must be provided';
    if (data.product_attribute.length > 0) {
        data.product_attribute.forEach((p_att, i) => {
            let dataError ={
                size:'',
                stock:''
            }
            if (isEmpty(p_att.size) || isEmpty(p_att.stock)) {
                if (isEmpty(p_att.size)) {
                    dataError.size = 'Must be provided';
                } else {
                    dataError.size = '';
                }
                if ((p_att.stock == null || typeof p_att.stock == "undefined") || (typeof p_att.stock == "string" && p_att.stock == '')  ) {
                    dataError.stock = 'Must be provided';
                } else {
                    dataError.stock = '';
                }
               
            }else{
                dataError.size = '';
                dataError.stock = '';
            }
        
            errors.product_attribute.push({ size: dataError.size, stock: dataError.stock });
        })
    }
    function checkAllValue(value) {
        // console.log(value);
        if(value.size == '' && value.stock == ''){
            return true;
        }else{
            return false;
        }
    }
    if (errors.product_attribute instanceof Array && errors.product_attribute.length > 0 ){
        console.log(errors.product_attribute);
        if(errors.product_attribute.every(checkAllValue)){
            delete errors.product_attribute;
        }
        
    }
    if (Object.keys(errors).length > 0 && errors.constructor === Object) {
        for (var key in errors) {

            if (!(errors.hasOwnProperty(key) && Object.keys(errors[key]).length > 0) || errors[key].length === 0) {
                delete errors[key];
            }
        }

    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

export const validationMakeDiscount = (data)=>{
    let errors={
        product_discount:{}
    }
   
    data.product_discount.discount_percentage = !isEmpty(data.product_discount.discount_percentage) ? data.product_discount.discount_percentage : '';
    
    data.product_discount.valid_from = !isEmpty(data.product_discount.valid_from) ? data.product_discount.valid_from : '';
    data.product_discount.valid_until = !isEmpty(data.product_discount.valid_until) ? data.product_discount.valid_until : '';
    if (data.product_discount.discount_percentage.length === 0) errors.product_discount.discount_percentage = 'Must be provided';
    if (data.product_discount.discount_percentage > 90) errors.product_discount.discount_percentage = 'Max length 90';

    if (!moment(data.product_discount.valid_until).isValid()) errors.product_discount.valid_until = 'Must be provided';
    if (!moment(data.product_discount.valid_from).isValid()) errors.product_discount.valid_from = 'Must be provided';
    // if (!Validator.isAfter(data.product_discount.valid_from, { date })) errors.product_discount.valid_until = 'Must be provided';
    if(Object.keys(errors.product_discount).length === 0){
        delete errors.product_discount;
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

