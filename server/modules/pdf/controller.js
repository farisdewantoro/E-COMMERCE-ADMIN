import db from '../../config/conn';
import async from 'async';
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';
import pug from 'pug';
import moment from 'moment';
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const getPDF = (req,res)=>{
    // let html = fs.readFileSync(path.resolve(__dirname,'../../../PDF/invoice.html'),'utf8');
    if (req.body.data.order.length > 0){
        req.body.data.order[0].created_at = moment(req.body.data.order[0].created_at).format('lll')
    }
    if (req.body.data.order_payment.length > 0 && req.body.data.order_item.length > 0){  
        if (req.body.data.order_payment[0].payment_type) req.body.data.order_payment[0].payment_type = req.body.data.order_payment[0].payment_type.replace(/(_)/g," ");
        if (req.body.data.order_payment[0].bank) req.body.data.order_payment[0].bank = req.body.data.order_payment[0].bank.toUpperCase();
        
        let sub_total = req.body.data.order_item.map(ori=>ori.price).reduce((a,b)=>{
            return a+b
        },0);
        req.body.data.order_payment[0].sub_total = sub_total;
    }

    let data = {
        order_billing: req.body.data.order_billing[0],
        order: req.body.data.order[0],
        order_payment: req.body.data.order_payment[0],
        order_item:req.body.data.order_item,
        order_shipment:req.body.data.order_shipment[0]
    };
    if(req.body.data.order_voucher.length > 0){
        data.order_voucher = req.body.data.order_voucher[0];
    }
  

    var html = pug.renderFile(path.resolve(__dirname, '../../../PDF/invoice.pug'),{
        data
    });
    return res.status(200).json(html);
    // let pdfLoc = path.resolve(__dirname,'../../../PDF/data/invoice.pdf');
    // var options = { format: 'A4', timeout: 180000, type: "pdf" };
    // pdf.create(html, options).toFile(pdfLoc, function (err, result) {
    //     if (err) return console.log(err);
    //     if (result){
    //         res.download(pdfLoc);
    //         // var file = fs.createReadStream(pdfLoc);
    //         // var stat = fs.statSync(pdfLoc);
    //         // res.setHeader('Content-Length', stat.size);
    //         // res.setHeader('Content-Type', 'application/pdf');
    //         // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    //         // file.pipe(res);
    //     }
    // });    
    // pdf.create(html, options).toStream(function (err, stream) {
    //     if (err) {
    //         return res.json({
    //             message: 'Sorry, we were unable to generate pdf',
    //         });
    //     }
    //     stream.pipe(res);
    //     });
    //     // let stream2 = fs.readStream(pdf.path);
    //     // var stat = fs.statSync(pdf.path);
  
    //     // let filename = encodeURIComponent(pdf.path);

    //     // res.setHeader('Content-Length', stat.size);
    //     // res.setHeader('Content-Type', 'application/pdf');
    //     // res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');

    //     // // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    //     // stream2.pipe(res);
    // });
}