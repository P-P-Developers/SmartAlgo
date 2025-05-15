import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from '../common/AlertToast';
import { Modal, Button } from "react-bootstrap";
// import '../admin.css'
import './preview.css'

const LoginTheme1 = () => {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailErrMag, setEmailErrMsg] = useState("");
	const [passwordErrorMsg, setPasswordErrMsg] = useState("");
	const navigate = useNavigate();
	const [userDetails, setUserDetails] = useState("");
	// console.log("userDetails", userDetails);
	const [mobileOtp, setMobileOtp] = useState("");
	const [mobileOtpErr, setMobileOtpErr] = useState("");
	const [show, setShow] = useState(false);

	const [companyDetails, setCompanyDetails] = useState("");
	const [visiablity, setVisiablity] = useState("");
	const [changeType, setChangeType] = useState("password");

	// For Alert Toast
	const [showAlert, setShowAlert] = useState(false);
	const [textAlert, setTextAlert] = useState("");
	const [alertColor, setAlertColor] = useState("");

	const onAlertClose = (e) => {
		setShowAlert(false);
	}

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		axios({
			method: "get",
			url: `${Config.base_url}admin/system_company`,
		}).then(function (response) {
			setCompanyDetails(response.data.data);
		});
	}, [])


	const handleChange = (e) => {
		if (e.target.name == "email") {
			setEmail(e.target.value);
			setEmailErrMsg("");
		}
		if (e.target.name == "password") {
			setPassword(e.target.value);
			setPasswordErrMsg("");
		}
	};

	const submitform = (e) => {
		if (
			e.code === "NumpadEnter" ||
			e.code === "Enter" ||
			e.target.type === "button"
		) {
			if (email === "") {
				setEmailErrMsg(Constant.CLIENT_EMAIL);
				return;
			}
			if (password === "") {
				setPasswordErrMsg(Constant.PASSWORD);
				return;
			}

		} else {
			return "not match";
		}

		//  redirect
		// if(roleId)
		//  Alert_Toast

		axios({
			method: "post",
			url: `${Config.base_url}smartalgo/admin/login`,
			data: { email: email, password: password },
		}).then(function (response) {
			// console.log("response log ", response);
			if (response.data.success == "true") {
				setUserDetails(response.data.msg);
				handleShow();
			}
			else {
				setShowAlert(true);
				setAlertColor("error");
				setTextAlert(response.data.msg);
			}
		});
	};

	const isAuthenticated = localStorage.getItem("token");
	const roleId = localStorage.getItem('roleId');
	// console.log("roleId", roleId)
	if (isAuthenticated && roleId !== '4') {
		return <Navigate to="/admin/dashboard" />;
	} else if (isAuthenticated && roleId == '4') {
		return <Navigate to="/admin/signals" />;

	}

	const submitOtp = (e) => {

		if (mobileOtp === "") {
			setMobileOtpErr(Constant.ENTER_OTP);
			return;
		}
		if (mobileOtp !== userDetails.mobile.slice(-4)) {
			setMobileOtpErr(Constant.MOBILE_LAST_DIGITS);
			return;
		}
		// console.log("tet1");
		adminLoginStatusUpdate()
		localStorage.setItem("token", userDetails.token);
		localStorage.setItem("adminId", userDetails.adminId);
		localStorage.setItem("roleId", userDetails.roleId);
		localStorage.setItem("createdBy", userDetails.createdBy);
		if (userDetails.roleId == '4') {
			// localStorage.setItem("add__edit_live", userDetails.add__edit_live);
			// localStorage.setItem("edit_live", userDetails.edit_live);
			// localStorage.setItem("goto_dashboard", userDetails.goto_dashboard);
			// localStorage.setItem("group_permission", userDetails.group_permission);
			// localStorage.setItem("license_permission", userDetails.license_permission);
			// localStorage.setItem("strategy_permission", userDetails.strategy_permission);
			navigate("/admin/signals");
		}
		else {
			navigate("/admin/dashboard");
		}
	};


	const adminLoginStatusUpdate = () => {
		axios({
			method: "post",
			url: `${Config.base_url}smartalgo/admin/LoginStatusUpdate`,
			data: {
				adminId: userDetails.adminId,
			},
			headers: {
				'x-access-token': userDetails.token
			}
		}).then(function (response) {
			if (response) {
			}
		});
	}

	const toggle = (e) => {
		e.preventDefault();
		if (changeType === "password") {
			setChangeType("text");
			setVisiablity("eye");
		} else {
			setChangeType("password");
		}
	};

	return (
		<div>
			<div className="wrapper ">
				<div id="main-panel" className="box-center" style={{
					backgroundImage: `url(/images/${companyDetails && companyDetails[0].bg_img})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
				}}>
					<div className="content container">
						{/* <div className="row">
							<div className="col-md-3 mx-auto">
								<div className="text-center">
									<img style={{ width: "100%" }} src={`/images/${companyDetails && companyDetails[0].image}`} />
								</div>
							</div>
	</div> */}
						<div className="row" style={{ height: '90vh', alignItems: 'center' }}>
							<div className="col-md-4 mx-auto">
								<div className="card-1">
									<div className="card-header">
										<div className="row" >
											<div className="col-md-11 mx-auto">
												<div className="text-center">
													<img style={{ width: "100%", paddingBottom: '30px', paddingTop: '20px' }} src={`/images/smartalgologo.png`} />
												</div>
											</div>
										</div>
										<h3 className="text-center mb10"><b></b></h3>
									</div>
									<div className="card-body">
										<form value="Enter" onKeyPress={(e) => submitform(e)} className="login-form">
											<div className="row">
												<div className="col-md-12">
													<div className="form-group">
														{/* <label>Email</label> */}
														<input
															type="text"
															name="email"
															onChange={(e) => {
																handleChange(e);
															}}
															className="form-control"
															placeholder="Enter Email"
															value={email}
														/>
														{<p style={{ color: "red" }}>{emailErrMag}</p>}
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group">
														{/* <label>Password</label> */}
														<div>
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
																	top: "8px",
																	right: "15px",
																	top: "12px",
																}}
															></i>
														</div>
														{<p style={{ color: "red" }}>{passwordErrorMsg}</p>}
													</div>
												</div>
											</div>
											<div>
												<NavLink to="/admin/forgot-password" className='forgot-link'>
													Forgot Password
												</NavLink>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="row"></div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<button type="button" onClick={(e) => submitform(e)} className="btn btn-color ">
														Submit
													</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
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
					©
					<script>
					  document.getElementById('copyright').appendChild(document.createTextNode(new
					  Date().getFullYear()))
					</script>
					, Designed by
					<a href="#" target="_blank">
					  Invision
					</a>
					. Coded by
					<a href="#" target="_blank">
					  Creative Tim
					</a>
					.
				  </div>
				</div>
			  </footer> */}

					{
						<Modal show={show} onHide={handleClose}>
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
												if (e.code === "Enter" || e.code === "NumpadEnter")
													submitOtp(e)
											}}
										/>
										{<p style={{ color: "red" }}>{mobileOtpErr}</p>}
									</div>
								</div>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" className='btn-color' onClick={handleClose}>
									Close
								</Button>
								<Button
									variant="primary"
									className='btn-color'
									onClick={(e) => submitOtp(e)}
								>
									Submit
								</Button>
							</Modal.Footer>
						</Modal>
					}
					{showAlert && (
						<AlertToast
							hideAlert={onAlertClose}
							showAlert={showAlert}
							message={textAlert}
							alertColor={alertColor}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default LoginTheme1