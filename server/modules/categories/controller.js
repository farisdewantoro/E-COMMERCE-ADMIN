import db from '../../config/conn';
import { 
    validationCreateCategory, 
    validationUpdateCategoryTag, 
    validationCreateCategoryTag, 
    validationUpdateCategory,
    validationUpdateCategoryBanner
} from './validation';
import async from 'async';
export const createCategory = async (req,res)=>{
    try{
        

    const { errors, isValid} = validationCreateCategory(req.body);
    if (!isValid) {
        return res.status(400).json({errors:errors});
    }
    let queryFindSelectNameCategory = `SELECT name from categories where name = '${req.body.category_name}' `;
    db.query(queryFindSelectNameCategory, (err, result) => {
        if (err) return res.status(400).json(err);
        if (result.length > 0) {
            errors.category_name = `Category name already exist`;
            return res.status(400).json({ errors: errors });
        }else{

        }
  
    
    let categories ={
    }

   let queryInsertCategory = `INSERT INTO category`
    if (req.body.category_name) {
        categories.name = req.body.category_name
        categories.slug = req.body.category_name.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };
    // if (req.body.description) data.description = req.body.description;
    let insertCategories = `INSERT INTO categories SET ?`;
    let insertCategoryAttribute = `INSERT INTO category_attribute set ?`;
    let insertCategoryType = `INSERT INTO category_type (category_id,name,slug) values ? `;
    db.query(insertCategories, [categories],(err,result)=>{
        if(err) return res.status(400).json(err);
        if(result){
            async.parallel({
                insertCategoryAttribute: function (callback){
                    db.query(insertCategoryAttribute, [{ category_id: result.insertId, category_tag_id: req.body.tag_id }], (err, result) => {
                        callback(err, "OK");
                    })
                },
                insertCategoryType: function (callback){
                    if(req.body.category_type instanceof Array && req.body.category_type.length > 0){
                        let data = [];
                       req.body.category_type.forEach((ct, i) => {
                            if(ct.name !== '' && typeof ct.name !== "undefined"){
                               data.push([
                                    result.insertId,
                                    ct.name,
                                    ct.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
                                ]);
                            }
                      
                        });
                        if(data instanceof Array && data.length > 0 && data !== null && data !== ''){

                            db.query(insertCategoryType, [data], (err, result) => {
                                callback(err, "OK");
                            })
                        }else{
                            callback(null, null);  
                        }

                     
                    }else{
                        callback(null,null);
                    }
                    
                                  
                }
            },function(err,result){
                    if (err) {
                        return res.status(400).json(err);
                    } else {
                        let notification = {
                            error: false,
                            message: "CATEGORY HAS BEEN CREATED",
                            notification: true
                        }
                        return res.status(200).json({ notification: notification });
                    }
            })
          
        
        }
    });
    });

    }
    catch(err){
        return res.status(400).json(err);
    }
}


