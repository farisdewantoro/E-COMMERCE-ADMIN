import React, { Component } from 'react'
import {
    Typography,
    FormControlLabel,
    Switch,
    CircularProgress 
} from '@material-ui/core';
import axios from 'axios';
class Mode extends Component {
    state={
        mode:{
            active:true,
            key: "",
            api: ''
        },
        loading:false
    }
    async componentDidMount(){
      try{
          const mode = await axios.get('/api/mode/get/status');
          this.setState({
              mode: mode.data
          })
      }catch(err){
          console.log(err);
      }
    }
    handleChange = async (e) => {
        try{
            
        const mode = this.state.mode;
        this.setState({
            loading: true
        });
        const new_mode =  await axios.post('/api/mode/change/status',mode);
        if(new_mode){
            this.setState({
                mode: new_mode.data,
                loading: false
            });
        }

        }
        catch(err){
            console.log(err);
            this.setState({
                loading: false
            });
        }
     };
    render() {
  
        const {mode,loading} =this.state; 
        return (
            <div style={{
                display:'flex'
            }}>
                {mode.key ? (
                    <FormControlLabel
                        control={
                            <Switch checked={mode.active} disabled={loading} onChange={this.handleChange} value={!mode.active} />
                        }
                        label={<Typography variant="h4">
                            {loading ? (
                                `PLEASE WAIT.....`
                            ) : (
                                    `CLIENT SERVER STATUS IS ${mode.active ? 'ON' : 'MAINTENANCE'}`
                                )}

                        </Typography>}
                    />
                ) :(
                    <CircularProgress />

                ) }
          
            </div>
        )
    }
}


export default (Mode)
