import db from '../../config/conn';
import { validationCreateProduct, validationUpdateProduct, validationMakeDiscount } from './validation';
import async from 'async';
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export const createProduct =  (req,res) =>{
    if (req.body.isDiscountCard !== true) {
        delete req.body.product_discount;
    }else{
        req.body.product_discount.discount_value = parseFloat(req.body.product_discount.discount_value.replace(/[.\D]/g, ''));
    }
    const { errors, isValid } = validationCreateProduct(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    if (req.body.product_variant.category_type_id){
        req.body.product_variant.category_type_id = req.body.product_variant.category_type_id.value
    }
    if (req.body.product_variant.original_color){
        req.body.product_variant.original_color = req.body.product_variant.original_color.toLowerCase();
    }
  
    req.body.product.slug = req.body.product.name.toLowerCase().replace(/[^\w]+/g, '').replace(/ +/g, '-');
    req.body.product.regular_price = parseFloat(req.body.product.regular_price.replace(/[.\D]/g, ''));

    let queryProduct = `INSERT INTO products set ?`;
    let queryProductCategory = `INSERT INTO product_category set product_id = (SELECT id from products order by id desc limit 1), category_id = ?`;
    let queryProductVariant = `INSERT INTO product_variant set product_id = (SELECT id from products order by id desc limit 1 ), ?`;
    let queryImages = `INSERT INTO images (public_id,link,size) values ?`;
   let queryProductDiscount = `INSERT INTO product_discount set product_id = (SELECT id from products order by id desc limit 1), ?`;
   let queryInsertProductSize = `INSERT into product_size set ? ,product_id = (SELECT id from products order by id desc limit 1)`;
    
    async.parallel({
        product:function(callback){
            db.query(queryProduct, req.body.product, (err, result) => {
                callback(err, result);
            });
        },
        product_category:function(callback){
            db.query(queryProductCategory, req.body.product_category.value, (err, result) => {
                callback(err, result);
            });
        },
        product_size: function (callback) {
            if (IsJsonString(req.body.sizingSelected) && req.body.sizingSelected !== "") {
                let sizing = JSON.parse(req.body.sizingSelected);
                db.query(queryInsertProductSize, [{ sizing_id: sizing.id}], (err, result) => {
                    callback(err, result);
                })
            } else {
                callback(null, null);
            }
        },
        product_variant:function(callback){
            db.query(queryProductVariant, req.body.product_variant, (err, result) => {
                callback(err, result);
            });
        },
        product_attribute:function(callback){
            let dataPA = [];
            req.body.product_attribute.forEach((pa, i) => {
                let s = [
                    `(SELECT id from products order by id desc limit 1 )`,
                    `(SELECT id from product_variant order by id desc limit 1 )`,
                    `'${pa.size}'`,
                    pa.stock
                ];
                dataPA.push(`(${s})`);
            });
            let queryProductAttribute = 
            `INSERT INTO 
            product_attribute  (product_id,product_variant_id,size,stock) values ${dataPA}
            `;

            db.query(queryProductAttribute, (err, result) => {
                callback(err, result);
            });
        },
        product_image:function(callback){
            let dataI =[];
            req.body.images.forEach((image, i) => {
                dataI.push([image.public_id, image.original, image.size]);   
            });

            db.query(queryImages, [dataI], (err, result) => {
                if (err){
                    callback(err, null);
                } if (result){
                    let firstId = result.insertId;
                    let dataPI = [];
                    dataI.forEach((di,i)=>{
                       let p= [`(SELECT id from products order by id desc limit 1)`,
                            `(SELECT id from product_variant order by id desc limit 1)`,
                            firstId + i];
                        dataPI.push(`(${p})`);
                    })
                   
                    let queryProductImages = `
                    INSERT INTO product_image  (product_id,product_variant_id,image_id) 
                    values ${dataPI} `;

                    db.query(queryProductImages, (err, result) => {
                        callback(err, result);
                    })
                }
        
         
            })
        },
        product_discount:function(callback){
            if (typeof req.body.product_discount !== 'undefined') {
                db.query(queryProductDiscount, [req.body.product_discount], (err, result) => {
                    callback(err, result);
                })
            }else{
                callback(null, null);
            }
        }

    },function(err,result){
        if(err){
            return res.status(400).json(err);
        }
        if(result){

            let notification = {
                error: false,
                message: "PRODUCT HAS BEEN CREATED",
                notification: true
            }
            return res.status(200).json({ notification: notification, status: true });
        }
    })
 
 
  
  
  


}

export const removeFromRecommendation = (req,res)=>{
    if (!req.body.id instanceof Array && req.body.id.length === 0) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let data = req.body.id;
    let queryFind = `SELECT * from product_recommendation where product_id in ?`;
    let queryDelete = `DELETE FROM product_recommendation where product_id in ?`;
    db.query(queryFind, [[req.body.id]], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result.length > 0) {
            if (data.length > 0) {
                data = data.map(d => {
                    return [d];
                })
                db.query(queryDelete,[data],(err,result)=>{
                    if(err) return res.status(400).json(err);
                    if(result){
                        let notification = {
                            error: false,
                            message: "REMOVE FROM RECOMMENDATION",
                            notification: true
                        }
                        return res.status(200).json({ notification: notification });
                    }
                })
            }
       
        }
        if (result.length === 0) {
            let notification = {
                error: true,
                message: "NOT FOUND PRODUCT",
                notification: true
            }
            return res.status(200).json({ notification: notification });
        }
    })
}

