import React, { useEffect, useState } from "react";
import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { Popup } from "../../Components/Popup";
import { UserProfileCreate } from "./UserProfile/UserProfileCreate";
import UserProfileService from "../../services/UserProfileService";
import { getAllProfileUser, getProfileUser } from "../../Redux/Action/Action";

export const Profile = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setOpen(true);
      const response = await UserProfileService.getProfile();
      setUserData(response.data);
      getUserProfileData(response.data.emp_id);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  const getUserProfileData = async (ID) => {
    try {
      console.log("ID", ID);
      const response = await UserProfileService.getUserProfileDataById(ID);
      dispatch(getAllProfileUser(response.data));
    } catch (err) {
      console.log("error profile", err);
    }
  };

  return (
    <Grid sx={{ marginTop: "5em" }}>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            {/* <AccountCircleOutlinedIcon /> */}
          </Avatar>
          <h2>User Profile</h2>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Text>
              ID :- <span>{userData.emp_id}</span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            <Text>
              Name :-{" "}
              <span>
                {userData.first_name} &nbsp;
                {userData.last_name}
              </span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            <Text>
              Email :- <span>{userData.email}</span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            <Text>
              Staff :- <span>{userData.groups}</span>
            </Text>
          </Grid>
          {!userData.is_created && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenPopup(true)}
              >
                Complete Profile
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
      <Popup
        fullScreen={true}
        title={"Create User Profile"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserProfileCreate setOpenPopup={setOpenPopup} getUsers={getUsers} />
      </Popup>
    </Grid>
  );
};

const paperStyle = {
  padding: 20,
  height: "50vh",
  width: 340,
  margin: "0 auto",
};
const avatarStyle = { backgroundColor: "#1bbd7e" };
const Text = styled(Typography)(() => ({
  padding: "0px",
}));
