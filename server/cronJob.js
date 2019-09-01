import { CronJob } from 'cron';
import moment from 'moment';
import transaction_notification_pending from './cron/transaction_notification_pending';
import transaction_notification_cancel from './cron/transaction_notification_cancel';
import transaction_notification_progress from './cron/transaction_notification_progress';
import update_order_status from './cron/update_order_status_cancel';

// new CronJob('* * * * * *', function () {
    
//     console.log('You will see this message every second');
// }, null, true, 'Asia/Jakarta');

let isRunning = false;

const job = new CronJob('*/2 * * * *', function () {
    const d = new Date();
   

    if (!isRunning && process.env.NODE_ENV === 'production') {
      
        update_order_status(isRunning);
        transaction_notification_pending(isRunning);
        transaction_notification_cancel(isRunning);
        transaction_notification_progress(isRunning);

        // setTimeout(function () {
        //     console.log('Long running onTick complete:', moment(d).format('LLL'));
        //     isRunning = false;
        // }, 3000);
        // console.log('setTimeout triggered:', new Date());
    }
}, 'Asia/Jakarta');

job.start();