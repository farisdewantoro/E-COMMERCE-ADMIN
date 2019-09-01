import keys from '../../config/keys';
import db from '../../config/conn';
import snap from '../../config/midtrans';
import async from 'async';
export const getNotification = (req, res) => {
   
    if (typeof req.body.order_id !== "undefined" && req.body.order_id !== '' && req.body.order_id.length > 0) {
        let queryOrderPayment = `SELECT
    op.payment_type,
    op.order_id,
    op.status_code,
    op.transaction_id,
    op.transaction_status,
    op.transaction_time,
    op.pdf_url,
    os.status as order_status_code
    from order_payment as op
    left join orders as ord on op.order_id = ord.id
    left join order_status as os on ord.order_status_id = os.id 
    where ord.id = ?
    `;

        let queryUpdateStatusOrder = `
    UPDATE orders set orders.order_status_id = (SELECT id from order_status where code = ? limit 1)
    where orders.id = '${req.body.order_id}';
    UPDATE order_payment set status_code = ? , transaction_status = ? 
    where  order_id = '${req.body.order_id}' and transaction_id = ?
    `;


        let queryUpdatePaymentOrder = ` UPDATE order_payment set status_code = ? , transaction_status = ? 
    where  order_id = '${req.body.order_id}' and transaction_id = ?`;

        let queryOrderPaymentInsert = `INSERT into order_payment set ? `;
        async.parallel({
            order_status: function (callback) {
                //  FIND ORDER PAYMENT
                db.query(queryOrderPayment, [req.body.order_id], (err, result) => {
                    if (err) {
                        callback(err, null);
                    }
                    if (result.length === 0 ||
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
                        snap.transaction.notification(req.body).then(ress => {
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
                            callback('error', null);
                        })
                    }

                    if (result.length > 0) {

                        // UPDATE PAYMENT
                        snap.transaction.notification(req.body).then(ress => {
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
                                        callback(err, result);
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
                                        callback(err, result);
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
                                        callback(err, result);
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
                                        callback(err, result);
                                    })
                            }
                            if (ress.status_code == result[0].status_code) {
                                callback(null, null);
                            }
                        }).catch(err => {

                            console.log(err);
                            callback("ERROR", null);
                        });
                    }

                })
            }


        }, function (err, result) {
            if (err) {
                return res.status(503).json('ERROR');
            }
            if (result) {
                return res.status(200).json('OK');
            }
        })
    } else {
        return res.status(503).json('ERROR');
    }
}