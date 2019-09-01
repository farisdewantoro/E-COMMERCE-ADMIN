import db from '../../config/conn';
import async from 'async';
import keys from '../../config/keys';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Jimp from 'jimp';


function getNumber(data) {
    let d = data.match(/^([^_]+)/g);
    return d[0];
}

export const deleteMediaImage = async (req, res) => {
    if (req.body.length > 0 && req.query.media) {
        try {
            let media = req.query.media;
            let count = 0;
            let status1 = req.body.map(f => {
                const path1 = path.resolve(__dirname, `../../../media/${f.link}`);
                if (fs.existsSync(path1)) {
                    return new Promise((resv, rej) => {
                        fs.unlink(path1, function (err) {
                            if (err) return rej(err);
                            return resv(f.link);
                        });
                    });
                }

            });
            let status2 = req.body.map(f => {
                let image = f.link.split('/');
                const path2 = path.resolve(__dirname, `../../../media/${media + "_low"}/${image[2]}`);
                if (fs.existsSync(path2)) {
                    return new Promise((resv, rej) => {
                        fs.unlink(path2, function (err) {
                            if (err) return rej(err);
                            return resv(`${media + "_low"}/${image[2]}`);
                        });
                    });
                }
            });
            status1 = Promise.all(status1);
            status2 = Promise.all(status2);
            const image_normal = await status1;
            const image_low = await status2;

            return res.status(200).json({
                image_normal,
                image_low
            });
        }
        catch (err) {
            return res.status(400).json(err);
        }

    }
}

// export const getMoreMediaImage = (req, res) => {
//     if (!req.query.media) {
//         return res.status(400).json({ msg: 'No directory' });
//     }


//     const media = req.query.media;
//     let file = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
//     if (req.query.search) {
//         file = file.filter(f => f.toLowerCase().indexOf(req.query.search) > -1);

//     }
//     let listFile = file.map(f => {
//         let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${f}`))
//         let url = `/${media}/${f}`;
//         return {
//             link: url,
//             ...stat
//         }
//     });
//     console.log(listFile.length);
//     let currentPage = parseInt(req.query.currentPage);
//     if (!req.query.currentPage) {
//         currentPage = 1
//     }
//     let beforePage = parseInt(req.query.currentPage)-1;
//     let perPage = 24;
//     let totalPage = Math.ceil(listFile.length / perPage);


//     listFile = listFile.sort((a, b) => {
//         return b.birthtime - a.birthtime;
//     });

//     listFile = listFile.filter((a, i) => i > (beforePage * perPage) && i < (currentPage * perPage) );
//     let pagination = {
//         currentPage,
//         perPage,
//         totalPage
//     }

//     return res.status(200).json(listFile);
// }

