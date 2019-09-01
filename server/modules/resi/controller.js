import axios from 'axios';
import qs from 'query-string';
import keys from '../../config/keys';


export const cekResi = (req,res)=>{
    let data = req.body;
    axios({
        method: "POST",
        url: "https://pro.rajaongkir.com/api/waybill",
        headers: {
            "key": keys.rajaongkir.key,
            "content-type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify(data)
    }).then(result => {
        return res.status(200).json(result.data);
    }).catch(err => {
        if (err.response && err.response.data){
            const errors = err.response.data;
            return res.status(400).json(errors);
        }else{
            return res.status(400).json('ERROR!');
        }
        
    })
}