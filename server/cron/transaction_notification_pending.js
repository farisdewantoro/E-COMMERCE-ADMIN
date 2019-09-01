import db from '../config/conn';
import async from 'async';
import Email from '../../Email';
import moment from 'moment';
import axios from 'axios';
import keys from '../config/keys';

import jwt from 'jsonwebtoken';
let queryTimeSend = `
select  
	ord.id,ord.user_id,ord.order_status_id,ord.send_notification_pending,
	orb.email,orb.phone_number,orb.fullname,
	ors.status,ors.code,
	orp.payment_type,orp.transaction_time,orp.transaction_status,
	orp.transaction_time + interval 1 day as expired_date,
	orp.transaction_time + interval 6 hour as send_notification_time
from orders as ord
left join order_status as ors on ord.order_status_id = ors.id
left join order_payment as orp on ord.id = orp.order_id
left join order_billing as orb on ord.id = orb.order_id
where ors.id = 3 and (orp.payment_type = 'bank_transfer' or orp.payment_type = 'bank_transfer_manual') and ord.send_notification_pending = 0
order by orp.transaction_time asc limit 1
`;

let queryUpdateNotification = `
update orders as ord set ord.send_notification_pending = ? where ord.id = ? ;
`;
const queryOrder = `
select 
    ord.id,
    ord.created_at,
    ors.status
 from orders as ord
 left join order_status as ors on ord.order_status_id = ors.id 
 where ord.id = ?
 `;
const queryOrderPayment = `SELECT
    op.payment_type,
    op.order_id,
    op.status_code,
    op.transaction_id,
    op.transaction_status,
    op.transaction_time,
    op.pdf_url,
    op.bank,
    op.store,
    op.va_number,
    op.gross_amount,
    op.bill_key,
    op.biller_code,
    op.card_type,
    op.masked_card,
    op.payment_code,
    os.status as order_status_code,
    op.transaction_time + interval 1 day as expired_date
    from order_payment as op
    left join orders as ord on op.order_id = ord.id
    left join order_status as os on ord.order_status_id = os.id 
    where ord.id = ?
    `;
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
    where ord.id = ? `;

let queryOrderShipment = `SELECT 
    os.courier,
    os.description,
    os.service,
    os.cost,
    os.etd,
    ord.id as order_id 
    from order_shipment as os
    left join orders as ord on os.order_id = ord.id
    where ord.id = ?  `;

let queryOrderVoucher = `SELECT
    v.id as voucher_id,
    v.name as voucher_name,
    v.voucher_type_id as voucher_type,
    v.value,
    ov.order_id
    from order_voucher as ov
    left join vouchers as v on ov.voucher_id = v.id
    left join orders as ord on ov.order_id = ord.id
    where ord.id = ?
    `;


let queryOrderBilling = `
 select 
	ord.id,
	orb.fullname,
	orb.email,
	orb.phone_number,
	orb.province,
	orb.regency,
	orb.district,
	orb.village,
	orb.postcode,
	orb.address
from orders as ord
left join order_billing as orb on ord.id = orb.order_id
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

async function sendEmail(data){
    try{
        
    let users = [
        {
            email: data.email,
            subject: `[HAMMERSTOUTDENIM] AWAITING PAYMENT - ORDER ID #${data.id}`
        },
    ];
        let order = await getOrder(queryOrder, data.id);
        let order_item = await getOrder(queryOrderItems, data.id);
        let order_billing = await getOrder(queryOrderBilling, data.id);
        let order_payment = await getOrder(queryOrderPayment, data.id);
        let order_shipment = await getOrder(queryOrderShipment, data.id)
        let order_voucher = await getOrder(queryOrderVoucher, data.id);

        let token_order = {
            uniqueID: data.id
        }
        order[0].link = keys.origin.url + '/my-account/orders/detail/' + jwt.sign(token_order, keys.jwt.secretOrPrivateKey2, { expiresIn: keys.jwt.expiresIn });
        order[0].created_at = moment(order.created_at).format('L');
        order_payment[0].expired_date = moment(order_payment.expired_date).format('LLL');
        const sub_total = order_item.map(oi => {
            return oi.price
        }).reduce((a, b) => {
            return a + b
        }, 0);
        order_payment[0].sub_total = sub_total;

        users[0].order = order[0];
        users[0].order_items = order_item;
        users[0].order_billing = order_billing[0];
        users[0].order_payment = order_payment[0];
        users[0].order_shipment = order_shipment[0];
        if (order_voucher.length > 0) users[0].order_voucher = order_voucher[0];

        let info = await Email.loadTemplate('order-pending', users);
        if(info){
       let sending=  await Email.sendEmail({
                    to: info[0].context.email,
                    from: '"HAMMERSTOUTDENIM" <order@hammerstoutdenim.com>',
                    subject: info[0].context.subject,
                    html: info[0].email.html
                });


        if (sending && sending.accepted instanceof Array && sending.accepted.length > 0) {
            return true;
        } else {
            return false;
        }
 
    }

    }
    catch(err){
        return false;
    }
}

async function sendSms(data){
    try{
        
    let message = '';
    let name = data.fullname;
    const order_id = data.id;
    const phone_number = data.phone_number;
    if (name.length > 25) {
        name = name.slice(0, 20) + '..';
    }
    const tanggal_expired = moment(data.expired_date).format('LLL');
    message = `Halo, ${name} \nPembayaran untuk ${order_id} belum kami terima. Tolong lakukan pembayaran sebelum tanggal ${tanggal_expired}. Terimakasih, HAMMERSTOUTDENIM`;


    let urlSms = `http://45.32.107.195/sms/smsreguler.php?username=${keys.rajasms.username}&key=${keys.rajasms.key}&number=${phone_number}&message=${message}`;

   let sending = await axios.post(urlSms);
   console.log(sending);
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



function getTime(){
   return new Promise((res,rej)=>{
        db.query(queryTimeSend,(err,result)=>{
         
            if(err) return rej(err);
            if(result) return res(result);
        })
    });
}

function updateNotification(status,id){
    return new Promise((res, rej) => {
        db.query(queryUpdateNotification, [status,id], (err, result) => {

            if (err) return rej(err);
            if (result) return res(result);
        })
    });
}

const transaction_notification = async (isRunning)=>{
    try{
        
    isRunning = true;
    let currentDate = new Date();
    let time = await getTime();
 
    if(time.length > 0){
        let sendDate = new Date(time[0].send_notification_time);
   
        if (sendDate < currentDate ){
           let sendEmailStatus =  await sendEmail(time[0]);
           let sendSmsStatus = await sendSms(time[0]);
            console.log(`PENDING - SENDING TO #${time[0].id} - ${moment(currentDate).format('LLL')}`)
            if (sendEmailStatus && sendSmsStatus){
               await updateNotification(1,time[0].id);
            }
            if (sendEmailStatus && !sendSmsStatus){
                await updateNotification(2, time[0].id);
            }
            if (!sendEmailStatus && sendSmsStatus) {
                await updateNotification(3, time[0].id);
            }
            if (!sendEmailStatus && !sendSmsStatus) {
                await updateNotification(4, time[0].id);
            }
      
            isRunning = false;
        }else{
            
            isRunning = false;
        }
    }else{
    
        isRunning = false;
    }

    }
    catch(err){
        console.log('FAILED SENDING ' + currentDate);
        isRunning = false;
    }
}

export default transaction_notification;