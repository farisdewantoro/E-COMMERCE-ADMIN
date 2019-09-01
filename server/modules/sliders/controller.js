import db from '../../config/conn';
import async from 'async';

function NotUri(link){
    let url = link.match(/^(\/)/);
    if (url instanceof Array && url[0] === '/'){
        return false;
    }else{
        return true;
    }
}

export const updateSlider = (req,res)=>{
    if(req.body.image_desktop.length === 0){
        let notification = {
            error: true,
            message: "IMAGE_DESKTOP MUST BE PROVIDED",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }
    if (req.body.image_mobile.length === 0) {
        let notification = {
            error: true,
            message: "IMAGE MOBILE MUST BE PROVIDED",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }

    let errors = {
        image_desktop:{},
        image_mobile:{}
    };
    req.body.image_desktop.forEach((r, i) => {
        if (r.urlLink.length > 0 && typeof r.urlLink === 'string'){
            if(NotUri(r.urlLink)){
                errors.image_desktop = {
                    index: i
                }
            }
        }
       
    });
    req.body.image_mobile.forEach((r, i) => {
        if (r.urlLink.length > 0 && typeof r.urlLink === 'string') {
            if (NotUri(r.urlLink)) {
                errors.image_mobile = {
                    index: i
                }
            }
        }
    });

    if (Object.keys(errors.image_desktop).length > 0 || Object.keys(errors.image_mobile).length > 0){
        let notification = {
            error: true,
            message: "Link is not valid",
            notification: true
        }
        return res.status(400).json({ errors,notification: notification });
    }
    delete errors.image_desktop;
    delete errors.image_mobile;


    let querySelect = `SELECT * FROM slider_image; select * from slider_image_mobile;`;
    let deleteImages = `DELETE from images where id in ?;DELETE from images_mobile where id in ? `;
    let queryInsert = `INSERT INTO images (public_id,link,size) values ?;
    INSERT INTO images_mobile (public_id,link,size) values ?`;
    let queryInsertSlider = `INSERT INTO slider_image (image_id,link) values ?;INSERT INTO slider_image_mobile (image_mobile_id,link) values ? `;
    function insertData(data_desktop,data_mobile,res){
        db.query(queryInsert, [data_desktop, data_mobile], (err, result) => {
            if (err) return res.status(400).json(err);
            if (result) {
                let firstInsertIdDesktop = result[0].insertId;
                let firstInsertIdMobile = result[1].insertId;
              
                let image_id = [];
                let image_mobile_id = [];
                req.body.image_desktop.forEach((r, i) => {
                    image_id.push([firstInsertIdDesktop + i,r.urlLink]);
                });
                req.body.image_mobile.forEach((r, i) => {
                    image_mobile_id.push([firstInsertIdMobile + i, r.urlLink]);
                });
                db.query(queryInsertSlider, [image_id,image_mobile_id], (err, result) => {
                    if (err) return res.status(400).json(err);
                    if (result) {
                        let notification = {
                                    error: false,
                                    message: "SLIDER HAS BEEN CREATED",
                                    notification: true
                                }
                                return res.status(200).json({  notification: notification });

                    }
                })
            } else {
                return;
            }
        })
    }


    db.query(querySelect,(err,result)=>{
      
        if(err)return res.status(400).json(err);
        if (result[0].length > 0 && result[1].length > 0){
            let old_id_image = result[0].map(r=>r.image_id);
            let old_id_image_mobile = result[1].map(r => r.image_mobile_id);
            db.query(deleteImages, [[old_id_image], [old_id_image_mobile]],(err,result)=>{
                if (err) return res.status(400).json(err);
                if(result){
                    let data_desktop = [];
                    let data_mobile = [];
                    req.body.image_desktop.forEach(image=>{
                        data_desktop.push([image.public_id, image.original,  image.size])
                    });
                    req.body.image_mobile.forEach(image => {
                        data_mobile.push([image.public_id, image.original,  image.size])
                    });

                    insertData(data_desktop,data_mobile,res);

                }else{
                    return;
                }
            })
        }
        if (result[0].length == 0 && result[1].length == 0){
            let data_desktop = [];
            let data_mobile = [];
            req.body.image_desktop.forEach(image => {
                data_desktop.push([image.public_id, image.original,  image.size])
            });
            req.body.image_mobile.forEach(image => {
                data_mobile.push([image.public_id, image.original,  image.size])
            });
            insertData(data_desktop,data_mobile,res);
        }
    });  

}

export const getHomeSlider = (req,res)=>{
    let querySelectImageDesktop = `SELECT i.public_id,i.link,i.size,si.link as urlLink
    from slider_image as si 
    left join images as i on si.image_id = i.id`;
    let querySelectImageMobile = `SELECT i.public_id,i.link,i.size,si.link as urlLink
    from slider_image_mobile as si 
    left join images_mobile as i on si.image_mobile_id = i.id`;
    async.parallel({
        image_desktop:function(cb){
            db.query(querySelectImageDesktop, (err, result) => {
                cb(err,result);
            })
        },
        image_mobile:function(cb){
            db.query(querySelectImageMobile, (err, result) => {
                cb(err, result);
            })
        }
    },function(err,result){
            if (err) return res.status(400).json(err);
            if(result){
                return res.status(200).json(result);
            }
    })


}