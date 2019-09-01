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
import { submitUpdateSize, editSizing, deleteSizing} from '../../../actions/sizingActions';
import { withRouter } from 'react-router';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MediaGallery from '../../common/MediaGallery';
import Images from '../../common/Images';
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class EditSizing extends Component {
    state = {
        name: "",
        description: "",
        image: [],
        open: false,
        openStateMedia: false
    }
    handlerChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handlerChangeCk = (e) => {
        this.setState({
            description: e
        })
    }
    componentDidMount(){
        this.props.editSizing(this.props.match.params.id);
    }
    handlerSubmitUpdate = () => {
        let data = {
            name: this.state.name,
            description: this.state.description,
            image: this.state.image
        }
        this.props.submitUpdateSize(this.props.match.params.id,data, this.props.history);
    }
    handlerResetImage=()=>{
        this.setState({
            image:[]
        })
    }
    handleCloseDialog = () => {
        this.setState({ open: false });
    };
    handlerOpenForm = (data) => {
        this.setState({
            open: true
        })
    }
    handlerDelete =()=>{
        if(typeof this.props.match.params.id !== "undefined"){
            this.props.deleteSizing(this.props.match.params.id, this.props.history);
        }
   
    }

    UNSAFE_componentWillReceiveProps(nextProps){

        if ((nextProps.sizings.sizing !== this.props.sizings.sizing) && nextProps.sizings.sizing instanceof Array && nextProps.sizings.sizing.length > 0 ){
            this.setState({
                name: nextProps.sizings.sizing[0].name,
                description:nextProps.sizings.sizing[0].description
            })
        }

        if ((nextProps.sizings.image !== this.props.sizings.image) && nextProps.sizings.image instanceof Array && nextProps.sizings.image.length > 0) {
            this.setState({
                image: nextProps.sizings.image.map((li, i) => {
                    return {
                        original: li.link,
                        thumbnail: li.link,
                        public_id: li.public_id,
                        size: li.size,
                    }
                })
            })

        }
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
        const { name, description, image, open, openStateMedia} = this.state;

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
                                subheader="EDIT SIZE CHART"
                                action={
                                    <Button variant="contained" color="secondary" onClick={this.handlerOpenForm}
                                    style={{marginRight:10}}>
                                        DELETE
                                    </Button>
                                }
                            />
                            <Divider />
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
                                                { shrink: true }
                                            }
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography>
                                            Description
                                      </Typography>
                                        <FormControl margin="normal" fullWidth>
                                            {description !== "" && this.props.match.params.id ? (
                                                <CKEditor id={`editorS-${this.props.match.params.id}`} onChange={this.handlerChangeCk} name={`editorSize-${this.props.match.params.id}`} value={description} />
                                            ) : ''}

                                            {/* {description == "" ? (
                                            <CKEditor id={`editorS`} onChange={this.handlerChangeCk} name={`editorSize`} value={description} />) : ''} */}


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

                                        <div style={{ margin: "20px 0" }}>
                                            <Grid container spacing={8} direction="row">
                                                {image.map((img, i) => {

                                                    return (
                                                        <Grid item md={3} key={i}>
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
                            <Divider />
                            <CardActions>
                                <Button variant="contained" color="primary" onClick={this.handlerSubmitUpdate}>
                                    UPDATE
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.props.history.push('/sizing')}>
                                    Cancel
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog
                    onClose={this.handleCloseDialog}
                    aria-labelledby="dialog-delete-voucher"
                    open={this.state.open}
                >
                    <DialogTitle id="dialog-delete-voucher" onClose={this.handleCloseDialog}>
                        Delete  size?
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Deleted size cannot be recovered. Do you still want to continue?
               </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary" variant="contained">
                            Cancel
                         </Button>
                        <Button onClick={this.handlerDelete} color="secondary" variant="contained">
                            Delete
                         </Button>

                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

EditSizing.propType = {
    classes: PropTypes.object.isRequired,
    submitUpdateSize: PropTypes.func.isRequired,
    editSizing: PropTypes.func.isRequired,
    sizings:PropTypes.object.isRequired,
    deleteSizing:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    sizings: state.sizings
})


export default compose(connect(mapStateToProps, { submitUpdateSize, editSizing, deleteSizing }), withStyles(styles))
    (withRouter(EditSizing));

