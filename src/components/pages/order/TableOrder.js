import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import styles from './styles'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TableHeadProduct from './TableHeadProduct';
import TableToolbarProducts from './TableToolbarProducts';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { withRouter } from 'react-router';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import qs from 'query-string';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import {
    Card,
    CardContent,
} from '@material-ui/core';
import FilterComponent from './filter';

function formatCurrency(value) {
    if(value === null || typeof value === null || value.length === 0 ){
        return 0;
    }
    return value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


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




const TableOrder = (props)=> {

        const { 
            classes, 
            tabs, 
            handlerChangeTabs, 
            orders, searchText, 
            onChangeSearch, 
            onSubmitSearch, 
            onSubmitSearchEnter,
            paginationContainer,
            isSelected,
            handlerClickPopover,
            handlerClosePopover,
            handlerChangeStatus,
            handlerDeleteSelectedOrder,
            handleCloseDialog,
            open,
            openDelete,
            openChangeStatus,
            selectedOrder,
            selectedStatusOrder,
            selected,
            anchorEl,
            openActions,
            handlerSubmitDeleteOrder,
            handlerSubmitOrderStatus,
            onChangeStatusOrder,
            handleClick,
            handlerChangeResi,
            listCourier,
            selectedCourier,
            onChangeCourier,
            openChangeResi,
            handlerOnChangeKodeResi,
            kodeResi,
            handlerSubmitResi,
            handlerSelectSort,
            selectSort,
     
             } = props;
        let dataOrder = orders.order;
        
        if(selectSort.length > 0 && dataOrder.length > 0 && tabs === "today"){
          let newOrderData =  [];
          dataOrder.forEach(d=>{
              if (selectSort.filter(ss=>ss.value === d.order_status_id).length > 0){
                  newOrderData.push(d);
                }
            });
        dataOrder = newOrderData;
        }
       


        return (
            <Paper className={classes.root}>
                <Tabs
                    value={tabs}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    onChange={handlerChangeTabs}
                >
                    <Tab label="ALL ORDERS" value="all" />
                    <Tab label="TODAY" value="today" />
                    <Tab label="CONFIRM-PAYMENT" value="confirm-payment" />
                    <Tab label="ON PROGRESS" value="onprogress" />
                    <Tab label="COMPLETED" value="completed" />
                    <Tab label="PENDING PAYMENT" value="pending" />
                    <Tab label="CANCELLED" value="cancelled" />
                </Tabs>
                <Divider />
                <TableToolbarProducts
                    numSelected={selected.length}
                    anchorEl={anchorEl}
                    open={open}
                    handlerDeleteSelectedOrder={handlerDeleteSelectedOrder}
                    handlerClickPopover={handlerClickPopover}
                    handlerClosePopover={handlerClosePopover}
                    handlerChangeStatus={handlerChangeStatus}
                    searchText={searchText}
                    onSubmitSearch={onSubmitSearch}
                    onChangeSearch={onChangeSearch}
                    onSubmitSearchEnter={onSubmitSearchEnter}
                    handlerChangeResi={handlerChangeResi}
               
                    tabs={tabs}
                    
                />
                <div className={classes.tableWrapper}>
                    <Grid container direction="column" spacing={8} style={{padding:'5px 20px'}}>
                    <Grid item md={12}>
                        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                {/* <FilterComponent
                                    handlerSelectSort={handlerSelectSort}
                                    selectSort={selectSort}
                                /> */}
                            {paginationContainer()}

                        </div>
                    </Grid>
                        {dataOrder.map(o=>{
                            const isSelectedID = isSelected(o.order_id);
                          
                            return(
                                <Grid item md={12} key={o.order_id}>
                                    <Card>
                                        <CardContent>
                                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div>
                                                        <Checkbox checked={isSelectedID} onClick={event => handleClick(event, o.order_id)} />
                                                    </div>
                                                    <div>
                                                        <Typography>
                                                            <strong> Order ID :</strong> {o.order_id}
                                                        </Typography>
                                                        <Typography>
                                                            <strong> Last Update :</strong> {moment(o.updated_at).format('LLL')}
                                                        </Typography>
                                                        <Typography>
                                                            <strong> Email : </strong>{o.email}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Payment Type : </strong> {o.payment_type ? o.payment_type: "none"}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Total :</strong> IDR {formatCurrency(o.gross_amount)}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Transaction Time : </strong> {o.transaction_time ? moment(o.transaction_time).format("LLL") : "none"}
                                                        </Typography>
                                                        {o.kodeResi && (
                                                            <Typography>
                                                                <strong>Kode Resi : </strong> {o.kodeResi}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                
                                                </div>
                                                <div>
                                                    <Typography>
                                                        <strong>Courier : </strong> {o.courier}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Service : </strong> {o.service}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Description : </strong> {o.description}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Phone Number : </strong> {o.phone_number}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Estimated time : </strong> {o.etd ? o.etd: "none"}
                                                    </Typography>
                                                

                                                </div>
                                                <div>
                                                    <div >
                                                        <div >
                                                            <Typography style={{ margin: "0px 5px" }}>
                                                                <strong> Status Order :</strong>
                                                            </Typography>
                                                            {o.order_status_id === 2 && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="default"
                                                                />
                                                            )}
                                                            {(o.order_status_id === 3 || o.order_status_id === 1) && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="secondary"
                                                                />
                                                            )}
                                                            {o.order_status_id === 4 && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="primary"
                                                                />
                                                            )}
                                                            {o.order_status_id === 5 && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="primary"
                                                                    classes={{
                                                                        colorPrimary: classes.colorCompleted
                                                                    }}
                                                                />
                                                            )}
                                                            {o.order_status_id === 6 && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="primary"
                                                                    classes={{
                                                                        colorPrimary: classes.colorCancelled
                                                                    }}
                                                                />
                                                            )}
                                                            {o.order_status_id === 7 && (
                                                                <Chip
                                                                    label={o.order_status}
                                                                    color="primary"
                                                                    classes={{
                                                                        colorPrimary: classes.colorConfirmPayment
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        {o.status_code && o.payment_type !== 'bank_transfer_manual' && (
                                                            <div>
                                                                
                                                            <Typography style={{ margin: "0px 5px" }}>
                                                                <strong> Transaction Status :</strong>
                                                            </Typography>
                                                        
                                                      
                                                        {o.status_code === "201" && (
                                                            <Chip
                                                                label={o.transaction_status}
                                                                color="secondary"
                                                            />
                                                        )}
                                                        {o.status_code === "407" && (
                                                            <Chip
                                                                label={o.transaction_status}
                                                                color="secondary"
                                                            />
                                                        )}
                                                        {(o.status_code === "200") && (
                                                            <Chip
                                                                label={o.transaction_status}
                                                                color="primary"
                                                            />
                                                        )}
                                                        {o.status_code === "202" && (
                                                            <Chip
                                                                label={o.transaction_status}
                                                                color="default"
                                                            />
                                                        )}

                                                            </div>
                                                        )}
                                                    </div>
                                               
                                                    <div style={{ display: 'flex', alignItems: 'center', margin: 5 }}>
                                                        <Typography style={{ margin: "0px 5px" }}>
                                                            <strong>More Detail :</strong> 
                                                        </Typography>       
                                                        <IconButton
                                                            aria-owns={openActions ? 'menuActions' : undefined}
                                                            aria-haspopup="true"
                                                            component={Link}
                                                            to={`/order/detail/${o.order_id}`}
                                                        >
                                                            <RemoveRedEyeIcon />
                                                        </IconButton>
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}

                        <Grid item md={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {paginationContainer()}
                            </div>
                        </Grid>
                    </Grid>

                </div>
         

    

                <Dialog
                    onClose={handleCloseDialog}
                    aria-labelledby="dialog-delete-product"
                    open={openDelete}
                >
                    <DialogTitle id="dialog-delete-product" onClose={handleCloseDialog}>
                        Delete {selected.length} order?
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Deleted order cannot be recovered. Do you still want to continue?
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={handlerSubmitDeleteOrder} color="secondary" variant="contained">
                            Delete
                         </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={handleCloseDialog}
                    aria-labelledby="dialog-discount"
                    open={openChangeStatus}
                >
                    <DialogTitle id="dialog-discount" onClose={handleCloseDialog}>
                        {selected.length} Order selected
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" spacing={16}>

                            <Grid item >
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel shrink htmlFor="order-status">
                                        ORDER STATUS
                                     </InputLabel>
                                    <NativeSelect
                                        value={selectedStatusOrder}
                                        onChange={onChangeStatusOrder}
                                        input={<Input name="orderStatus" id="order-status" />}
                                    >
                                        <option value={""}>None</option>
                                        <option value={5}>Completed</option>
                                        <option value={6}>Cancelled by admin</option>
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom>
                                    When you change this, in user it will be changed. Do you still want to continue?
                                </Typography>
                                {selectedStatusOrder == 6 && (
                                <FormHelperText style={{fontWeight:"bold"}} error>
                                     IMPORTANT ! WHEN CANCELING THE ORDER YOU MUST CHECK IT BACK IN THE MIDTRANS AND SET ORDER STATUS TO CANCEL  https://dashboard.midtrans.com       
                                </FormHelperText>
                                )}
                           
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={handlerSubmitOrderStatus} color="secondary" variant="contained">
                            APPLY
                         </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={handleCloseDialog}
                    aria-labelledby="dialog-discount"
                    open={openChangeResi}
                >
                    <DialogTitle id="dialog-discount" onClose={handleCloseDialog}>
                        Add or edit resi 
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" spacing={16}>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} required fullWidth>
                                <InputLabel shrink htmlFor="resi-kode">
                                    NO RESI
                                     </InputLabel>
                                    <Input
                                        id="resi-kode"
                                        value={kodeResi}
                                        onChange={handlerOnChangeKodeResi}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel shrink htmlFor="resi-courier">
                                        Courier
                                     </InputLabel>
                                    <NativeSelect
                                        value={selectedCourier}
                                        onChange={onChangeCourier}
                                        input={<Input name="selectedCourier" id="resi-courier" />}
                                    >
                                        <option  >none</option>
                                        {listCourier.map(l=>{
                                            return(
                                                <option value={l} key={l}>{l}</option>
                                            )
                                        })}
                                     
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom>
                                   After successfully adding or updating it will send a message to the user
                                </Typography>
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={handlerSubmitResi} color="secondary" variant="contained">
                            APPLY
                         </Button>

                    </DialogActions>
                </Dialog>

            </Paper>
        );
    
}

export default TableOrder;

