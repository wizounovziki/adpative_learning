import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InfoIcon from "@material-ui/icons/Info";
import DescriptionIcon from "@material-ui/icons/Description";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import axios from "axios";

import { useHistory, Link } from "react-router-dom";

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
  },
  menuList: {
    width: 70,
    textAlign: "center"
  }
});

function SideBar({ openDrawer, setOpenDrawer }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [listOfQuiz, setListOfQuiz] = useState([]);

  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`/quiz_details/0`)
      .then(response => {
        console.log("Retrieved all quiz", response.data);
        let keys = [];
        response.data.forEach(e => {
          keys.push(Object.keys(e).join(""));
        });
        setListOfQuiz(keys);
      })
      .catch(err => console.log("Error in fetching data", err));
  }, []);

  //To search for list of quiz
  // let myarr = [];
  // listOfQuiz.map((e, idx) => {
  //   myarr.push(Object.keys(e));
  // });
  // console.log("Object Keys in Side Bar", myarr);

  // let list =
  //   listOfQuiz.length > 0 &&
  //   myarr.reduce((result, arr) => {
  //     return result.concat(arr);
  //   });

  // console.log("List Of Quiz in Side Bar", list);

  //Using data from API call
  // let quizList = listOfQuiz.length > 0 && listOfQuiz.map((e,idx)=> {
  //   return Object.keys(e)
  // })

  // console.log("List Of Quiz", quizList)

  // let list = listOfQuiz.length > 0 && quizList.reduce((result, arr)=> {
  //   return result.concat(arr)
  // })

  // console.log("List", list)

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const onClickQuiz = id => {
    setSelectedIndex(1);
    handleCloseDrawer();
    history.push(`/summary/quiz/${id}`);
  };

  const onClickListItem = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        handleCloseDrawer();
        setSelectedIndex(0);
        console.log("Home");
        history.push("/mainhome");
        break;
      case 1:
        handleCloseDrawer();
        setSelectedIndex(1);
        console.log("Summary");
        history.push("/summary");
        break;
      case 2:
        setSelectedIndex(2);
        console.log("Quiz");
        break;
      case 3:
        handleCloseDrawer();
        setSelectedIndex(3);
        console.log("Individual");
        history.push("/summary/individual");
        break;
      default:
        console.log("Nothing");
    }
  };

  const handleToggleQuizOption = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
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
            <HomeIcon />
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
          <ListItemText primary="Summary" />
        </ListItem>

        <ListItem
          button
          classes={{ selected: classes.active }}
          selected={selectedIndex === 3}
          onClick={() => onClickListItem(3)}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Individual" />
        </ListItem>

        {/* {list.map((e, idx) => (
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={e} />
          </ListItem>)
        )} */}

        <ListItem
          button
          classes={{ selected: classes.active }}
          selected={selectedIndex === 2}
          onClick={() => {
            handleToggleQuizOption();
          }}
          ref={anchorRef}
        >
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "center top"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow">
                      {listOfQuiz.length > 0 &&
                        listOfQuiz.map((e, idx) => {
                          return (
                            <ClickAwayListener onClickAway={handleClose}>
                              <MenuList
                                className={classes.menuList}
                                /* to={`/summary/quiz/${e}`} */
                                onClick={() => onClickQuiz(e)}
                                key={idx}
                                value={e}
                              >
                                {e}
                              </MenuList>
                            </ClickAwayListener>
                          );
                        })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Quiz" />
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

export default SideBar;
