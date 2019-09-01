import db from '../../config/conn';
import async from 'async';
import qs from 'query-string';
import keys from '../../config/keys';
import axios from 'axios';
import snap from '../../config/midtrans';
import XLSX from 'xlsx'
import SMS from '../../../SMS';
import Email from '../../../Email';
export const getOrderById = (req, res) => {
    if (req.params.id == null || req.params.id == '' || typeof req.params.id === "undefined") {
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }
    let order_id = req.params.id;

    let queryUpdateOrder = `
    UPDATE orders set orders.order_status_id = 2 
    where orders.order_status_id = 1 and  now() > orders.created_at+interval 4 HOUR
    and orders.id = '${order_id}';
    UPDATE orders
    join order_payment on orders.id = order_payment.order_id
    set orders.order_status_id = 2 
    where orders.order_status_id = 3  and now() > order_payment.transaction_time + interval 1 DAY
    and orders.id = '${order_id}';
    `;

    let queryOrder = `SELECT 
    ord.id,
    ord.user_id,
    ors.status,
    ors.id as order_status_id
    ,ord.created_at 
    from orders as ord 
    left join order_status as ors on ord.order_status_id = ors.id
    where ord.id = '${order_id}' `;

    let queryOrderItems = `SELECT 
    p.name as product_name,
    p.slug as product_slug,
    p.description,
    oi.price,
    oi.order_id,
    c.name as category_name,
    c.slug,
    ct.name as category_type,
    ct.slug as category_type_slug,
    p.id as product_id,
    pa.id as product_attribute_id,
    pv.id as product_variant_id,
    i.link,
    i.public_id,
    pa.size,
    oi.quantity 
    from order_item as oi 
    left join orders as ord on oi.order_id = ord.id
    left join products as p on oi.product_id = p.id
    left join product_category as pc on p.id = pc.product_id 
    left join categories as c on pc.category_id = c.id 
    left join product_attribute as pa on oi.product_attribute_id = pa.id
    left join product_variant as pv on oi.product_variant_id = pv.id
    left join category_type as ct on pv.category_type_id = ct.id
    left join product_image as pi on pi.id = (SELECT pi1.id from product_image as pi1 where pi1.product_id = p.id order by pi1.product_id asc limit 1)
    left join images as i on pi.image_id = i.id
    where ord.id = '${order_id}'`;

    let queryOrderShipment = `SELECT 
    os.courier,
    os.description,
    os.service,
    os.cost,
    os.etd,
    ord.id as order_id 
    from order_shipment as os
    left join orders as ord on os.order_id = ord.id
    where  ord.id = '${order_id}' `;

    let queryOrderVoucher = `SELECT
    v.id as voucher_id,
    v.name as voucher_name,
    v.voucher_type_id as voucher_type,
    v.value,
    ov.order_id
    from order_voucher as ov
    left join vouchers as v on ov.voucher_id = v.id
    left join orders as ord on ov.order_id = ord.id
    where ord.id = '${order_id}'
    `;

    let queryOrderBill = `SELECT * from order_billing where order_id = '${order_id}'`;
    let queryOrderPayment = `SELECT
    op.payment_type,
    op.order_id,
    op.status_code,
    op.transaction_id,
    op.transaction_status,
    op.transaction_time,
    op.pdf_url,
    op.bank,
    op.store,
    op.bill_key,
    op.biller_code,
    op.va_number,
    op.gross_amount,
    op.card_type,
    op.masked_card,
    op.payment_code,
    os.status as order_status_code
    from order_payment as op
    left join orders as ord on op.order_id = ord.id
    left join order_status as os on ord.order_status_id = os.id 
    where ord.id = '${order_id}'
    `;
    let token = `Username:${keys.midtrans.serverKey}:`;
    let queryOrderConfirm = `SELECT 
    orc.order_id,
    orc.note,
    orc.bank,
    orc.nominal_transfer,
    orc.name
    from order_confirm as orc
    left join orders as ord on orc.order_id = ord.id
    where ord.id = '${order_id}'`;

    let queryUpdateStatusOrder = `
    UPDATE orders set orders.order_status_id = (SELECT id from order_status where code = ? limit 1)
    where orders.id = '${order_id}' ;
    UPDATE order_payment set status_code = ? , transaction_status = ? 
    where  order_id = '${order_id}' and transaction_id = ?
    `;
    let queryUpdateOnlyStatus = `UPDATE orders set orders.order_status_id = (SELECT id from order_status where code = ? limit 1)
    where orders.id = ?`;

    let queryUpdatePaymentOrder = ` UPDATE order_payment set status_code = ? , transaction_status = ? 
    where  order_id = '${order_id}' and transaction_id = ?`;
    let queryOrderPaymentInsert = `INSERT into order_payment set ? `;
    let queryOrderResi = `select ors.kodeResi,ors.order_id,ors.courier from order_resi as ors 
    left join orders as ord on ors.order_id = ord.id where ord.id = '${order_id}' `;
    // token =  Buffer.from(token).toString('base64');

    async.parallel({
        // UPDATE ORDER IF < 4 HOURS
        updateOrder: function (callback) {
            db.query(queryUpdateOrder, (err, result) => {
                callback(err, "OK");
            })
        },
        order_status: function (callback) {
            //  FIND ORDER PAYMENT
            db.query(queryOrderPayment, (err, result) => {
                if (err) {
                    callback(err, null);
                }
                if (result && result.length === 0 ||
                    (
                        result.length > 0
                        &&
                        (typeof result[0].payment_status_code === "undefined" || result[0].payment_status_code === '' || result[0].payment_status_code === null)
                        &&
                        (typeof result[0].payment_type === "undefined" || result[0].payment_type === '' || result[0].payment_type === null)
                        &&
                        (typeof result[0].transaction_id === "undefined" || result[0].transaction_id === '' || result[0].transaction_id === null)
                        &&
                        (typeof result[0].transaction_status === "undefined" || result[0].transaction_status === '' || result[0].transaction_status === null)
                    )
                ) {
                    // UPDATE OR INSERT PAYMENT
                    snap.transaction.status(order_id)
                        .then(ress => {

                            if (ress.status_code !== '404') {
                                let dataOrderPayment = {};
                                Object.keys(ress).forEach(rb => {
                                    if (
                                        rb === "fraud_status" ||
                                        rb === "payment_type" ||
                                        rb === "status_code" ||
                                        rb === "transaction_id" ||
                                        rb === "transaction_status" ||
                                        rb === "transaction_time" ||
                                        rb === "pdf_url" ||
                                        rb === "order_id" ||
                                        rb === "masked_card" ||
                                        rb === "bank" ||
                                        rb === "card_type" ||
                                        rb === "payment_code"
                                    ) {

                                        dataOrderPayment[rb] = ress[rb];
                                    }
                                    if (rb === "payment_type" && ress[rb] === "cstore") {
                                        dataOrderPayment["store"] = "indomaret";
                                    }
                                    if (rb === "payment_type" && ress[rb] === "mandiri_clickpay") {
                                        dataOrderPayment["bank"] = "mandiri";
                                    }
                                    if (rb === "payment_type" && ress[rb] === "danamon_online") {
                                        dataOrderPayment["bank"] = "danamon";
                                    }
                                    if (rb === "payment_type" && ress[rb] === "cimb_clicks") {
                                        dataOrderPayment["bank"] = "cimb";
                                    }
                                    if (rb === "payment_type" && ress[rb] === "bri_epay") {
                                        dataOrderPayment["bank"] = "bri";
                                    }
                                    if (rb === "permata_va_number") {
                                        dataOrderPayment["bank"] = "permata";
                                        dataOrderPayment["va_number"] = ress[rb];
                                    }
                                    if (rb === "va_numbers") {
                                        dataOrderPayment["bank"] = ress[rb][0].bank;
                                        dataOrderPayment["va_number"] = ress[rb][0].va_number;
                                    }
                                    if (rb === "gross_amount") {
                                        dataOrderPayment[rb] = parseInt(ress[rb]);
                                    }

                                });
                                if (Object.keys(dataOrderPayment.length > 0)) {

                                    db.query(queryOrderPaymentInsert, [dataOrderPayment], (err, result) => {
                                        if (err) {
                                            callback(err, null);
                                        }
                                        if (result) {
                                            if (ress.status_code.match(/^[4]/g) || ress.status_code.match(/^[5]/g)) {
                                                db.query(queryUpdateOnlyStatus, ['202', dataOrderPayment.order_id], (err, result) => {
                                                    callback(err, 'ok');
                                                })
                                            } else {
                                                callback(null, 'ok');
                                            }

                                        }
                                    });

                                } else {
                                    callback(null, null);
                                }
                            } else {
                                callback(null, null);
                            }
                        }).catch(error => {

                            
                            if (error.ApiResponse) {
                                if (error.ApiResponse.status_code === '404') {
                                    callback(null, null);
                                } else {
                                    callback(error.ApiResponse, null);
                                }

                            }
                        })
                }

                if (result && result.length > 0) {
                    // UPDATE PAYMENT
                    snap.transaction.status(order_id).then(ress => {

                        //  UPDATE STATUS AND ORDER PAYMENT IF NOT CANCEL
                        if (ress.status_code !== result[0].status_code
                            && ress.transaction_status !== "cancel"
                            && (!ress.status_code.match(/^[4]/g) || !ress.status_code.match(/^[5]/g))
                            && (ress.status_code.match(/^[2]/g) && ress.status_code !== '202')
                            && result[0].order_status_code !== "ok") {
                            db.query(queryUpdateStatusOrder, [
                                ress.status_code,
                                ress.status_code,
                                ress.transaction_status,
                                ress.transaction_id], (err, result) => {
                                    callback(err, 'ok');
                                })
                        }

                        // CANCELED BY MIDTRANS
                        if (ress.status_code !== result[0].status_code
                            && result[0].order_status_code !== "ok"
                            && (ress.transaction_status == "cancel" || ress.status_code === '202' || ress.status_code.match(/^[4]/g) || ress.status_code.match(/^[5]/g))
                        ) {
                            db.query(queryUpdateStatusOrder, [
                                "202",
                                ress.status_code,
                                ress.transaction_status,
                                ress.transaction_id], (err, result) => {
                                    callback(err, 'ok');
                                })
                        }


                        //EDIT BY ADMIN AND UPDATE STATUS PAYMENT AND ORDER
                        if (ress.status_code !== result[0].status_code
                            && (!ress.status_code.match(/^[4]/g) || !ress.status_code.match(/^[5]/g))
                            && (ress.status_code.match(/^[2]/g) && ress.status_code !== '202' && ress.transaction_status !== "cancel")
                            && result[0].order_status_code === "ok") {
                            db.query(queryUpdatePaymentOrder, [
                                ress.status_code,
                                ress.status_code,
                                ress.transaction_status,
                                ress.transaction_id], (err, result) => {
                                    callback(err, 'ok');
                                })
                        }
                        // EDIT BY ADMIN AND UPDATE STATUS PAYMENT AND ORDER = CANCEL 
                        if (ress.status_code !== result[0].status_code
                            && result[0].order_status_code === "ok"
                            && (ress.transaction_status === "cancel" || ress.status_code === '202' || ress.status_code.match(/^[4]/g) || ress.status_code.match(/^[5]/g))
                        ) {
                            db.query(queryUpdatePaymentOrder, [
                                "202",
                                ress.status_code,
                                ress.transaction_status,
                                ress.transaction_id], (err, result) => {
                                    callback(err, 'ok');
                                })
                        }
                        if (ress.status_code == result[0].status_code) {
                            callback(null, null);
                        }


                    }).catch(error => {
                        
                        if (error.ApiResponse) {
                            if (error.ApiResponse.status_code === '404') {
                                callback(null, null);
                            } else {
                                callback(error.ApiResponse, null);
                            }

                        }

                    });
                }

            })

        },
        orders: function (callback) {
            db.query(queryOrder, (err, result) => {
                callback(err, result);
            })
        },
        order_item: function (callback) {
            db.query(queryOrderItems, (err, result) => {
                callback(err, result);
            })
        },
        order_shipment: function (callback) {
            db.query(queryOrderShipment, (err, result) => {
                callback(err, result);
            })
        },
        order_voucher: function (callback) {
            db.query(queryOrderVoucher, (err, result) => {
                callback(err, result);
            })
        },
        order_billing: function (callback) {
            db.query(queryOrderBill, (err, result) => {
                callback(err, result);
            })
        },
        order_payment: function (callback) {
            db.query(queryOrderPayment, (err, result) => {
                callback(err, result);
            })
        },
        order_resi:function(callback){
            db.query(queryOrderResi,(err,result)=>{
                callback(err,result);
            })
        },
        order_confirm: function (callback) {
            db.query(queryOrderConfirm, (err, result) => {
                callback(err, result);
            })
        }

    }, function (err, result) {
        if (err) {
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            return res.status(400).json(err);
        }
        if (result) {
            return res.status(200).json({ data: result });
        }
    })
}


