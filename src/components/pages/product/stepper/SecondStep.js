import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import update from 'react-addons-update';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import ReplayIcon from '@material-ui/icons/Replay'
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {SwatchesPicker} from 'react-color';
import MediaGallery from '../../../common/MediaGallery';
import Images from '../../../common/Images';
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
const styles = theme => ({
    iconPick:{
        marginLeft:theme.spacing.unit
    },
    buttonPickColor:{
        marginTop:20
    },
    colorBox:{
        width: 20, 
        height: 20,
        margin:2,
        cursor:'pointer',
        borderRadius:15,
        boxShadow:'1px 1px 1px #9e9e9e;'
    },
    colorBoxHover:{
        width: 20,
        height: 20,
        borderRadius: 15,
        margin: 2,
        transform:'scale(1.3,1.3)',
        boxShadow:'3px 3px 4px #9e9e9e'
    },
    imageDetails:{
        textAlign:'center',
        marginTop:5
    }


});
// function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }
// function readerImg(img) {
//     var image = new Image();

//     image.src =  img;

//     let dimension = image.onload = () => {
//         let d = image.width + 'x' + image.height;
//         return d;

//     };

//     return dimension();

// }
class SecondStep extends Component {
    state={
   
        pickerColor:true,
        errorsProductAttribute:[],
        color:{}
    }
   closePickerColor = () =>{
        this.setState({
            pickerColor:!this.state.pickerColor
        })
    }
    checkErrorSize=(i)=>{
        let checked = false;
        if (this.props.errors.hasOwnProperty('product_attribute') && this.props.errors.product_attribute instanceof Array ) {
       
            this.props.errors.product_attribute.forEach((err,index)=>{
                if(index ===i){
                    if(err.size !== ''){
                        checked = true
                    }
                }
            })
        }
        return checked;
    }
    helperTextErrorSize=(i)=>{
        let checked = '';
        if (this.props.errors.hasOwnProperty('product_attribute') && this.props.errors.product_attribute instanceof Array) {

            this.props.errors.product_attribute.forEach((err, index) => {
                if (index === i) {
                        checked = err.size
                }
            })
        }
        return checked;
    }
    helperTextErrorStock= (i) => {
        let checked = '';
        if (this.props.errors.hasOwnProperty('product_attribute')) {

            this.props.errors.product_attribute.forEach((err, index) => {
                if (index === i) {
                    checked = err.stock
                }
            })
        }
        return checked;
    }
    checkErrorStock = (i) => {
        let checked = false;
        if (this.props.errors.hasOwnProperty('product_attribute')) {

            this.props.errors.product_attribute.forEach((err, index) => {
                if (index === i) {
                    if (err.stock !== '') {
                        checked = true
                    }
                }
            })
        }
        return checked;
    }
   

  
    render() {
        const { classes, 
            addMoreOption, 
            deleteOption, 
            onChangeProductAttribute, 
            product_attribute,
            resetImage,
            toggleHover,
            uploadWidget,
            product_variant,
            imageSelected,
            errors,
            colors,
            sizings,
            sizingSelected,
            onChangeSizing,
            openStateMedia,
            handlerOpenMedia,
            handlerInsertMedia,
            onChangeColorName } = this.props;
        // const { hex_color, original_color, product_attribute, imageSelected, pickerColor, loading} = this.state;
        const { pickerColor, loading } = this.state;
        let errorsProductVariant={};
 
        if(errors.hasOwnProperty('product_variant')){
            errorsProductVariant = errors.product_variant;
        }
        let selectedSize;
        if (IsJsonString(sizingSelected)){
            let data = JSON.parse(sizingSelected);
   
            selectedSize = (
                <div>
                    <Grid container direction="row" spacing={32}>
                        <Grid item >
               
                                    <img src={data.link} style={{ maxWidth: "100%", maxHeight: "300px" }} alt={data.alt} />

                        </Grid>
                        <Grid item >
                            <Card>
                                <CardContent >
                                    <div dangerouslySetInnerHTML={{__html:data.description}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                       
                            
                    </Grid>
                </div>
            )
        }
        return (
            <div>
                <Grid container direction="column" spacing={16}>
                    <MediaGallery
                        media_selected={'produk'}
                        open={openStateMedia}
                        onOpen={handlerOpenMedia}
                        onInsert={handlerInsertMedia}
                    />
                    <Grid item>
                        <Grid container direction="row" spacing={16}>
                      
                            <Grid item md={3}>
                                <Button variant="contained" color="primary" fullWidth className={classes.buttonPickColor} onClick={this.closePickerColor}>
                                   Pick Color <InvertColorsIcon className={classes.iconPick}/>
                                </Button>
                                {pickerColor ?
                                    <Grid container direction="row">
                                        <SwatchesPicker color={product_variant.hex_color} onChange={toggleHover} />
                                  
                                    </Grid>  
                                    : '' }
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="filled-full-width"
                                    label="Original Color"
                                    rows={2}
                                    
                                    onChange={onChangeColorName}
                                    error={typeof errorsProductVariant.original_color !== "undefined" ? true:false}
                                    helperText={typeof errorsProductVariant.original_color !== "undefined"?errorsProductVariant.original_color :''}
                                    value={product_variant.original_color}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <br/>
                                
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="filled-full-width"
                                    label="Hex Color"
                                    error={typeof errorsProductVariant.hex_color !== "undefined" ? true : false}
                                    helperText={typeof errorsProductVariant.hex_color !== "undefined" ? errorsProductVariant.hex_color : ''}
                                    rows={2}
                                    disabled
                                    value={product_variant.hex_color}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                        </Grid>

                    </Grid>
                              
                    <Grid item>
                        <Card >
                                    
                            <CardContent>
                                <Typography component="h6" gutterBottom>
                                    Stock & Size asd
                              </Typography>
                                <Grid container direction="row" spacing={16}>
                                    {product_attribute.map((att,i)=>{
                                        return(
                                            <Grid item md={12} key={i}>
                                                <Grid container direction="row" spacing={16}>
                                                    <Grid item md={5}>
                                                        <TextField
                                                            id="filled-full-width"
                                                            label="Size"
                                                            name="size"
                                                            rows={2}
                                                            value={att.size}
                                                            fullWidth
                                                            error={this.checkErrorSize(i)}
                                                            helperText={this.helperTextErrorSize(i)}
                                                            onChange={onChangeProductAttribute(i)}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item md={5}>
                                                        <TextField
                                                            id="filled-full-width"
                                                            label="Stock"
                                                            name="stock"
                                                            type="number"
                                                            error={this.checkErrorStock(i)}
                                                            helperText={this.helperTextErrorStock(i)}
                                                            onChange={onChangeProductAttribute(i)}
                                                            rows={2}
                                                            value={att.stock}
                                                            fullWidth
                                                            margin="normal"
                                                            type="number"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <Button style={{ marginTop: 20 }} onClick={()=>deleteOption(i)}>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                         
                                        
                                        )
                                    })}
                             
                             
                               
                                </Grid>
                                <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={addMoreOption}>
                                    Add more option
                              </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography component="h6" gutterBottom>
                                    Fit Guide 
                                </Typography>
                                <Grid container direction="column" spacing={16}>
                                <Grid item md={12}>
                                        <FormControl className={classes.formControl} fullWidth>
                                            <NativeSelect
                                                value={sizingSelected}
                                                onChange={onChangeSizing}
                                                name="sizingSelected"
                                                className={classes.selectEmpty}
                                            >
                                                <option value="">None</option>
                                                {sizings.sizing.map((s, i) => {

                                                    return (
                                                        <option key={i} value={JSON.stringify(s)}>{s.name}</option>
                                                    )
                                                })}

                                            </NativeSelect>
                                        </FormControl>
                                </Grid>
                                    <Grid item md={12}>
                                        {selectedSize}
                                    </Grid>
                                </Grid>
                             
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Grid container direction="row" spacing={16}>
                                    <Grid item>
                                        <Button variant="contained"
                                            onClick={handlerOpenMedia}
                                            className="upload-button"
                                            color="primary"

                                        >
                                            Pick Image <PhotoLibrary className={classes.iconPick} />
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Button variant="contained"
                                            onClick={resetImage}
                                            className="upload-button"
                                            color="primary"

                                        >
                                            Reset Image <ReplayIcon className={classes.iconPick} />
                                        </Button>
                                    </Grid>
                                </Grid>
                              

                               
                            
                               <div style={{marginTop:20}}>
                                    <Grid container spacing={8} direction="row">
                                    {imageSelected.map((img,i)=>{
                                  
                                        return(
                                          <Grid item md={4} key={i}>
                                                {/* <img 
                                                    src={img.original} 
                                                style={{ width: '100%' }} 
                                                alt={img.originalAlt } 
                                                title={img.originalTitle } 
                                                    />
                                                <div className={classes.imageDetails} >
                                                    <Typography>
                                                            {img.public_id}
                                                    </Typography>
                                                    <Typography>
                                                      Dimension  {`${img.width} * ${img.height}`}
                                                    </Typography>
                                                </div> */}
                                            <Images img={img}/>
                                               
                                          </Grid>   
                                        )
                                    })}
                                    </Grid>
                               </div>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

            </div>
        )
    }
}

SecondStep.propTypes = {
    classes: PropTypes.object.isRequired,
    addMoreOption:PropTypes.func.isRequired,
    deleteOption:PropTypes.func.isRequired,
    onChangeProductAttribute:PropTypes.func.isRequired,
    product_attribute:PropTypes.array.isRequired,
    resetImage:PropTypes.func.isRequired,
    toggleHover:PropTypes.func.isRequired,
    uploadWidget:PropTypes.func.isRequired,
    product_variant:PropTypes.object.isRequired,
    imageSelected:PropTypes.array.isRequired,
    colors:PropTypes.array.isRequired,
    sizings:PropTypes.object.isRequired,
}


export default withStyles(styles)(SecondStep);