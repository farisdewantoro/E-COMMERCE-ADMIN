import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import update from 'react-addons-update';
import { getAllCategoryTag, createNewCategory} from '../../../actions/categoryActions';
import { withRouter } from "react-router";
const styles = theme => ({
    formContainer:{
        margin:"20px 0"
    }
});
class CategoryCreate extends Component {
    state={
        category_type:[{name:''}],
        category_tag:[],
        selected_tag_id:'',
        category_name:'',

    }
    componentDidMount(){
        this.props.getAllCategoryTag();
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.categories.tag !== this.props.categories.tag){
            this.setState({
                category_tag:nextProps.categories.tag
            })
        }
        if (typeof nextProps.errors.category_type !== "undefined" && nextProps.errors.category_type !== this.props.errors.category_type ){
            let category_type = this.state.category_type;
            let errors = nextProps.errors.category_type;
            errors.forEach((er,index) => {
                category_type.forEach((ct,i)=>{
                    if(er.index === i ){
                        ct.error =er.message
                    }
                })
           });
           this.setState({
               category_type: category_type
           })
        }
    }

    submitCategory=()=>{
        let data = {
            tag_id:this.state.selected_tag_id,
            category_type:this.state.category_type,
            category_name:this.state.category_name
        }

        this.props.createNewCategory(data,this.props.history);


    }
    addMoreOption=()=>{
        this.setState({
            category_type:this.state.category_type.concat([{name:''}])
        })
    }
    handlerOnchange = (data)=>(e)=>{
        let value = e.target.value;

        this.setState({
            category_type: update(this.state.category_type, { [data]: { $set: { name: value } } })
        })
    }
    handlerDeleteOption=(index)=>{
        if(this.state.category_type.length > 1 ){
            this.setState({
                category_type: this.state.category_type.filter((c, i) => i !== index)
            })
        }
    
    }
    handlerChangeTag =(e)=>{
        this.setState({
            selected_tag_id:e.target.value
        })
    }
    handlerChangeNameCategory=(e)=>{
        this.setState({
            category_name: e.target.value
        })
    }
    render() {
        const { classes, errors} = this.props;
        const { category_type, category_tag, selected_tag_id, category_name} = this.state;
     
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            New Category 
                        </Typography>
                        <Divider/>
                      <div className={classes.formContainer} >
                      <Grid container direction="column" spacing={8}>   
                            <Grid item md={12}>
                                    <FormControl required  fullWidth className={classes.formControl}>
                                        <InputLabel shrink={true} error={errors.tag_id ? true : false} htmlFor="category-tag">Category Tag</InputLabel>
                                        <Select
                                            value={selected_tag_id}
                                            margin="normal"
                                            error={errors.tag_id ? true : false}
                                            onChange={this.handlerChangeTag}
                                            inputProps={{
                                                name: 'categoryTag',
                                                id: 'category-tag',
                                            }}
                                        >
                                       {category_tag.map((ct,i)=>{
                                           return(
                                               <MenuItem value={ct.id}>{ct.name}</MenuItem>
                                           )
                                       })}
                                         
                                        </Select>
                                        <FormHelperText error={errors.tag_id ? true:false}>{errors.tag_id}</FormHelperText>
                                    </FormControl>
                            </Grid>
                                   
                                <Grid item md={12}>
                                    <TextField
                                        id="filled-full-width"
                                        label="Category Name"
                                        rows={2}
                                        error={errors.category_name ? true : false}
                                        value={category_name}
                                        onChange={this.handlerChangeNameCategory}
                                        margin="normal"
                                        helperText={errors.category_name}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    {category_type.map((ct, i) => {
                                        return (
                                <Grid container direction="row"  spacing={8} alignItems="center">
                                        <Grid item md={11}>
                                            <TextField
                                                id="filled-full-width"
                                                label="Category type"
                                                rows={2}
                                                error={ct.error ? true:false}
                                                helperText={ct.error}      
                                                value={ct.name}
                                                onChange={this.handlerOnchange(i)}
                                                margin="normal"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={1}>
                                            <IconButton style={{ marginTop: "20px" }} onClick={()=>this.handlerDeleteOption(i)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                </Grid>
                                      )
                                        })}
                                <Grid container>
                                    <Button variant="outlined" color="default" onClick={this.addMoreOption}> 
                                        Add more options
                                    </Button>
                                </Grid>
                               
                                </Grid>

                     
                    
                      </Grid>
              
                       
                      </div>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="contained" color="primary" fullWidth  onClick={this.submitCategory}>CREATE NEW CATEGORY</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}
CategoryCreate.propTypes ={
    classes:PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    getAllCategoryTag:PropTypes.func.isRequired,
    createNewCategory: PropTypes.func.isRequired,
}

const mapStateToProps = (state)=>({
    categories:state.categories,
    errors:state.errors
})

export default compose(
    connect(mapStateToProps, 
        { getAllCategoryTag, createNewCategory }), 
        withStyles(styles, { name: "CategoryCreate" }))
        (withRouter(CategoryCreate));
