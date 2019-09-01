import midtransClient from 'midtrans-client';
import keys from './keys';
let snap = new midtransClient.Snap({
    isProduction: keys.midtrans.isProduction,
    serverKey: keys.midtrans.serverKey,
    clientKey: keys.midtrans.clientKey
});


export default snap;