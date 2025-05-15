import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';

const AddNewSubadmin = () => {
  const navigate = useNavigate();

  const adminId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");

  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [loader, setLoader] = useState(false);

  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");
  const [storeStrategyErr, setStoreStrategyErr] = useState("");

  const [visiablity, setVisiablity] = useState("");
  const [changeType, setChangeType] = useState("password");

  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setpassword] = useState("");

  const [showEdit, setShowEdit] = useState("")
  const [showGoToDashboard, setShowGoToDashboard] = useState("")
  const [showAddEditLive, setShowAddEditLive] = useState("")
  const [licencePermission, setLicencePermission] = useState("")
  const [groupPermission, setGroupPermission] = useState("")
  const [strategyPermission, setStrategyPermission] = useState("")
  const [groupServicesPermission, setGroupServicesPermission] = useState("")

  const [strategy, setStrategy] = useState([]);
  const [storeStrategy, setStoreStrategy] = useState([]);
  // console.log("storeStrategy", storeStrategy);
  const [toggleSwitch, setToggleSwitch] = useState(false)
  const [api_update, setApiUpdate] = useState(false);
  const [twodays_demo,settwodays_demo] = useState(false);
  const [addlive,setLive] = useState(false);
  // console.log("showEdit", showEdit);
  // console.log("showGoToDashboard", showGoToDashboard);
  // console.log("showAddEdit", showAddEdit);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const reset = (e) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMobile("");
    setpassword("");
  };

  const inputChange = (e) => {
    
    if (e.target.name === "name") {
      setName(e.target.value);
      setNameErr("");
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
      setEmailErr("");
    }
    if (e.target.name === "mobile") {
      setMobile(e.target.value);
      setMobileErr("");
    }
    if (e.target.name === "password") {
      setpassword(e.target.value);
      setpasswordErr("");
    }
    if(e.target.name === "show_edit")  {
      document.getElementById("api_update").checked = false;
      setApiUpdate(false);
    }
    if(e.target.name === "api_update")  {
      document.getElementById("show_edit").checked = false;
      document.getElementById("show_go_to_dash").checked = false;
      document.getElementById("licence_permission").checked = false;
      document.getElementById("group_permission").checked = false;
      document.getElementById("group_service_permission").checked = false;
      setShowEdit(false);
      setShowGoToDashboard(false);
      setLicencePermission(false);
      setGroupPermission(false);
      setGroupServicesPermission(false);
      
    }
    if(e.target.name === "show_go_to_dash")  {
      document.getElementById("api_update").checked = false;
      setApiUpdate(false);
    }
    if(e.target.name === "licence_permission")  {
      document.getElementById("api_update").checked = false;
      setApiUpdate(false);
    }
    if(e.target.name === "group_permission")   {
      document.getElementById("api_update").checked = false;
      setApiUpdate(false);
    }
    if(e.target.name === "group_service_permission")  {
      document.getElementById("api_update").checked = false;
      setApiUpdate(false);
    }
  };

  const submitform = (e) => {

    if (name === undefined || name === "") {
      setNameErr(Constant.CLIENT_FULL_NAME);
      return;
    }
    if (email === undefined || email === "") {
      setEmailErr(Constant.CLIENT_EMAIL);
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailErr(Constant.EMAIL_VALIDATION);
      return;
    }
    if (mobile === undefined || mobile === "") {
      setMobileErr(Constant.CLIENT_MOBILE);
      return;
    }
    if (mobile.length < 10) {
      setMobileErr("Mobile number should be 10 digit");
      return;
    }
    if (mobile.match(/[a-z]/i)) {
      setMobileErr("Letters are not accepted");
      return;
    }
    if (password === undefined || password === "") {
      setpasswordErr(Constant.PASSWORD);
      return;
    }
    if (storeStrategy == "") {
      setStoreStrategyErr("Please Select Atleast 1 Strategy")
      return;
    }

    axios({
      method: "post",
      url: `${Config.base_url}admin/subadmin/add`,
      data: {
        adminId: adminId,
        name: name,
        email: email,
        mobile: mobile,
        password: password,

        add__edit_live: showAddEditLive == true ? 1 : 0,
        editClient_live: showEdit == true ? 1 : 0,
        goto_dashboard: showGoToDashboard == true ? 1 : 0,
        license_permission: licencePermission == true ? 1 : 0,
        group_permission: groupPermission == true ? 1 : 0,
        strategy_permission: strategyPermission == true ? 1 : 0,
        groupServicesPermission: groupServicesPermission == true ? 1 : 0,
        store_strategy: storeStrategy,
        api_update: api_update == true ? 1 : 0,
        twodays_demo:twodays_demo == true ? 1 : 0,
        live:addlive == true ? 1 : 0,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (res) {
      if (res) {

        if (res.data.status === 'email_error') {
          setShowAlert(true)
          setAlertColor('error');
          setTextAlert(res.data.msg);

        } else {
          setShowAlert(true);
          setTextAlert(" Account Added Succesfully ");
          setAlertColor("success");
          setTimeout(() => navigate("/admin/SubAdmin"), 1000);
        }
      }
    });
  };

  const toggle = (e) => {
    e.preventDefault();
    if (changeType === "password") {
      setChangeType("text");
      setVisiablity("eye");
    } else {
      setChangeType("password");
    }
  };

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

  const strategyClick = (e) => {
    // console.log("e", e.target.value);
    var name = e.target.value
    if (e.target.checked) {
      setStoreStrategy([...storeStrategy, name])
    }

    // axios({
    //   method: "post",
    //   url: `${Config.base_url}admin/subadmin/add-strategy`,
    //   data: {
    //     adminId: adminId,
    //   },
    //   headers: {
    //     'x-access-token': admin_token
    //   }
    // }).then(function (res) {

    // });

  }


  useEffect(() => {
    strategyApi()
  }, [])

  // console.log(showEdit, "show edit");
  // console.log(showGoToDashboard, "showGoToDashboard");
  // console.log(licencePermission, "licencePermission");
  // console.log(groupPermission, "groupPermission");
  // console.log(groupServicesPermission, "groupServicesPermission");
  // console.log(strategyPermission, "strategyPermission");
  // console.log(api_update, "api_update");
  // console.log("twodays_demo 221 ",twodays_demo);
  // console.log("addlive 224 ",addlive);


  

  // function disable() {
  //   if (api_update === true) {
  //     setShowEdit(false);
  //     setShowGoToDashboard(false);
  //     setLicencePermission(false);
  //     setGroupPermission(false);
  //     // setStrategyPermission(false);
  //     setGroupServicesPermission(false);
  //   }
  // }

  // useEffect(() => {
  //   disable()
  // }, [api_update])


  return (
    <div>
      <div className="content">
        <div className="row ">
          <Backdrop
            sx={{
              color: "#000000",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-12" style={{ marginTop: "-25px" }}>
            <div className="card">
              <div className="row ">
                <div className="d-flex justify-content-space-between">
                  <h4 className="card-title ms-3">Add New SubAdmin</h4>
                  <button
                    className="btn btn-color ms-auto mx-4"
                    onClick={() => navigate("/admin/SubAdmin")}
                  >
                    <i
                      class="fa fa-arrow-left mx-1"
                      aria-hidden="true"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Back"
                    ></i>
                    Back
                  </button>
                </div>
              </div>
              <div className="card-body ">
                <div className="row d-flex">
                  <div className="col-10">
                    <div className=" p-3 rounded-3 ">
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
                            className="form-control"
                            name="name"
                            placeholder="Enter Your Name"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            value={name}
                          ></input>
                          <p className="text-primary">{nameErr && nameErr}</p>
                          <label
                            style={{
                              color: "#000",
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            Email
                          </label>
                          <input
                            type="Email"
                            className="form-control"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            name="email"
                            placeholder="Enter Your Email"
                            value={email}
                          ></input>
                          <p className="text-primary">
                            {emailErr && emailErr}
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
                            maxLength="10"
                            pattern="[789][0-9]{9}"
                            className="form-control"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            name="mobile"
                            placeholder="Enter Your Mobile No."
                            value={mobile}
                          ></input>
                          <p className="text-primary">
                            {mobileErr && mobileErr}
                          </p>
                          <label
                            style={{
                              color: "#000",
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            Password
                          </label>
                          <div
                            className="d-flex"
                            style={{ position: "relative" }}
                          >
                            <input
                              type={changeType}
                              maxLength="16"
                              className="form-control input_relative"
                              onChange={(e) => {
                                inputChange(e);
                              }}
                              name="password"
                              placeholder="Password"
                              value={password}
                            ></input>
                            <i
                              class={
                                changeType === "text"
                                  ? "fa-solid fa-eye-slash "
                                  : "fa-solid fa-eye "
                              }
                              onClick={(e) => toggle(e)}
                              data-toggle="tooltip"
                              data-placement="top"
                              title="password Visiblity"
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "15px",
                              }}
                            ></i>
                          </div>
                          <p className="text-primary">
                            {passwordErr && passwordErr}
                          </p>
                        </div>

                        <div className="d-flex" style={{ position: "relative" }}>
                          <label style={{ color: "#000", fontSize: "15px", fontWeight: "500", }}> Permissions </label>

                          <div>
                            <input
                              onChange={(e) => { setShowEdit(e.target.checked);inputChange(e) }}
                              // disabled={api_update}
                              // checked={api_update == false ? showEdit : false}
                              type="checkbox" id="show_edit" name="show_edit" className="ms-2" />
                            <label className="ms-2">Show Client Edit</label>
                          </div>
                          <div>
                            <input
                              onChange={(e) => { setShowGoToDashboard(e.target.checked);inputChange(e)  }}
                              // disabled={api_update}
                              // checked={api_update == false ? showGoToDashboard : false}
                              type="checkbox" id="show_go_to_dash" name="show_go_to_dash" className="ms-2" />
                            <label className="ms-2">Show Go To Dashboard</label>
                          </div>
                          {/* <div>
                            <input
                              onChange={(e) => { setShowAddEditLive(e.target.checked) }}
                              type="checkbox" id="show_add_edit" name="show_add_edit" className="ms-2" />
                            <label className="ms-2">Show Live On Add/Edit</label>
                          </div> */}
                          <div>
                            <input
                              onChange={(e) => { setLicencePermission(e.target.checked);inputChange(e)  }}
                              // disabled={api_update}
                              // checked={api_update == false ? licencePermission : false}
                              type="checkbox" id="licence_permission" name="licence_permission" className="ms-2" />
                            <label className="ms-2">Licence Permission</label>
                          </div>
                          <div>
                            <input
                              onChange={(e) => { setGroupPermission(e.target.checked);inputChange(e) }}
                              // disabled={api_update}
                              // checked={api_update == false ? groupPermission : false}
                              type="checkbox" id="group_permission" name="group_permission" className="ms-2" />
                            <label className="ms-2">Group Permission</label>
                          </div>

                          <div>
                            <input
                              onChange={(e) => { setGroupServicesPermission(e.target.checked);inputChange(e) }}
                              // disabled={api_update}
                              // checked={api_update == false ? groupServicesPermission : false}
                              type="checkbox" id="group_service_permission" name="group_service_permission" className="ms-2" />
                            <label className="ms-2">Group Services Tab Permission</label>
                          </div>

                          <div>
                            <input
                              onChange={(e) => { setStrategyPermission(e.target.checked) }}
                              type="checkbox" id="strategy_permission" name="strategy_permission" className="ms-2" />
                            <label className="ms-2">Strategy Permission</label>
                          </div>
                        </div>

                        <div>
                            <input

                              onChange={(e) =>  { setApiUpdate(e.target.checked);inputChange(e)}}

                              type="checkbox" id="api_update" name="api_update" className="ms-2" />
                            <label className="ms-2">Api Update</label>
                          </div>

                          <div> 
                              <input
                                  onChange={(e) => settwodays_demo(e.target.checked)}
                                type="checkbox" name="2days_demo"  id="2days_demo"
                                className="ms-2" />
                              <label className="ms-2">Add client - 2days/demo</label>
                            </div>

                            <div> 
                              <input
                                  onChange={(e) => setLive(e.target.checked)}
                                type="checkbox" name="Live"  id="Live"
                                className="ms-2" />
                              <label className="ms-2">Add client - Live</label>
                            </div>



                        <p className="text-primary">{storeStrategyErr && storeStrategyErr}</p>

                        {strategyPermission == true ?
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
                                            onChange={(e) => { strategyClick(e); setStoreStrategyErr("") }}
                                            // checked={checkstrategy(sm.name)} 
                                            type="checkbox"
                                            value={sm.name}
                                            name="strategy"
                                          // {...register("strategy", { onChange: (e) => { strategyClick(e) }, required: true })}
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
                          : ""}
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
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )}
    </div>
  );
};

export default AddNewSubadmin;
