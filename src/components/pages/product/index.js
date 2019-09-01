import React, { Component } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import styles from './styles'
import TableProducts from './TableProducts';
import { getProduct, deleteProduct} from '../../../actions/productActions';
import TableLoader from '../../loader/TableLoader';
import {withRouter} from 'react-router';
import queryString from 'query-string';
import axios from 'axios';
class Products extends Component {
  state={
    tabs:"none",
    search:""
  }
  componentDidMount(){
    this.props.getProduct(this.props.location.search);
 
    if(this.props.location.search){
      const query = queryString.parse(this.props.location.search);
      const categoryQuery = Object.values(query)[0];
      this.props.getProduct(this.props.location.search);


      if (typeof categoryQuery === "undefined") {
        this.setState({
          tabs: "none"
        });
      }
      if (typeof categoryQuery === "string") {
        this.setState({
          tabs: categoryQuery
        });
      }
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
   
      const query = queryString.parse(nextProps.location.search);
      const categoryQuery = Object.values(query)[0];
      this.props.getProduct(nextProps.location.search);
     
    
      if (typeof categoryQuery === "undefined") {
        this.setState({
          tabs: "none"
        });
      }
      if (typeof categoryQuery === "string") {
        this.setState({
          tabs: categoryQuery
        });
      }
    }

  
  }
  handlerChangeTabs = (event, value) => {
  
    if (value !== "none" && value !== 'our-recommendation') {
      this.setState({
        tabs: value
      });
      this.props.history.push({
        pathname: '/product',
        search: `?category=${value}`
      })
    } 
    if (value == 'our-recommendation'){
      this.setState({
        tabs: value
      });
      this.props.history.push({
        pathname: '/product',
        search: `?filter=${value}`
      })
    }
    if(value === 'none') {
      this.setState({
        tabs: value
      });
      this.props.history.push({
        pathname: '/product'
      })
    }

  }
  

  handlerSubmitDeleteProduct = () => {
    if (this.state.selected.length > 0) {

      this.setState({
        openDelete: true,
        anchorEl: '',
        openActions: false,
        open: false
      });
      this.props.deleteProduct(this.state.selected);

    }
  }
  handleDownloadData = ()=>{
    axios({
      method: 'GET',
      responseType: 'blob', // important
      url: '/api/csv/data-feed'
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'produk-data.csv');
        document.body.appendChild(link);
        link.click();
      });
  }
 

  render() {
    const { product, loading, status} = this.props.products;
    const { tabs}=this.state;
    // const {loading,product} = products;
    const { collections} = this.props;
    let checkArray = product instanceof Array;

    return (
      <div>
        <Grid container>
            <Button component={Link} to="/product/create" variant="contained" color="primary">
                <AddIcon style={{margin:"0px 5px"}}/> Create New Product
            </Button>

          <Button variant="contained" color="primary" style={{ margin: "0px 10px" }} onClick={this.handleDownloadData}>  
                DOWNLOAD DATA PRODUK
            </Button>
        </Grid>


        <Grid container>
          {loading || product == null || !checkArray ? (
          <Grid item md={12}>
              <TableLoader />
          </Grid>
     
        
        ):
            (<TableProducts 
            products={product} 
            history={this.props.history}
            productStatus={status} 
            collections={collections}
            tabs={tabs}
            handlerChangeTabs={this.handlerChangeTabs}
            onChangeSearch={this.onChangeSearch}
            />)}
         
        </Grid>
      </div>
    )
  }
}

Products.propTypes={
  classes:PropTypes.object.isRequired,
  getProduct:PropTypes.func.isRequired,
  errors:PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  
}
const mapStateToProps =(state)=>({
  products:state.products,
  errors:state.errors,
  collections: state.collections,

})

export default compose(connect(mapStateToProps, { getProduct}), withStyles(styles, { name: "Products" }))(withRouter(Products));
