import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import {Link} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AssignmentIcon from '@material-ui/icons/Assignment';
import QuestionIcon from '@material-ui/icons/QuestionAnswer';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ShopingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CollectionBookMarkIcon from '@material-ui/icons/CollectionsBookmark';
import CollectionsIcon from '@material-ui/icons/Collections'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import PaymentIcon from '@material-ui/icons/Payment'
import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import ListAltIcon from '@material-ui/icons/ListAlt'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { logoutAuthAdmin} from '../../actions/authActions';
import {connect} from 'react-redux';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ArrowRight from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';
import AccessibilityNew from '@material-ui/icons/AccessibilityNew';
import List from '@material-ui/core/List';
import StyleIcon from '@material-ui/icons/Style'
import LaunchIcon from '@material-ui/icons/Launch';
import PowerIcon from '@material-ui/icons/PowerSettingsNew'
const dropDown = [
    {name:'Banner Category',link:'/category/banner-category'},
    { name: 'Banner Tag', link: '/category/banner-tag' },
    { name: 'Banner Type', link: '/category/banner-type' },
    { name: 'Banner Default', link: '/category/banner-default' }
]
 const mainListItems = (props)=>{
     return(
    <div>
        {/* <ListItem button component={Link} to='/'>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider /> */}
           <ListItem button component={Link} to='/order'>
            <ListItemIcon>
                 <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Order" />
        </ListItem>
        <Divider />
             <ListItem button component={Link} to='/link-redirect'>
                 <ListItemIcon>
                     <LaunchIcon />
                 </ListItemIcon>
                 <ListItemText primary="Link" />
             </ListItem>
             <Divider />
                  <ListItem button component={Link} to='/cek-resi'>
            <ListItemIcon>
                 <StyleIcon />
            </ListItemIcon>
            <ListItemText primary="Cek Resi" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to='/product'>
            <ListItemIcon>
                <ShopingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Product" />
        </ListItem>
             <Divider />
             <ListItem button component={Link} to='/user'>
                 <ListItemIcon>
                     <AccessibilityNew />
                 </ListItemIcon>
                 <ListItemText primary="User" />
             </ListItem>
        <Divider />
         <ListItem button component={Link} to='/collection'>
             <ListItemIcon>
                 <ListAltIcon />
             </ListItemIcon>
             <ListItemText primary="Collection" />
         </ListItem>
         <Divider />
             <ListItem button component={Link} to='/instagram'>
                 <ListItemIcon>
                     <CachedIcon />
                 </ListItemIcon>
                 <ListItemText primary="Instagram" />
             </ListItem>
             <Divider />
        <ListItem button component={Link} to="/mode">
            <ListItemIcon>
                     <PowerIcon/>
            </ListItemIcon>
            <ListItemText primary="Mode"/>
        </ListItem>
            <Divider/>
        <ListItem button component={Link} to='/category'>
            <ListItemIcon>
                 <CollectionBookMarkIcon />
            </ListItemIcon>
            <ListItemText primary="Category" />
            <ListItemSecondaryAction>
                     <IconButton aria-label="Delete" onClick={() => props.handleCollapse('category')}>
                         {props.openCollapse === 'category' ? <ExpandLess /> : <ExpandMore />}
                     </IconButton>
            </ListItemSecondaryAction>

        </ListItem>
             <Collapse in={props.openCollapse === 'category'} timeout="auto" unmountOnExit>
                 <List component="div" disablePadding>
                     {dropDown.map((d,i)=>{
                         return(
                             <ListItem key={i} button component={Link} to={d.link}>
                                 <ArrowRight style={{ color:'#7b7b7b'}}/>
                                 <ListItemText primary={d.name}  style={{padding:0}}/>
                             </ListItem> 
                         )
                     })}
                 </List>
             </Collapse>
        <Divider />
         <ListItem button component={Link} to='/home-slider'>
             <ListItemIcon>
                 <CollectionsIcon/>
             </ListItemIcon>
             <ListItemText primary="Home Slider" />
         </ListItem>
         <Divider />
         <ListItem button component={Link} to='/lookbook'>
             <ListItemIcon>
                 <AddPhotoAlternateIcon />
             </ListItemIcon>
             <ListItemText primary="Lookbook" />
         </ListItem>
         <Divider />
         <ListItem button component={Link} to='/voucher'>
             <ListItemIcon>
                 <PaymentIcon/>
             </ListItemIcon>
             <ListItemText primary="Voucher"/>
         </ListItem>
         <Divider/>
         <ListItem button component={Link} to="/sizing">
             <ListItemIcon>
                 <AspectRatioIcon/>
             </ListItemIcon>
             <ListItemText primary="Sizing"/>
         </ListItem>
         <ListItem button onClick={()=>props.logoutAuthAdmin()}>
             <ListItemIcon>
                 <ExitToAppIcon />
             </ListItemIcon>
             <ListItemText primary="Logout" />
         </ListItem>
  
 
      
    </div>
)
     
};



export default connect(null,{logoutAuthAdmin})(mainListItems);