export const deleteSelectedOrder = (req,res)=>{
    if (!req.body instanceof Array && req.body.length === 0) {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
    let queryDeleteProduct = `DELETE from orders where id in ?`;
    db.query(queryDeleteProduct, [[req.body]], (err, result) => {
        if (err) return res.status(400).json(err);
        if (result) {
            let notification = {
                error: false,
                message: "ORDER HAS BEEN DELETED",
                notification: true
            }
            return res.status(200).json({ data: result, notification: notification });
        }
    })
}





export const updateSelectedOrder =  (req,res)=>{
    if (!req.body.id instanceof Array && req.body.id.length === 0 || req.body.order_status_id === "" ||typeof req.body.order_status_id === "undefined") {
        return res.status(400).json({ errors: 'MUST BE PROVIDED' });
    }
   

    let queryFindOrder = `SELECT * FROM orders where id in ?`;
  
    db.query(queryFindOrder,[[req.body.id]],(err,result)=>{
        if(err){
            return res.status(400).json(err);
        }
        if(result.length > 0){
            let queryStatusId = [];
            result.forEach(r=>{
                queryStatusId.push(`when order_status_id = ${r.order_status_id} then ${req.body.order_status_id}`);
            });
            const queryUpdateOrder = `UPDATE orders set order_status_id = (case ${queryStatusId.toString().replace(/[,]/g, ' ')} end) where id in ? `;
            
            db.query(queryUpdateOrder,[[req.body.id]],(err,result)=>{
                if (err) {
                    return res.status(400).json(err);
                };
                if(result){
                    let notification = {
                        error: false,
                        message: "ORDER STATUS HAS BEEN UPDATED",
                        notification: true
                    }
                    if (req.body.order_status_id == '6') {
                 
                        let statusEmail = Promise.all(req.body.id.map(id => {
                            return Email.SendEmailUpdateStatus(id, req.body.order_status_id);
                        }));
                        statusEmail.then(s=>{
                            return true
                        }).catch(errStatus=>{
                            console.log(errStatus);
                        });
                        let statusSms = Promise.all(req.body.id.map(id => {
                            return SMS.sendSmsCancel(id);
                        }));
                       

                        statusSms.then(s => {
                            return true
                        }).catch(errStatus => {
                            console.log(errStatus);
                        });
                        
                    }
                    return res.status(200).json({  notification: notification });
                }
            });
        }
        if(result.length === 0){
            return res.status(400).json({errors:'NOT FIND ANY ID'});
        }
    })
  
}


function getDataOrderFull(){
    let querySelectAll = `
    SELECT
    ord.id as order_id,
    ord.user_id,
    ord.order_status_id,
    ord.created_at,
    orb.email,
    orb.phone_number,
    orp.payment_type,
    orp.gross_amount,
    orp.status_code,
    orp.bank,
    orp.va_number,
    orp.payment_code,
    orp.store,
    orp.pdf_url,
    orp.card_type,
    orp.masked_card,
    orp.transaction_id,
    orp.transaction_status,
    orp.transaction_time,
    orp.transaction_time + interval 1 day as expired_date,
    ors.courier,
    ors.description,
    ors.service,
    ors.cost,
    ors.etd,
    os.status as order_status
    from orders as ord
    left join order_billing as orb on ord.id = orb.order_id
    left join order_payment as orp on ord.id = orp.order_id
    left join order_shipment as ors on ord.id = ors.order_id
    left join order_status as os on ord.order_status_id = os.id
    order by ord.updated_at desc `;
   return new Promise((res,rej)=>{
       db.query(querySelectAll,(err,result)=>{
           if (result) return res(result);
           if(err) return rej(rej);
       })
    })
}

export const downloadDataFull =async (req,res)=>{
   let data = await getDataOrderFull();

    let header = Object.keys(data[1]);
    header = header.filter(key=> key !== 'store');
 
    let dataCsv = [
        // ['NIS','Nama','Tanggal Lahir'],[murid.nis,murid.nama,murid.tanggalLahir],
        // ['Kelas','Semester'],[kelas,semester],
        header];

    for (const d of data) {
        dataCsv.push(
            [   d.order_id ? d.order_id: "none",
                d.user_id ? d.user_id: "none",
                d.order_status_id ? d.order_status_id: "none",
                d.created_at ? d.created_at: "none",
                d.email ? d.email: "none",
                d.phone_number ? d.phone_number: "none",
                d.payment_type ? d.payment_type: "none",
                d.gross_amount ? d.gross_amount : "none",
                d.status_code ? d.status_code : "none",
                d.bank ? d.bank : "none",
                d.va_number ? d.va_number : "none",
                d.payment_code ? d.payment_code : "none",
                // d.store ? d.store: "none",
                d.pdf_url ? d.pdf_url: "none",
                d.card_type ? d.card_type : "none",
                d.masked_card ? d.masked_card: "none",
                d.transaction_id ? d.transaction_id : "none",
                d.transaction_status ? d.transaction_status : "none",
                d.transaction_time ? d.transaction_time : "none",
                d.expired_date ? d.expired_date : "none",
                d.courier ? d.courier : "none",
                d.description ? d.description : "none",
                d.service ? d.service  : "none",
                d.cost ? d.cost  : "none",
                d.etd ? d.etd : "none",
                d.order_status ? d.order_status :"none"
            ]
        );
    }
    const ws = XLSX.utils.aoa_to_sheet(dataCsv);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "dataOrderFull");

    var fileName = `dataOrderFull.csv`;
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var buf = XLSX.write(wb, { type: 'buffer', bookType: "csv" });
    res.set('Content-Type', 'text/csv');

    res.send(buf);
}


