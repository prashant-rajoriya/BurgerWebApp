import React from 'react';
import classes from './DrawerToggle.css';

const drawerToggle = (props) => (
  <React.Fragment >
    <div className={classes.DrawerToggle} onClick={props.clicked}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </React.Fragment>
)

export default drawerToggle;