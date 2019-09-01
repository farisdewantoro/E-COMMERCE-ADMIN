import db from '../config/conn';
import moment from 'moment';

let queryUpdateStatusCancel = `
UPDATE orders
join order_payment on orders.id = order_payment.order_id
set orders.order_status_id = 2 
where orders.order_status_id = 3  and now() > order_payment.transaction_time + interval 1 DAY;
UPDATE orders set orders.order_status_id = 2
where orders.order_status_id = 1 and now() > orders.created_at + interval 4 hour;
`;


function updateStatus() {
    return new Promise((res, rej) => {
        db.query(queryUpdateStatusCancel, (err, result) => {
            if (err) return rej(err);
            if (result) return res(result);
        })
    });
}

const update_order_status_cancel = async (isRunning) => {
    isRunning = true;
    try {
        await updateStatus();
        isRunning = false;
    }
    catch (err) {
        isRunning = false;
        console.log('ERROR FROM UPDATE_STATUS_CANCEL' + moment().format('LLLL'));
    }
}

export default update_order_status_cancel;