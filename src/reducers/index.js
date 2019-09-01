import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer'
import productReducer from './productReducer'
import errorReducer from './errorReducer'
import authReducer from './authReducer'
import notifReducer from './notifReducer'
import uiReducer from './uiReducer'
import lookbookReducer from './lookbookReducer'
import voucherReducer from './voucherReducer';
import sizingReducer from './sizingReducer';
import collectionReducer from './collectionReducer';
import orderReducer from './orderReducer';
import csrfReducer from './csrfReducer';
import userReducer from './userReducer';
import resiReducer from './resiReducer';
import mediaReducer from './mediaReducer';
export default combineReducers({
    categories: categoryReducer,
    products:productReducer,
    auths:authReducer,
    errors:errorReducer,
    notifications: notifReducer,
    UI: uiReducer,
    lookbooks: lookbookReducer,
    vouchers: voucherReducer,
    sizings: sizingReducer,
    collections:collectionReducer,
    orders: orderReducer,
    token: csrfReducer,
    users: userReducer,
    resi: resiReducer,
    media: mediaReducer
});