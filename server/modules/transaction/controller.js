import db from '../../config/conn';
import async from 'async';
import keys from '../../config/keys';
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import uuidv4 from 'uuid/v4';
async function JimpResize(f, name) {
    const img = await Jimp.read(f.data);

    return new Promise((resv, rej) => {
        let status = img
            .quality(40) 
            .write(path.resolve(__dirname, `../../../bukti_transfer/${name}`))
   
        if (status) {
            return resv(status);
        } else {
            return rej('ERROR');
        }

    })
}

const queryOrder = `
select 
    ord.id,
    ord.created_at,
    ors.status
 from orders as ord
 left join order_status as ors on ord.order_status_id = ors.id 
 where ord.id = ?
 `;
 

function getOrder(query, id) {
    return new Promise((res, rej) => {
        db.query(query, [id], (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    })
}

export const downloadFileTransaction = async (req,res)=>{
    const order = await getOrder(queryOrder, req.body.id);
}

export const uploadFileTransaction = async (req,res)=>{
    let notificationErr = {
        error: true,
        message: "File already exist",
        notification: true
    }
    try {
      
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        if (req.files.file instanceof Object && Object.keys(req.files.file).length > 0) {
        
        const file = req.files.file;
        if (file.size > 5000000){
            notificationErr.message = 'File terlalu besar'
            return res.status(400).json(notificationErr);
        }
        const type_file = file.mimetype.split('/');
        
        if (type_file.length > 1 && type_file[0] !== 'image'){
            notificationErr.message = 'File harus berupa image'
            return res.status(400).json(notificationErr);
        }
        if(type_file.length === 0 || type_file.length === 1){
            notificationErr.message = 'File harus berupa image'
            return res.status(400).json(notificationErr);
        }
        if(type_file.length > 1 && type_file[1] === 'webp'){
            notificationErr.message = 'Extension file harus berupa jpg,jpeg,png'
            return res.status(400).json(notificationErr);
        }
            const file_name = file.name;
            const file_list = fs.readdirSync(path.resolve(__dirname, '../../../bukti_transfer'));
            const file_exist = file_list.indexOf(file_name);
            if (file_exist !== -1) {
                return res.status(400).json(notificationErr);
            }
            
            const order = await getOrder(queryOrder, req.body.id);
            if(order.length > 0){
                const new_file_name = uuidv4() + file_list.length + '.' + 'jpg';
                const status1 = await JimpResize(file,new_file_name);
              
                const path_url = path.resolve(__dirname, `../../../bukti_transfer/${new_file_name}`);
                const stat = fs.statSync(path_url);
                let listFile = [{
                    link: path_url,
                    ...stat
                }];
                return res.status(200).json(listFile);
            }else{
                notificationErr.message = 'ORDER ID TIDAK DITEMUKAN';
                return res.status(400).json(notificationErr);
            }
         
        }else{
            notificationErr.message = 'THERE ARE SOME ERROR'
            return res.status(400).json(notificationErr);
        }

    } catch (err) {
        return res.status(400).json(err);
    }
}