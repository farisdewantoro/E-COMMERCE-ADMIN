import async from 'async';
import db from '../../config/conn';
import keys from '../../config/keys';
import XLSX from 'xlsx';
let querySelectData = `
SELECT 
p.id,p.name as title,p.slug,
p.description,
IF(sum(pa.stock) > 0,'in stock','out of stock') as availability,
'condition',
p.regular_price as price,
'link',
i.public_id,
 i.link as image_link,
 pv.original_color as color,
 c.name as category,
 c.slug as category_slug,
 ct.name as category_type,
ctt.name as category_tag,
pd.discount_value as sale_price
from products as p 
left join product_attribute as pa on p.id = pa.product_id
left join product_discount as pd on p.id = pd.product_id
left join product_image as pi on pi.id = 
(SELECT pi1.id from product_image as pi1 where pi1.product_id = p.id order by pi1.id asc limit 1 )
left join images as i on pi.image_id = i.id
left join product_variant as pv on p.id = pv.product_id
left join product_category as pc on p.id = pc.product_id
left join categories as c on pc.category_id = c.id
left join category_type as ct on c.id = ct.category_id
left join category_attribute as ca on c.id = ca.category_id
left join category_tag as ctt on ca.category_tag_id = ctt.id
group by p.id
`;



function selectData(){
  return new Promise((res,rej)=>{
      db.query(querySelectData, (err, result) => {
          if(err) rej(err);
          if(result) res(result);
      });
    })
  
}

function googleProductCategory(category){
    switch (category) {
        case 'Sweatshirts':
            return `Apparel & Accessories > Clothing > Outerwear`
        case 'T-Shirts':
            return `Apparel & Accessories > Clothing > Shirts & Tops`
        case 'Jackets':
            return `Apparel & Accessories > Clothing > Outerwear > Coats & Jackets`
        case 'Bags':
            return `Apparel & Accessories > Handbag & Wallet Accessories`
        case 'Pants':
            return `Apparel & Accessories > Clothing > Pants`
        case 'Denim':
            return `Apparel & Accessories > Clothing > Pants`
        case 'Headwear':
            return  `Apparel & Accessories > Clothing Accessories > Headwear`
        case 'Short':
            return `Apparel & Accessories > Clothing > Shorts`
        default:
            return `Apparel & Accessories`
    }

}

function getSize(id){
let query = `select pa.size from product_attribute as pa 
left join products as p on pa.product_id = p.id
where p.id =${id}`;

return new Promise((res,rej)=>{
    db.query(query, (err, result) => {
        if (err) return res(null);
        if (result){
            return res(result);
        }
     
    });
})  
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const getDataFeed = async (req,res)=>{
    try{
        
    let data = await selectData();
    
    for (const i in data) {
        let size = await getSize(data[i].id);
        size = size.map(s=>{
            return s.size
        }).toString();
        let imageLink = data[i].public_id.split('/');
        data[i].description = data[i].description ? data[i].description.replace(/(<([^>]+)>)/ig, "") : "";
        data[i].gender = `Unisex`;
        data[i].size = size;
        data[i].condition = 'new';
        data[i].link = `${keys.origin.datafeed}/products/${data[i].category_slug}/${data[i].id}-${data[i].slug}`;
        data[i].image_link = `${keys.media.url}${imageLink[1]+'_low/'}${imageLink[2]}`
        data[i].google_product_category = googleProductCategory(data[i].category);
        data[i].product_type = googleProductCategory(data[i].category);
        data[i].price = `IDR ${data[i].price}`;
        data[i].brand = `Hammerstoutdenim`;
        data[i].gtin = `0000000000${data[i].id}`;
        data[i].mpn = `10000${data[i].id}`;
     
        if (data[i].sale_price) {
            data[i].sale_price =  `IDR ${data[i].sale_price}`;
        }
   
        delete data[i].slug;
        delete data[i].category;
        delete data[i].category_tag;
        delete data[i].category_type;
        delete data[i].category_slug;
    }

    const header = Object.keys(data[1]).filter(x => x !== 'public_id');
    let dataCsv = [
        // ['NIS','Nama','Tanggal Lahir'],[murid.nis,murid.nama,murid.tanggalLahir],
        // ['Kelas','Semester'],[kelas,semester],
        header];

    for (const d of data) {
        dataCsv.push([
            d.id,
            capitalizeFirstLetter(d.title.toLowerCase()),
            d.description,
            d.availability,
            d.condition,
            d.price,
            d.link,
            d.image_link,
            d.color,
            d.sale_price,
            d.gender,
            d.size,
            d.google_product_category,
            d.product_type,
            d.brand,
            d.gtin,
            d.mpn
        ]);
    }
    // let nilaiRapot = this.props.rapot.pelajaran;
    // nilaiRapot.forEach((n, index) => {
    //     dataCsv.push([index + 1, n.mataPelajaran, n.nilai, n.predikat]);
    // });


    // /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(dataCsv);
    const wb = XLSX.utils.book_new();
    // var wscols = [
    //     { wch: 5 },
    //     { wch: 17 },
    //     { wch: 8 },
    //     { wch: 10 }
    // ];

    // ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    
    var fileName = `hammerstoutdeni_datafeed_.csv`;
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var buf = XLSX.write(wb, { type: 'buffer', bookType: "csv" });
    res.set('Content-Type', 'text/csv');
    

    // var wbout = XLSX.write(wb.finalize(), { bookType: 'xlsx', type: 'buffer' });
    res.send(buf);

    }
    catch(err){
        return res.status(400).json('ERROR');
    }
    // /* generate XLSX file and send to client */
    // XLSX.writeFile(wb, `Rapot_${murid.nis}_${kelas}_${semester}.xlsx`);
    // return res.status(200).json(dataCsv);
  
}