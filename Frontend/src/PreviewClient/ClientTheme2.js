import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Navigate, NavLink, useLocation } from "react-router-dom";
import * as Config from "../common/Config";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import ConformAlert from "../common/ConformAlert";
import './previewclient.css'

const ClientTheme2 = () => {


    const locationname = window.location.host

    const location = useLocation()

    // console.log("location", location);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userNameErrMag, setuserNameErrMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrMsg] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");
    const [newConfirmPassErr, setConfirmPassErr] = useState("");
    const [show, setShow] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [disclaimerShow, setdisclaimerShow] = useState(false);
    const [termCheck, setTermCheck] = useState(false);
    const [companyDetails, setCompanyDetails] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const [userDetails, setUserDetails] = useState("");

    const [visiablity, setVisiablity] = useState("");
    const [changeType, setChangeType] = useState("password");
    const [changeTypeNewpass, setChangeTypeNewpass] = useState("password");
    const [changeTypeConfirm, setChangeTypeConfirm] = useState("password");


    const [showConformAlert, setShowConformAlert] = useState(false);
    const [conformAlertMsg, setConformAlertMsg] = useState("");

    const [mobileOtp, setMobileOtp] = useState("");
    const [mobileOtpErr, setMobileOtpErr] = useState("");

    const navigate = useNavigate();
    // const [value, setValue] = useState("");

    const onAlertClose = (e) => {
        setShowAlert(false);
    };

    // logo

    useEffect(() => {
        axios({
            method: "get",
            url: `${Config.base_url}admin/system_company`,
        }).then(function (response) {
            setCompanyDetails(response.data.data);
        });
    }, [])



    const onConformAlertClose = () => {
        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client/expiry-status-update`,
            data: {
                client_id: userDetails.user_id,
            },
            headers: {
                'x-access-token': userDetails.token
            }
        }).then(function (response) {
            if (response) {
                setShowConformAlert(false)
                userLoginStatusUpdate();
                clientPanelStatus();
                localStorage.setItem("client_token", userDetails.token);
                localStorage.setItem("client_id", userDetails.user_id);
                localStorage.setItem("client_name", userDetails.name);
                localStorage.setItem("user_login", userDetails.user_login);



                navigate("/");
            }
        });
    }
    const handleCloseOtp = () => setShowOtp(false);

    const handleClose = () => setShow(false);
    const handleClose1 = () => {
        setNewPassword("");
        setConfirmNewPassword("");
        setTermCheck("");
        setdisclaimerShow(false);
    }

    const disclaimersubmit = (e) => {

        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client/setnewpassword`,
            data: {
                newPassword: newPassword,
                client_id: userDetails.user_id,
                username: username,
            },
        }).then(function (response) {
            if (response) {
                navigate("/");
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Your new username & password send to mail");
            }
        });
    };

    const getNewPassword = (e) => {
        e.preventDefault();
        if (newPassword === "") {
            setNewPasswordErr("Please enter Password");
            return;
        }

        if (confirmNewPassword === "") {
            setConfirmPassErr("Please enter Confirm Password");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setConfirmPassErr("Password And Confirm Password Not Matched");
            return;
        }

        setdisclaimerShow(true);
        setShow(false);
    };

    const handleChange = (e) => {
        if (e.target.name == "username") {
            setUsername(e.target.value);
            setuserNameErrMsg("");
        }
        if (e.target.name == "password") {
            setPassword(e.target.value);
            setPasswordErrMsg("");
        }
    };

    const submitform = (e) => {
        // if (e.code === "Enter" || e.code === "NumpadEnter")

        if (username === "") {
            setuserNameErrMsg("Please enter your username");
            return;
        }
        if (password === "") {
            setPasswordErrMsg(Constant.PASSWORD);
            return;
        }

        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client/login`,
            data: { username: username, password: password },
        }).then(function (response) {
            if (response.data.success == "true") {
                const ExpiryDate = response.data.msg.expiry;
                const currentDate = new Date().toISOString().split('T')[0];
                // console.log("response.data.msg.is_term" ,response.data);

                if (response.data.msg.is_term == 0) {
                    setUserDetails(response.data.msg);
                    setShow(true);
                } else if (response.data.msg.is_term == 1) {
                    if (response.data.msg.status == 0) {
                        setShowAlert(true);
                        setAlertColor("error");
                        setTextAlert("Please contact admin you are Inactive");
                        return
                    }
                    else if (new Date(ExpiryDate).getTime() < new Date(currentDate).getTime()) {
                        setShowAlert(true);
                        setAlertColor("error");
                        setTextAlert("Your Plan is Expired Please Contact Admin");
                        return
                    }
                    else {

                        setShowOtp(true);
                        setUserDetails(response.data.msg);
                    }
                }
            } else {
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(response.data.msg);
            }
        });
    };












    const submitOtp = (e) => {


        if (mobileOtp === "") {
            setMobileOtpErr("Please enter otp");
            return;
        }
        if (mobileOtp !== userDetails.mobile.slice(-4)) {
            setMobileOtpErr("Please enter correct last 4 digit mobile no.");
            return;
        }
        if (userDetails.expiry_status == 3) {
            setShowConformAlert(true)
            setConformAlertMsg(`Hii ${userDetails.full_name} your subscription is ended in 2 days`);
            setShowOtp(false);
            return
        }
        else if (userDetails.expiry_status == 2) {
            setShowConformAlert(true)
            setConformAlertMsg(`Hii ${userDetails.full_name} your subscription is ended in 1 days`);
            setShowOtp(false);
            return
        }
        else if (userDetails.expiry_status == 1) {
            setShowConformAlert(true)
            setConformAlertMsg(`Hii ${userDetails.full_name} your subscription is ended today`);
            setShowOtp(false);
            return
        }
        userLoginStatusUpdate();
        clientPanelStatus();
        localStorage.setItem("client_token", userDetails.token);
        localStorage.setItem("client_id", userDetails.user_id);
        localStorage.setItem("client_name", userDetails.name);
        localStorage.setItem("test", "test");


        navigate("/");
    };

    const userLoginStatusUpdate = () => {
        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client/LoginStatusUpdate`,
            data: {
                client_id: userDetails.user_id,
            },
            headers: {
                'x-access-token': userDetails.token
            }
        }).then(function (response) {
            if (response) {
            }
        });
    }

    const clientPanelStatus = () => {
        axios({
            method: "post",
            url: `${Config.base_url}client/trading-status-update`,
            data: {
                client_id: userDetails.user_id,
                trading: "PanelON",

            },
            headers: {
                'x-access-token': userDetails.token
            }
        }).then(function (response) {
            if (response) {
            }
        });
    }

    const isAuthenticated = localStorage.getItem("client_token");
    const isAuthenticated1 = localStorage.getItem("token");

    if (isAuthenticated && isAuthenticated1) {
        localStorage.removeItem("client_token");
        return <Navigate to="/" />;
    }

    // if (isAuthenticated) {
    //     // return <Navigate to="/client/services" />;
    // }

    const toggle = (e) => {
        e.preventDefault();
        if (changeType === "password") {
            setChangeType("text");
            setVisiablity("eye");
        } else {
            setChangeType("password");
        }
    };

    const toggleNewpass = (e) => {
        e.preventDefault();
        if (changeTypeNewpass === "password") {
            setChangeTypeNewpass("text");
            setVisiablity("eye");
        } else {
            setChangeTypeNewpass("password");
        }
    };

    const toggleConfirmpass = (e) => {
        e.preventDefault();
        if (changeTypeConfirm === "password") {
            setChangeTypeConfirm("text");
            setVisiablity("eye");
        } else {
            setChangeTypeConfirm("password");
        }
    };


    return (
        <>
            <div className="wrapper" style={{ overflowX: 'hidden' }}>
                <div className="" id="main-panel">
                    <div className="content">
                        <section class="login2-section d-block">
                            <div class="row ">
                                <div className="col-md-6 img-section-div px-0">
                                    <div className="text-center">

                                        {/* <h5>Log in now to access</h5> */}
                                        <img src={`/ images / ${companyDetails && companyDetails[0].bg_img} `} className="imgBx" />
                                    </div>
                                </div>
                                <div className="col-md-6 px-0 " >
                                    <div className="formify_box " style={{ height: '100vh', alignItems: 'center' }}>
                                        <div className="card-header">
                                            <div className="row mt-2 mt-lg-4"  >
                                                <div className="col-md-11 mx-auto">
                                                    <div className="text-center">
                                                        <img style={{ width: "50%", paddingBottom: '30px', paddingTop: '20px' }} src={`/ images / ${companyDetails && companyDetails[0].image} `} />
                                                        <p className="form_title">Sign in to your account</p>

                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-center mb10"><b></b></h3>
                                        </div>
                                        <div className="card-body">
                                            <form
                                                value="Enter"
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter" || e.key === "NumpadEnter") {
                                                        e.preventDefault();
                                                        submitform(e);
                                                    }
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            {/* <label>Username</label> */}
                                                            <input
                                                                type="text"
                                                                name="username"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                }}
                                                                className="form-control"
                                                                placeholder="Enter username"
                                                                value={username}
                                                            />
                                                        </div>
                                                    </div>
                                                    {<p style={{ color: "red" }}>{userNameErrMag}</p>}
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            {/* <label>Password</label> */}
                                                            <input
                                                                type={changeType}
                                                                name="password"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                }}
                                                                className="form-control"
                                                                placeholder="Enter Password"
                                                                value={password}
                                                            />
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
                                                                    top: "20px",
                                                                    right: "15px",
                                                                    zIndex: 2,
                                                                }}
                                                            ></i>
                                                        </div>
                                                    </div>
                                                    {<p style={{ color: "red" }}>{passwordErrorMsg}</p>}
                                                </div>
                                                <div>
                                                    <NavLink to="/client/forgot-password" className="forgot-link">
                                                        Forgot Password?
                                                    </NavLink><br /><br />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row"></div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                {(locationname === 'trade.adonomist.com' || locationname === 'trade.bizxsolution.com') ? "" : <>
                                                    <div className="col-md-6">
                                                        <NavLink to="/csignup" className="forgot-link btn btn-primary btn-color btn-block text-light ">
                                                            Sign Up
                                                        </NavLink>
                                                    </div>
                                                </>}
                                                    <div className="col-md-6 d-flex flex-row-reverse">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                submitform(e);
                                                            }}
                                                            className="btn btn-primary btn-color btn-block fw-bold"
                                                        >
                                                            Log In
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </section>

                    </div>
                    {/* <footer className="footer">
			<div className=" container-fluid ">
			  <nav>
				<ul>
				  <li>
					<a href="https://www.creative-tim.com">Creative Tim</a>
				  </li>
				  <li>
					<a href="http://presentation.creative-tim.com">About Us</a>
				  </li>
				  <li>
					<a href="http://blog.creative-tim.com">Blog</a>
				  </li>
				</ul>
			  </nav>
			  <div className="copyright" id="copyright">
				©{" "}
				<script>
				  document.getElementById('copyright').appendChild(document.createTextNode(new
				  Date().getFullYear()))
				</script>
				, Designed by{" "}
				<a href="#" target="_blank">
				  P & P Infotech
				</a>
				. Coded by{" "}
				<a href="#" target="_blank">
				  Creative Team
				</a>
				.
			  </div>
			</div>
		  </footer> */}
                </div>
                {
                    <Modal show={show} onHide={handleClose} >
                        <Modal.Header closeButton>
                            <Modal.Title>Set New Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onKeyPress={(e) => {
                                if (e.key === "Enter" || e.key === "NumpadEnter") {
                                    // e.preventDefault();
                                    getNewPassword(e);
                                }
                            }}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Password</Form.Label>
                                    <div>
                                        <Form.Control
                                            type={changeTypeNewpass}
                                            placeholder="Enter password"
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setNewPasswordErr("");
                                            }}
                                        />
                                        <i
                                            class={
                                                changeTypeNewpass === "text"
                                                    ? "fa-solid fa-eye-slash "
                                                    : "fa-solid fa-eye "
                                            }
                                            onClick={(e) => toggleNewpass(e)}
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="password Visiblity"
                                            style={{
                                                position: "absolute",
                                                top: "52px",
                                                right: "32px",
                                            }}
                                        ></i>
                                    </div>
                                </Form.Group>
                                <span style={{ color: "red" }}> {newPasswordErr}</span>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <div>
                                        <Form.Control
                                            type={changeTypeConfirm}
                                            placeholder="Enter Confirm Password"
                                            onChange={(e) => {
                                                setConfirmNewPassword(e.target.value);
                                                setConfirmPassErr("");
                                            }}
                                        />
                                        <i
                                            class={
                                                changeTypeConfirm === "text"
                                                    ? "fa-solid fa-eye-slash "
                                                    : "fa-solid fa-eye "
                                            }
                                            onClick={(e) => toggleConfirmpass(e)}
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="password Visiblity"
                                            style={{
                                                position: "absolute",
                                                top: "125px",
                                                right: "32px",
                                            }}
                                        ></i>
                                    </div>
                                    <span style={{ color: "red" }}> {newConfirmPassErr}</span>
                                </Form.Group>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        getNewPassword(e);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" || e.key === "NumpadEnter") {
                                            // e.preventDefault();
                                            getNewPassword(e);
                                        }
                                    }}
                                    className="btn btn-primary btn-color btn-block"
                                >
                                    Submit
                                </button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                }
                {
                    <Modal show={disclaimerShow} onHide={handleClose1}>
                        <Modal.Header closeButton>
                            <Modal.Title>Disclaimer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onKeyPress={(e) => {
                                if (e.key === "Enter" || e.key === "NumpadEnter") {
                                    // e.preventDefault();
                                    disclaimersubmit(e);
                                }
                            }}>
                                All subscription fees paid to {Config.panel_name.toUpperCase()} is Non refundable. We
                                do not provide trading tips nor we are investment adviser. Our
                                service is solely restricted to automated trading application
                                development, deployment and maintenance. All algorithms are
                                based on backtested data but we do not provide any guarantee for
                                their performance in future. The algorithm running in an
                                automated system is agreed with the user prior deployment and we
                                do not take any liability for any loss generated by the same.
                                Past performance of advise/strategy/model does not indicate the
                                future performance of any current or future strategy/model or
                                advise by {Config.panel_name.toUpperCase()} Trades and actual returns may differ
                                significantly from that depicted herein due to various factors
                                including but not limited to impact costs, expense charged,
                                timing of entry/exit, timing of additional flows/redemptions,
                                individual client mandates, specific portfolio construction
                                characteristics etc. There is no assurance or guarantee that the
                                objectives of any strategy/model or advice provided by {Config.panel_name.toUpperCase()}
                                Trades will be achieved. {Config.panel_name.toUpperCase()} Trades or any of its
                                partner/s or principal officer/employees do not assure/give
                                guarantee for any return on the investment in
                                strategies/models/advice given to the Investor. The value of
                                investment can go up/down depending on factors & forces
                                affecting securities markets. {Config.panel_name.toUpperCase()} Trades or its
                                associates are not liable or responsible for any loss or
                                shortfall arising from operations and affected by the market
                                condition.
                                <br />
                                {/* <input type="checkbox" id="term_check" className="term_check" name="term_check" onChange={(e)=> {setTerChecked(e.target.value)}} /> */}
                                <input
                                    type="checkbox"
                                    checked={termCheck}
                                    id="term_check"
                                    onChange={() => {
                                        setTermCheck(!termCheck);
                                    }}
                                />
                                <label for="term_check">
                                    Agree & I accept Term And Condition
                                </label>
                                <br />
                                <button
                                    type="button"
                                    disabled={!termCheck}
                                    onClick={(e) => {
                                        disclaimersubmit(e);
                                    }}
                                    className="btn btn-primary btn-color btn-block"
                                >
                                    Submit
                                </button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                }

                {
                    <Modal show={showOtp} onHide={handleCloseOtp}>
                        <Modal.Header closeButton>
                            <Modal.Title>Verify Mobile Last 4 digit</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="col-md-10 pr-1">
                                <div className="form-group">
                                    <label>Enter- Mobile No. Last 4 digit</label>
                                    <input
                                        type="text"
                                        name="otp"
                                        maxlength="4"
                                        onChange={(e) => {
                                            setMobileOtp(e.target.value);
                                            setMobileOtpErr("");
                                        }}
                                        className="form-control"
                                        placeholder="Enter OTP"
                                        // value={email}
                                        onKeyPress={(e) => {
                                            // if(e.code === "Enter" || e.code === "NumpadEnter")
                                            submitOtp(e)
                                        }}
                                    />
                                    {<p style={{ color: "red" }}>{mobileOtpErr}</p>}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" className='btn-color' onClick={handleCloseOtp}>
                                Close
                            </Button>
                            <Button variant="primary" className='btn-color' onClick={submitOtp}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }
            </div>

            {showAlert && (
                <AlertToast
                    hideAlert={onAlertClose}
                    showAlert={showAlert}
                    message={textAlert}
                    alertColor={alertColor}
                />
            )}

            {showConformAlert && (
                <ConformAlert
                    show={showConformAlert}
                    handleClose={onConformAlertClose}
                    message={conformAlertMsg}
                />
            )}

        </>
    )
}

export default ClientTheme2