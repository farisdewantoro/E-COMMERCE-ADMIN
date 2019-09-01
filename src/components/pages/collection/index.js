import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import PropTypes from 'prop-types';
import styles from './styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { getAllCollection,deleteCollection} from '../../../actions/collectionActions';
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
class Collection extends Component {
    state = {
        openDelete: false,
        selected: [],
        selectedName:""
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.notifications !== this.props.notifications && typeof nextProps.notifications.error !== "undefined") {
            this.setState({ openDelete: false, selected: [],selectedName:"" });
        }
    }
    componentDidMount() {
        this.props.getAllCollection();
    }
    handleCloseDialog = () => {
        this.setState({ openDelete: false });
    };
    handlerDeleteDialog = (l) => {
        this.setState({
            selected: l,
            selectedName:l.name,
            openDelete: true
        })
    }
    handlerSubmitDeleteCollection = () => {
        this.props.deleteCollection(this.state.selected);
    }
    render() {
        const { classes, collections } = this.props;
        const { selected, selectedName } = this.state;
    
        return (
            <div>
                <Grid container direction="column" spacing={16}>
                    <Grid item md={12}>
                        <Button color="primary" component={Link} to="/collection/create" variant="contained">
                            CREATE NEW COLLECTION
                    </Button>
                    </Grid>
                    <Grid item md={12}>
                        <Card>
                            <CardHeader
                                title="Collection"
                            />
                            <Divider />
                            <CardContent>
                                <Grid container direction="row" spacing={16}>


                                    {collections.collection.map((c, i) => {
                                        return (
                                            <Grid item md={3} key={i}>
                                                <Card>
                                                    <CardHeader
                                                        subheader={c.name}
                                                    />
                                                    <Divider />
                                                    <img src={c.link} style={{ width: "100%" }} alt="" />
                                                    <CardActions>
                                                        <Button component={Link} to={`/collection/edit/${c.collection_id}`}>
                                                            Edit
                                            </Button>
                                                        <Button onClick={() => this.handlerDeleteDialog(c)}>
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

                                Deleted <span style={{ fontWeight: "bold" }}> {selectedName.toUpperCase()} </span> cannot be recovered. Do you still want to continue?
                        </Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                                Cancel
                         </Button>
                            <Button onClick={this.handlerSubmitDeleteCollection} color="secondary" variant="contained">
                                Delete
                         </Button>

                        </DialogActions>
                    </Dialog>
                </Grid>
            </div>
        )
    }
}

Collection.propType = {
    classes: PropTypes.object.isRequired,
    getAllCollection:PropTypes.func.isRequired,
    collections:PropTypes.object.isRequired,
    deleteCollection:PropTypes.func.isRequired,
    notifications:PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    collections:state.collections,
    notifications: state.notifications
})


export default compose(connect(mapStateToProps, { getAllCollection, deleteCollection}), withStyles(styles))
    (Collection);
