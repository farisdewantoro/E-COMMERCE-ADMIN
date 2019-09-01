import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Slide from '@material-ui/core/Slide';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import SearchIcon from '@material-ui/icons/Search';

import {
    Grid,
    Card,
    CardContent,
    CardActions,
    LinearProgress,
    CardActionArea,
    GridListTile,
    GridList,
    GridListTileBar,
    Paper
} from '@material-ui/core';
import styles from './styles';
import { uploadMedia, getMediaList, deleteImageMedia} from '../../actions/mediaActions';
import InputBase from '@material-ui/core/InputBase';
import InfiniteScroll from 'react-infinite-scroller';

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }
function renderLink(link){
    const l = link.split('/');
    return l[2];
}
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
function readerImg(img){
    var image = new Image();

    image.src = process.env.PUBLIC_URL + "/media" + img;
    
    let dimension = image.onload = ()=>{
        let d = image.width + 'x' + image.height;
      return d;

    };

    return dimension();

}
class MediaGallery extends React.Component {
    constructor(props){
        super(props);
        this.state={
            uploadButton:true,
            imageSelected:[],
            imageSelectedUpload:[],
            imageSelectInsert:[],
            searchText:'',
            pagination:{
                currentPage:0,
                perPage:0,
                totalPage:0
            },
            hasMore:true,
            media_list:[]
        }
    }
    componentDidMount(){
        this.props.getMediaList(this.props.media_selected);
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.media.pagination !== this.props.media.pagination){
            this.setState({
                pagination:nextProps.media.pagination
            });
            if(nextProps.media.pagination.currentPage >= nextProps.media.pagination.totalPage){
                this.setState({
                    hasMore:false
                })
            }
        }
        // if(nextProps.media.media_list !== this.props.media.media_list){

        //     let newMedia = nextProps.media.media_list.filter(x => this.state.media_list.map(a => a.link).indexOf(x.link) === -1  );
        //     let removeMedia = this.state.media_list.filter(x=>nextProps.media.media_list.map(a=>a.link).indexOf(x.link) === -1 );
        
