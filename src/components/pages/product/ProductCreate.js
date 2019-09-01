import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FirstStep from './stepper/FirstStep';
import SecondStep from './stepper/SecondStep';
import ThirdStep from './stepper/ThirdStep'
import moment from 'moment'
import { getAllCategory, getCategoryTypeWithParam, clearCategoryType} from '../../../actions/categoryActions';
import {createProduct} from '../../../actions/productActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import configCloudinary from '../../../config/configCloudinary';
import { withRouter } from "react-router";
import { getAllSize} from '../../../actions/sizingActions';

const styles = theme => ({
  root: {
    width: '100%',
    
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return ['Create Product Detail', 'Create Product Variant,Attribute,Image', 'Final'];
}
function formatCurrency(value){
 return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}



class ProductCreate extends Component {
  state = {
    activeStep: 0,
    nextStep:1,
    colors: [
      { original_color: 'red', hex_color: '#D50000', isActive: false },
      { original_color: 'pink', hex_color: '#C51162', isActive: false },
      { original_color: 'purple', hex_color: '#D500F9', isActive: false },
      { original_color: 'deepPurple', hex_color: '#311B92', isActive: false },
      { original_color: 'indigo', hex_color: '#3949AB', isActive: false },
      { original_color: 'blue', hex_color: '#2962FF', isActive: false },
      { original_color: 'lightBlue', hex_color: '#0091EA', isActive: false },
      { original_color: 'cyan', hex_color: '#00B8D4', isActive: false },
      { original_color: 'white', hex_color: '#FAFAFA', isActive: false },
      { original_color: 'teal', hex_color: '#004D40', isActive: false },
      { original_color: 'green', hex_color: '#00C853', isActive: false },
      { original_color: 'lightGreen', hex_color: '#64DD17', isActive: false },
      { original_color: 'lime', hex_color: '#AEEA00', isActive: false },
      { original_color: 'yellow', hex_color: '#FFD600', isActive: false },
      { original_color: 'amber', hex_color: '#FFAB00', isActive: false },
      { original_color: 'orange', hex_color: '#FF6D00', isActive: false },
      { original_color: 'deepOrange', hex_color: '#DD2C00', isActive: false },
      { original_color: 'brown', hex_color: '#3E2723', isActive: false },
      { original_color: 'grey', hex_color: '#9E9E9E', isActive: false },
      { original_color: 'blueGrey', hex_color: '#37474F', isActive: false },
      { original_color: 'black', hex_color: '#000000', isActive: false },
      { original_color: 'cream', hex_color:'#fffdd0',isActive:false}

    ],
    product_variant:{
      hex_color: '#000000',
      original_color: '',
      category_type_id:''
    },
    product_attribute: [
      { size: '', stock: '' }
    ],
    imageSelected: [],
    product:{
      name:'',
      slug:'',
      description:'',
      regular_price:0,
    },
    product_category:{
      value:''
    },
    categories:[],
    isDiscountCard:false,
    product_discount:{
      discount_percentage:'',
      discount_value:'',
      valid_from: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      valid_until: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      coupon_code:''
    },
    errors:{},
    sizingSelected: '',
    openStateMedia:false
  };
  handleNext = () => {

    let { skipped, nextStep, activeStep } = this.state;


    this.setState({
      activeStep: activeStep + nextStep,
    });
 
  };
  submitFinish = () =>{
    let data = {
      isDiscountCard: this.state.isDiscountCard,
      product_discount: this.state.product_discount,
      product_category: this.state.product_category,
      product: this.state.product,
      product_attribute: this.state.product_attribute,
      product_variant: this.state.product_variant,
      images: this.state.imageSelected,
      sizingSelected:this.state.sizingSelected
    };
    this.props.createProduct(data,this.props.history);

  }

  uploadWidget = ()=> {


    window.cloudinary.openMediaLibrary(configCloudinary, {
      
      insertHandler: (data) => {
        data.assets.forEach(asset => {
          if ((((asset || {}).context || {}).custom || {}).alt) {
            asset["alt"] = asset.context.custom.alt;
          } else {
            asset["alt"] = 'hammerstout';
          }
          if (asset.derived.length > 0 && asset.derived[0].secure_url) {
            asset.secure_url = asset.derived[0].secure_url;
          }
          if ((((asset || {}).context || {}).custom || {}).caption) {
            asset["title"] = asset.context.custom.caption;
          } else {
            asset["title"] = 'hammerstout';
          }
    
          this.setState({
            imageSelected: this.state.imageSelected.concat([
              {
                original:asset.secure_url,
                thumbnail:asset.secure_url,
                originalAlt:asset.alt,
                thumbnailAlt :asset.alt,
                originalTitle:asset.title,
                thumbnailTitle :asset.title,
                // description: asset.alt,
                public_id: asset.public_id,
                size:asset.bytes,
                height: asset.height,
                width: asset.width,
                tags:asset.tags.toString()
              }])
          })
          // this.setState({
          //   imageSelected: this.state.imageSelected.concat(asset),

          // });


        })
      }

    })

  }

  toggleHover = (data) => {
    this.setState(prevState=>({
      product_variant:{
        ...prevState.product_variant,
        hex_color: data.hex
      }
    }))
  }
  onChangeColorName = (e) =>{
   let value = e.target.value;
    this.setState(prevState=>({
      product_variant:{
        ...prevState.product_variant,
        original_color:value
      }
    }))
  }

  addMoreOption = () => {
    this.setState({
      product_attribute: this.state.product_attribute.concat([{ size: '', stock: '' }])
    })
  }

  resetImage = () => {
    this.setState({
      imageSelected: []
    });
  }

  onChangeProductAtt = (i) => (e) => {

    if (typeof this.state.product_attribute[i] !== 'undefined' && this.state.product_attribute[i] !== null) {
      var newData = { [e.target.name]: e.target.value };
      this.setState(prevState => ({
        product_attribute: [
          ...this.state.product_attribute.slice(0, i),
          Object.assign({}, this.state.product_attribute[i], newData),
          ...this.state.product_attribute.slice(i + 1)
        ]

      }))
    }
    this.setState({})
  }

  closePickerColor = () => {
    this.setState({
      pickerColor: !this.state.pickerColor
    })
  }
  deleteOption = (i) => {

    if (this.state.product_attribute.length > 1) {
      this.setState(prevState => ({
        product_attribute: prevState.product_attribute.filter((p, index) => index !== i)
      }))

    }

  }

  isStepOptional = step => {
    return step === 1;
  };
 

 

  handleBack = () => {
   
    this.setState(state => ({
      activeStep: state.activeStep - this.state.nextStep ,
    }));
  };


  handleReset = () => {
    window.location.reload()

  };

 

  onChangedCKeditor = (e) =>{
    this.setState(prevState=>({
      product:{
        ...prevState.product,
        description:e
      }
    }))
  }
  onChangedProduct = (e) =>{
    let nameField = e.target.name;
    let value = e.target.value;
    this.setState(prevState=>({
      product:{
        ...prevState.product,
        [nameField]:value
      }
    }))
  }
  onChangedProductPrice = (e) =>{
    let nameField = e.target.name;
    let val = e.target.value.replace(/[.\D]/g, '');
    if(val === ''){
      this.setState(prevState => ({
        product: {
          ...prevState.product,
          [nameField]: 0
        }
      }))
    }else{
      let value = parseFloat(val);
      let newValue = formatCurrency(value);
      if (this.state.isDiscountCard){
        let {discount_value,discount_percentage} = this.state.product_discount;
        let valueRegular_price = Math.round(value - value * discount_percentage / 100);
        let newDiscount_value = formatCurrency(valueRegular_price);
        this.setState(prevState=>({
          product_discount:{
            ...prevState.product_discount,
            discount_value: newDiscount_value
          }
        }))
      }
      this.setState(prevState => ({
        product: {
          ...prevState.product,
          [nameField]: newValue
        }
      }))
    }

  }

  openDiscountCard = () =>{
    this.setState({
      isDiscountCard:!this.state.isDiscountCard
    })
  }

  handleDateValid_from=(date)=>{
    let valid_from = moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.setState(prevState=>({
      product_discount:{
        ...prevState.product_discount,
        valid_from:valid_from
      }
    }));
  }
  handleDateValid_until=(date)=>{
    let valid_until = moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.setState(prevState => ({
      product_discount: {
        ...prevState.product_discount,
        valid_until: valid_until
      }
    }));
  }
  onChangedProductDiscount=(e)=>{
    if (this.state.product.regular_price.length > 0){
     
      let val = e.target.value;
      let regular_price = parseFloat(this.state.product.regular_price.replace(/[.\D]/g, ''));
      if (val > 95) {
        val = 95;
      }
      let value = Math.round(regular_price - regular_price * val / 100);
      let newValue = formatCurrency(value);
      this.setState(prevState => ({
        product_discount: {
          ...prevState.product_discount,
          discount_percentage: val,
          discount_value: newValue
        }
      }));

    }
    
  }

 componentDidMount(){
   this.props.getAllCategory();
   this.props.getAllSize();

 }
  onCategorySelected =(data)=>{
    this.setState({product_category:data});
    if(data){
      this.props.getCategoryTypeWithParam(data.value);
    }else{
      this.setState(prevState=>({
        product_variant:{
          ...prevState.product_variant,
          category_type_id:''
        }
      }))
      this.props.clearCategoryType();
    }
    
  }
  onCategoryTypeSelected = (data) => {
    this.setState(prevState => ({
      product_variant: {
        ...prevState.product_variant,
        category_type_id:data
      }
    }))
 

  }
  onChangeSizing = (e) => {
    this.setState({
      sizingSelected: e.target.value
    })
  }

 componentWillReceiveProps(nextProps){
   let categories = nextProps.categories.category;
   let errors = nextProps.errors; 
   let status = nextProps.products.status;
   if(categories !== this.props.categories){
     this.setState({
       categories: categories
     })
   }
   if(errors !== this.props.errors){
     this.setState({
       errors:errors
     })
    //  if (Object.keys(errors).length > 0 && errors.constructor === Object) {
    //    toastr.remove();
    //    toastr.error('There were problems creating product.');
    //  }
   }

   if (status !== this.props.products.status && status.status){
     this.setState({
       activeStep: this.state.activeStep + this.state.nextStep,
     });
    //  toastr.success('Product has been created.');
   }



 }
  handlerOpenMedia = ()=>{
    this.setState({
      openStateMedia:!this.state.openStateMedia
    })
  }
  handlerInsertMedia = (data)=>{

    this.setState({
      imageSelected:data.map(d=>{
        return{
          size:d.size,
          original:process.env.PUBLIC_URL+'/media'+d.link,
          thumbnail: process.env.PUBLIC_URL + '/media' + d.link,
          public_id:d.link
        }
      }),
    
      openStateMedia:!this.state.openStateMedia
    
    })
  }

  getStepContent = (step) =>{
    switch (step) {
      case 0:
        return (
          <FirstStep 
            product={this.state.product}
            product_variant={this.state.product_variant}
            onChangedCKeditor={this.onChangedCKeditor}
            onChangedProduct={this.onChangedProduct}
            onChangedProductPrice={this.onChangedProductPrice}
            openDiscountCard={this.openDiscountCard}
            isDiscountCard={this.state.isDiscountCard}
            product_discount={this.state.product_discount}
            handleDateValid_from={this.handleDateValid_from}
            handleDateValid_until={this.handleDateValid_until}
            onChangedProductDiscount={this.onChangedProductDiscount}
            categories={this.state.categories}
            category_type={this.props.categories.type}
            product_category={this.state.product_category}
            onCategorySelected={this.onCategorySelected}
            errors={this.state.errors}
            onCategoryTypeSelected={this.onCategoryTypeSelected}
           
       />
        );
      case 1:
        return <SecondStep 
          toggleHover={this.toggleHover}
          onChangeColorName={this.onChangeColorName}
          product_variant={this.state.product_variant}
          product_attribute={this.state.product_attribute}
          onChangeProductAttribute={this.onChangeProductAtt}
          deleteOption={this.deleteOption}
          addMoreOption={this.addMoreOption}
          uploadWidget={this.uploadWidget}
          resetImage={this.resetImage}
          imageSelected={this.state.imageSelected}
          colors={this.state.colors}
          errors={this.state.errors}
          sizings={this.props.sizings}
          onChangeSizing={this.onChangeSizing}
          sizingSelected={this.state.sizingSelected}
          openStateMedia={this.state.openStateMedia}
          handlerOpenMedia={this.handlerOpenMedia}
          handlerInsertMedia={this.handlerInsertMedia}/>;
      case 2:
        return <ThirdStep 
          imageSelected={this.state.imageSelected}
          product_attribute={ this.state.product_attribute}
          product_variant={this.state.product_variant }
          product={this.state.product}
          product_discount={this.state.product_discount}
          onChangedCKeditor={this.onChangedCKeditor}
          isDiscountCard={this.state.isDiscountCard}
          errors={this.state.errors}
              />;
      default:
        return 'Unknown step';
    }
  }

  render() {
    const { classes } = this.props;
    const loadingCategory = this.props.categories.loading;
    const loadingProduct = this.props.products.loading;

    const steps = getSteps();
    const { activeStep, product_variant, product_attribute, imageSelected, category, openStateMedia } = this.state;
    let loadingBar;

    if (loadingCategory || loadingProduct){
      loadingBar=(
        <LinearProgress color="secondary" variant="query" />
      )
    }
    return (
      <div className={classes.root}>
      <Card >
        {loadingBar}
        <CardContent>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {};
                const labelProps = {};
                // if (this.isStepSkipped(index)) {
                //   props.completed = false;
                // }
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div >
              {activeStep === steps.length ? (
                <div >
              <Typography component="p" className={classes.instructions}>
                    All steps completed - you&apos;re finished
              </Typography>
                  <Button onClick={this.handleReset} className={classes.button} color="primary" variant="contained">
                    Create new product
              </Button>
                </div>
              ) : (
                  <div >
                    {/* <Typography className={classes.instructions}></Typography> */}
      
                      {this.getStepContent(activeStep)}
                 
                 
                  
                    <div style={{ marginTop: 25 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                </Button>
                
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={activeStep === steps.length - 1 ? this.submitFinish : this.handleNext  }
                        className={classes.button}

                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
        </CardContent>
         
      </Card>
       
      </div>
    );
  }
}

ProductCreate.propTypes={
  categories:PropTypes.object.isRequired,
  products:PropTypes.object.isRequired,
  getAllCategory:PropTypes.func.isRequired,
  createProduct:PropTypes.func.isRequired,
  errors:PropTypes.object.isRequired,
  sizings: PropTypes.object.isRequired,
  clearCategoryType:PropTypes.func.isRequired,
  getCategoryTypeWithParam: PropTypes.func.isRequired,
  getAllSize: PropTypes.func.isRequired
}

const mapStateToProps = state=>({
  categories: state.categories,
  products:state.products,
  errors:state.errors,
  sizings:state.sizings
})

export default compose(
  connect(mapStateToProps, { getAllCategory, getAllSize, createProduct, getCategoryTypeWithParam, clearCategoryType}),
   withStyles(styles, { name: "ProductCreate" }))
   (withRouter(ProductCreate));


