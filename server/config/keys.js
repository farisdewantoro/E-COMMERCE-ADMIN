import keyDev from './keys-dev';
import keyProd from './keys-prod';

let keys =keyProd;
if(process.env.NODE_ENV !== 'production'){
    keys = keyDev;
}

export default keys;