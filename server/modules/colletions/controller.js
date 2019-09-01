import db from '../../config/conn';
import {validationCreateCollection} from './validation';
import async from 'async';

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export const addToCollection = (req,res)=>{
    if (!req.body.id instanceof Array && req.body.id.length === 0 || typeof req.body.collectionSelected ==="undefined" ) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let querySelectProductCollection = `SELECT * from product_collection where product_id in ?`;
    let queryInsertProductCollection = `INSERT INTO product_collection (collection_id,product_id) values ?  `;
    let deleteProductCollection = `DELETE from product_collection where product_id in (?) `;
    let querySelectProduct = `select 
p.id,
p.name,
p.slug,
p.description,
p.regular_price,
pc.product_id,
c.slug as category_slug,
c.name as category,
pv.hex_color,
pv.original_color,
pd.discount_percentage,
pd.discount_value,
sum(pa.stock) as stock,
i.public_id,
i.link,
i.size,
ct.name as category_tag,
cty.name as category_type
from products as p 
left join product_category as pc on p.id = pc.product_id 
left join categories as c on pc.category_id = c.id 
left join category_attribute as ca on c.id = ca.category_id
left join category_tag as ct on ca.category_tag_id = ct.id
left join product_variant as pv on p.id = pv.product_id
left join category_type as cty on pv.category_type_id = cty.id
left join product_discount as pd on pd.id = 
(SELECT pd1.id from product_discount as pd1 where p.id = pd1.product_id and now() between pd1.valid_from and pd1.valid_until)
left join product_image as pi on pi.id = (SELECT pi1.id from product_image as pi1 where pi1.product_id = p.id order by pi1.product_id asc limit 1)
left join images as i on pi.image_id = i.id 
left join (SELECT pa1.product_id,SUM(pa1.stock) as stock from product_attribute as pa1  group by pa1.product_id ) pa on (p.id = pa.product_id)
group by p.id,p.name,p.slug,p.description,p.regular_price,pc.product_id,category_slug,category,
pv.hex_color,pv.original_color,pd.discount_percentage,pd.discount_value,pa.stock,i.public_id,
i.link
order by p.updated_at desc
`


    if (!IsJsonString(req.body.collectionSelected) && req.body.collectionSelected === "" || req.body.collectionSelected.length === 0){
        let dataC = [];
        req.body.id.forEach((id, i) => {
            dataC.push(id);
        });
        async.parallel({
            delete: function (callback) {
                db.query(deleteProductCollection, [dataC], (err, result) => {
                    callback(err,result);
                })
            },
            products: function (callback) {
                db.query(querySelectProduct, (err, result) => {
                    callback(err, result);
                })
            }
        }, function (err, result) {
                if (err) {
                    return res.status(400).json(err);
                }
                if (result) {
                    let notification = {
                        error: false,
                        message: "COLLECTION HAS BEEN DELETED",
                        notification: true
                    }
                    return res.status(200).json({ notification: notification, products: result.products });
                }
        })
   
    }
    if (IsJsonString(req.body.collectionSelected)){
        let updateData = [];
        let idUpdate = [];
        let createData =[];
        const collection = JSON.parse(req.body.collectionSelected);
        db.query(querySelectProductCollection, [[req.body.id]], (err, result) => {
            if (err) {
                return res.status(400).json(err);
            }
            if (result.length > 0) {
                let rProductId = result.map(r=>r.product_id);
                let idUpdate = req.body.id.filter(id => rProductId.includes(id));
                 result.filter(r=> idUpdate.includes(r.product_id)).forEach(d=>{
                     updateData.push(`when collection_id = ${d.collection_id} then ${collection.id}`);
                });
                result.filter(r => !idUpdate.includes(r.product_id)).forEach(d => {
                    createData.push([collection.id,d.product_id]);
                });
           
                async.parallel({
                    create:function(callback){
                        if(createData.length > 0){
                            db.query(queryInsertProductCollection, [createData], (err, result) => {
                                callback(err, result);
                            })
                        }else{
                            callback(null, null); 
                        }
                     
                    },
                    update:function(callback){
                        if (idUpdate.length > 0){
                            let queryUpdate = `
                        UPDATE product_collection set 
                        collection_id = (CASE ${updateData.toString().replace(/[,]/g, ' ')} END)
                        where product_id in ?`;
                            db.query(queryUpdate, [[idUpdate]], (err, result) => {
                                callback(err, result);
                            })
                        } else {
                            callback(null, null);
                        }
                  
                    },
                    products:function(callback){
                        db.query(querySelectProduct,(err,result)=>{
                            callback(err,result);
                        })
                    }
                },function(err,result){
                    if(err){
                        return res.status(400).json(err);
                    }
                    
                    if(result){
                        let notification = {
                            error: false,
                            message: "COLLECTION HAS BEEN UPDATED",
                            notification: true
                        }
                        return res.status(200).json({ notification: notification, products: result.products });
                    }
                })
            }
            if(result.length === 0){
                let newCollection = [];
                req.body.id.forEach(id=>{
                    newCollection.push([
                        collection.id,id
                    ])
                })
                async.parallel({
                    create: function (callback) {
                        db.query(queryInsertProductCollection, [newCollection], (err, result) => {
                            callback(err, result);
                        })
                    },
                    products: function (callback) {
                        db.query(querySelectProduct, (err, result) => {
                            callback(err, result);
                        })
                    }
                },function(err,result){
                        if (err) {
                            return res.status(400).json(err);
                        }
                        if (result) {
                            let notification = {
                                error: false,
                                message: "COLLECTION HAS BEEN UPDATED",
                                notification: true
                            }
                            return res.status(200).json({ notification: notification, products: result.products });
                        }
                })
            }
        });
    }


}
export const createNewCollection = (req,res)=>{

    const { errors, isValid } = validationCreateCollection(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    let queryInsertCollection = `INSERT INTO collections set ? `;
    let queryInsertImage = `INSERT INTO images (public_id,link,size) values ?`;
    let queryInsertCollectionImage = `INSERT INTO collection_image (collection_id,image_id) values ?`;

    let queryInsertImageMobile = `INSERT INTO images_mobile (public_id,link,size) values ?`;
    let queryInsertCollectionImageMobile = `INSERT INTO collection_image_mobile (collection_id,image_mobile_id) values ?`;

    async.waterfall([
        function collection(cb){
            db.query(queryInsertCollection, [{ name: req.body.name, slug: req.body.name.toLowerCase().replace(/[^\w]+/g, '').replace(/ +/g, '-') }], (err, result) => {
                if (err) return cb(err,null);
                if (result) {
                    return cb(null,result);
                } else {
                    return cb({ error: "isEmpty" }, null);
                }
            })
        },
        function collection_image(result,cb){
            let ID_Collection = result.insertId;
            let reqBody = [];
            req.body.image_desktop.forEach(img => {
                reqBody.push([img.public_id, img.original, img.size])
            });
            db.query(queryInsertImage, [reqBody], (err, result) => {
                if (err) return cb(err, null);
                if (result) {
                    let FIRST_ID_IMAGE = result.insertId;
                    let dataCollectionImage = [];
                    req.body.image_desktop.forEach((rb, i) => {
                        dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                    });

                    db.query(queryInsertCollectionImage, [dataCollectionImage], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            return cb(null,ID_Collection);
                 
                        } else {
                            return cb({ error: "isEmpty" }, null);
                     
                        }
                    })
                }
            })
        },
        function collection_image_mobile(result,cb){
            let ID_Collection = result;
            let reqBody = [];
            req.body.image_mobile.forEach(img => {
                reqBody.push([img.public_id, img.original, img.size])
            });
            db.query(queryInsertImageMobile, [reqBody], (err, result) => {
                if (err) return cb(err, null);
                if (result) {
                    let FIRST_ID_IMAGE = result.insertId;
                    let dataCollectionImage = [];
                    req.body.image_mobile.forEach((rb, i) => {
                        dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                    });

                    db.query(queryInsertCollectionImageMobile, [dataCollectionImage], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            return cb(null, ID_Collection);

                        } else {
                            return cb({ error: "isEmpty" }, null);

                        }
                    })
                }
            })
        }
    ],function(err,result){
            if(err) return res.status(400).json(err);
            if(result){
                let notification = {
                    error: false,
                    message: "COLLECTION HAS BEEN CREATED",
                    notification: true
                }
                return res.status(200).json({ notification: notification });
            }
           
    })

}

