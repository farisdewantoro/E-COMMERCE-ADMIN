import db from '../../config/conn';
import async from 'async';
import qs from 'query-string';
import XLSX from 'xlsx'

  function getDataUser(){
      
    let querySelectAll = `
SELECT
u.id,u.fullname,u.email,u.gender,u.birthday,u.phone_number,
p.name as province,r.name as regency,d.name as district,v.name as village,ud.address,ud.postcode
from user as u
left join user_address as ud on u.id = ud.user_id
left join provinces as p on ud.province_id = p.id
left join regencies as r on ud.regency_id = r.id
left join districts as d on ud.district_id = d.id
left join villages as v on ud.village_id = v.id
order by u.created_at desc
`;
    return new Promise((res,rej)=>{
        db.query(querySelectAll,(err,result)=>{
            if(result) res(result);
            if(err) rej(err);
        })
    })

}

function getDataUserEmailPhone() {
    let querySelectAll = `
    SELECT
	u.email,u.phone_number
from user as u
order by u.created_at desc`;
    return new Promise((res, rej) => {
        db.query(querySelectAll, (err, result) => {
            if (result) res(result);
            if (err) rej(err);
        })
    })

}


function getDataUserPhone() {
    let querySelectAll = `
  SELECT
	u.phone_number
from user as u
where u.phone_number != ''
order by u.created_at desc`;
    return new Promise((res, rej) => {
        db.query(querySelectAll, (err, result) => {
            if (result) res(result);
            if (err) rej(err);
        })
    })

}

export const downloadDataUser = async (req,res)=>{
    try{
        
    let data = await getDataUser();

  

    const header = Object.keys(data[1]);
    let dataCsv = [
        // ['NIS','Nama','Tanggal Lahir'],[murid.nis,murid.nama,murid.tanggalLahir],
        // ['Kelas','Semester'],[kelas,semester],
        header];
    for (const d of data) {
        dataCsv.push(
            [
                d.id, 
                d.fullname, 
                d.email,
                d.gender ? d.gender: 'none', 
                d.birthday ? d.birthday  : 'none', 
                d.phone_number ? d.phone_number: 'none', 
                d.province ? d.province  : 'none', 
                d.regency ? d.regency : 'none', 
                d.district ? d.district: 'none', 
                d.village ? d.village: 'none', 
                d.address ? d.address: 'none',
                d.postcode ? d.postcode: 'none'
            ]
            );
    }
  

    const ws = XLSX.utils.aoa_to_sheet(dataCsv);
    const wb = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(wb, ws, "dataUser");

    var fileName = `datauserfull.csv`;
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var buf = XLSX.write(wb, { type: 'buffer', bookType: "csv" });
    res.set('Content-Type', 'text/csv');

    res.send(buf);

    }catch(err){
        return res.status(400).json(err);
    }
 
}

export const downloadOnlyPhone = async (req,res)=>{
    try{
        
    let data = await getDataUserPhone();
    const header = Object.keys(data[1]);
    let dataCsv = [
        // ['NIS','Nama','Tanggal Lahir'],[murid.nis,murid.nama,murid.tanggalLahir],
        // ['Kelas','Semester'],[kelas,semester],
        header];

    for (const d of data) {
        dataCsv.push(
            [ d.phone_number]
        );
    }
    const ws = XLSX.utils.aoa_to_sheet(dataCsv);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "datauserPhone");

    var fileName = `datauserPhone.csv`;
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var buf = XLSX.write(wb, { type: 'buffer', bookType: "csv" });
    res.set('Content-Type', 'text/csv');

    res.send(buf);

    }catch(err){
        return res.status(400).json(err);
    }
}

export const downloadOnlyEmailAndPhoneNumber = async (req, res) => {
    try{
        
    let data = await getDataUserEmailPhone();



    const header = Object.keys(data[1]);
    let dataCsv = [
        // ['NIS','Nama','Tanggal Lahir'],[murid.nis,murid.nama,murid.tanggalLahir],
        // ['Kelas','Semester'],[kelas,semester],
        header];

    for (const d of data) {
        dataCsv.push(
            [d.email,d.phone_number]
        );
    }


    const ws = XLSX.utils.aoa_to_sheet(dataCsv);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "datauserEmailPhone");

    var fileName = `datauserEmailPhone.csv`;
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var buf = XLSX.write(wb, { type: 'buffer', bookType: "csv" });
    res.set('Content-Type', 'text/csv');

    res.send(buf);

    }catch(err){
        return res.status(400).json(err);
    }

}


export const getAll = (req,res)=>{
    let querySearch = '';
    let search;
    let offset = 0;
    let perPage = 4;
    if(req.query.search){
        search = req.query.search;
        querySearch = `
        where u.id like '%${search}%' or  u.fullname like '%${search}%' or u.email like  '%${search}%' 
        or u.phone_number like '%${search}%' or p.name like '%${search}%'
        or r.name like '%${search}%'   or d.name like '%${search}%' or v.name like '%${search}%'
        `
    }

    if (typeof req.query.page !== "undefined" && req.query.page > 0) {
        offset = (parseInt(req.query.page) - 1) * perPage;

    }
  

    let querySelectAll = `
SELECT 
u.id,u.fullname,u.email,u.gender,u.birthday,u.phone_number,
p.name as province,r.name as regency,d.name as district,v.name as village,ud.address,ud.postcode
from user as u
left join user_address as ud on u.id = ud.user_id
left join provinces as p on ud.province_id = p.id
left join regencies as r on ud.regency_id = r.id
left join districts as d on ud.district_id = d.id
left join villages as v on ud.village_id = v.id
${querySearch}
order by u.created_at desc
limit ${perPage} offset ${offset}  
`;

    let queryCountPagination = `
SELECT count(*) as totalPage
from user as u
left join user_address as ud on u.id = ud.user_id
left join provinces as p on ud.province_id = p.id
left join regencies as r on ud.regency_id = r.id
left join districts as d on ud.district_id = d.id
left join villages as v on ud.village_id = v.id
${querySearch}
order by u.created_at desc
`;

async.parallel({
    users: function (callback){
        db.query(querySelectAll, (err, result) => {
            callback(err,result)
        })
    },
    pagination: function (callback){

        db.query(queryCountPagination,(err,result)=>{
         
        if (err) {
            callback(err, null);
        }
        if (result.length > 0) {
            let total_page = Math.ceil(result[0].totalPage / perPage);
            let current_page = result[0].totalPage / perPage;
            let data = {
                total_page: total_page,
                current_page: (offset / perPage) + 1,
                perPage: perPage,
                results: result[0].totalPage
            }
            callback(err, data);
        }
        if (result.length === 0) {
            let data = {
                total_page: 0,
                current_page: offset + 1,
                perPage: perPage,
                results: 0
            }
            callback(err, data);
        }

        });
    }
},function(err,result){
        if (err) return res.status(400).json(err);
        if (result) {
            return res.status(200).json(result);
        }
})
   
   
}