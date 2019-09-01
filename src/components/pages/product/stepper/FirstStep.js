import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import CKEditor from '../../../plugins/ckeditor';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import classNames from 'classnames';
import Button from '@material-ui/core/Button'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo,faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { InlineDateTimePicker, MuiPickersUtilsProvider  } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import Select from 'react-select'
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';


library.add({ faMoneyBill, faIgloo})

const styles = theme=>({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}
function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}


function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};
class FirstStep extends Component {
  state={
    single: null,
    multi: null,
    optionCategory:[],
    optionCategoryType:[]
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  componentWillReceiveProps(nextProps){
    let categories = nextProps.categories;
    if(categories){
      this.setState({
        optionCategory:categories.map((c)=>{
          return {value:c.id,label:c.name,description:c.description}
        })
      })
    }
    if(nextProps.category_type !== this.props.category_type){
      this.setState({
        optionCategoryType: nextProps.category_type.map((ct)=>{
            return{
              value:ct.id,
              label:ct.name
            }
        })
      })
    }
  }

  render() {
    const { classes, 
      product, 
      onChangedCKeditor, 
      onChangedProduct, 
      onChangedProductPrice, 
      openDiscountCard,
      isDiscountCard,
      handleDateValid_from, 
      product_discount,
      handleDateValid_until,
      onChangedProductDiscount,
      theme,
      categories,
      product_variant,
      product_category,
      onCategorySelected,
      errors,
      category_type,
      onCategoryTypeSelected,
      product_id,
      product_name

    } = this.props;

    let { optionCategory, optionCategoryType} = this.state;
   
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    let errorProduct={};
    let errorProductCategory={};
    let errorProductDiscount={};
    let errorProductVariant={};
    if (errors.hasOwnProperty('product')){
      errorProduct = errors.product;
    }
    if (errors.hasOwnProperty('product_category')){
      errorProductCategory.product_category = errors.product_category;
    }
    if(errors.hasOwnProperty('product_discount')){
      errorProductDiscount = errors.product_discount;
    }
    if (errors.hasOwnProperty('product_variant')) {
      errorProductVariant = errors.product_variant;
    }
 
    
  
    return (
     <Grid container direction="row" spacing={40}>
    
        <Grid item md={6}>
          <Card style={{ overflow:"inherit"}}>
          <CardContent>
              <TextField
                id="id_product_name"
                label="Product Name"
                rows={2}
                margin="normal"
                name="name"
                fullWidth
                error={typeof errorProduct.name !== "undefined" ? true:false}
                helperText={typeof errorProduct.name !== "undefined" ? errorProduct.name : ''}
                InputLabelProps={{
                  shrink: true,
                }} 
                value={product.name}
                onChange={onChangedProduct}
                />

              <br />
              <div style={{marginTop:20}}>
                <NoSsr>
                  <Select
                    textFieldProps={{
                      label: 'Category',
                      error: typeof errorProductCategory.product_category !== "undefined" ? true:false,
                      helperText: typeof errorProductCategory.product_category !== "undefined" ? errorProductCategory.product_category : '',
                      InputLabelProps: {
                        shrink: true,
                      },
                    }}
                    classes={classes}
                    styles={selectStyles}
                    options={optionCategory}
                    components={components}
                    value={product_category}
                    onChange={onCategorySelected}
                    placeholder=""
                    isClearable
                  />
                </NoSsr>
              </div>

              <div style={{ marginTop: 20 }}>
                <NoSsr>
                  <Select
                    textFieldProps={{
                      label: 'Type',
                      error: typeof errorProductVariant.category_type_id !== "undefined" ? true : false,
                      helperText: typeof errorProductVariant.category_type_id !== "undefined" ? errorProductVariant.category_type_id : '',
                      InputLabelProps: {
                        shrink: true,
                      },
                    }}
                    classes={classes}
                    styles={selectStyles}
                    options={optionCategoryType}
                    components={components}
                    value={product_variant.category_type_id}
                    onChange={onCategoryTypeSelected}
                    placeholder=""
                    isClearable
                  />
                </NoSsr>
              </div>
            
                <br/>
              <TextField
                id="id_product_regular_price"
                label="Regular Price"
                rows={2}
                name="regular_price"
                error={typeof errorProduct.regular_price !== "undefined" ? true : false}
                helperText={typeof errorProduct.regular_price !== "undefined" ? errorProduct.regular_price : ''}
                value={product.regular_price}
                onChange={onChangedProductPrice}
                style={{ paddingTop: 10 }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
              />

              <br />
              <div style={{marginTop:20,marginBottom:20}}>
                <Button variant="contained" color="primary" onClick={openDiscountCard}>
                  Make Discount <FontAwesomeIcon icon="money-bill" style={{ marginLeft: 10 }} />
                </Button>
              </div>
              {isDiscountCard ? 
                <Card>
                  <CardContent>
                    <TextField
                      id="id_product_discount_percentage"
                      label="Discount Percentage"
                      name="discount_percentage"
                      fullWidth
                      style={{ paddingTop: 10}}
                      margin="normal"
                      type="number"
                      error={typeof errorProductDiscount.discount_percentage !== "undefined" ? true : false}
                      helperText={typeof errorProductDiscount.discount_percentage !== "undefined" ? errorProductDiscount.discount_percentage : ''}
                      value={product_discount.discount_percentage}
                      onChange={onChangedProductDiscount}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        inputProps: { min: 0, max: 90 }
                      }}
                    />
                    <br/>
                    <TextField
                      id="id_product_discount_value"
                      label="Discount Value"
                      disabled
                      fullWidth
                      error={typeof errorProductDiscount.discount_value !== "undefined" ? true : false}
                      helperText={typeof errorProductDiscount.discount_value !== "undefined" ? errorProductDiscount.discount_value : ''}
                      name="discount_value"
                      value={product_discount.discount_value}
                      style={{ paddingTop: 10 }}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                      }}
                    />
                    <br/>
                    <MuiPickersUtilsProvider moment={moment}
                      utils={MomentUtils}
                      locale={moment.locale("id")}>
                      <InlineDateTimePicker
                        label="Valid From"
                        name="valid_from"
                        value={product_discount.valid_from}
                        onChange={handleDateValid_from}
                        style={{ margin: '10px 0px 10px 0px', width: '100%' }}
                      />
                      <br />
                      <InlineDateTimePicker
                        style={{ margin: '10px 0px 10px 0px',width:'100%' }}
                        label="Valid Until"
                        name="valid_until"
                        value={product_discount.valid_until}
                        onChange={handleDateValid_until}
                      />
                    </MuiPickersUtilsProvider>
                    
                  </CardContent>
                </Card>

                : ''
              }
         
           
          </CardContent>
        </Card>
         
        </Grid>
      
        <Grid item md={6}>
        <Card>
          <CardContent>
              <Typography variant="h6" gutterBottom style={{ color:'rgba(0, 0, 0, 0.54)'}}>
              Description
            </Typography>
              {product_name && product_id && product.description ? (<CKEditor id={product_id} name={`editorProduct-${product_name}`} value={product.description} onChange={onChangedCKeditor} />
              ) :''}
              {!product_name && !product_id ? (<CKEditor id="productCreate" name={`editorProduct-productCreate`} value={product.description} onChange={onChangedCKeditor} />):''}
           </CardContent>
          
         
        </Card>

        </Grid>
     </Grid>
    )
  }
}

FirstStep.propTypes={
  classes:PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  product_variant:PropTypes.object.isRequired
}


export default withStyles(styles, { withTheme: true })(FirstStep);