export const updateCollection = (req, res) => {

    const { errors, isValid } = validationCreateCollection(req.body);
    if (!isValid) {
        return res.status(400).json({ errors: errors });
    }
    if(typeof req.params.id === "undefined"){
        errors.isEmpty = "IS EMPTY ID";
        return res.status(400).json({errors:errors});
    }
    let querySelect = `SELECT * from collections where id = ${req.params.id}`;
    let queryDelete = `DELETE from images where id in ?`;
    let queryDeleteMobile = `DELETE from images_mobile where id in ?`;
    let querySelectCollectionImage = `SELECT * from collection_image where collection_id = ${req.params.id}`;
    let querySelectCollectionImageMobile = `SELECT * from collection_image_mobile where collection_id = ${req.params.id}`;
    let queryUpdateCollection = `UPDATE collections set ?  where id = ${req.params.id}`;
    let queryInsertImage = `INSERT INTO images (public_id,link,size) values ?`;
    let queryInsertImageMobile = `INSERT INTO images_mobile (public_id,link,size) values ?`;
    let queryInsertCollectionImage = `INSERT INTO collection_image (collection_id,image_id) values ?`;
    let queryInsertCollectionImageMobile = `INSERT INTO collection_image_mobile (collection_id,image_mobile_id) values ?`;
    async.parallel({
        collections:function(cb){
            db.query(querySelect, (err, result) => {
                if (err) return cb(err, null);
                if (result.length > 0) {
                    db.query(queryUpdateCollection, [{ name: req.body.name, slug: req.body.name.toLowerCase().replace(/[^\w]+/g, '').replace(/ +/g, '-') }], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            return cb(null, 'UPDATED');
                        } else {
                            return cb(null, 'NOT UPDATED');
                        }
                    })
                } else {
                    return cb({ error: "isEmpty" }, null);
                }
            })
        },
        image_desktop:function(cb){
            let ID_Collection = req.params.id;
            let reqBody = [];
            req.body.image_desktop.forEach(img => {
                reqBody.push([img.public_id, img.original, img.size])
            });
            db.query(querySelectCollectionImage, (err, result) => {
                if (err) return cb(err, null);
                if (result.length > 0) {
                    let image_id = result.map(r => r.image_id);
                    db.query(queryDelete, [[image_id]], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            db.query(queryInsertImage, [reqBody], (err, result) => {
                                if (err) return cb(err, null);
                                if (result) {
                                    let FIRST_ID_IMAGE = result.insertId;
                                    let dataCollectionImage = [];
                                    req.body.image_desktop.forEach((rb, i) => {
                                        dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                                    });

                                    db.query(queryInsertCollectionImage, [dataCollectionImage], (err, result) => {
                                        if (err) return cb(err, null);
                                        if (result) {
                                            return cb(null, 'OK');
                                        } else {
                                            return cb({ error: "isEmpty" }, null);
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    db.query(queryInsertImage, [reqBody], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            let FIRST_ID_IMAGE = result.insertId;
                            let dataCollectionImage = [];
                            req.body.image_desktop.forEach((rb, i) => {
                                dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                            });

                            db.query(queryInsertCollectionImage, [dataCollectionImage], (err, result) => {
                                if (err) return cb(err, null);
                                if (result) {

                              
                                    return cb(null, 'OK');


                                } else {
                                    return cb({ error: "isEmpty" }, null);
                                }
                            })
                        }
                    })
                }
            })

        },
        image_mobile:function(cb){
            let ID_Collection = req.params.id;
            let reqBody = [];
            req.body.image_mobile.forEach(img => {
                reqBody.push([img.public_id, img.original, img.size])
            });
            db.query(querySelectCollectionImageMobile, (err, result) => {
                if (err) return cb(err, null);
                if (result.length > 0) {
                    let image_id = result.map(r => r.image_mobile_id);
                    db.query(queryDeleteMobile, [[image_id]], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            db.query(queryInsertImageMobile, [reqBody], (err, result) => {
                                if (err) return cb(err, null);
                                if (result) {
                                    let FIRST_ID_IMAGE = result.insertId;
                                    let dataCollectionImage = [];
                                    req.body.image_mobile.forEach((rb, i) => {
                                        dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                                    });

                                    db.query(queryInsertCollectionImageMobile, [dataCollectionImage], (err, result) => {
                                        if (err) return cb(err, null);
                                        if (result) {
                                            return cb(null, 'OK');
                                        } else {
                                            return cb({ error: "isEmpty" }, null);
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    db.query(queryInsertImageMobile, [reqBody], (err, result) => {
                        if (err) return cb(err, null);
                        if (result) {
                            let FIRST_ID_IMAGE = result.insertId;
                            let dataCollectionImage = [];
                            req.body.image_mobile.forEach((rb, i) => {
                                dataCollectionImage.push([ID_Collection, FIRST_ID_IMAGE + i]);
                            });

                            db.query(queryInsertCollectionImageMobile, [dataCollectionImage], (err, result) => {
                                if (err) return cb(err, null);
                                if (result) {

                                    let notification = {
                                        error: false,
                                        message: "COLLECTION HAS BEEN UPDATED",
                                        notification: true
                                    }
                                    return cb(null, 'OK');


                                } else {
                                    return cb({ error: "isEmpty" }, null);
                                }
                            })
                        }
                    })
                }
            })
        }
    },function(err,result){
            let notification = {
                error: false,
                message: "COLLECTION HAS BEEN UPDATED",
                notification: true
            }
            if(err) return res.status(400).json(err);
            if(result){
                return res.status(200).json({notification:notification,result});
            }
    })
   

}

export const deleteCollection = (req,res)=>{

    if(typeof req.body.collection_id === "undefined"){
        return res.status(400).json("error");
    }
   
    let queryFindCollectionImage = `SELECT ci.image_id from collection_image as ci where ci.collection_id = ${req.body.collection_id}`;
    let queryDelete = `DELETE from images where id in ?`;
    let queryDeleteCollection = `DELETE FROM collections where id = ${req.body.collection_id}`;

    let queryFindCollectionImageMobile = `SELECT ci.image_mobile_id from collection_image_mobile as ci where ci.collection_id = ${req.body.collection_id}`;
    let queryDeleteMobile = `DELETE from images_mobile where id in ?`;


    let querySelectCollection = `SELECT cs.name,cs.slug,cs.id as collection_id,i.public_id,i.link,i.size 
from collections as cs
left join collection_image as ci on ci.id = 
(SELECT ci1.id from collection_image as ci1 where cs.id = ci1.collection_id order by ci1.id asc limit 1)
left join images as i on i.id = (SELECT i1.id from images as i1 where ci.image_id = i1.id order by i1.id asc limit 1)
group by cs.name,cs.slug,cs.id
,i.public_id,i.link,i.size;`;

async.parallel({
    collection_image:function(cb){
        db.query(queryFindCollectionImage, (err, result) => {
            if (err) return cb(err,null);
            if (result.length > 0) {
                let image_id = result.map(r => r.image_id);
                db.query(queryDelete, [[image_id]], (err, result) => {
                    if (err) return cb(err, null);
                    if (result) {
                        return cb(null, 'OK');
                    } else {
                        return res.status(400).json({ error: "isEmpty" });
                    }
                })
            } else {
                return res.status(400).json({ error: "isEmpty" });
            }
        })
    },
    collection_image_mobile:function(cb){
        db.query(queryFindCollectionImageMobile, (err, result) => {
            if (err) return cb(err, null);
            if (result.length > 0) {
                let image_id = result.map(r => r.image_mobile_id);
                db.query(queryDeleteMobile, [[image_id]], (err, result) => {
                    if (err) return cb(err, null);
                    if (result) {
                        return cb(null, 'OK');
                    } else {
                        return res.status(400).json({ error: "isEmpty" });
                    }
                })
            } else {
                return res.status(400).json({ error: "isEmpty" });
            }
        })
    },
    collection_delete:function(cb){
        db.query(queryDeleteCollection, (err, result) => {
          return cb(err,result);
        })
    },
    collection:function(cb){
        db.query(querySelectCollection, (err, result) => {
            if (err) return cb(err, null);
            if (result) {
                return cb(null, result);
            } 
        })

    }
},function(err,result){
    if (err) return res.status(400).json(err);
    if(result){
        let notification = {
            error: false,
            message: "COLLECTION HAS BEEN DELETED",
            notification: true
        }
        return res.status(200).json({ data: result.collection, notification: notification });
    }
})
  
}

export const getAllCollection = (req,res)=>{
    let querySelectCollection = `
    SELECT cs.name,cs.slug,cs.id as collection_id,i.public_id,i.link,i.size 
from collections as cs
left join collection_image as ci on ci.id = (SELECT ci1.id from collection_image as ci1 where cs.id = ci1.collection_id order by ci1.id asc limit 1)
left join images as i on i.id = (SELECT i1.id from images as i1 where ci.image_id = i1.id order by i1.id asc limit 1)
group by cs.name,cs.slug,cs.id,i.public_id,i.link,i.size;`;
    db.query(querySelectCollection,(err,result)=>{
        if(err) return res.status(400).json(err)
        if(result.length > 0){
            return res.status(200).json(result);
        }else{
            return res.status(400).json({ error: "isEmpty" });
        }

    })
}

export const editCollection = (req,res)=>{
    if(typeof req.params.id === "undefined"){
        return res.status(400).json({error:"is Empty"});
    }
    let queryFindCollection = `SELECT * from collections where id = ${req.params.id}`;
    let queryFindCollectionImage = `SELECT 
    ci.id as collection_image_id,
    i.public_id,
    i.link,
    i.size
    from collection_image as ci 
    left join images as i on ci.image_id = i.id
    where ci.collection_id = ${req.params.id}`;

    let queryFindCollectionImageMobile = `SELECT 
    ci.id as collection_image_mobile_id,
    i.public_id,
    i.link,
    i.size
    from collection_image_mobile as ci 
    left join images_mobile as i on ci.image_mobile_id = i.id
    where ci.collection_id = ${req.params.id}`;
    async.parallel({
        collection:function(callback){
            db.query(queryFindCollection, (err, result) => {
                callback(err,result)
            })
        },
        collection_image:function(callback){
            db.query(queryFindCollectionImage,(err,result)=>{
                callback(err, result)
            })
        },
        collection_image_mobile:function(callback){
            db.query(queryFindCollectionImageMobile, (err, result) => {
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