        //     if(newMedia.length > 0){
        //         this.setState(prevState => ({
        //             media_list: prevState.media_list.concat(newMedia)
        //         }));
        //     }
        //     if (removeMedia.length > 0) {
        //         this.setState(prevState => ({
        //             media_list: this.state.media_list.filter(x => nextProps.media.media_list.map(a => a.link).indexOf(x.link) > -1)
        //         }));
        //     }
        // }
    }
    handlerLoadMore=()=>{
        let pagination = {
            currentPage: this.state.pagination.currentPage + 1,
            perPage: this.state.pagination.perPage,
            totalPage: this.state.pagination.totalPage
        };
        this.setState(prevState=>({
            pagination:{
                ...prevState.pagination,
                currentPage:pagination.currentPage
            }
        }));
   
        if(pagination.currentPage >= pagination.totalPage){
            this.setState({
                hasMore:false
            })
        }
        this.props.getMediaList(this.props.media_selected, this.props.searchText, pagination);
    }
    handlerRemoveImageUploader = ()=>{

        this.setState({
            uploadButton:true,
            imageSelected:[]
        })
    }
    handlerSelectImage = (e)=>{
        let file_length = e.target.files.length;

   
        if (file_length > 0){
            this.setState({
                imageSelectedUpload: e.target.files
            });

     
            for (let i = 0; i < file_length; i++) {
                const reader = new FileReader();
                let name = e.target.files[i].name;
            
                reader.onload =  (e)=> {
                    e.file_name = name;
                    this.setState({
                        imageSelected:this.state.imageSelected.concat(e)
                    })
                };
                
                reader.readAsDataURL(e.target.files[i]);
                
            }
         
            this.setState({
                uploadButton: false
            });
        }
    }
    handlerUploadFile = ()=>{
        const file = this.state.imageSelectedUpload;
        let formData = new FormData();
        for (let i = 0; i < file.length; i++) {
            formData.append('file', file[i]);
            
        }
        this.props.uploadMedia(formData,this.props.media_selected);
        this.setState({
            uploadButton: true,
            imageSelected: [],
            imageSelectedUpload: []
        })
    }
    handlerSelectedImageInsert =(data)=>{
        const imageSelectInsert = this.state.imageSelectInsert;
        if(imageSelectInsert.filter(m=>m.link === data.link).length > 0){
            this.setState({
                imageSelectInsert: imageSelectInsert.filter(m=> m.link !== data.link)
            })
        }else{
            this.setState({
                imageSelectInsert: this.state.imageSelectInsert.concat(data)
            })
        }
     
    }
    handlerDeleteImage = ()=>{
        if(this.state.imageSelectInsert.length > 0){
            this.props.deleteImageMedia(this.state.imageSelectInsert,this.props.media_selected);
            this.setState({
                imageSelectInsert:[]
            })
        }
    }
    handlerSearchChange = (e)=>{
        this.setState({
            searchText:e.target.value
        });
        this.props.getMediaList(this.props.media_selected, e.target.value);
    }
    render(){
        const { classes, media, open, onOpen, onInsert } = this.props;
        const { uploadButton, imageSelected, imageSelectInsert, pagination, hasMore,media_list} = this.state;
       
        return (
            <div>
                <Dialog
                    fullScreen
                    TransitionComponent={Transition}
                    open={open}
                    onClose={onOpen}
                >
                    <AppBar className={classes.appBar} >
                        <Toolbar>
                        
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                MEDIA GALLERY
                            </Typography>
                            <Paper className={classes.root}>
                          
                                <InputBase
                                    className={classes.inputSearch}
                                    placeholder="Search image"
                                    inputProps={{ 'aria-label': 'Search Google Maps' }}
                                    onChange={this.handlerSearchChange}
                                    value={this.state.searchText}
                                />
                                <IconButton className={classes.iconButton}   aria-label="Search">
                                    <SearchIcon />
                                </IconButton>
                            
                            </Paper>
                            {imageSelectInsert.length > 0 && (
                                <Paper elevation={0} style={{
                                    margin: "0px 10px"
                                }}>
                                    <div
                                        className={classes.flexCenter}
                                    >
                                        <Typography
                                            className={classes.flexCenter}
                                        >
                                            <CheckCircleIcon className={classes.leftIcon} /> {imageSelectInsert.length} SELECTED
                                    </Typography>
                                        <Divider className={classes.divider} />

                                        <Button
                                            className={classes.flexCenter}
                                            onClick={this.handlerDeleteImage}
                                        >
                                            <DeleteIcon className={classes.leftIcon} />    Delete
                                    </Button>
                                        <Button
                                            className={classes.flexCenter}
                                            onClick={()=>onInsert(this.state.imageSelectInsert)}
                                        >
                                            <AddCircleIcon className={classes.leftIcon} /> Insert
                                    </Button>
                                    </div>

                                </Paper>
                            )}
                
                            <IconButton color="inherit" onClick={onOpen}  aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div style={{maxWidth:"100%",padding:10}} className={classes.rootWraper}> 
                        <Grid container direction="column" spacing={8}>
                            <Grid item xs={12}>
                                <div className={classes.wrapperUpload}>   
                                 
                                    {uploadButton && !media.loading &&  (
                                      
                                        <div className={classes.wrapperUploader} id="wraperUpload">
                                            <Typography style={{ justifyContent: "center", display: "flex" }} className={classes.wrapperTitle}>
                                                Max File Size 5mb.
                                        </Typography>
                                       
                                            <div style={{ justifyContent: "center", display: "flex" }}>
                                                <input
                                                    accept="image/*"
                                                    className={classes.input}
                                                    id="outlined-button-file"
                                                    multiple
                                                    type="file"
                                                    onChange={this.handlerSelectImage}
                                                />
                                                <label htmlFor="outlined-button-file">
                                                    <Button variant="outlined" component="span" className={classes.button}>
                                                        Upload
                                                     <CloudUploadIcon className={classes.rightIcon} />
                                                    </Button>
                                                </label>
                                            </div>
                                        
                                            <Typography style={{ justifyContent: "center", display: "flex" }} className={classes.wrapperTitle}>
                                                Auto compress 60% low
                                        </Typography>

    
                                        </div>   
                                        )}
                                    {!uploadButton && !media.loading && (
                                        <div className={classes.wrapperImageUploader}>
                                            <Grid container direction="row" spacing={8}>
                                                {imageSelected.map(img => {
                                                    return (
                                                        <Grid item md={3} key={img.file_name}>

                                                            <img src={img.target.result} style={{ maxWidth: "100%" }} alt="image-upload" title={img.file_name} />
                                                            <Typography>
                                                                File : {img.file_name}
                                                            </Typography>
                                                            <Typography>
                                                                Size : {formatBytes(img.total)}
                                                            </Typography>
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                            <Button fullWidth style={{ margin: "5px 0" }} variant="outlined" onClick={this.handlerRemoveImageUploader}>
                                                REMOVE ALL
                                            </Button>
                                            <Button fullWidth style={{ margin: "5px 0" }} variant="contained" color="primary" onClick={this.handlerUploadFile}>
                                                UPLOAD    <CloudUploadIcon className={classes.rightIcon} />
                                            </Button>
                                      
                                         
                                        </div>
                                    )}
                                    {media.loading &&  (
                                        <div className={classes.uploadLoading}>
                                            <Typography variant="h5" className={classes.textLoadingUpload}>
                                                LOADING....{media.loading_percent}
                                         </Typography>
                                            <LinearProgress variant={media.loading_process ? 'query':'determinate'} value={media.loading_percent} style={{ height: 14 }} />

                                        </div>
                                    )}
                                  




                                
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{
                                    padding:10,
                                    height:400,
                                    overflow:"auto"
                                }}>
                                    <InfiniteScroll
                                        pageStart={1}
                                        loadMore={this.handlerLoadMore}
                                        initialLoad={false}
                                        useWindow={false}
                                        threshold={20}
                                        hasMore={hasMore}
                                        loader={<div className="loader" key={0}>Loading ...</div>}
                                    >
                                        <GridList cellHeight={150} className={classes.gridList} cols={8}>
                                            {media.media_list.map(m => (
                                                <GridListTile key={m.link} cols={1}
                                                    className={classNames(classes.normalFrame, {
                                                        [classes.selectedFrame]: (imageSelectInsert.filter(im => im.link === m.link).length > 0)
                                                    })}
                                                    onClick={() => this.handlerSelectedImageInsert(m)}
                                                >
                                                    <img src={process.env.PUBLIC_URL + "/media" + m.link} alt={renderLink(m.link)} title={renderLink(m.link)} />
                                                    <GridListTileBar
                                                        title={renderLink(m.link)}
                                                        subtitle={
                                                            <div>
                                                                <span>
                                                                    {readerImg(m.link)}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    {formatBytes(m.size)}
                                                                </span>
                                                            </div>
                                                        }
                                                        style={{
                                                            height: "auto",
                                                            padding: 1
                                                        }}
                                                        classes={{
                                                            title: classes.titleTileBar,
                                                            subtitle: classes.subtitleTileBar
                                                        }}

                                                    />
                                                </GridListTile>
                                            ))}
                                        </GridList>
                                    </InfiniteScroll>
                               
                                    {/* {media.media_list.map(mm => {
                                        return (
                                            <Grid item xs={2} md={3}>

                                                <Card>
                                                    
                                                    <CardActionArea>
                                                        <div 
                                                            style={{
                                                                width:"100%",
                                                                height:"300px",
                                                                ""
                                                            }}
                                                        >

                                                        </div>
                                                        <img src={process.env.PUBLIC_URL+"/image/"+mm} style={{maxWidth:"100%"}} alt="image"/>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        )
                                    })} */}
                                </div>
                           
                            </Grid>
                        </Grid>
                    </div>
                 
                </Dialog>
            </div>
        );

}
}

MediaGallery.propTypes = {
    classes: PropTypes.object.isRequired,
    uploadMedia:PropTypes.func.isRequired,
    media:PropTypes.object.isRequired,
    getMediaList:PropTypes.func.isRequired,
    deleteImageMedia:PropTypes.func.isRequired
};

const mapStateToProps = (state)=>({
    media:state.media
})

export default compose(withStyles(styles), connect(mapStateToProps, { deleteImageMedia,uploadMedia, getMediaList}))(MediaGallery);