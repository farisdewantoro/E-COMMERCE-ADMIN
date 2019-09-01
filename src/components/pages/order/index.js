import React, { Component } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import styles from './styles'
import TableOrder from './TableOrder';
import { getAllOrder, changeStatusOrder, deleteOrderSelected, downloadDataOrder, updateKodeResi } from '../../../actions/orderActions';
import TableLoader from '../../loader/TableLoader';
import { withRouter } from 'react-router';
import qs from 'query-string';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'



class Order extends Component {
    state = {
        tabs: "all",
        current_page_state:1,
        searchText: '',
        selected:[],
        anchorEl:'',
        open: false,
        openDelete: false,
        openChangeStatus: false,
        selectedOrder: {},
        selectedStatusOrder: "",
        openActions: false,
        selectedCourier:'',
        openChangeResi:false,
        kodeResi:'',
        selectSort:[]
    }









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
            open: false,
            openChangeResi:false
        })
    }
    handlerDeleteSelectedOrder = (e) => {
        if (this.state.selected.length > 0) {
            this.setState({
                openDelete: true,
                anchorEl: e.currentTarget,
                openActions: false,
                open: false,
                openChangeResi: false
            });

        }
    }
    handlerChangeResi = (e) =>{
        if (this.state.selected.length > 0 && this.state.selected.length > 1){
            alert(`ONLY CAN UPDATE 1 ORDER !!! `);
            this.setState({
                openDelete: false,
                anchorEl: e.currentTarget,
                openActions: false,
                open: false,
                openChangeResi: false
            });
        }else{
                let order_id = this.state.selected.toString();
                let data = this.props.orders.order.filter(o=>o.order_id === order_id).map(ord=>{
                    return{
                        kodeResi: ord.kodeResi ? ord.kodeResi: '',
                        selectedCourier: ord.kode_courier ? ord.kode_courier : ''
                    }
                });
            if(data.length > 0){
                this.setState({
                    openDelete: false,
                    anchorEl: e.currentTarget,
                    openActions: false,
                    open: false,
                    openChangeResi: true,
                    kodeResi: data[0].kodeResi,
                    selectedCourier: data[0].selectedCourier
                });
            }else{
                this.setState({
                    openDelete: false,
                    anchorEl: e.currentTarget,
                    openActions: false,
                    open: false,
                    openChangeResi: true,
                });
            }
        
        }
        
    }

    onChangeCourier = (e)=>{

        this.setState({
            selectedCourier:e.target.value
        })
    }
    handlerOnChangeKodeResi = (e)=>{
        this.setState({
            kodeResi:e.target.value
        })
    }
    handlerSubmitResi = ()=>{
        if(this.state.selected.length === 1 ){
            const data = {
                order_id: this.state.selected.toString(),
                kodeResi: this.state.kodeResi,
                courier: this.state.selectedCourier
            }
            this.props.updateKodeResi(data);
        }
  
    }

    handlerSubmitDeleteOrder = () => {
        if (this.state.selected.length > 0) {

            this.setState({
                openDelete: true,
                anchorEl: '',
                openActions: false,
                open: false,
                openChangeResi: false,
            });
            this.props.deleteOrderSelected(this.state.selected);

        }
    }
    handlerSubmitOrderStatus = () => {
        if (this.state.selectedStatusOrder !== '') {
            this.props.changeStatusOrder(this.state.selected, this.state.selectedStatusOrder);
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
                openChangeResi: false,
            });
        }
    }
    onChangeStatusOrder = (e) => {
        this.setState({
            selectedStatusOrder: e.target.value
        })
    }
    onChangeCollection = (e) => {
        this.setState({
            collectionSelected: e.target.value
        })
    }


    handleCloseDialog = () => {
        this.setState({ openDelete: false, openChangeStatus: false, openChangeResi: false, });
    };

    componentDidMount() {
        let category = this.props.match.params.category;
        let search = qs.parse(this.props.location.search);
      
        if (typeof search.search !== "undefined") {
            this.setState({
                searchText: search.search
            })
        }
        if (typeof search.page !== "undefined") {
            this.setState({
               
                current_page_state: parseInt(search.page)
            })
        }
        if(category === '' || typeof category === "undefined" || category.length === 0){
            category = "all";
        }
  
        if (category){
            this.setState({
                tabs: category,
     
            });
        }

        this.props.getAllOrder(category, qs.stringify(search));
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.match.params.category !== this.props.match.params.category) {
        //     this.props.getAllOrder(nextProps.match.params.category, nextProps.location.search);
        // }
        // if (nextProps.location.search !== this.props.location.search){
        //     this.props.getAllOrder(this.props.match.params.category,nextProps.location.search);
        // }
        
        if (nextProps.notifications !== this.props.notifications) {
            this.setState({
                openDelete: false,
                openChangeStatus: false,
                anchorEl: '',
                openActions: false,
                open: false,
                selected: [],
                openChangeResi: false
            });
        }

    }
    handleChangePage = (no) => {
        this.setState({
            current_page_state: no
        });
        let data = {
            page: no,
            search:this.state.searchText
        }
        for (const key in data) {
            if (!data[key]) {
                delete data[key];
            }
        }
        let params = qs.stringify(data);

        this.props.history.push({
            search: params
        });
        this.props.getAllOrder(this.props.match.params.category, params);
    }


    handlerChangeTabs = (event, value) => {
        if (value !== "all") {
            this.setState({
                selected: [],
                tabs: value,
                current_page_state:1
            });
            this.props.history.push(`/order/${value}`);
            this.props.getAllOrder(value, null);
        } else {
      

            this.setState({
                selected: [],
                tabs: value,
                current_page_state: 1
            });
            this.props.history.push({
                pathname: '/order/all'
            })
            this.props.getAllOrder(value, null);
        }

    }
    onChangeSearch = (e) => {
        this.setState({
            searchText: e.target.value
        })
    }
    onSubmitSearch = () => {
        if (this.state.search !== '') {
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
    onSubmitSearchEnter = (e) => {
        if (this.state.search !== '' && e.keyCode == 13) {
            let searchData = {
                search: this.state.searchText
            }
            this.props.history.push({
                pathname: "/order",
                search: qs.stringify(searchData)
            });
            this.setState({
                current_page_state:1,
                tabs:null
            })
            this.props.getAllOrder(null, qs.stringify(searchData));
        }
    }


    handlerDownloadDataOrder = ()=>{
        this.props.downloadDataOrder();
    }
  
    handlerSelectSort = (e)=>{
           this.setState({
               selectSort:e.target.value
           });
        
       
        
    }

    paginationContainer = () => {
        const { perPage, total_page, results } = this.props.orders.pagination;
        let current_page = this.state.current_page_state;

        let jarak = 2;
        const page = [];
        for (let index = 0; index < total_page; index++) {
            page.push(index + 1);
        }

        if (page.length === 0 && results > 0) {
            return (
                <Button variant='contained' color="primary" style={{ padding: 0, margin: 5, minWidth: 20, minHeight: 20 }}>
                    1
            </Button>
            )

        }
        if (page.length < 4) {
            return (
                <div>
                    {page.map((no, i) => {
                        return (
                            <Button
                                key={i}
                                variant={no === current_page ? 'contained' : 'outlined'}
                                color={no === current_page ? 'primary' : 'inherit'}
                                onClick={() => this.handleChangePage(no)}
                                style={{ padding: 0, margin: 5, minWidth: 20, minHeight: 20 }}>
                                {no}
                            </Button>
                        )
                    })}


                </div>
            )
        }

        if (page.length > 4) {
    
            return (
                <div style={{ display: "flex", alignItems: "baseline" }}>

                    <div>
                        <Button
                            disabled={page.filter(p => p < current_page).length === 0}
                            onClick={() => this.handleChangePage(current_page - 1)}
                            style={{ padding: 0, margin: 5, minWidth: 25, minHeight: 25 }}>
                            <KeyboardArrowLeft />
                        </Button>
                    </div>

                    {page.slice(current_page - jarak, current_page - 1).map((no, i) => {
                        return (
                            <div key={i}>
                                <Button
                                    variant={no === current_page ? 'contained' : 'outlined'}
                                    style={{ padding: 0, margin: 5, minWidth: 22, minHeight: 22 }}
                                    color={no === current_page ? 'primary' : 'inherit'}
                                    onClick={() => this.handleChangePage(no)}
                                >
                                    {no}
                                </Button>
                            </div>

                        )
                    })}

                    {page.slice(current_page - 1, current_page + jarak).map((no, i) => {
                        return (
                            <div key={i}>
                                <Button

                                    variant={no === current_page ? 'contained' : 'outlined'}
                                    style={{ padding: 0, margin: 5, minWidth: 22, minHeight: 22 }}
                                    color={no === current_page ? 'primary' : 'inherit'}
                                    onClick={() => this.handleChangePage(no)}
                                >
                                    {no}
                                </Button>
                            </div>

                        )
                    })}
                    <div>
                        <Button
                            disabled={page.filter(p => p > total_page).length === 0}
                            onClick={() => this.handleChangePage(current_page + 1)}
                            style={{ padding: 0, margin: 5, minWidth: 25, minHeight: 25 }}>
                            <KeyboardArrowRight

                            />
                        </Button>
                    </div>

                </div>
            )
        }

        return;

    }
    isSelected = id => this.state.selected.indexOf(id) !== -1;

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
    render() {

        const { tabs } = this.state;
        // const {loading,product} = Order;
        const { orders, classes } = this.props;
        let checkArray = orders.order instanceof Array;
        const listCourier =
            ["jne", "jnt"]
            ;
        return (
            <div>
             
                <Grid container>
                <Grid item md={12}> 

                  <Button style={{margin:"0px 5px"}} onClick={this.handlerDownloadDataOrder} color="primary" variant="contained">
                        DOWNLOAD DATA ORDER 
                    </Button>
                </Grid>
                    {orders.loading  || !checkArray || orders.detail ? (
                        <Grid item md={12}>
                            <TableLoader />
                        </Grid>


                    ) :
                        (<TableOrder
                            orders={orders}
                            history={this.props.history}
                            tabs={tabs}
                            handlerChangeTabs={this.handlerChangeTabs}
                            getAllOrder={this.props.getAllOrder}
                            handleChangePage={this.handleChangePage}
                            current_page_state={this.state.current_page_state}
                            searchText={this.state.searchText}
                            onChangeSearch={this.onChangeSearch}
                            onSubmitSearch={this.onSubmitSearch}
                            onSubmitSearchEnter={this.onSubmitSearchEnter}
                            paginationContainer={this.paginationContainer}
                            isSelected={this.isSelected}
                            open={this.state.open}
                            openDelete={this.state.openDelete}
                            openChangeStatus={this.state.openChangeStatus}
                            selectedOrder={this.state.selectedOrder}
                            selectedStatusOrder={this.state.selectedStatusOrder}
                            selected={this.state.selected}
                            anchorEl={this.state.anchorEl}
                            openActions={this.state.openActions}
                            handlerSubmitDeleteOrder={this.handlerSubmitDeleteOrder}
                            handlerSubmitOrderStatus={this.handlerSubmitOrderStatus}
                            onChangeStatusOrder={this.onChangeStatusOrder}
                            handleClick={this.handleClick}
                            classes={classes}
                            handlerClickPopover={this.handlerClickPopover}
                            handlerClosePopover={this.handlerClosePopover}
                            handlerChangeStatus={this.handlerChangeStatus}
                            handlerDeleteSelectedOrder={this.handlerDeleteSelectedOrder}
                            handleCloseDialog={this.handleCloseDialog}
                            handlerChangeResi={this.handlerChangeResi}
                            listCourier={listCourier}
                            selectedCourier={this.state.selectedCourier}
                            onChangeCourier={this.onChangeCourier}
                            openChangeResi={this.state.openChangeResi}
                            handlerOnChangeKodeResi={this.handlerOnChangeKodeResi}
                            kodeResi={this.state.kodeResi}
                            handlerSubmitResi={this.handlerSubmitResi}
                            selectSort={this.state.selectSort}
                            handlerSelectSort={this.handlerSelectSort}
                        />)
                        
                        }

                </Grid>
            </div>
        )
    }
}

Order.propTypes = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    getAllOrder:PropTypes.func.isRequired,
    orders:PropTypes.object.isRequired,
    notifications:PropTypes.object.isRequired,
    changeStatusOrder:PropTypes.func.isRequired,
    deleteOrderSelected: PropTypes.func.isRequired,
    downloadDataOrder:PropTypes.func.isRequired,
    updateKodeResi: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    errors: state.errors,
    orders:state.orders,
    notifications:state.notifications
})

export default compose(connect(mapStateToProps, { updateKodeResi,getAllOrder, downloadDataOrder, changeStatusOrder, deleteOrderSelected }), withStyles(styles, { name: "Order" }))(withRouter(Order));