export const getOrder = (req,res)=>{
    let offset = 0;
    let perPage = 8;
    let category;
    if(req.params.category == "pending"){
        category =`where os.id = 3 order by ord.updated_at desc`;
    }
    if(req.params.category == "onprogress"){
        category = `where os.id = 4 order by ord.updated_at desc`;
    }
    if (req.params.category == "cancelled"){
        category = `where os.id = 2 or os.id =6 order by ord.updated_at desc`;
    }
    if (req.params.category == "completed") {
        category = `where os.id = 5 order by ord.updated_at desc`;
    }
    if (req.params.category == "confirm-payment") {
        category = `where os.id = 7 order by ord.updated_at desc`;
    }
    if (req.params.category == "today") {
        category = `where DATE(ord.created_at) = CURDATE() or DATE(ord.updated_at) = CURDATE() order by ord.updated_at desc `;
    }
        if (typeof req.query.page !== "undefined" && req.query.page > 0) {
        offset = (parseInt(req.query.page) - 1) * perPage;

    }
    let search = req.query;
    
    if (typeof search.search !== "undefined" && search.search !== '' ){
        category = `where 
        ord.id like '%${search.search}%' or
        orb.email like '%${search.search}%' or 
        orb.phone_number like '%${search.search}%' or 
        ors.courier like '%${search.search}%' or 
        orp.status_code like '%${search.search}%' or
        os.status like '%${search.search}%'
        order by ord.updated_at desc
        `;
    }
    const querySelectOrderProgress = `SELECT 
    ord.id as order_id,
    ord.user_id,
    ord.order_status_id,
    ord.created_at,
    ord.updated_at,
    orb.email,
    orb.phone_number,
    orp.payment_type,
    orp.gross_amount,
    orp.status_code,
    orp.transaction_id,
    orp.transaction_status,
    orp.transaction_time,
    ors.courier,
    ors.description,
    ors.service,
    ors.cost,
    ors.etd,
    os.status as order_status,
    orsi.kodeResi,
    orsi.courier as kode_courier
    from orders as ord
    left join order_billing as orb on ord.id = orb.order_id
    left join order_payment as orp on ord.id = orp.order_id
    left join order_shipment as ors on ord.id = ors.order_id
    left join order_status as os on ord.order_status_id = os.id
    left join order_resi as orsi on ord.id = orsi.order_id
    ${category ? category : '  order by ord.updated_at desc '}
  
    limit ${perPage} offset ${offset}  `;

    const queryCountPagination = ` 
    SELECT count(*) as totalPage
    from orders as ord
    left join order_billing as orb on ord.id = orb.order_id
    left join order_payment as orp on ord.id = orp.order_id
    left join order_shipment as ors on ord.id = ors.order_id
    left join order_status as os on ord.order_status_id = os.id
    ${category ? category : ' order by ord.updated_at desc '}
   `;

    async.parallel({
        orders: function (callback) {
            db.query(querySelectOrderProgress, (err, result) => {
                callback(err,result);
            })
        },
        pagination: function (callback) {

            db.query(queryCountPagination, (err, result) => {

                if (err) {
                    callback(err, null);
                }
                if (result.length > 0) {
                    let total_page = Math.ceil(result[0].totalPage / perPage);
                    let current_page = result[0].totalPage / perPage;
                    let data = {
                        total_page: total_page,
                        current_page: (offset / perPage) + 1,
                        perPage: perPage,
                        results: result[0].totalPage
                    }
                    callback(err, data);
                }
                if (result.length === 0) {
                    let data = {
                        total_page: 0,
                        current_page: offset + 1,
                        perPage: perPage,
                        results: 0
                    }
                    callback(err, data);
                }

            });
        }
    }, function (err, result) {
        if (err) return res.status(400).json(err);
        if (result) {
            return res.status(200).json(result);
        }
    })

}


