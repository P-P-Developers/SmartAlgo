import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import { dateFormate } from "../common/CommonDateFormate";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { Form } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { maskEmail, maskNumber } from "../common/HideWithStar";


const adminId = localStorage.getItem("adminId");


const ClientList = () => {

  const [refreshscreen, setRefreshscreen] = useState(true);
  const [clients, setClients] = useState([]);
  const [forPermission, setForPermission] = useState([])
  const [tableData, settableData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [all, setAll] = useState('')
  const [loader, setLoader] = useState(false);
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  // const goto_dashboard = localStorage.getItem("goto_dashboard");
  // const license_permission = localStorage.getItem("license_permission");
  // const group_permission = localStorage.getItem("group_permission");
  // const edit_live = localStorage.getItem("edit_live");
  // const add__edit_live = localStorage.getItem("add__edit_live");
  // const strategy_permission = localStorage.getItem("strategy_permission");


  const { id } = useParams()

  const columns = [
    {
      name: <h6>Name</h6>,
      selector: (row) => row.full_name,
      width: "180px !important",
    },
    {
      name: <h6>Username</h6>,
      selector: (row) => row.username,
      width: "180px !important",
    },
    {
      name: <h6>Mobile</h6>,
      selector: (row) => forPermission.clientnumber_permission == 1 ? row.mobile : maskNumber(row.mobile),
      // selector: (row) => maskNumber(row.mobile),
      width: "180px !important",
    },
    {
      name: <h6>Email</h6>,
      selector: (row) => forPermission.clientnumber_permission == 1 ? row.email : maskEmail(row.email),
      // selector: (row) => maskEmail(row.email),
      width: "200px !important",
    },
    // {
    //   name: <h6>Broker</h6>,
    //   selector: (row) => row.broker == '' ? "__" : row.broker,
    // },
    // {
    //   name: <h6>Live/Demo</h6>,
    //   selector: (row) => row.licence_type,
    // },
    {
      name: <h6>Created On</h6>,
      selector: (row) => row.created_at,
      width: "120px !important",
    },
    {
      name: <h6>Expired On</h6>,
      selector: (row) =>
        // row.end_date ,
        row.end_date.includes('00:00:00') ? row.end_date.split(' ')[0] : row.end_date,
      width: "120px !important",
    },
    {
      name: <h6>Month</h6>,
      selector: (row) => row.licence_type == "Demo" ? "Demo" : row.twoday_service == 1 && row.to_month == 0 ? "2 Days" : row.to_month,
    },
    {
      name: <h6>Status</h6>,
      cell: (row) => (
        <>
          <Form.Check
            type="switch"
            id="custom-switch"
            className={row.status_term === "1" ? "" : "d-none"}
            defaultChecked={row.status === '1' ? true : false}
            onClick={e => { setToggleSwitch(e, row) }}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <h6>Client Dashboard</h6>,
      width: '180px !important',
      selector: (row) => (
        <>

          {forPermission.goto_dashboard == 0 ? "-" :  

            <button 
              className="btn btn-new-block"
              style={row.login_status == 0 ? { backgroundColor: "#FF0000" } : { backgroundColor: "#008000" }}
              onClick={() => goToDashboard(row.id)}
            >
              Go To Dashboard
            </button>
          }
        </>
        // `${Config.panel_name}` == 'adonomist' || `${Config.panel_name}` == 'smartalgo' ?
        //   row.status_term === "1" ?
        //     <>
        //       <button
        //         className="btn btn-new-block btn-color"
        //         onClick={() => goToDashboard(row.id)}
        //       >
        //         Go To Dashboard
        //       </button>
        //     </>
        //     : " - "
        //   : <>
        //     <button
        //       className="btn btn-new-block btn-color"
        //       onClick={() => goToDashboard(row.id)}
        //     >
        //       Go To Dashboard
        //     </button>
        //   </>
      ),
    },
    {
      name: <h6>Actions</h6>,
      cell: (row) => (
        <>
          {
            <>
              {


              }
            </>
          }


          {
            forPermission.api_update == 0 ?
              
              forPermission.editClient_live == 1 ?
                    
                <NavLink to={("/admin/client/" + row.id)}>
                  <i
                    className="fa-solid fa-pen-to-square fs-5 edit_hover"
                    variant="primary"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Edit Client"
                  ></i>
                </NavLink> :

                <i
                  className={row.licence_type === "Live" ? 'fa-solid fa-trash fs-5 mx-3 hover d-none' : "fa-solid fa-trash fs-5 mx-3 hover"}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Delete Client"
                  onClick={() => onShowClick(row.id)}
                ></i> :

              row.licence_type == "Demo" ?
                (
                  <i
                    className={"fa-solid fa-trash fs-5 mx-3 hover"}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Delete Client"
                    onClick={() => onShowClick(row.id)}
                  ></i>
                )
                :
                <NavLink to={("/admin/client/" + row.id)}>
                  <i
                    className="fa-solid fa-pen-to-square fs-5 edit_hover"
                    variant="primary"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Edit Client"
                  ></i>
                </NavLink>
          }

        </>
      ),
      //   cell:(row)  => row.licence_type == "Demo"  ?  ""  : ( <>
      //   {
      //     <>
      //       {

      //         forPermission.editClient_live == 0 ? "" :
      //           <NavLink to={("/admin/client/" + row.id)}>
      //             <i
      //               className="fa-solid fa-pen-to-square fs-5 edit_hover"
      //               variant="primary"
      //               data-toggle="tooltip"
      //               data-placement="top"
      //               title="Edit Client"
      //             ></i>
      //           </NavLink>
      //       }
      //     </>
      //   }
      //   {/* {
      //     row.licence_type === "Live" ? '' :
      //       <>

      //         {`${Config.panel_name}` == 'growtechitsolutions' ? "" :
      //           <NavLink
      //             // to={"/admin/client/" + row.id}
      //             to={(row.licence_type === "Live" && `${Config.panel_name}` == 'adonomist') ? { pointerEvents: 'none' } : ("/admin/client/" + row.id)}
      //           >

      //             {`${Config.panel_name}` == 'adonomist' || `${Config.panel_name}` == 'smartalgo' || `${Config.panel_name}` == 'winningturtle'
      //               ?
      //               row.status_term === "1" ?
      //                 <> <i
      //                   className="fa-solid fa-pen-to-square fs-5 edit_hover"
      //                   variant="primary"
      //                   data-toggle="tooltip"
      //                   data-placement="top"
      //                   title="Edit Client"
      //                 ></i>
      //                 </>
      //                 : "-"
      //               : <>
      //                 <i
      //                   className="fa-solid fa-pen-to-square fs-5 edit_hover"
      //                   variant="primary"
      //                   data-toggle="tooltip"
      //                   data-placement="top"
      //                   title="Edit Client"
      //                 ></i></>
      //             }
      //           </NavLink>
      //         }
      //       </>
      //   } */}

      //   {
      //     forPermission.api_update ==  0  ? 
      //     <i
      //     className={row.licence_type === "Live" ? 'fa-solid fa-trash fs-5 mx-3 hover d-none' : "fa-solid fa-trash fs-5 mx-3 hover"}
      //     data-toggle="tooltip"
      //     data-placement="top"
      //     title="Delete Client"
      //     onClick={() => onShowClick(row.id)}
      //   ></i>   : <NavLink to={("/admin/client/" + row.id)}>
      //   <i
      //     className="fa-solid fa-pen-to-square fs-5 edit_hover"
      //     variant="primary"
      //     data-toggle="tooltip"
      //     data-placement="top"
      //     title="Edit Client"
      //   ></i>
      // </NavLink>
      //   }

      // </>),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const navigate = useNavigate()
  const fileName = "ClientList";

  const setToggleSwitch = (e, row) => {

    if (window.confirm("Do you want to change status ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}admin/client/changestatus`,
        data: {
          adminId: adminId,
          id: row.id,
          status_term: row.status_term,
          to_month: row.to_month,
          status: e.target.checked === true ? "1" : "0"
        },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {
        // alert("Do you want to change status")
      })
    }
  }


  const goToDashboard = (id) => {

    axios({
      method: "get",
      url: `${Config.base_url}admin/client-dashboard/${id}`,
      headers: {
        'x-access-token': admin_token
      }

    }).then(function (response) {
      var loginStatus = response.data.msg.login_status

      if (loginStatus == 0) {
        alert("Client Is Not Login Yet")
      } else {
        navigate("/", { state: response.data.msg })
      }
    })
  }


  const onShowClick = (id) => {
    if (window.confirm("Do you want to delete this group ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}admin/client/delete`,
        data: {
          Id: id,
          adminId: adminId
        },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {
        setRefreshscreen(!refreshscreen);
      });
    }
  };

  //  get broker name
  const brokerName = (id) => {
    if (id === 0 || id == "") {
      return "__";
    } else {
      switch (id) {
        case "1":
          return "aliceBlue";
          break;
        case "2":
          return "zerodha";
          break;
        case "3":
          return "zebull";
          break;
        case "4":
          return "angel";
          break;
        case "5":
          return "5paisa";
          break;
        case "6":
          return "fyers";
          break;
        case "7":
          return "indira ";
          break;
        case "8":
          return "TradeSmartapi";
          break;
        case "9":
          return "markethub";
          break;
        case "10":
          return "mastertrust";
          break;
        case "10":
          return "smc";
          break;
      }
    }
  };




  var data = [];


  const getPermissions = () => {
    axios({
      method: "post",
      url: `${Config.base_url}subadmins/get`,
      data: {
        userId: adminId,
      },
    }).then(function (response) {

      setForPermission(response.data.subadmins[0])

    });
  }


  useEffect(() => {

    getPermissions()

    axios({
      method: "post",
      url: `${Config.base_url}subadmin/clientlist`,
      data: {
        adminId: adminId,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {

      res.data.data.map((a, index) => {
        data.push({
          id: a.id,
          full_name: a.full_name,
          username: a.username,
          mobile: a.mobile,
          email: a.email,
          broker: a.broker,
          created_at: dateFormate(a.created_at),
          end_date: a.end_date == "0000-00-00" ? a.end_date : dateFormate(a.end_date),
          // end_date: dateFormate(a.end_date) ,
          licence_type: a.licence_type == 2 ? "Live" : "Demo",
          to_month: a.to_month,
          broker: a.broker,
          status_term: a.status_term,
          status: a.status,
          twoday_service: a.twoday_service,
          login_status: a.login_status
        });
      });
      setClients(data);
      settableData({ columns, data });
    });

  }, [refreshscreen]);



  const getExcelData = () => {
    const excelData =
      clients &&
      clients.map((item) => {
        delete item.action;
        return item;
      });
    return excelData;
  };


  const clientsTypeFilter = (e) => {
    var FilterData = tableData.data.filter((item) => {
      if (item.licencetype.toString().includes(e.target.value.toString())) {
        return item
      }
    })
    setClients(FilterData)
  }

  const onAlertClose = (e) => {
    setShowAlert(false);
  };



  const customStyles = {

    headCells: {
      style: {
        fontWeight: '700',
        // margin:' 19px 0px',
        backgroundColor: '#000',
        color: '#fff',

        justifyContent: 'center !important',
        overflow: 'visible !important',
      },
    },
    rows: {
      style: {
        justifyContent: 'center !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };



  return (
    <>
      <div className="content">
        <div className="row">
          <Backdrop
            sx={{
              color: "#000000",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
          // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Clients</h4>
                <div className="row">
                  <div className="col-md-6">
                    {/* <button onClick={downloadPdf}>Click</button> */}

                    
                 
                   {
                    forPermission.twodays_demo == 1 || forPermission.live == 1 ?
                    <NavLink to="/admin/client/add-client">
                    <button className="btn-color btn">
                      Add Client
                    </button>
                  </NavLink>
                  :
                  ""
                   }
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Client Type</label>
                      <select
                        name="clienttype"
                        // value={csubadmin}
                        onChange={(e) => { clientsTypeFilter(e) }}
                        class="form-control"
                      >
                        <option value="">All</option>

                        <option value="Demo">Demo</option>
                        <option value="Live">Live</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex justify-content-center">
                    <ExportToExcel
                      className="btn-color btn"
                      // apiData={getExcelData()}
                      fileName={fileName}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div className="table-responsive">
                      <DataTableExtensions
                        columns={columns}
                        data={clients}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          fixedHeader
                          fixedHeaderScrollHeight="700px"
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          pagination
                          customStyles={customStyles}
                          highlightOnHover
                          paginationRowsPerPageOptions={[10, 50, 100]}
                          paginationComponentOptions={{
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "All",
                          }}
                        />
                      </DataTableExtensions>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addservice" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <p>This is a large modal</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>

          {/* {showAlert &&

      (

        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )} */}
        </div>
      </div>
    </>
  );
};
export default ClientList;
