import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";

const superadmin_token = localStorage.getItem("superadmin_token");

const AddAdmin = () => {

    const [addEmail, setAddEmail] = useState("")
    const [addName, setAddName] = useState("")
    const [addPassword, setAddPassword] = useState("")
    const [addMobile, setAddMobile] = useState("")
    const [addLicence, setAddLicence] = useState("")
    const [addThisMonthLicence, setAddThisMonthLicence] = useState("")
    const [addClientKey, setAddClientKey] = useState("")
    const [addDomain, setAddDomain] = useState("")
    const [addPort, setAddPort] = useState("")
    const [addFirstThree, setAddFirstThree] = useState("")
    const [addEmailErr, setAddEmailErr] = useState("")
    const [addNameErr, setAddNameErr] = useState("")
    const [addPasswordErr, setAddPasswordErr] = useState("")
    const [addMobileErr, setAddMobileErr] = useState("")
    const [addLicenceErr, setAddLicenceErr] = useState("")
    const [addThisMonthLicenceErr, setAddThisMonthLicenceErr] = useState("")
    const [addClientKeyErr, setAddClientKeyErr] = useState("")
    const [addDomainErr, setAddDomainErr] = useState("")
    const [addPortErr, setAddPortErr] = useState("")
    const [addFirstThreeErr, setAddFirstThreeErr] = useState("")

    const navigate = useNavigate();

    const submitAddForm = (e) => {

        if (addEmail === "") {
            setAddEmailErr("Please Enter Email");
            return;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(addEmail)) {
            setAddEmailErr("Please Fill Proper Email");
            return;
        }

        if (addName === "") {
            setAddNameErr("Please Enter Name");
            return;
        }

        if (addPassword === "") {
            setAddPasswordErr("Please Enter Password");
            return;
        }

        if (addMobile.length < 10) {
            setAddMobileErr("Mobile number should be 10 digit");
            return;
        }
        if (addMobile.match(/[a-z]/i)) {
            setAddMobileErr("Letters are not accepted");
            return;
        }

        if (addLicence === "") {
            setAddLicenceErr("Please Enter Licence");
            return;
        }

        if (addThisMonthLicence === "") {
            setAddThisMonthLicenceErr("Please Enter This Month Licence");
            return;
        }

        if (addClientKey === "") {
            setAddClientKeyErr("Please Enter Client Key");
            return;
        }

        if (addDomain === "") {
            setAddDomainErr("Please Enter Domain");
            return;
        }

        if (addPort === "") {
            setAddPortErr("Please Enter Port");
            return;
        }

        if (addFirstThree === "") {
            setAddFirstThreeErr("Please Enter First Three");
            return;
        }


        axios({
            method: "post",
            url: `${Config.base_url}superadmin/addadmin`,
            data: {
                email: addEmail,
                name: addName,
                password: addPassword,
                mobile: addMobile,
                licence: addLicence,
                this_month_licence: addThisMonthLicence,
                client_key: addClientKey,
                domain: addDomain,
                port: addPort,
                first_three: addFirstThree,
            },
            headers: {
                'x-access-token': superadmin_token
            }
        }).then(function (res) {
            // console.log("hey", res)
            navigate("/superadmin/adminlist")
        })
    }

    const messegeErrorEmpty = () => {
        setAddEmailErr("")
        setAddNameErr("")
        setAddPasswordErr("")
        setAddMobileErr("")
        setAddLicenceErr("")
        setAddThisMonthLicenceErr("")
        setAddClientKeyErr("")
        setAddDomainErr("")
        setAddPortErr("")
        setAddFirstThreeErr("")
    }

    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-header">
                                <div className="row d-flex align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="title" style={{ marginBottom: "0px" }}>Add Admin</h5>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="back-button text-right">

                                            <NavLink
                                                to="/superadmin/adminlist"
                                                // to={roleId == "4" ? "/subadmin/clientlist" : "/admin/Clients"}
                                                className="btn btn-color"
                                            >
                                                <i class="fa fa-arrow-left mx-1" aria-hidden="true" data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Back"
                                                ></i> Back
                                            </NavLink>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 pl-1">
                                            <div className="form-group">
                                                <label for="exampleInputEmail1">Email</label>
                                                <input type="email"
                                                    onChange={(e) => { setAddEmail(e.target.value); messegeErrorEmpty(e) }}
                                                    name="email" className="form-control" placeholder="Email" />
                                                <p className="text-primary">{addEmailErr && addEmailErr}</p>
                                            </div>
                                        </div>

                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddName(e.target.value); messegeErrorEmpty(e) }}
                                                    name="full_name" placeholder="Full Name" className="form-control" />
                                                <p className="text-primary">{addNameErr && addNameErr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input type="password"
                                                    onChange={(e) => { setAddPassword(e.target.value); messegeErrorEmpty(e) }}
                                                    className="form-control" name="password" placeholder="Password"
                                                />
                                                <p className="text-primary">{addPasswordErr && addPasswordErr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Mobile Number</label>
                                                <input type="number"
                                                    onChange={(e) => { setAddMobile(e.target.value); messegeErrorEmpty(e) }}
                                                    className="form-control" name="mobile" placeholder="Mobile" maxlength="10"
                                                />
                                                <p className="text-primary">{addMobileErr && addMobileErr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Licence</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddLicence(e.target.value); messegeErrorEmpty(e) }}
                                                    className="form-control" name="licence" placeholder="Licence"
                                                />
                                                <p className="text-primary">{addLicenceErr && addLicenceErr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>This Month Licence</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddThisMonthLicence(e.target.value); messegeErrorEmpty(e) }}
                                                    name="this_month_licence" placeholder="This Month Licence" className="form-control" />
                                                <p className="text-primary">{addThisMonthLicenceErr && addThisMonthLicenceErr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Client Key</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddClientKey(e.target.value); messegeErrorEmpty(e) }}
                                                    name="client_key" placeholder="Client Key" className="form-control" />
                                                <p className="text-primary">{addClientKeyErr && addClientKeyErr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Domain</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddDomain(e.target.value); messegeErrorEmpty(e) }}
                                                    name="domain" placeholder="Domain" className="form-control" />
                                                <p className="text-primary">{addDomainErr && addDomainErr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>Port</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddPort(e.target.value); messegeErrorEmpty(e) }}
                                                    name="port" placeholder="Port" className="form-control" />
                                                <p className="text-primary">{addPortErr && addPortErr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 pr-1">
                                            <div className="form-group">
                                                <label>First Three</label>
                                                <input type="text"
                                                    onChange={(e) => { setAddFirstThree(e.target.value); messegeErrorEmpty(e) }}
                                                    name="first_three" placeholder="First Three" className="form-control" />
                                                <p className="text-primary">{addFirstThreeErr && addFirstThreeErr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-10 pr-1">
                                            <button type="button" onClick={() => submitAddForm()}
                                                className="btn btn-color">Add</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddAdmin