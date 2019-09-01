import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import styles from '../styles';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions'
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import ReplayIcon from '@material-ui/icons/Replay'
import configCloudinary from '../../../../config/configCloudinary';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import InputLabel from '@material-ui/core/InputLabel'
import { editCategoryBannerCategoryType, updateCategoryBannerType} from '../../../../actions/categoryActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MediaGallery from '../../../common/MediaGallery';
import Images from '../../../common/Images';
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class EditBannerCategoryType extends Component {
    state = {
        imageSelectedDesktop:{},
        imageSelectedMobile: {},
        imageSelectedMobilePromo: {},
        imageSelectedDesktopPromo: {},
        promo:false,
        openStateMedia: false,
        tipe: false
    }
    componentDidMount() {
        this.props.editCategoryBannerCategoryType(this.props.match.params.id);
    }
    handlerOpenMedia = (data) => {
        this.setState({
            openStateMedia: !this.state.openStateMedia,
            tipe: data
        })
    }
    handlerInsertMedia = (data) => {
        let tipe = this.state.tipe;
        if (data.length > 1) {
            return alert('MAKSIMUM 1 GAMBAR');
        }
        data.forEach(d => {
            this.setState({
                [tipe]: {
                    size: d.size,
                    original: process.env.PUBLIC_URL + '/media' + d.link,
                    thumbnail: process.env.PUBLIC_URL + '/media' + d.link,
                    public_id: d.link
                },
                openStateMedia: !this.state.openStateMedia

            })
        })

    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.categories.lookbook !== this.props.categories.lookbook) {
        //     this.setState({
        //         name: nextProps.categories.lookbook[0].name
        //     })
        // }
        if(nextProps.categories !== this.props.categories){
            for (let key in nextProps.categories) {
              
                if (nextProps.categories[key] !== this.props.categories[key] && 
                    (
                    key === 'image_desktop' ||
                    key === 'image_desktop_promo' || 
                    key === 'image_mobile' ||
                    key === 'image_mobile_promo'
                    )) {
               
                    let data = nextProps.categories[key].map((li, i) => {
                        return {
                            original: li.link,
                            thumbnail: li.link,
                            public_id: li.public_id,
                            size: li.size
                        }
                    });
                    let state = '';
                    if (key === 'image_desktop') state = "imageSelectedDesktop";
                    if (key === 'image_desktop_promo') state = "imageSelectedDesktopPromo";
                    if (key === 'image_mobile') state = "imageSelectedMobile";
                    if (key === 'image_mobile_promo') state = "imageSelectedMobilePromo";
                    if(data.length > 0){
                        this.setState({
                            [state]: data[0]
                        })
                    }
                 
                    if (
                        (key === 'image_mobile_promo' && data.length > 0 ) ||
                        (key === 'image_desktop_promo' && data.length > 0)
                    
                    ){
                        this.setState({
                            promo:true
                        })
                    }
                }
          
            }
        }
   
    }
    resetImage = (tipe) => {
        this.setState({
            [tipe]:{}

        });
    }
    handlerSubmitCreate = () => {
        let data = {
            image_desktop: this.state.imageSelectedDesktop,
            image_mobile: this.state.imageSelectedMobile,
            image_desktop_promo: this.state.imageSelectedDesktopPromo,
            image_mobile_promo:this.state.imageSelectedMobilePromo,
            promo:this.state.promo
        }
        this.props.updateCategoryBannerType(this.props.match.params.id, data, this.props.history);
    }
    handleChangePromo = ()=>{
        this.setState(prevState=>({
            promo:!prevState.promo
        }))
    }


    uploadWidget = (tipe) => {


        window.cloudinary.openMediaLibrary(configCloudinary, {

            insertHandler: (data) => {
                if(data.assets.length > 1){
                    alert('MAKSIMUM 1 GAMBAR');
                }else{
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
                        this.setState(prevState => ({
                            [tipe]: {
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
                            }
                        }))
                        // this.setState({
                        //   imageSelected: this.state.imageSelected.concat(asset),

                        // });


                    })
                }
           
            }

        })

    }
    render() {
        const { classes, errors, categories } = this.props;
        const { imageSelectedDesktop, openStateMedia,imageSelectedMobile, imageSelectedDesktopPromo, imageSelectedMobilePromo, category } = this.state;
 
        return (
            <div>
                <Grid container direction="column" spacing={16}>
                    <MediaGallery
                        media_selected={'banner'}
                        open={openStateMedia}
                        onOpen={this.handlerOpenMedia}
                        onInsert={this.handlerInsertMedia}
                    />
                    <Grid item md={12}>
                        {categories.type.map((c,i)=>{
                            return(
                        <Card>
                            <CardHeader
                                subheader={c.name}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container direction="column" spacing={16}>

                                {/* DESKTOP */}
                                <Grid item md={12}>
                                <Card>
                                    <CardHeader
                                      subheader={'DESKTOP'}
                                    />
                                    <Divider/>
                                    <CardContent>
                                        <Grid container direction="row" spacing={16}>
                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={()=>this.handlerOpenMedia('imageSelectedDesktop')}
                                                    className="upload-button"
                                                    color="primary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Pick Image <PhotoLibrary style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={()=>this.resetImage('imageSelectedDesktop')}
                                                    className="upload-button"
                                                    color="primary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Reset Image <ReplayIcon style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                        </Grid>
                                        <Grid container style={{ marginTop: 20 }}>
                                            <InputLabel error={errors && typeof errors.image_desktop !== "undefined"}>
                                                {errors && typeof errors.image_desktop !== "undefined" ? errors.image_desktop : ""}
                                            </InputLabel>
                                        </Grid>
                                        <div style={{ marginTop: 20 }}>
                                            <Grid container spacing={8} direction="row">
                                                {Object.keys(imageSelectedDesktop).length > 0 &&  (
                                                        <Grid item md={4} key={i}>
                                                                        <Images img={imageSelectedDesktop} />
                                                            {/* <img
                                                                src={imageSelectedDesktop.original}
                                                                style={{ width: '100%' }}
                                                                alt={imageSelectedDesktop.originalAlt}
                                                                title={imageSelectedDesktop.originalTitle}
                                                            />
                                                            <div style={{
                                                                textAlign: 'center',
                                                                marginTop: 5
                                                            }} >
                                                                <Typography>
                                                                    {imageSelectedDesktop.public_id}
                                                                </Typography>
                                                                <Typography>
                                                                    Dimension  {`${imageSelectedDesktop.width} * ${imageSelectedDesktop.height}`}
                                                                </Typography>
                                                                <Typography>
                                                                    Size {formatBytes(imageSelectedDesktop.size)}
                                                                </Typography>
                                                            </div> */}

                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                        </div>
                                    </CardContent>
                                </Card>

                                  </Grid>

                                  {/* MOBILE */}
                                            <Grid item md={12}>
                                                <Card>
                                                    <CardHeader
                                                        subheader={'MOBILE'}
                                                    />
                                                    <Divider />
                                                    <CardContent>
                                                        <Grid container direction="row" spacing={16}>
                                                            <Grid item>
                                                                <Button variant="contained"
                                                                    onClick={() => this.handlerOpenMedia('imageSelectedMobile')}
                                                                    className="upload-button"
                                                                    color="primary"
                                                                    style={{ margin: "0px 5px" }}
                                                                >
                                                                    Pick Image <PhotoLibrary style={{ margin: "0px 5px" }} />
                                                                </Button>
                                                            </Grid>

                                                            <Grid item>
                                                                <Button variant="contained"
                                                                    onClick={() => this.resetImage('imageSelectedMobile')}
                                                                    className="upload-button"
                                                                    color="primary"
                                                                    style={{ margin: "0px 5px" }}
                                                                >
                                                                    Reset Image <ReplayIcon style={{ margin: "0px 5px" }} />
                                                                </Button>
                                                            </Grid>

                                                        </Grid>
                                                        <Grid container style={{ marginTop: 20 }}>
                                                            <InputLabel error={errors && typeof errors.image_mobile !== "undefined"}>
                                                                {errors && typeof errors.image_mobile !== "undefined" ? errors.image_mobile : ""}
                                                            </InputLabel>
                                                        </Grid>
                                                        <div style={{ marginTop: 20 }}>
                                                            <Grid container spacing={8} direction="row">
                                                                {Object.keys(imageSelectedMobile).length > 0 && (
                                                                    <Grid item md={4} key={i}>
                                                                        <Images img={imageSelectedMobile} />
                                                                        {/* <img
                                                                            src={imageSelectedMobile.original}
                                                                            style={{ width: '100%' }}
                                                                            alt={imageSelectedMobile.originalAlt}
                                                                            title={imageSelectedMobile.originalTitle}
                                                                        />
                                                                        <div style={{
                                                                            textAlign: 'center',
                                                                            marginTop: 5
                                                                        }} >
                                                                            <Typography>
                                                                                {imageSelectedMobile.public_id}
                                                                            </Typography>
                                                                            <Typography>
                                                                                Dimension  {`${imageSelectedMobile.width} * ${imageSelectedMobile.height}`}
                                                                            </Typography>
                                                                            <Typography>
                                                                                Size {formatBytes(imageSelectedMobile.size)}
                                                                            </Typography>
                                                                        </div> */}

                                                                    </Grid>
                                                                )
                                                                }
                                                            </Grid>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                            </Grid>

                                            <Grid item md={12}>
                                                <FormControlLabel

                                                    label="ADD PROMO BANNER ?"
                                                    control={
                                                        <Checkbox
                                                            checked={this.state.promo}
                                                            onChange={this.handleChangePromo}

                                                            color="primary"
                                                        />
                                                    }
                                                />
                                            </Grid> 
                                            {this.state.promo && (
                                                <Grid item md={12}>  
                                                <Grid container direction="row" spacing={16}>
                                    
                                <Grid item md={12}>
                                <Card>
                                    <CardHeader
                                      subheader={'DESKTOP-PROMO'}
                                    />
                                    <Divider/>
                                    <CardContent>
                                        <Grid container direction="row" spacing={16}>
                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={()=>this.handlerOpenMedia('imageSelectedDesktopPromo')}
                                                    className="upload-button"
                                                                            color="secondary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Pick Image <PhotoLibrary style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={()=>this.resetImage('imageSelectedDesktopPromo')}
                                                    className="upload-button"
                                                                            color="secondary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Reset Image <ReplayIcon style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                        </Grid>
                                        <Grid container style={{ marginTop: 20 }}>
                                            <InputLabel error={errors.errors && typeof errors.image_desktop_promo !== "undefined"}>
                                               {errors && typeof errors.image_desktop_promo !== "undefined" ? errors.image_desktop_promo : ""}
                                            </InputLabel>
                                        </Grid>
                                        <div style={{ marginTop: 20 }}>
                                            <Grid container spacing={8} direction="row">
                                                {Object.keys(imageSelectedDesktopPromo).length > 0 &&  (
                                                        <Grid item md={4} key={i}>
                                                         <Images img={imageSelectedDesktopPromo} />
                                                            {/* <img
                                                                src={imageSelectedDesktopPromo.original}
                                                                style={{ width: '100%' }}
                                                                alt={imageSelectedDesktopPromo.originalAlt}
                                                                title={imageSelectedDesktopPromo.originalTitle}
                                                            />
                                                            <div style={{
                                                                textAlign: 'center',
                                                                marginTop: 5
                                                            }} >
                                                                <Typography>
                                                                    {imageSelectedDesktopPromo.public_id}
                                                                </Typography>
                                                                <Typography>
                                                                    Dimension  {`${imageSelectedDesktopPromo.width} * ${imageSelectedDesktopPromo.height}`}
                                                                </Typography>
                                                                <Typography>
                                                                    Size {formatBytes(imageSelectedDesktopPromo.size)}
                                                                </Typography>
                                                            </div> */}

                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                        </div>
                                    </CardContent>
                                </Card>

                                  </Grid>
                                            <Grid item md={12}>
                                                <Card>
                                                    <CardHeader
                                                        subheader={'MOBILE-PROMO'}
                                                    />
                                                    <Divider />
                                                    <CardContent>
                                                        <Grid container direction="row" spacing={16}>
                                                            <Grid item>
                                                                <Button variant="contained"
                                                                    onClick={() => this.handlerOpenMedia('imageSelectedMobilePromo')}
                                                                    className="upload-button"
                                                                            color="secondary"
                                                                    style={{ margin: "0px 5px" }}
                                                                >
                                                                    Pick Image <PhotoLibrary style={{ margin: "0px 5px" }} />
                                                                </Button>
                                                            </Grid>

                                                            <Grid item>
                                                                <Button variant="contained"
                                                                    onClick={() => this.resetImage('imageSelectedMobilePromo')}
                                                                    className="upload-button"
                                                                    color="secondary"
                                                                    style={{ margin: "0px 5px" }}
                                                                >
                                                                    Reset Image <ReplayIcon style={{ margin: "0px 5px" }} />
                                                                </Button>
                                                            </Grid>

                                                        </Grid>
                                                        <Grid container style={{ marginTop: 20 }}>
                                                            <InputLabel error={errors && typeof errors.image_mobile_promo !== "undefined"}>
                                                                        {errors && typeof errors.image_mobile_promo !== "undefined" ? errors.image_mobile_promo : ""}
                                                            </InputLabel>
                                                        </Grid>
                                                        <div style={{ marginTop: 20 }}>
                                                            <Grid container spacing={8} direction="row">
                                                                {Object.keys(imageSelectedMobilePromo).length > 0 && (
                                                                    <Grid item md={4} key={i}>
                                                                                    <Images img={imageSelectedMobilePromo} />
                                                                        {/* <img
                                                                            src={imageSelectedMobilePromo.original}
                                                                            style={{ width: '100%' }}
                                                                            alt={imageSelectedMobilePromo.originalAlt}
                                                                            title={imageSelectedMobilePromo.originalTitle}
                                                                        />
                                                                        <div style={{
                                                                            textAlign: 'center',
                                                                            marginTop: 5
                                                                        }} >
                                                                            <Typography>
                                                                                {imageSelectedMobilePromo.public_id}
                                                                            </Typography>
                                                                            <Typography>
                                                                                Dimension  {`${imageSelectedMobilePromo.width} * ${imageSelectedMobilePromo.height}`}
                                                                            </Typography>
                                                                            <Typography>
                                                                                Size {formatBytes(imageSelectedMobilePromo.size)}
                                                                            </Typography>
                                                                        </div> */}

                                                                    </Grid>
                                                                )
                                                                }
                                                            </Grid>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                            </Grid>

                                                </Grid>
                                                  </Grid>
                                      )}

                              </Grid>

                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button component={Link} to="/category/banner-category" >
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={this.handlerSubmitCreate}>
                                    UPDATE
                                </Button>
                            </CardActions>
                        </Card>
                            )
                        })}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

EditBannerCategoryType.propType = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    editCategoryBannerCategoryType:PropTypes.func.isRequired,
    updateCategoryBannerType: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    categories: state.categories
})


export default compose(connect(mapStateToProps, { editCategoryBannerCategoryType, updateCategoryBannerType} ), withStyles(styles))(withRouter(EditBannerCategoryType));
