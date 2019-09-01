import React, { Component } from 'react'
import {
    Button,
    Typography
} from '@material-ui/core';
import axios from 'axios';
 class Instagram extends Component {
     handlerClickActivation = ()=>{
        axios.post('/api/instagram/activation').then(ress=>{
            window.open(ress.data);
        });
     }
    render() {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handlerClickActivation}>    
                   GENERATE ACTIVATION
                </Button>
                <Typography style={{padding:10}}>TEKAN TOMBOL INI APABILA INSTAGRAM TOKEN EXPIRED</Typography>
            </div>
        )
    }
}

export default Instagram
