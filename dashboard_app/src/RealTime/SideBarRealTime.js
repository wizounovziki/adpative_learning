import React,{useState, useRef}from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InfoIcon from "@material-ui/icons/Info";
import DescriptionIcon from "@material-ui/icons/Description";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HomeIcon from '@material-ui/icons/Home';


import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import { useHistory } from "react-router-dom";


const drawerWidth = 250;

const useStyles = makeStyles({
    active: {
      backgroundColor: "#83a4d4 !important"
    },
    list: {
      width: 250
      // backgroundColor:'#83a4d4'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: "#83a4d4"
    }
  });

function SideBarRealTime({openDrawer, setOpenDrawer}) { 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const classes = useStyles();
  const history = useHistory();

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const onClickListItem = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        handleCloseDrawer();
        setSelectedIndex(0);
        console.log("Home");
        history.push("/");
        break;
      case 1:
        handleCloseDrawer();
        setSelectedIndex(1);
        console.log("Monitor");
        history.push("/monitor"); // change to spotlight router
        break;
     
      default:
        console.log("Nothing");
    }
  };


  const sideList = (
    <div className={classes.list}>
      <List>
        <ListItem
          button
          classes={{ selected: classes.active }}
          selected={selectedIndex === 0}
          onClick={() => onClickListItem(0)}
        >
          <ListItemIcon>
           <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          classes={{ selected: classes.active }}
          selected={selectedIndex === 1}
          onClick={() => onClickListItem(1)}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Spotlight" />
        </ListItem>

      </List>
    </div>
  );

  return (
    <nav>
      <Drawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        className={{ paper: classes.drawer }}
      >
        {sideList}
      </Drawer>
    </nav>
  );
}

export default SideBarRealTime
