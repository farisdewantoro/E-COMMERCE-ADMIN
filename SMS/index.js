import db from '../server/config/conn';
import keys from '../server/config/keys';
import axios from 'axios';

const queryOrderBilling = `
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

const sendSmsCancel = async (id) =>{
    try {
        let order_billing = await getOrder(queryOrderBilling,id);
        let message = '';
        let name = order_billing[0].fullname;
        const order_id = order_billing[0].id;
        const phone_number = order_billing[0].phone_number;
        if (name.length > 25) {
            name = name.slice(0, 20) + '..';
        }
        message = `Halo, ${name} \nPesanan anda dengan Order ID ${order_id} telah kami batalkan, Untuk informasi lebih lanjut kontak kami WA : 081221183839. HAMMERSTOUTDENIM`;
        let urlSms = `http://45.32.107.195/sms/smsreguler.php?username=${keys.rajasms.username}&key=${keys.rajasms.key}&number=${phone_number}&message=${message}`;

        let sending = await axios.post(urlSms);
        return sending;
        // let status = sending.data.match(/^(0)/);
        // if (status) {
        //     return true;
        // } else {
        //     return false;
        // }

    }
    catch (err) {
        return false;
    }
}

export default {
    sendSmsCancel
}