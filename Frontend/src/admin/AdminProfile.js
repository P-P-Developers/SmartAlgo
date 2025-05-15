import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import * as Config from "../common/Config";
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const adminId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");


  const [adminIdState, setAdminIdState] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [oldPasswordErr, setOldPasswordErr] = useState("");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");

  const [visiablity, setVisiablity] = useState("");
  const [changeTypeold, setChangeTypeold] = useState("password");
  const [changeTypenew, setChangeTypenew] = useState("password");
  const [changeTypeconfirm, setChangeTypeconfirm] = useState("password");


  // for toast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const navigate = useNavigate();


  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const reset = (e) => {
    e.preventDefault();
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputChange = (e) => {
    if (e.target.name === "old_password") {
      setOldPassword(e.target.value);
      setOldPasswordErr("");
    }
    if (e.target.name === "new_password") {
      setNewPassword(e.target.value);
      setNewPasswordErr("");
    }
    if (e.target.name === "confirm_password") {
      setConfirmPassword(e.target.value);
      setConfirmPasswordErr("");
    }
  };
  //  for post Admin Id
  useEffect(() => {
    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/admin/admin-profile`,
      data: {
        adminId: adminId,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      setAdminIdState(response.data[0]);
    });
  }, []);

  //  For Change password

  const submitform = () => {
    if (oldPassword === undefined || oldPassword === "") {
      setOldPasswordErr(Constant.OLD_PASSWORD);
      return;
    }
    if (newPassword === undefined || newPassword === "") {
      setNewPasswordErr(Constant.NEW_PASSWORD);
      return;
    }
    if (confirmPassword === undefined || confirmPassword === "") {
      setConfirmPasswordErr(Constant.CONFORM_PASSWORD);
      return;
    }

    // for Match Old Or New Password

    if (newPassword !== confirmPassword) {
      setShowAlert(true);
      setAlertColor("error");
      setTextAlert(Constant.OLD_AND_NEW_PASSWORD_NOT_MATCH);
      return;
    }

    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/admin/changepassword`,
      data: {
        adminId: adminId,
        old_password: oldPassword,
        new_password: newPassword,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      if (response.data.success == "true") {
        setConfirmPassword("");
        setOldPassword("");
        setNewPassword("");
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(response.data.msg);
        localStorage.removeItem("token");
        localStorage.removeItem("adminId");
        localStorage.removeItem("roleId");
        localStorage.removeItem("createdBy");
        navigate("/admin/login");
      } else {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert(response.data.msg);
      }
    });
  };

  const toggleoldpass = (e) => {
    e.preventDefault();
    if (changeTypeold === "password") {
      setChangeTypeold("text");
      setVisiablity("eye");
    } else {
      setChangeTypeold("password");
    }
  };

  const togglenewpass = (e) => {
    e.preventDefault();
    if (changeTypenew === "password") {
      setChangeTypenew("text");
      setVisiablity("eye");
    } else {
      setChangeTypenew("password");
    }
  };

  const toggleconfirmpass = (e) => {
    e.preventDefault();
    if (changeTypeconfirm === "password") {
      setChangeTypeconfirm("text");
      setVisiablity("eye");
    } else {
      setChangeTypeconfirm("password");
    }
  };

  return (
    <>
      <section class="content-header ">
        <h1>
          <i class="fa fa-user-circle"></i> My Profile
          <small>View or modify information</small>
        </h1>
      </section>
      <div className="container mt-4" >
        <div className="row">
          <div
            className="col-md-6 "
            style={{ height: "40vh" }}
          >
            <div className="justify-content-center flex-column d-flex mx-auto  rounded-3">
              <img
                className="profile-user-img img-responsive img-circle"
                src="http://app.smartalgo.in/assets/dist/img/avatar.png"
                alt="User profile picture"
              />
              <h4 className=" mx-auto mt-0">{adminIdState.name}</h4>
              <div className="d-flex flex-column mx-auto">
                <div className="d-flex">
                  <p className=" border-0">Email :- </p>
                  <p class="pull-right ms-3">{adminIdState.email}</p>
                </div>
                <div className="d-flex">
                  <p>Mobile :-</p>
                  <p class="pull-right ms-3">{adminIdState.mobile}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-light p-3 rounded-3 ">
              <h6 className="text-dark">Change-Password</h6>

              <form>
                <div className="password">
                  <label
                    style={{
                      color: "#000",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    Old Password
                  </label>
                  <div>
                    <input
                      type={changeTypeold}
                      className="form-control position-relative"

                      name="old_password"
                      placeholder="Old Password"
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      value={oldPassword}
                      style={{
                        position: "relative",

                      }}
                    ></input>
                    <i
                      class={
                        changeTypeold === "text" ? "fa-solid fa-eye-slash " : "fa-solid fa-eye "
                      }
                      onClick={(e) => toggleoldpass(e)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="password Visiblity"
                      style={{
                        position: "absolute",
                        right: "43px",
                        top: "284px",
                      }}
                    ></i>
                  </div>
                  <br />
                  <p className="text-primary">
                    {oldPasswordErr && oldPasswordErr}
                    <br />
                  </p>
                  <label
                    style={{
                      color: "#000",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    New Password
                  </label>
                  <div>
                  <input
                    type={changeTypenew}
                    className="form-control"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    name="new_password"
                    placeholder="New Password"
                    value={newPassword}
                  ></input>
                  <i
                      class={
                        changeTypenew === "text" ? "fa-solid fa-eye-slash " : "fa-solid fa-eye "
                      }
                      onClick={(e) => togglenewpass(e)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="password Visiblity"
                      style={{
                        position: "absolute",
                        right: "43px",
                        top: "398px",
                      }}
                    ></i>
                    </div>
                  <br />
                  <p className="text-primary">
                    {newPasswordErr && newPasswordErr}
                    <br />
                  </p>
                  <label
                    style={{
                      color: "#000",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    Confirm Password
                  </label>
                  <div>
                  <input
                    type={changeTypeconfirm}
                    className="form-control"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                  ></input>
                  <i
                      class={
                        changeTypeconfirm === "text" ? "fa-solid fa-eye-slash " : "fa-solid fa-eye "
                      }
                      onClick={(e) => toggleconfirmpass(e)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="password Visiblity"
                      style={{
                        position: "absolute",
                        right: "43px",
                        top: "513px",
                      }}
                    ></i>
                    </div>
                  <br />
                  <p className="text-primary">
                    {confirmPasswordErr && confirmPasswordErr}
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
                  {/* <button className="Reset" onClick={(e) => reset(e)}>
                    Reset
                  </button> */}
                </div>
              </form>
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
  );
};

export default AdminProfile;