export const addToRecommendation =(req,res)=>{
    if (!req.body.id instanceof Array && req.body.id.length === 0) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryInsert = `INSERT INTO product_recommendation (product_id) values ?`;
    let queryFind =`SELECT * from product_recommendation where product_id in ?`;
    let data = req.body.id;
    db.query(queryFind,[[req.body.id]],(err,result)=>{
        if (err) return res.status(400).json(err);
        if(result.length > 0){
            for (let key of result ) {
                for (let id of data) {
             
                    if (key.product_id === id){
                 
                        data.splice(data.indexOf(id),1);
                    }
                }
            }
            if(data.length > 0){
                data = data.map(d => {
                    return [d];
                })
                queryInsertData(data, res);
            }
            if(data.length === 0){
                let notification = {
                    error: false,
                    message: "ADD TO RECOMMENDATION",
                    notification: true
                }
                return res.status(200).json({ notification: notification });
            }
        }
        if(result.length === 0){
            data = data.map(d=>{
                return [d];
            })
            queryInsertData(data,res);
        }
    })

    function queryInsertData(data,res){
        db.query(queryInsert, [data], (err, result) => {
            if (err) return res.status(400).json(err);
            if (result) {
                let notification = {
                    error: false,
                    message: "ADD TO RECOMMENDATION",
                    notification: true
                }
                return res.status(200).json({ notification: notification });
            }
        })
    }


}

