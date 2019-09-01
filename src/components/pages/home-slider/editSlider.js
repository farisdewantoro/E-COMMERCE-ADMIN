import React, {Component} from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CardActions from '@material-ui/core/CardActions';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import ReplayIcon from '@material-ui/icons/Replay'
import configCloudinary from '../../../config/configCloudinary';
import Typography from '@material-ui/core/Typography';
import {updateSliderHome} from '../../../actions/uiActions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import { getSliderHome } from '../../../actions/uiActions';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import styles from './styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import update from 'react-addons-update';
import MediaGallery from '../../common/MediaGallery';
import Images from '../../common/Images';
function formatBytes(a, b) {
    if (0 == a) 
        return "0 Bytes";
    var c = 1024,
        d = b || 2,
        e = [
            "Bytes",
            "KB",
            "MB",
            "GB",
            "TB",
            "PB",
            "EB",
            "ZB",
            "YB"
        ],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

class EditSlider extends Component {
    state = {
        image_desktop: [],
        image_mobile:[],
        openStateMedia: false,
        tipe: false
    }
    componentDidMount(){
        this.props.getSliderHome();
    }
    handlerOpenMedia = (data) => {
        this.setState({
            openStateMedia: !this.state.openStateMedia,
            tipe: data
        })
    }
    handlerInsertMedia = (data) => {
        let tipe = this.state.tipe;
        this.setState({
            [tipe]: data.map(d => {
                return {
                    size: d.size,
                    original: process.env.PUBLIC_URL + '/media' + d.link,
                    thumbnail: process.env.PUBLIC_URL + '/media' + d.link,
                    public_id: d.link,
                    urlLink: ''
                }
            }),

            openStateMedia: !this.state.openStateMedia

        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if ((nextProps.UI.home_image && nextProps.UI.home_image.image_desktop) && (this.props.UI.home_image && this.props.UI.home_image.image_desktop) || (nextProps.UI.home_image && nextProps.UI.home_image.image_mobile) && (this.props.UI.home_image && this.props.UI.home_image.image_mobile)
        ){

            let tipeList = Object.keys(nextProps.UI.home_image);
            for (let tipe of tipeList) {
                let data = nextProps.UI.home_image[tipe].map((li, i) => {
                    return {
                        original: li.link,
                        thumbnail: li.link,
                        public_id: li.public_id,
                        size: li.size,
                        urlLink: li.urlLink ? li.urlLink :''
                    }
                });
                this.setState({
                    [tipe]: data
                })
            }
     
            // for (let index = 0; index < tipeList.length; index++) {

            // }
    
        }
    }
    resetImage = (tipe) => {
        this.setState({ [tipe]: []});
    }
    handlerSubmitEdit = () => {
        let data={
            image_desktop: this.state.image_desktop,
            image_mobile: this.state.image_mobile,
        }
        this
            .props
            .updateSliderHome(data, this.props.history);
    }
    handlerUrlLink = (tipe,index,e)=>{
        let value = e.target.value
        this.setState(prevState=>({
            [tipe]: update(prevState[tipe],{[index]:{urlLink:{$set:value}}})
        }));
    }

    uploadWidget = (tipe) => {

        window
            .cloudinary
            .openMediaLibrary(configCloudinary, {

                insertHandler: (data) => {
                    data
                        .assets
                        .forEach(asset => {
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
                                [tipe]: this
                                    .state[tipe]
                                    .concat([
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
                                            tags: asset
                                                .tags
                                                .toString(),
                                            urlLink:''
                                        }
                                    ])
                            })
                            // this.setState({   image_desktop: this.state.image_desktop.concat(asset), });

                        })
                }

            })

    }

    render() {
        const { image_desktop, image_mobile, openStateMedia} = this.state;
        const {classes} = this.props;
    
        return (
            <div>
                <Grid container>
                    <MediaGallery
                        media_selected={'banner_home'}
                        open={openStateMedia}
                        onOpen={this.handlerOpenMedia}
                        onInsert={this.handlerInsertMedia}
                    />
                    <Grid item md={12}>
                        <Card>
                            <CardHeader title="Edit Slider"/>
                            <Divider/>
                            <CardContent>

                                <Grid container direction="row" spacing={16}>
                                    <Grid item md={12}>
                                        <Card>
                                            <CardHeader subheader="DESKTOP-SLIDER"/>
                                            <Divider/>
                                            <CardContent>

                                                <Grid container direction="row" spacing={16}>
                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => this.handlerOpenMedia('image_desktop')}
                                                            className="upload-button"
                                                            color="primary"
                                                            style={{
                                                            margin: "0px 5px"
                                                        }}>
                                                            Pick Image
                                                            <PhotoLibrary
                                                                style={{
                                                                margin: "0px 5px"
                                                            }}/>
                                                        </Button>
                                                    </Grid>

                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => this.resetImage('image_desktop')}
                                                            className="upload-button"
                                                            color="primary"
                                                            style={{
                                                            margin: "0px 5px"
                                                        }}>
                                                            Reset Image
                                                            <ReplayIcon
                                                                style={{
                                                                margin: "0px 5px"
                                                            }}/>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <div
                                                    style={{
                                                    marginTop: 20
                                                }}>
                                                    <Grid container spacing={8} direction="row">
                                                        {image_desktop.map((img, i) => {

                                                            return (
                                                                <Grid item md={4} key={i}>
                                                                    <Images img={img} />
                                                                    {/* <img
                                                                        src={img.original}
                                                                        style={{
                                                                        width: '100%'
                                                                    }}
                                                                        alt={img.originalAlt}
                                                                        title={img.originalTitle}/>
                                                                    <div
                                                                        style={{
                                                                        textAlign: 'center',
                                                                        marginTop: 5
                                                                    }}>
                                                                        <Typography>
                                                                            {img.public_id}
                                                                        </Typography>
                                                                        <Typography>
                                                                            Dimension {`${img.width} * ${img.height}`}
                                                                        </Typography>
                                                                        <Typography>
                                                                            Size {formatBytes(img.size)}
                                                                        </Typography> */}
                                                                        <div>
                                                                            <InputLabel shrink htmlFor="Link" className={classes.bootstrapFormLabel}>
                                                                                Link
        </InputLabel>
                                                                            <InputBase
                                                                                onChange={(e)=>this.handlerUrlLink('image_desktop',i,e)}
                                                                                id="Link"
                                                                                value={img.urlLink}
                                                                                classes={{
                                                                                    root: classes.bootstrapRoot,
                                                                                    input: classes.bootstrapInput,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    {/* </div> */}
                           

                                                                </Grid>
                                                            )
                                                        })}
                                                    </Grid>
                                                    <Grid container style={{margin:"5px 0"}}>  
                                                        <FormHelperText error>
                                                            *Contoh Link : /shop/newarrivals  diawali dengan ' / '
                                                            <br/>
                                                            *Link harus sesuai dengan url pada website www.hammerstoutdenim.com
                                                        </FormHelperText>
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    </Grid>



                                    <Grid item md={12}>
                                        <Card>
                                            <CardHeader subheader="MOBILE-SLIDER" />
                                            <Divider />
                                            <CardContent>

                                                <Grid container direction="row" spacing={16}>
                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            onClick={()=>this.handlerOpenMedia('image_mobile')}
                                                            className="upload-button"
                                                            color="primary"
                                                            style={{
                                                                margin: "0px 5px"
                                                            }}>
                                                            Pick Image
                                                            <PhotoLibrary
                                                                style={{
                                                                    margin: "0px 5px"
                                                                }} />
                                                        </Button>
                                                    </Grid>

                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => this.resetImage('image_mobile')}
                                                            className="upload-button"
                                                            color="primary"
                                                            style={{
                                                                margin: "0px 5px"
                                                            }}>
                                                            Reset Image
                                                            <ReplayIcon
                                                                style={{
                                                                    margin: "0px 5px"
                                                                }} />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <div
                                                    style={{
                                                        marginTop: 20
                                                    }}>
                                                    <Grid container spacing={8} direction="row">
                                                        {image_mobile.map((img, i) => {

                                                            return (
                                                                <Grid item md={4} key={i}>
                                                                    <Images img={img} />
                                                                    {/* <img
                                                                        src={img.original}
                                                                        style={{
                                                                            width: '100%'
                                                                        }}
                                                                        alt={img.originalAlt}
                                                                        title={img.originalTitle} />
                                                                    <div
                                                                        style={{
                                                                            textAlign: 'center',
                                                                            marginTop: 5
                                                                        }}>
                                                                        <Typography>
                                                                            {img.public_id}
                                                                        </Typography>
                                                                        <Typography>
                                                                            Dimension {`${img.width} * ${img.height}`}
                                                                        </Typography>
                                                                        <Typography>
                                                                            Size {formatBytes(img.size)}
                                                                        </Typography> */}
                                                                        <div>
                                                                            <InputLabel shrink htmlFor="Link" className={classes.bootstrapFormLabel}>
                                                                                Link
        </InputLabel>
                                                                            <InputBase
                                                                                onChange={(e) => this.handlerUrlLink('image_mobile', i,e)}
                                                                                id="Link"
                                                                                value={img.urlLink}
                                                                                classes={{
                                                                                    root: classes.bootstrapRoot,
                                                                                    input: classes.bootstrapInput,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    {/* </div> */}
                                                            
                                                                </Grid>
                                                            )
                                                        })}
                                                    </Grid>
                                                    <Grid container style={{margin:"5px 0"}}>
                                                        <FormHelperText error >
                                                            *Contoh Link : /shop/newarrivals  diawali dengan ' / '
                                                                <br />
                                                            *Link harus sesuai dengan url pada website www.hammerstoutdenim.com
                                                        </FormHelperText>
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    </Grid>
                                </Grid>

                            </CardContent>
                            <Divider/>
                            <CardActions>
                                <Button variant="contained" onClick={this.handlerSubmitEdit} color="primary">
                                    Apply
                                </Button>

                            </CardActions>
                        </Card>
                    </Grid>

                </Grid>
            </div>

        )
    }
}

// EditSlider.propTypes = {
//     updateSliderHome:PropTypes.func.isRequred,
//     getSliderHome:PropTypes.func.isRequired,
//     UI:PropTypes.object.isRequired,
//     classes:PropTypes.object.isRequired
// }

const mapStateToProps = (state)=>({
    UI:state.UI
})

export default compose(connect(mapStateToProps, { updateSliderHome, getSliderHome}),withStyles(styles))(withRouter(EditSlider));
