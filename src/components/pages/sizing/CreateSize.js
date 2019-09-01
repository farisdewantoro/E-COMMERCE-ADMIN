import React, { Component } from 'react'
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import CKEditor from '../../plugins/ckeditor';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import configCloudinary from '../../../config/configCloudinary';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import ReplayIcon from '@material-ui/icons/Replay'
import {submitCreateSize} from '../../../actions/sizingActions';
import {withRouter} from 'react-router';
import MediaGallery from '../../common/MediaGallery';
import Images from '../../common/Images';
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class CreateSizing extends Component {
    state={
        name:"",
        description:"",
        image:[],
        openStateMedia: false
    }
    handlerChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handlerChangeCk=(e)=>{
        this.setState({
            description:e
        })
    }  
    handlerSubmit=()=>{
        let data={
            name:this.state.name,
            description:this.state.description,
            image:this.state.image
        }
        this.props.submitCreateSize(data,this.props.history);
    }
    handlerResetImage = () => {
        this.setState({
            image: []
        })
    }
    
    uploadWidget = () => {


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
                        image: this.state.image.concat([
                            {
                                original: asset.secure_url,
                                thumbnail: asset.secure_url,
                                originalAlt: asset.alt,
                                thumbnailAlt: asset.alt,
                                originalTitle: asset.title,
                                thumbnailTitle: asset.title,
                                // description: asset.alt,
                                public_id: asset.public_id,
                                size: asset.bytes,
                                height: asset.height,
                                width: asset.width,
                                tags: asset.tags.toString()
                            }])
                    })
                    // this.setState({
                    //   imageSelected: this.state.imageSelected.concat(asset),

                    // });


                })
            }

        })

    }
    handlerOpenMedia = () => {
        this.setState({
            openStateMedia: !this.state.openStateMedia
        })
    }
    handlerInsertMedia = (data) => {

        this.setState({
            image: data.map(d => {
                return {
                    size: d.size,
                    original: process.env.PUBLIC_URL + '/media' + d.link,
                    thumbnail: process.env.PUBLIC_URL + '/media' + d.link,
                    public_id: d.link
                }
            }),

            openStateMedia: !this.state.openStateMedia

        })
    }
    render() {
        const { classes } = this.props;
        const { name, description, image, openStateMedia} = this.state;
  
        return (
            <div>
                <Grid container direction="column">
                    <Grid item md={12}>
                        <MediaGallery
                            media_selected={'sizing'}
                            open={openStateMedia}
                            onOpen={this.handlerOpenMedia}
                            onInsert={this.handlerInsertMedia}
                        />
                        <Card>
                            <CardHeader
                                subheader="CREATE SIZE CHART"
                            
                            />
                            <Divider/>
                            <CardContent>
                                <Grid container direction="column" spacing={32}
                                >
                                    <Grid item md={12}>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            value={name}
                                            label="Name"
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                {shrink:true}
                                            }
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                      <Typography>
                                          Description
                                      </Typography>
                                        <FormControl margin="normal" fullWidth>
                                         
                                            <CKEditor id="editor1" onChange={this.handlerChangeCk} name={`editorSize`} value={description} />

                                        </FormControl>
                                       
                                    </Grid>
                                    <Grid item md={12}>
                                        <Grid container direction="row" spacing={32}>
                                            <Grid item>
                                                <Button variant="contained" color="primary" 
                                                    onClick={this.handlerOpenMedia}>
                                                    UPLOAD IMAGE <PhotoLibrary className={classes.iconPick} />
                                            </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="outlined" onClick={this.handlerResetImage}>
                                                    RESET <ReplayIcon className={classes.iconPick} />
                                                </Button>
                                            </Grid>
                                         
                                          
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12}>

                                        <div style={{ marginTop: 20 }}>
                                            <Grid container spacing={8} direction="row">
                                                {image.map((img, i) => {

                                                    return (
                                                        <Grid item md={4} key={i}>
                                                            <Images
                                                                img={img}
                                                            />
                                                            {/* <img
                                                                src={img.original}
                                                                style={{ width: '100%' }}
                                                                alt={img.originalAlt}
                                                                title={img.originalTitle}
                                                            />
                                                            <div className={classes.imageDetails} >
                                                                <Typography>
                                                                    {img.public_id}
                                                                </Typography>
                                                                <Typography>
                                                                    Dimension  {`${img.width} * ${img.height}`}
                                                                </Typography>
                                                                <Typography>
                                                                    Size {formatBytes(img.size)}
                                                                </Typography>
                                                            </div> */}

                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </div>
                                    </Grid>
                                  
                                </Grid>
                            
                            </CardContent>
                            <Divider/>
                            <CardActions>
                                <Button variant="contained" color="primary" onClick={this.handlerSubmit}>    
                                    Submit
                                </Button>
                                <Button variant="contained" color="secondary" onClick={()=>this.props.history.push('/sizing')}>
                                    Cancel
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

CreateSizing.propType = {
    classes: PropTypes.object.isRequired,
    submitCreateSize:PropTypes.func.isRequired
}

// const mapStateToProps = (state) => ({
//     vouchers: state.vouchers
// })


export default compose(connect(null, {submitCreateSize}), withStyles(styles))
    (withRouter(CreateSizing));

