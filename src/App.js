import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import MainLayout from './components/layouts/MainLayout';
import Product from './components/pages/product';
import ProductCreate from './components/pages/product/ProductCreate';
import CategoryCreate from './components/pages/category/CategoryCreate';
import "react-image-gallery/styles/css/image-gallery.css";
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import './App.css';
import PrivateRoute from './components/common/PrivateRoute';
import AuthRoute from './components/common/AuthRoute';
import Auth from './components/pages/auth';
import {setCurrentAdmin, logoutAdmin} from './actions/authActions';
import axios from 'axios';
import Category from './components/pages/category';
import CategoryTag from './components/pages/category/Tag';
import CategoryUpdate from './components/pages/category/UpdateCategory';
import ProductUpdate from './components/pages/product/UpdateProducts';
import HomeSlider from './components/pages/home-slider';
import EditSlider from './components/pages/home-slider/editSlider';
import Lookbook from './components/pages/lookbook';
import CreateLookbook from './components/pages/lookbook/CreateLookbook';
import EditLookbook from './components/pages/lookbook/EditLookbook';
import Voucher from './components/pages/voucher';
import CreateVoucher from './components/pages/voucher/CreateVoucher';
import EditVoucher from './components/pages/voucher/EditVoucher';
import {setNotification} from './actions/notifActions';
import Sizing from './components/pages/sizing';
import CreateSize from './components/pages/sizing/CreateSize';
import UpdateSize from './components/pages/sizing/UpdateSize';
import Collection from './components/pages/collection';
import CreateCollection from './components/pages/collection/CreateCollection';
import EditCollection from './components/pages/collection/EditCollection';
import Order from './components/pages/order';
import OrderDetail from './components/pages/order/OrderDetail';
import BannerCategory from './components/pages/category/Banner/BannerCategory';
import BannerCategoryTag from './components/pages/category/Banner/BannerCategoryTag';
import BannerCategoryType from './components/pages/category/Banner/BannerCategoryType';
import BannerCategoryDefault from './components/pages/category/Banner/BannerCategoryDefault';
import EditBannerCategory from './components/pages/category/Banner/EditBannerCategory';
import EditBannerCategoryTag from './components/pages/category/Banner/EditBannerCategoryTag';
import EditBannerCategoryType from './components/pages/category/Banner/EditBannerCategoryType';
import EditBannerCategoryDefault from './components/pages/category/Banner/EditBannerCategoryDefault';
import User from './components/pages/user';
import CekResi from './components/pages/cek-resi';
import LinkRedirect from './components/pages/link';
import PDF from './components/pages/PDF';
import Instagram from './components/pages/instagram';
import Mode from './components/pages/mode';
// axios
//     .get('/api/track/token')
//     .then(ress => {
//         if (ress.data.token_a) {
//             let decoded = jwt_decode(ress.data.token_a);
//             store.dispatch(setCurrentAdmin(decoded.user));
//         }
//         if(!ress.data.token_a){
//           localStorage.removeItem("hammerauth");
//           store.dispatch(logoutAdmin());
//         }

//     })
//     .catch(err => {
//         if(err){
//             let notification = {
//                 error: true,
//                 message: "There is an error !",
//                 notification: true
//             }
//             store.dispatch(setNotification(notification));
//         }
//     });
if (localStorage.hammerauth) {
    const decoded = jwt_decode(localStorage.hammerauth);
    store.dispatch(setCurrentAdmin(decoded.user));

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutAdmin());
        window.location.href = '/sign-in';
    }
}
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <AuthRoute path="/sign-in" exact component={Auth}/>
                        <PrivateRoute path="/pdf/loading" exact component={PDF} />
                        <MainLayout>
                            <Switch>
                                <PrivateRoute path="/" exact component={Order} />
                                <PrivateRoute path="/link-redirect" exact component={LinkRedirect} />
                                <PrivateRoute path="/product" exact component={Product}/>
                                <PrivateRoute path="/product/create" exact component={ProductCreate}/>
                                <PrivateRoute path="/product/edit/:product_slug/:id" exact component={ProductUpdate}/>
                                <PrivateRoute path="/category/create" exact component={CategoryCreate}/>
                                <PrivateRoute path="/category" exact component={Category}/>

                                <PrivateRoute path="/category/banner-category" exact component={BannerCategory} />
                                <PrivateRoute path="/category/banner-category/edit/:id" exact component={EditBannerCategory} />

                                <PrivateRoute path="/category/banner-tag" exact component={BannerCategoryTag} />
                                <PrivateRoute path="/category/banner-tag/edit/:id" exact component={EditBannerCategoryTag} />

                                <PrivateRoute path="/category/banner-type" exact component={BannerCategoryType} />
                                <PrivateRoute path="/category/banner-type/edit/:id" exact component={EditBannerCategoryType} />

                                <PrivateRoute path="/category/banner-default" exact component={BannerCategoryDefault} />
                                <PrivateRoute path="/category/banner-default/edit/:id" exact component={EditBannerCategoryDefault} />

                                <PrivateRoute path="/category/tag/edit" exact component={CategoryTag} />
                                <PrivateRoute path="/category/update/:id" exact component={CategoryUpdate} />
                                <PrivateRoute path="/home-slider" exact component={HomeSlider}/>
                                <PrivateRoute path="/home-slider/edit" exact component={EditSlider}/>
                                <PrivateRoute path="/lookbook" exact component={Lookbook}/>
                                <PrivateRoute path="/lookbook/create" exact component={CreateLookbook}/>
                                <PrivateRoute path="/lookbook/edit/:id" exact component={EditLookbook} />
                                <PrivateRoute path="/voucher" exact component={Voucher}/>
                                <PrivateRoute path="/voucher/create" exact component={CreateVoucher} />
                                <PrivateRoute path="/voucher/edit/:id" exact component={EditVoucher} />
                                <PrivateRoute path="/sizing" exact component={Sizing} />
                                <PrivateRoute path="/sizing/create" exact component={CreateSize}/>
                                <PrivateRoute path="/sizing/edit/:id" exact component={UpdateSize} />
                                <PrivateRoute path="/collection" exact component={Collection}/>
                                <PrivateRoute path="/collection/create" exact component={CreateCollection} />
                                <PrivateRoute path="/collection/edit/:id" exact component={EditCollection}/>
                                <PrivateRoute path="/order" exact component={Order} />
                                <PrivateRoute path="/order/:category" exact  component={Order} />
                                <PrivateRoute path="/order/detail/:id" exact component={OrderDetail}/>
                                <PrivateRoute path="/cek-resi" exact component={CekResi}/>
                                <PrivateRoute path="/user" exact component={User} />
                                <PrivateRoute path="/instagram" exact component={Instagram}/>
                                  <PrivateRoute path="/mode" exact component={Mode}/>
                            </Switch>
                        </MainLayout>

                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;
