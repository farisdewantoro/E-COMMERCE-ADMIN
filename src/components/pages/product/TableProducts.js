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
import {Link} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { deleteProduct, makeDiscount, addToCollection, addToRecommendation, removeRecommendation} from '../../../actions/productActions'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {withRouter} from 'react-router';
import qs from 'query-string';
function formatCurrency(value) {
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




class TableProducts extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        page: 0,
        rowsPerPage: 5,
        anchorEl:'',
        arrowRef: null,
        openActions:false,
        open:false,
        openDelete:false,
        openDiscount:false,
        openCollection:false,
        openRecommendation: false,
        openDeleteRecommendation: false,
        selectedProduct:{},
        collectionSelected:'',
        product_discount:{
            discount_percentage:0,
            valid_from:"",
            valid_until:""
        },
        search:''
    };
    componentDidMount(){
        let search = qs.parse(this.props.location.search);
        if(typeof search.search !== "undefined"){
            this.setState({
                search:search.search
            })
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        let productStatus = nextProps.productStatus;
    
        if (productStatus !== this.props.productStatus && productStatus.status){
            this.setState({
                openDelete: false,
                openDiscount: false,
                anchorEl: '',
                openActions: false,
                open: false,
                openCollection: false,
                openRecommendation: false,
                openDeleteRecommendation: false,
                selected:[]
            });
        }
        if(nextProps.notifications !== this.props.notifications){
            this.setState({
                openDelete: false,
                openDiscount: false,
                anchorEl: '',
                openActions: false,
                open: false,
                openCollection: false,
                openRecommendation: false,
                openDeleteRecommendation: false,
                selected: []
            });
        }
  
        
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
                selected:this.props.products.map(p=>p.id)
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
            anchorEl:event.currentTarget});
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    handlerClickPopover = (event) => {
        this.setState({
            anchorEl:event.currentTarget,
            open:true
        })
    }
    handlerOpenAction =(data)=>(e)=>{
        this.setState({
            anchorEl: e.currentTarget,
            openActions:true,
            selectedProduct:data
        });

    }
    handlerClosePopover = (event) => {
        this.setState({
            anchorEl:event.currentTarget,
            openActions:false,
            open:false
        })
    }
    handlerDeleteSelectedProduct =(e)=>{
        if(this.state.selected.length > 0){
            this.setState({
                openDelete: true,
                anchorEl:e.currentTarget ,
                openActions: false,
                open: false,
                openCollection: false,
                openRecommendation: false,
                openDeleteRecommendation: false,
            });
        }
    }
    handlerSubmitDeleteProduct = ()=>{
        if (this.state.selected.length > 0) {

            this.setState({
                openDelete: true,
                anchorEl: '',
                openActions: false,
                open: false,
                openCollection: false,
                openRecommendation: false,
                openDeleteRecommendation: false,
            });
            this.props.deleteProduct(this.state.selected);
            
        }
    }
    handlerMakeDiscount=()=>{
        if (this.state.selected.length > 0) {
            this.setState({
                openDelete: false,
                openDiscount:true,
                anchorEl: '',
                openActions: false,
                open: false,
                openCollection: false,
                openRecommendation: false,
                openDeleteRecommendation: false,
            });
        }
    }
    onChangeCollection = (e) => {
        this.setState({
            collectionSelected: e.target.value
        })
    }
    handlerOpenCollection = ()=>{
        if(this.state.selected.length > 0){
            this.setState({
                openCollection: true,
                openDelete: false,
                openDiscount: false,
                anchorEl: '',
                openActions: false,
                open: false,
                openRecommendation:false,
                openDeleteRecommendation: false,
            })
        }
    }
 
    handleCloseDialog = () => {
        this.setState({ openDeleteRecommendation: false,openDelete: false, openDiscount: false, openCollection: false, openRecommendation:false});
    };
    onChangeDiscount = (e)=>{
        let name = e.target.name;
        let value = e.target.value;
        this.setState(prevState=>({
            product_discount:{
                ...prevState.product_discount,
                [name]:value
            }
        }))
    }
    handlerSubmitDiscount = ()=>{
        if(this.state.selected.length > 0){
            let data = {
                id: this.state.selected,
                product_discount: this.state.product_discount
            }
            this.props.makeDiscount(data);
        }
 
    }
    handlerAddToCollection = ()=>{
        if (this.state.selected.length > 0) {
            let data = {
                id: this.state.selected,
                collectionSelected: this.state.collectionSelected
            }
            this.props.addToCollection(data,this.props.history);
        }
    }
 
    onChangeSearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }
    handlerSubmitSearch = () => {
        let search = this.state.search;
        this.props.history.push({ 
            pathname: '/product',
            search: `?search=${search}`
        })
    }
    handlerEnterSubmit=(e)=>{
        if (this.state.search !== '' && e.keyCode == 13) {
            let search = this.state.search;
            this.props.history.push({
                pathname: '/product',
                search: `?search=${search}`
            })
        }
    }
    handlerSubmitRecommendationProduct = () =>{
        let data = {
            id: this.state.selected
        }
        this.props.addToRecommendation(data,this.props.history);
    }
    handlerOpenRecommendation = ()=>{
        if (this.state.selected.length > 0) {
            this.setState({
                openCollection: false,
                openDelete: false,
                openDiscount: false,
                anchorEl: '',
                openActions: false,
                open: false,
                openRecommendation:true,
                openDeleteRecommendation: false,
            })
        }
    }
    handlerRemoveRecommendation = ()=>{
        if (this.state.selected.length > 0) {
            this.setState({
                openCollection: false,
                openDelete: false,
                openDiscount: false,
                anchorEl: '',
                openActions: false,
                open: false,
                openRecommendation: false,
                openDeleteRecommendation:true,
            })
        }
    }
    handlerSubmitDeleteRecommendation = ()=>{
        let data = {
            id: this.state.selected
        }
        this.props.removeRecommendation(data, this.props.history);
    }



    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, products, collections, tabs, handlerChangeTabs} = this.props;
        const { data, order, orderBy, 
            selected, rowsPerPage, page, 
           anchorEl, openActions,
            open, selectedProduct, openDelete
            , openDiscount, product_discount, collectionSelected } = this.state;
        const errorProductDiscount=this.props.errors.product_discount;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);
      
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
                    <Tab label="All Products" value="none"/>
                    <Tab label="OUR RECOMMEDATION" value="our-recommendation" />
                    {collections.collection.map((c,i)=>{
                        return(
                            <Tab label={c.name} key={i} value={c.slug}/>
                        )
                    })}
                </Tabs>
                <Divider/>
                <TableToolbarProducts 
                numSelected={selected.length} 
                anchorEl={anchorEl} 
                open={open}
                handlerDeleteSelectedProduct={this.handlerDeleteSelectedProduct}
                handlerClickPopover={this.handlerClickPopover}
                handlerClosePopover={this.handlerClosePopover}
                handlerMakeDiscount={this.handlerMakeDiscount}
                handlerOpenCollection={this.handlerOpenCollection}
                handlerSubmitSearch={this.handlerSubmitSearch}
                search={this.state.search}
                onChangeSearch={this.onChangeSearch}
                handlerChangeTabs={this.handlerChangeTabs}
                handlerEnterSubmit={this.handlerEnterSubmit}
                location={this.props.location.search}
                handlerOpenRecommendation={this.handlerOpenRecommendation}
                handlerRemoveRecommendation={this.handlerRemoveRecommendation}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <TableHeadProduct
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={products.length}

              
                        />
                        <TableBody>
                            {stableSort(products, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(p => {
                                    const isSelected = this.isSelected(p.id);
                                    return (
                                
                                        <TableRow
                                            hover
                                            // 
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={p.id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} onClick={event => this.handleClick(event, p.id)}/>
                                            </TableCell>
                                            <TableCell align="right" style={{padding:"10px 0"}}>
                                            <div style={{display:"flex",alignItems:"center"}}>

                                                    <img src={p.link} style={{ maxHeight:70,marginRight:"10px" }} alt="" /> {p.name}
                                                </div>
                                              
                                            </TableCell>
                                            <TableCell align="left">{p.category_type}</TableCell>
                                            <TableCell align="left">{p.category}</TableCell>
                                            <TableCell align="left">{p.stock}</TableCell>
                                            <TableCell align="left">
                                            <div>
                                                    <div >
                                                        <span
                                                            className={classNames(classes.regular_price, {
                                                                [classes.isDiscount]: (p.discount_value !== null && p.discount_percentage !== null)
                                                            })}>
                                                            {`IDR ${formatCurrency(p.regular_price)}`}
                                                        </span>
                                                   
                                                    </div>
                                                    <div className={classes.productDiscountPricing}>
                                                        {(p.discount_value !== null && p.discount_percentage !== null
                                                            ? <Typography component="p" className={classes.discount_value}>
                                                                {`IDR ${formatCurrency(p.discount_value)}`}
                                                            </Typography>
                                                            : '')}
                                                            
                                                        {(p.discount_value !== null && p.discount_percentage !== null
                                                            ? <Typography component="p" className={classes.discountPercentage}>
                                                                {p.discount_percentage}
                                                                % OFF
                                                                </Typography>
                                                            : <Typography component="p" className={classes.noDiscount}>
                                                                NO DISCOUNT
                                                                </Typography>)}
                                                    </div>
                                               
                                            </div>
                                          
                                            </TableCell>
                                            <TableCell align="left">
                                                <IconButton 
                                                    aria-owns={openActions ? 'menuActions' : undefined}
                                                    aria-haspopup="true"
                                        
                                                    onClick={this.handlerOpenAction(p)}>
                                                    <MoreHorizIcon/>
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
                    count={products.length}
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

                {Object.keys(selectedProduct).length > 0  ? (<Popover
                    id="menuActions"
                    open={openActions}
                    anchorEl={anchorEl}
                    onClose={this.handlerClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <MenuList>
                        <MenuItem onClick={this.handlerClosePopover} className={classes.menuListText}>View</MenuItem>
                        <Divider />
                        <MenuItem onClick={this.handlerClosePopover} className={classes.menuListText} component={Link} to={`/product/edit/${selectedProduct.slug}/${selectedProduct.id}`}>Edit</MenuItem>
                    </MenuList>
                </Popover>):''}
      
                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-delete-product"
                    open={this.state.openDelete}
                >
                    <DialogTitle id="dialog-delete-product" onClose={this.handleCloseDialog}>
                        Delete {selected.length} product?
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                          Deleted products cannot be recovered. Do you still want to continue?
                        </Typography>
                  
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitDeleteProduct} color="secondary" variant="contained">
                            Delete
                         </Button>
                    
                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-recommendation-product"
                    open={this.state.openRecommendation}
                >
                    <DialogTitle id="dialog-recommendation-product" onClose={this.handleCloseDialog}>
                        {selected.length} product  are selected !
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Add this product to recommendation ? click apply to continue 
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitRecommendationProduct} color="secondary" variant="contained">
                            Apply
                         </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-delete-recommendation-product"
                    open={this.state.openDeleteRecommendation}
                >
                    <DialogTitle id="dialog-delete-recommendation-product" onClose={this.handleCloseDialog}>
                        {selected.length} product  are selected !
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            remove this product from recommendation ? click remove to continue
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitDeleteRecommendation} color="secondary" variant="contained">
                            Remove
                         </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-discount"
                    open={this.state.openDiscount}
                >
                    <DialogTitle id="dialog-discount" onClose={this.handleCloseDialog}>
                        Make discount {selected.length} product?
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" spacing={16}>
                        <Grid item>
                                <TextField
                                    id="id_product_discount_percentage"
                                    label="Discount Percentage"
                                    name="discount_percentage"
                                    fullWidth
                                    error={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('discount_percentage') ? true : false}
                                    helperText={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('discount_percentage')  ? errorProductDiscount.discount_percentage : ''}
                                    style={{ paddingTop: 10 }}
                                    margin="normal"
                                    type="number"
                                    value={product_discount.discount_percentage}
                                    onChange={this.onChangeDiscount}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        inputProps: { min: 0, max: 90 }
                                    }}
                                />
                        </Grid>
                            <Grid item>
                                <TextField
                                    id="datetime-local"
                                    label="Valid From"
                                    fullWidth
                                    name="valid_from"
                                    error={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('valid_from') ? true : false}
                                    helperText={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('valid_from') ? errorProductDiscount.valid_from : ''}
                                  type="datetime-local"
                                    value={product_discount.valid_from}
                                    onChange={this.onChangeDiscount}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="datetime-local"
                                    label="Valid Until"
                                    name="valid_until"
                                    fullWidth
                                    error={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('valid_until') ? true : false}
                                    helperText={typeof errorProductDiscount !== "undefined" && errorProductDiscount.hasOwnProperty('valid_until') ? errorProductDiscount.valid_until : ''}
                                  value={product_discount.valid_until}
                                    onChange={this.onChangeDiscount}
                                    type="datetime-local"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Typography gutterBottom>
                                    When you make a discount, the previous discount will be changed. Do you still want to continue?
                                </Typography>
                            </Grid>

                        </Grid>
                  
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerSubmitDiscount} color="secondary" variant="contained">
                            APPLY
                         </Button>

                    </DialogActions>
                </Dialog>



                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-collection"
                    open={this.state.openCollection}
                >
                    <DialogTitle id="dialog-collection" onClose={this.handleCloseDialog}>
                        Add to collection : {selected.length} product selected.
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" spacing={16}>
                         <Grid item>
                                <FormControl className={classes.formControl} fullWidth>
                                    <NativeSelect
                                        value={collectionSelected}
                                        onChange={this.onChangeCollection}
                                        name="sizingSelected"
                                        className={classes.selectEmpty}
                                    >
                                        <option value="">None</option>
                                        {collections.collection.map((s, i) => {

                                            return (
                                                <option key={i} value={JSON.stringify(s)}>{s.name}</option>
                                            )
                                        })}

                                    </NativeSelect>
                                </FormControl>  
                         </Grid>

                            <Grid item>
                                <Typography gutterBottom>
                                    When you add to collection, the previous collection will be changed. Do you still want to continue?
                                </Typography>
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerAddToCollection} color="secondary" variant="contained">
                            APPLY
                         </Button>

                    </DialogActions>
                </Dialog>
            </Paper>
        );
    }
}

TableProducts.propTypes = {
    classes: PropTypes.object.isRequired,
    products:PropTypes.array.isRequired,
    deleteProduct:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired,
    collections:PropTypes.object.isRequired,
    addToCollection:PropTypes.func.isRequired,
    notifications:PropTypes.object.isRequired,
    addToRecommendation: PropTypes.func.isRequired,
    removeRecommendation:PropTypes.func.isRequired
};

const mapStateToProps=(state)=>({
    errors:state.errors,
    notifications:state.notifications
})

export default compose(
    connect(mapStateToProps, 
        { deleteProduct, makeDiscount, addToCollection, addToRecommendation, removeRecommendation}),
        withStyles(styles))
        (withRouter(TableProducts));

