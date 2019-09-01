import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
 class PDF extends Component {
  render() {
    return (
      <div>
            <Dialog fullScreen open={true}>

                <Grid container justify="center" alignItems="center" direction="column" style={{ height: "100%" }}>

                    <CircularProgress  />
                    <Typography  style={{ margin: "20px 0" }}>Please wait Loading..</Typography>
                </Grid>

            </Dialog>
      </div>
    )
  }
}
export default (PDF)