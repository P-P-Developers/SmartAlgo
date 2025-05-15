import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import AlertToast from "../common/AlertToast";
import ExportToExcel from "../common/ExportToExport";

function Groupservice() {

  const [category, setCategories] = useState([]);
  const [tableData, settableData] = useState();
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [loader, setLoader] = useState(false);
  const [modal_name, setModalname] = useState(false);
  const [show, setShow] = useState(false);
  const [ShowName, setShowName] = useState();
  const [show1, setShow1] = useState(false);
  const [ShowName1, setShowName1] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [modeldata, setModeldata] = useState();
  const [modelClientdata, setModelClientdata] = useState();
  // console.log("modelClientdata", modelClientdata && modelClientdata);

  const navigate = useNavigate()

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const columns = [
    {
      name: <h6>NO.</h6>,
      selector: (row) => row.no,
    },
    {
      name: <h6>GROUP NAME</h6>,
      selector: (row) => row.name,
    },
    {
      name: <h6>SERVICE COUNT</h6>,
      selector: (row) => row.servicesCount,
    },
    {
      name: <h6>SERVICES</h6>,
      width: "100px !important",
      selector: (row) => (
        <>
          {/* Get all group services */}
          <button
            className="btn  btn-color"
            onClick={(e) => ShowModel(row.id, row.name)}
          >  <i
            className="now-ui-icons gestures_tap-01 "
            style={{ fontSize: "14px" }}
          ></i>
          </button>
        </>
      ),
    },

    {
      name: <h6>Client Using</h6>,
      width: "100px !important",
      selector: (row) => (
        <>

          {/*Get all client from group  */}
          <button
            className="btn  btn-color"
            onClick={(e) => ShowModelClients(row.id, row.name)}
          >  <i
            className="fa-regular fa-user"
            style={{ fontSize: "14px" }}
          ></i>
          </button>
        </>
      ),
    },

    {
      name: <h6>Actions</h6>,
      cell: (row) => (
        <>
          <NavLink
            to={"/admin/group-service/" + row.id}
          >
            <i
              className="fa-solid fa-pen-to-square  fs-5 edit_hover"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit"
            ></i>

          </NavLink>

          <i
            className="fa-solid fa-trash fs-5 mx-3 hover"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            onClick={() => onShowClick(row.id)}
          ></i>
        </>
      ),
      allowOverflow: true,
      button: true,
    },
  ];

  const fileName = "GroupServices";

  useEffect(() => {
    setLoader(true);
    axios.get(`${Config.base_url}admin/group-services`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      // console.log("abcedf" ,res);
      var data = [];
      var i = 1;
      res.data.services.map((cat) =>
        data.push({
          no: i++,
          name: cat.group_name,
          id: cat.id,
          servicesCount: cat.group_all,
        })
      );
      setCategories(data);
      settableData({
        columns,
        data,
      });
      setLoader(false);
    });
  }, [refreshscreen]);

  const onShowClick = (id) => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/group-service/client`,
      data: { groupId: id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      console.log("res1", res1.data.groupSeviceClientName.length);
      // console.log("res1", res1.data.groupSeviceClientName.length());

      if (res1.data.groupSeviceClientName.length > 0) {
        setShowAlert(true)
        setAlertColor('error');
        setTextAlert("This Group Service is Already Assign Please Remove this Group Service from All Clients");
        return
      } else {
        if (window.confirm("Do you want to delete this group ?")) {
          axios({
            method: "post",
            url: `${Config.base_url}admin/group-services/delete`,
            data: { 'adminId': adminId, id: id },
            headers: {
              'x-access-token': admin_token
            }
          }).then(function (response) {
            // console.log("group-delete", response);
            if (response) {
              setShowAlert(true)
              setAlertColor('success');
              setTextAlert("Group Services Deleted Successfully");
              setRefreshscreen(!refreshscreen);
            }
          });
        }
      }
    });


    // return
    //     if (window.confirm("Do you want to delete this group ?")) {
    //       axios({
    //         method: "post",
    //         url: `${Config.base_url}admin/group-services/delete`,
    //         data: { 'adminId': adminId, id: id },
    //         headers: {
    //           'x-access-token': admin_token
    //         }
    //       }).then(function (response) {
    //         // console.log("group-delete", response);
    //         if (response) {
    //           setShowAlert(true)
    //           setAlertColor('success');
    //           setTextAlert("Group Services Deleted Successfully");
    //           setRefreshscreen(!refreshscreen);
    //         }
    //       });
    //     }
  };

  const ShowModel = (id, name) => {
    setShow(true);

    axios({
      method: "post",
      url: `${Config.base_url}admin/group-service-names`,
      data: { 'adminId': adminId, groupId: id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      var data = [];
      res1.data.groupSeviceName.map((x) =>
        data.push({
          services_name: x.service_Name,
          cat_segment: x.catsegment,
          cat_name: x.CategorieName,
        })
      );
      setModeldata(data);
      setShowName(name);
    });
  };
  const modalhide = () => {
    setShow(false);
  };
  const modalhide1 = () => {
    setShow1(false);
  };

  const ShowModelClients = (id, name) => {
    setShow1(true);
    // console.log("name", name);
    axios({
      method: "post",
      url: `${Config.base_url}admin/group-service/client`,
      data: { groupId: id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      // console.log("res1", res1);
      var data = [];
      res1.data.groupSeviceClientName.map((x) =>
        data.push({
          id: x.id,
          username: x.username,
          licence_type: x.licence_type,
          login_status: x.login_status,
        })
      );
      setModelClientdata(data);
      setShowName1(name);
    });
  };


  const customStyles1 = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
      },
    },
    rows: {
      style: {
        // overflow:'visible !important', 
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

  const goToDashboard = (client_id) => {
    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/client/LoginStatusGet`,
      data: {
        client_id: client_id,
      },
    }).then(function (response) {
      if (response) {
        // console.log("login", response);
        var loginStatus = response.data.login_status

        if (loginStatus == 0) {
          alert("Client Is Not Login Yet")
        } else {
          axios({
            method: "get",
            url: `${Config.base_url}admin/client-dashboard/${client_id}`,
            headers: {
              'x-access-token': admin_token
            }
          }).then(function (response) {
            // console.log("test", response);
            if (response.data.success === "true") {
              navigate("/", { state: response.data.msg })
            }
            // else if (response.data.success === "false") {
            //   alert(response.data.msg)
            // }
          })
        }
      }
    });


    // console.log("id", id);
    // axios({
    //   method: "get",
    //   url: `${Config.base_url}admin/client-dashboard/${id}`,
    //   headers: {
    //     'x-access-token': admin_token
    //   }

    // }).then(function (response) {
    //   // console.log("respp", response);
    //   navigate("/", { state: response.data.msg })

    // })
  }

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
                <h4 className="card-title">Group Services</h4>
                <div className="row ms-auto">
                  <div className="d-flex ">
                    <NavLink
                      to="/admin/add-group"
                      className="btn btn-color"
                    >
                      Add Group
                    </NavLink>
                    {/* <div className=" export-btn ">
                    <ExportToExcel
                      className="export-btn"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                    />
                  </div> */}
                  </div>
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div
                      className="table-responsive"
                    // style={{ height: "70vh" }}
                    >
                      <DataTableExtensions
                        {...tableData}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          columns={columns}
                          fixedHeader
                          fixedHeaderScrollHeight="700px"
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          pagination
                          highlightOnHover
                          customStyles={customStyles1}
                          paginationRowsPerPageOptions={[10, 50, 100]}
                          paginationComponentOptions={{
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "All",
                          }}
                        />
                      </DataTableExtensions>
                      {/* Group Services */}
                      <Modal show={show} onHide={modalhide}>
                        <Modal.Header closeButton>
                          <Modal.Title
                            style={{
                              display: "flex",
                              flexGrow: "0.8",
                              marginTop: "20px",
                            }}
                          >
                            {ShowName}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <>
                            <DataTable
                              columns={[
                                {
                                  name: <h6>SERVICES</h6>,
                                  selector: (row) => row.services_name,
                                },

                                {
                                  name: <h6>SEGMENT</h6>,
                                  selector: (row) => row.cat_segment,
                                },
                                {
                                  name: <h6>CATEGORY</h6>,
                                  selector: (row) => row.cat_name,
                                },
                              ]}
                              data={modeldata}
                              fixedHeader
                              fixedHeaderScrollHeight="700px"
                              defaultSortField="id"
                              defaultSortAsc={false}
                              pagination
                              highlightOnHover
                              customStyles={customStyles1}
                              paginationRowsPerPageOptions={[10, 50, 100]}
                              paginationComponentOptions={{
                                selectAllRowsItem: true,
                                selectAllRowsItemText: "All",
                              }}
                            />
                          </>
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                      </Modal>

                      {/* Group Clients */}
                      <Modal show={show1} onHide={modalhide1}>
                        <Modal.Header closeButton>
                          <Modal.Title
                            style={{
                              display: "flex",
                              flexGrow: "0.8",
                              marginTop: "20px",
                            }}
                          >
                            {ShowName1}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <>
                            <DataTable
                              columns={[

                                {
                                  name: <h6>Username</h6>,
                                  selector: (row) => row.username,
                                },
                                {
                                  name: <h6>Client Dashboard</h6>,
                                  width: '160px !important',
                                  selector: (row) => (
                                    <>
                                      <button
                                        className="btn btn-new-block"
                                        style={row.login_status === 0 ? { backgroundColor: "#FF0000" } : { backgroundColor: "#008000" }}
                                        onClick={() => goToDashboard(row.id)}
                                      >
                                        Go To Dashboard
                                      </button>
                                    </>
                                  ),
                                },
                                {
                                  name: <h6>License Type</h6>,
                                  selector: (row) => row.licence_type == 1 ? "Demo" : "Live",
                                },
                              ]}
                              data={modelClientdata && modelClientdata}
                              fixedHeader
                              fixedHeaderScrollHeight="700px"
                              defaultSortField="id"
                              defaultSortAsc={false}
                              pagination
                              highlightOnHover
                              customStyles={customStyles1}
                              paginationRowsPerPageOptions={[10, 50, 100]}
                              paginationComponentOptions={{
                                selectAllRowsItem: true,
                                selectAllRowsItemText: "All",
                              }}
                            />
                          </>
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAlert &&
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      }
    </>
  );
}

export default Groupservice;
