import React, { Component } from 'react'
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import { getOrderById, getInvoicePDF } from '../../../../actions/orderActions';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import { withRouter } from 'react-router';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
function formatCurrency(value) {
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function getExpiredDate(date) {
  let newDate = new Date(date);

  newDate.setDate(newDate.getDate() + 1);
  return moment(newDate).format('LLL');

}


const { clearInterval, setInterval } = window;

class OrderDetail extends Component {
  state = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    timePayment: 0,
    dateCreate: 0,
    countDown: false,
    textTimer: ''
  }
  componentDidMount() {
    this
      .props
      .getOrderById(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (nextProps.orders.order !== this.props.orders.order
      &&
      nextProps.orders.order.length > 0
      && nextProps.orders.order[0].order_status_id === 1) {

      let dateValid = new Date(nextProps.orders.order[0].created_at);
      dateValid.setSeconds(dateValid.getSeconds() + 5);
      dateValid.setHours(dateValid.getHours() + 4);
      let nowDate = new Date();
      this.setState({
        timePayment: dateValid.getTime(),
        dateCreate: nowDate.getTime(),
        textTimer: ' Please choose a payment method within:'
      })
      if (dateValid.getTime() > nowDate.getTime()) {
        this.setState({
          countDown: true
        });

        this.interval = setInterval(() => {
          const date = this.calculateCountdown(dateValid);
          date ? this.setState(date) : this.stop();
        }, 1000);
      }


    }
    if (nextProps.orders.order_payment !== this.props.orders.order_payment
      && nextProps.orders.order_payment instanceof Array
      && nextProps.orders.order_payment.length > 0
      && nextProps.orders.order[0].order_status_id === 3
      && nextProps.orders.order_payment[0].payment_type !== 'gopay'
      && nextProps.orders.order_payment[0].payment_type !== 'bca_klikpay'
    ) {
      let dateValid = new Date(nextProps.orders.order_payment[0].transaction_time);
      dateValid.setSeconds(dateValid.getSeconds() + 5);
      dateValid.setDate(dateValid.getDate() + 1);

      let nowDate = new Date();
      this.setState({
        timePayment: dateValid.getTime(),
        dateCreate: nowDate.getTime(),
        textTimer: 'Please make a payment within:'
      })
      if (dateValid.getTime() > nowDate.getTime()) {
        this.setState({
          countDown: true
        });

        this.interval = setInterval(() => {
          const date = this.calculateCountdown(dateValid);
          date ? this.setState(date) : this.stop();
        }, 1000);
      }
    }
    if (nextProps.orders.order_payment !== this.props.orders.order_payment
      && nextProps.orders.order_payment instanceof Array
      && nextProps.orders.order_payment.length > 0
      && nextProps.orders.order[0].order_status_id === 3
      && nextProps.orders.order_payment[0].payment_type !== 'gopay'
      && nextProps.orders.order_payment[0].payment_type !== 'bca_klikpay'
      && nextProps.orders.order_payment[0].payment_type === 'bca_klikbca'
    ) {
      let dateValid = new Date(nextProps.orders.order_payment[0].transaction_time);
      dateValid.setSeconds(dateValid.getSeconds() + 5);
      dateValid.setHours(dateValid.getHours() + 2);

      let nowDate = new Date();
      this.setState({
        timePayment: dateValid.getTime(),
        dateCreate: nowDate.getTime(),
        textTimer: 'Please make a payment within:'
      })
      if (dateValid.getTime() > nowDate.getTime()) {
        this.setState({
          countDown: true
        });

        this.interval = setInterval(() => {
          const date = this.calculateCountdown(dateValid);
          date ? this.setState(date) : this.stop();
        }, 1000);
      }
    }
    if (nextProps.orders.order_payment !== this.props.orders.order_payment
      && nextProps.orders.order_payment instanceof Array
      && nextProps.orders.order_payment.length > 0
      && nextProps.orders.order[0].order_status_id === 3
      && nextProps.orders.order_payment[0].payment_type === 'gopay') {
      let dateValid = new Date(nextProps.orders.order_payment[0].transaction_time);
      dateValid.setSeconds(dateValid.getSeconds() + 5);
      dateValid.setMinutes(dateValid.getMinutes() + 15);

      let nowDate = new Date();
      this.setState({
        timePayment: dateValid.getTime(),
        dateCreate: nowDate.getTime(),
        textTimer: 'Please make a payment within:'
      })
      if (dateValid.getTime() > nowDate.getTime()) {
        this.setState({
          countDown: true
        });

        this.interval = setInterval(() => {
          const date = this.calculateCountdown(dateValid);
          date ? this.setState(date) : this.stop();
        }, 1000);
      }
    }


  }
  componentWillUnmount() {
    this.stop();

  }
  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.countDown === true && nextState.countDown === "expired") {
      this.stop();

      window.location.reload();

      return false;
    }
    return true;
  }
  calculateCountdown(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  }
  stop() {
    clearInterval(this.interval);
    if (this.state.countDown === true) {
      this.setState({
        countDown: "expired"
      })
    }

  }





  // shouldComponentUpdate(nextProps, nextState){
  //     if(nextState.hours === 0 && )
  // }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  voucherCheck = (value) => {
    if (value.length > 0) {
      if (value[0].voucher_type === 1) {
        return `${value[0].value}%`;
      }
      if (value[0].voucher_type === 2) {
        return `- IDR ${formatCurrency(value[0].value)}`;
      }
      if (typeof value[0].value === "undefined") {
        return 'NONE'
      }
    }

  }
  addVoucherToTotal = (subTotal, voucher) => {
    if (voucher.length === 0 || typeof voucher === "undefined") {
      return subTotal
    }
    if (voucher.length > 0) {
      if (voucher[0].voucher_type === 1) {
        let discount = subTotal * (voucher[0].value / 100);
        let total = Math.max(1, subTotal - discount);
        return total;
      }
      if (voucher[0].voucher_type === 2) {
        let total = Math.max(1, subTotal - voucher[0].value);

        return total;
      }
    }



  }
  handlerOpenInvoice = ()=>{
    // var newWindow = window.open("about:blank","_blank");
    var newWindow = window;
    
    this.props.getInvoicePDF(newWindow,this.props.orders);
  }
  render() {
    const { classes, orders } = this.props;
    const {
      hours,
      min,
      sec,
      timePayment,
      dateCreate,
      textTimer } = this.state;

    if (orders.order instanceof Array && orders.order.length > 0 && orders.loading === false) {

      return (

        <div className={classes.rootOrder}>
          <Grid container justify="center">
            <Grid item md={12} xs={12}>
              <Grid container justify="center">
                <Grid item md={12} xs={12}>
                  {timePayment > dateCreate ? (
                    <Grid container>
                      <Grid item md={12} >
                        <Paper elevation={1} className={classes.paperTimer}>
                          <Grid container justify="center">
                            <Typography component="p" className={classes.countTime}>
                              {textTimer}
                            </Typography>
                            <Grid container justify="center" spacing={8}>

                              <Typography component="p" className={classes.countTime}>
                                {hours}
                              </Typography>
                              <Typography component="p" className={classes.countTime}>
                                hours
                                             </Typography>
                              <Typography component="p" className={classes.countTime}>
                                :
                                             </Typography>

                              <Typography component="p" className={classes.countTime}>
                                {min}
                              </Typography>
                              <Typography component="p" className={classes.countTime}>
                                minutes
                                             </Typography>
                              <Typography component="p" className={classes.countTime}>
                                :
                                             </Typography>

                              <Typography component="p" className={classes.countTime}>
                                {sec}
                              </Typography>
                              <Typography component="p" className={classes.countTime}>
                                seconds
                                             </Typography>
                              <Typography component="p" className={classes.countTime}>

                              </Typography>
                            </Grid>
                          </Grid>

                        </Paper>
                      </Grid>
                    </Grid>


                  ) : ''}


                  <Grid container direction="row" spacing={8}>
                    {orders.order.map((ord, indexORD) => {
                      return (
                        <Grid item md={6} xs={12} key={indexORD}>
                          <Grid container>
                            <Typography variant="h1" className={classes.productTitle}>
                              ORDER DETAIL
                                            </Typography>
                          </Grid>
                          <Grid container>
                            <Grid item md={12} xs={12}>
                              <Card>
                                <Grid container justify="space-between" alignItems="center" style={{ padding: 10 }}>
                                  <Typography>
                                    ID : {ord.id}
                                  </Typography>
                                  <Chip label={ord.status} />
                                </Grid>

                                <Divider />
                                <CardContent>
                                  <Typography className={classes.normalText}>
                                    {moment(ord.created_at).format("LLL")}
                                  </Typography>
                                  <Grid container direction="column" spacing={8} style={{ padding: "10px 0" }}>
                                    {typeof orders.order_payment !== "undefined" && orders.order_payment instanceof Array && orders.order_payment.length > 0
                                      ? (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography>
                                              Payment Method :
                                                                                     </Typography>
                                            <Typography>
                                              {orders.order_payment[0].payment_type.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>




                                      ) : ''}

                            

                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].bank && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography>
                                              Bank :
                                                                                     </Typography>
                                            <Typography>
                                              {orders.order_payment[0].bank.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}
                                    {typeof orders.order_resi !== "undefined"
                                      && orders.order_resi instanceof Array
                                      && orders.order_resi.length > 0
                                      && orders.order_resi[0].kodeResi

                                      ? (
                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography style={{ fontWeight: "bold" }}>
                                              No Resi	:
                                                                                     </Typography>
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_resi[0].kodeResi}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>
                                      ) : ''}

                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].card_type && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography>
                                              Card Type :
                                                                                     </Typography>
                                            <Typography>
                                              {orders.order_payment[0].card_type.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}
                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].store && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography>
                                              Store :
                                                                                     </Typography>
                                            <Typography>
                                              {orders.order_payment[0].store.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}

                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].masked_card && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography>
                                              Card :
                                                                                     </Typography>
                                            <Typography>
                                              {orders.order_payment[0].masked_card.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}


                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      (orders.order_payment[0].va_number || orders.order_payment[0].bill_key
                                      ) && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between" >
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_payment[0].payment_type === "bank_transfer_manual" ? 'Account Number:' : '   Virtual Number :'}


                                            </Typography>
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_payment[0].va_number ? orders.order_payment[0].va_number : orders.order_payment[0].bill_key}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>
                                      )}
                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].biller_code && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between" >
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_payment[0].payment_type === "bank_transfer_manual" ? 'A/N :' : 'Biller code :'}

                                            </Typography>
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_payment[0].biller_code}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}
                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].payment_code && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between" >
                                            <Typography style={{ fontWeight: "bold" }}>
                                              Payment Code:
                                                                                     </Typography>
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {orders.order_payment[0].payment_code.toUpperCase()}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}

                                    {typeof orders.order_payment !== "undefined" &&
                                      orders.order_payment instanceof Array &&
                                      orders.order_payment.length > 0 &&
                                      orders.order_payment[0].transaction_time && (

                                        <Grid item md={12}>
                                          <Grid container justify="space-between">
                                            <Typography style={{ fontWeight: "bold" }}>
                                              Expired date:
                                                                                     </Typography>
                                            <Typography style={{ fontWeight: "bold" }}>
                                              {getExpiredDate(orders.order_payment[0].transaction_time)}
                                            </Typography>
                                          </Grid>
                                          <Divider />
                                        </Grid>

                                      )}
                                    <Grid item md={12}>
                                      <Grid container justify="space-between">
                                        <Typography>
                                          Sub Total :
                                                                        </Typography>
                                        <Typography>
                                          {`IDR ${formatCurrency(orders.order_item.map((st, indexST) => st.price).reduce((a, b) =>{
                                            return a + b
                                          },0))}`}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Divider />
                                    <Grid item md={12}>
                                      <Grid container justify="space-between">
                                        <Typography>
                                          Shipping Fee:
                                                                        </Typography>
                                        <Typography>
                                          {`IDR ${formatCurrency(orders.order_shipment.map(sf => sf.cost))}`}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Divider />
                                    <Grid item md={12}>
                                      <Grid container justify="space-between">
                                        <Typography>
                                          Voucher Discount:
                                                                        </Typography>
                                        <Typography>
                                          {this.voucherCheck(orders.order_voucher)}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Divider />

                   
                                    <Grid item md={12}>
                                      <Grid container justify="space-between">
                                        <Typography>
                                          Total:
                                                                        </Typography>
                                        <Typography>
                                          {`IDR ${formatCurrency(
                                            this.addVoucherToTotal(
                                              parseInt(orders.order_shipment.map(sf => sf.cost)) + orders.order_item.map((st, indexST) => st.price).reduce((a, b) =>{
                                                return a + b
                                              },0), 
                                            orders.order_voucher))
                                            }`}
                                        </Typography>
                                      </Grid>
                                    </Grid>

                            
                                    {typeof orders.order_payment !== "undefined"
                                      && orders.order_payment instanceof Array
                                      && orders.order_payment.length > 0
                                      && orders.order_payment[0].pdf_url
                                      ? (
                                        <Grid item md={12}>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => window.open(`${orders.order_payment[0].pdf_url}`, '_blank')}
                                            fullWidth
                                          >
                                            Payment Step-by-step
                                                                                </Button>
                                        </Grid>
                                      ) : ''}
                                     

                                    {typeof orders.order_payment !== "undefined"
                                      && orders.order_payment instanceof Array
                                      && orders.order_payment.length > 0
                                      ? (
                                        <Grid item md={12}>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handlerOpenInvoice}
                                            fullWidth
                                          >
                                            INVOICE
                                          </Button>
                                        </Grid>
                                      ) : ''}
                                  </Grid>



                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Grid>
                      )
                    })}



                    <Grid item md={6} xs={12}>
                      <Grid container>
                        <Typography variant="h1" className={classes.productTitle}>
                          Shipping
                                            </Typography>
                      </Grid>
                      <Grid container>
                        <Grid item md={12} xs={12}>
                          {orders
                            .order_billing
                            .map((ob, indexOB) => {
                              return (
                                <Card key={indexOB}>
                                  <Grid container justify="space-between" alignItems="center" style={{ padding: 10 }}>
                                    <Typography style={{ textTransform: "uppercase" }} className={classes.normalText}>
                                      Name :{ob.fullname} 
                                    </Typography>
                                    <Chip label={ob.phone_number} />
                                  </Grid>
                                  <Divider />
                                  <CardContent>

                                    <Grid container direction="row" spacing={8}>

                                      <Grid item md={6}>
                                        <Typography className={classes.normalText}>
                                          Address :
                                        </Typography>
                                        <Typography >
                                          {ob.province}
                                        </Typography>
                                        <Typography>
                                          {ob.regency}
                                        </Typography>
                                        <Typography>
                                          {ob.district}
                                        </Typography>
                                        <Typography>
                                          {ob.village}
                                        </Typography>
                                        <Typography>
                                          {ob.postcode}
                                        </Typography>
                                        <Typography>
                                          {ob.address}
                                        </Typography>


                                      </Grid>
                                      <Grid item md={6}>
                                        <Typography className={classes.normalText}>
                                          Shipment :
                                                                                </Typography>
                                        {orders.order_shipment.map((os, indexOS) => {
                                          return (
                                            <div key={indexOS}>
                                              <Typography>
                                                Courier :{os.courier}
                                              </Typography>
                                              <Typography>
                                                Description :{os.description}
                                              </Typography>
                                              <Typography>
                                                Estimated Time Arrival :{os.etd} days
                                                                            </Typography>
                                              <Typography>
                                                Service :{os.service}
                                              </Typography>
                                            </div>

                                          )
                                        })}


                                      </Grid>
                                    </Grid>

                                  </CardContent>
                                </Card>

                              )
                            })}
                        </Grid>
                        {typeof orders.order_confirm !== "undefined"
                          && orders.order_confirm instanceof Array
                          && orders.order_confirm.length > 0
                          && (
                            <Grid item md={12} xs={12} style={{ margin: '10px 0' }}>
                            <Grid container>
                              <Typography variant="h1" className={classes.productTitle}>
                                CONFIRM PAYMENT
                                            </Typography>
                            </Grid>
                              <Card >

                                {/* <Grid container style={{ padding: 10 }}>
                                  <Typography variant="h1" className={classes.productTitle}>
                                    CONFIRM PAYMENT
                                                                    </Typography>
                                </Grid>
                                <Divider /> */}
                                <CardContent>
                                  <Grid container direction="row" spacing={8}>
                                    <Grid item md={6} xs={12}>
                                      <Typography >
                                        Nama Pemilik Rek : {orders.order_confirm[0].name.toUpperCase()}
                                      </Typography>
                                      <Typography >
                                        Bank : {orders.order_confirm[0].bank.toUpperCase()}
                                      </Typography>
                                      <Typography>
                                        Nominal Transfer : IDR {formatCurrency(orders.order_confirm[0].nominal_transfer)}
                                      </Typography>

                                      <Button fullWidth style={{
                                      background:"#f4f4f4",
                                      color:"#666",
                                      margin:"10px 0",
                                      padding:10,
                                      display:"flex",
                                      alignItems:"center"
                                      }}>  
                                      <span>Bukti Transfer</span> <CloudDownloadIcon style={{
                                        margin:"0px 10px"
                                          }}/>
                                      </Button>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                      <Typography style={{ textTransform: "uppercase", fontWeight: "bold" }} >
                                        Note :
                                                                            </Typography>
                                      <Typography>
                                        {orders.order_confirm[0].note}
                                      </Typography>
                                    </Grid>
                                  </Grid>




                                </CardContent>
                              </Card>


                            </Grid>
                          )}  
                      </Grid>
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <Grid container>
                        <Typography variant="h1" className={classes.productTitle}>
                          PRODUCT ORDERED
                                            </Typography>
                      </Grid>
                      <Grid container direction="row" spacing={8}>
                        {orders
                          .order_item
                          .map((oi, indexOI) => { //dummy data
                            return (
                              <Grid item key={indexOI} md={6}>
                                <Card >
                                  <CardContent>
                                    <Grid container direction="row" spacing={16}>
                                      <Grid item xs={4}>
                                        <img
                                          src={oi.link}
                                          alt={oi.alt}
                                          style={{
                                            width: "100%"
                                          }} />
                                      </Grid>
                                      <Grid item xs={8}>
                                        <Typography variant="h1" className={classes.productTitle}>
                                          {oi.product_name}
                                        </Typography>
                                        <Typography variant="h1" className={classes.productType}>
                                          {oi.category_type}
                                        </Typography>

                                        <div className={classes.quantityWrapper}></div>
                                        <div>
                                          <Grid container direction="row">
                                            <Grid item md={3}>
                                              <Typography className={classes.normalText}>
                                                Quantity
                                                                                        </Typography>
                                              <Typography className={classes.normalText}>
                                                Size
                                                                                        </Typography>
                                              <Typography className={classes.normalText}>
                                                Total
                                                                                        </Typography>

                                            </Grid>
                                            <Grid item md={6}>
                                              <Typography className={classes.normalText}>
                                                : {oi.quantity}
                                              </Typography>
                                              <Typography className={classes.normalText}>
                                                : {oi.size}
                                              </Typography>
                                              <Typography className={classes.normalText}>
                                                : IDR {formatCurrency(oi.price)}

                                              </Typography>

                                            </Grid>

                                          </Grid>
                                        </div>

                                      </Grid>

                                    </Grid>
                                  </CardContent>

                                </Card>

                              </Grid>
                            )
                          })}
                      </Grid>

                    </Grid>





                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )

    }
    if ((orders.order instanceof Array && orders.order.length === 0) || orders.loading) {
      return (
        <div>
          <p> PROCESSING..... </p>
        </div>
      )
    }

  }
}
OrderDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  getOrderById: PropTypes.func.isRequired,
  orders: PropTypes.object.isRequired,
  getInvoicePDF:PropTypes.func.isRequired
}

const mapStateToProps = state => ({  orders: state.orders });

export default compose(connect(mapStateToProps, { getOrderById, getInvoicePDF }), withStyles(styles, { name: "OrderDetail" }))(withRouter(OrderDetail));
