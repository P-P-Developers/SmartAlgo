import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Navigate, NavLink, useLocation } from "react-router-dom";
import * as Config from "../common/Config";
import Modal from "react-bootstrap/Modal";
import { Icon } from '@iconify/react';
import { Form, Button } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import ConformAlert from "../common/ConformAlert";
import '../PreviewClient/previewclient.css'
import { encode, decode } from 'js-base64';
const ClientTheme1 = () => {
    const location = useLocation()

    const navigate = useNavigate();




    const [changeType, setChangeType] = useState("password");
    const [visiablity, setVisiablity] = useState("");



    const toggle = (e) => {
        e.preventDefault();
        if (changeType === "password") {
            setChangeType("text");
            setVisiablity("eye");
        } else {
            setChangeType("password");
        }
    };


    const [accountId, setAccountID] = useState("");
    const [accountIDErr, setAccountIDErr] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    const [VandarCode, setVandarCode] = useState("");
    const [VandarCodeErr, setVandarCodeErr] = useState("");



    const submitform = (e) => {
        console.log("location.state", location);
        if (location.state.brokerid === "3") {
            // for Zebull Broker
        }
        if (location.state.brokerid === "20") {
            // for Mar Broker


            let req = {
                VandarCode: VandarCode,
                accountId: accountId,
                password: password,
                State: location.state.token
            }
            axios({
                url: `${Config.broker_redirect_url}mastertrust_dealer/accesstoken`,
                method: "post",
                data: req
            }).then((res) => {
                if (res.data.status == true) {
                    navigate("/")
                } else {
                    alert(res.data.msg);
                }
            });
        }


    }











    return (
        <>
            <div className="wrapper">
                <div id="main-panel" className="box-center" style={{
                    // backgroundImage:
                    // `url(/images/${companyDetails && companyDetails[0].bg_img})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
                }}>
                    <div className="content container">
                        {/*    <div className="row">
                            <div className="col-md-3 mx-auto">
                                <div className="text-center">
                                    <img src={`/images/${companyDetails && companyDetails[0].image}`} style={{ width: "100%" }} />
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
                                                    <img style={{ width: "100%", paddingBottom: '10px', paddingTop: '20px' }}
                                                    //  src={`/images/${companyDetails && companyDetails[0].image}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-center mb-3"><b>Auth - 2 - Process</b></p>
                                    </div>
                                    <div className="card-body">
                                        <form className="login-form"
                                            value="Enter"
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter" || e.key === "NumpadEnter") {
                                                    e.preventDefault();
                                                    // submitform(e);
                                                }
                                            }}
                                        >

                                            {/* {location.state === "20"} */}

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label>Username</label>
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            onChange={(e) => {
                                                                setAccountID(e.target.value)
                                                                setAccountIDErr("")
                                                            }}
                                                            className="form-control"
                                                            placeholder=" Enter Account ID"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label>Vandor Code</label>
                                                        <input
                                                            type="text"
                                                            name="password"
                                                            onChange={(e) => {
                                                                setVandarCode(e.target.value)
                                                                setVandarCodeErr("")

                                                            }}
                                                            className="form-control"
                                                            placeholder="Vendor Code"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label>Password</label>
                                                        <input
                                                            type={changeType}
                                                            name="password"
                                                            onChange={(e) => {
                                                                setPassword(e.target.value)
                                                                setPasswordErr("")
                                                            }}
                                                            className="form-control"
                                                            placeholder="Enter Password"
                                                        // value={password}
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
                                                                top: "12px",
                                                                right: "15px",
                                                            }}
                                                        ></i>
                                                    </div>
                                                </div>
                                                {/* {<p style={{ color: "red" }}>{passwordErrorMsg}</p>} */}
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="row"></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 d-flex flex-row-reverse">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            submitform(e);
                                                        }}
                                                        className="btn btn-primary btn-color btn-block fw-bold"
                                                    >
                                                        Log In <Icon icon="material-symbols:login" />
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default ClientTheme1