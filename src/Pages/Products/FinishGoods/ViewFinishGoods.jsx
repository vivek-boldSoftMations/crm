import React, { useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "../../CommonStyle.css";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateFinishGoods } from "./CreateFinishGoods";
import { UpdateFinishGoods } from "./UpdateFinishGoods";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { useDispatch } from "react-redux";
import {
  getBasicUnitData,
  getBrandData,
  getColourData,
  getPackingUnitData,
  getUnitData,
} from "../../../Redux/Action/Action";
import { getProductCodeData } from "./../../../Redux/Action/Action";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";

export const ViewFinishGoods = () => {
  const dispatch = useDispatch();
  const [finishGood, setFinishGood] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
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
    { label: "ID", key: "id" },
    { label: "FINISH GOODS", key: "name" },
    { label: "PRODUCT CODE", key: "productcode" },
    { label: "COLOR", key: "color" },
    { label: "UNIT", key: "unit" },
    { label: "UNIT QUANTITY", key: "unit_quantity" },
    { label: "BASIC UNIT", key: "basic_unit" },
    { label: "BRAND", key: "brand" },
    { label: "SIZE", key: "size" },
    { label: "DESCRIPTION", key: "description" },
    { label: "SHELF LIFE", key: "shelf_life" },
    { label: "ADD.DESCRIPTION", key: "additional_description" },
    { label: "PACKING UNIT", key: "packing_unit" },
    { label: "PACKING UNIT QUANTITY", key: "packing_unit_quantity" },
    { label: "HSN CODE", key: "hsn_code" },
    { label: "GST%", key: "gst" },
    { label: "SGST", key: "sgst" },
    { label: "CGST", key: "cgst" },
    { label: "TYPE", key: "type" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await ProductService.getFinishGoodsPaginateWithSearch(
          "all",
          searchQuery
        );
      } else {
        response = await ProductService.getFinishGoodsPaginate("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          productcode: row.productcode,
          color: row.color,
          unit: row.unit,
          unit_quantity: row.unit_quantity,
          basic_unit: row.basic_unit,
          brand: row.brand,
          size: row.size,
          description: row.description,
          shelf_life: row.shelf_life,
          additional_description: row.additional_description,
          packing_unit: row.packing_unit,
          packing_unit_quantity: row.packing_unit_quantity,
          hsn_code: row.hsn_code,
          gst: row.gst,
          sgst: row.sgst,
          cgst: row.cgst,
          type: row.type,
        };
      });

      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getPackingUnits();
    getBrandList();
    getColours();
    getproductCodes();
    getUnits();
    getBasicUnit();
    getFinishGoods();
  }, []);

  const getPackingUnits = async () => {
    try {
      const res = await ProductService.getAllPackingUnit("all");
      dispatch(getPackingUnitData(res.data));
    } catch (err) {
      console.log("error PackingUnit finishGoods", err);
    }
  };

  const getBrandList = async () => {
    try {
      const res = await ProductService.getAllBrand("all");
      dispatch(getBrandData(res.data));
    } catch (err) {
      console.log("error finishGoods :>> ", err);
    }
  };

  const getColours = async () => {
    try {
      const res = await ProductService.getAllPaginateColour("all");
      dispatch(getColourData(res.data));
    } catch (err) {
      console.log("err Colour FinishGoods :>> ", err);
    }
  };

  const getproductCodes = async () => {
    try {
      const res = await ProductService.getAllPaginateProductCode("all");
      dispatch(getProductCodeData(res.data));
    } catch (err) {
      console.log("error ProductCode finishGoods", err);
    }
  };

  const getUnits = async () => {
    try {
      const res = await ProductService.getAllPaginateUnit("all");
      dispatch(getUnitData(res.data));
    } catch (err) {
      console.log("error unit finishGoods", err);
    }
  };

  const getBasicUnit = async () => {
    try {
      const res = await ProductService.getAllPaginateBasicUnit("all");
      dispatch(getBasicUnitData(res.data));
    } catch (err) {
      console.log("error :>> ", err);
    }
  };

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await ProductService.getFinishGoodsPaginate(
          currentPage
        );
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getAllFinishGoods();

        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const handlePageChange = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response = await ProductService.getFinishGoodsPaginateWithSearch(
          page,
          searchQuery
        );
        if (response) {
          setFinishGood(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getFinishGoods();
          setSearchQuery("");
        }
      } else {
        const response = await ProductService.getFinishGoodsPaginate(page);
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;

      const response = await ProductService.getAllSearchFinishGoods(
        filterSearch
      );
      if (response) {
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getFinishGoods();
        setSearchQuery("");
      }

      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getFinishGoods();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "FINISH GOODS",
    "UNIT",
    "BRAND",
    "PRODUCT CODE",
    "DESCRIPTION",
    "SHELF LIFE",
    "HSN CODE",
    "GST%",
    "ACTION",
  ];

  const TableData = finishGood.map((value) => ({
    id: value.id,
    name: value.name,
    unit: value.unit,
    brand: value.brand,
    productcode: value.productcode,
    description: value.description,
    shelf_life: value.shelf_life,
    hsn_code: value.hsn_code,
    gst: value.gst,
  }));

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={searchQuery}
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
                Finish Goods
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Finish Goods.csv"
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
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create FinishGoods"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateFinishGoods
          getFinishGoods={getFinishGoods}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update FinishGoods"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateFinishGoods
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getFinishGoods={getFinishGoods}
        />
      </Popup>
    </>
  );
};
