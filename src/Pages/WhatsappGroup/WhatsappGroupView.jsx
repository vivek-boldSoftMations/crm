import React, { useCallback, useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Button, Grid, Paper, Snackbar } from "@mui/material"; // Import Snackbar from Material-UI
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { DeleteWhatsappGroup } from "./DeleteWhatsappGroup";
import { Popup } from "../../Components/Popup";

export const WhatsappGroupView = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message

  useEffect(() => {
    getAllWhatsappGroup();
  }, [currentPage]);

  const getAllWhatsappGroup = useCallback(
    async (page = currentPage, searchValue = searchQuery) => {
      try {
        setOpen(true);
        const res = await CustomerServices.getAllWhatsappGroupData(
          page,
          searchValue
        );
        setWhatsappGroupData(res.data.results);
        setPageCount(Math.ceil(res.data.count / 25));
      } catch (err) {
        console.error(err);
      } finally {
        getAllWhatsappGroup();
        setOpen(false);
      }
    },
    [searchQuery]
  );

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id) => {
    setSelectedRow(id);
    setDeletePopupOpen(true);
  };

  const onDeleteSuccess = async (deletedId) => {
    setWhatsappGroupData((prevData) =>
      prevData.filter((row) => row.whatsapp_group_id !== deletedId)
    );
    setSnackbarMessage("Group deleted successfully");
    setSnackbarOpen(true);
  };

  const closeDeletePopup = () => {
    setDeletePopupOpen(false);
  };

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        whatsapp_group_id: row.id,
        name: row.name,
        whatsapp_group: row.whatsapp_group,
      }))
    : [];

  const Tableheaders = ["Group Id", "Company ", "Group Name", "Action"];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setCurrentPage(1);
                    getAllWhatsappGroup(1, searchQuery);
                  }}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getAllWhatsappGroup(1, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Whatsapp Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={handleDelete}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
          <Popup
            title={"Delete"}
            openPopup={deletePopupOpen}
            setOpenPopup={setDeletePopupOpen}
          >
            <DeleteWhatsappGroup
              id={selectedRow}
              onClose={closeDeletePopup}
              onDeleteSuccess={onDeleteSuccess}
            />
          </Popup>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Paper>
      </Grid>
    </>
  );
};
