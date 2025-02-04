import React, { useEffect } from "react";
import "../../../src/style.css";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getRedirectBillingHistory } from "../../redux/actions/redirectPortal/redirectPortal_billingHistoryAction";
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
        exportButton: true,
      },
    },
  },
});
function MinutesLog({userThem}) {
  const state = useSelector((state)=>state)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getRedirectBillingHistory())
  },[])

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
    {
      field: "added_by",
      headerName: "Added By",
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
    {
      field: "topup",
      headerName: "TopUp Minutes",
      flex: 1,
      //cellClassName: "name-column--cell",
      //headerClassName: 'super-app-theme--header'
      headerClassName: "redirect_custom-header",
      // editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "added_date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header-redirect",
      //valueFormatter
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          var formattedDate =
            day +
            "/" +
            month +
            "/" +
            year +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },
  ];

  const mockDataTeam = [];
  state?.getRedirectBillingHistory?.RedirectBillingHistory?.data &&
    state?.getRedirectBillingHistory?.RedirectBillingHistory?.data?.forEach(
      (item, index) => {
        mockDataTeam.push({
          id: index + 1,
          added_by: item.added_by,
          added_date: item.added_date,
          topup: item.topup,
          user_id: item.user_id,
          username: item.username,
          billingId: item.id
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
                          <h3>Minute Logs</h3>
                          {/* <p>
                            Assign Minutes Details (AMDs) are detailed
                            information on the calls. Use the fields to filter
                            the information for the specific assign Minutes that
                            are desired. Records in the minutes list can be
                            saved locally using the Export button.
                          </p> */}
                        </div>

                        <ThemeProvider theme={theme}>
                        <div style={{ height: "100%", width: "100%" }}>
                          <DataGrid
                          className="custom_header_redirect"
                            rows={mockDataTeam}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
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

export default MinutesLog;
