import store from '../client/src/store';
import { setCSRF } from '../client/src/actions/csrfActions';
export  const universalStore = (req,res,next)=>{
    if (req.csrfToken()) {
       
        store.dispatch(setCSRF(req.csrfToken()));
      
    }
    next();
}