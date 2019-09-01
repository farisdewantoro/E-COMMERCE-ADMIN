import isEmpty from '../../../validations/is-empty';
import Validator from 'validator';


export const validationVoucher = (data)=>{
    let errors={
    }

    data.name = !isEmpty(data.name) ? data.name : '';
    data.id = !isEmpty(data.id) ? data.id : '';
    if(Validator.isEmpty(data.name)){
        errors.name = `MUST BE PROVIDED`;
    }
    if (Validator.isEmpty(data.id)) {
        errors.id = `MUST BE PROVIDED`;
    }
    if (!Validator.isAfter(data.valid_until, data.valid_from)){
        errors.valid_until = `INVALID DATE FORMAT`;
    }
    if(Validator.isEmpty(data.valid_from.toString())){
        errors.valid_from = `INVALID DATE FORMAT`;
    }
    if (!Validator.isInt(data.max_uses.toString(),{min:0})){
        errors.max_uses = `MUST BE PROVIDED`;
    }
    if(!Validator.isInt(data.value.toString())){
        errors.value = `MUST BE PROVIDED`;
    }
    if (typeof data.voucher_type_id === "undefined" || data.voucher_type_id=="" ) {
        errors.voucher_type_id = `MUST BE PROVIDED`;
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
    
}