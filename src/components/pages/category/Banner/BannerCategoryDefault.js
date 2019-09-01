import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import PropTypes from 'prop-types';
import styles from '../styles';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {getAllCategoryBannerDefault} from '../../../../actions/categoryActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }
function readerImg(img) {
    var image = new Image();

    image.src = img;

    let dimension = image.onload = () => {
        let d = image.width + 'x' + image.height;
        return d;

    };

    return dimension();

}
const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500]
    }
}))(props => {
    const {children, classes, onClose} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose
                ? (
                    <IconButton
                        aria-label="Close"
                        className={classes.closeButton}
                        onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                )
                : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit
    }
}))(MuiDialogActions);
class CategoryBannerDefault extends Component {
    state = {
        openDelete: false,
        selected: [],
        expanded: null
    }
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded
                ? panel
                : false
        });
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        let tes = typeof nextProps.notifications.error;
        let tes2 = nextProps.notifications.error;

        if (nextProps.notifications !== this.props.notifications && typeof nextProps.notifications.error !== "undefined") {
            this.setState({openDelete: false, selected: []});
        }
    }
    componentDidMount() {
        this
            .props
            .getAllCategoryBannerDefault();
    }
    handleCloseDialog = () => {
        this.setState({openDelete: false});
    };
    handlerDeleteDialog = (l) => {
        this.setState({selected: l, openDelete: true})
    }
    handlerSubmitDeleteCategoryBanner = () => {
        this
            .props
            .deleteCategoryBanner(this.state.selected);
    }
    render() {
        const {classes, categories} = this.props;
        const {selected, expanded} = this.state;
        return (
            <div>
                <Grid container direction="column" spacing={16}>

                    <Grid item md={12}>
                        <Card>
                            <CardHeader title="Banner Category Tag"/>
                            <Divider/>
                            <CardContent>
                                <Grid container direction="column" spacing={16}>

                                    {categories
                                        .default instanceof Array && categories
                                        .default
                                        .map((c, i) => {
                                            return (
                                            <ExpansionPanel
                                                key={i}
                                                expanded={expanded === 'panel1'+i}
                                                onChange={this.handleChange('panel1'+i)}>
                                                <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
                                                    <Typography className={classes.heading}>{c.name.toUpperCase()}</Typography>
                                                 </ExpansionPanelSummary>
                                                 <Divider/>
                                                <ExpansionPanelDetails>
                                                        <Grid container direction="row" spacing={16}>
                                                      
                                                            {/* Desktop */}
                                                            <Grid item xs={12}>
                                                                <Card>
                                                                    <CardHeader subheader='DESKTOP BANNER' />
                                                                    <Divider />
                                                                    <CardContent>
                                                                        {categories.image_desktop.filter(id=>id.category_default_id === c.id).length === 0 && (
                                                                            <Typography
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    fontWeight: "bold"
                                                                                }}>
                                                                                NO IMAGE
                                                                        </Typography> 
                                                                        )}

                                                                        {categories.image_desktop.filter(id => id.category_default_id === c.id).map(cid=>{
                                                                            return(
                                                                                <div key={cid.id}>
                                                                                    <img src={cid.link} alt={cid.alt} style={{ maxWidth: "100%",maxHeight:"500px" }} />
                                                                                    <Typography>
                                                                                        SIZE : {formatBytes(cid.size)} , DIMENSION : {readerImg(cid.link)}
                                                                                    </Typography>
                                                                                </div>
                                                                           
                                                                            )
                                                                        })}
                                                                     
                                                                    </CardContent>
                                                                
                                                              

                                                                </Card>
                                                            </Grid>

                                                            {/* MOBILE */}

                                                            <Grid item md={12}>
                                                                <Card>
                                                                    <CardHeader subheader='MOBILE BANNER' />
                                                                    <Divider />
                                                                    <CardContent>
                                                                        {categories.image_mobile.filter(id => id.category_default_id === c.id).length === 0 && (
                                                                            <Typography
                                                                                style={{
                                                                                    textAlign: 'center',
                                                                                    fontWeight: "bold"
                                                                                }}>
                                                                                NO IMAGE
                                                                        </Typography>
                                                                        )}
                                                                        {categories.image_mobile.filter(id => id.category_default_id === c.id).map(cid => {
                                                                            return (
                                                                                <div key={cid.id}>
                                                                                    <img src={cid.link} alt={cid.alt} style={{ maxWidth: "100%",maxHeight:"500px" }} />
                                                                                    <Typography>
                                                                                        SIZE : {formatBytes(cid.size)} , DIMENSION : {readerImg(cid.link)}
                                                                                    </Typography>
                                                                                </div>

                                                                            )
                                                                        })}
                                                                    </CardContent>
                                                            
                                                                </Card>
                                                            </Grid>

                                                            {categories.image_desktop_promo.filter(id => id.category_default_id === c.id).length > 0 && (
                                                            <Grid item xs={12}>
                                                                <Card>
                                                                    <CardHeader subheader='DESKTOP BANNER PROMO' />
                                                                    <Divider />
                                                                    <CardContent>
                                                                            {categories.image_desktop_promo.filter(id => id.category_default_id === c.id).map(cid => {
                                                                                return (
                                                                                    <div key={cid.id}>
                                                                                        <img src={cid.link} alt={cid.alt} style={{ maxWidth: "100%",maxHeight:"500px" }} />
                                                                                        <Typography>
                                                                                            SIZE : {formatBytes(cid.size)} , DIMENSION : {readerImg(cid.link)}
                                                                                        </Typography>
                                                                                    </div>

                                                                                )
                                                                            })}
                                                                     
                                                                    </CardContent>



                                                                </Card>
                                                            </Grid>
                                                               )}
                                                            {categories.image_mobile_promo.filter(id => id.category_default_id === c.id).length > 0 && (


                                                            <Grid item md={12}>
                                                                <Card>
                                                                    <CardHeader subheader='MOBILE BANNER PROMO' />
                                                                    <Divider />
                                                                    <CardContent>
                                                                            {categories.image_mobile_promo.filter(id => id.category_default_id === c.id).map(cid => {
                                                                                return (
                                                                                    <div key={cid.id}>
                                                                                        <img src={cid.link} alt={cid.alt} style={{ maxWidth: "100%",maxHeight:"500px" }} />
                                                                                        <Typography>
                                                                                            SIZE : {formatBytes(cid.size)} , DIMENSION : {readerImg(cid.link)}
                                                                                        </Typography>
                                                                                    </div>

                                                                                )
                                                                            })}
                                                                    </CardContent>

                                                                </Card>
                                                            </Grid>
                                                            )}
                                                           
                                                        </Grid>
                                                </ExpansionPanelDetails>
                                                    <Divider />
                                                    <ExpansionPanelActions>
                                                        {/* <Button size="small" >REMOVE</Button> */}
                                                        <Button size="small" color="primary" component={Link} to={`/category/banner-default/edit/${c.id}`}>
                                                            EDIT
                                                        </Button>
                                                    </ExpansionPanelActions>
                                         </ExpansionPanel> 
                                           )
                                        })}
                                </Grid>
                            </CardContent>

                        </Card>
                    </Grid>

                    <Dialog
                        onClose={this.handleCloseDialog}
                        aria-labelledby="dialog-delete-product"
                        open={this.state.openDelete}>
                        <DialogTitle id="dialog-delete-product" onClose={this.handleCloseDialog}>
                            Are you sure want to delete this ?
                        </DialogTitle>
                        <DialogContent>
                            <Typography gutterBottom>

                                Deleted
                                <span
                                    style={{
                                    fontWeight: "bold"
                                }}>
                                    {selected.name}
                                </span>
                                cannot be recovered. Do you still want to continue?
                            </Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                                Cancel
                            </Button>
                            <Button
                                onClick={this.handlerSubmitDeleteCategoryBanner}
                                color="secondary"
                                variant="contained">
                                Delete
                            </Button>

                        </DialogActions>
                    </Dialog>
                </Grid>
            </div>
        )
    }
}

CategoryBannerDefault.propType = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    getAllCategoryBannerDefault: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({categories: state.categories, notifications: state.notifications})

export default compose(connect(mapStateToProps, { getAllCategoryBannerDefault }), withStyles(styles))(CategoryBannerDefault);
