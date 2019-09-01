import React, { Component } from 'react'
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {
    Button,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Paper,
    InputBase,
    Tooltip,
    Divider,
    IconButton,
} from '@material-ui/core';
import styles from './styles';
import PropTypes from 'prop-types';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import { getAllUser, downloadCsvUser, downloadCsvUserPhone,downloadCsvUserPhoneEmail} from '../../../actions/userAction';
import qs from 'query-string';
import {withRouter} from 'react-router-dom';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
class User extends Component {
 state={
     searchText:'',
     current_page_state:1
 }
   handleChangePage = (no)=>{
        this.setState({
            current_page_state:no
        });
        let data = {
            search:this.state.searchText,
            page:no
        }
       for (const key in data) {
            if(!data[key]){
                delete data[key];
            }
        }
       let params = qs.stringify(data);
       
       this.props.history.push({
           pathname: '/user',
           search: params
       });
       this.props.getAllUser(params);
    }
    paginationContainer = () => {
        const {  perPage, total_page, results } = this.props.users.pagination;
        let current_page = this.state.current_page_state;
        
        let jarak = 2;
        const page = [];
        for (let index = 0; index < total_page; index++) {
            page.push(index + 1);
        }

        if (page.length === 0 && results > 0) {
            return (
                <Button variant='contained' color="primary" style={{ padding: 0, margin: 5, minWidth: 20, minHeight: 20 }}>
                    1
            </Button>
            )

        }
        if (page.length < 4) {
            return (
                <div>
                    {page.map((no, i) => {
                        return (
                            <Button
                                key={i}
                                variant={no === current_page ? 'contained' : 'outlined'}
                                color={no === current_page ? 'primary' : 'inherit'}
                                onClick={() => this.handleChangePage(no)}
                                style={{ padding: 0, margin: 5, minWidth: 20, minHeight: 20 }}>
                                {no}
                            </Button>
                        )
                    })}


                </div>
            )
        }

        if (page.length > 4) {
        
            return (
                <div style={{ display: "flex", alignItems: "baseline" }}>

                    <div>
                        <Button
                            disabled={page.filter(p => p < current_page).length === 0}
                            onClick={() => this.handleChangePage(current_page - 1)}
                            style={{ padding: 0, margin: 5, minWidth: 25, minHeight: 25 }}>
                           <KeyboardArrowLeft/>
                        </Button>
                    </div>

                    {page.slice(current_page - jarak, current_page - 1).map((no, i) => {
                        return (
                            <div key={i}>
                                <Button
                                    variant={no === current_page ? 'contained' : 'outlined'}
                                    style={{ padding: 0, margin: 5, minWidth: 22, minHeight: 22 }}
                                    color={no === current_page ? 'primary' : 'inherit'}
                                    onClick={() => this.handleChangePage(no)}
                                >
                                    {no}
                                </Button>
                            </div>

                        )
                    })}

                    {page.slice(current_page - 1, current_page + jarak).map((no, i) => {
                        return (
                            <div key={i}>
                                <Button

                                    variant={no === current_page ? 'contained' : 'outlined'}
                                    style={{ padding: 0, margin: 5, minWidth: 22, minHeight: 22 }}
                                    color={no === current_page ? 'primary' : 'inherit'}
                                    onClick={() => this.handleChangePage(no)}
                                >
                                    {no}
                                </Button>
                            </div>

                        )
                    })}
                    <div>
                        <Button
                            disabled={page.filter(p => p > total_page - 1).length === 0}
                            onClick={() => this.handleChangePage(current_page + 1)}
                            style={{ padding: 0, margin: 5, minWidth: 25, minHeight: 25 }}>
                            <KeyboardArrowRight
                             
                            />
                        </Button>
                    </div>

                </div>
            )
        }

        return;

    }
componentDidMount(){
    let params = this.props.location.search;
    let paramsToObject = qs.parse(params);
    if(paramsToObject.page){
        this.setState({
            current_page_state: parseInt(paramsToObject.page)
        })
    }
    if (paramsToObject.search){
        this.setState({
            searchText: paramsToObject.search
        })
    }

    this.props.getAllUser(params);
}
onChangeSearch = (e)=>{
    this.setState({
        searchText:e.target.value
    })
}

onSubmitDownload = () =>{
    this.props.downloadCsvUser();
}
    onSubmitDownloadEmailPhone = () => {
        this.props.downloadCsvUserPhoneEmail();
    }
    onSubmitDownloadPhone = () => {
        this.props.downloadCsvUserPhone();
    }
onSubmitSearch = (e) =>{
    e.preventDefault();
    let data={
        search: this.state.searchText
    }
    this.setState({
        current_page_state:1
    })
    let params = qs.stringify(data);
    this.props.history.push({
        pathname:'/user',
        search:params
    });
    this.props.getAllUser(params);
}

