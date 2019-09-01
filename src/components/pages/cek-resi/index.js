import React, { Component } from 'react'
import {
    Grid,
    Card,
    Paper,
    IconButton,
    CardContent,
    CardHeader,
    InputBase,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import SearchIcon from '@material-ui/icons/Search';
import styles from './styles';
import {cekResi} from '../../../actions/cekResiActions';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
class CekResi extends Component {
    constructor(){
        super();
        this.state={
            searchText:'',
            payload:{},
            courier:'jne',
        }
    }
    onSubmit = (e)=>{
        e.preventDefault();
        const data ={
            waybill: this.state.searchText,
            courier:this.state.courier
        }
        this.props.cekResi(data);
 
    }
    onChangeText = (e)=>{
        this.setState({
            searchText:e.target.value
        })
    }
    handleChangeCourier = (e)=>{
        this.setState({
            courier:e.target.value
        })
    }
  render() {
    const {searchText} = this.state;
      const { classes,resi} = this.props;
    const courierList=
        ["jne", "pos", "tiki", "wahana", "jnt", "rpx", "sap", "sicepat", "pcp", "jet", "dse", "first", "ninja", "lion", "idl", "rex"]
    ;
    return (
      <div>
   
                    <Card>
                        <CardHeader
                            subheader="CEK RESI"
                            
                        />
                        <Divider/>

                        <CardContent>
                           
                            <Grid container direction="column" spacing={8}>
                                <Grid item md={12}>
                            <form onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                            <Paper className={classes.paperSearchBar} elevation={0} square={true}>
                            
                                    <IconButton
                                        type="submit"
                                        className={classes.iconButton}
                                        aria-label="Search">
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase className={classes.input}
                                        value={searchText}
                                        onChange={this.onChangeText}
                                        placeholder="Search order"
                                        
                                    />
                              
                            </Paper>
                                    <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-simple" shrink={true}>COURIER</InputLabel>
                                <Select
                                    value={this.state.courier}
                                    onChange={this.handleChangeCourier}
                                        inputProps={{
                                            name: 'Courier',
                                            id: 'age-simple',
                                        }}
                                >
                                    {courierList.map(d=>{
                                    return(
                                            <MenuItem key={d} value={d}>{d.toUpperCase()}</MenuItem>
                                        )
                                    })}
                                
                                </Select>
                                    </FormControl>
                                </div>
                            </form>
                                   </Grid>
                                
                    
                
                        <Grid item xs={12}>
                        {resi.data && (
                            resi.data.result && (
                                    <div className="table-responsive"> 
                                        <table className="table">
                                        <caption style={{ textAlign: 'left', padding: '2px' }}>
                                            Informasi Pengiriman
                             </caption>
                                       
                                            {resi.data.result.details && resi.data.result.summary && (
                                                <tbody>
                                           
                                                    
                                                <tr>
                                                    <td scope="row">No Resi </td>
                                                    <td>: {resi.data.result.summary.waybill_number}</td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Status </td>
                                                    <td>: {resi.data.result.summary.status}</td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Service </td>
                                                    <td>: {resi.data.result.summary.service_code}</td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Dikirim tanggal	 </td>
                                                    <td>: {resi.data.result.summary.waybill_date}</td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Dikirim oleh	 </td>
                                                    <td>: {resi.data.result.summary.shipper_name} <br /> {resi.data.result.summary.origin}</td>
                                                </tr>
                                                <tr>
                                                    <td scope="row">Dikirim ke	 </td>
                                                    <td>: {resi.data.result.summary.receiver_name} <br /> {resi.data.result.summary.destination}</td>
                                                </tr>

                                                  <tr>
                                                            <td scope="row">Alamat pengiriman 1	 </td>
                                                            <td>: {resi.data.result.details.receiver_address1}</td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row">Alamat pengiriman 2	 </td>
                                                            <td>: {resi.data.result.details.receiver_address2}</td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row">Alamat pengiriman 3	 </td>
                                                            <td>: {resi.data.result.details.receiver_address3}</td>
                                                        </tr>

                                              
                                                </tbody>
                                            )}
                                  
                                         
                                          

                                    </table>

                                    {resi.data.result.delivery_status && (
                                            <div className="table-responsive">
                                            
                                            <table className="table">
                                <caption style={{ textAlign: 'left', padding: '2px' }}>
                                    Delivery Status
                             </caption>
                                <tbody>
                                    <tr>
                                        <td scope="row">Status </td>
                                        <td>: {resi.data.result.delivery_status.status}</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Penerima paket kiriman </td>
                                        <td>: {resi.data.result.delivery_status.pod_receiver}</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Tanggal paket kiriman diterima</td>
                                        <td>:  {resi.data.result.delivery_status.pod_date}</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Waktu/Jam paket kiriman diterima</td>
                                         <td>:  {resi.data.result.delivery_status.pod_time}</td>
                                    </tr>

                                </tbody>
                            </table>
                             </div>
                                    )}

                                        {resi.data.result.manifest && resi.data.result.manifest instanceof Array && (
                                            <div className="table-responsive">
                                         <table className="table">
                                                <caption style={{ textAlign: 'left', padding: '2px' }}>
                                                    Delivery Time
                                                     </caption>
                                                <thead>
                                                    <th> Tanggal </th>
                                                    <th>Keterangan</th>
                                                </thead>
                                                <tbody>
                                                    {resi.data.result.manifest.map(m=>{
                                                        return(
                                                            <tr key={m.manifest_code}>
                                                                <td scope="row"> {m.manifest_date} - {m.manifest_time} </td>
                                                             
                                                                <td scope="row"> {m.city_name} - {m.manifest_description}</td>
                                                            </tr>
                                                        )
                                                    })}
                                               


                                                </tbody>
                                            </table>
                                            </div>
                                        )}




                                    </div>


                            )
                            
                            
                            )}

                            {resi.data && resi.data.status && resi.data.status.description && (
                                <Typography>
                                    {resi.data.status.description}
                                </Typography>
                            )}
                         
                       
                            {/* <Card>
                                <CardContent>
                                    <div >
                                        <Typography>
                                            <strong>  DELIVERED : </strong>  true
                                        </Typography>
                                        <Typography>
                                            <strong>  COURIER : </strong> Jalur Nugraha Ekakurir  jne 
                                        </Typography>
                                        <Typography>
                                            <strong> SERVICE CODE : </strong> OKE
                                        </Typography>
                                        <Typography>
                                            <strong> DIKIRIM OLEH   : </strong> IRMA F <br/>
                                            WONOGIRI,KAB.WONOGIRI
                                        </Typography>
                                         <Typography>
                                            <strong> PENERIMA  : </strong> RISKA VIVI <br/>
                                            PALEMBANG
                                         </Typography>
                                         <Typography>
                                            <strong> DIKIRIM TANGGAL : </strong> 2015-03-03
                                         </Typography>
                                         <Typography>

                                         </Typography>
                                        <Typography>
                                            <strong>  NO RESI : </strong>  jne
                                        </Typography>
                                     
                                    </div>
                                </CardContent>
                            </Card> */}
                        </Grid>

               



          </Grid>
                        </CardContent>
                    </Card>
         
            <Dialog fullScreen open={resi.loading}>

                <Grid container justify="center" alignItems="center" direction="column" style={{ height: "100%" }}>

                    <CircularProgress className={classes.progress} />
                    <Typography className={classes.normalText} style={{ margin: "20px 0" }}>Please wait Loading..</Typography>
                </Grid>

            </Dialog>
      </div>
    )
  }
}

CekResi.propTypes={
    classes:PropTypes.object.isRequired,
    cekResi:PropTypes.object.isRequired,
    resi:PropTypes.object.isRequired
}


const mapStateToProps = (state)=>({
    resi:state.resi
});



export default compose(connect(mapStateToProps,{cekResi}),withStyles(styles))(CekResi);
