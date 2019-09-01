import db from '../../config/conn';
import Email from '../../../Email';
import moment from 'moment';
import keys from '../../config/keys';
import jwt from 'jsonwebtoken';
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



 function getOrder(query,id){
   return  new Promise((res,rej)=>{
       db.query(query,[id],(err,result)=>{
             if(err) return rej(err);
             if(result) return res(result);
         })
     })
 }


export const previewMail = async (req,res)=>{
    try{
        
    let users = [
        {
            email: 'devfarisdewantoro@gmail.com',
            subject:'TESTING BROH',
        },

    ];
        const c_order_id = '344O1393'
        let order = await getOrder(queryOrder,c_order_id);
        let order_item = await getOrder(queryOrderItems, c_order_id);
        let order_billing = await getOrder(queryOrderBilling,c_order_id);
        let order_payment = await getOrder(queryOrderPayment,c_order_id);
        let order_shipment = await getOrder(queryOrderShipment,c_order_id)
        let order_voucher = await getOrder(queryOrderVoucher,c_order_id);
    
        let token_order = {
            uniqueID: c_order_id
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
    return res.status(200).send(info[0].email.html);

    }
    catch(err){

        return res.status(400).json(err);
    }
}


export const sendMail = async (req,res)=>{
    try{
        const c_order_id = '625OC8AB'
    let users = [
        {
            name: 'Joe',
            email: 'devfarisdewantoro@gmail.com',
            subject: `AWAITING PAYMENT - ORDER ID #${c_order_id}`
        },
     
    ];
    
        let order = await getOrder(queryOrder, c_order_id);
        let order_item = await getOrder(queryOrderItems, c_order_id);
        let order_billing = await getOrder(queryOrderBilling, c_order_id);
        let order_payment = await getOrder(queryOrderPayment, c_order_id);
        let order_shipment = await getOrder(queryOrderShipment, c_order_id)
        let order_voucher = await getOrder(queryOrderVoucher, c_order_id);

        let token_order = {
            uniqueID: c_order_id
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

        Email.loadTemplate('order-pending', users).then(result=>{
    if(result){
    let info = result.map((res2) => {
       return Email.sendEmail({
            to: res2.context.email,
           from: '"HAMMERSTOUTDENIM" <farisdewantoro@hammerstoutdenim.com>',
           subject: res2.context.subject,
            html: res2.email.html
        });
    });
    return Promise.all(info).then((result)=>{
        return res.status(200).json('ok');
    }).catch((err)=>{
        console.log(err);
    })

    }
});

    }
    catch(err){
        return res.status(400).json(err);
    }

}
