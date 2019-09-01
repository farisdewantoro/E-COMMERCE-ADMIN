import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import styles from './styles';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions'
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import ReplayIcon from '@material-ui/icons/Replay'
import configCloudinary from '../../../config/configCloudinary';
import Typography from '@material-ui/core/Typography';
import {withRouter} from 'react-router';
import { createNewLookbook, editLookbook, updateLookbook} from '../../../actions/lookbookActions';
import InputLabel from '@material-ui/core/InputLabel'
import MediaGallery from '../../common/MediaGallery';
import Images from '../../common/Images';
// function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class EditLookbook extends Component {
    state = {
        imageSelected: [],
        name:'',
        openStateMedia:false
    }
    componentDidMount(){
        this.props.editLookbook(this.props.match.params.id);
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.lookbooks.lookbook !== this.props.lookbooks.lookbook){
            this.setState({
                name:nextProps.lookbooks.lookbook[0].name
            })
        }
        if (nextProps.lookbooks.lookbook_image !== this.props.lookbooks.lookbook_image) {
            this.setState({
                imageSelected: nextProps.lookbooks.lookbook_image.map((li,i)=>{
                    return{
                        original:li.link,
                        thumbnail:li.link,
                        originalAlt:li.alt,
                        thumbnailAlt:li.alt,
                        originalAlt:li.alt,
                        thumbnailTitle: li.caption,
                        public_id:li.public_id,
                        size:li.size,
                        height:li.height,
                        width:li.width,
                        tags:li.tags
                    }
                })
            })
                        
        }
    }
    resetImage = () => {
        this.setState({
            imageSelected: [],
          
        });
    }
    handlerSubmitCreate = () => {
        let data={
            image:this.state.imageSelected,
            name:this.state.name
        }
        this.props.updateLookbook(this.props.match.params.id,data, this.props.history);
    }
    handlerOnChange=(e)=>{
        this.setState({
            name:e.target.value
        })
    }

    uploadWidget = () => {


        window.cloudinary.openMediaLibrary(configCloudinary, {

            insertHandler: (data) => {
                console.log(data);
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
            imageSelected: data.map(d => {
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
        const { classes, errors, lookbooks} = this.props;
        const { imageSelected, name, openStateMedia} = this.state;
        return (
            <div>
                <Grid container direction="column" spacing={16}>
                    <Grid item md={12}>
                        <MediaGallery
                            media_selected={'lookbook'}
                            open={openStateMedia}
                            onOpen={this.handlerOpenMedia}
                            onInsert={this.handlerInsertMedia}
                        />
                        <Card>
                            <CardHeader
                                subheader="EDIT LOOKBOOK"
                            />
                            <Divider />
                            <CardContent>
                                <Grid container style={{margin:"20px 0"}}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        error={errors.errors && typeof errors.errors.name !== "undefined" ? true:false}
                                        helperText={ errors.errors  && typeof errors.errors.name !== "undefined" ? errors.errors.name : ''}
                                        value={name}
                                        onChange={this.handlerOnChange}
                                        InputLabelProps={
                                            { shrink: true }
                                        }
                                    />
                                </Grid>
                             <Card>
                                 <CardContent>
                                        <Grid container direction="row" spacing={16}>
                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={this.handlerOpenMedia}
                                                    className="upload-button"
                                                    color="primary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Pick Image <PhotoLibrary style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                            <Grid item>
                                                <Button variant="contained"
                                                    onClick={this.resetImage}
                                                    className="upload-button"
                                                    color="primary"
                                                    style={{ margin: "0px 5px" }}
                                                >
                                                    Reset Image <ReplayIcon style={{ margin: "0px 5px" }} />
                                                </Button>
                                            </Grid>

                                        </Grid>
                                        <Grid container style={{ marginTop: 20 }}>
                                            <InputLabel error={errors.errors && typeof errors.errors.image !== "undefined"}>
                                                {errors.errors && typeof errors.errors.image !== "undefined" ? errors.errors.image:""}
                                            </InputLabel>
                                        </Grid>
                                        <div style={{ marginTop: 20 }}>
                                            <Grid container spacing={8} direction="row">
                                                {imageSelected.map((img, i) => {

                                                    return (
                                                        <Grid item md={4} key={i}>
                                                            <Images img={img}/>
                                                            {/* <img
                                                                src={img.original}
                                                                style={{ width: '100%' }}
                                                                alt={img.originalAlt}
                                                                title={img.originalTitle}
                                                            />
                                                            <div style={{
                                                                textAlign: 'center',
                                                                marginTop: 5
                                                            }} >
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
                                 </CardContent>
                             </Card>
                             
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button color="secondary" component={Link} to="/lookbook" variant="contained">    
                                    Cancel
                                </Button>
                                <Button color="primary" variant="contained" onClick={this.handlerSubmitCreate}>    
                                    UPDATE
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

EditLookbook.propType = {
    classes: PropTypes.object.isRequired,
    createNewLookbook:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired,
    editLookbook:PropTypes.func.isRequired,
    lookbooks:PropTypes.object.isRequired,
    updateLookbook:PropTypes.func.isRequired
}

const mapStateToProps = (state)=>({
    errors:state.errors,
    lookbooks:state.lookbooks
})


export default compose(connect(mapStateToProps, { createNewLookbook, editLookbook, updateLookbook}), withStyles(styles))(withRouter(EditLookbook));
