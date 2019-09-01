import React, { Component } from 'react'
import styles from './styles';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { getAllVoucher, deleteVoucher} from '../../../actions/voucherActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableLoader from '../../loader/TableLoader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
class Voucher extends Component {
  state={
    open: false,
    selectedDelete:'',
  }
  componentDidMount(){
    this.props.getAllVoucher();
  }

  handlerDeleteVoucher = ()=>{
    this.props.deleteVoucher(this.state.selectedDelete);
    this.setState({
      open: false,
      selectedDelete:''
    })
  }
  handleCloseDialog = () => {
    this.setState({ open: false});
  };
  handlerDeleteForm = (data) => {
    this.setState({
      open: true,
      selectedDelete: data
    })
  }

  render() {
    const {vouchers,classes} = this.props;
    const {open,selectedDelete,messageError,error,confirmDelete} = this.state;
    return (
      <div >
        <Grid container direction="column">  
          <Grid item md={12}>
            <Button color="primary" component={Link} to="/voucher/create" variant="contained" style={{marginBottom:"10px"}}>
              CREATE VOUCHER DISCOUNT
            </Button>
            {vouchers.loading ? (<TableLoader/>):(
              <Grid container >
                <Paper className={classes.rootTable}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Voucher Code</TableCell>
                        <TableCell align="left">Voucher Name</TableCell>
                        <TableCell align="left">Voucher Type</TableCell>
                        <TableCell align="left">Max Uses</TableCell>
                        <TableCell align="left">Value</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vouchers.voucher.map((v, i) => (
                        <TableRow key={i}>

                          <TableCell align="left">
                            {v.id}
                          </TableCell>
                          <TableCell align="left">
                            {v.name}
                          </TableCell>
                          <TableCell align="left" style={{ textTransform: "uppercase" }}>{v.voucher_type}</TableCell>
                          <TableCell align="left">{v.max_uses}</TableCell>
                          <TableCell align="left">{v.value}</TableCell>
                          <TableCell align="left">
                            <Typography
                              className={classNames(classes.isNotActive,
                                { [classes.isActive]: (v.status === "ACTIVE") })}>
                              {v.status}
                            </Typography>


                          </TableCell>
                          <TableCell align="left">
                            <IconButton onClick={() => this.handlerDeleteForm(v.id)}>
                              <DeleteIcon />
                            </IconButton>
                            <IconButton component={Link} to={`/voucher/edit/${v.id}`}>
                              <BuildIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                </Paper>
              </Grid>
            )}
          
          </Grid>
        </Grid>

        <Dialog
          onClose={this.handleCloseDialog}
          aria-labelledby="dialog-delete-voucher"
          open={this.state.open}
        >
          <DialogTitle id="dialog-delete-voucher" onClose={this.handleCloseDialog}>
            Delete  voucher?
                    </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Deleted voucher cannot be recovered. Do you still want to continue?
               </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
              Cancel
                         </Button>
            <Button onClick={this.handlerDeleteVoucher} color="secondary" variant="contained">
              Delete
                         </Button>

          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
Voucher.propType = {
  classes: PropTypes.object.isRequired,
  getAllVoucher:PropTypes.func.isRequired,
  vouchers:PropTypes.object.isRequired,
  deleteVoucher:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
 vouchers:state.vouchers
})


export default compose(connect(mapStateToProps, { getAllVoucher, deleteVoucher}), withStyles(styles))
  (Voucher);

