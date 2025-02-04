import React, { useCallback, useEffect, useState } from "react";
import "../../../src/style.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Close, Delete, Edit } from "@mui/icons-material";
import "../redirect_portal/redirect_style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createRedirectCallBlock,
  deleteRedirectCallBlock,
  getRedirectCallBlock,
  updateRedirectCallBlock,
} from "../../redux/actions/redirectPortal/redirectPortal_callBlockAction";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/Info";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row": {
            minHeight: "auto", // Adjust row height to make it more compact
          },
        },
      },
      defaultProps: {
        density: "compact", // Set default density to compact
      },
    },
  },
});

const useStyles = makeStyles({
  spacedRow: {
    // Adjust spacing here, e.g., margin, padding, etc.
    marginBottom: "10px",
  },
  borderedGreen: {
    borderLeft: "3px solid green", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
  },
  borderedRed: {
    borderLeft: "3px solid red", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
  },
  formControl: {
    "& .MuiInputBase-root": {
      color: "#666",
      borderColor: "transparent",
      borderWidth: "1px",
      borderStyle: "solid",
      height: "45px",
      minWidth: "120px",
      justifyContent: "center",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
    },
    "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
      top: "-4px",
    },
  },
  select: {
    width: "auto",
    fontSize: "12px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  selectIcon: {
    position: "relative",
    color: "#6EC177",
    fontSize: "14px",
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      fontWeight: 200,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "12px",
    },
    "& li.Mui-selected": {
      color: "white",
      background: "#6EC177",
    },
    "& li.Mui-selected:hover": {
      background: "#6EC177",
    },
  },
});

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function CallBlock({userThem}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState("");
  const [callBlockId, setCallBlockId] = useState("");
  const [response, setResponse] = useState("");
  const [isActive, setIsActive] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setCallBlockId("");
    setDescription("");
    setDetails("");
    setType("");
    setIsActive("");
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setIsActive("");
    setCallBlockId("");
    setDescription("");
    setDetails("");
    setType("");
  }, [setIsActive, setCallBlockId, setDescription, setDetails, setType]);

  const handleAlertClose = () => {
    setCallBlockId("");
    setAlertMessage(false);
  };

  useEffect(() => {
    dispatch(getRedirectCallBlock());
  }, [response]);

  const handleButtonClick = useCallback(
    (row) => {
      setOpenModal(true);
      setCallBlockId(row.callBlockId);
      setIsActive(row.is_active);
      setDescription(row.description);
      setDetails(row.details);
      setType(row.type);
    },
    [setIsActive, setCallBlockId, setDescription, setDetails, setType]
  ); // Memoize event handler

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      details: details,
      description: description,
      type: type,
      is_active: isActive,
    });
    dispatch(createRedirectCallBlock(data, setResponse, handleClose));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      id: callBlockId,
      details: details,
      description: description,
      type: type,
      is_active: isActive?.toString()?.charAt(0),
    });
    dispatch(updateRedirectCallBlock(data, setResponse, handleCloseModal));
  };

  const handleMessage = useCallback(
    (data) => {
      setName(data?.details);
      setCallBlockId(data?.callBlockId);
      setAlertMessage(true);
    },
    [setName]
  ); // Memoize event handler

  const handleDelete = useCallback(
    (id) => {
      dispatch(
        deleteRedirectCallBlock(
          { id: callBlockId },
          setResponse,
          setCallBlockId
        )
      );
      setAlertMessage(false);
    },
    [callBlockId, dispatch, setResponse, setCallBlockId]
  ); // Memoize event handler

  const columns = [
    {
      field: "edit",
      headerName: "Action",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",

      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <Tooltip title="Edit" disableInteractive interactive>
              <IconButton
                onClick={() => handleButtonClick(params.row)}
                style={{
                  fontSize: "15px",
                  color: "#42765f",
                  marginRight: "10px",
                }}
              >
                <Edit index={params.row.id} style={{
                cursor: "pointer",
                  color: "#42765f",
             
                }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" disableInteractive interactive>
            <IconButton onClick={() => handleMessage(params?.row)}>
              <Delete style={{ cursor: "pointer", color: "red" }} />
            </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "username",
      headerName: "User Name",
      width: 240,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell:((params)=>{
        return(<>
        <span style={{textTransform:"capitalize"}}>{params.row.username}</span>
        </>)
              })
    },
    {
      field: "details",
      headerName: "Caller ID Number",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "type",
      headerName: "Type",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 180,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.is_active === true ? (
              <>
                <div
                  style={{
                    color: "green",
                    // background: "green",
                    // padding: "7px",
                    // borderRadius: "5px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  Enable
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    color: "red",
                    // background: "red",
                    // padding: "7px",
                    // borderRadius: "5px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  Disable
                </div>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell:((params)=>{
        return(<>
        <span style={{textTransform:"capitalize"}}>{params.row.description}</span>
        </>)
              })
    },
    

  
  ];

  const mockDataTeam = [];
  state?.getRedirectCallBlock?.redirectCallBlock?.data &&
    state?.getRedirectCallBlock?.redirectCallBlock?.data?.forEach(
      (item, index) => {
        mockDataTeam.push({
          id: index + 1,
          details: item.details,
          is_active: item.is_active,
          type: item.type,
          username: item.username,
          callBlockId: item.id,
          description: item.description,
        });
      }
    );
  return (
    <>
     <div className={`App ${userThem} `}>
     <div className="contant_box">
      <div className="main">
        <section className="sidebar-sec">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="">
                  {/* <!----> */}
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                    >
                      {/* <!--role-contet--> */}
                      <div className="tab_cntnt_box">
                        <div
                          className="cntnt_title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                          }}
                        >
                          <div>
                            <h3>Call Block</h3>
                            {/* <p>
                              Use this to monitor and interact with the call
                              bock.
                            </p> */}
                          </div>

                          <IconButton
                            className="redirect_all_button_clr"
                            onClick={handleOpen}
                          >
                            Add
                            <AddOutlinedIcon />
                          </IconButton>
                        </div>

                        <Dialog
                            open={open}
                            onClose={handleClose}
                            sx={{ textAlign: "center" }}
                          > 
                           <Box>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    float: "inline-end",
                    display: "flex",
                    justifyContent: "end",
                    margin: "10px 10px 0px 0px",
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
              <DialogTitle
              className="modal_heading"
                sx={{ color: "#133325", fontWeight: "600", width: "500px" }}
              >
                
                Add Call Block
              </DialogTitle>


                            <DialogContent>
                              <form>
                            
                              <form
                                     style={{
                                      textAlign: "center",
                                      height: "260px",
                                      // overflow: "auto",
                                      paddingTop: "10px",
                                      padding: "5px",
                                      width: "auto",
                                    }}
                                  >
                                     <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Type select box
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type select box"
                                    value={type}
                                    onChange={(e) => {
                                      setType(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"CallerID"}>
                                      CallerID
                                    </MenuItem>

                                    <MenuItem value={"AreaCode"}>
                                      AreaCode
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <br />

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Caller ID Number"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={details}
                                  onChange={(e) => {
                                    setDetails(e.target.value);
                                  }}
                                />
                                <InputLabel
                                  style={{
                                    textAlign: "left",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tooltip
                                    style={{ color: "#fff" }}
                                    title="Sample CallerID Format +13456232323 / Sample Areacode +13"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <InfoIcon
                                      style={{
                                        fontSize: "18px",
                                        color: "#0E397F",
                                      }}
                                    />
                                    &nbsp;
                                  </Tooltip>
                                  Sample CallerID Format +13456232323 / Sample
                                  Areacode +13{" "}
                                </InputLabel>
                                <br />

                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Status
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Status"
                                    value={isActive}
                                    onChange={(e) => {
                                      setIsActive(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"true"}>Active</MenuItem>
                                    <MenuItem value={"false"}>
                                      Deactive
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="description"
                                  label="Description"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={description}
                                  onChange={(e) => {
                                    setDescription(e.target.value);
                                  }}
                                />
                                  </form>
                             
                              </form>
                            </DialogContent>
                            <DialogActions
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                   paddingBottom: "20px",
                                  }}
                                >
                                 <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background:
                                      "linear-gradient(180deg, #0E397F 0%, #001E50 100%) !important",
                                    marginTop: "20px",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleClose}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background: "#092b5f",
                                    marginTop: "20px",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleSubmit}
                                >
                                  save
                                </Button>
                                </DialogActions>
                          </Dialog>



                        {/* edit -modal- start */}
                        <Dialog
                          open={openModal}
                          //onClose={handleCloseModal}
                          sx={{ textAlign: "center" }}
                        >
                          <Box>
                            <IconButton
                              onClick={handleCloseModal}
                              sx={{
                    float: "inline-end",
                    display: "flex",
                    justifyContent: "end",
                    margin: "10px 10px 0px 0px",
                  }}
                             // sx={{ float: "inline-end",position:'absolute',right:'1rem',top:'1rem' }}
                            >
                              <Close />
                            </IconButton>
                          </Box>
                         
                          <DialogTitle
                            sx={{
                              color: "#133325",
                              fontWeight: "600",
                              width: "500px",
                            }}
                            className="mobile_view modal_heading"
                          >
                            Edit
                          </DialogTitle>
                          <DialogContent>
                            <form>
                              {/* <SelectComponent handleClose={handleClose} /> */}
                              <Typography variant="body1">
                             
                                <form
                                  style={{
                                    textAlign: "center",
                                    textAlign: "center",
                                    // height: "400px",
                                    overflow: "auto",
                                    paddingTop: "10px",
                                    padding: "5px",
                                  }}
                                >
                                  <FormControl
                                    fullWidth
                                    style={{ margin: " 5px 0 5px 0" }}
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      Type select box
                                    </InputLabel>
                                    <Select
                                      style={{ textAlign: "left" }}
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Type select box"
                                      value={type}
                                      onChange={(e) => {
                                        setType(e.target.value);
                                      }}
                                    >
                                      <MenuItem value={"CallerID"}>
                                        CallerID
                                      </MenuItem>
                                      <MenuItem value={"AreaCode"}>
                                        AreaCode
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <br />

                                  <TextField
                                    style={{
                                      width: "100%",
                                      margin: " 5px 0 5px 0",
                                    }}
                                    type="text"
                                    label="Caller ID Number"
                                    variant="outlined"
                                    padding={"0px 0 !important"}
                                    value={details}
                                    onChange={(e) => {
                                      setDetails(e.target.value);
                                    }}
                                  />
                                  <br />

                                  <FormControl
                                    fullWidth
                                    style={{ margin: " 5px 0 5px 0" }}
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      Status
                                    </InputLabel>
                                    <Select
                                      style={{ textAlign: "left" }}
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      // value={age}
                                      label="Status"
                                      value={isActive}
                                      onChange={(e) => {
                                        setIsActive(e.target.value);
                                      }}
                                    >
                                      <MenuItem value={"true"}>Active</MenuItem>
                                      <MenuItem value={"false"}>
                                        Deactive
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <TextField
                                    style={{
                                      width: "100%",
                                      margin: " 5px 0 5px 0",
                                    }}
                                    type="description"
                                    label="Description"
                                    variant="outlined"
                                    padding={"0px 0 !important"}
                                    value={description}
                                    onChange={(e) => {
                                      setDescription(e.target.value);
                                    }}
                                  />

                                  <br />
                                </form>
                              </Typography>
                            </form>
                          </DialogContent>
                          <DialogActions
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              paddingBottom: "20px",
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                background:
                                  "linear-gradient(180deg, #0E397F 0%, #001E50 100%) !important",
                                marginTop: "20px",
                                marginLeft: "0px !important",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                              }}
                              className="all_button_clr"
                              color="info"
                              onClick={handleCloseModal}
                              autoFocus
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                marginTop: "20px",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                                marginLeft: "0px !important",
                                marginRight: "0px !important",
                              }}
                              className="all_button_clr"
                              color="error"
                              onClick={handleUpdate}
                            >
                              Update
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* edit-modal-end */}

                        {/* Delete Confirmation Modal Start  */}
                        <Dialog
                          open={alertMessage}
                          onClose={handleAlertClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                          sx={{ textAlign: "center" }}
                          //className="bg_imagess"
                        >
                          <DialogTitle
                            id="alert-dialog-title"
                            sx={{ color: "#133325", fontWeight: "600" }}
                          >
                            {"Delete Confirmation"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText
                              id="alert-dialog-description"
                              sx={{ paddingBottom: "0px !important" }}
                            >
                              Are you sure you want to delete {name} ?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              paddingBottom: "20px",
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                background:
                                  "linear-gradient(180deg, #0E397F 0%, #001E50 100%) !important",
                                marginTop: "20px",
                                marginLeft: "0px !important",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                              }}
                              className="all_button_clr"
                              color="info"
                              onClick={handleAlertClose}
                              autoFocus
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                marginTop: "20px",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                                marginLeft: "0px !important",
                                marginRight: "0px !important",
                              }}
                              className="all_button_clr"
                              color="error"
                              onClick={handleDelete}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* Delete Confirmation Modal End  */}

                        {/* <!--table---> */}
                        <ThemeProvider theme={theme}>
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              rows={mockDataTeam}
                              columns={columns}
                              headerClassName="custom-header"
                              // getRowClassName={(params) =>
                              //   isRowBordered(params) ? 'borderedGreen' : 'borderedRed'
                              // }
                              components={{ Toolbar: GridToolbar }}
                              slots={{
                                toolbar: CustomToolbar,
                              }}
                              autoHeight
                            />
                          </div>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
      </div>
    </>
  );
}

export default CallBlock;
