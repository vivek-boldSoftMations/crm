import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomButton } from "../../../Components/CustomButton";
import CustomerServices from "../../../services/CustomerService";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const BulkCustomerAssign = (props) => {
  const { setOpenPopup, setOpenSnackbar } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [touchedAssignFrom, setTouchedAssignFrom] = useState(false);
  const [touchedAssignTo, setTouchedAssignTo] = useState(false);

  useEffect(() => {
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const AssignBulkLead = async (e) => {
    try {
      setOpen(true);
      e.preventDefault();
      const req = {
        assign_from: assignFrom,
        assign_to: assignTo,
      };
      await CustomerServices.BulkCustomerAssign(req);
      setOpenPopup(false);
      setOpen(false);
      // Show success snackbar
      setOpenSnackbar(true);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  const getErrorMessage = (fieldValue, otherFieldValue, fieldTouched) => {
    if (!fieldValue && fieldTouched) {
      return "Field cannot be empty";
    } else if (fieldValue === otherFieldValue) {
      return "Assign From will not be the same as Assign To";
    }
    return "";
  };

  return (
    <>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={AssignBulkLead}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={assignFrom} // Ensure you are managing state for assignFrom
              onChange={(event, value) => {
                setAssignFrom(value);
                if (!touchedAssignFrom) setTouchedAssignFrom(true);
              }}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              label="Assign From"
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign From"
                  error={
                    touchedAssignFrom &&
                    (assignFrom === assignTo || !assignFrom)
                  }
                  helperText={getErrorMessage(
                    assignFrom,
                    assignTo,
                    touchedAssignFrom
                  )}
                  onBlur={() => setTouchedAssignFrom(true)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={assignTo} // Ensure you have a state variable for assignTo
              onChange={(event, value) => {
                setAssignTo(value);
                if (!touchedAssignTo) setTouchedAssignTo(true);
              }}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              label="Assign To"
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign To"
                  error={
                    touchedAssignTo && (assignFrom === assignTo || !assignTo)
                  }
                  helperText={getErrorMessage(
                    assignTo,
                    assignFrom,
                    touchedAssignTo
                  )}
                  onBlur={() => setTouchedAssignTo(true)}
                />
              )}
            />
          </Grid>
        </Grid>
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          text={"Assign"}
        />
      </Box>
    </>
  );
};