  render() {
      const {users,classes} = this.props;
      const { searchText} = this.state;
     
    return (
      <div>
        <Grid container direction="column" spacing={8}>
            <Grid item md={12}>
                <Button variant="contained" style={{margin:5}} color="primary" onClick={this.onSubmitDownload}>
                    Download USER DATA FULL
                </Button>
                    <Button variant="contained" style={{ margin: 5 }} color="primary" onClick={this.onSubmitDownloadEmailPhone}>
                   Download USER DATA EMAIL AND PHONE
                </Button>
                    <Button variant="contained" style={{ margin: 5 }} color="primary" onClick={this.onSubmitDownloadPhone}>
                        Download USER DATA PHONE
                </Button>
            </Grid>
        <Grid item md={12}>
                    <Paper className={classes.paperSearchBar} elevation={0} square={true}>
                   
                        <form onSubmit={this.onSubmitSearch}>
                        <IconButton
                            type="button"
                            className={classes.iconButton}
                            aria-label="Search">
                            <SearchIcon />
                        </IconButton>
                        <InputBase className={classes.input}
                            value={searchText}
                            onChange={this.onChangeSearch}
                            placeholder="Search User"
                            
                        />
                        </form>
                    </Paper>
        </Grid>
            <Grid item md={12}>
                <Grid container direction="column" spacing={8}>
                {users.user.map(u=>{
                    return(
                        <Grid item md={12} key={u.id}>
                            <Card>
                                <CardContent>
                                    <div className={classes.wrapperCard}>
                                        <div>
                                            <Typography>
                                                <strong>  Fullname :</strong>  {u.fullname}
                                            </Typography>
                                            <Typography>
                                                <strong>  Email :</strong>  {u.email}
                                            </Typography>
                                            <Typography>
                                                <strong> Phone Number </strong> {u.phone_number}
                                            </Typography>
                                            <Typography>
                                                <strong> Gender :</strong> {u.gender ? u.gender: 'none' }
                                            </Typography>
                                            <Typography>
                                                <strong>  Birthday : </strong> {u.birthday ? u.birthday: 'none' }
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography>
                                                <strong> Province :</strong> {u.province ? u.province: 'none' }
                                            </Typography>
                                            <Typography>
                                                <strong>  Regency : </strong> {u.regency ? u.regency: 'none' }
                                            </Typography>
                                            <Typography>
                                                <strong>  District :</strong>  {u.district ? u.district: 'none' }
                                            </Typography>
                                            <Typography>
                                                <strong> Village : </strong>{u.village ? u.village  : 'none' }
                                            </Typography>
                                            <Typography>
                                                <strong> Post Code : </strong> {u.postcode ? u.postcode: 'none' }
                                            </Typography>
                                       
                                        
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
                   
                </Grid>
            </Grid>

            <Grid item md={12}>
                <div style={{display:'flex',justifyContent:"flex-end"}}>
                            {this.paginationContainer()}
                        
                </div>
            </Grid>
        </Grid>
      </div>
    )
  }
}

User.propType={
    classes:PropTypes.object.isRequired,
    users:PropTypes.object.isRequired,
    getAllUser:PropTypes.func.isRequired, 
    downloadCsvUser:PropTypes.func.isRequired,
    downloadCsvUserPhone: PropTypes.func.isRequired, 
    downloadCsvUserPhoneEmail: PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    users:state.users
});



export default compose(connect(mapStateToProps, { getAllUser, downloadCsvUser, downloadCsvUserPhone, downloadCsvUserPhoneEmail }), withStyles(styles))(withRouter(User));