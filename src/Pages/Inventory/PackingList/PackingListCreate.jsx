import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Grid, IconButton, Snackbar, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PackingListCreate = ({ selectedRow, setOpenPopup }) => {
  console.log("selectedRow", selectedRow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const [details, setDetails] = useState(() => ({
    seller_account: selectedRow.seller_account,
    vendor: selectedRow.vendor,
    purchase_order: [selectedRow.po_no],
    packing_list_no: "",
    invoice_date: today,
    products: selectedRow.products.map((product) => ({
      product: product.product,
      unit: product.unit,
      quantity: product.pending_quantity,
    })),
  }));

  useEffect(() => {
    setDetails({
      seller_account: selectedRow.seller_account,
      vendor: selectedRow.vendor,
      purchase_order: [selectedRow.po_no],
      packing_list_no: details.packing_list_no,
      invoice_date: details.invoice_date,
      products: selectedRow.products.map((product, index) => ({
        product: product.product,
        unit: product.unit,
        quantity:
          (details.products[index] && details.products[index].quantity) ||
          product.pending_quantity,
      })),
    });
  }, [selectedRow]);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setDetails((current) => ({ ...current, [name]: value }));
  }, []);

  const handleQuantityChange = useCallback((index, newQuantity) => {
    setDetails((current) => ({
      ...current,
      products: current.products.map((product, idx) =>
        idx === index ? { ...product, quantity: newQuantity } : product
      ),
    }));
  }, []);

  const createPackingListDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...details,
        purchase_order: details.purchase_order, // This is already an array
      };
      const response = await InventoryServices.createPackingListData(
        dataToSend
      );
      if (response) {
        setOpenPopup(false);
      }
    } catch (error) {
      console.error("Creating Packing list error", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => setError(null), []);

  return (
    <Root>
      <CustomLoader open={loading} />
      <Box component="form" noValidate onSubmit={createPackingListDetails}>
        <Snackbar
          open={Boolean(error)}
          onClose={handleCloseSnackbar}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="seller_account"
              label="Buyer Account"
              variant="outlined"
              value={details.seller_account}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Purchase Order Number"
              variant="outlined"
              value={details.purchase_order || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="packing_list_no"
              label="Invoice No"
              variant="outlined"
              value={details.packing_list_no || ""}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              size="small"
              name="invoice_date"
              label="Invoice Date"
              variant="outlined"
              value={details.invoice_date || ""}
              InputProps={{ inputProps: { max: today } }}
            />
          </Grid>
          {details.products.map((product, index) => (
            <React.Fragment key={product.id || index}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Product"
                  variant="outlined"
                  value={product.product || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Unit"
                  variant="outlined"
                  value={product.unit || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="quantity"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={product.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Root>
  );
};

export const PackingListMergeCreate = ({
  purchaseOrderData = [],
  setOpenPopup,
}) => {
  console.log("purchaseOrderData", purchaseOrderData);
  const { sellerData } = useSelector((state) => ({
    sellerData: state.auth.sellerAccount,
    userData: state.auth.profile,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const [selectedPoNos, setSelectedPoNos] = useState([]);
  const [details, setDetails] = useState({
    seller_account: "",
    products: [],
    packing_list_no: "",
    invoice_date: today,
  });
  const [poOptionsForSelectedAccount, setPoOptionsForSelectedAccount] =
    useState([]);

  // Triggered when a seller account is selected
  const handleBuyerAccountChange = (event, value) => {
    // Filter the PO options based on the selected seller account
    const filteredPoOptions = purchaseOrderData
      .filter((po) => po.seller_account === value && po.po_no) // Ensure po_no is not undefined
      .map((po) => ({ label: po.po_no, value: po }));

    // Update state with the filtered PO options
    setPoOptionsForSelectedAccount(filteredPoOptions);

    // Update the details state to include the selected seller account
    setDetails((prevDetails) => ({
      ...prevDetails,
      seller_account: value,
    }));
  };
  console.log("poOptionsForSelectedAccount", poOptionsForSelectedAccount);
  // Triggered when PO numbers are selected
  const handlePoNoChange = (event, newValue) => {
    if (newValue && newValue.length > 0) {
      // Process the newValue array to ensure it contains objects with 'value' property
      const processedNewValue = newValue.map((po) =>
        typeof po === "string"
          ? { label: po, value: purchaseOrderData.find((p) => p.po_no === po) }
          : po
      );

      // Extract only the product, unit, and quantity from each PO's products
      const selectedProducts = processedNewValue.flatMap((po) =>
        po.value && po.value.products
          ? po.value.products.map((product) => ({
              product: product.product,
              unit: product.unit,
              quantity: product.quantity,
            }))
          : []
      );

      // Update the details state with the selected products
      setDetails((prevDetails) => ({
        ...prevDetails,
        products: selectedProducts,
      }));

      // Update the selected PO numbers
      setSelectedPoNos(processedNewValue.map((po) => po.label));
    } else {
      // Clear the products and selected PO numbers if newValue is empty
      setDetails((prevDetails) => ({
        ...prevDetails,
        products: [],
      }));
      setSelectedPoNos([]);
    }
  };

  console.log("selectedPoNos", selectedPoNos);
  console.log("details", details);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setDetails((current) => ({ ...current, [name]: value }));
  }, []);

  const handleQuantityChange = useCallback((index, newQuantity) => {
    setDetails((current) => ({
      ...current,
      products: current.products.map((product, idx) =>
        idx === index ? { ...product, quantity: newQuantity } : product
      ),
    }));
  }, []);

  const createMergePackingListDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...details,
        purchase_order: selectedPoNos, // This is already an array
      };
      const response = await InventoryServices.createPackingListData(
        dataToSend
      );
      if (response) {
        setOpenPopup(false);
      }
    } catch (error) {
      console.error("Creating Packing list error", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => setError(null), []);

  return (
    <Root>
      <CustomLoader open={loading} />
      <Box component="form" noValidate onSubmit={createMergePackingListDetails}>
        <Snackbar
          open={Boolean(error)}
          onClose={handleCloseSnackbar}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="buyer-account-autocomplete"
              onChange={handleBuyerAccountChange}
              options={sellerData.map((option) => option.unit)} // Assuming you have a list of seller names
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Buyer Account"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          {poOptionsForSelectedAccount.length > 0 && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                multiple
                options={poOptionsForSelectedAccount}
                getOptionLabel={(option) => (option ? option.label : "")}
                value={selectedPoNos}
                onChange={handlePoNoChange}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Select PO Numbers"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="packing_list_no"
              label="Invoice No"
              variant="outlined"
              value={details.packing_list_no || ""}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              size="small"
              name="invoice_date"
              label="Invoice Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={details.invoice_date}
              onChange={handleInput}
              InputProps={{ inputProps: { max: today } }}
            />
          </Grid>
          {details.products.map((product, index) => (
            <React.Fragment key={product.id || `product-${index}`}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Product"
                  variant="outlined"
                  value={product.product || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Unit"
                  variant="outlined"
                  value={product.unit || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="quantity"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={product.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Root>
  );
};