export const makeDiscount = (req,res)=>{
   
    if(!req.body.id instanceof Array && req.body.id.length === 0){
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    const { errors, isValid } = validationMakeDiscount(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let queryFindProduct = `SELECT p.id as product_id,pd.id as product_discount_id,p.regular_price from products as p
    left join product_discount as pd on p.id = pd.product_id where p.id in ?`;
    let insertProductDiscount = `INSERT INTO product_discount (product_id,discount_percentage,discount_value,valid_from,valid_until) values ?`;
    let updateProductDiscount = `UPDATE from product_discount`;
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
    db.query(queryFindProduct,[[req.body.id]],(err,result)=>{
        if(err) return res.status(400).json(err);
        if(result.length>0){
            let updateDiscountId = [];
            let updateProductId =[];
            let updateDiscountPercentage = [];
            let updateDiscountValue = [];
            let updateDiscountValidFrom = [];
            let updateDiscountValidUntil = [];
            let createDiscount = [];
            let dataProductDiscount = req.body.product_discount;
            result.forEach(r =>{
                if(r.product_discount_id !== "null" && r.product_discount_id ){
                    updateDiscountId.push(r.product_discount_id);
                    updateProductId.push(r.product_id);

                    updateDiscountPercentage.push(`when id = ${r.product_discount_id} then '${dataProductDiscount.discount_percentage}'`);

                    updateDiscountValue.push(`when id = ${r.product_discount_id} then ${r.regular_price - r.regular_price * dataProductDiscount.discount_percentage / 100}`);

                    updateDiscountValidFrom.push(`when id=${r.product_discount_id} then '${dataProductDiscount.valid_from}'`);

                    updateDiscountValidUntil.push(`when id = ${r.product_discount_id} then '${dataProductDiscount.valid_until}'`);
                }else{
                    createDiscount.push([r.product_id, dataProductDiscount.discount_percentage, r.regular_price - r.regular_price * dataProductDiscount.discount_percentage / 100, dataProductDiscount.valid_from, dataProductDiscount.valid_until]);
                }
            });
            async.parallel({
                create:function(callback){
                    if(createDiscount.length > 0){
                        db.query(insertProductDiscount, [createDiscount],(err,result)=>{
                            if(err) return callback(err,null);
                            if(result){
                                return callback(err,result);
                            }
                        })
                    }else{
                        return callback(null,null);
                    }
                },
                update:function(callback){
                    if (updateDiscountId.length > 0){
                        let queryUpdateProductDiscount = `UPDATE product_discount set discount_percentage = (CASE ${updateDiscountPercentage.toString().replace(/[,]/g, ' ')} END), discount_value = (CASE ${updateDiscountValue.toString().replace(/[,]/g, ' ')} END), valid_from = (CASE ${updateDiscountValidFrom.toString().replace(/[,]/g, ' ')} END), valid_until = (CASE ${updateDiscountValidUntil.toString().replace(/[,]/g, ' ')} END) where id in ? AND product_id in ?`;
                        db.query(queryUpdateProductDiscount, [[updateDiscountId], [updateProductId]],(err,result)=>{
                            if(err) return callback(err,null);
                            if(result){
                                return callback(null,result);
                            }
                        })
                    }else{
                        return callback(null,null);
                    }
                }
            },function(err,result){
                if(err) return res.status(400).json(err);
                if(result){
                    let notification = {
                        error: false,
                        message: "DISCOUNT HAS BEEN CREATED",
                        notification: true
                    }
                    db.query(querySelectProduct,(error,results)=>{
                        if (error) return res.status(400).json(error);
                        return res.status(200).json({ notification: notification, status: true,product:results });
                    })
                    
          
                } 
                
            })
        }
    })
  
}

export const editProduct = (req,res)=>{
    if ((typeof req.params.product_slug === "undefined" || req.params.product_slug === null) && (typeof req.params.id === "undefined" || req.params.id === null) ) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryFindProduct = `SELECT name,regular_price,slug,description from products where id = ${req.params.id} and slug = '${req.params.product_slug}'`;
    let queryFindProductVariant =`SELECT 
    pv.id,
    pv.original_color,
    pv.hex_color,
    pv.category_type_id,
    pv.product_id,
    ct.name as type
    from product_variant as pv
    left join category_type as ct on pv.category_type_id = ct.id
    where product_id = ${req.params.id}`;
    let queryFindProductDiscount = `SELECT discount_percentage,discount_value,valid_from,valid_until FROM product_discount where product_id = ${req.params.id}`;
    let queryFindProductAttribute = `SELECT * from product_attribute where product_id = ${req.params.id}`;
    let queryFindProductCategory = `SELECT c.name,c.id  from categories as c
    left join product_category as pc on c.id = pc.category_id where pc.product_id = ${req.params.id}`;
    let queryFindImage = `SELECT 
    i.public_id,
    i.link,
    i.size,
    i.id as image_id,
    pi.id as product_image_id
    from images as i 
    left join product_image as pi on i.id = pi.image_id where pi.product_id = ${req.params.id}`;

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

    const queryProductSize = `
    SELECT
    s.id,
    s.name,
    s.description,
    s.image_id,
    i.public_id,i.link,i.size 
    from product_size as ps 
    left join sizing as s on ps.sizing_id = s.id
    left join images as i on s.image_id = i.id
    where ps.product_id = ${req.params.id}
    group by s.id,
    s.name,
    s.description,
    s.image_id,
    i.public_id,i.link,i.size`

    async.parallel({
        product:function(callback){
            db.query(queryFindProduct,(err,result)=>{
               callback(err,result[0]);
            })
        },
        product_variant:function(callback){
            db.query(queryFindProductVariant,(err,result)=>{
                callback(err,result[0]);
            })
        },
        product_discount:function(callback){
            db.query(queryFindProductDiscount,(err,result)=>{
                callback(err,result[0]);
            })
        },
        product_category:function(callback){
            db.query(queryFindProductCategory,(err,result)=>{
                callback(err,result[0]);
            })
        },
        product_attribute:function(callback){
            db.query(queryFindProductAttribute,(err,result)=>{
                callback(err, result);
            })
        },
        product_image:function(callback){
            db.query(queryFindImage,(err,result)=>{
                callback(err, result);
            })
        },
        product_size:function(callback){
            db.query(queryProductSize,(err,result)=>{
                callback(err,result);
            })
        },
        sizing:function(callback){
            db.query(querySelectSizing,(err,result)=>{
                callback(err,result);
            })
        }
    
    },function(err,result){
        if (err) return res.status(400).json(err);
        if(result){
            return res.status(200).json(result);
        }
    })
}

export const updateProduct=(req,res)=>{

    if ((typeof req.params.product_slug === "undefined" || req.params.product_slug === null) && (typeof req.params.id === "undefined" || req.params.id === null || req.body.product_variant.id === null || typeof req.body.product_variant.id === "undefined")) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    if (req.body.isDiscountCard !== true) {
        delete req.body.product_discount;
    } else {
        if (typeof req.body.product_discount.discount_value !== "number"){
            req.body.product_discount.discount_value = parseFloat(req.body.product_discount.discount_value.replace(/[.\D]/g, ''));
        }
        
    }
    if (req.body.product_variant.original_color) {
        req.body.product_variant.original_color = req.body.product_variant.original_color.toLowerCase();
    }
    const { errors, isValid } = validationUpdateProduct(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
   
    let product_slug = req.params.product_slug;
    let product_id = req.params.id;
    let product_variant_id = req.body.product_variant.id;
    let queryUpdateProduct = `UPDATE products set ? where id = ${product_id} `;

    let queryFindCategory = `SELECT * from product_category where product_id = ${product_id} `;
    let queryUpdateProductCategory = `UPDATE product_category set ? where product_id = ${product_id}`;
    let queryInsertProductCategory =`INSERT INTO product_category set ?,product_id = ${product_id}`;

    let queryFindProductVariant = `SELECT * from product_variant where product_id = ${product_id}  AND id = ${product_variant_id} `;
    let queryUpdateProductVariant = `UPDATE product_variant set ? where product_id = ${product_id}  AND id = ${product_variant_id} `;
    let queryInsertProductVariant = `INSERT INTO product_variant set ?, product_id = ${product_id}`;

    let queryFindProductDiscount = `SELECT * from product_discount where product_id = ${product_id}`;
    let queryUpdateProductDiscount = `UPDATE product_discount set ? where product_id =${product_id}`;
    let queryInsertProductDiscount = `INSERT INTO product_discount set ? ,product_id =${product_id} `;
    let queryDeleteProductDiscount = `DELETE from product_discount where product_id = ${product_id}`;

    let queryFindProductAttribute = `SELECT * from product_attribute where product_id = ${product_id}`;
    let queryDeleteProductAttribute = `DELETE from product_attribute where (id) in ?`;
    let queryInsertProductAttribute = `INSERT INTO product_attribute (product_id,product_variant_id,size,stock) values ?`;

    let queryFindProductImage = `SELECT * from product_image where product_id = ${product_id} and product_variant_id = ${product_variant_id}`;
    let queryDeleteImage = `DELETE FROM images where id in ?`;
    // let queryInsertImages = `INSERT INTO images (public_id,link,caption,alt,tag) values (?)`;
    let queryInsertImages = `INSERT INTO images (public_id,link,size) values ?`;
    let queryInsertProductImages = `INSERT INTO product_image (product_id,image_id,product_variant_id) values ? `;
    let queryFindProductSize = `SELECT * from product_size where product_id = ${product_id}`;
    let queryInsertProductSize =`INSERT into product_size set ?`;
    let queryUpdateProductSize = `UPDATE product_size set ? where product_id = ${product_id}`;
    let queryDeleteProductSize = `DELETE from product_size where product_id = ${product_id}`;
    async.parallel({
        product:function(callback){
            db.query(queryUpdateProduct,[req.body.product],(err,result)=>{
                callback(err,result);
            })
        },
        product_size:function(callback){
            db.query(queryFindProductSize,(err,result)=>{
                if(err){
                    callback(err,null);
                }
                if(result.length > 0){
                    
                    if (IsJsonString(req.body.sizingSelected) && req.body.sizingSelected !== ""){
                        let sizing = JSON.parse(req.body.sizingSelected);
                        db.query(queryUpdateProductSize,[{sizing_id:sizing.id}],(err,result)=>{
                            callback(err,result);
                        })
                    }else{
                        db.query(queryDeleteProductSize,(err,result)=>{
                            callback(err, result);
                        })
                    }
                }
                if(result.length === 0){
                    if (IsJsonString(req.body.sizingSelected) && req.body.sizingSelected !== "") {
                        let sizing = JSON.parse(req.body.sizingSelected);
                        db.query(queryInsertProductSize, [{ sizing_id: sizing.id,product_id:product_id }], (err, result) => {
                            callback(err, result);
                        })
                    }else{
                        callback(null,null);
                    }
                }
            })
        },
        product_category:function(callback){
            db.query(queryFindCategory,(err,result)=>{
                if(err) return callback(err,null);
                if(result.length > 0){
                    db.query(queryUpdateProductCategory,[{category_id:req.body.product_category.value}],(err,result)=>{
                        callback(err, result);
                    })
                }else{
                    db.query(queryInsertProductCategory, [{ category_id: req.body.product_category.value }], (err, result) => {
                        callback(err, result);
                    })
                }
            })
        },
        product_variant:function(callback){
        
            db.query(queryFindProductVariant,(err,result)=>{
                let data = {
                    hex_color: req.body.product_variant.hex_color,
                    original_color: req.body.product_variant.original_color
                    
                }
                if (typeof req.body.product_variant.category_type_id !== "undefined" && req.body.product_variant.category_type_id !== null && req.body.product_variant.category_type_id !== '' && typeof req.body.product_variant.category_type_id.value !== "undefined"){
                    data.category_type_id = req.body.product_variant.category_type_id.value;
                }


                if(err) return callback(err,null);
                if(result.length > 0){
                  
                    let product_variant = req.body.product_variant;
                  
                    db.query(queryUpdateProductVariant,[data],(err,result)=>{
                        callback(err,result);
                    });
                }else{
                    db.query(queryInsertProductVariant, [data],(err,result)=>{
                        callback(err, result);
                    })
                }
            })
        },
        product_discount:function(callback){
            db.query(queryFindProductDiscount,(err,result)=>{
                if (err) return callback(err, null);
                if (req.body.isDiscountCard){
                    if(result.length > 0){
                        db.query(queryUpdateProductDiscount,[req.body.product_discount],(err,result)=>{
                            callback(err,result);
                        })
                    }else if(result.length == 0){
                        db.query(queryInsertProductDiscount,[req.body.product_discount],(err,result)=>{
                            callback(err, result);
                        })
                    }
                }else{
                    if (result.length > 0) {
                        db.query(queryDeleteProductDiscount,(err, result) => {
                            callback(err, result);
                        })
                    }else{
                        callback(err,result);
                    }
                }
            })
        },
        product_attribute:function(callback){
            db.query(queryFindProductAttribute,(err,result)=>{
           
                if (err) return callback(err, null);
                if(result.length > 0){
                    let oldId = result.map(old=>old.id);
                   
                    let editId = req.body.product_attribute.map(pa=>pa.id);

                    Array.prototype.diff = function (a) {
                        return this.filter(function (i) { return a.indexOf(i) < 0; });
                    };
                    Array.prototype.sameAs = function (a) {
                        return this.filter(function (i) {
                             return a.indexOf(i) > -1; 
                            });
                    };        

                    let deleteArray = oldId.diff(editId);
                    let sameArray = editId.sameAs(oldId);
                
                    let newArrayUpdate = [];
                    let newArrayUpdateSize =[]; 
                    let newArrayUpdateStock = []; 
                    let newArrayCreate = [];
                    req.body.product_attribute.forEach(pa => {
                        if (!pa.id) {
                            newArrayCreate.push([product_id,product_variant_id,pa.size,pa.stock]);
                        }
                    })

                    sameArray.forEach(s => {
                            req.body.product_attribute.forEach(pa => {
                                if (s == pa.id) {
                                    newArrayUpdate.push(pa);
                                    newArrayUpdateSize.push(`WHEN id =${pa.id} then '${pa.size}'`);
                                    newArrayUpdateStock.push(`WHEN id =${pa.id} then ${pa.stock}`);
                                }
                            })
                    })
                   
                    async.parallel({
                 
                        update:function(cb){
                            if (newArrayUpdate.length > 0 ){
                                let queryUpdateProductAttribute = `UPDATE product_attribute set size = (CASE ${newArrayUpdateSize.toString().replace(/[,]/g, ' ')} END), stock = (CASE ${newArrayUpdateStock.toString().replace(/[,]/g, ' ')} END) where id in ? AND product_id = ${product_id}`;
                                db.query(queryUpdateProductAttribute, [[sameArray]], (err, result) => {
                                    return cb(err, result)
                                })
                            }else{
                                cb(null,null)
                            }
                        },
                        create:function(cb){
                            if (newArrayCreate.length > 0){
                                db.query(queryInsertProductAttribute, [newArrayCreate],(err,result)=>{
                                    return cb(err, result)
                                })
                            } else {
                                cb(null, null)
                            }
                        },
                        delete:function(cb){
                            if (deleteArray.length > 0){
                                db.query(queryDeleteProductAttribute, [[deleteArray]], (err, result) => {
                                    return cb(err, result)
                                })
                            } else {
                                cb(null, null)
                            }
                        }
                    },function(err,result){
                            callback(err,result)
                    })

                }else{
                    let newArrayCreate = [];
                    req.body.product_attribute.forEach(pa => {
                        if (!pa.id) {
                            newArrayCreate.push([product_id, product_variant_id, pa.size, pa.stock]);
                        }
                    })
                    db.query(queryInsertProductAttribute, [newArrayCreate], (err, result) => {
                        return callback(err, result)
                    })
                }
            })
        },
        product_image:function(callback){
            db.query(queryFindProductImage,(err,result)=>{
            
                if(err) return callback(err,null);
                if(result.length> 0){
                    let image_id = [];
                    result.forEach(r=>{
                        image_id.push(r.image_id);
                    })
                    db.query(queryDeleteImage,[[image_id]],(err,result)=>{
                      
                        if(err) return callback(err,null);
                        if(result){
                            let values = [];
                            req.body.images.forEach((image, i) => {
                                values.push([image.public_id, image.original,image.size]);
                            });
                            db.query(queryInsertImages, [values], (err, result) => {
                                if (err) return callback(err, null);
                                if (result) {
                                    let firstInsertId = result.insertId;
                                    let data_product_variant = [];
                                    req.body.images.forEach((image, i) => {
                                        data_product_variant.push([product_id, firstInsertId + i, product_variant_id]);
                                    });
                                    db.query(queryInsertProductImages, [data_product_variant], (err, result) => {
                                        if (err) return callback(err, null);
                                        if (result) {
                                            return callback(null, result);
                                        }
                                    })

                                }

                            })
                        }
                    });
                }else{
                    let values = [];
                    req.body.images.forEach((image, i) => {
                        values.push([image.public_id, image.original,image.size]);
                    });
                    db.query(queryInsertImages, [values], (err, result) => {
                        if (err) return callback(err, null);
                        if (result) {
                            let firstInsertId = result.insertId;
                            let data_product_variant = [];
                            req.body.images.forEach((image, i) => {
                                data_product_variant.push([product_id, firstInsertId+i, product_variant_id]);
                            });
                            db.query(queryInsertProductImages,[data_product_variant],(err,result)=>{
                                if(err) return callback(err,null);
                                if(result){
                                    return callback(null,result);
                                }
                            })
                           
                        }

                    })
                }
            })
        }

    },function(err,result){
            if (err) return res.status(400).json(err);
            if (result) {
                let notification = {
                    error: false,
                    message: "PRODUCT HAS BEEN UPDATED",
                    notification: true
                }
                return res.status(200).json({ notification: notification });
        
            }
    })
  
}

export const deleteProduct = (req,res)=>{
    if (!req.body instanceof Array && req.body.length === 0 ) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryDeleteProduct = `DELETE from products where id in ?`;

    let queryFindProduct = `select 
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
(SELECT pd1.id from product_discount as pd1 where p.id = pd1.id and now() between pd1.valid_from and pd1.valid_until)
left join product_image as pi on pi.id = (SELECT pi1.id from product_image as pi1 where pi1.product_id = p.id order by pi1.product_id asc limit 1)
left join images as i on pi.image_id = i.id 
left join (SELECT pa1.product_id,SUM(pa1.stock) as stock from product_attribute as pa1  group by pa1.product_id ) pa on (p.id = pa.product_id)
group by p.id,p.name,p.slug,p.description,p.regular_price,pc.product_id,category_slug,category,
pv.hex_color,pv.original_color,pd.discount_percentage,pd.discount_value,pa.stock,i.public_id,
i.link
order by p.updated_at desc
`
    db.query(queryDeleteProduct,[[req.body]],(err,result)=>{
        if(err) return res.status(400).json(err);
        if(result){
            db.query(queryFindProduct,(err,result)=>{
                if (err) return res.status(400).json(err);
                if(result){
                    let notification = {
                        error: false,
                        message: "PRODUCT HAS BEEN DELETED",
                        notification: true
                    }
                    return res.status(200).json({ data: result, notification: notification})
                }
            })
        }
    })
}



export const getProduct = (req, res) => {
 
    let querySearch;
    if(typeof req.query.search !== "undefined" && req.query.search !== '' && typeof req.query.category === "undefined"){
        let search = req.query.search;
        querySearch = `where p.name like '%${search}%' or
       c.name like '%${search}%' or
       pv.hex_color like '%${search}%' or
       pv.original_color like '%${search}%' or
       ct.name like '%${search}%' or
       cty.name like '%${search}%'
       `;
    }
    let query = `select 
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
cty.name as category_type,
col.name as collection,
col.slug as collection_slug,
col.id as collection_id

${typeof req.query.filter !== "undefined" ? ('from product_recommendation as pce left join products as p on pce.product_id = p.id') : 'from products as p'}
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
left join product_collection as pco on p.id = pco.product_id 
left join collections as col on pco.collection_id = col.id
${typeof req.query.category !== "undefined" ?  (`where col.slug = '${req.query.category}'`):''}
${typeof querySearch !== "undefined" ? querySearch:''}

group by p.id,p.name,p.slug,p.description,p.regular_price,pc.product_id,category_slug,category,
pv.hex_color,pv.original_color,pd.discount_percentage,pd.discount_value,pa.stock,i.public_id,
i.link
order by p.updated_at desc
`
    let queryFindCollections = `SELECT * from collections`;
    async.parallel({
        collections: function (callback) {
            db.query(queryFindCollections, (err, result) => {
                callback(err, result);
            })
        },
        products:function(callback){
            db.query(query, (err, result) => {
                callback(err, result);
            })
        }
    },function(err,result){
            if (err)
                return res.status(400).json(err)
           if(result){
               return res
                   .status(200)
                   .json(result);
           } 
    })


}