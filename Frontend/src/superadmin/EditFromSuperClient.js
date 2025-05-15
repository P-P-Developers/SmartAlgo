import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { WithContext as ReactTags } from "react-tag-input";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import * as Config from "../common/Config";
import { maskEmail, maskNumber } from "../common/HideWithStar";

function EditFromSuperClient() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [getClientData, setGetClientData] = useState([]);
  const [thisIdUserName, setThisIdUserName] = useState("")
  const [fullName, setFullName] = useState("")
  const [userName, setUserName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const navigate = useNavigate();
  const client_id = useParams()
  var panelKey = localStorage.getItem("PanelKey")
  var Superadmin_name = localStorage.getItem("Superadmin_name")

  const location = useLocation()
  console.log("location", location.state[0].url);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };


  const getAdminClients = () => {
    // var panelKey = localStorage.getItem("PanelKey")
    navigate("/superadmin/adminclientview", { state: location.state[0].url })
  }

  const clientViewProfileData = () => {
    axios({
      method: "get",
      url: `${location.state[0].url}superadmin/editfromsuperclient/${client_id.id}`,
    }).then(function (response) {
      // console.log("reponse", response.data.data[0].username);
      setGetClientData(response.data.data[0])
      setThisIdUserName(response.data.data[0].username)
    }
    )
  }

  const inputValue = (e) => {

    if (e.target.name == "full_name") {
      setGetClientData((prevState) => ({ ...prevState, ["full_name"]: e.target.value }))
    }

    if (e.target.name == "username") {
      setGetClientData((prevState) => ({ ...prevState, ["username"]: e.target.value }))
    }

    if (e.target.name == "mobile") {
      setGetClientData((prevState) => ({ ...prevState, ["mobile"]: e.target.value }))
    }

    if (e.target.name == "email") {
      setGetClientData((prevState) => ({ ...prevState, ["email"]: e.target.value }))
    }
  }

  const updateClient = (e) => {
    handleClose()

    axios({
      method: "post",
      url: `${location.state[0].url}superadmin/client/update`,
      data: {
        panelkey: panelKey,
        userdata: getClientData,
        Superadmin_name: Superadmin_name
      },
    })
      .then(function (response) {
        if (response.data.status === 'email_error') {
          setShowAlert(true);
          setAlertColor("error");
          setTextAlert(response.data.msg);
        } else {
          setShowAlert(true);
          setAlertColor("success");
          setTextAlert(response.data.msg);
          navigate("/superadmin/adminclientview")
        }
      })
  }

  useEffect(() => {
    clientViewProfileData()
  }, [])


  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-10">
            <div className="card">
              <div className="card-header">
                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>Edit Client SuperAdmin</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right">
                      {/* <NavLink
                        to= "/superadmin/adminclientview"
                      >
                      </NavLink> */}
                      <button>
                        <i class="fa fa-arrow-left me-1" aria-hidden="true" data-toggle="tooltip"
                          data-placement="top"
                          title="Back"
                          cursor="pointer"
                          onClick={getAdminClients}
                        >Back</i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={getClientData.full_name}
                          onChange={(e) => inputValue(e)}
                          placeholder="Full Name"
                          name="full_name"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          readOnly
                          type="text"
                          className="form-control"
                          name="username"
                          placeholder="Username"
                          value={getClientData.username}
                          onChange={(e) => inputValue(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="mobile"
                          placeholder="Mobile Number"
                          value={getClientData.mobile}
                          onChange={(e) => inputValue(e)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 pl-1">
                      <div className="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input
                          type="email"
                          value={getClientData.email}
                          onChange={(e) => inputValue(e)}
                          name="email"
                          className="form-control bg-white"
                          placeholder="Email"
                          style={{ cursor: 'text', color: 'black' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* <div className="col-md-6 pr-1">
                    <div className="form-group">
                      <label>Add Licence</label>
                      <input
                        type="number"
                        className="form-control"
                        name="add_licence"
                        placeholder="Add Licence"
                        min={0}
                      // value={getClientData.mobile}
                      />
                    </div>
                  </div> */}

                    {/* <div className="col-md-6 pl-1">
                    <div className="form-group">
                      <label for="exampleInputEmail1">Email</label>
                      <input
                        type="email"
                        value={getClientData.email}
                        name="email"
                        className="form-control bg-white"
                        placeholder="Email"
                        style={{ cursor: 'text', color: 'black' }}
                      />
                    </div>
                  </div> */}
                  </div>

                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button
                        type="button"
                        // onClick={updateClient}
                        onClick={handleShow}
                        className="btn btn-color"
                      >
                        Update
                      </button>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title> <h6>Do You agree to changes ?</h6></Modal.Title>
                      </Modal.Header>
                      {/* <Modal.Body>
                        <h3>Do You agree to changes ?</h3>
                        </Modal.Body> */}
                      <Modal.Footer>
                        <Button variant="secondary" onClick={updateClient}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>



                  </div>
                </form>
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


    </>



  )
}

export default EditFromSuperClient
