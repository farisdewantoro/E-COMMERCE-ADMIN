import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid'
import ImageGallery from 'react-image-gallery';
import ReactImageMagnify from 'react-image-magnify';
import CKEditor from '../../../plugins/ckeditor';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import classNames from 'classnames';
const styles = theme => ({

    button: {
        marginRight: theme.spacing.unit
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    productPricing: {
        display: 'flex',
        width: '100%'
    },
    regular_price: {
        marginRight: 5,
        fontWeight: 'bold'
    },
    isDiscount:{
        textDecoration: 'line-through'
    },
    discount_value: {
        color: '#e53935',
        fontWeight: 'bold',
        marginRight: 5,
        marginLeft: 5,
        fontSize: 18
    },
    discount_percentage: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: '#e53935',
        padding: '2px 5px 2px 5px'
    },
    radioButton: {
        "&:input": {
            display: "none"
        }
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: '5px 0px 5px 0px',
        padding: 0,
        minWidth: 100,
        height: 40
    },

    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    },
    productAttribute: {
        marginTop: theme.spacing.unit
    },
    boxColor: {
        width: 20,
        height: 20,
        borderRadius: '100%',
        border: " 2px solid white",
        boxShadow: "0px 0px 0px 1px #9c9b9b87"
    },
    sizing: {
        marginTop: 10,
        marginBottom: 10
    },
    formInputSize: {
        display: 'inline-flex'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),

    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

});
class ThirdStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labelWidth: 0,
            imageZoomContainer: '',
            styleImage: null,
            selectedSizeStock: 0,
            expanded: null,
        };
    }
    onChange = (e) => {

        this.setState({selectedSizeStock: e.nativeEvent.target.attributes[3].value})
    }
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    render() {

        const { image, selectedSizeStock, expanded } = this.state;
        const {
            classes,
            imageSelected,
            onChangedCKeditor,
            product,
            product_variant,
            product_attribute,
            product_discount,
            isDiscountCard,
            errors
        } = this.props;
        
        let imageGallery;
        let productDiscount;
        if (imageSelected.length > 0) {
            imageGallery = (<ImageGallery
                items={imageSelected}
                thumbnailPosition="left"
                showNav={false}
                showPlayButton={false}
                lazyLoad={true}/>)
        }
        let isDiscount = false;
        if (isDiscountCard && parseFloat(product_discount.discount_percentage) > 0) {
            isDiscount = true;
            productDiscount = (
                <div>
                    <span className={classes.discount_value}>
                        {`Rp. ${product_discount.discount_value}`}
                    </span>
                    <span className={classes.discount_percentage}>
                        {`${product_discount.discount_percentage}%`}
                    </span>
                </div>

            )
        }
        return (
            <Grid container direction="row" spacing={16}>
                {Object.keys(errors).length > 0 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>   
                                <Typography style={{color:'red'}}>
                                There is a form that has not been filled
                                <br></br>
                                All forms must be filled in !
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>   
                )}
                <Grid item md={6}>
                    {imageGallery}
                </Grid>

                <Grid item md={6}>
                    <Card>
                        <CardContent>
                            <Grid container direction="column">

                                <Grid item>
                                    <div className={classes.productTopDetail}>
                                        {typeof product_variant.category_type_id !== "undefined" && product_variant.category_type_id !== null && product_variant.category_type_id !== ''  && Object.keys(product_variant.category_type_id).length > 0 ? (
                                        <Typography variant="h6" gutterBottom>
                                            {product_variant.category_type_id.label}
                                        </Typography>):''}
                                   
                                        <Typography variant="caption" gutterBottom>
                                            {product.name}
                                        </Typography>
                                        <div className={classes.productPricing}>

                                            <span className={classNames(classes.regular_price,{
                                                [classes.isDiscount]: isDiscount
                                            })}>
                                                {`Rp. ${product.regular_price}`}
                                            </span>
                                            {productDiscount}

                                        </div>
                                    </div>
                                </Grid>

                                <Grid item>
                                    <div className={classes.productAttribute}>
                                        <Typography variant="subtitle1">
                                            Colour :
                                            <span
                                                style={{
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize'
                                            }}>{product_variant.original_color}</span>

                                        </Typography>
                                        <div >
                                            <div
                                                className={classes.boxColor}
                                                style={{
                                                backgroundColor: product_variant.hex_color
                                            }}></div>
                                        </div>
                                        {product_attribute.length > 0 ? (
                                        <div className={classes.sizing}>
                                            <Typography variant="subtitle1">
                                                Size & Stock :

                                            </Typography>
                                            <div className={classes.formInputSize}>
                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}
                                                    style={{
                                                    margin: '0px 10px 0px 0px'
                                                }}>

                                                    <Select
                                                        value={product_attribute[selectedSizeStock].size}
                                                        onChange={this.onChange}
                                                        input={< OutlinedInput labelWidth = {
                                                        this.state.labelWidth
                                                    }
                                                    name = "age" id = "outlined-age-simple" />}>
                                                        {product_attribute.map((att, i) => {
                                                            return (
                                                                <MenuItem value={att.size} data-att={i} key={i}>{att
                                                                        .size
                                                                        .toUpperCase()}</MenuItem>
                                                            )

                                                        })}

                                                    </Select>

                                                </FormControl>
                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}
                                                    style={{
                                                    margin: '0px 10px 0px 5px'
                                                }}>

                                                    <Select
                                                        value={product_attribute[selectedSizeStock].stock}
                                                        input={< OutlinedInput readOnly labelWidth = {
                                                        this.state.labelWidth
                                                    }
                                                    name = "age" id = "outlined-age-simple" />}>
                                                        {product_attribute.map((att, i) => {
                                                            return (
                                                                <MenuItem value={att.stock} key={i}>{att
                                                                        .stock
                                                                        }</MenuItem>
                                                            )

                                                        })}

                                                    </Select>

                                                </FormControl>
                                            </div>

                                        </div>) :''}

                                    </div>
                                </Grid>
                              
                          
                            </Grid>
                        </CardContent>
                    </Card>
                    <ExpansionPanel
                        expanded={expanded === 'panel1'}
                        onChange={this.handleChange('panel1')}>
                        <ExpansionPanelSummary expandIcon={< ExpandMoreIcon />}>
                            <Typography className={classes.heading}>PRODUCT DETAIL</Typography>
                            {/* <Typography className={classes.secondaryHeading}>I am an expansion panel</Typography> */}
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product.description
                                }}></div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
               
                
                </Grid>

            </Grid>

        )
    }
}
ThirdStep.propTypes = {
    classes: PropTypes.object.isRequired,
    imageSelected: PropTypes.array.isRequired
}

export default withStyles(styles)(ThirdStep);