async function sendSms(data,resi) {
    try{
        
    let message = '';
    let name = data.fullname;
    const order_id = data.id;
    const phone_number = data.phone_number;
    const kodeResi=resi.kodeResi;
    const courier = resi.courier;
    if (name.length > 25) {
        name = name.slice(0, 20) + '..';
    }
        message = `Halo, ${name} \nOrder ${order_id} sudah kami kirim dengan nomor resi ${courier.toUpperCase()} : ${kodeResi}. Terimakasih HAMMERSTOUTDENIM`;
    
  
   
    let urlSms = `http://45.32.107.195/sms/smsreguler.php?username=${keys.rajasms.username}&key=${keys.rajasms.key}&number=${phone_number}&message=${message}`;

    let sending = await axios.post(urlSms);
 
    let status = sending.data.match(/^(0)/);
    if (status) {
        return true;
    } else {
        return false;
    }

    }
    catch(err){
        return false; 
    }
}
async function sendEmail(data,resi) {
    let users = [
        {
            email: data.email,
            subject: '[HAMMERSTOUTDENIM] ORDER INFORMATION',
        },

    ];
    let courier = resi.courier.toUpperCase();

 try{
     let sending = await Email.sendEmail({
         to: data.email,
         from: '"HAMMERSTOUTDENIM" <order@hammerstoutdenim.com>',
         subject: `Halo,${data.fullname} \nOrder ${data.id} sudah kami kirim.Terimakasih`,
        html: `<div><p>Halo,<strong>${data.fullname}</strong></p><p>Order&nbsp;<strong>${data.id}&nbsp;</strong>sudah kami kirim dengan nomor resi ${courier}:&nbsp;<strong>${resi.kodeResi}&nbsp;</strong>.<br>Anda dapat melakukan pengecekan resi untuk mengetahui status/posisi barang&nbsp;<a target="_blank" style="color:black;" href="https://hammerstoutdenim.com/track-shipment?order_id=${data.id}">disini&nbsp;</a>atau melalui situs resmi dari ${courier}.</p><p>&nbsp;</p><p>Terimakasih,<br><a target="_blank" style="color:black;" href="https://hammerstoutdenim.com/">HAMMERSTOUTDENIM</a></p><p>Follow us on instagram :<br><a target="_blank" style="color:black;" href="https://instagram.com/hammerstoutdenim/?hl=en">@hammerstoutdenim</a>&nbsp;<a target="_blank" style="color:black;" href="https://www.instagram.com/hammerstout.catalog/">@hammerstout.catalog</a></p></div>`
     
        });
     if (sending && sending.accepted instanceof Array && sending.accepted.length > 0) {
         return true;
     } else {
         return false;
     }
 }catch(err){
     return false;
 }
}
export const updateOrderResi = async (req, res) => {
   
    if (!req.body || !req.body.kodeResi || !req.body.courier || !req.body.order_id) {
            return res.status(400).json('ERROR !!');
    }

     try{
         let order_resi = await querySelectOrderResiById(req.body.order_id);
         let order_data = await queryGetOrderByID(req.body.order_id);
         if(order_data.length === 0){
             return res.status(400).json('ERROR !!');
         }


         let info;
         let sendSmsStatus;
         let sendEmailStatus;
         if(order_resi.length > 0){
             info = await queryUpdateOrderResi(req.body);
             sendSmsStatus = await sendSms( order_data[0],req.body);
             sendEmailStatus = await sendEmail(order_data[0], req.body);  
         }else{
             info = await queryInsertOrderResi(req.body);  
             sendSmsStatus = await sendSms( order_data[0], req.body);     
             sendEmailStatus = await sendEmail(order_data[0], req.body);   
         }
      
         if (sendSmsStatus && sendEmailStatus){
            await queryUpdateNotification(1,req.body.order_id);
         }
         if (!sendSmsStatus && sendEmailStatus) {
             await queryUpdateNotification(2, req.body.order_id);
         }
         if (sendSmsStatus && !sendEmailStatus) {
             await queryUpdateNotification(3, req.body.order_id);
         }
         if (!sendSmsStatus && !sendEmailStatus) {
             await queryUpdateNotification(4, req.body.order_id);
         }

         
         if(info){
             let notification = {
                 error: false,
                 message: "ORDER RESI HAS BEEN UPDATED",
                 notification: true
             }
             return res.status(200).json({ notification: notification});
         }
          
        }
     catch(err){
        return res.status(400).json(err);
     }


    
    



    }


