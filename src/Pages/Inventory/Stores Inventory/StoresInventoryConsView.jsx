import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  Pagination,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import React, { useEffect, useRef, useState } from "react";

import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import InventoryServices from "../../../services/InventoryService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const StoresInventoryConsView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllStoresInventoryDetails();
  }, []);

  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getConsStoresInventoryPaginateData(
            currentPage
          )
        : await InventoryServices.getAllConsStoresInventoryData();
      setStoresInventoryData(response.data);
    } catch (err) {
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
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response =
          await InventoryServices.getAllSearchConsStoresInventoryData(
            filterSearch
          );
        setStoresInventoryData(response.data);
      } else {
        await getAllStoresInventoryDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await InventoryServices.getAllConsStoresInventoryDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getConsStoresInventoryPaginateData(page);

      if (response) {
        setStoresInventoryData(response.data);
      } else {
        await getAllStoresInventoryDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = () => {
    setFilterSelectedQuery("");
    getAllStoresInventoryDetails();
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={filterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
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
                Stores Inventory Cons
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right"></Box>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>

                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {storesInventoryData.map((row, i) => (
                  <StyledTableRow KEY={i}>
                    <StyledTableCell align="center">
                      {row.product__name}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageClick}
              color={"primary"}
              variant="outlined"
              shape="circular"
            />
          </TableFooter>
        </Paper>
      </Grid>
    </>
  );
};