export const editCategoryBannerDefault = (req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    let selectCategory = `select * from category_default where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_default_id,
    i.public_id,i.link,i.size
    from category_image_banner_default as cib 
    left join images as i on  cib.image_id = i.id 
    where cib.category_default_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_default_id,
    i.public_id,i.link,i.size
    from category_image_banner_default as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    where cib.category_default_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_default_id,
    i.public_id,i.link,i.size
    from category_image_promo_default as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    where cip.category_default_id = ${id}
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_default_id,
    i.public_id,i.link,i.size
    from category_image_promo_default as cip 
    left join images as i on  cip.image_id = i.id 
    where cip.category_default_id = ${id}
    order by cip.updated_at desc
    `;
    async.parallel({
        default: function (callback) {
            db.query(selectCategory, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}

export const editCategoryBannerType = (req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    let selectCategory = `select * from category_type where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_type_id,
    i.public_id,i.link,i.size
    from category_image_banner_type as cib 
    left join images as i on  cib.image_id = i.id 
    where cib.category_type_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_type_id,
    i.public_id,i.link,i.size
    from category_image_banner_type as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    where cib.category_type_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_type_id,
    i.public_id,i.link,i.size
    from category_image_promo_type as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    where cip.category_type_id = ${id}
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_type_id,
    i.public_id,i.link,i.size
    from category_image_promo_type as cip 
    left join images as i on  cip.image_id = i.id 
    where cip.category_type_id = ${id}
    order by cip.updated_at desc
    `;
    async.parallel({
        type: function (callback) {
            db.query(selectCategory, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}

export const editCategoryBannerTag = (req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    let selectCategory = `select * from category_tag where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_banner_tag as cib 
    left join images as i on  cib.image_id = i.id 
    where cib.category_tag_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_banner_tag as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    where cib.category_tag_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_promo_tag as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    where cip.category_tag_id = ${id}
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_promo_tag as cip 
    left join images as i on  cip.image_id = i.id 
    where cip.category_tag_id = ${id}
    order by cip.updated_at desc
    `;
    async.parallel({
        tag: function (callback) {
            db.query(selectCategory, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}

export const editCategoryBannerCategory = (req,res)=>{
    if(!req.params.id){
      return res.status(400).json(err);
    }
    const id = req.params.id;
    let selectCategory = `select * from categories where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_id,
    i.public_id,i.link,i.size
    from category_image_banner as cib 
    left join images as i on  cib.image_id = i.id 
    where cib.category_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_id,
    i.public_id,i.link,i.size
    from category_image_banner as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    where cib.category_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_id,
    i.public_id,i.link,i.size
    from category_image_promo as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    where cip.category_id = ${id}
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_id,
    i.public_id,i.link,i.size
    from category_image_promo as cip 
    left join images as i on  cip.image_id = i.id 
    where cip.category_id = ${id}
    order by cip.updated_at desc
    `;
    async.parallel({
        category: function (callback) {
            db.query(selectCategory, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}
export const updateCategoryBannerCategory = (req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    const data= req.body;
    if(!data.promo){
        delete data.image_mobile_promo;
        delete data.image_desktop_promo;
    }

    const { errors, isValid } = validationUpdateCategoryBanner(data);

    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    let selectCategory = `select * from categories where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_id,
    cib.image_id,
    cib.image_mobile_id
    from category_image_banner as cib 
    where cib.category_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageBannerPromo = `
    select 
    cip.id,
    cip.category_id,
    cip.image_id,
    cip.image_mobile_id
    from category_image_promo as cip 
    where cip.category_id = ${id}
    order by cip.updated_at desc
    `;

    let updateCategoryBanner= `
    update images set ? where id = ?;
    update images_mobile set ? where id = ?;
    `;
    let insertCategoryBanner = `
    insert into images set ? ;
    insert into images_mobile set ?;
    `;
    let insertCategoryBannerCategory = `
    insert into category_image_banner set ? 
    `;
    let insertCategoryBannerPromo = `
    insert into category_image_promo set ? 
    `;

    let deleteCategoryBanner = `
    delete from images where id = ?;
    delete from images_mobile where id = ?;
    `;
    for (let key in data) {
     
   
        if (Object.keys(data[key]).length !== 0 && (key === 'image_desktop' || key === 'image_mobile' || key === 'image_desktop_promo' || key === 'image_mobile_promo' )){
   
              
                data[key] = {
                    public_id:data[key].public_id, 
                    link:data[key].original,
                    size:data[key].size
                };
         
        }
        if (Object.keys(data[key]).length === 0) {

            delete data[key];
        }
    }



    async.parallel({
        category: function (callback) {
            db.query(selectCategory, (err, result) => {
                callback(err, 'OK')
            })
        },
        category_image_banner:function(callback){
            db.query(selectImageBanner, (err, result) => {
                if(err) return callback(err,null);
                if(result.length > 0){
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop && data.image_mobile){
                        db.query(updateCategoryBanner, [data.image_desktop, image_id, data.image_mobile, image_mobile_id],(err,result2)=>{
                            callback(err,result2);
                        });
                    }
                    if (!data.image_desktop && !data.image_mobile){
                        db.query(deleteCategoryBanner,[image_id,image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
              if(result.length === 0){
                  if (data.image_desktop && data.image_mobile ) {
                  db.query(insertCategoryBanner, [data.image_desktop, data.image_mobile], (err, result2) => {
                      if (err) return callback(err, null);
                      if(result2[0] && result2[1]){
                       
                          let image_id = result2[0].insertId;
                          let image_mobile_id = result2[1].insertId;

                          let data ={
                              category_id:id,
                              image_id: image_id,
                              image_mobile_id: image_mobile_id
                          }
                          db.query(insertCategoryBannerCategory, [data],(err,result2)=>{
                              callback(err, result2);
                          })
                      }
                  });
                }else{
                      callback(null, 'ok');
                }
              }
            })
        },
        category_image_promo:function(callback){
            db.query(selectImageBannerPromo, (err, result) => {
                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop_promo && data.image_mobile_promo ) {
                        db.query(updateCategoryBanner, [data.image_desktop_promo, image_id, data.image_mobile_promo, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop_promo && !data.image_mobile_promo ) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {
                    if (data.image_desktop_promo && data.image_mobile_promo ){
                     
                    db.query(insertCategoryBanner, [data.image_desktop_promo, data.image_mobile_promo], (err, result2) => {
                        if (err) return callback(err, null);
                        if (result2[0] && result2[1]) {

                            let image_id = result2[0].insertId;
                            let image_mobile_id = result2[1].insertId;

                            let data = {
                                category_id: id,
                                image_id: image_id,
                                image_mobile_id: image_mobile_id
                            }
                            db.query(insertCategoryBannerPromo, [data], (err, result2) => {
                                callback(err, result2);
                            })
                        }
                    });

                    }else{
                        callback(null, 'ok');
                    }
                }
            })
        }
    },function(err,result){
            if (err) return res.status(400).json(err);
            if (result){
                let notification = {
                    error: false,
                    message: "CATEGORY BANNER HAS BEEN UPDATED",
                    notification: true
                }
                return res.status(200).json({ notification: notification });
            }
   
    })



}


export const updateCategoryBannerDefault = (req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    const data = req.body;
    if (!data.promo) {
        delete data.image_mobile_promo;
        delete data.image_desktop_promo;
    }

    const { errors, isValid } = validationUpdateCategoryBanner(data);

    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    let selectCategoryTag = `select * from category_default where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_default_id,
    cib.image_id,
    cib.image_mobile_id
    from category_image_banner_default as cib 
    where cib.category_default_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageBannerPromo = `
    select 
    cip.id,
    cip.category_default_id,
    cip.image_id,
    cip.image_mobile_id
    from category_image_promo_default as cip 
    where cip.category_default_id = ${id}
    order by cip.updated_at desc
    `;

    let updateCategoryBanner = `
    update images set ? where id = ?;
    update images_mobile set ? where id = ?;
    `;
    let insertCategoryBanner = `
    insert into images set ? ;
    insert into images_mobile set ?;
    `;
    let insertCategoryBannerCategory = `
    insert into category_image_banner_default set ? 
    `;
    let insertCategoryBannerPromo = `
    insert into category_image_promo_default set ? 
    `;

    let deleteCategoryBanner = `
    delete from images where id = ?;
    delete from images_mobile where id = ?;
    `;
    for (let key in data) {


        if (Object.keys(data[key]).length !== 0 && (key === 'image_desktop' || key === 'image_mobile' || key === 'image_desktop_promo' || key === 'image_mobile_promo')) {


            data[key] = {
                public_id: data[key].public_id,
                link: data[key].original,
                size: data[key].size
            };

        }
        if (Object.keys(data[key]).length === 0) {

            delete data[key];
        }
    }



    async.parallel({
        type: function (callback) {
            db.query(selectCategoryTag, (err, result) => {
                callback(err, 'OK')
            })
        },
        category_image_banner_tag: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop && data.image_mobile) {
                        db.query(updateCategoryBanner, [data.image_desktop, image_id, data.image_mobile, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop && !data.image_mobile) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {
                    if (data.image_desktop && data.image_mobile) {
                        db.query(insertCategoryBanner, [data.image_desktop, data.image_mobile], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {

                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_default_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerCategory, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });
                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        },
        category_image_promo_type: function (callback) {
            db.query(selectImageBannerPromo, (err, result) => {

                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop_promo && data.image_mobile_promo) {
                        db.query(updateCategoryBanner, [data.image_desktop_promo, image_id, data.image_mobile_promo, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop_promo && !data.image_mobile_promo) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {

                    if (data.image_desktop_promo && data.image_mobile_promo) {
                        
                        db.query(insertCategoryBanner, [data.image_desktop_promo, data.image_mobile_promo], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {

                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_default_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerPromo, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });

                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        }
    }, function (err, result) {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY BANNER HAS BEEN UPDATED",
                notification: true
            }
            return res.status(200).json({ notification: notification });
        }

    })
}

export const updateCategoryBannerType = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    const data = req.body;
    if (!data.promo) {
        delete data.image_mobile_promo;
        delete data.image_desktop_promo;
    }

    const { errors, isValid } = validationUpdateCategoryBanner(data);

    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    let selectCategoryTag = `select * from category_type where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_type_id,
    cib.image_id,
    cib.image_mobile_id
    from category_image_banner_type as cib 
    where cib.category_type_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageBannerPromo = `
    select 
    cip.id,
    cip.category_type_id,
    cip.image_id,
    cip.image_mobile_id
    from category_image_promo_type as cip 
    where cip.category_type_id = ${id}
    order by cip.updated_at desc
    `;

    let updateCategoryBanner = `
    update images set ? where id = ?;
    update images_mobile set ? where id = ?;
    `;
    let insertCategoryBanner = `
    insert into images set ? ;
    insert into images_mobile set ?;
    `;
    let insertCategoryBannerCategory = `
    insert into category_image_banner_type set ? 
    `;
    let insertCategoryBannerPromo = `
    insert into category_image_promo_type set ? 
    `;

    let deleteCategoryBanner = `
    delete from images where id = ?;
    delete from images_mobile where id = ?;
    `;
    for (let key in data) {


        if (Object.keys(data[key]).length !== 0 && (key === 'image_desktop' || key === 'image_mobile' || key === 'image_desktop_promo' || key === 'image_mobile_promo')) {


            data[key] = {
                public_id: data[key].public_id,
                link: data[key].original,
                size: data[key].size
            };

        }
        if (Object.keys(data[key]).length === 0) {

            delete data[key];
        }
    }



    async.parallel({
        type: function (callback) {
            db.query(selectCategoryTag, (err, result) => {
                callback(err, 'OK')
            })
        },
        category_image_banner_tag: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop && data.image_mobile) {
                        db.query(updateCategoryBanner, [data.image_desktop, image_id, data.image_mobile, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop && !data.image_mobile) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {
                    if (data.image_desktop && data.image_mobile) {
                        db.query(insertCategoryBanner, [data.image_desktop, data.image_mobile], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {

                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_type_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerCategory, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });
                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        },
        category_image_promo_type: function (callback) {
            db.query(selectImageBannerPromo, (err, result) => {

                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop_promo && data.image_mobile_promo) {
                        db.query(updateCategoryBanner, [data.image_desktop_promo, image_id, data.image_mobile_promo, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop_promo && !data.image_mobile_promo) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {

                    if (data.image_desktop_promo && data.image_mobile_promo) {
                        
                        db.query(insertCategoryBanner, [data.image_desktop_promo, data.image_mobile_promo], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {

                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_type_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerPromo, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });

                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        }
    }, function (err, result) {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY BANNER HAS BEEN UPDATED",
                notification: true
            }
            return res.status(200).json({ notification: notification });
        }

    })
}

export const updateCategoryBannerTag =(req,res)=>{
    if (!req.params.id) {
        return res.status(400).json(err);
    }
    const id = req.params.id;
    const data = req.body;
    if (!data.promo) {
        delete data.image_mobile_promo;
        delete data.image_desktop_promo;
    }

    const { errors, isValid } = validationUpdateCategoryBanner(data);
    
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    let selectCategoryTag = `select * from category_tag where id = ${id} order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_tag_id,
    cib.image_id,
    cib.image_mobile_id
    from category_image_banner_tag as cib 
    where cib.category_tag_id = ${id}
    order by cib.updated_at desc
    `;
    let selectImageBannerPromo = `
    select 
    cip.id,
    cip.category_tag_id,
    cip.image_id,
    cip.image_mobile_id
    from category_image_promo_tag as cip 
    where cip.category_tag_id = ${id}
    order by cip.updated_at desc
    `;

    let updateCategoryBanner = `
    update images set ? where id = ?;
    update images_mobile set ? where id = ?;
    `;
    let insertCategoryBanner = `
    insert into images set ? ;
    insert into images_mobile set ?;
    `;
    let insertCategoryBannerCategory = `
    insert into category_image_banner_tag set ? 
    `;
    let insertCategoryBannerPromo = `
    insert into category_image_promo_tag set ? 
    `;

    let deleteCategoryBanner = `
    delete from images where id = ?;
    delete from images_mobile where id = ?;
    `;
    for (let key in data) {


        if (Object.keys(data[key]).length !== 0 && (key === 'image_desktop' || key === 'image_mobile' || key === 'image_desktop_promo' || key === 'image_mobile_promo')) {


            data[key] = {
                public_id: data[key].public_id,
                link: data[key].original,
                size: data[key].size
            };

        }
        if (Object.keys(data[key]).length === 0) {

            delete data[key];
        }
    }



    async.parallel({
        tag: function (callback) {
            db.query(selectCategoryTag, (err, result) => {
                callback(err, 'OK')
            })
        },
        category_image_banner_tag: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop && data.image_mobile) {
                        db.query(updateCategoryBanner, [data.image_desktop, image_id, data.image_mobile, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop && !data.image_mobile) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {
                    if (data.image_desktop && data.image_mobile) {
                        db.query(insertCategoryBanner, [data.image_desktop, data.image_mobile], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {

                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_tag_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerCategory, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });
                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        },
        category_image_promo_tag: function (callback) {
            db.query(selectImageBannerPromo, (err, result) => {
          
                if (err) return callback(err, null);
                if (result.length > 0) {
                    const image_id = result[0].image_id;
                    const image_mobile_id = result[0].image_mobile_id;
                    if (data.image_desktop_promo && data.image_mobile_promo ) {
                        db.query(updateCategoryBanner, [data.image_desktop_promo, image_id, data.image_mobile_promo, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                    if (!data.image_desktop_promo && !data.image_mobile_promo) {
                        db.query(deleteCategoryBanner, [image_id, image_mobile_id], (err, result2) => {
                            callback(err, result2);
                        });
                    }
                }
                if (result.length === 0) {
                 
                    if (data.image_desktop_promo && data.image_mobile_promo) {
                        
                        db.query(insertCategoryBanner, [data.image_desktop_promo, data.image_mobile_promo], (err, result2) => {
                            if (err) return callback(err, null);
                            if (result2[0] && result2[1]) {
                          
                                let image_id = result2[0].insertId;
                                let image_mobile_id = result2[1].insertId;

                                let data = {
                                    category_tag_id: id,
                                    image_id: image_id,
                                    image_mobile_id: image_mobile_id
                                }
                                db.query(insertCategoryBannerPromo, [data], (err, result2) => {
                                    callback(err, result2);
                                })
                            }
                        });

                    } else {
                        callback(null, 'ok');
                    }
                }
            })
        }
    }, function (err, result) {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY BANNER HAS BEEN UPDATED",
                notification: true
            }
            return res.status(200).json({ notification: notification});
        }

    })
}


export const getAllCategoryBannerCategory = (req,res)=>{
    let selectCategory = `select * from categories order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_id,
    i.public_id,i.link,i.size
    from category_image_banner as cib 
    left join images as i on  cib.image_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_id,
    i.public_id,i.link,i.size
    from category_image_banner as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_id,
    i.public_id,i.link,i.size
    from category_image_promo as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_id,
    i.public_id,i.link,i.size
    from category_image_promo as cip 
    left join images as i on  cip.image_id = i.id 
    order by cip.updated_at desc
    `;

    async.parallel({
        category:function(callback){
            db.query(selectCategory, (err, result) => {
                callback(err,result)
            })
        },
        image_desktop:function(callback){
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile:function(callback){
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    },function(err,results){
        if (err)return res.status(400).json(err);
        if(results) return res.status(200).json(results);
    })


}


export const getAllCategoryBannerDefault = (req,res)=>{
    let selectCategoryType = `select * from category_default order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_default_id,
    i.public_id,i.link,i.size
    from category_image_banner_default as cib 
    left join images as i on  cib.image_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_default_id,
    i.public_id,i.link,i.size
    from category_image_banner_default as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_default_id,
    i.public_id,i.link,i.size
    from category_image_promo_default as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_default_id,
    i.public_id,i.link,i.size
    from category_image_promo_default as cip 
    left join images as i on  cip.image_id = i.id 
    order by cip.updated_at desc
    `;

    async.parallel({
        default: function (callback) {
            db.query(selectCategoryType, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}

export const getAllCategoryBannerType = (req,res)=>{
    let selectCategoryType = `select * from category_type order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_type_id,
    i.public_id,i.link,i.size
    from category_image_banner_type as cib 
    left join images as i on  cib.image_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_type_id,
    i.public_id,i.link,i.size
    from category_image_banner_type as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_type_id,
    i.public_id,i.link,i.size
    from category_image_promo_type as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_type_id,
    i.public_id,i.link,i.size
    from category_image_promo_type as cip 
    left join images as i on  cip.image_id = i.id 
    order by cip.updated_at desc
    `;

    async.parallel({
        type: function (callback) {
            db.query(selectCategoryType, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })
}

export const getAllCategoryBannerTag = (req,res)=>{
    let selectCategoryTag = `select * from category_tag order by created_at desc`;
    let selectImageBanner = `
    select 
    cib.id,
    cib.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_banner_tag as cib 
    left join images as i on  cib.image_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBanner = `
    select 
    cib.id,
    cib.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_banner_tag as cib 
    left join images_mobile as i on  cib.image_mobile_id = i.id 
    order by cib.updated_at desc
    `;
    let selectImageMobileBannerPromo = `
    select 
    cip.id,
    cip.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_promo_tag as cip 
    left join images_mobile as i on  cip.image_mobile_id = i.id 
    order by cip.updated_at desc
    `;
    let selectImageDesktopBannerPromo = `
    select 
    cip.id,
    cip.category_tag_id,
    i.public_id,i.link,i.size
    from category_image_promo_tag as cip 
    left join images as i on  cip.image_id = i.id 
    order by cip.updated_at desc
    `;

    async.parallel({
        tag: function (callback) {
            db.query(selectCategoryTag, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop: function (callback) {
            db.query(selectImageBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile: function (callback) {
            db.query(selectImageMobileBanner, (err, result) => {
                callback(err, result)
            })
        },
        image_desktop_promo: function (callback) {
            db.query(selectImageDesktopBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
        image_mobile_promo: function (callback) {
            db.query(selectImageMobileBannerPromo, (err, result) => {
                callback(err, result)
            })
        },
    }, function (err, results) {
        if (err) return res.status(400).json(err);
        if (results) return res.status(200).json(results);
    })

}


export const updateCategory = async (req, res) => {
    try{
        
    // console.log(req.body);
    if ((typeof req.body.category_name === "undefined" || req.body.category_name === null) && (typeof req.body.id === "undefined" || req.body.id === null)) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }

    const { errors, isValid } = validationUpdateCategory(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    
    let categories = {
    }

  
    if (req.body.category_name) {
        categories.name = req.body.category_name
        categories.slug = req.body.category_name.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };
    let category_id = req.body.id;
    // if (req.body.description) data.description = req.body.description;
    let updateCategories = `UPDATE categories SET ? where id = ${req.body.id}`;
    let insertCategoryAttribute = `INSERT INTO category_attribute set ?`;

    let insertCategoryType = `INSERT INTO category_type (category_id,name,slug) values ? `;
    let querySelectType = `SELECT * from category_type where category_id = ${req.body.id}`;
    let queryDeleteType = `DELETE from category_type where (id) in ? `;



    let queryUpdateCategoryAtt = `update category_attribute set ? where category_id = ${req.body.id}`;
    let querySelectCategoryAtt = `SELECT * from category_attribute where category_id = ${req.body.id}`;
    db.query(updateCategories, [categories], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result) {
        
            async.parallel({
                updateCategoryAtt:function(callback){
                    db.query(querySelectCategoryAtt,(err,result)=>{
                        if(err) return callback(err,null);
                        if(result.length > 0){
                            db.query(queryUpdateCategoryAtt, [{ category_tag_id: req.body.tag_id }], (err, result) => {
                                callback(err, "OK");
                            })
                        }
                        if(result.length === 0){
                            db.query(insertCategoryAttribute,[{category_id:req.body.id,category_tag_id:req.body.tag_id}],(err,result)=>{
                                callback(err, "OK");
                            })
                        }
                    })
                   
                },
           
                insertCategoryType: function (callback) {
                    let data = req.body.category_type.map((ct, i) => {
                        return [
                            req.body.id,
                            ct.name,
                            ct.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
                        ]
                    })
                    db.query(querySelectType, (err, ress) => {
                        if (err) return callback(err, null);
                        if (ress.length > 0) {
                            let old_type_id = ress.map(r=>r.id);
                            let edit_id = req.body.category_type.map(r=>r.id);
                            Array.prototype.diff = function(a){
                                return this.filter(function(i){
                                    return a.indexOf(i) < 0;
                                })
                            }
                            Array.prototype.sameAs = function(a){
                                return this.filter(function(i){
                                    return a.indexOf(i) > -1;
                                })
                            }
                            let deleteArray = old_type_id.diff(edit_id);
                            let sameArray = edit_id.sameAs(old_type_id);
                        
                            let newArrayUpdate = [];
                            let newArrayCreate = [];
                            let newArrayUpdateName = [];
                            let newArrayUpdateSlug = [];
                            req.body.category_type.forEach(ct=>{
                                if(!ct.id){
                                    newArrayCreate.push([category_id,
                                     ct.name,
                                     ct.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')])
                                }
                            });
                            sameArray.forEach(s=>{
                                req.body.category_type.forEach(ct=>{
                                    if(s == ct.id){
                                        newArrayUpdate.push(ct);
                                        newArrayUpdateName.push(
                                            `WHEN id = ${ct.id} then '${ct.name}'`
                                        );
                                        newArrayUpdateSlug.push(
                                            `WHEN id = ${ct.id} then '${ct.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')}'`
                                        )
                                    }
                                })
                            })
                            // console.log({ newArrayUpdate, newArrayCreate, newArrayUpdateName, newArrayUpdateSlug, deleteArray, sameArray, old_type_id, edit_id});
                            async.parallel({
                                update: function (cb) {
                                    if (newArrayUpdate.length > 0) {
                                        let queryUpdateCategoryType = `UPDATE category_type set name = (CASE ${newArrayUpdateName.toString().replace(/[,]/g, ' ')} END), slug = (CASE ${newArrayUpdateSlug.toString().replace(/[,]/g, ' ')} END) where id in ? AND category_id = ${category_id}`;
                                        db.query(queryUpdateCategoryType, [[sameArray]], (err, result) => {
                                            return cb(err, result)
                                        })
                                    } else {
                                        cb(null, null)
                                    }
                                },
                                create: function (cb) {
                                    if (newArrayCreate.length > 0) {
                                        db.query(insertCategoryType, [newArrayCreate], (err, result) => {
                                            return cb(err, result)
                                        })
                                    } else {
                                        cb(null, null)
                                    }
                                },
                                delete: function (cb) {
                                    if (deleteArray.length > 0) {
                                        db.query(queryDeleteType, [[deleteArray]], (err, result) => {
                                            return cb(err, result)
                                        })
                                    } else {
                                        cb(null, null)
                                    }
                                }
                            },function(err,result){
                                callback(err,result);
                            })
                            
                        } else {
                            db.query(insertCategoryType, [data], (err, result) => {
                                callback(err, "OK");
                            })
                        }
                    })
                
                    


                }
            }, function (err, result) {
                if (err) {
                    return res.status(400).json(err);
                } else {
                    let notification = {
                        error: false,
                        message: "CATEGORY HAS BEEN UPDATED",
                        notification: true
                    }
                    return res.status(200).json({ notification: notification });
                }
            })


        }
    });

    }
    catch(err){
        return res.status(400).json(err);
    }
}


export const getAllCategory = (req, res) => {
    let sql = `select 
    c.id,
    c.name,
    c.slug,
    c.created_at,
    c.updated_at,
    ct.name as tag_name,
    ct.id as tag_id
    from categories as c 
    left join category_attribute as ca on c.id = ca.category_id
    left join category_tag as ct on ca.category_tag_id = ct.id            
    order by c.updated_at desc`;
    db.query(sql, (err, results, fields)=>{
  
        if (err) return res.status(400).json(err);
        return res.status(200).json(results);
    })
}

export const getCategoryTypeWithParams =(req,res)=>{
    if (typeof req.params.category_id === "undefined" || req.params.category_id === null) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryFindCategoryType = `SELECT * from category_type where category_id = ${req.params.category_id}`;
    db.query(queryFindCategoryType,(err,result)=>{
        if (err) return res.status(400).json(err);
        if (result.length > 0) {
            return res.status(200).json({ type:result });
        }
        if (result.length === 0) {
            return res.status(400).json({ isEmpty: true });
        }
    })
}

export const getCategoryWithParams = (req,res)=>{
    if (typeof req.params.id === "undefined" || req.params.id === null) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
   
    let queryFindCategoryId = `select 
    c.id,
    c.name,
    c.slug,
    c.created_at,
    c.updated_at,
    ct.name as tag_name,
    ct.id as tag_id
    from categories as c 
    left join category_attribute as ca on c.id = ca.category_id
    left join category_tag as ct on ca.category_tag_id = ct.id   
    where c.id = ?    
    order by c.updated_at desc; SELECT * from category_type where category_id = ? `;

            db.query(queryFindCategoryId,[req.params.id,req.params.id], (err, result) => {
                if (err) return res.status(400).json(err);
                if (result.length > 0) {
                    return res.status(200).json({ category: result[0],type:result[1] });
                }
                if (result.length === 0) {
                    return res.status(400).json({ isEmpty: true });
                }
            })

 
}

export const getAllCategoryTag = (req,res)=>{
    let query=`SELECT * FROM category_tag order by id desc`;
    db.query(query,(err,results)=>{
        if(err) return res.status(400).json(err);
        if(results.length > 0){
            return res.status(200).json(results);
        }
        if(results.length === 0){
            return res.status(400).json({isEmpty:true})
        }
    })
}

export const updateCategoryTag = (req,res)=>{
    const { errors, isValid } = validationUpdateCategoryTag(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }

    let queryUpdate = `UPDATE  category_tag set name = ? where id = ?, slug = ?`;
    let queryFindALl = `SELECT * FROM category_tag order by id desc`;
    db.query(queryUpdate, [req.body.name, req.body.tag_id,req.body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')],(err,result)=>{
        if (err) return res.status(400).json(err);
        if(result){
            let notification = {
                error: false,
                message: "CATEGORY TAG HAS BEEN UPDATED",
                notification: true
            }
            db.query(queryFindALl,(err,result)=>{
                if (err) return res.status(400).json(err);
                if(result.length > 0){
                    return res.status(200).json({ notification: notification,data:result });
                }
                if(result.length === 0){
                    return res.status(400).json({ isEmpty: true });
                }
            })
          
        }
    })

}

export const createCategoryTag = (req,res)=>{
    const { errors, isValid } = validationCreateCategoryTag(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    let queryInsert = `INSERT INTO  category_tag set ?`;
    let queryFindALl = `SELECT * FROM category_tag order by id desc`;
    req.body.slug = req.body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    db.query(queryInsert, [req.body], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY TAG HAS BEEN CREATED",
                notification: true
            }
            db.query(queryFindALl, (err, result) => {
                if (err) return res.status(400).json(err);
                if (result.length > 0) {
                    return res.status(200).json({ notification: notification, data: result });
                }
                if (result.length === 0) {
                    return res.status(400).json({ isEmpty: true });
                }
            })

        }
    })
}

export const deleteCategoryTag = (req,res)=>{
   
    if (typeof req.params.id === "undefined" || req.params.id === null) {
        return res.status(400).json({ errors:'MUST BE PROVIDED' });
    }
    let queryDelete = `DELETE FROM category_tag where id = ? `;
    let queryFindALl = `SELECT * FROM category_tag order by id desc`;
    db.query(queryDelete, [req.params.id], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY TAG HAS BEEN DELETED",
                notification: true
            }
            db.query(queryFindALl, (err, result) => {
                if (err) return res.status(400).json(err);
                if (result.length > 0) {
                    return res.status(200).json({ notification: notification, data: result });
                }
                if (result.length === 0) {
                    return res.status(400).json({ isEmpty: true });
                }
            })

        }
    })
}

export const deleteCategory = (req, res) => {

    if (typeof req.params.id === "undefined" || req.params.id === null) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryDelete = `DELETE FROM categories where id = ? `;
    let queryFindALl = `select 
    c.id,
    c.name,
    c.slug,
    c.created_at,
    c.updated_at,
    ct.name as tag_name,
    ct.id as tag_id
    from categories as c 
    left join category_attribute as ca on c.id = ca.category_id
    left join category_tag as ct on ca.category_tag_id = ct.id            
    order by c.updated_at desc`;
    db.query(queryDelete, [req.params.id], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "CATEGORY HAS BEEN DELETED",
                notification: true
            }
            db.query(queryFindALl, (err, result) => {
                if (err) return res.status(400).json(err);
                if (result.length > 0) {
                    return res.status(200).json({ notification: notification, data: result });
                }
                if (result.length === 0) {
                    return res.status(400).json({ isEmpty: true });
                }
            })

        }
    })
}