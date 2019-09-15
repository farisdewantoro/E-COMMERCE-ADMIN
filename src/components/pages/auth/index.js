import React, {Component} from 'react'
import {withStyles} from '@material-ui/core';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import styles from './styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import loginImg from '../../../img/loginImg.jpg';
import hammerLogin from '../../../img/hammer.png';
import logoHammer from '../../../img/logo2.png';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {setAuthAdmin} from '../../../actions/authActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#fafafa',
            main: '#212121',
            dark: '#616161',
            contrastText: '#fff'
        }
    },
    typography: {
        useNextVariants: true
    }
});
class Auth extends Component {
    state={
        admin:{
            username:"admin",
            password:"admin"
        }
    }
     onChangeAuth = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState=>({
            admin:{
                ...prevState.admin,
                [name]:value
            }
        }))
     }
    handlerSubmitLogin=()=>{
      
            this.props.setAuthAdmin(this.state.admin);
    
    }
    render() {
      
        const {classes,errors,auths} = this.props;
        const { loading } = auths;
        const {username,password} = this.state.admin;
        return (
            <div className={classes.wrapperLogin}>
                <MuiThemeProvider theme={theme}>
                    <Grid container justify="center">
                        <Grid item md={6} xs={12}>
                            <Grid
                                justify="center"
                                direction="row"
                                style={{
                                marginTop: '10%'
                            }}>
                            
                                <Card className={classes.card}>
                           
                                    <div className={classes.details}>
                                       {loading ? <LinearProgress variant="query" color="primary" />:''}
                                        <CardContent className={classes.content}>
                                        
                                            <Grid container justify="center">
                                                <img
                                                    src={logoHammer}
                                                    style={{
                                                    maxHeight: 150
                                                }}
                                                    alt=""/>
                                            </Grid>
                                            <Grid container>
                                                <TextField
                                                    label="Username"
                                                    name="username"
                                                    value={username}
                                                    onChange={this.onChangeAuth}
                                                    fullWidth
                                                    error={typeof errors.message !== "undefined" ? true : false}
                                                    margin="normal"/>
                                            </Grid>
                                            <Grid container>
                                                <TextField
                                                    label="Password"
                                                    name="password"
                                                    value={password}
                                                    error={typeof errors.message !== "undefined" ? true : false}
                                                    onChange={this.onChangeAuth}
                                                    type="password"
                                                    fullWidth
                                                    margin="normal"/>
                                            </Grid>
                          

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{
                                                marginTop: 20
                                            }}
                                                disabled={loading}
                                            onClick={this.handlerSubmitLogin}
                                                fullWidth>
                                                Sign In
                                            </Button>
                                        </CardContent>
                                    </div>
                                    <CardMedia
                                        className={classes.cover}
                                        image={loginImg}
                                        title="Live from space album cover"/>
                                </Card>
                            </Grid>

                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </div>
        )
    }
}
Auth.propTypes = {
    classes: PropTypes.object.isRequired,
    auths: PropTypes.object.isRequired,
    setAuthAdmin:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auths: state.auths,
    errors:state.errors
})
export default compose(withStyles(styles), connect(mapStateToProps, { setAuthAdmin}))(Auth);
