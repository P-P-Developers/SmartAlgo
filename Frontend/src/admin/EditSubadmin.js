import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate, useLocation, useParams, NavLink } from 'react-router-dom';
import axios from "axios";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import DatePicker from "react-datepicker";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import { dateFormate } from "../common/CommonDateFormate";
import Form from 'react-bootstrap/Form';


const EditSubadmin = () => {
  const location = useLocation();
  const getdatafromloc = location.state

  const [loader, setLoader] = useState(false);
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");

  const [update, setUpdate] = useState(false);
  const [tableData, setTableData] = useState();
  const [updatedInfo, setUpdatedInfo] = useState(location.state);
  
  const [getData, setGetData] = useState([])
  const [modalData, setModalData] = useState([])
  const [modalName, setModalName] = useState("");

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [showEdit, setShowEdit] = useState(false)
  const [showGoToDashboard, setShowGoToDashboard] = useState(false)
  const [showAddEditLive, setShowAddEditLive] = useState(false)
  const [licencePermission, setLicencePermission] = useState(false)
  const [groupPermission, setGroupPermission] = useState(false)
  const [strategyPermission, setStrategyPermission] = useState(false)

  const [strategy, setStrategy] = useState([]);
  const [storeStrategy, setStoreStrategy] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(false)
  const [cstrategy, setcStrategy] = useState([]);


  const [subadminStrategyApi, setSubadminStrategyApi] = useState([])


  // const [updatedStrategy, setUpdatedStrategy] = useState(location.state)


  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const columns = [
    {
      name: "No.",
      selector: (row) => row.no,
      width: '100px !important',
      // justifyContent:'center !important'
    },
    {
      name: "NAME",
      selector: (row) => row.name,
      // width:'70px !important',
      // justifyContant:'center !important'
    },
    {
      name: "EMAIL",
      selector: (row) => row.email,
      width: '270px !important',
    },
    {
      name: "PASSWORD",
      selector: (row) => row.password,
    },
    {
      name: "MOBILE",
      selector: (row) => row.mobile,
    },
    {
      name: 'CLIENT LIST',
      selector: (row) => (
        <>
          <button
            className="btn  btn-color"
            onClick={(e) => ShowModel(row.userId, row.name)}
          >
            <i
              className="now-ui-icons gestures_tap-01 "
              style={{ fontSize: "14px" }}
            ></i>
          </button>
        </>
      ),
    },

    {
      name: "ACTIONS",
      selector: (row) => (
        <>
          <i
            className="fa-solid fa-pen-to-square fs-5 edit_hover"
            variant="primary"
            onClick={() => { handleShow(row); getSubAdminStrategy(row) }}
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          ></i>

          <i
            className="fa-solid fa-trash fs-5 mx-3 hover"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            onClick={() => deleteItem(row)}
          ></i>
        </>
      ),
    },
  ];


  // GET SUBADMIN DATA

  var i = 1;
  useEffect(() => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/subadmins`,
      data: {},
      headers: {
        'x-access-token': admin_token
      },
    }).then(function (res) {
      res.data.subadmins.map((x, index) =>
        data.push({
          no: index + 1,
          userId: x.userId,
          name: x.name,
          email: x.email,
          mobile: x.mobile,
          password: x.password,
          add__edit_live: x.add__edit_live,
          editClient_live: x.editClient_live,
          goto_dashboard: x.goto_dashboard,
          group_permission: x.group_permission,
          license_permission: x.license_permission,
          strategy_permission: x.strategy_permission
          // new_password: x.new_passwor
        })
      );
      setGetData(data)
      setTableData({ columns, data });
    });

    strategyApi()

  }, [update, refreshscreen]);



  const ShowModel = (id, name) => {
    var data1 = []
    setShowList(true);

    axios({
      method: "post",
      url: `${Config.base_url}subadmin/clientlist`,
      data: {
        adminId: id,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {
      // console.log("res", res.data.data.end_date));
      res.data.data.map((a, index) => {
        data1.push({
          id: a.id,
          username: a.username,
          mobile: a.mobile,
          email: a.email,
          created_at: dateFormate(a.created_at),
          licence_type: a.licence_type == 2 ? "Live" : "Demo",
        });
      });
      setModalName(name)
      setModalData(data1)
      // console.log("gsfg",data)
    });
  };
  const modalhidelist = () => {
    setShowList(false);
  };



  // DELETE SUB  ADMIN DATA

  const deleteItem = (item) => {
    if (window.confirm("Do Really you want to delete ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}admin/subadmin/delete`,
        data: {
          'adminId': adminId,
          subAdminId: item.userId,
        },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (res) {
        // console.log("res", res.data);
        if (res.data.status == "failed") {
          setShowAlert(true);
          setTextAlert("Subadmin cannot be deleted Subadmin has clients");
          setAlertColor("error");
          setShow(false);
        }
        else {
          setShowAlert(true);
          setTextAlert(Constant.DELETE_SUCCESSFULLY);
          setAlertColor("success");
          setShow(false);
          setUpdate(!update);
        }
      });
    };
  }


  var data = [];
  const handleClose = () => {
    setShow(false)
    setRefreshscreen(!refreshscreen);
  };
  const handleShow = (row) => {
    // alert("dd")
    // console.log("ok world", row.strategy_permission);
    setRefreshscreen(!refreshscreen);
    setUpdatedInfo(row);
    setShow(true);
  };


  const submitform = () => {

    if (updatedInfo.name === undefined || updatedInfo.name === "") {
      setNameErr("Name Required");
      return;
    }
    if (updatedInfo.email === undefined || updatedInfo.email === "") {
      setEmailErr("Email Required");
      return;
    }
    // console.log(updatedInfo.email)
    // debugger
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(updatedInfo.email)) {
      setEmailErr("Please Enter Valid Email");
      return;
    }
    // debugger
    if (updatedInfo.mobile === undefined || updatedInfo.mobile === "") {
      setMobileErr("Mobile Number Required");
      return;
    }

    if (updatedInfo.mobile.length < 10) {
      setMobileErr("Mobile number should be 10 digit");
      return;
    }

    if (updatedInfo.mobile.match(/[a-z]/i)) {
      setMobileErr("Letters are not accepted");
      return;
    }
    //  UPDATE SUBADMIN DATA

    axios({
      method: "post",
      url: `${Config.base_url}admin/subadmin/update`,
      data: {
        'adminId': adminId,
        subAdminId: updatedInfo.userId,
        name: updatedInfo.name,
        email: updatedInfo.email,
        mobile: updatedInfo.mobile,
        password: updatedInfo.new_password,

        add__edit_live: showAddEditLive == true ? 1 : 0,
        editClient_live: showEdit == true ? 1 : 0,
        goto_dashboard: showGoToDashboard == true ? 1 : 0,
        license_permission: licencePermission == true ? 1 : 0,
        group_permission: groupPermission == true ? 1 : 0,
        strategy_permission: strategyPermission == true ? 1 : 0,

        store_strategy: cstrategy,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (res) {
      if (res) {
        setShowAlert(true);
        setTextAlert("Update Succesfully");
        setAlertColor("success");
        setShow(false);
        setRefreshscreen(!refreshscreen);
      }
    });
  };

  const inputChange = (e) => {
    if (e.target.name === "name") { setUpdatedInfo((prevalue) => ({ ...prevalue, ["name"]: e.target.value, })); setNameErr(""); }
    if (e.target.name === "email") { setUpdatedInfo((prevalue) => ({ ...prevalue, ["email"]: e.target.value, })); setEmailErr(""); }
    // if (e.target.name === "mobile") {

    //   {
    //     var regEx = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/;
    //     if (e.target.value.match(regEx))
    //     console.log("hello regex")
    //     {
    //       setUpdatedInfo((prevalue) => ({
    //         ...prevalue,
    //         ["mobile"]: e.target.value,
    //       }));
    //     }
    //   }

    if (e.target.name === "mobile") { setUpdatedInfo((prevalue) => ({ ...prevalue, ["mobile"]: e.target.value, })); setMobileErr(""); }

    // if (e.target.name === "password") {
    //   setUpdatedInfo((prevalue) => ({
    //     ...prevalue,
    //     ["new_password"]: e.target.value,
    //   }));
    //   setMobileErr("");
    // }

  };


  const getSubAdminStrategy = (row) => {

    axios({
      method: "post",
      url: `${Config.base_url}admin/subadmin/strategy`,
      data: {
        SubadminId: row.userId,
        // SubadminId : SubadminId
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (res) {
      // console.log("res", res);
      setRefreshscreen(!refreshscreen);
      setSubadminStrategyApi(res.data.Strategy)
      setcStrategy(res.data.Strategy.map((x) => {
        return x.strategy
      }))
    });
  }

  const strategyApi = () => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/strategy`,
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("res", response.data.strategy);
      setStrategy(response.data.strategy);
    })
  }


  const checkstrategy = (id) => {
    const getcstrategy = subadminStrategyApi.map((x) => {
      return x.strategy
    })
    if (getcstrategy.includes(id)) {
      return "minus";
    } else {
      return "";
    }
  };


  const strategyClick = (e) => {
    var name = e.target.value

    if (e.target.checked) {
      setcStrategy([...cstrategy, name]);

    } else {
      setcStrategy(cstrategy.filter((tag, index) => tag != "" + name + ""));
    }
    // setUpdatedStrategy(storeStrategy)
    // console.log("cstrategy", cstrategy);
  }




  return (
    <>
      {/* <div className="container-fluid" > */}
      <div className="content">
        <div className="row" style={{ marginTop: "-25px" }}>
          <Backdrop
            sx={{
              color: "#000000",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6 ">
                    <h3 className="card-title mx-3">Edit Sub Admin</h3>
                  </div>
                  <div className="col-md-6">
                    <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                      {/* <NavLink
                        to="/admin/AddNewSubadmin"
                        className="btn btn-color">
                        + Add New
                      </NavLink> */}

                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="table-responsive">
                  </div>
                </div>

                <form>
                  <div className="password">
                    <label
                      style={{
                        color: "#000",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control bg-white"
                      name="name"
                      placeholder="Name"
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      // disabled
                      value={updatedInfo.name}
                    ></input>
                    {/* <p style={{fontSize:"12px"}}>* Not Editable</p> */}
                    <p className="text-primary"> {nameErr && nameErr} <br /></p>

                    <label
                      style={{
                        color: "#000",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Email 11
                    </label>
                    <input
                      type="email"
                      className="form-control bg-white"
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      name="email"
                      placeholder="example@gmail.com"
                      // disabled
                      value={updatedInfo.email}
                    ></input>
                    {/* <p style={{fontSize:"12px"}}>* Not Editable</p> */}
                    <p className="text-primary">
                      {emailErr && emailErr}
                      <br />
                    </p>

                    <label
                      style={{
                        color: "#000",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Mobile
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      pattern="[0-9]*"
                      inputmode="numeric"
                      maxLength="10"
                      // minLength="10"
                      name="mobile"
                      placeholder="Mobile"
                      value={updatedInfo.mobile}
                    ></input>
                    <p className="text-primary">
                      {mobileErr && mobileErr}
                      <br />
                    </p>

                    <label style={{ color: "#000", fontSize: "15px", fontWeight: "500", }}> Permissions </label><br />
                    <div className="d-flex" style={{ position: "relative" }}>

                      <div>
                        <div>
                          <input
                            onChange={(e) => { setShowEdit(e.target.checked) }}
                            type="checkbox" defaultChecked={updatedInfo.editClient_live == 1 ? true : false} id="show_edit" name="show_edit" className="ms-2" />
                          <label className="ms-2">Show Client Edit</label>
                        </div>
                        <div>
                          <input
                            onChange={(e) => { setShowGoToDashboard(e.target.checked) }}
                            type="checkbox" defaultChecked={updatedInfo.goto_dashboard == 1 ? true : false} id="show_go_to_dash" name="show_go_to_dash" className="ms-2" />
                          <label className="ms-2">Show Go To Dashboard</label>
                        </div>

                        <div>
                          <input
                            onChange={(e) => { setLicencePermission(e.target.checked) }}
                            type="checkbox" defaultChecked={updatedInfo.license_permission == 1 ? true : false} id="licence_permission" name="licence_permission" className="ms-2" />
                          <label className="ms-2">Licence Permission</label>
                        </div>
                      </div>

                      <div>

                        {/* <div>
                            <input
                              onChange={(e) => { setShowAddEditLive(e.target.checked) }}
                              type="checkbox" defaultChecked={updatedInfo.add__edit_live == 1 ? true : false} id="show_add_edit" name="show_add_edit" className="ms-2" />
                            <label className="ms-2">Show Live On Add/Edit</label>
                          </div> */}

                        <div>
                          <input
                            onChange={(e) => { setGroupPermission(e.target.checked) }}
                            type="checkbox" defaultChecked={updatedInfo.group_permission == 1 ? true : false} id="group_permission" name="group_permission" className="ms-2" />
                          <label className="ms-2">Group Permission</label>
                        </div>
                        {/* <div>
                          <input
                            onChange={(e) => { setStrategyPermission(e.target.checked) }}
                            type="checkbox"
                            id="strategy_permission" name="strategy_permission" className="ms-2" />
                          <label className="ms-2">Strategy Permission</label>
                        </div> */}
                        <div>
                          <input
                            onChange={(e) => { setStrategyPermission(e.target.checked) }}
                            type="checkbox" defaultChecked={updatedInfo.strategy_permission == 1 ? true : false} id="strategy_permission" name="strategy_permission" className="ms-2" />
                          <label className="ms-2">Strategy Permission</label>
                        </div>
                      </div>
                    </div>

                    <>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Strategy</label>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label={toggleSwitch === true ? "Hide Strategies" : "Show Strategies"}
                              onClick={e => { setToggleSwitch(e.target.checked) }}
                            />

                            <div className="col-md-12">
                              <div className="row">
                                {toggleSwitch === true && strategy.map((sm, i) =>
                                (<div className="col-md-4">
                                  <div class="form-check">
                                    <input class="form-check-input"
                                      onChange={(e) => { strategyClick(e) }}
                                      defaultChecked={checkstrategy(sm.name)}
                                      type="checkbox"
                                      value={sm.name}
                                      name="strategy"
                                    />
                                    <label class="form-check-label">
                                      {sm.name}
                                    </label>
                                  </div>
                                </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>


                    {/* <label
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          Password
                          <span>*(fill only when you want to Change)</span>
                        </label>
                        <div className="d-flex">

                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            placeholder='password'
                            value={updatedInfo.new_password}
                          >
                          </input>
                        </div> */}
                    <br />
                    <p>
                      <br />
                    </p>
                  </div>

                  <div className="btn_style">
                    <button
                      type="button"
                      onClick={(e) => submitform(e)}
                      className="btn btn-color"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {showAlert && (
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )}
    </>
  )
}

export default EditSubadmin