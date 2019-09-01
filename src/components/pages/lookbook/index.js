import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { getAllLookbook, deleteLookbook} from '../../../actions/lookbookActions';
import PropTypes from 'prop-types';
import styles from './styles';
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

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);
class Lookbook extends Component {
    state={
        openDelete:false,
        selected:[]
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        let tes = typeof nextProps.notifications.error;
        let tes2 = nextProps.notifications.error;

        if (nextProps.notifications !== this.props.notifications && typeof nextProps.notifications.error !== "undefined" ){
            this.setState({ openDelete: false,selected:[] });
        }
    }
    componentDidMount(){
        this.props.getAllLookbook();
    }
    handleCloseDialog = () => {
        this.setState({ openDelete: false});
    };
    handlerDeleteDialog = (l)=>{
        this.setState({
            selected:l,
            openDelete:true
        })
    }
    handlerSubmitDeleteLookbook = ()=>{
        this.props.deleteLookbook(this.state.selected);
    }
  render() {
      const { classes, lookbooks} = this.props;
      const { selected} = this.state;
    return (
      <div>
        <Grid container direction="column" spacing={16}>
                <Grid item md={12}>
                    <Button color="primary" component={Link} to="/lookbook/create" variant="contained">
                        CREATE NEW Lookbook
                    </Button>
                </Grid>
            <Grid item md={12}>
                <Card>
                        <CardHeader
                            title="LOOKBOOK"
                        />
                        <Divider />
                    <CardContent>
                            <Grid container direction="row" spacing={16}>

                            
                            {lookbooks.lookbook.map((l,i)=>{
                                return(
                                    <Grid item md={3} key={i} >
                                        <Card>
                                            <CardHeader
                                                subheader={l.name}
                                            />
                                            <Divider />
                                                <img src={l.link} style={{width:"100%"}} alt=""/>
                                            <CardActions>
                                                <Button component={Link} to={`/lookbook/edit/${l.lookbook_id}`}>
                                                    Edit
                                            </Button>
                                                <Button onClick={()=>this.handlerDeleteDialog(l)}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                               
                                )
                            })}
                            </Grid>
                    </CardContent>
                 
                </Card>
            </Grid>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-delete-product"
                    open={this.state.openDelete}
                >
                    <DialogTitle id="dialog-delete-product" onClose={this.handleCloseDialog}>
                        Are you sure want to delete this ? 
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            
                            Deleted <span style={{fontWeight:"bold"}}> {selected.name} </span> cannot be recovered. Do you still want to continue?
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitDeleteLookbook} color="secondary" variant="contained">
                            Delete
                         </Button>

                    </DialogActions>
                </Dialog>
        </Grid>
      </div>
    )
  }
}

Lookbook.propType={
    classes:PropTypes.object.isRequired,
    lookbooks:PropTypes.object.isRequired,
    deleteLookbook:PropTypes.func.isRequired,
    getAllLookbook:PropTypes.func.isRequired,
    notifications:PropTypes.object.isRequired
}

const mapStateToProps = (state)=>({
    lookbooks:state.lookbooks,
    notifications: state.notifications
})


export default compose(connect(mapStateToProps, { getAllLookbook, deleteLookbook}),withStyles(styles))
(Lookbook);
