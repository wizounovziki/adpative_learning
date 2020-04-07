import React, {useState, useEffect, useRef } from 'react'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import SideBarRealTime from "./SideBarRealTime";

//Timer hook
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    if(delay !== null) {
      let id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay])
}

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1,
      textAlign : 'center'
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    toolBarStyle : {
      backgroundColor : '6540d4'
    },
    appBar: {
      // backgroundColor: theme.palette.secondary.main,
      backgroundColor: "white",
      borderRadius: "0 !important",
      boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important",
      zIndex: 1,
      // transition: theme.transitions.create(["width", "margin"], {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen
      // })
    },
    iconButton : {
      backgroundColor : 'white'
  },
  }));

function NavBarRealTime(props) {
    const classes = useStyles();
  
    const [time, setTime] = useState(new Date().toLocaleString());
    const [openDrawer, setOpenDrawer] = useState(false);
  
  // useInterval(() => {
  //   setTime(new Date().toLocaleString());
  // }, 1000)
  
    const handleDrawer = () => {
      setOpenDrawer(!openDrawer);
    };
  
    return (
      <div className={classes.root} >
        <AppBar position="static">
          <Toolbar className = {classes.toolBarStyle}>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={handleDrawer}
            >
              <MenuIcon />
            </IconButton>
            {/* will be dynamic value */}
            <Typography>Subject : Math 101</Typography>
            {/* will be dynamic value */}
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Class P1
            </Typography>
            {/* <Typography>{time}</Typography> */}
            <IconButton className ={classes.iconButton} >
              <AccountCircleIcon/>
          </IconButton>
          </Toolbar>
        </AppBar>
        
        <SideBarRealTime
        openDrawer={openDrawer} 
        setOpenDrawer={setOpenDrawer} />
  
      </div>
    )
}

export default NavBarRealTime