function querySelectOrderResiById(id){
    let querySelectOrderResi = `
        select ord.id from order_resi as ors 
        left join orders as ord on ors.order_id = ord.id
        where ord.id = ?
        `;
    return new Promise((res,rej)=>{
        db.query(querySelectOrderResi,[id],(err,result)=>{
            if(err) return rej(err);
            if(result) return res(result);
        })
    })
}

function queryGetOrderByID(id){
    let querySelectOrder = `
select  
	ord.id,
	orb.email,orb.phone_number,orb.fullname
from orders as ord
left join order_status as ors on ord.order_status_id = ors.id
left join order_payment as orp on ord.id = orp.order_id
left join order_billing as orb on ord.id = orb.order_id
where ors.id = 5 and ord.id = ? 
order by ord.id limit 1
`;
    return new Promise((res, rej) => {
        db.query(querySelectOrder, [id], (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    })

}

function queryUpdateNotification(status,id){
    let updateNotification = `
update orders as ord set ord.send_notification_complete = ? where ord.id = ? ;
`;
    return new Promise((res, rej) => {
        db.query(updateNotification, [status,id], (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    })
}


function queryUpdateOrderResi(data){
    let queryUpdate = `
        update order_resi set ? where order_id = ? 
        `;
    const id = data.order_id;
    return new Promise((res, rej) => {
        db.query(queryUpdate, [data,id], (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    })
}

function queryInsertOrderResi(data){
    let queryInsert = `
        insert into order_resi set ? `;
    return new Promise((res, rej) => {
        db.query(queryInsert, [data], (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    })
}








