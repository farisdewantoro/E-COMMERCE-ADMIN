import db from '../../config/conn';
import {validationCreateLookbook} from './validation';
import async from 'async';
export const createNewLookbook = (req,res)=>{

    const { errors, isValid } = validationCreateLookbook(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    let queryInsertLookbook = `INSERT INTO lookbooks set ? `;
    let queryInsertImage = `INSERT INTO images (public_id,link,size) values ?`;
    let queryInsertLookbookImage = `INSERT INTO lookbook_image (lookbook_id,image_id) values ?`;

    db.query(queryInsertLookbook, [{ name: req.body.name, slug: req.body.name.toLowerCase().replace(/[^\w]+/g, '').replace(/ +/g, '-')}],(err,result)=>{
        if(err) return res.status(400).json(err);
        if(result){
            let ID_LOOKBOOK =result.insertId;
            let reqBody = [];
            req.body.image.forEach(img => {
                reqBody.push([img.public_id, img.original, img.size])
            });

            db.query(queryInsertImage,[reqBody],(err,result)=>{
                if (err) return res.status(400).json(err);
                if (result){
                    let FIRST_ID_IMAGE = result.insertId;
                    let dataLookBookImage = [];
                    req.body.image.forEach((rb,i)=>{
                        dataLookBookImage.push([ID_LOOKBOOK,FIRST_ID_IMAGE+i]);
                    });

                    db.query(queryInsertLookbookImage,[dataLookBookImage],(err,result)=>{
                        if (err) return res.status(400).json(err);
                        if(result){
                                    let notification = {
                                        error: false,
                                        message: "LOOKBOOK HAS BEEN CREATED",
                                        notification: true
                                    }
                                    return res.status(200).json({notification: notification });
                        }else{
                            return res.status(400).json({ error: "isEmpty" });
                        }
                    })
                }
            })

            
        }else{
            return res.status(400).json({ error: "isEmpty" });
        }
    })
}

export const updateLookbook = (req, res) => {

    const { errors, isValid } = validationCreateLookbook(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    if(typeof req.params.id === "undefined"){
        errors.isEmpty = "IS EMPTY ID";
        return res.status(400).json({errors:errors});
    }
    let querySelect = `SELECT * from lookbooks where id = ${req.params.id}`;
    let queryDelete = `DELETE from images where id in ?`;
    let querySelectLookbookImage = `SELECT * from lookbook_image where lookbook_id = ${req.params.id}`;
    let queryUpdateLookbook = `UPDATE lookbooks set ?  where id = ${req.params.id}`;
    let queryInsertImage = `INSERT INTO images (public_id,link,size) values ?`;
    let queryInsertLookbookImage = `INSERT INTO lookbook_image (lookbook_id,image_id) values ?`;
    db.query(querySelect,(err,result)=>{
        if (err) return res.status(400).json(err);
        if(result.length > 0){
            db.query(queryUpdateLookbook, [{ name: req.body.name, slug: req.body.name.toLowerCase().replace(/[^\w]+/g, '').replace(/ +/g, '-') }], (err, result) => {
                if (err) return res.status(400).json(err);
                if (result) {
                    let ID_LOOKBOOK = req.params.id;
                    let reqBody = [];
                    req.body.image.forEach(img => {
                        reqBody.push([img.public_id, img.original, img.size])
                    });
                    db.query(querySelectLookbookImage,(err,result)=>{
                        if (err) return res.status(400).json(err);
                        if(result.length > 0){
                            let image_id = result.map(r=>r.image_id);
                            db.query(queryDelete,[[image_id]],(err,result)=>{
                                if (err) return res.status(400).json(err);
                                if(result){
                        db.query(queryInsertImage, [reqBody], (err, result) => {
                        if (err) return res.status(400).json(err);
                        if (result) {
                            let FIRST_ID_IMAGE = result.insertId;
                            let dataLookBookImage = [];
                            req.body.image.forEach((rb, i) => {
                                dataLookBookImage.push([ID_LOOKBOOK, FIRST_ID_IMAGE + i]);
                            });

                            db.query(queryInsertLookbookImage, [dataLookBookImage], (err, result) => {
                                if (err) return res.status(400).json(err);
                                if (result) {
                                            let notification = {
                                                error: false,
                                                message: "LOOKBOOK HAS BEEN UPDATED",
                                                notification: true
                                            }
                                            return res.status(200).json({ notification: notification });
                                   
                                
                                } else {
                                    return res.status(400).json({ error: "isEmpty" });
                                }
                            })
                        }
                    })
                                }
                            })
                        }else{
                            db.query(queryInsertImage, [reqBody], (err, result) => {
                                if (err) return res.status(400).json(err);
                                if (result) {
                                    let FIRST_ID_IMAGE = result.insertId;
                                    let dataLookBookImage = [];
                                    req.body.image.forEach((rb, i) => {
                                        dataLookBookImage.push([ID_LOOKBOOK, FIRST_ID_IMAGE + i]);
                                    });

                                    db.query(queryInsertLookbookImage, [dataLookBookImage], (err, result) => {
                                        if (err) return res.status(400).json(err);
                                        if (result) {
                                
                                                    let notification = {
                                                        error: false,
                                                        message: "LOOKBOOK HAS BEEN UPDATED",
                                                        notification: true
                                                    }
                                                    return res.status(200).json({  notification: notification });
                                          
                              
                                        } else {
                                            return res.status(400).json({ error: "isEmpty" });
                                        }
                                    })
                                }
                            })
                        }
                    })
                 


                } else {
                    return res.status(400).json({ error: "isEmpty" });
                }
            })
        }else{
            return res.status(400).json({ error: "isEmpty" });
        }
    })

}

export const deleteLookbook = (req,res)=>{

    if(typeof req.body.lookbook_id === "undefined"){
        return res.status(400).json("error");
    }
   
    let queryFindLookbookImage = `SELECT li.image_id from lookbook_image as li where li.lookbook_id = ${req.body.lookbook_id}`;
    let queryDelete = `DELETE from images where id in ?`;
    let queryDeleteLookbook = `DELETE FROM lookbooks where id = ${req.body.lookbook_id}`;
    let querySelectLookbook = `SELECT lb.name,lb.slug,lb.id as lookbook_id,i.public_id,i.link,i.size 
from lookbooks as lb
left join lookbook_image as li on li.id = (SELECT li1.id from lookbook_image as li1 where lb.id = li1.lookbook_id order by li1.id asc limit 1)
left join images as i on i.id = (SELECT i1.id from images as i1 where li.image_id = i1.id order by i1.id asc limit 1)
group by lb.name,i.public_id,i.link,i.size;`;
    db.query(queryFindLookbookImage, (err, result) => {
        if (err) return res.status(400).json(err);
        if (result.length > 0) {
            let image_id = result.map(r => r.image_id);
            db.query(queryDelete, [[image_id]], (err, result) => {
                if (err) return res.status(400).json(err);
                if (result) {
                    db.query(queryDeleteLookbook,(err,result)=>{
                        if (err) return res.status(400).json(err);
                        if(result){
                            db.query(querySelectLookbook,(err,result)=>{
                                if (err) return res.status(400).json(err);
                                if(result.length > 0){
                                    let notification = {
                                        error: false,
                                        message: "LOOKBOOK HAS BEEN DELETED",
                                        notification: true
                                    }
                                    return res.status(200).json({ data:result,notification: notification });
                                }else{
                                    let notification = {
                                        error: false,
                                        message: "LOOKBOOK HAS BEEN DELETED",
                                        notification: true
                                    }
                                    return res.status(200).json({ notification: notification });
                                }
                            })
                         
                        }
                   
                    })
                }else{
                    return res.status(400).json({error:"isEmpty"});
                }
            })
        } else {
            return res.status(400).json({ error: "isEmpty" });
        }
    })
}

export const getAllLookbook = (req,res)=>{
    let querySelectLookbook = `SELECT lb.name,lb.slug,lb.id as lookbook_id,i.public_id,i.link,i.size 
from lookbooks as lb
left join lookbook_image as li on li.id = (SELECT li1.id from lookbook_image as li1 where lb.id = li1.lookbook_id order by li1.id asc limit 1)
left join images as i on i.id = (SELECT i1.id from images as i1 where li.image_id = i1.id order by i1.id asc limit 1)
group by lb.name,i.public_id,i.link,i.size;`;
    db.query(querySelectLookbook,(err,result)=>{
        if(err) return res.status(400).json(err)
        if(result.length > 0){
            return res.status(200).json(result);
        }else{
            return res.status(400).json({ error: "isEmpty" });
        }

    })
}

export const editLookbook = (req,res)=>{
    if(typeof req.params.id === "undefined"){
        return res.status(400).json({error:"is Empty"});
    }
    let queryFindLookbook = `SELECT * from lookbooks where id = ${req.params.id}`;
    let queryFindLookbookImage = `SELECT 
    li.id as lookbook_image_id,
    i.public_id,
    i.link,
    i.size
    from lookbook_image as li 
    left join images as i on li.image_id = i.id
    where li.lookbook_id = ${req.params.id}`;
    async.parallel({
        lookbooks:function(callback){
            db.query(queryFindLookbook, (err, result) => {
                callback(err,result)
            })
        },
        lookbook_image:function(callback){
            db.query(queryFindLookbookImage,(err,result)=>{
                callback(err, result)
            })
        }
    },function(err,result){
        if(err) return res.status(400).json(err);
        if(result){
            return res.status(200).json(result);
        }
    })


}