import React, { useEffect, useMemo, useState } from "react";
import "../../../src/style.css";
import {
  Box,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/styles";
import { Close, Edit } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import { getDid } from "../../redux/actions/destinationAction";
import { getAllUsers } from "../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import {
  getRedirectDestination,
  getUserRedirectGroups,
  updateRedirectDestination,
} from "../../redux/actions/redirectPortal/redirectPortal_destinationAction";
import { IconBase } from "react-icons/lib";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // backgroundColor: "rgb(9, 56, 134)",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
      {/* <GridToolbarExport /> */}
    </GridToolbarContainer>
  );
}

function Destination({userThem}) {
  const [edit, setEdit] = useState(false);
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [recording, setRecording] = useState("");
  const [description, setDescription] = useState("");
  const [ivrAuthentication, setIvrAuthentication] = useState("");
  const [redirectGroup, setRedirectGroup] = useState("");
  const [redirectGroupData, setRedirectGroupData] = useState([]);
  const [status, setStatus] = useState("")
  const [response, setResponse] = useState("");
  
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleEditOpen = () => setEdit(true);
  const handleEditClose = () => {
    setEdit(false);
    setDestination("");
    setDestinationId("");
    setRecording("");
    setDescription("");
    setIvrAuthentication("");
    setRedirectGroup("");
    setStatus("");
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "destination":
        setDestination(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleEdit = (data) => {
    handleEditOpen();
    setRecording(data?.recording);
    setIvrAuthentication(data?.ivr_authendication);
    setDescription(data?.description);
    setDestination(data?.didnumber);
    setDestinationId(data?.destinationId);
    setStatus(data?.status);
    setRedirectGroup(data?.redirect_group_id)
  };

  useMemo(() => {
    setRedirectGroupData(state.getUserRedirectGroups.RedirectGroup);
  }, [state.getUserRedirectGroups.RedirectGroup]);

  const handleUpdate = () => {
    const data = JSON.stringify({
      id: destinationId,
      recording: recording,
      description: description,
      ivr_authendication: ivrAuthentication,
      redirect_group_id: redirectGroup,
      status: status === true ? "t" : "f",
    });
    dispatch(updateRedirectDestination(data, setResponse, handleEditClose));
  };

  useEffect(() => {
    dispatch(getRedirectDestination());
    dispatch(getUserRedirectGroups());
  }, [response]);



  const columns = [
    {
      field: "edit",
      headerName: "Action",
      width: 100,
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {/* <IconButton
              onClick={() => handleEdit(params.row)}
              style={{
                border: "1px solid #04255C",
                borderRadius: "5px",
                padding: "6px",
                fontSize: "15px",
                color: "#04255C",
              }}
            >
              Edit
            </IconButton> */}
             <Tooltip title="Edit" disableInteractive interactive>
            <IconButton onClick={() => handleEdit(params.row)} style={{
              fontSize:'22px'
            }}>
            <Edit
                index={params.row.id}
                style={{ cursor: "pointer", color: "#42765f"}}
              />
            </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "didnumber",
      headerName: "Destination",
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
    },


    {
      field: "redirect_group_name",
      headerName: "Campaign Name",
      headerClassName: "custom-header",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=> {
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.redirect_group_name}</span>
        )
      }
    },
    // {
    //   field: "carrier_name",
    //   headerName: "Carrier Name",
    //   headerClassName: "custom-header",
    //   width: 100,
    //   headerAlign: "left",
    //   align: "left",
    // },
   


    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <>
            {params.row.status === true ? (
              <>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    color: "green",
                    //border: "1px solid green",
                    padding: "5px 4.5px",
                    borderRadius: "5px",
                  }}
                >
                  Active
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    color: "red",
                    //border: "1px solid red",
                    padding: "5px 4.5px",
                    borderRadius: "5px",
                  }}
                >
                  Deactive
                </div>
              </>
            )}
          </>
        );
      },
    },
    {
      field: "ivr_authendication",
      headerName: "IVR Authentication",
      headerClassName: "custom-header",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: ((params)=>{
        const val = params.row.ivr_authendication;
        return(<>
        <span >{val === false? "False" : "True"}</span>
        </>)
      })
    },
    {
      field: "recording",
      headerName: "Recording",
      headerClassName: "custom-header",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.recording === false ? (
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
                  {params.row.recording.toString().toLowerCase()}
                </div>
              </>
            ) : (
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
                  {params.row.recording.toString().toLowerCase()}
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
      width: 200,
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      align: "center",
            renderCell:((params)=>{
return(<>
<span style={{textTransform:"capitalize"}}>{params.row.description}</span>
</>)
      })
    },
   
  ];

  const rows = [];
  state?.getRedirectDestination?.RedirectDestination &&
    state?.getRedirectDestination?.RedirectDestination?.data?.forEach(
      (item, index) => {
        return rows.push({
          id: index + 1,
          carrier_name: item?.carrier_name,
          didnumber: item?.didnumber,
          description: item?.description,
          recording: item?.recording,
          redirect_group_id: item?.redirect_group_id,
          status: item?.status,
          user_id: item?.user_id,
          username: item?.username,
          destinationId: item?.id,
          ivr_authendication: item?.ivr_authendication,
          carrier_name: item.carrier_name,
          group_name: item.group_name,
          redirect_group_name: item.redirect_group_name
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
                        <div className="cntnt_title">
                          <h3>Destination</h3>
                          {/* <p>
                            Use this to monitor and interact with the call bock.
                          </p> */}
                        </div>

                        <ThemeProvider theme={theme}>
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              className="custom_header_redirect"
                              rows={rows}
                              columns={columns}
                              density="compact"
                              // getRowClassName={(params) =>
                              //   isRowBordered(params)
                              //     ? "borderedGreen"
                              //     : "borderedRed"
                              // }
                              components={{ Toolbar: GridToolbar }}
                              slots={{
                                toolbar: CustomToolbar,
                              }}
                              autoHeight // Automatically adjust the height to fit all rows
                            />
                          </div>
                        </ThemeProvider>


                          {/* -----   Edit Campaign Modal Start   ----- */}
                             
                          <Dialog
                            open={edit}
                            onClose={handleEditClose}
                            sx={{ textAlign: "center" }}
                          > 
                           <Box>
                <IconButton
                  onClick={handleEditClose}
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
               
                Update Destination
              </DialogTitle>


                            <DialogContent>
                            <form>

<form style={{ textAlign: "center" }}>
  <TextField
    style={{
      width: "100%",
      margin: " 5px 0 5px 0",
    }}
    type="text"
    label="Destination"
    variant="outlined"
    name="destination"
    value={destination}
    onChange={handleChange}
    padding={"0px 0 !important"}
    disabled
  />
  <br />
  <FormControl
    fullWidth
    style={{ width: "100%", margin: "7px 0" }}
  >
    <InputLabel id="demo-simple-select-label">
      IVR Authentication
    </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="IVR Authentication"
      helperText="Select the language."
      style={{ textAlign: "left" }}
      value={ivrAuthentication}
      onChange={(e) => {
        setIvrAuthentication(e.target.value);
      }}
      required
    >
      <MenuItem value={"true"}>true</MenuItem>
      <MenuItem value={"false"}>false</MenuItem>
    </Select>
  </FormControl>

  <FormControl
      fullWidth
      style={{
        width: "100%",
        margin: "7px 0",
      }}
    >
      <InputLabel id="demo-simple-select-label">
        Status
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Status"
        helperText="Select the language."
        style={{ textAlign: "left" }}
        value={status}
      onChange={(e) =>
        setStatus(e.target.value)
      }
        required
      >
        <MenuItem value={true}>Active</MenuItem>
        <MenuItem value={false}>Deactive</MenuItem>
      </Select>
    </FormControl>

  <FormControl
          style={{
            width: "100%",
            margin: " 5px 0 5px 0",
          }}
        >
          <InputLabel id="demo-multiple-checkbox-label">
            Ring groups
          </InputLabel>
          <Select
            style={{ textAlign: "left" }}
            labelId="demo-multiple-checkbox-label"
            label="Ring groups"
            id="demo-multiple-checkbox"
            fullWidth
            value={redirectGroup}
            onChange={(e) =>
              setRedirectGroup(e.target.value)
            }
            input={
              <OutlinedInput label="Ring groups" />
            }
            MenuProps={MenuProps}
          >
            {redirectGroupData &&
              redirectGroupData?.map((name) => (
                <MenuItem
                  key={name}
                  value={name.id}
                >
                  {name.group_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

  <FormControl
    fullWidth
    style={{ width: "100%", margin: "7px 0" }}
  >
    <InputLabel id="demo-simple-select-label">
      Recording
    </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Recording"
      helperText="Select the language."
      style={{ textAlign: "left" }}
      value={recording}
      onChange={(e) => {
        setRecording(e.target.value);
      }}
      required
    >
      <MenuItem value={"true"}>true</MenuItem>
      <MenuItem value={"false"}>false</MenuItem>
    </Select>
  </FormControl>
  <br />
  <TextField
    style={{
      width: "100%",
      margin: " 5px 0 5px 0",
    }}
    type="text"
    label="Description"
    variant="outlined"
    name="description"
    value={description}
    onChange={handleChange}
    padding={"0px 0 !important"}
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
                                  onClick={handleEditClose}
                                  autoFocus
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="all_button_clr"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    marginTop: "20px",
                                    marginLeft: "0px !important",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  variant="contained"
                                  color="primary"
                                  onClick={handleUpdate}
                                >
                                  Update
                                </Button>
                                </DialogActions>
                          </Dialog>

                          {/* -----   Edit Campaign Modal End   ----- */}
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

export default Destination;
