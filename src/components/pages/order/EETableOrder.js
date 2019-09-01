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
import { changeStatusOrder, deleteOrderSelected} from '../../../actions/orderActions';
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
import qs from 'query-string';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
function formatCurrency(value) {
    if(value === null || typeof value === null || value.length === 0 ){
        return 0;
    }
    return value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
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




class TableOrder extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        page: 0,
        rowsPerPage: 5,
        anchorEl: '',
        arrowRef: null,
        openActions: false,
        open: false,
        openDelete: false,
        openChangeStatus: false,
        selectedOrder: {},
        selectedStatusOrder:"",
        product_discount: {
            discount_percentage: 0,
            valid_from: "",
            valid_until: ""
        },
        searchText:''
    };

    componentDidMount(){
      let search =  qs.parse(this.props.location.search);
      if(typeof search.search !== "undefined"){
          this.setState({
              searchText: search.search
          })
      }
     
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
     
        if (nextProps.notifications !== this.props.notifications) {
            this.setState({
                openDelete: false,
                openChangeStatus: false,
                anchorEl: '',
                openActions: false,
                open: false,
                selected: []
            });
        }


    }
    onSubmitSearch = ()=>{
        if(this.state.search !== ''){
            let searchData = {
                search: this.state.searchText
            }
            this.props.history.push({
                pathname:"/order",
                search: qs.stringify(searchData)
            });
            this.props.getAllOrder(null, qs.stringify(searchData));
        }
    }
    onSubmitSearchEnter = (e)=>{
        if (this.state.search !== '' && e.keyCode == 13) {
            let searchData = {
                search: this.state.searchText
            }
            this.props.history.push({
                pathname: "/order",
                search: qs.stringify(searchData)
            });
            this.props.getAllOrder(null, qs.stringify(searchData));
        }
    }
    onChangeSearch =(e)=>{
        this.setState({
            searchText:e.target.value
        })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState({
                selected: this.props.orders.map(o => o.order_id)
            })
            return

        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({
            selected: newSelected,
            anchorEl: event.currentTarget
        });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    handlerClickPopover = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        })
    }
    handlerOpenAction = (data) => (e) => {
        this.setState({
            anchorEl: e.currentTarget,
            openActions: true,
            selectedProduct: data
        });

    }
    handlerClosePopover = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            openActions: false,
            open: false
        })
    }
    handlerDeleteSelectedOrder = (e) => {
        if (this.state.selected.length > 0) {
            this.setState({
                openDelete: true,
                anchorEl: e.currentTarget,
                openActions: false,
                open: false
            });
           
        }
    }
    handlerSubmitDeleteOrder = () => {
        if (this.state.selected.length > 0) {

            this.setState({
                openDelete: true,
                anchorEl: '',
                openActions: false,
                open: false,
            });
            this.props.deleteOrderSelected(this.state.selected);

        }
    }
    handlerSubmitOrderStatus = ()=>{
        if (this.state.selectedStatusOrder !== ''){
            this.props.changeStatusOrder(this.state.selected,this.state.selectedStatusOrder);
        }
    }
    handlerChangeStatus = () => {
        if (this.state.selected.length > 0) {
            this.setState({
                openDelete: false,
                openChangeStatus: true,
                anchorEl: '',
                openActions: false,
                open: false,
            });
        }
    }
    onChangeStatusOrder =(e)=>{
        this.setState({
            selectedStatusOrder:e.target.value
        })
    }
    onChangeCollection = (e) => {
        this.setState({
            collectionSelected: e.target.value
        })
    }


    handleCloseDialog = () => {
        this.setState({ openDelete: false, openChangeStatus: false,  });
    };
    onChangeDiscount = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState(prevState => ({
            product_discount: {
                ...prevState.product_discount,
                [name]: value
            }
        }))
    }
    handlerSubmitDiscount = () => {
        if (this.state.selected.length > 0) {
            let data = {
                id: this.state.selected,
                product_discount: this.state.product_discount
            }
            this.props.makeDiscount(data);
        }

    }






    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, tabs, handlerChangeTabs,orders } = this.props;
        const { data, order, orderBy,
            selected, rowsPerPage, page,
            anchorEl, openActions,
            open, selectedProduct, openDelete
            , openChangeStatus } = this.state;
        const errorProductDiscount = this.props.errors.product_discount;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);
        
        return (
            <Paper className={classes.root}>
                <Tabs
                    value={tabs}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="auto"
                    variant="scrollable"
                    onChange={handlerChangeTabs}
                >
                    <Tab label="ALL ORDERS" value="all" />
                    <Tab label="TODAY" value="today" />
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
                    handlerDeleteSelectedOrder={this.handlerDeleteSelectedOrder}
                    handlerClickPopover={this.handlerClickPopover}
                    handlerClosePopover={this.handlerClosePopover}
                    handlerChangeStatus={this.handlerChangeStatus}
                    searchText={this.state.searchText}
                    onSubmitSearch={this.onSubmitSearch}
                    onChangeSearch={this.onChangeSearch}
                    onSubmitSearchEnter={this.onSubmitSearchEnter}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <TableHeadProduct
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={orders.length}

                        />
                        <TableBody>
                            {stableSort(orders, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((o,i) => {
                                    const isSelected = this.isSelected(o.order_id);
                                    return (

                                        <TableRow
                                            hover
                                            // 
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={o.order_id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} onClick={event => this.handleClick(event, o.order_id)} />
                                            </TableCell>
                                            <TableCell align="left">{o.order_id}</TableCell>
                                            <TableCell align="left">{o.email}</TableCell>
                                            <TableCell align="left">
                                            {o.order_status_id === 2 && (
                                                    <Chip
                                                        label={o.order_status}
                                                        color="default"
                                                    />
                                            )}
                                                {(o.order_status_id === 3 || o.order_status_id === 1)   && (
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
                                                            colorPrimary:classes.colorCompleted
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
                                          
                                            
                                            
                                            </TableCell>
                                            <TableCell align="left">
                                                {o.status_code === "201" && (
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
                                          
                                          
                                            </TableCell>
                                            <TableCell align="left">{o.payment_type}</TableCell>
                                            <TableCell align="left">IDR {formatCurrency(o.gross_amount)}</TableCell>
                                            <TableCell align="left">
                                                <IconButton
                                                    aria-owns={openActions ? 'menuActions' : undefined}
                                                    aria-haspopup="true"
                                                    component={Link}
                                                    to={`/order/detail/${o.order_id}`}
                                                   >
                                                    <RemoveRedEyeIcon />
                                                </IconButton>


                                            </TableCell>
                                        </TableRow>

                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>


                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />

    

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-delete-product"
                    open={this.state.openDelete}
                >
                    <DialogTitle id="dialog-delete-product" onClose={this.handleCloseDialog}>
                        Delete {selected.length} order?
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Deleted order cannot be recovered. Do you still want to continue?
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitDeleteOrder} color="secondary" variant="contained">
                            Delete
                         </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-discount"
                    open={this.state.openChangeStatus}
                >
                    <DialogTitle id="dialog-discount" onClose={this.handleCloseDialog}>
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
                                        value={this.state.selectedStatusOrder}
                                        onChange={this.onChangeStatusOrder}
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
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitOrderStatus} color="secondary" variant="contained">
                            APPLY
                         </Button>

                    </DialogActions>
                </Dialog>


            </Paper>
        );
    }
}

TableOrder.propTypes = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    changeStatusOrder:PropTypes.func.isRequired,
    deleteOrderSelected:PropTypes.func.isRequired,
    getAllOrder:PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    notifications: state.notifications
})

export default compose(
    connect(mapStateToProps,
        { changeStatusOrder, deleteOrderSelected }),
    withStyles(styles))
    (withRouter(TableOrder));

