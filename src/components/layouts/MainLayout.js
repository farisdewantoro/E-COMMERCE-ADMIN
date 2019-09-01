import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MainListItems from './ListItem';
import LogoImg from '../../img/logo2.png';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Snackbars from '../common/Snackbars'

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
  
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawer:{
        width:drawerWidth,
        flexShrink: 0,
        
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        boxShadow:'0px 0px 1px #6b6b6b'
    },
    contentMargin:{
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    },
    drawerPaper:{
        width:drawerWidth
    },
    imgLogo:{
        margin: theme.spacing.unit,
        maxWidth:35,
    },
    textLogo:{
        fontWeight:'bold',
        fontSize:18
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    imageLogo:{
        width:35
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    listMenu:{
        margin:theme.spacing.unit,
      
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,

    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: 0,
    },
});

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#1e88e5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary:{
            main: "#ff1744",
        },
       
    },
    typography: {
        useNextVariants: true,
    },
});
class MainLayout extends React.Component {
    state = {
        open: true,
        anchorEl: null,
        mobileMoreAnchorEl: null,
        notification: {
            error: true,
            message: 'tes',
            openNotification: true
        },
        openCollapse:false
    };

    handleDrawerOpenClose = () => {
        this.setState({ open: !this.state.open });
    };

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
    };
    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps.notifications !== this.props.notifications) {
            let notif = nextProps.notifications;
            this.setState(prevState => ({
                notification: {
                    ...prevState.notification,
                    error: notif.error,
                    message: notif.message,
                    openNotification: notif.notification
                }
            }))
        }
    }
    handleCollapse =(data)=>{

        this.setState(prevState=>({
            openCollapse: data === prevState.openCollapse ? false : data
        }));
    }

    render() {
        const { classes } = this.props;
        const { open, anchorEl, mobileMoreAnchorEl, notification} = this.state;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
            </Menu>
        );

        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <p>Messages</p>
                </MenuItem>
                <MenuItem>
                    <IconButton color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        );
        return (
            <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
            
                <CssBaseline />
                <AppBar position="fixed" className={classNames(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                    <Toolbar variant="dense">
                        <IconButton className={classes.menuButton} onClick={this.handleDrawerOpenClose} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        {/* <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                    
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                <MoreIcon />
                            </IconButton>
                        </div> */}
                    </Toolbar>
                </AppBar>
                {renderMenu}
                {renderMobileMenu}
                <Drawer 
                    variant="persistent"
                    open={open} 
                    className={classes.drawer} 
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left">
                    <div className={classes.drawerHeader}>
                
                
                            <img src={LogoImg} className={classes.imgLogo} alt=""/>
                   
                        <Typography  className={classes.textLogo}>
                            HAMMERSTOUT
                         </Typography>

                
                    </div>
                  
                    <div className={classes.listMenu}>
                    <List component="nav">
                                <MainListItems handleCollapse={this.handleCollapse} openCollapse={this.state.openCollapse} />
                    </List>
                     
                    
                    </div>
                </Drawer>
                <main className={classNames(classes.content, {
                    [classes.contentShift]: open,
                })}>
                   <div style={{ marginTop: 40 }}>
                        {this.props.children}
                    </div>
                        <Snackbars notification={notification}/>
                </main>
              
            </div>
            </MuiThemeProvider>   
        );
    }
}

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    notifications:PropTypes.object.isRequired
};

const mapStateToProps = (state)=>({
    notifications: state.notifications
})

export default compose(withStyles(styles),connect(mapStateToProps,null))(MainLayout);
