import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CardActions from '@material-ui/core/CardActions';
import {Link} from 'react-router-dom';

import {  getSliderHome } from '../../../actions/uiActions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class HomeSlider extends Component {

    componentDidMount(){
        this.props.getSliderHome();
    }
    handlerOnLoad = (e)=>{
        console.log(e.nativeEvent);
    }
  
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplaySpeed: 2000,
            autoplay: true,

        };
    return (
        <div>
            <Grid >
                <Grid item xs={12}>
                    <Card>
                        <CardHeader 
                            subheader="HOME SLIDER"
                        />
                        <Divider/>
                        <CardContent >
                            {this.props.UI.home_image && this.props.UI.home_image.image_desktop && this.props.UI.home_image.image_mobile  && (

                          
                            <Grid container direction="column" spacing={16}>  
                                <Grid item md={12}>
                            <Card> 
                                <CardHeader
                                    subheader="DESKTOP SLIDER"
                                />
                                <CardContent>
                                    <div style={{ maxWidth: "75vw" }}>
                                        <Slider {...settings}>
                                            {this.props.UI.home_image.image_desktop.map((h, i) => {
                                                return (
                                                    <div key={i}>

                                                        <img src={h.link} style={{ width: '100%' }} alt="" />
                                                    </div>
                                                )
                                            })}

                                        </Slider>


                                    </div>
                                </CardContent>
                            </Card>


                                </Grid>


                                <Grid item md={12}>
                                    <Card>
                                        <CardHeader
                                            subheader="MOBILE SLIDER"
                                        />
                                        <CardContent>
                                            <div style={{ maxWidth: "75vw",maxHeight:"40vh" }}>
                                                <Slider {...settings}>
                                                    {this.props.UI.home_image.image_mobile.map((h, i) => {
                                                        return (
                                                            <div key={i}>

                                                                <img src={h.link} style={{ maxWidth: '100%', maxHeight: "40vh" }} alt="" />
                                                            </div>
                                                        )
                                                    })}

                                                </Slider>


                                            </div>
                                        </CardContent>
                                    </Card>


                                </Grid>
                            </Grid>
                            )}
                         
                       
                            
                         

                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/home-slider/edit" variant="contained" color="primary">
                                EDIT SLIDER
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
         
            </Grid>
        </div>
    
    )
  }
}

HomeSlider.propTypes={
    UI:PropTypes.object.isRequired
}

const mapStateToProps = (state)=>({
    UI:state.UI
})

export default connect(mapStateToProps,{getSliderHome})(HomeSlider);
