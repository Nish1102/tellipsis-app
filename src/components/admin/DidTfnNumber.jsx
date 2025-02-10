import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Close, Delete, Edit, PlayArrow, Style } from "@mui/icons-material";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Fade,
  Modal,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getDid,
  createDestination,
  updateDestination,
  updateAssignment,
  getAdminRedirectGroups,
} from "../../redux/actions/destinationAction";
import { getExtension } from "../../redux/actions/extensionAction";
import { getAllUsers } from "../../redux/actions/userAction";
import { makeStyles } from "@mui/styles";
import { api } from "../../mockData";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  getAdminResellersList,
  getAdminUsersList,
} from "../../redux/actions/adminPortal_listAction";
import dayjs from "dayjs";
const drawerWidth = 240;
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

const useStyles = makeStyles({
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
});

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
// const names = ["Redirect", "Manage", "Sip"];
const names = ["Manage"];
const sub_type = ["Extension", "Queue"];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function DID_TFN_number({ colorThem }) {
  const state = useSelector((state) => state);
  const token = JSON.parse(localStorage.getItem("admin"));
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("admin"));
  const [selectedValue, setSelectedValue] = useState("t");
  const [ivrAuthentication, setIvrAuthentication] = useState("");
  const [suspendValue, setSuspendValue] = useState(0);
  const [subType, setSubType] = useState("");
  const [didId, setDidId] = useState("");
  const [destinationDescription, setDestinationDescription] = useState("");
  const [destinationAction, setDestinationAction] = useState([]);
  const [openimport, setOpenImport] = React.useState(false);
  const [file, setFile] = useState();
  const [redirectGroup, setRedirectGroup] = useState("");
  const [redirectGroupData, setRedirectGroupData] = useState([]);
  const [userUuid, setUserUuid] = useState("");
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = useState("");
  const [edit, setEdit] = useState(false);
  const [tfnNumber, setTfnNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [radioValue, setRadioValue] = useState("t");
  const [clientName, setClientName] = useState("");
  const [maxCall, setMaxCall] = useState("");
  const [recording, setRecording] = useState(false);
  const [resellerUsersData, setResellerUsersData] = useState([]);
  const [extensionNumber, setExtensionNumber] = useState([]);
  const [queueName, setQueueName] = useState("");
  const [queue, setQueue] = useState([]);
  const [carrierName, setCarrierName] = useState("");
  const [resellerId, setResellerId] = useState("");
  const [resellerUsers, setResellerUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [resellers, setResellers] = useState([]);

  const [validation, setValidation] = useState({
    tfnNumber: "",
    userId: "",
    serviceType: "",
    recording: "",
    selectedValue: "",
    carrierName: "",
  });
  useMemo(() => {
    setRedirectGroupData(state.getRedirectGroup.redirectGroup);
  }, [state.getRedirectGroup.redirectGroup]);

  const handleOpen = () => setOpen(true);
  const classes = useStyles();

  const handleClick = () => {
    window.open("/file/upload_destination_number.csv", "_blank");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedValue("");
    setTfnNumber("");
    setClientName("");
    setMaxCall("");
    setDestinationAction([]);
    setUserUuid("");
    setDestinationDescription("");
    setRecording("");
    setExtensionNumber([]);
    setQueue([]);
    setQueueName("");
    setSubType("");
    setUserId("");
    setCarrierName("");
    setValidation({
      tfnNumber: "",
      userId: "",
      serviceType: "",
      recording: "",
      selectedValue: "",
      carrierName: "",
    });
    setResellerId("");
    setRedirectGroupData([]);
    setRedirectGroup("");
  };

  const handleEditOpen = () => setEdit(true);

  const handleEditClose = () => {
    setEdit(false);
    setSelectedValue("");
    setTfnNumber("");
    setClientName("");
    setMaxCall("");
    setDestinationAction([]);
    setDestinationDescription("");
    setRecording("");
    setQueue([]);
    setQueueName("");
    setSubType("");
    setUserId("");
    setSuspendValue("");
    setCarrierName("");
    setValidation({
      tfnNumber: "",
      userId: "",
      serviceType: "",
      recording: "",
      selectedValue: "",
      carrierName: "",
    });
    setResellerId("");
    setRedirectGroupData([]);
    setRedirectGroup("");
    setIvrAuthentication("");
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const checkValidation = useCallback(() => {
    let errors = { ...validation };
    let isValid = true;

    if (!tfnNumber) {
      errors.tfnNumber = "Field is required";
      isValid = false;
    } else {
      errors.tfnNumber = "";
    }

    if (!carrierName) {
      errors.carrierName = "Field is required";
      isValid = false;
    } else {
      errors.carrierName = "";
    }

    setValidation(errors);
    return isValid;
  }, [
    validation,
    tfnNumber,
    userId,
    recording,
    selectedValue,
    carrierName,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = checkValidation();
    if (isValid) {
      let data = JSON.stringify({
        user_id: userId,
        reseller_id: resellerId,
        didnumber: tfnNumber,
        description: destinationDescription,
        status: selectedValue === "t" ? true : false,
        recording: recording,
        redirect_group_id: redirectGroup,
        carrier_name: carrierName,
      });
      dispatch(createDestination(data, handleClose, setResponse));
    }
  };

  const handleUpdateAssignment = useCallback((data) => {
    //  if(data.user_id !== null){
    let form = JSON.stringify({
      id: data.did_id,
      user_id: "None",
    });
    dispatch(updateAssignment(form, setResponse));

    // }
  }, []);

  const handleEdit = (data) => {
    handleEditOpen();
    setTfnNumber(data?.tfn_number);
    setClientName(data?.user_uuid);
    setMaxCall(data?.max_call);
    setSelectedValue(data?.status === true ? "t" : "f");
    setDestinationAction(data?.details);
    setCarrierName(data?.carrier_name);
    setDestinationDescription(data?.description);
    setDidId(data?.did_id);
    setRecording(data?.recording.toString());
    setUserId(data.user_id);
    setResellerId(data?.reseller_id === null ? "" : data?.reseller_id);
   setRedirectGroup(data.redirect_group_id);
   setIvrAuthentication(data.ivr_authendication);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const isValid = checkValidation();
    if (isValid) {
      let data = JSON.stringify({
        description: destinationDescription,
        status: selectedValue === "t" ? true : false,
        id: didId,
        user_id: userId,
        recording: recording,
        carrier_name: carrierName,
        reseller_id: resellerId,
        didnumber: tfnNumber,
        redirect_group_id: redirectGroup,
        ivr_authendication: ivrAuthentication
      });

      dispatch(
        updateDestination(
          data,
          setResponse,
          handleEditClose,
        )
      );
    }
  };

  // ======import

  const handleOpenImport = () => setOpenImport(true);
  const handleCloseImport = () => setOpenImport(false);

  // =======import-end

  const handleOnChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const token = JSON.parse(localStorage.getItem("admin"));
      try {
        const response = await axios.post(
          `${api.dev}/api/import_did_from_csv`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token.access_token} `,
            },
          }
        );
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
          setResponse(response);
          handleCloseImport();
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(
            `Error: ${error.response.status} - ${error.response.data.message}`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            }
          );
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response from server. Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An error occurred while setting up the request.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        }
      }
    } else {
      toast.warn("Please select a file to upload.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }

  };

  useEffect(() => {
    dispatch(getDid(radioValue));
  }, [radioValue,response]);
  useEffect(() => {
    dispatch(getAdminRedirectGroups(userId));
  }, [userId]);
  useEffect(() => {
    dispatch(getExtension(""));
    dispatch(getAllUsers(""));
    dispatch(getAdminUsersList());
    dispatch(getAdminResellersList());
  }, []);
  useEffect(() => {
    if (resellerId !== "None") {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${api.dev}/api/getreselleruserlist?reseller_id=${resellerId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      axios
        .request(config)
        .then((response) => {
          setResellerUsersData(response?.data?.data);
        })
        .catch((error) => {});
    }
  }, [resellerId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "tfnNumber":
        const trimmedValue = value.trim();
        setTfnNumber(trimmedValue);
        break;
      case "clientName":
        setClientName(value);
        break;
      case "maxCall":
        const maxCall = value.trim();
        setMaxCall(maxCall);
        break;
      case "status":
        setSelectedValue(value);
        break;

      default:
        break;
    }
  };

  const isRowBordered = (params) => {
    const { row } = params;

    // Add your condition here, for example, adding border to rows where age is greater than 25
    return row.status === true;
  };

  useMemo(() => {
    if (state?.getAdminUsersList?.userList) {
      const usersArray = Object.keys(state?.getAdminUsersList?.userList)?.map(
        (key) => ({
          user_id: key,
          username: state?.getAdminUsersList?.userList[key],
        })
      );
      setUsers(usersArray);
    }
    if (state?.getAdminResellersList?.resellerList) {
      const resellerArray = Object.keys(
        state?.getAdminResellersList?.resellerList
      )?.map((key) => ({
        reseller_id: key,
        username: state?.getAdminResellersList?.resellerList[key],
      }));
      setResellers(resellerArray);
    }

    if (resellerUsersData) {
      const usersArray = Object.keys(resellerUsersData)?.map((key) => ({
        user_id: key,
        username: resellerUsersData[key],
      }));
      setResellerUsers(usersArray);
    }
  }, [
    state?.getAdminUsersList?.userList,
    state?.getAdminResellersList?.resellerList,
    resellerUsersData,
  ]);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 70,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {user.user_role === "Reseller" ? (
              <></>
            ) : (
              <>
               <Tooltip title="Edit" disableInteractive interactive>
            <IconButton onClick={() => handleEdit(params.row)}>
              <Edit
                index={params.row.id}
                style={{ cursor: "pointer", color: "#42765f" }}
              />
            </IconButton>
            </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: "tfn_number",
      headerName: "Destination",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "User",
      headerClassName: "custom-header",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.username}</span>
        )
      }    },
    {
      field: "resellername",
      headerName: "Reseller",
      headerClassName: "custom-header",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.resellername}</span>
        )
      }
    },
    {
      field: "redirect_group_name",
      headerName: "Campaign Name",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.redirect_group_name}</span>
        )
      }
    },
    // {
    //   field: "total_call_duration",
    //   headerName: "Total Call Duration",
    //   headerClassName: "custom-header",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },

    {
      field: "ivr_authendication",
      headerName: "IVR Authentication",
      headerClassName: "custom-header",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.ivr_authendication === true ? 'True' : 'False'}</span>
        )
      }
    },

    {
      field: "recording",
      headerName: "Recording",
      headerClassName: "custom-header",
      width: 80,
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
                    //background: "red",
                    padding: "7px",
                    borderRadius: "5px",
                   // fontSize: "12px",
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
                    //background: "green",
                    padding: "7px",
                    borderRadius: "5px",
                   // fontSize: "12px",
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
      field: "status",
      headerName: "Status",
      width: 80,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.status === true ? (
              <>
                <div
                  style={{
                    color: "green",
                    //background: "green",
                    padding: "7px",
                    borderRadius: "5px",
                  //  fontSize: "15px",
                    textTransform: "capitalize",
                   // fontWeight: "600",
                  }}
                >
                  Active
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    color: "red",
                    //   background: "red",
                    padding: "7px",
                    borderRadius: "5px",
                  //  fontSize: "15px",
                    textTransform: "capitalize",
                  //  fontWeight: "600",
                  }}
                >
                  Deactive
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
      headerClassName: "custom-header",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.description}</span>
        )
      }
    },
    {
      field: "carrier_name",
      headerName: "Carrier Name",
      headerClassName: "custom-header",
      width: 100,
      headerAlign: "left",
      align: "left",
      renderCell: (params)=>{
        return(
          <span style={{textTransform:'capitalize'}}>{params.row.carrier_name}</span>
        )
      }
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      headerClassName: "custom-header",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        // Parse the date string and format it
        const dateTimeString = params.value; // e.g., "2024:10:11 12:41:56"
        const formattedString = dateTimeString
        ?.replace(/:/g, '-')                // Change to "2024-10-11 12-41-56"
        ?.replace(/-(\d{2})-(\d{2})$/, ':$1:$2'); // Change to "2024-10-11 12:41:56"
        const formattedDate = dayjs(formattedString).format('DD/MM/YYYY');
        const formattedTime = dayjs(formattedString).format('HH:mm:ss');
  
        return (
          <span>
            <span style={{ color: 'green' }}>{formattedDate}</span>{' '}
            <span style={{ color: 'blue' }}>{formattedTime}</span>
          </span>
        );
      },
    },

    {
      field: "updated_at",
      headerName: "Update Date",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        // Parse the date string and format it
        const dateTimeString = params?.value; // e.g., "2024:10:11 12:41:56"
        const formattedString = dateTimeString
        ?.replace(/:/g, '-')                // Change to "2024-10-11 12-41-56"
        ?.replace(/-(\d{2})-(\d{2})$/, ':$1:$2'); // Change to "2024-10-11 12:41:56"
        const formattedDate = dayjs(formattedString).format('DD/MM/YYYY');
        const formattedTime = dayjs(formattedString).format('HH:mm:ss');
  
        return (
          <span>
            <span style={{ color: 'brown' }}>{formattedDate}</span>{' '}
            <span style={{ color: 'blue' }}>{formattedTime}</span>
          </span>
        );
      },
    },

  
  ];
  const rows = useMemo(() => {
    const calculatedRows = [];
    state?.allDid?.alldid &&
      state?.allDid?.alldid?.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          did_id: item?.id,
          tfn_number: item?.didnumber,
          username: item?.username,
          record: item?.destination_record,
          created_at: item?.created_at,
          updated_at: item?.updated_at,
          extension: item?.destination_actions,
          status: item?.status,
          description: item?.description,
          recording: item.recording,
          user_id: item.user_id,
          reseller_id: item.reseller_id,
          reseller_name: item.reseller_name,
          carrier_name: item.carrier_name,
          total_call_duration: item.total_call_duration,
          Assignment: item.Assignment,
          redirect_group_id: item.redirect_group_id,
          resellername: item.resellername,
          group_name: item.group_name,
          ivr_authendication: item.ivr_authendication,
          redirect_group_name: item.redirect_group_name
        });
      });
    return calculatedRows;
  }, [state?.allDid?.alldid]);

  return (
    <>
      <div className={`App ${colorThem} `}>
        <div className="contant_box">
          <Box
            className="right_sidebox mobile_top_pddng"
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
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
                        <div className="">
                          <div
                            className="cntnt_title"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "end",
                            }}
                          >
                            <div>
                              <h3>Destination</h3>
                              {/* <p>
                                Inbound destinations are the DID/DDI, DNIS or
                                Alias for inbound calls.
                              </p> */}
                            </div>
                            <div className="d-xxl-block d-xl-block d-lg-block d-md-block d-sm-none d-none">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                position: "relative",
                                top: "0",
                              }}
                              
                            >
                         
                              {/* import */}
                              {user.user_role === "Reseller" ? (
                                <></>
                              ) : (
                                <>
                                  <Typography
                                    onClick={handleClick}
                                    target="_blank"
                                    className="hover-content"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <IconButton>
                                      <FileDownloadIcon />
                                    </IconButton>
                                  </Typography>

                                  <div
                                    className="n-ppost"
                                    style={{ paddingRight: "20px" }}
                                  >
                                    Sample
                                  </div>
                                  <img
                                    className="n-ppost-name"
                                    src="https://i.ibb.co/rMkhnrd/sample2.png"
                                    alt="Image"
                                  />

                                  <div>
                                    <IconButton
                                      className="all_button_clr"
                                      onClick={handleOpenImport}
                                    >
                                      Import <ImportExportIcon />
                                    </IconButton>
                                  </div>
                                </>
                              )}
   
                              <Modal
                                open={openimport}
                                onClose={handleCloseImport}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                              >
                                <Fade in={openimport} className="bg_imagess">
                                  <Box
                                    sx={style}
                                    borderRadius={"10px"}
                                    textAlign={"center"}
                                  >
                                    <IconButton
                                      onClick={handleCloseImport}
                                      sx={{ float: "inline-end" }}
                                    >
                                      <Close />
                                    </IconButton>
                                    <br />
                                    <br />
                                    <img
                                      src="/img/import-icon.png"
                                      alt="import"
                                      style={{ borderRadius: "30px" }}
                                    />

                                    <form
                                      style={{
                                        textAlign: "center",
                                        height: "auto",
                                        overflow: "auto",
                                        paddingTop: "10px",
                                        padding: "20px",
                                      }}
                                    >
                                      <Typography
                                        id="transition-modal-title"
                                        variant="h6"
                                        component="h2"
                                        color={"#092b5f"}
                                        fontSize={"18px"}
                                        fontWeight={"600"}
                                      >
                                        Import File
                                      </Typography>

                                      <br />
                                      <input
                                        style={{
                                          //width: "100%",
                                          margin: "7px 0",
                                          textAlign: "center !important",
                                        }}
                                        type={"file"}
                                        // id={"csvFileInput"}
                                        // accept={".csv"}
                                        onChange={handleOnChange}
                                      />
                                      <br />
                                      <br />

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
                                          textTransform:
                                            "capitalize !important",
                                        }}
                                        onClick={handleCloseImport}
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
                                          textTransform:
                                            "capitalize !important",
                                        }}
                                        //onClick={handleSubmit}
                                        onClick={(e) => {
                                          handleOnSubmit(e);
                                        }}
                                      >
                                        Submit
                                      </Button>
                                    </form>
                                  </Box>
                                </Fade>
                              </Modal>
                              {/* import-end */}

                              {/* ==Add-modal== */}

                              {user.user_role === "Reseller" ? (
                                <></>
                              ) : (
                                <>
                                  {" "}
                                  <div>
                                    <IconButton
                                      className="all_button_clr"
                                      onClick={handleOpen}
                                    >
                                      Add <AddOutlinedIcon />
                                    </IconButton>
                                  </div>
                                </>
                              )}


                              {/* -----   Add Campaigns Modal Start   ----- */}

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
                          
                          Add DID
                          </DialogTitle>
                            <DialogContent>
                              <form>
                              <form
                                      style={{
                                        textAlign: "center",
                                        height: "348px",
                                       // overflow: "auto",
                                        paddingTop: "10px",
                                        padding: "20px",
                                      }}
                                    >
                                      <TextField
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                        type="text"
                                        label="DID Number"
                                        variant="outlined"
                                        name="tfnNumber"
                                        value={tfnNumber}
                                        onChange={(e) => {
                                          const numericValue =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          setTfnNumber(numericValue);
                                        }}
                                        inputProps={{
                                          inputMode: "numeric",
                                          // pattern: '[0-9]*',
                                        }}
                                      />
                                      {validation.tfnNumber && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.tfnNumber}
                                        </p>
                                      )}

                                      <FormControl
                                        fullWidth
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                        className={classes.formControl}
                                      >
                                        <InputLabel id="demo-simple-select-label">
                                          Reseller
                                        </InputLabel>

                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Reseller"
                                          helperText="Select the language."
                                          style={{ textAlign: "left" }}
                                          value={resellerId}
                                          onChange={(e) => {
                                            setResellerId(e.target.value);
                                          }}
                                          required
                                        >
                                          <MenuItem value={""}>none</MenuItem>
                                          {resellers?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?.reseller_id}
                                              >
                                                {item.username}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </FormControl>

                                      <br />
                                      {resellerId === "" ? (
                                        <>
                                          <FormControl
                                            fullWidth
                                            style={{
                                              width: "100%",
                                              margin: "7px 0",
                                            }}
                                          >
                                            <InputLabel id="demo-simple-select-label">
                                              UserName
                                            </InputLabel>

                                            <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              label="UserName"
                                              helperText="Select the language."
                                              style={{ textAlign: "left" }}
                                              value={userId}
                                              onChange={(e) => {
                                                setUserId(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={""}>
                                                none
                                              </MenuItem>
                                              {users?.map((item, index) => {
                                                return (
                                                  <MenuItem
                                                    key={index}
                                                    value={item?.user_id}
                                                  >
                                                    {item.username}
                                                  </MenuItem>
                                                );
                                              })}
                                            </Select>
                                          </FormControl>
                                          {validation.userId && (
                                            <p
                                              className="mb-0"
                                              style={{
                                                color: "red",
                                                textAlign: "left",
                                              }}
                                            >
                                              {validation.userId}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <FormControl
                                            fullWidth
                                            style={{
                                              width: "100%",
                                              margin: "7px 0",
                                            }}
                                          >
                                            <InputLabel id="demo-simple-select-label">
                                              UserName
                                            </InputLabel>

                                            <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              label="UserName"
                                              helperText="Select the language."
                                              style={{ textAlign: "left" }}
                                              value={userId}
                                              onChange={(e) => {
                                                setUserId(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={""}>
                                                none
                                              </MenuItem>
                                              {resellerUsers?.map(
                                                (item, index) => {
                                                  return (
                                                    <MenuItem
                                                      key={index}
                                                      value={item?.user_id}
                                                    >
                                                      {item.username}
                                                    </MenuItem>
                                                  );
                                                }
                                              )}
                                            </Select>
                                          </FormControl>
                                          {validation.userId && (
                                            <p
                                              className="mb-0"
                                              style={{
                                                color: "red",
                                                textAlign: "left",
                                              }}
                                            >
                                              {validation.userId}
                                            </p>
                                          )}
                                        </>
                                      )}

                                      <FormControl
                                        style={{
                                          width: "100%",
                                          margin: " 5px 0 5px 0",
                                        }}
                                      >
                                        <InputLabel id="demo-multiple-checkbox-label">
                                          Campaign Name
                                        </InputLabel>
                                        <Select
                                          style={{ textAlign: "left" }}
                                          labelId="demo-multiple-checkbox-label"
                                          label="Campaign Name"
                                          id="demo-multiple-checkbox"
                                          fullWidth
                                          value={redirectGroup}
                                          onChange={(e) =>
                                            setRedirectGroup(e.target.value)
                                          }
                                          input={
                                            <OutlinedInput label=" Campaign Name" />
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

                                      <br />

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
                                          value={selectedValue}
                                          onChange={handleSelectChange}
                                          required
                                        >
                                          <MenuItem value={"t"}>
                                            Active
                                          </MenuItem>
                                          <MenuItem value={"f"}>
                                            Deactive
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                      {validation.selectedValue && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.selectedValue}
                                        </p>
                                      )}

                                      <br />
                                      <FormControl
                                        fullWidth
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
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
                                          <MenuItem value={true}>
                                            true
                                          </MenuItem>
                                          <MenuItem value={false}>
                                            false
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                      {validation.recording && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.recording}
                                        </p>
                                      )}

                                      <br />
                                      <TextField
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                        type="text"
                                        label="Carrier Name"
                                        variant="outlined"
                                        name="carrier_name"
                                        value={carrierName}
                                        onChange={(e) => {
                                          setCarrierName(e.target.value);
                                        }}
                                      />
                                      {validation.carrierName && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.carrierName}
                                        </p>
                                      )}

                                      <br />

                                      <TextField
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                        type="text"
                                        label="Description"
                                        variant="outlined"
                                        name="destinationDescription"
                                        value={destinationDescription}
                                        onChange={(e) => {
                                          setDestinationDescription(
                                            e.target.value
                                          );
                                        }}
                                      />
                                      <br />
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


                              {/* -----   Add Campaigns Modal End   ----- */}
                            </div>
                            </div>
                           
                          </div>
                           {/* mobile_view_start */}
                           <div className="d-xxl-none d-xl-none d-lg-none d-md-none d-sm-block d-block">
                           <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:'space-between',
                                position: "relative",
                                top: "0",
                              }}
                             
                            >
                         
                              {/* import */}
                              {user.user_role === "Reseller" ? (
                                <></>
                              ) : (
                                <>
                                  <Typography
                                    onClick={handleClick}
                                    target="_blank"
                                    className="hover-content"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <IconButton>
                                      <FileDownloadIcon />
                                    </IconButton>
                                  </Typography>

                                  <div
                                    className="n-ppost"
                                    style={{ paddingRight: "20px" }}
                                  >
                                    Sample
                                  </div>
                                  <img
                                    className="n-ppost-name"
                                    src="https://i.ibb.co/rMkhnrd/sample2.png"
                                    alt="Image"
                                  />

                                  <div>
                                    <IconButton
                                      className="all_button_clr"
                                      onClick={handleOpenImport}
                                    >
                                      Import <ImportExportIcon />
                                    </IconButton>
                                  </div>
                                </>
                              )}
   
                              
                              {/* import-end */}

                              {/* ==Add-modal== */}

                              {user.user_role === "Reseller" ? (
                                <></>
                              ) : (
                                <>
                                  {" "}
                                  <div>
                                    <IconButton
                                      className="all_button_clr"
                                      onClick={handleOpen}
                                    >
                                      Add <AddOutlinedIcon />
                                    </IconButton>
                                  </div>
                                </>
                              )}


                          
                            </div>
                            </div>
                            {/* mobile_view_end */}
                       
                          <div>
                  <FormControl>
                    {/* <FormLabel id="demo-row-radio-buttons-group-label">Live Calls</FormLabel> */}
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={radioValue} // Bind the selected value to state
                     onChange={(e) => setRadioValue(e.target.value)} // Handle change event
                    >
                      <FormControlLabel
                        value=""
                        control={<Radio />}
                        label="All"
                      />
                      <FormControlLabel
                        value="t"
                        control={<Radio />}
                        label="Active"
                      />
                      <FormControlLabel
                        value="f"
                        control={<Radio />}
                        label="Deactivated"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                          <ThemeProvider theme={theme}>
                            <div style={{ height: "100%", width: "100%" }}>
                              <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowClassName={(params) =>
                                  isRowBordered(params)
                                    ? "borderedGreen"
                                    : "borderedRed"
                                }
                                components={{ Toolbar: GridToolbar }}
                                slots={{
                                  toolbar: CustomToolbar,
                                }}
                                autoHeight // Automatically adjust the height to fit all rows
                              />
                            </div>
                          </ThemeProvider>
                          {/* </>
                      )} */}

                          {/* -----   Edit Campaign Modal Start   ----- */}
                             

                          <Dialog
                            open={edit}
                            sx={{ textAlign: "center" }}
                          >
                          <Box
                         
                          >
                            <IconButton
                              onClick={handleEditClose}
                              sx={{ float: "inline-end",
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
                            sx={{ color: "#133325", fontWeight: "600", width: "500px", margin:'auto',
                            float: "inline-end",
                            //position:'relative',right:'1rem',top:'1rem' 
                             }}
                           
                          >
                          
                          Updated Destination
                          </DialogTitle>
                            <DialogContent>
                              <form>
                              <form
                                  style={{
                                    textAlign: "center",
                                   // overflow: "auto",
                                    height: "348px",
                                    padding: "20px",
                                  }}
                                >
                                  <TextField
                                    style={{
                                      width: "100%",
                                      margin: " 5px 0 5px 0",
                                    }}
                                    type="number"
                                    label="DID Number"
                                    variant="outlined"
                                    name="tfnNumber"
                                    value={parseInt(tfnNumber)}
                                    onChange={handleChange}
                                    padding={"0px 0 !important"}
                                  />

                                  <FormControl
                                    fullWidth
                                    style={{ width: "100%", margin: "7px 0" }}
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      Reseller
                                    </InputLabel>

                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Reseller"
                                      helperText="Select the language."
                                      style={{ textAlign: "left" }}
                                      value={resellerId}
                                      onChange={(e) => {
                                        setResellerId(e.target.value);
                                      }}
                                      required
                                    >
                                      <MenuItem value="">none</MenuItem>
                                      {resellers?.map((item, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={item?.reseller_id}
                                          >
                                            {item.username}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>

                                  {resellerId === "" ? (
                                    <>
                                      <FormControl
                                        fullWidth
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                      >
                                        <InputLabel id="demo-simple-select-label">
                                          UserName
                                        </InputLabel>

                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="UserName"
                                          helperText="Select the language."
                                          style={{ textAlign: "left" }}
                                          value={userId}
                                          onChange={(e) => {
                                            setUserId(e.target.value);
                                          }}
                                        >
                                          <MenuItem value={""}>none</MenuItem>
                                          {users?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?.user_id}
                                              >
                                                {item.username}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </FormControl>
                                      {validation.userId && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.userId}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <FormControl
                                        fullWidth
                                        style={{
                                          width: "100%",
                                          margin: "7px 0",
                                        }}
                                      >
                                        <InputLabel id="demo-simple-select-label">
                                          UserName
                                        </InputLabel>

                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="UserName"
                                          helperText="Select the language."
                                          style={{ textAlign: "left" }}
                                          value={userId}
                                          onChange={(e) => {
                                            setUserId(e.target.value);
                                          }}
                                        >
                                          <MenuItem value={""}>none</MenuItem>
                                          {resellerUsers?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?.user_id}
                                              >
                                                {item.username}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </FormControl>
                                      {validation.userId && (
                                        <p
                                          className="mb-0"
                                          style={{
                                            color: "red",
                                            textAlign: "left",
                                          }}
                                        >
                                          {validation.userId}
                                        </p>
                                      )}
                                    </>
                                  )}

<FormControl
                                        style={{
                                          width: "100%",
                                          margin: " 5px 0 5px 0",
                                        }}
                                      >
                                        <InputLabel id="demo-multiple-checkbox-label">
                                        Campaign Name
                                        </InputLabel>
                                        <Select
                                          style={{ textAlign: "left" }}
                                          labelId="demo-multiple-checkbox-label"
                                          label="Campaign Name"
                                          id="demo-multiple-checkbox"
                                          fullWidth
                                          value={redirectGroup}
                                          onChange={(e) =>
                                            setRedirectGroup(e.target.value)
                                          }
                                          input={
                                            <OutlinedInput label="Campaign Name" />
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
                                      <MenuItem value={true}>true</MenuItem>
                                      <MenuItem value={false}>false</MenuItem>
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
                                      value={selectedValue}
                                      onChange={handleSelectChange}
                                      required
                                    >
                                      <MenuItem value={"t"}>Active</MenuItem>
                                      <MenuItem value={"f"}>Deactive</MenuItem>
                                    </Select>
                                  </FormControl>

                                  <br />

                                  <TextField
                                    style={{
                                      width: "100%",
                                      margin: "7px 0",
                                    }}
                                    type="text"
                                    label="Carrier Name"
                                    variant="outlined"
                                    name="carrier_name"
                                    value={carrierName}
                                    onChange={(e) => {
                                      setCarrierName(e.target.value);
                                    }}
                                    required
                                  />
                                  {validation.carrierName && (
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "red",
                                        textAlign: "left",
                                      }}
                                    >
                                      {validation.carrierName}
                                    </p>
                                  )}
                                  <br />

                                  <TextField
                                    style={{ width: "100%", margin: "7px 0" }}
                                    type="text"
                                    label="Description"
                                    variant="outlined"
                                    name="destinationDescription"
                                    value={destinationDescription}
                                    onChange={(e) => {
                                      setDestinationDescription(e.target.value);
                                    }}
                                  />
                                  <br />
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
                <div></div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default DID_TFN_number;
