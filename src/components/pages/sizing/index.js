import React, { Component } from 'react'
import styles from './styles';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import {getAllSize} from '../../../actions/sizingActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
class Sizing extends Component {
  componentDidMount(){
    this.props.getAllSize();
  }
  render() {
      const {classes,sizings}= this.props;
    return (
      <div>
            <Grid container direction="column">
                <Grid item md={12}>
                    <Button color="primary" component={Link} to="/sizing/create" variant="contained" style={{ marginBottom: "10px" }}>
                        CREATE SIZE CHART
                  </Button>
                </Grid>
                <Grid item md={12}>
                    <Card>
                      <CardHeader
                        subheader="SIZE CHART"
                      />
                      <Divider/>
                        <CardContent>
                          <Grid container direction="row" spacing={16}>
                  {sizings.sizing.map((s, i) => {
                    return (
                        <Grid item md={3} key={i}>
                        <Card>
                          <CardHeader
                            subheader={s.name}
                          />
                          <Divider/>
                          <CardActionArea component={Link} to={`/sizing/edit/${s.id}`}>
                              <img src={s.link} style={{width:"100%"}}  alt={s.alt}/>
                          </CardActionArea>
                        
                        </Card>
                        </Grid>
                    )
                  })}
                          </Grid>
                     
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
      </div>
    )
  }
}

Sizing.propType = {
    classes: PropTypes.object.isRequired,
    getAllSize:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    vouchers: state.vouchers,
    sizings:state.sizings
})


export default compose(connect(mapStateToProps, { getAllSize}), withStyles(styles))
    (Sizing);

