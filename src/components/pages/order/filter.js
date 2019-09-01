import React from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';
import styles from './styles';
import { Button } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList'
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const filterSort = [
    { value: 1, name:'Awaiting Payment	'},
    { value: 2, name:'Cancelled'},
    { value: 3, name:"Pending Payment"},
    { value: 4, name:"On Progress"},
    { value: 5, name:"Completed"},
    { value: 6, name:"Cancelled by admin"}
];

const filter = props => {
 
    const { classes, openFilter, selectSort, handlerSelectSort} = props;
  return (
      <form autoComplete="off">
      <FormControl className={classes.formControl}>
         
          <InputLabel htmlFor="select-multiple-checkbox">FILTER</InputLabel>
          <Select
              multiple
              value={selectSort}
                  inputProps={{
                      id: 'select-multiple-native',
                  }}
              onChange={handlerSelectSort}
              renderValue={selected =>{
                  if (selected.length === 0) {
                      return <em>Placeholder</em>;
                  }
                  if(selected.length > 0){
                     return  selected.map(d=>{
                         return d.name
                      }).join(', ');
                  }
             
              }}
         
          >

              {filterSort.map(f => (
                  <MenuItem key={f.value} value={f} >
                      <Checkbox checked={selectSort.filter(sf=>sf.value === f.value).length >0} />
                      <ListItemText primary={f.name} />
                  </MenuItem>
              ))}
          </Select>
      </FormControl>
      </form>

  )
}

filter.propTypes = {
    classes:PropTypes.object.isRequired
}

export default withStyles(styles)(filter);
