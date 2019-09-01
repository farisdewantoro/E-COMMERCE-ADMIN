import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import moment from 'moment';
import { getAllCategory, deleteCategory} from '../../../actions/categoryActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableLoader from '../../loader/TableLoader';

 class Category extends Component {
  state={
    categories:[],
    open: false,
    selectedDelete:{},
    confirmDelete:'',
    error:false,
    messageError:''
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    if (nextProps.categories.category !== this.props.categories.category){
      this.setState({
        categories: nextProps.categories.category
      })
    }
    if (nextProps.notifications !== this.props.notifications) {
      if (!nextProps.notifications.error) {
        this.setState({ open: false, error: false, messageError:'', confirmDelete: '', selectedDelete: {} });
      }
    }

  }
  componentDidMount(){
    this.props.getAllCategory();
  }


   handleClose = () => {
     this.setState({ open: false, error: false, messageError: false, confirmDelete: '', selectedDelete:{} });
   };
   handlerDeleteForm = (data)=>{
      this.setState({
        open: true,
        selectedDelete:data 
      })
   }
   onChangeConfirmDelete=(e)=>{
      this.setState({
        confirmDelete:e.target.value
      })
   }
   onSubmitDelete=()=>{
     if(this.state.selectedDelete.name.toLowerCase() !== this.state.confirmDelete.toLowerCase()){
        this.setState({
          error:true,
          messageError:"VALUE MUST BE THE SAME"
        })
     }else{
       this.props.deleteCategory(this.state.selectedDelete.id);
     }
   }

  render() {

    const { classes} = this.props;
    const { categories, selectedDelete, confirmDelete, error,messageError} = this.state;
    const {loading} = this.props.categories;
    return (
      <div>
        <Grid container spacing={16}>
        <Grid item>
            <Button variant="contained" component={Link} to="/category/create" color="primary">
                        CREATE NEW CATEGORY
            </Button>
        </Grid>
        <Grid item>
            <Button variant="contained" component={Link} to="/category/tag/edit" color="primary">
                        EDIT CATEGORY TAG
            </Button>
        </Grid>
        
        </Grid>
        {categories.length > 0 ? (<div style={{ margin: "20px 0" }}>
          <Grid container>
            <Paper className={classes.root}>
              {loading ? (<TableLoader />) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell >No</TableCell>
                      <TableCell>Tag Name</TableCell>
                      <TableCell align="left">Category Name</TableCell>
                      <TableCell align="left">Created At</TableCell>
                      <TableCell align="left">Updated At</TableCell>
                      <TableCell align="left">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell component="th" style={{ width: 10 }} scope="row">
                          {i + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {c.tag_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {c.name}
                        </TableCell>
                        <TableCell align="left">{moment(c.created_at).format('LL')}</TableCell>
                        <TableCell align="left">{moment(c.updated_at).format('LL')}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={() => this.handlerDeleteForm(c)}>
                            <DeleteIcon />
                          </IconButton>
                          <IconButton component={Link} to={`/category/update/${c.id}`}>
                            <BuildIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </div>) : (<TableLoader />)}
      
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">DELETE CATEGORY ? </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Deleting a category means removing all related products. Are you sure you want to delete this? type this for confirmation : <span style={{fontWeight:"bold"}}> {selectedDelete.name}</span>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="confirmDelete"
              value={confirmDelete}
              error={error}
              helperText={messageError}
              onChange={this.onChangeConfirmDelete}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmitDelete} color="primary">
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

Category.propTypes={
  classes:PropTypes.object.isRequired,
  getAllCategory:PropTypes.func.isRequired,
  deleteCategory:PropTypes.func.isRequired,
  notifications:PropTypes.func.isRequired
}

const mapStateToProps =(state)=>({
  categories:state.categories,
  notifications:state.notifications
})

export default compose(withStyles(styles), connect(mapStateToProps, { getAllCategory, deleteCategory}))(Category);