export const getMediaImage = (req, res) => {
    if (!req.query.media) {
        return res.status(400).json({ msg: 'No directory' });
    }


    const media = req.query.media;
    let file = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
    if (req.query.search) {
        file = file.filter(f => 
                (f.toLowerCase().indexOf(req.query.search) > -1 || f.toLowerCase().indexOf(req.query.search.replace(/\s/g, '_')) > -1 )
            );

    }
    let listFile = file.map(f => {
        let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${f}`))
        let url = `/${media}/${f}`;
        return {
            link: url,
            ...stat
        }
    });

    let currentPage = 1;
    if (req.query.currentPage) {
        currentPage = parseInt(req.query.currentPage);
    }
    let perPage = 24;
    let totalPage = Math.ceil(listFile.length / perPage);


    listFile = listFile.sort((a, b) => {
        return b.birthtime - a.birthtime;
    });
    listFile = listFile.filter((a, i) => i < currentPage * perPage);
    let pagination = {
        currentPage,
        perPage,
        totalPage
    }

    return res.status(200).json({
        listFile, pagination
    });
}



async function constraintImage(buffer, quality = 100, drop = 10) {
    try {
        const done = await sharp(buffer)
            .jpeg({ quality: quality, progressive: true, force: false })
            .webp({ quality: quality, lossless: true, force: false })
            .png({ quality: quality, compressionLevel: 8, force: false })
            .toBuffer();
        if (done.byteLength > 250000 && quality > 10) {
            return constraintImage(buffer, quality - drop);
        }

        return done;
    }
    catch (err) {
        return err;
    }
}
async function constraintImageResize(buffer, quality = 100, drop = 10) {
    try {
        const done = await sharp(buffer)
            .resize(600, 600)
            .jpeg({ quality: quality, progressive: true, force: false })
            .webp({ quality: quality, lossless: true, force: false })
            .png({ quality: quality, compressionLevel: 8, force: false })
            .toBuffer();
        if (done.byteLength > 250000 && quality > 10) {
            return constraintImageResize(buffer, quality - drop);
        }

        return done;
    }
    catch (err) {
        return err;
    }
}

async function resizeImage(f,media){
    try{
        const file_name = f.name.replace(/\s/g, '_');
        const bufferData = await constraintImage(f.data);
        const info = await sharp(bufferData).toFile(path.resolve(__dirname, `../../../media/${media}/${file_name}`));
        return info
    }catch(err){
        return err;
    }
  
}
async function resizeImageLow(f, media) {
    try{
        const file_name = f.name.replace(/\s/g, '_');
        const bufferData = await constraintImageResize(f.data);
        const info = await sharp(bufferData).toFile(path.resolve(__dirname, `../../../media/${media + '_low'}/${file_name}`));
        return info
    } catch (err) {
        return err;
    }
  
}
async function JimpResizeLow(f, media) {
    const img = await Jimp.read(f.data);
    const file_name = f.name.replace(/\s/g, '_');
    return new Promise((resv, rej) => {
        let status = img
            .resize(600,600)
            .quality(60) // set JPEG quality
            .write(path.resolve(__dirname, `../../../media/${media}_low/${file_name}`)); // save
        if (status) {
            return resv(status);
        } else {
            return rej('ERROR');
        }

    })
}
async function JimpResize(f,media){
    const img =  await Jimp.read(f.data);
    const file_name = f.name.replace(/\s/g, '_');
    return new Promise((resv,rej)=>{
        let status= img
            .quality(60) // set JPEG quality
            .write(path.resolve(__dirname, `../../../media/${media}/${file_name}`))
            if(status){
            return resv(status);
        }else{
            return rej('ERROR');
        }

    })
    
   
        // .then(lenna => {
        //     return lenna
        //         .resize(256, 256) // resize
        //         .quality(60) // set JPEG quality
        //         .greyscale() // set greyscale
        //         .write('lena-small-bw.jpg'); // save
        // })
        // .catch(err => {
        //     console.error(err);
        // });
}

export const uploadImage = async (req, res) => {
    let notificationErr = {
        error: true,
        message: "Filename already exist",
        notification: true
    }
    try {
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        if (!req.query.media) {
            return res.status(400).json({ msg: 'No directory' });
        }
        const media = req.query.media;

        if (req.files.file instanceof Array && req.files.file.length > 0) {
            const file_list = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
            const checkList = req.files.file.map(f => {
                return file_list.indexOf(f.name.replace(/\s/g, '_'));
            }).filter(b => b !== -1);
            if (checkList.length > 0) {
                return res.status(400).json(notificationErr);
            }

    


            let status1 = [];
            for (const f of req.files.file) {
                let resultData = await JimpResize(f, media);
                status1.push(resultData);
            }

            status1 = await Promise.all(status1);
            const unvalidResult1 = status1.filter(r => (r instanceof Error));

            let status2 = [];
            if (media === 'produk') {
                for (const f of req.files.file) {
                    let resultData2 = await JimpResizeLow(f, media);
                    status2.push(resultData2);
                }
                status2 = await Promise.all(status2);
                const unvalidResult2 = status2.filter(r => (r instanceof Error));
                if (unvalidResult2.length > 0) {
                    notificationErr.message = (unvalidResult2.length) + ' File Failed to upload';
                    return res.status(400).json(notificationErr);
                }
            }

            if (unvalidResult1.length > 0) {
                notificationErr.message = (unvalidResult1.length) + ' File Failed to upload';
                return res.status(400).json(notificationErr);
            }




            let listFile = req.files.file.map(f => {
                let file_name = f.name.replace(/\s/g, '_');
                let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${file_name}`))
                let url = `/${media}/${file_name}`;
                return {
                    link: url,
                    ...stat
                }
            });
            listFile = listFile.sort((a, b) => {
                return b.birthtime - a.birthtime;
            });
            return res.status(200).json(listFile);



        }

        if (req.files.file instanceof Object && Object.keys(req.files.file).length > 0) {
            const file = req.files.file;
            let file_name = file.name.replace(/\s/g, '_');
            const file_list = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
            const file_exist = file_list.indexOf(file_name);
            if (file_exist !== -1) {

                return res.status(400).json(notificationErr);
            }
            const status1 = await JimpResize(file,media);
           
            if (media === 'produk') {
                const status2 = await JimpResizeLow(file,media);
            }
            let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${file_name}`))
            let url = `/${media}/${file_name}`;

            let listFile = [{
                link: url,
                ...stat
            }];

            return res.status(200).json(listFile);





        }

    } catch (err) {
        return res.status(400).json(err);
    }

}

// export const uploadImage = async (req, res) => {
//     let notificationErr = {
//         error: true,
//         message: "Filename already exist",
//         notification: true
//     }
//     try {
//         if (req.files === null) {
//             return res.status(400).json({ msg: 'No file uploaded' });
//         }
//         if (!req.query.media) {
//             return res.status(400).json({ msg: 'No directory' });
//         }
//         const media = req.query.media;

//         if (req.files.file instanceof Array && req.files.file.length > 0) {
//             const file_list = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
//             const checkList= req.files.file.map(f=>{
//                 return file_list.indexOf(f.name.replace(/\s/g, '_'));
//             }).filter(b=>b !== -1);
//             if(checkList.length > 0){
//                 return res.status(400).json(notificationErr);
//             }

          
//             let status1 =[];
//             for (const f of req.files.file) {
//                 let resultData = await resizeImage(f, media);
//                 status1.push(resultData);
//             }
     
//             status1 = await Promise.all(status1);
//             const unvalidResult1 = status1.filter(r => (r instanceof Error));

//             let status2 = [];
//             if (media === 'produk') {
//                 for (const f of req.files.file) {
//                     let resultData2 = await resizeImage(f, media);
//                     status2.push(resultData2);
//                 }
//                 status2 = await Promise.all(status2);
//                 const unvalidResult2 = status2.filter(r => (r instanceof Error));
//                 if (unvalidResult2.length > 0) {
//                     notificationErr.message = (unvalidResult2.length)+' File Failed to upload';
//                     return res.status(400).json(notificationErr);
//                 }
//             }
            
//             if (unvalidResult1.length > 0){
//                 notificationErr.message = (unvalidResult1.length) + ' File Failed to upload';
//                 return res.status(400).json(notificationErr);
//             }

   

    
//             let listFile = req.files.file.map(f => {
//                 let file_name = f.name.replace(/\s/g, '_');
//                 let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${file_name}`))
//                 let url = `/${media}/${file_name}`;
//                 return {
//                     link: url,
//                     ...stat
//                 }
//             });
//             listFile = listFile.sort((a, b) => {
//                 return b.birthtime - a.birthtime;
//             });
//             return res.status(200).json(listFile);



//         }

//         if (req.files.file instanceof Object && Object.keys(req.files.file).length > 0) {
//             const file = req.files.file;
//             let file_name = file.name.replace(/\s/g, '_');
//             const file_list = fs.readdirSync(path.resolve(__dirname, '../../../media/' + media));
//             const file_exist =  file_list.indexOf(file_name);
//             if(file_exist !== -1){
           
//                 return res.status(400).json(notificationErr);
//             }
//             const bufferData1 = await constraintImage(file.data);
            
//             let status = await sharp(bufferData1).toFile(path.resolve(__dirname, `../../../media/${media}/${file_name}`));

//             let status2 = [];

            
//             if (media === 'produk') {
//                 const bufferData2 = await constraintImageResize(file.data);
//                 status2 =await sharp(bufferData2)
//                         .toFile(path.resolve(__dirname, `../../../media/${media + '_low'}/${file_name}`));

//             }
//             let stat = fs.statSync(path.resolve(__dirname, `../../../media/${media}/${file_name}`))
//             let url = `/${media}/${file_name}`;

//             let listFile = [{
//                 link: url,
//                 ...stat
//             }];

//             return res.status(200).json(listFile);





//         }

//     } catch (err) {
//         return res.status(400).json(err);
//     }

// }