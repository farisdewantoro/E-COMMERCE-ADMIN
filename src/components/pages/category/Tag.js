import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider'; 
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getAllCategoryTag, updateCategoryTag, createCategoryTag, deleteCategoryTag} from '../../../actions/categoryActions';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
class Tag extends Component {
    state = {
        open: false,
        isCreate:false,
        isUpdate:false,
        category_tag:[],
        categoryName:'',
        tag_id:'',
        openAlertDelete:false,
        confirmNameTag:'',
        error:false,
        messageError:''
    };

    componentDidMount(){
        this.props.getAllCategoryTag();
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.categories.tag !== this.props.categories.tag){
            this.setState({
                category_tag:nextProps.categories.tag
            })
        }
        if (nextProps.notifications !== this.props.notifications){
            if (!nextProps.notifications.error){
                this.setState({ 
                    open: false, 
                    isCreate: false, 
                    isUpdate: false, 
                    categoryName:'',
                    tag_id:'',
                    confirmNameTag:'',
                    openAlertDelete:false,
                    error:false,
                    messageError:''
                 });
            }
        }
    }

    handleClickOpenCreate = () => {
        this.setState({ open: true, isCreate: true, categoryName: '' });
    };

    handleClose = () => {
        this.setState({ open: false, isCreate: false, isUpdate:false,openAlertDelete:false });
    };
    handlerEdit = (name,i)=>{
        this.setState({
            categoryName:name,
            open:true,
            isUpdate:true,
            tag_id:i
        })
    }
    handlerOnChangeValue =(e)=>{
        this.setState({
            categoryName: e.target.value,
        })
    }

    handlerUpdateSubmit =()=>{
        let data ={
            name:this.state.categoryName,
            tag_id:this.state.tag_id
        }
        this.props.updateCategoryTag(data);
        
    }
    handlerCreateSubmit = ()=>{
        let data ={
            name: this.state.categoryName,
        }
        this.props.createCategoryTag(data);
    }
    handlerDelete = (name,i)=>{
        this.setState({
            openAlertDelete:true,
            tag_id:i,
            isCreate: false, 
            isUpdate: false,
            categoryName:name
        })
    }
    handlerOnChangeDeleteConfirm =(e)=>{
        this.setState({
            confirmNameTag:e.target.value
        })
    }
    handlerDeleteSubmit=()=>{
        if(this.state.confirmNameTag.toLocaleLowerCase() !== this.state.categoryName.toLocaleLowerCase()){
            this.setState({
                error:true,
                messageError:"VALUE MUST BE THE SAME"
            })
        }else{
            this.props.deleteCategoryTag(this.state.tag_id);
        }
    }

  render() {

      const {classes} = this.props;
      const { isCreate, category_tag, categoryName, openAlertDelete, error, messageError, confirmNameTag} = this.state;
    return (
      <div>
        <Grid container>
        <Grid item md={12}>
                    <Card>
                <Typography style={{ padding: 20 }}>
                            CATEGORY TAG
                </Typography>
                        <Divider />
                        <CardContent>
                            <Grid container style={{marginBottom:"20px"}}>
                                <Button variant="contained" color="default" onClick={this.handleClickOpenCreate}>
                                    CREATE NEW CATEGORY TAG
                                </Button>
                            </Grid>
                            <Grid container direction="column" spacing={8}>
                            {category_tag.map((ct,i)=>{
                                return(
                                    <Grid item >
                                        <Paper elevation={1} className={classes.paper}>
                                            <Grid container justify="space-between" alignItems="center" spacing={40}>

                                                <Grid item>
                                                    <Grid container justify="center" alignItems="center" spacing={16}>
                                                        <Grid item>
                                                            <Typography>
                                                                {i+1}.
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography>
                                                                {ct.name}
                                                         </Typography>
                                                        </Grid>
                                                    </Grid>

                                                </Grid>

                                                <Grid item>
                                                    <Grid container spacing={8}>
                                                        <Grid item>
                                                            <Button variant="contained" color="primary" onClick={()=>this.handlerEdit(ct.name,ct.id)}>
                                                                EDIT
                                                             </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button variant="contained" color="primary" onClick={()=>this.handlerDelete(ct.name,ct.id)}>
                                                                DELETE
                                            </Button>
                                                        </Grid>
                                                    </Grid>


                                                </Grid>
                                            </Grid>

                                        </Paper>
                                    </Grid>
                                )
                            })}
                               

                                <Grid>
                                    
                                </Grid>
                            </Grid>
                            {/* <TextField
                                label="Tag Name"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            /> */}
                        </CardContent>
                    </Card>
        </Grid>
         
        </Grid>

            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">CATEGORY TAG</DialogTitle>
                <DialogContent>
                
                    <TextField
                        autoFocus
                        margin="dense"
                        id="categoryTagName"
                        
                        // label="Category Tag Name"
                        onChange={this.handlerOnChangeValue}
                        value={categoryName}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
            </Button>
                    {isCreate ? (<Button onClick={this.handlerCreateSubmit} color="primary">
                        CREATE
                    </Button>) : (<Button onClick={this.handlerUpdateSubmit} color="primary">
                            UPDATE
                    </Button>)}
                  


                </DialogActions>
            </Dialog>

            <Dialog
                open={openAlertDelete}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">DELETE CATEGORY TAG</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        when you delete this it will affect other categories. if you want to continue you must fill in the form with this name :
                      <span style={{fontWeight:"bold"}}>
                             {categoryName}
                        </span>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="categoryTagName"
                        error={error}
                        helperText={messageError}
                        // label="Category Tag Name"
                        onChange={this.handlerOnChangeDeleteConfirm}
                        value={confirmNameTag}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}  color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handlerDeleteSubmit} color="primary">
                        DELETE
                    </Button>
                    



                </DialogActions>
            </Dialog>
      </div>
    )
  }
}
Tag.propTypes={
    categories:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired,
    getAllCategoryTag:PropTypes.func.isRequired,
    updateCategoryTag:PropTypes.func.isRequired,
    notifications:PropTypes.object.isRequired,
    deleteCategoryTag:PropTypes.func.isRequired
}

const mapStateToProps =(state)=>({
    categories:state.categories,
    notifications: state.notifications
})
export default compose(withStyles(styles), connect(mapStateToProps, { getAllCategoryTag, deleteCategoryTag, updateCategoryTag, createCategoryTag}))(Tag);
