import React from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import FilterComponent from './filter';
const toolbarStyles = theme => ({

    highlight: theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
        },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    },
    paperSearchBar: {
        padding: '0px 5px',
        display: 'flex',
        alignItems: 'center',
  
        boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -" +
                "1px rgba(0,0,0,0.12)"
        // border:"0.5px solid #c4cdd5"
    },
    input: {
        marginLeft: 8,
        flex: 1
    },
    iconButton: {
        padding: 10
    },
    divider: {
        width: 1,
        height:40,
      
    },
    buttonFilter: {
        padding: "5px",
        fontSize: " 0.875rem",
        textTransform: "none",
        fontWeight: 400
    },
    paperSelectedProduct:{
        display: 'flex',
        alignItems: 'center',
        border: "0.5px solid #c4cdd5"
    },
    dividerProductSelected:{
        width: 1,
        height:30,
        backgroundColor: "#c4cdd5"
    },
    textSelected:{
         background: "#f4f6f8",
        color:"#919eab",
        padding:"4px 8px",
    },
    p8:{
        padding: "4px 8px"
    },
    buttonSelected:{
        fontSize:" 0.875rem",
        padding: "4px 8px",
        textTransform: "none",
        fontWeight:400,
       
    },
    menuListText:{
        fontSize: " 0.875rem",
    }
});


const TableToolbarProducts = (props) => {
   
    const { numSelected, classes, 
        handlerClickPopover, 
        anchorEl, 
        handlerClosePopover, 
        handlerOpenCollection, 
        open, 
        handlerDeleteSelectedOrder, 
        handlerChangeStatus,
        searchText,
        onSubmitSearch,
        onChangeSearch,
        onSubmitSearchEnter,
        handlerChangeResi,
        tabs
           
    } = props;
    return (
        <Toolbar
            className={classes.root}>
            <Grid container direction="column" spacing={8}>
                <Grid item md={12}>
                    <div style={{
                        margin: "10px 0"
                    }}>
                        <Paper className={classes.paperSearchBar} elevation={0} square={true}>
                            {/* <Tooltip title="Filter list">
                                <div >
                                    <Button className={classes.buttonFilter} onClick={handlerOpenFilter}>
                                        Filter
                                    <FilterListIcon
                                            style={{
                                                margin: "0 10px"
                                            }} />
                                    </Button>
                                 
                                </div>
                            
                            </Tooltip>
                       

                            <Divider className={classes.divider}/> */}
                            <IconButton 
                             onClick={onSubmitSearch}
                            className={classes.iconButton}
                             aria-label="Search">
                                <SearchIcon/>
                            </IconButton>
                            <InputBase className={classes.input}
                                value={searchText}
                                onChange={onChangeSearch}
                                onKeyDown={onSubmitSearchEnter}
                            placeholder="Search order"
                            />
                        </Paper>
                    </div>
                </Grid>
             
                {numSelected > 0 ? 
                    (<Grid container>
                        <div style={{
                            marginBottom: "5px"
                        }}>
                            <Paper className={classes.paperSelectedProduct} elevation={0} >
                                <Button className={classes.buttonSelected} style={{ borderRight:"1px solid #c4cdd5"}}  disabled color="primary">
                                    {numSelected} Order selected
                               </Button>
                         
                      
                       
                                <Button className={classes.buttonSelected}
                                    aria-owns={open ? 'render-props-popover' : undefined}
                                    aria-haspopup="true"
                                    onClick={handlerClickPopover}>
                                    Actions <ArrowDropDownIcon style={{
                                        margin: "0 5px"
                                    }}/>
                                </Button >
                                <Popover
                                    id="render-props-popover"
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handlerClosePopover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <MenuList>
                                        <MenuItem divider onClick={handlerDeleteSelectedOrder} className={classes.menuListText}>Delete selected order</MenuItem>
                                    
                                        <MenuItem divider onClick={handlerChangeStatus} className={classes.menuListText}>Change order status</MenuItem>
                                 
                                        {tabs === 'completed' && (
                                          
                                            <MenuItem  onClick={handlerChangeResi} className={classes.menuListText}>Add/Edit  Resi</MenuItem>

                                        )}
                                      </MenuList>
                                   
                                </Popover>
                                {/* <IconButton className={classes.iconButton} aria-label="Search">
                                    <SearchIcon />
                                </IconButton>
                                <InputBase className={classes.input} placeholder="Search products" /> */}
                            </Paper>
                        </div>
                    </Grid>)
                :''}
                <Grid container >
                    <ul style={{
                        width: "100%",
                        fontSize: 12
                    }}>
                        Note :
                        <li>
                            Tambah/Edit No Resi di menu <i> Complete </i> 
                        </li>
                        <li>
                            Cek kembali di dashboard Midtrans
                        </li>
                    </ul>

                </Grid>
            </Grid>

        </Toolbar>
    )
}

TableToolbarProducts.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(TableToolbarProducts);
