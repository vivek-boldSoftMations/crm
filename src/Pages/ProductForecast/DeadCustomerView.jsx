import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  MenuItem,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "./../../Components/CustomSearchWithButton";
import { Popup } from "../../Components/Popup";
import { UpdateAllCompanyDetails } from "../Cutomers/CompanyDetails/UpdateAllCompanyDetails";
import { CustomTable } from "../../Components/CustomTable";

const filterOption = [
  { label: "Search", value: "search" },
  { label: "Sales Person", value: "assigned_to__email" },
];

export const DeadCustomerView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [deadCustomer, setDeadCustomer] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "Company", key: "company" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Sales Person 1", key: "sales_person_1" },
    { label: "Sales Person 2", key: "sales_person_2" },
    { label: "Sales Person 3", key: "sales_person_3" },
    { label: "Sales Person 4", key: "sales_person_4" },
    { label: "Contact Person Name", key: "contact_person_name" },
    { label: "Contact", key: "contact" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const response =
        searchQuery || filterSelectedQuery
          ? await ProductForecastService.getAllPaginateDeadCustomerWithSearch(
              "all",
              filterQuery,
              searchQuery || filterSelectedQuery
            )
          : await ProductForecastService.getAllPaginateDeadCustomer("all");
      const data = response.data.map((row) => {
        const salesPersons = row.assigned_to.map((email, index) => ({
          [`sales_person_${index + 1}`]: email,
        }));
        const obj = {
          company: row.name,
          city: row.city,
          state: row.state,
          ...salesPersons.reduce((acc, sp) => ({ ...acc, ...sp }), {}),
          contact_person_name:
            row.contacts && row.contacts[0] ? row.contacts[0].name : "",
          contact:
            row.contacts && row.contacts[0] ? row.contacts[0].contact : "",
        };
        return obj;
      });
      console.log(data);
      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };
  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");

    getAllProductionForecastDetails();
  };

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(searchQuery);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  useEffect(() => {
    getAssignedData();
    getAllProductionForecastDetails();
  }, []);

  const getAssignedData = async () => {
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

  const getAllProductionForecastDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await ProductForecastService.getDeadCustomerPaginateData(currentPage);
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductForecastService.getDeadCustomer();
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductForecastService.getAllSearchDeadCustomer(
        filterQuery,
        filterSearch
      );
      if (response) {
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllProductionForecastDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (searchQuery || filterSelectedQuery) {
        const response =
          await ProductForecastService.getAllDeadCustomerPaginate(
            page,
            filterQuery,
            searchQuery || filterSelectedQuery
          );
        if (response) {
          setDeadCustomer(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductionForecastDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await ProductForecastService.getDeadCustomerPaginateData(page);
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tabledata = deadCustomer.map((row) => ({
    id: row.id,
    company: row.name,
    city: row.city,
    state: row.state,
    sales_person: row.assigned_to,
    contact_person_name:
      row.contacts && row.contacts[0] ? row.contacts[0].name : "",
    contact: row.contacts && row.contacts[0] ? row.contacts[0].contact : "",
  }));

  const Tableheaders = [
    "ID",
    "Company",
    "City",
    "State",
    "Sales Person",
    "Contact Person Name",
    "Contact",
    "Action",
  ];

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Fliter By"
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                >
                  {filterOption.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box flexGrow={1}>
              {filterQuery === "assigned_to__email" ? (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By Sales Person
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Filter By State"
                    value={filterSelectedQuery}
                    onChange={(event) => handleInputChanges(event)}
                    sx={{
                      "& .MuiSelect-iconOutlined": {
                        display: filterSelectedQuery ? "none" : "",
                      },
                      "&.Mui-focused .MuiIconButton-root": {
                        color: "primary.main",
                      },
                    }}
                    endAdornment={
                      <IconButton
                        sx={{
                          visibility: filterSelectedQuery
                            ? "visible"
                            : "hidden",
                        }}
                        onClick={getResetData}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                  >
                    {assigned.map((option, i) => (
                      <MenuItem key={i} value={option.email}>
                        {option.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <CustomSearchWithButton
                  filterSelectedQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              )}
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Dead Customer
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename={"Dead Customer.csv"}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
            </Box>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Update Company Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateAllCompanyDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetails={getAllProductionForecastDetails}
          recordForEdit={recordForEdit}
        />
      </Popup>
    </div>
  );
};
