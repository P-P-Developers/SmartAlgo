import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { Table, Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";


export default function System() {

  const [showComapny, setShowCompany] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [userDataEmail, setUserDataEmail] = useState("");
  const [emailDetailUpdate, setEmailDetailUpdate] = useState("");
  const [userDataCompany, setUserDataCompany] = useState("");
  // console.log("userDataCompany" ,userDataCompany)
  const [companyDetailUpdate, setCompanyDetailUpdate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [textAlert, setTextAlert] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(true);

  const [loginImageTheme, setLoginImageTheme] = useState("");



  const [companyNameErr, setCompanyNameErr] = useState("")
  const [companySNErr, setCompanySNErr] = useState("")
  const [companyLogoErr, setCompanyLogoErr] = useState("")
  const [companyFaviconErr, setCompanyFaviconErr] = useState("")
  const [companyWithBrokerErr, setCompanyWithBrokerErr] = useState("")
  const [companyVersionsErr, setCompanyVersionsErr] = useState("")

  const [strategy, setStrategy] = useState([]);
  const [group, setGroup] = useState([]);
  const [groupServices, setGroupServices] = useState("")

  const [groupServicesName, setGroupServicesName] = useState("")
  // console.log("groupServicesName", groupServicesName);

  const [toggleSwitch, setToggleSwitch] = useState(false)
  const [cstrategy, setcStrategy] = useState([]);
  const [getUpdate, setGetUpdate] = useState("");
  const [cgroup, setcGroup] = useState([]);
  const [cgroup2, setCGroup2] = useState([]);

  // console.log("getUpdate", getUpdate);


  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const locationname = window.location.host

  const { register, handleSubmit, formState: { errors } } = useForm();


  const handleClose = () => setShowCompany(false);
  const handleCloseEmail = () => setShowEmail(false);

  const showCompanyUpdate = (e) => {
    setShowCompany(true);
  };

  const apiCalls = () => {
    const data = {}
    const header = {
      'x-access-token': admin_token
    }
    axios.get(`${Config.base_url}admin/strategy`, { headers: header, data }).then(res => {
      setStrategy(res.data.strategy);
    });

    axios.get(`${Config.base_url}admin/group-services`, { headers: header, data }).then(res => {
      setGroup(res.data.services);
    });

    axios.get(`${Config.base_url}admin/get/signup`, { headers: header, data }).then(res => {
      setGetUpdate(res.data.data);
      setGroupServices(res.data.result1)
      setcStrategy(res.data.data.map((x) => x.strategy))
      setcGroup(res.data.data.map((x) => x.group_service))
    });
  }

  const groupChange = (e) => {
    // console.log("e",[e.target.value]);
    setCGroup2(e.target.value)
    if (e.target.value !== "") {
      axios({
        method: "post",
        url: `${Config.base_url}admin/group-services`,
        data: {
          'id': e.target.value,
          'adminId': adminId,
        },
        headers: {
          'x-access-token': admin_token
        }
      })
        .then(function (response) {
          // console.log("response.data", response.data);
          setGroupServices(response.data.service)
          setGroupServicesName(response.data)
        })
    } else {
      setGroupServices("")
    }
  }

  const strategyClick = (e) => {
    var name = e.target.value;
    if (e.target.checked) {
      setcStrategy([...cstrategy, name])
    } else {
      setcStrategy(cstrategy.filter((tag, index) => tag != '' + name + ''));
    }
  };

  const checkstrategy = (id) => {
    if (cstrategy.includes(id)) {
      return "minus";
      
    } else {
      return "";
    }
  };

  const signupGroupAndServices = (e) => {

    if (groupServices.length == 0) {
      alert("Please select group and services")
      return
    }
    if (cstrategy.length == 0) {
      alert("Please select strategy")
      return
    }
    else if (cstrategy.length > 1) {
      alert("Please select only one strategy")
      return
    }

    axios({
      method: "post",
      url: `${Config.base_url}admin/set/signup`,
      data: {
        group_service: groupServicesName.id,
        strategy: cstrategy[0],
        'adminId': adminId,
      },
      headers: {
        'x-access-token': admin_token
      }
    })
      .then(function (response) {
        if (response.data.status == true) {
          setShowAlert(true);
          setAlertColor("success");
          setTextAlert(response.data.data);
          setRefreshscreen(!refreshscreen);
        }
        // setGroupServices(response.data.service)
      })
  }

  const showEmailUpdate = () => {
    setShowEmail(true);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/system_email`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      setUserDataEmail(response.data.data[0]);
      setEmailDetailUpdate(response.data.data[0]);
    });


    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("system_company", response.data.data);
      setUserDataCompany(response.data.data[0]);
      setCompanyDetailUpdate(response.data.data[0]);
    });

    apiCalls()
  }, [refreshscreen]);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const inputChange = (e) => {

    if (e.target.name == "email") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["email"]: e.target.value,
      }));
    }

    if (e.target.name == "smtp_password") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["smtp_password"]: e.target.value,
      }));
    }

    if (e.target.name == "cc_mail") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["cc_mail"]: e.target.value,
      }));
    }

    if (e.target.name == "bcc_mail") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["bcc_mail"]: e.target.value,
      }));
    }

    if (e.target.name == "smtphost") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["smtphost"]: e.target.value,
      }));
    }

    if (e.target.name == "smtpport") {
      setEmailDetailUpdate((prevState) => ({
        ...prevState,
        ["smtpport"]: e.target.value,
      }));
    }

  };

  const companyModelInputChange = (e) => {

    if (e.target.name === "name") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        "name": e.target.value,
      }));
    }

    if (e.target.name === "s_name") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["s_name"]: e.target.value,
      }));
    }

    if (e.target.name === "image") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["image"]: e.target.files[0],
      }));
    }

    if (e.target.name === "favicon") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["favicon"]: e.target.files[0],
      }));
    }

    if (e.target.name === "th_watermark") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["th_watermark"]: e.target.files[0],
      }));
    }

    if (e.target.name === "withbroker") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["withbroker"]: e.target.value,
      }));
    }

    if (e.target.name === "versions") {
      setCompanyDetailUpdate((prevState) => ({
        ...prevState,
        ["versions"]: e.target.value,
      }));
    }

  };

  const emailSmtpUpdate = () => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/smtp_email_update`,
      data: { 'adminId': adminId, data: emailDetailUpdate },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      if (response) {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(Constant.SMTP_UPDATE_SUCCESS);
        setShowEmail(false);
        setRefreshscreen(!refreshscreen);
      }
    });
  };

  const getCompanyDetailsUpdate = (e) => {
    e.preventDefault()
    if (companyDetailUpdate.name === "undefined" || companyDetailUpdate.name === "") {
      setCompanyNameErr("Please Enter Company Name");
      return
    }
    if (companyDetailUpdate.s_name === "undefined" || companyDetailUpdate.s_name === "") {
      setCompanySNErr("Please Enter Company Sort Name");
      return
    }
    if (companyDetailUpdate.image === "undefined" || companyDetailUpdate.image === "") {
      setCompanyLogoErr("Please Upload Logo");
      return
    }
    if (companyDetailUpdate.favicon === "undefined" || companyDetailUpdate.favicon === "") {
      setCompanyFaviconErr("Please Upload Favicon");
      return
    }
    // if (companyDetailUpdate.withbroker === "undefined" || companyDetailUpdate.withbroker === "") {
    //   setCompanyWithBrokerErr("Please Enter Broker");
    //   return
    // }
    // if (companyDetailUpdate.versions === "undefined" || companyDetailUpdate.versions === "") {
    //   setCompanyVersionsErr("Please Enter Version");
    //   return
    // }


    var bodyFormData = new FormData();
    bodyFormData.append('image', companyDetailUpdate.image);
    bodyFormData.append('name', companyDetailUpdate.name);
    bodyFormData.append('s_name', companyDetailUpdate.s_name);
    bodyFormData.append('favicon', companyDetailUpdate.favicon);
    bodyFormData.append('th_watermark', companyDetailUpdate.th_watermark);
    bodyFormData.append('withbroker', companyDetailUpdate.withbroker);
    bodyFormData.append('versions', companyDetailUpdate.versions);

    console.log("bodyFormData", bodyFormData);

    axios({
      method: "post",
      url: `${Config.base_url}admin/company_details_update`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data', 'x-access-token': admin_token }
    }).then(function (response) {
      if (response) {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(Constant.COMPANY_DETAIL_UPDATE_SUCCESS);
        setShowCompany(false);
        setRefreshscreen(!refreshscreen);
      }
    });
  };

  const loginTheme1 = (theme) => {
    alert(theme)
  }

  const submitLoginBackground = () => {

    var bodyFormData = new FormData();
    bodyFormData.append('image_login', loginImageTheme);
console.log("bodyFormData", bodyFormData);
    axios({
      method: "post",
      url: `${Config.base_url}admin/login/bg_img`,
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': admin_token
      }
    }).then(function (response) {
      if (response) {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert("Login Image Page Updated");
        setShowCompany(false);
        setRefreshscreen(!refreshscreen);
      }
    });

  }

  const themeStatus = (theme) => {
    // console.log("theme", theme);
    axios({
      method: "post",
      url: `${Config.base_url}admin/theme_status`,
      data: {
        theme_id: theme
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      setShowAlert(true);
      setAlertColor("success");
      setTextAlert("Theme Updated");
      setRefreshscreen(!refreshscreen);
    });
  }


  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">System</h4>
              </div>
              <div className="card-body">
                <div className="row d-flex justify-content-end">
                  <div className="col-md-3 export-btn d-flex justify-content-center"></div>
                  <h5>Logo & Company Name</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Company Name</th>
                          <th>Company Short Name</th>
                          <th>Image</th>
                          <th>Favicon</th>
                          <th>Trade History Watermark</th>
                          {(locationname == 'test.smartalgo.in' || locationname == 'client.quickalgoplus.in' || locationname == 'software.chartology.in' || locationname == 'software.algoitech.com' || locationname == 'software.adonomist.com' || locationname == '180.149.241.128:3000' || locationname == 'software.skyiqinfotech.com' || locationname == 'software.primaxsolution.com' || locationname == 'software.advancetechnos.com' || locationname == 'client.roboticalgo.com' || locationname == 'software.algovertex.com') &&
                            <>
                              <th>Broker Name</th>
                              <th>Version</th>
                            </>}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{userDataCompany && userDataCompany.name}</td>
                          <td>{userDataCompany && userDataCompany.s_name}</td>
                          <td><img src={`/images/${userDataCompany && userDataCompany.image}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.image} /></td>
                          <td><img src={`/images/${userDataCompany && userDataCompany.favicon}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.favicon} /></td>

                          <td><img src={`/images/${userDataCompany && userDataCompany.tradehistory_watermark}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.tradehistory_watermark} /></td>

                          {(locationname == 'test.smartalgo.in' || locationname == 'client.quickalgoplus.in' || locationname == 'software.chartology.in' || locationname == 'software.algoitech.com' || locationname == 'software.adonomist.com' || locationname == '180.149.241.128:3000' || locationname == 'software.skyiqinfotech.com' || locationname == 'software.primaxsolution.com' || locationname == 'software.advancetechnos.com' || locationname == 'client.roboticalgo.com' || locationname == 'software.algovertex.com') &&
                            <>
                              <td>{userDataCompany && userDataCompany.withbroker == "" ? "-" : userDataCompany && userDataCompany.withbroker}</td>
                              <td>{userDataCompany && userDataCompany.versions == "" ? "-" : userDataCompany && userDataCompany.versions}</td>
                            </>}

                          <td style={{ position: 'relative' }}>
                            {/* <i
                            onClick={() => showCompanyUpdate()}
                            className="now-ui-icons shopping_tag-content  btn btn-primary btn-block"
                          ></i> */}
                            <i
                              className="fa-solid fa-pen-to-square fs-5 edit_hover h "
                              variant="primary"
                              onClick={(e) => showCompanyUpdate(e)}
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Edit"
                            ></i>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <h5>Email Details</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Email</th>
                          <th>CC</th>
                          <th>BCC</th>
                          <th>Password</th>
                          <th>SMTP Host</th>
                          <th>SMTP Port</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{userDataEmail && userDataEmail.email}</td>
                          <td>{userDataEmail && userDataEmail.cc_mail}</td>
                          <td>{userDataEmail && userDataEmail.bcc_mail}</td>
                          <td>{userDataEmail && userDataEmail.smtp_password}</td>
                          <td>{userDataEmail && userDataEmail.smtphost}</td>
                          <td>{userDataEmail && userDataEmail.smtpport}</td>
                          <td className="py-4 " style={{ position: 'relative' }}>
                            {/* <i
                            onClick={() => showEmailUpdate()}
                            className="now-ui-icons shopping_tag-content  btn btn-primary btn-block"
                          ></i> */}
                            <i
                              className="fa-solid fa-pen-to-square fs-5 edit_hover h "
                              variant="primary"
                              onClick={(e) => showEmailUpdate(e)}
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Edit"
                            ></i>

                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div class="row">
                    <div class="col-3">
                      <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a class="nav-link active" id="theme-1-tab" data-toggle="pill" href="#theme-1" role="tab" aria-controls="theme-1" aria-selected="true">Theme 1</a>
                        <a class="nav-link" id="theme-2-tab" data-toggle="pill" href="#theme-2" role="tab" aria-controls="theme-2" aria-selected="false">Theme 2</a>
                      </div>
                    </div>
                    <div class="col-9">
                      <div class="tab-content themetabsdiv" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="theme-1" role="tabpanel" aria-labelledby="theme-1-tab">
                          <div className="row">
                            <div className="col-md-6">
                              <input
                                type="file"
                                name="loginbackground"
                                onChange={(e) => setLoginImageTheme(e.target.files[0])}
                              />

                              <label class="radio d-flex pt-2 text-dark fw-bold">
                                <input type="radio" defaultChecked={userDataCompany.theme_status && userDataCompany.theme_status == 1} onClick={() => themeStatus("1")} name="answer" className="w-auto m-1" />
                                 Select Theme 1
                              </label>
                              <button className="btn-color btn btn-btn" onClick={() => submitLoginBackground()}>Update</button>
                            </div>
                            <div className="col-md-6">
                              {/* <img src={`/images/${userDataCompany && userDataCompany.bg_img}`} style={{ width: "300px" }} alt={userDataCompany && userDataCompany.bg_img} /> */}

                              <img src={loginImageTheme ? URL.createObjectURL(loginImageTheme) : `/images/${userDataCompany && userDataCompany.bg_img}`} style={{ width: "300px" }} alt={userDataCompany && userDataCompany.bg_img} />

                            </div>
                          </div>
                        </div>

                        <div class="tab-pane fade" id="theme-2" role="tabpanel" aria-labelledby="theme-2-tab">
                          <div className="row">
                            <div className="col-md-6">
                              <input
                                type="file"
                                name="loginbackground"
                                onChange={(e) => setLoginImageTheme(e.target.files[0])}
                              />
                              <label class="radio  d-flex pt-2 text-dark fw-bold">
                                <input type="radio" defaultChecked={userDataCompany.theme_status && userDataCompany.theme_status == 2} onClick={() => themeStatus("2")} name="answer" className="w-auto m-1" />
                                 Select Theme 2
                              </label>
                              <button className="btn-color btn btn-btn" onClick={() => submitLoginBackground()}>Update</button>

                            </div>
                            <div className="col-md-6">
                              {/* <img src={`/images/${userDataCompany && userDataCompany.bg_img}`} style={{ width: "300px" }} alt={userDataCompany && userDataCompany.bg_img} /> */}
                              {loginImageTheme ?
                                <img src={loginImageTheme ? URL.createObjectURL(loginImageTheme) : `/images/${userDataCompany && userDataCompany.bg_img}`} style={{ width: "300px" }} alt={userDataCompany && userDataCompany.bg_img} />
                                : ""}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div><br/> 

                  <h5 className="fw-bold text-decoration-underline">Setup for SignUp Clients</h5>
                  <p className="text-info">This Group Services and Strategy will be given to client who will Sign up from client panel.</p>
                  <div className="table-responsive">
                    <Table>
                      <div className='col-md-12'>
                        <div class="form-group">
                          <label className="text-dark fw-bold">Group</label>
                          <select
                            value={cgroup2 == "" ? cgroup : cgroup2}
                            onChange={(e) => groupChange(e)}
                            name="group"
                            class="form-control"
                          >
                            <option value="">Please Select group</option>
                            {group.map((sm, i) =>
                              <option
                                value={sm.id}> {sm.group_name}
                              </option>)
                            }
                          </select>
                        </div>

                        <div className="row" style={{ marginTop: "10px" }}>
                          {groupServices && groupServices.map((service, i) =>
                            <div className="col-md-2"
                              style={{
                                border: "1px solid #eee",
                                padding: "10px",
                                textAlign: "center",
                                borderRadius: "3px",
                                background: "#f96332",
                                color: "#fff",
                                width: "20%"
                              }}>{service.text}</div>
                          )}
                        </div>
                      </div>

                      <div className="row text-dark">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="text-dark fw-bold">Strategy</label>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label={toggleSwitch === true ? "Hide Strategies" : "Show Strategies"}
                              onClick={e => { setToggleSwitch(e.target.checked) }}
                            />

                            <div className="col-md-12">
                              <div className="row">
                                <>
                                  {toggleSwitch === true && strategy.map((sm, i) =>
                                  (
                                    <div className="col-md-4">
                                      <div class="form-check">
                                        <input class="form-check-input"
                                          onChange={(e) => { strategyClick(e) }}
                                          checked={checkstrategy(sm.name)}
                                          type="checkbox"
                                          value={sm.name}
                                          name="strategy"
                                        />
                                        <label class="form-check-label  text-dark">
                                          {sm.name}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="btn-color btn btn-btn" onClick={signupGroupAndServices}>Update</button>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            {
              <Modal show={showComapny} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Company Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter company name"
                            value={companyDetailUpdate.name}
                            name="name"
                            onChange={(e) => companyModelInputChange(e)}
                          // {...register("name", {onChange: (e) => {companyModelInputChange(e)}, required: true })}

                          />
                        </Form.Group>
                        {<span style={{ color: "red" }}> {companyNameErr}</span>}

                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Company Short Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter short name"
                            value={companyDetailUpdate.s_name}
                            name="s_name"
                            onChange={(e) => companyModelInputChange(e)}
                          />
                        </Form.Group>
                      </div>
                      {<span style={{ color: "red" }}> {companySNErr}</span>}

                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Logo</Form.Label>
                          <Form.Control
                            type="file"
                            name="image"
                            onChange={(e) => companyModelInputChange(e)}
                          // value={companyDetailUpdate.image}
                          />
                        </Form.Group>
                        {/* {console.log("companyDetailUpdate" ,companyDetailUpdate)} */}
                        {companyDetailUpdate &&
                          <img alt="not fount" width={"50px"} height={"50px"} src={typeof companyDetailUpdate.image == "object" ? URL.createObjectURL(companyDetailUpdate.image) : `/images/${companyDetailUpdate.image}`} />}
                        {<span style={{ color: "red" }}>{companyLogoErr}</span>}
                      </div>

                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Favicon</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={(e) => companyModelInputChange(e)}
                            name="favicon"
                          // value={companyDetailUpdate.favicon}

                          />
                        </Form.Group>

                        {companyDetailUpdate &&
                          <img alt="not fount" width={"50px"} height={"50px"} src={typeof companyDetailUpdate.favicon == "object" ? URL.createObjectURL(companyDetailUpdate.favicon) : `/images/${companyDetailUpdate.favicon}`} />}
                        {<span style={{ color: "red" }}>{companyFaviconErr}</span>}
                      </div>

                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Trade History Watermark</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={(e) => companyModelInputChange(e)}
                            name="th_watermark"
                          // value={companyDetailUpdate.favicon}

                          />
                        </Form.Group>

                        {companyDetailUpdate &&
                          <img alt="not fount" width={"50px"} height={"50px"} src={typeof companyDetailUpdate.tradehistory_watermark == "object" ? URL.createObjectURL(companyDetailUpdate.tradehistory_watermark) : `/images/${companyDetailUpdate.tradehistory_watermark}`} />}

                        <p className="text-info">*Select light watermark for better view on Trade History</p>

                      </div>

                      {(locationname == 'test.smartalgo.in' || locationname == 'client.quickalgoplus.in' || locationname == 'software.chartology.in' || locationname == 'software.algoitech.com' || locationname == 'software.adonomist.com' || locationname == '180.149.241.128:3000' || locationname == 'software.skyiqinfotech.com' || locationname == 'software.primaxsolution.com' || locationname == 'software.advancetechnos.com' || locationname == 'client.roboticalgo.com' || locationname == 'software.algovertex.com') &&
                        <>
                          <div className="col-md-6">
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicPassword"
                            >
                              <Form.Label>Broker</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Broker"
                                value={companyDetailUpdate.withbroker}
                                name="withbroker"
                                onChange={(e) => companyModelInputChange(e)}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-6">
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicPassword"
                            >
                              <Form.Label>Version</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Version"
                                value={companyDetailUpdate.versions}
                                name="versions"
                                onChange={(e) => companyModelInputChange(e)}
                              />
                            </Form.Group>

                          </div>
                        </>}


                    </div>
                    <button
                      type="button"
                      className="btn btn-color"
                      onClick={(e) => getCompanyDetailsUpdate(e)}
                    >
                      Update
                    </button>
                  </Form>
                </Modal.Body>
              </Modal>
            }

            {
              <Modal show={showEmail} onHide={handleCloseEmail}>
                <Modal.Header closeButton>
                  <Modal.Title>Email Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            name="email"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            {...register("email", {
                              onChange: (e) => { inputChange(e) }, required: true,
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                              }
                            })}

                            value={emailDetailUpdate.email}
                          />
                        </Form.Group>
                        {errors.email && <span style={{ color: "red" }}>* {Constant.EMAIL_VALIDATION}</span>}

                      </div>

                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>CC</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            name="cc_mail"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            {...register("cc_mail", {
                              onChange: (e) => { inputChange(e) },
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                              }
                            })}

                            value={emailDetailUpdate.cc_mail}
                          />
                        </Form.Group>
                        {errors.cc_mail && <span style={{ color: "red" }}>* {Constant.EMAIL_VALIDATION}</span>}

                      </div>

                      <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>BCC</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            name="bcc_mail"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            {...register("bcc_mail", {
                              onChange: (e) => { inputChange(e) },
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                              }
                            })}
                            value={emailDetailUpdate.bcc_mail}
                          />
                        </Form.Group>
                        {errors.bcc_mail && <span style={{ color: "red" }}>* {Constant.EMAIL_VALIDATION}</span>}
                      </div>

                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter email Password"
                            name="smtp_password"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            value={emailDetailUpdate.smtp_password}
                            {...register("smtp_password", { onChange: (e) => { inputChange(e) }, required: true })}

                          />
                        </Form.Group>
                        {errors.smtp_password && <span style={{ color: "red" }}>* {Constant.PASSWORD}</span>}

                      </div>

                      {/* <div className="col-md-6">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>CC Mail</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter CC Mail"
                            name="cc_mail"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            value={emailDetailUpdate.cc_mail}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>BCC Mail</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter BCC Mail"
                            name="bcc_mail"
                            onChange={(e) => {
                              inputChange(e);
                            }}
                            value={emailDetailUpdate.bcc_mail}
                          />
                        </Form.Group>
                      </div> */}

                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>SMTP Host</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter SMTP Host"
                            name="smtphost"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            {...register("smtphost", { onChange: (e) => { inputChange(e) }, required: true })}

                            value={emailDetailUpdate.smtphost}
                          />
                        </Form.Group>
                        {errors.smtphost && <span style={{ color: "red" }}>* {Constant.SMTP_HOST}</span>}

                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>SMTP Port</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter SMTP Port"
                            name="smtpport"
                            // onChange={(e) => {
                            //   inputChange(e);
                            // }}
                            {...register("smtpport", { onChange: (e) => { inputChange(e) }, required: true })}

                            value={emailDetailUpdate.smtpport}
                          />
                        </Form.Group>
                        {errors.smtpport && <span style={{ color: "red" }}>* {Constant.SMTP_PORT}</span>}

                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit(emailSmtpUpdate)}
                      className="btn btn-color"
                    >
                      Update
                    </button>
                  </Form>
                </Modal.Body>
              </Modal>
            }
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
    </>
  );
}




// Themes Codes

{/* <h5>Themes</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Theme 1</th>
                          <th>Image</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td onClick={() => { loginTheme1("1") }} id="main-panel" className="box-center" style={{
                            backgroundImage: `url("/images/StockTracker.gif")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                            height: "100px",
                            width: "150px",
                          }}>
                          </td> */}
{/* .bg_img */ }
// <input
//   type="file"
//   name="loginbackground"
//   onChange={(e) => setLoginImageTheme(e.target.files[0])}
// />

// <td className="py-4 " style={{ position: 'relative' }}>
//   <td><img src={`/images/${userDataCompany && userDataCompany.bg_img}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.bg_img} /></td>
// </td>

{/* <td onClick={() => { loginTheme1("2") }} id="main-panel" className="box-center" style={{
                            backgroundImage: `url("/images/StockTracker.gif")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                            height: "100px",
                            width: "150px",
                          }}>
                          </td> */}
                  //         <td className="py-4 " style={{ position: 'relative' }}>
                  //           <button className="btn btn-success" onClick={() => submitLoginBackground()}>Update</button>

                  //         </td>
                  //       </tr>
                  //     </tbody>
                  //   </Table>
                  // </div> */}