import db from '../config/conn';
import async from 'async';
import Email from '../../Email';
import moment from 'moment';
import axios from 'axios';
import keys from '../config/keys';
let queryTimeSend = `
select  
	ord.id,ord.user_id,ord.order_status_id,ord.send_notification_progress,
	orb.email,	orb.phone_number,orb.fullname,
	ors.status,ors.code,
	orp.payment_type,orp.transaction_time,orp.transaction_status,
	orp.transaction_time + interval 1 day as expired_date
from orders as ord
left join order_status as ors on ord.order_status_id = ors.id
left join order_payment as orp on ord.id = orp.order_id
left join order_billing as orb on ord.id = orb.order_id
where ors.id = 4  and ord.send_notification_progress = 0
order by orp.transaction_time asc 
`;

let queryUpdateNotification = `
update orders as ord set ord.send_notification_progress = ? where ord.id = ? ;
`;







async function sendSms(data) {
    try{
        
    let message = '';
    let name = data.fullname;
    const order_id = data.id;
    const phone_number = data.phone_number;
    if (name.length > 25) {
        name = name.slice(0, 20) + '..';
    }
    message = `Halo, ${name} \nPembayaran untuk Kode order ${order_id} sudah kami terima order anda sedang kami proses. Terimakasih, HAMMERSTOUTDENIM`;
   

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



function getTime() {
    return new Promise((res, rej) => {
        db.query(queryTimeSend, (err, result) => {

            if (err) return rej(err);
            if (result) return res(result);
        })
    });
}

function updateNotification(status, id) {
    return new Promise((res, rej) => {
        db.query(queryUpdateNotification, [status, id], (err, result) => {

            if (err) return rej(err);
            if (result) return res(result);
        })
    });
}

const transaction_notification_progress = async (isRunning) => {
    try{
        
    isRunning = true;
    let currentDate = new Date();
    let time = await getTime();

    if (time.length > 0) {
        let sendDate = new Date(time[0].transaction_time);

        if (sendDate < currentDate) {
       
            let sendSmsStatus = await sendSms(time[0]);
            console.log(`ONPROGRESS - SENDING TO #${time[0].id} - ${moment(currentDate).format('LLL')}`)
            if (sendSmsStatus){
                await updateNotification(1, time[0].id);
            }else{
                await updateNotification(2, time[0].id);
            }
      

            isRunning = false;
        } else {

            isRunning = false;
        }
    } else {

        isRunning = false;
    }

    }
    catch(err){
        isRunning = false;
    }
}

export default transaction_notification_progress;