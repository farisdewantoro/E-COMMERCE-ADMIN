import db from '../../config/conn';
import async from 'async';
import {validationCreateSizing} from './validation';



export const createSizing =(req,res)=>{
    const { errors, isValid } = validationCreateSizing(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const queryInsertImage = `INSERT INTO images (public_id,link,size) values ?`;
    const queryInsertSizing = `INSERT INTO sizing set ?`;
    let reqBody = [];
    req.body.image.forEach(img => {
        reqBody.push([img.public_id, img.original,img.size])
    });
    db.query(queryInsertImage, [reqBody],(err,result)=>{
        if(err){
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json(err);
        }
        if(result){
            const lastId = result.insertId;
            let data={
                image_id:lastId
            };
            if(req.body.name) data.name = req.body.name;
            if(req.body.description) data.description = req.body.description;

            db.query(queryInsertSizing,[data],(err,result)=>{
                if (err) {
                    let notification = {
                        error: true,
                        message: "There is an error !",
                        notification: true
                    }
                    return res.status(400).json(err);
                }
                if(result){
                    let notification = {
                        error: false,
                        message: "Size has been created",
                        notification: true
                    }
                    return res.status(200).json({ notification: notification });
                }
            }) 
        }
    })
}

export const deleteSizing = (req, res) => {
    if (typeof req.params.id === "undefined") {
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        return res.status(400).json(err);
    }
    const queryDeleteImage = `DELETE from images where id = ?`;
    const queryDelete = `DELETE from sizing where id = ${req.params.id}`;
    const querySelectSizing = `SELECT * from sizing where id = ${req.params.id}`;

    db.query(querySelectSizing,(err,result)=>{
        if (err) {
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json({notification:notification});
        }
        if(result.length > 0){
            let image_id = result[0].image_id;
            async.parallel({
                image:function(callback){
                    db.query(queryDeleteImage,[image_id],(err,result)=>{
                   callback(err,result);
                    })
                },
                sizing:function(callback){
                    db.query(queryDelete,(err,result)=>{
                        callback(err,result);
                    })
                }
            },function(err,result){
                    if (err) {
                        let notification = {
                            error: true,
                            message: "There is an error !",
                            notification: true
                        }
                        return res.status(400).json({ notification: notification });
                    }
                    if(result){
                        let notification = {
                            error: false,
                            message: "Size has been deleted",
                            notification: true
                        }
                        return res.status(200).json({ notification: notification });
                    }
            })
        }
        if(result.length === 0){
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json({notification:notification});
        }
    })
}
export const updateSizing = (req, res) => {
    if (typeof req.params.id === "undefined") {
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        return res.status(400).json(err);
    }
    const { errors, isValid } = validationCreateSizing(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const querySelectSize = `SELECT * FROM sizing where id = ${req.params.id}`;
    const queryUpdateImage = `update images set ? where id = ?`;
    const queryUpdateSize = `update sizing set ? where id = ${req.params.id}`;
    let reqBody ={};
    req.body.image.forEach(img => {
        reqBody = {
            public_id: img.public_id,
            link: img.original,
            size: img.size,
        }
    });

    db.query(querySelectSize,(err,result)=>{
        if (err) {
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json(err);
        }
        if(result.length > 0){
            const image_id = result[0].image_id;
            db.query(queryUpdateImage, [reqBody, image_id], (err, result) => {
                if (err) {
                    let notification = {
                        error: true,
                        message: "There is an error !",
                        notification: true
                    }
                    return res.status(400).json({ notification: notification });
                }
                if (result) {
                    const lastId = result.insertId;
                    let data = {
                        image_id: image_id
                    };
                    if (req.body.name) data.name = req.body.name;
                    if (req.body.description) data.description = req.body.description;

                    db.query(queryUpdateSize, [data], (err, result) => {
                        if (err) {
                            let notification = {
                                error: true,
                                message: "There is an error !",
                                notification: true
                            }
                            return res.status(400).json({ notification: notification });
                        }
                        if (result) {
                            let notification = {
                                error: false,
                                message: "Size has been updated",
                                notification: true
                            }
                            return res.status(200).json({ notification: notification });
                        }
                    })
                }
            })
        }
        if(result.length === 0){
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json({ notification: notification});
        }
    })

}

export const editSizing = (req,res)=>{
    if(typeof req.params.id === "undefined"){
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        return res.status(400).json(err);
    }
    const querySelectSize = `SELECT * FROM sizing where id = ${req.params.id}`;
    const querySelectImage = `SELECT * from images where id = ?`;
    db.query(querySelectSize, (err, result) => {
       
        if (err) {
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json(err);
        }
        if (result.length > 0) {
            const sizing = result;

            db.query(querySelectImage,[result[0].image_id],(err,result)=>{
       
                if (err) {
                    let notification = {
                        error: true,
                        message: "There is an error !",
                        notification: true
                    }
                    return res.status(400).json(err);
                }
                if (result.length === 0) {
                    let notification = {
                        error: true,
                        message: "There is an error !",
                        notification: true
                    }
                    return res.status(400).json({ notification: notification});
                }
                if(result.length > 0){
                    return res.status(200).json({sizing:sizing,image:result});
                }
            } )
        }
        if (result.length === 0) {
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
    })


}


export const getAllSizing =(req,res)=>{
    const querySelectSizing = `SELECT
    s.id,
    s.name,
    s.description,
    s.image_id,
    i.public_id,i.link,i.size 
    from sizing as s
    left join images as i on s.image_id = i.id
    group by s.id,
    s.name,
    s.description,
    s.image_id,
    i.public_id,i.link,i.size `;

    db.query(querySelectSizing,(err,result)=>{
        if(err){
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json(err);
        }else{
            return res.status(200).json(result);
        }
    })

}