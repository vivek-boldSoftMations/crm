import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CustomTextField from "../../Components/CustomTextField";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomerServices from "../../services/CustomerService";

export const WhatsappGroupCreate = ({ setOpenPopup }) => {
  const [whatsappGroup, setWhatsappGroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [allWhatsappGroupMenu, setAllWhatsappGroupMenu] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [isPdf, setIsPdf] = useState(false);
  const [filter, setFilter] = useState("message");

  useEffect(() => {
    getAllWhatsappGroup();
  }, []);

  const getAllWhatsappGroup = async () => {
    try {
      const res = await CustomerServices.getAllWhatsappGroupData();
      setAllWhatsappGroupMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("allWhatsappGroupMenu", allWhatsappGroupMenu);

  // Updated handleFileChange function
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    setIsPdf(file.type === "application/pdf"); // Set isPdf based on file type

    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      try {
        setUploadedFile(file);
        const fileURL = URL.createObjectURL(file);
        setFilePreview(fileURL);
      } catch (error) {
        console.error("Error converting file to base64", error);
      }
    } else {
      setFilePreview(null);
    }
  };

  // Effect for cleanup
  useEffect(() => {
    // Cleanup the object URL on unmount or when file changes
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const createWhatsappGroup = async (e) => {
    e.preventDefault();
    setOpen(true);

    try {
      const formData = new FormData();

      // Append each group ID as an individual entry to formData
      // formData.append("groups", JSON.stringify(selectedGroupIds.join(", ")));

      // Handle the file upload and associated data
      if (uploadedFile) {
        const fileKey = "file";
        formData.append(fileKey, uploadedFile);
        formData.append("caption", whatsappGroup.caption || "");
      } else {
        // For text-only messages
        formData.append("message", whatsappGroup.message || "");
      }

      // Select the appropriate API call
      let apiCall;
      if (uploadedFile) {
        apiCall = CustomerServices.createWhatsappImageData;
      } else {
        apiCall = CustomerServices.createWhatsappData;
      }

      // Make the API call
      await apiCall(formData);
    } catch (error) {
      console.error("Error creating WhatsApp group", error);
    } finally {
      setOpen(false);
      setOpenPopup(false);
    }
  };

  const renderInputFields = () => {
    switch (filter) {
      case "message":
        return (
          <CustomTextField
            fullWidth
            multiline
            name="message"
            size="small"
            label="Message"
            variant="outlined"
            value={whatsappGroup["message"] || ""}
            onChange={(event) =>
              setWhatsappGroup({
                ...whatsappGroup,
                [event.target.name]: event.target.value,
              })
            }
          />
        );
      case "image":
      case "pdf":
        return (
          <>
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{ mt: 1, mb: 2 }}
            >
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {uploadedFile && (
              <Box sx={{ mt: 2 }}>
                {isPdf || filter === "pdf" ? (
                  <Typography variant="subtitle1">
                    {uploadedFile.name}
                  </Typography>
                ) : (
                  filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  )
                )}
              </Box>
            )}
            <CustomTextField
              fullWidth
              multiline
              name="caption"
              size="small"
              label="Caption"
              variant="outlined"
              value={whatsappGroup["caption"] || ""}
              onChange={(event) =>
                setWhatsappGroup({
                  ...whatsappGroup,
                  [event.target.name]: event.target.value,
                })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createWhatsappGroup(e)}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            row
            aria-label="type"
            name="type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <FormControlLabel
              value="message"
              control={<Radio />}
              label="Message"
            />
            <FormControlLabel value="image" control={<Radio />} label="Image" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
          </RadioGroup>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderInputFields()}
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
