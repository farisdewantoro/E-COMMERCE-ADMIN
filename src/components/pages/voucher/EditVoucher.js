import React, { Component } from 'react'
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CardActions from '@material-ui/core/CardActions';
import { getAllVoucherType, editVoucher, updateVoucher} from '../../../actions/voucherActions';
import {withRouter} from 'react-router';
import moment from 'moment';
class EditVoucher extends Component {
    state={
        name:'',
        description:'',
        voucher_type_id:'',
        max_uses:'',
        value:'',
        valid_from:'',
        valid_until:'',
        id:"AUTO GENERATE"
    }
    handlerChange = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handlerSubmit = ()=>{

        this.props.updateVoucher(this.props.match.params.id,this.state,this.props.history);
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps.vouchers.voucher !== this.props.vouchers.voucher){
            this.setState({
                name: nextProps.vouchers.voucher[0].name,
                description: nextProps.vouchers.voucher[0].description,
                voucher_type_id: nextProps.vouchers.voucher[0].voucher_type_id,
                max_uses: nextProps.vouchers.voucher[0].max_uses,
                value: nextProps.vouchers.voucher[0].value,
                valid_from: nextProps.vouchers.voucher[0].valid_from,
                valid_until: nextProps.vouchers.voucher[0].valid_until,
                id: nextProps.vouchers.voucher[0].id
            })
        }
    }
    componentDidMount(){
        this.props.getAllVoucherType();
        this.props.editVoucher(this.props.match.params.id);
    }
    render() {
        const {name,description,voucher_type_id,max_uses,value,valid_from,valid_until,id} = this.state;
        const {classes,vouchers,errors}=this.props;

        return (
            <div>
                <Grid container direction="column">
                    <Grid item md={12}>
                        <Card>
                            <CardHeader
                            subheader="EDIT VOUCHER DISCOUNT"
                            />
                            <Divider/>
                            <CardContent>
                                <Grid container direction="column" spacing={16}>
                                    <Grid item>
                                        <TextField
                                            label="VOUCHER CODE"
                                            name="name"
                                            value={id}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="VOUCHER NAME"
                                            name="name"
                                            value={name}
                                            error={errors.name}
                                            helperText={errors.name}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="VOUCHER DESCRIPTION"
                                            name="description"
                                            value={description}
                                            error={errors.description}
                                            helperText={errors.description}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="MAX USES"
                                            name="max_uses"
                                            error={errors.max_uses}
                                            helperText={errors.max_uses}
                                            value={max_uses}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                            type="number"
                                            
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControl
                                        fullWidth
                                            error={errors.voucher_type_id}
                                         className={classes.formControl}>
                                            <InputLabel htmlFor="voucher_type_id" 
                                            shrink={true}
                                                
                                            >Voucher Type</InputLabel>
                                            <Select
                                                value={voucher_type_id}
                                                onChange={this.handlerChange}
                                                inputProps={{
                                                    name: 'voucher_type_id',
                                                    id: 'voucher_type_id',
                                                }}
                                             
                                            >
                                                {vouchers.voucher_type.map((vt,i)=>{
                                                    return(
                                                        <MenuItem key={i} value={vt.id}>{vt.name.toUpperCase()}</MenuItem>
                                                    )
                                                })}
                                              
                                            </Select>
                                            <FormHelperText>{errors.voucher_type_id}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Voucher Value"
                                            name="value"
                                            value={value}
                                            error={errors.value}
                                            helperText={errors.value}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                            type="number"
                                            
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Voucher Valid From"
                                            name="valid_from"
                                            value={moment(valid_from).format('YYYY-MM-DD')}
                                            error={errors.valid_from}
                                            helperText={errors.valid_from}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                            type="date"
                                            
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="Voucher Valid Until"
                                            name="valid_until"
                                            error={errors.valid_until}
                                            helperText={errors.valid_until}
                                            value={moment(valid_until).format('YYYY-MM-DD')}
                                            onChange={this.handlerChange}
                                            InputLabelProps={
                                                { shrink: true }
                                            }
                                            fullWidth
                                            type="date"

                                        />
                                    </Grid>
                                </Grid>
                             
                            </CardContent>
                            <Divider/>
                            <CardActions>
                                <Button 
                                color="primary" 
                                variant="contained"
                                    disabled={vouchers.loading}
                                 onClick={this.handlerSubmit}>    
                                    SAVE
                                </Button>
                                <Button variant="outlined" component={Link} to="/voucher">    
                                    CANCEL
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
EditVoucher.propType = {
    classes: PropTypes.object.isRequired,
    vouchers:PropTypes.object.isRequired,
    getAllVoucherType:PropTypes.func.isRequired,
    editVoucher:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired,
    updateVoucher:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  vouchers: state.vouchers,
    errors: state.errors
})


export default compose(connect(mapStateToProps, { getAllVoucherType, editVoucher, updateVoucher}), withStyles(styles))
    (withRouter(EditVoucher));

