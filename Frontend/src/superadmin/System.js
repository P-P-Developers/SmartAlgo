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
  const [companyDetailUpdate, setCompanyDetailUpdate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [textAlert, setTextAlert] = useState("");
  const [rerender, setRerender] = useState(false);

  // console.log("userDataCompany" ,userDataCompany);
  // Errr msg States

  const [companyNameErr, setCompanyNameErr] = useState("")
  const [companySNErr, setCompanySNErr] = useState("")
  const [companyLogoErr, setCompanyLogoErr] = useState("")
  const [companyFaviconErr, setCompanyFaviconErr] = useState("")

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const { register, handleSubmit, formState: { errors } } = useForm();


  const handleClose = () => setShowCompany(false);
  const handleCloseEmail = () => setShowEmail(false);

  const showCompanyUpdate = (e) => {
    setShowCompany(true);
  };

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
      setUserDataCompany(response.data.data[0]);
      setCompanyDetailUpdate(response.data.data[0]);
    });
  }, [rerender]);


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
        setRerender(!rerender);
      }
    });
  };

  const getCompanyDetailsUpdate = (e) => {
    e.preventDefault()
    if (companyDetailUpdate.name === "undefined" || companyDetailUpdate.name === "") {
      setCompanyNameErr("Please enter company name");
      return
    }
    if (companyDetailUpdate.s_name === "undefined" || companyDetailUpdate.s_name === "") {
      setCompanySNErr("Please enter company sort name");
      return
    }
    if (companyDetailUpdate.image === "undefined" || companyDetailUpdate.image === "") {
      setCompanyLogoErr("Please upload logo");
      return
    }
    if (companyDetailUpdate.favicon === "undefined" || companyDetailUpdate.favicon === "") {
      setCompanyFaviconErr("Please upload favicon");
      return
    }


    var bodyFormData = new FormData();
    bodyFormData.append('image', companyDetailUpdate.image);
    bodyFormData.append('name', companyDetailUpdate.name);
    bodyFormData.append('s_name', companyDetailUpdate.s_name);
    bodyFormData.append('favicon', companyDetailUpdate.favicon);

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
        setRerender(!rerender)

      }
    });

  };

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
                    <Table striped bordered hover size="sm"  >
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Company Short Name</th>
                          <th>Image</th>
                          <th>Favicon</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{userDataCompany && userDataCompany.name}</td>
                          <td>{userDataCompany && userDataCompany.s_name}</td>
                          <td><img src={`/images/${userDataCompany && userDataCompany.image}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.image} /></td>
                          <td><img src={`/images/${userDataCompany && userDataCompany.favicon}`} style={{ width: "50px", height: "50px" }} alt={userDataCompany && userDataCompany.favicon} /></td>

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
                      <thead>
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
                          <td>{userDataEmail.email}</td>
                          <td>{userDataEmail.cc_mail}</td>
                          <td>{userDataEmail.bcc_mail}</td>
                          <td>{userDataEmail.smtp_password}</td>
                          <td>{userDataEmail.smtphost}</td>
                          <td>{userDataEmail.smtpport}</td>
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
