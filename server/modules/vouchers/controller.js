import db from '../../config/conn';
import async from 'async';
import {validationVoucher} from './validation';


function uuidv4() {
    return 'xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export const getAllVoucherType = (req,res)=>{
    let queryGetAllVoucher = `SELECT * from voucher_type order by id desc`;
    db.query(queryGetAllVoucher,(err,result)=>{
        if(err){
            let notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification});
        }
        if(result.length > 0){
            return res.status(200).json(result);
        }
    })
}

export const deleteVoucher = (req,res)=>{
    if (typeof req.params.id === "undefined") {
        const notification = {
            error: true,
            message: "ERROR",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }
    const querySelectAllVoucher = `SELECT 
    v.id,
    v.name,
    v.description,
    v.voucher_type_id,
    v.max_uses,
    v.value,
    v.valid_from,
    v.valid_until,
     IF(NOW() between v.valid_from and v.valid_until,'ACTIVE','NOT ACTIVE') as status,
    vt.name as voucher_type
    from vouchers as v
     left join voucher_type as vt on v.voucher_type_id = vt.id
    order by v.created_at desc`;

    const querySelectVoucher = `SELECT id from vouchers where id = '${req.params.id}'`;
    const queryDeleteVoucher = `DELETE from vouchers where id = '${req.params.id}'`;

    async.parallel({
        findVoucher:function(callback){
            db.query(querySelectVoucher,(err,result)=>{
                callback(err,result);
            });
        },
        deleteVoucher:function(callback){
            db.query(queryDeleteVoucher,(err,result)=>{
                callback(err,result);
            })
        },
        vouchers:function(callback){
            db.query(querySelectAllVoucher,(err,result)=>{
                callback(err,result);
            })
        }
    },function(err,result){
            if (err) {
                const notification = {
                    error: true,
                    message: "ERROR",
                    notification: true
                }
                return res.status(400).json({ notification: notification });
            }
            if(result){
               
                    const notification = {
                        error: false,
                        message: "VOUCHER HAS BEEN DELETED",
                        notification: true
                    }
                    return res.status(200).json({ vouchers:result.vouchers,notification: notification });
              
            }
    })

}
export const getAllVoucher = (req,res)=>{
    const querySelectAllVoucher = `SELECT 
    v.id,
    v.name,
    v.description,
    v.voucher_type_id,
    v.max_uses,
    v.value,
    v.valid_from,
    v.valid_until,
     IF(NOW() between v.valid_from and v.valid_until,'ACTIVE','NOT ACTIVE') as status,
    vt.name as voucher_type
    from vouchers as v
     left join voucher_type as vt on v.voucher_type_id = vt.id
    order by v.created_at desc`;

    db.query(querySelectAllVoucher,(err,result)=>{
        if (err) {
            const notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
        if(result.length > 0){
            return res.status(200).json(result);
        }
        if(result.length == 0){
            return res.status(200).json({isEmpty:true});
        }
    })
}
export const editVoucher = (req, res) => {
    const querySelectVoucherId = `SELECT 
    v.id,
    v.name,
    v.description,
    v.voucher_type_id,
    v.max_uses,
    v.value,
    v.valid_from,
    v.valid_until,
    vt.id as voucher_type_id
    from vouchers as v
     left join voucher_type as vt on v.voucher_type_id = vt.id
     where v.id = '${req.params.id}'
    order by v.created_at desc`;

    db.query(querySelectVoucherId, (err, result) => {
        if (err) {
            const notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        if (result.length == 0) {
            return res.status(200).json({ isEmpty: true });
        }
    })
}
export const createVoucher = (req,res)=>{

    const { errors, isValid } = validationVoucher(req.body);
    if (!isValid) {
        return res.status(400).json({errors:errors});
    }


    const queryInsertVoucher = `INSERT INTO vouchers set ?`;
    const querySelectLastVoucher = `SELECT id from vouchers where id = '${req.body.id}'`;
    db.query(querySelectLastVoucher,(err,result)=>{
        if(err){
            const notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
        if(result.length > 0 ){
            errors.id = 'VOUCHER ID IS ALREADY USED';
            return res.status(400).json({ errors: errors });
  
        }
        if(result.length === 0){
    
            db.query(queryInsertVoucher, [req.body], (err, result) => {
                if (err) {
                    const notification = {
                        error: true,
                        message: "ERROR",
                        notification: true
                    }
                    return res.status(400).json({ notification: notification });
                }
                if (result) {
                    const notification = {
                        error: false,
                        message: "VOUCHER HAS BEEN CREATED",
                        notification: true
                    }

                    return res.status(200).json({ notification: notification });
                }
            })
        }
    })

}


export const updateVoucher = (req, res) => {
    if(typeof req.params.id === "undefined"){
        const notification = {
            error: true,
            message: "ERROR",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }

    const { errors, isValid } = validationVoucher(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    const queryUpdateVoucher = `UPDATE  vouchers set ? where id = '${req.params.id}'`;
    const querySelectLastVoucher = `SELECT id from vouchers where id = '${req.params.id}'`;
    db.query(querySelectLastVoucher, (err, result) => {
        if (err) {
            const notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
        if (result.length > 0) {
       
            db.query(queryUpdateVoucher, [req.body], (err, result) => {
                if (err) {
                    const notification = {
                        error: true,
                        message: "ERROR",
                        notification: true
                    }
                    return res.status(400).json({ notification: notification});
                }
                if (result) {
                    const notification = {
                        error: false,
                        message: "VOUCHER HAS BEEN UPDATED",
                        notification: true
                    }

                    return res.status(200).json({ notification: notification });
                }
            })
        }
        if (result.length === 0) {
            const notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
    })

}