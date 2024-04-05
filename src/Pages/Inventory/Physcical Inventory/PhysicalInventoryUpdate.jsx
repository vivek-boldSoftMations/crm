import React, { memo, useCallback, useState } from "react";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Box, Button, Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import InventoryServices from "../../../services/InventoryService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const PhysicalInventoryUpdate = memo((props) => {
  const {
    selectedRowData,
    pageCount,
    searchQuery,
    setOpenPopup,
    getPhysicalInventoryData,
  } = props;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(selectedRowData);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const updatePhysicalInventory = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const payload = {
          type: formData.type,
          gnl: formData.gnl,
          add_or_remove_qty: formData.add_or_remove_qty,
          reason: formData.reason,
        };
        if (selectedRowData) {
          const response = await InventoryServices.updatePhysical(
            formData.id,
            payload
          );
          const successMessage =
            response.data.message || "Physical Inventory updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getPhysicalInventoryData(pageCount, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [formData, pageCount, searchQuery]
  );

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={updatePhysicalInventory}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Product"
              variant="outlined"
              value={formData.product || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Add/Remove Quantity"
              variant="outlined"
              value={formData.add_or_remove_qty || ""}
              onChange={(event) =>
                handleInputChange("add_or_remove_qty", event.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              value={formData.gnl || ""}
              options={GNL_OPTIONS}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleInputChange("gnl", value)}
              label="Gain/Loss"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              label="Reason"
              variant="outlined"
              value={formData.reason || ""}
              onChange={(event) =>
                handleInputChange("reason", event.target.value)
              }
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </>
  );
});

const GNL_OPTIONS = ["Gain", "Loss"];
