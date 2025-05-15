import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { Form } from "react-bootstrap";
import Backdrop from '@mui/material/Backdrop';
import { dateFormate } from "../common/CommonDateFormate";
import { maskEmail, maskNumber } from "../common/HideWithStar";
import CircularProgress from '@mui/material/CircularProgress';


export default function ClientProfile() {

  const client_id = localStorage.getItem("client_id");
  const fromadmin = localStorage.getItem('from_admin');
  const fromsubadmin = localStorage.getItem('from_subadmin');
  let navigate = useNavigate();
  const [clientDeatils, setClientDetails] = useState("");
  // console.log("clientDeatils", clientDeatils);
  const [ChangePassword, setChangepassword] = useState("");
  const [strategy, setStrategy] = useState("");
  const [services, setServices] = useState("");
  const [userdata, setUserdata] = useState("");
  const [reandomClientKey, setRandomClientKey] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [oldPasswordErrMsg, setOldPasswordErrMsg] = useState("");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [conformedPasswordErr, setConformPasswordErr] = useState("");
  const [apiKeyErr, setApiKeyErr] = useState("");
  const [apiSecretErr, setApiSecretErr] = useState("");
  const [apiIdErr, setApiIdErr] = useState("");
  const [clientCodeErr, setClientCodeErr] = useState("");
  const [apiTypeErr, setApiTypeErr] = useState("");
  const [webUrlErr, setWebUrlErr] = useState("");
  const [dematUserErr, setDematUserErr] = useState("");
  const [randomClientKeyErr, setRandomClientKeyErr] = useState("");
  const [brokerStatus, setBrokerStatus] = useState("")
  const [brokerId, setBrokerId] = useState("")
  const [clientCode, setClientCode] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loader, setLoader] = useState(false);
  const [visiablity, setVisiablity] = useState("");
  const [changeTypeold, setChangeTypeold] = useState("password");
  const [changeTypenew, setChangeTypenew] = useState("password");
  const [changeTypeconfirm, setChangeTypeconfirm] = useState("password");

  const client_token = localStorage.getItem('client_token');


  const inputChange = (e) => {
    if (e.target.name == "old_password") {
      setUserdata((prevState) => ({
        ...prevState,
        ["old_password"]: e.target.value,
      }));
      setOldPasswordErrMsg("");
    }

    if (e.target.name == "new_password") {
      setUserdata((prevState) => ({
        ...prevState,
        ["new_password"]: e.target.value,
      }));
      setNewPasswordErr("");
    }

    if (e.target.name == "confirm_password") {
      setUserdata((prevState) => ({
        ...prevState,
        ["confirm_password"]: e.target.value,
      }));
      setConformPasswordErr("");
    }

    if (e.target.name == "api_key") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["api_key"]: e.target.value,
      }));
      setApiKeyErr("");
    }

    if (e.target.name == "client_code") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["client_code"]: e.target.value,
      }));
      setClientCodeErr("");
    }

    if (e.target.name == "api_type") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["api_type"]: e.target.value,
      }));
      setApiTypeErr("");
    }

    if (e.target.name == "api_secret") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["api_secret"]: e.target.value,
      }));
      setApiSecretErr("");
    }
    if (e.target.name == "app_id") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["app_id"]: e.target.value,
      }));
      setApiIdErr("");
    }
    if (e.target.name == "demat_userid") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["demat_userid"]: e.target.value,
      }));
      setDematUserErr("");
    }

    if (e.target.name == "web_url") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["web_url"]: parseInt(e.target.value),
      }));
      setWebUrlErr("");
    }
    if (e.target.name == "qty_type") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["qty_type"]: parseInt(e.target.value),
      }));
      setWebUrlErr("");
    }
    if (e.target.name == "sig_exe_type") {
      setClientDetails((prevState) => ({
        ...prevState,
        ["signal_execution"]: parseInt(e.target.value),
      }));
      // setWebUrlErr("");
    }
  };

  const onAlertClose = (e) => {
    setShowAlert(false);
  };


  const Changepassword = () => {

    if (userdata === "" || userdata.old_password === "") {
      setOldPasswordErrMsg(Constant.OLD_PASSWORD);
      return;
    }
    if (!userdata.new_password || userdata.new_password === "undefined" || userdata.new_password === "") {
      setNewPasswordErr(Constant.NEW_PASSWORD);
      return;
    }
    if (!userdata.confirm_password ||
      userdata.confirm_password === "undefined" ||
      userdata.confirm_password === ""
    ) {
      setConformPasswordErr(Constant.CONFORM_PASSWORD);
      return;
    }
    if (userdata.new_password !== userdata.confirm_password) {
      setConformPasswordErr(Constant.PASSWORD_NOT_MATCH);
      return;
    }

    axios({
      url: `${Config.base_url}client/ChangePassword`,
      method: "POST",
      data: {
        client_id: client_id,
        data: userdata,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      // console.log("abc" ,res);
      if (res.data.success === "false") {
        // setOldPassword(true);
        setOldPasswordErrMsg(res.data.msg);

        // alert(res.data.msg);
      } else {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(res.data.msg);
        localStorage.removeItem('client_token');
        localStorage.removeItem("client_id");
        localStorage.removeItem("client_name");
        navigate('/login')
      }
    });
  };

  const ClientDetails = () => {
    setLoader(true)
    axios({
      url: `${Config.base_url}client/profile`,
      method: "POST",
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': client_token
      }
    })
      .then((res) => {
        if (res.data) {
          console.log("daaaaata", res.data);
          setClientDetails(res.data.msg);
          setRandomClientKey(res.data.msg.client_key)

          setBrokerStatus(res.data.msg.trading_type)
          setBrokerId(res.data.msg.broker)
          setClientCode(res.data.msg.client_code)
        }
        setLoader(false)
      });
  };


  const clientServices = () => {
    setLoader(true)
    axios({
      url: `${Config.base_url}client/services`,
      method: "post",
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {

      setStrategy(res.data.strategy);
      setServices(res.data.services);
      setLoader(false)
    });
  };

  const getBrokerTypeFields = () => {
    switch (clientDeatils && clientDeatils.broker) {
      case "1":
        return (
          <>
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Aliceblue
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY / APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}

              value={clientDeatils
                .api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              APP ID / USER ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p> {apiIdErr} </p>

            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              DEMATE USER ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.demat_userid}
              name="demat_userid"
            />
            <p> {dematUserErr} </p>
            <br />
          </>
        );
      case "2":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Zerodha
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Api Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              Api Secret Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
          </>
        );
      case "3":
        return (
          <>

            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              ZEBULL
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              User Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="APP Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              DOB
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="example:- 15-08-1947"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>

          </>

        );
      case "4":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Angel
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Api Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            {/* <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Client Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br /> */}
            {/* <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br /> */}
          </>
        );
      case "5":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              5paisa
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              User Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p> {apiIdErr} </p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Encryption Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
          </>
        );
      case "6":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Fyers
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              App Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />

            <p> {apiIdErr} </p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Secret Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />

            <p> {apiSecretErr}</p>
            <br />
          </>
        );
      case "7":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Indira
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Investor Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Client Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="app_id"
            />
            value={clientDeatils.app_id}
            <p>{apiIdErr}</p>
            <br />
          </>
        );
      case "9":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline markethub"
              id="markethub"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Market-Hub
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Client Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Verification Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Verification Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>

            <br />
          </>
        );
      case "10":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Market-Trust
            </label>
            <br /> <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              Api Secret Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="enter api secret key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>

            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              App Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="enter app id"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
          </>
        );
      case "11":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              B2C
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Client Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              2FA
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="2FA"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="API Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
          </>
        );
      case "12":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline motilaloswal"
              id="motilaloswal"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Motilal Oswal
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              CLIENT CODE
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="client_code"
              value={clientDeatils.client_code}
            />
            <p>{clientCodeErr}</p>
            <br />
          </>
        );
      case "13":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="anandrathi"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              Anand Rathi
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr} </p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "14":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline choice"
              id="choice"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Choice
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Vendor Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Vendor Id"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              User Id
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="User Id"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.demat_userid}
              name="demat_userid"
            />
            <p>{dematUserErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Vendor Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Vendor Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Encryption Secret Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Encryption Secret Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Encryption IV
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Encryption IV"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
          </>
        );
      case "15":
        return (
          <>
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Mandot
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}

              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr} </p>
            <br />
          </>
        );
      case "16":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Kotak
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Consumer Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Consumer Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Consumer Secret
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Consumer Secret"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p> {clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Demat Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Demat Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p> {apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Trade Api Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Trade Api Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
          </>
        );
      case "18":
        return (
          <>
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              IIFL
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}

              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr} </p>
            <br />
          </>
        );
      case "19":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Arihant
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              User ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              2FA
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="2FA"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="API Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
          </>
        );
      case "20":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Master Trust Dealer
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              User ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              App Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p> {apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p>{apiIdErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Account ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Account ID"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Vendor Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Vendor Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
          </>
        );
      case "21":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline motilaloswal"
              id="motilaloswal"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Laxmi
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "22":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Kotak Neo
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Consumer Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Consumer Key"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Consumer Secret
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Consumer Secret"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p> {clientCodeErr}</p>
            <br />
            {/* <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Demat Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Demat Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />
            <p> {apiIdErr}</p> */}
            {/* <br /> */}
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Trade Api Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
          </>
        );
      case "23":
        return (
          <>

            <label
              className="radio-inline swastika"
              id="swastika"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Swastika
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              CLIENT CODE
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              MPIN
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="app_id"
              value={clientDeatils.app_id}
            />
            <p>{apiSecretErr}</p>
            <br />
          </>
        );
      case "24":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline motilaloswal"
              id="motilaloswal"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Indira XTS
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "25":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline motilaloswal"
              id="motilaloswal"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              ICICI Direct
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "27":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline motilaloswal"
              id="motilaloswal"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Dhan
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              CLIENT ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p>{clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              ACCESS TOKEN
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "28":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >

              Upstox
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Api Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500", marginBottom: "10px" }}
            >
              Secret Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr}</p>
            <br />
          </>
        );
      case "29":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline 5paisa"
              id="5paisa"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Sharekhan
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Customer ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p> {clientCodeErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              API Secure Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p> {apiSecretErr} </p>
            <br />

          </>
        );
      case "30":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline SMC"
              id="SMC"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SMC
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "31":
        return (
          <>
            {/* <input type="radio" name="optradio"/> &nbsp; */}
            <label
              className="radio-inline SMC"
              id="adroit"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Adroit
            </label>
            <br /> <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              SECRET KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />
            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              APP KEY
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                inputChange(e);
              }}
              name="api_key"
              value={clientDeatils.api_key}
            />
            <p>{apiKeyErr}</p>
            <br />
          </>
        );
      case "32":
        return (
          <>
            <label
              className="radio-inline 5paisa"
              id="Shoonya"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Shoonya
            </label>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p> {clientCodeErr}</p>

            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Trade Api Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Vendor Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Vendor Code"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_key}
              name="api_key"
            />
            <p>{apiKeyErr}</p>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Api Key
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Api Secret"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_secret}
              name="api_secret"
            />
            <p>{apiSecretErr}</p>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Imei
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Imei"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.app_id}
              name="app_id"
            />

            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Totp Secret
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Totp Secret"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.demat_userid}
              name="demat_userid"
            />
          </>
        );




      case "33":
        return (
          <>
            <label
              className="radio-inline 5paisa"
              id="Shoonya"
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Samco
            </label>
            <br />

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.client_code}
              name="client_code"
            />
            <p> {clientCodeErr}</p>


            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Trade Api Password"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.api_type}
              name="api_type"
            />
            <p> {apiTypeErr}</p>
          <br />

        

            <label
              style={{ color: "#000", fontSize: "17px", fontWeight: "500" }}
            >
             Birth Of Year
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Totp Secret"
              onChange={(e) => {
                inputChange(e);
              }}
              value={clientDeatils.demat_userid}
              name="demat_userid"
            />
          </>
        );

    }
  };

  const SubmitDetaials = () => {
    console.log("broker" ,clientDeatils.broker);
    console.log("client_code" ,clientDeatils.client_code);
    console.log("app_id" ,clientDeatils.app_id);



    console.log("clientDeatils" ,clientDeatils);

    console.log("Constant" ,Constant);

    // return
    switch (clientDeatils && clientDeatils.broker) {
      case "1":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.demat_userid === "undefined" || clientDeatils.demat_userid == "") {
          setDematUserErr(Constant.DEMAT_USERID);
          return;
        }
        break;
      case "2":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "3":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "4":
        if (clientDeatils.api_key == "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
    
        break;
      case "5":
        if (clientDeatils.api_key == "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        // if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
        //   setApiSecretErr(Constant.API_SECRET);
        //   return;
        // }
        break;
      case "6":
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "7":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        break;
      case "9":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "10":
       
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        break;
      case "11":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        break;
      case "12":
        // {console.log("clientDeatils",typeof clientDeatils.api_secret)}
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiSecretErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code === "") {
          setApiIdErr(Constant.CLIENT_CODE);
          return;
        }
        break;
      case "13":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiKeyErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key == "undefined" || clientDeatils.api_key == "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "14":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.demat_userid === "undefined" || clientDeatils.demat_userid == "") {
          setDematUserErr(Constant.DEMAT_USERID);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiSecretErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret == "") {
          setApiKeyErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_type === "undefined" || clientDeatils.api_type == "") {
          setApiKeyErr(Constant.API_TYPE);
          return;
        }
        break;
      case "15":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiSecretErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiIdErr(Constant.API_SECRET);
          return;
        }
        break;
      case "16":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_type === "undefined" || clientDeatils.api_type == "") {
          setApiKeyErr(Constant.API_TYPE);
          return;
        }
        break;
      case "18":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiSecretErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiIdErr(Constant.API_SECRET);
          return;
        }
        break;
      case "19":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        break;
      case "20":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret == "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_type === "undefined" || clientDeatils.api_type == "") {
          setApiKeyErr(Constant.API_TYPE);
          return;
        }
        break;
      case "21":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "22":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        // if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
        //   setApiIdErr(Constant.APP_ID);
        //   return;
        // }
        if (clientDeatils.api_type === "undefined" || clientDeatils.api_type == "") {
          setApiKeyErr(Constant.API_TYPE);
          return;
        }
        break;
      case "23":
     
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.app_id === "undefined" || clientDeatils.app_id === "") {
          setApiIdErr(Constant.APP_ID);
          return;
        }
    
        break;
      case "24":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "25":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "27":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code === "") {
          setApiSecretErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "28":
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "29":
        if (clientDeatils.client_code === "undefined" || clientDeatils.client_code == "") {
          setClientCodeErr(Constant.CLIENT_CODE);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key == "") {
          setApiKeyErr(Constant.API_KEY);
          return;
        }
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        break;
      case "30":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
      case "31":
        if (clientDeatils.api_secret === "undefined" || clientDeatils.api_secret === "") {
          setApiSecretErr(Constant.API_SECRET);
          return;
        }
        if (clientDeatils.api_key === "undefined" || clientDeatils.api_key === "") {
          setApiIdErr(Constant.API_KEY);
          return;
        }
        break;
    }



    if (clientDeatils.web_url == "0" || clientDeatils.web_url === "") {
      setWebUrlErr(Constant.WEBURL);
      return;
    }
    if (clientDeatils.web_url == "2") {
      if (reandomClientKey === "undefined" || reandomClientKey === "") {
        setRandomClientKeyErr(Constant.RANDOM_CLIENT_KEY);
        return;
      }
    }

    axios({
      url: `${Config.base_url}client/updatedeatils`,
      method: "POST",
      data: {
        client_id: client_id,
        data: clientDeatils,
        reandomClientKey: reandomClientKey,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      if (res.data.status === 'api_key_error') {
        setShowAlert(true)
        setAlertColor('error');
        setTextAlert(res.data.msg);

      } else {
        // setOldPasswordErrMsg(res.data.msg);
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(res.data.msg);
      }
    });
  };

  // const generateClientKey = () => {
  //   const min = 1;
  //   const max = 100000000;
  //   const rand = min + Math.random() * (max - min);
  //   setRandomClientKey(Math.round(rand));
  // };

  useEffect(() => {
    ClientDetails();
    clientServices();
  }, [clientCode]);


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
      <Backdrop
        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <section className="content-header">
          <h1>
            <i className="fa fa-user-circle"></i> My Profile
            <small>&nbsp; &nbsp; View or modify information</small>
          </h1>
        </section>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="box-body box-profile">
                <img
                  className="profile-user-img img-responsive img-circle"
                  src="http://app.smartalgo.in/assets/dist/img/avatar.png"
                  alt="User profile picture"
                />
                <h3 className="profile-username text-center">
                  {clientDeatils.full_name}
                </h3>
                <ul className="list-group list-group-unbordered">
                  <li className="list-group-item">
                    <b>Email</b> <b className="pull-right">{clientDeatils && maskEmail(clientDeatils.email)}</b>
                  </li>
                  <li className="list-group-item">
                    <b>Mobile</b>{" "}
                    <b className="pull-right">{clientDeatils && maskNumber(clientDeatils.mobile)}</b>
                  </li>
                  <li className="list-group-item">
                    <b>Start date</b>
                    <b className="pull-right">
                      {clientDeatils && dateFormate(clientDeatils.start_date).split(" ")[0]}
                    </b>
                  </li>
                  <li className="list-group-item">
                    <b>End date</b>
                    <b className="pull-right">
                      {clientDeatils && dateFormate(clientDeatils.end_date).split(" ")[0]}
                    </b>
                  </li>
                  {clientDeatils.duration == 0 ? "" :
                    <li className="list-group-item">
                      <b>Services Given</b>
                      <b className="pull-right">
                        {clientDeatils && clientDeatils.duration}
                      </b>
                    </li>}
                </ul>
                <table className="p-5" style={{ width: "100%" }}>
                  <tr>
                    <th>Services</th>
                    <th>Segment</th>
                    <th>Strategy</th>
                  </tr>
                  {services &&
                    services.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ser_name}</td>
                        <td>{item.cat_name}</td>
                        <td>{item.strategy}</td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>

            <div className="col-md-6">
              <div className="nav-tabs-custom">
                <div className="tab-wrapper">
                  <Tabs
                    defaultActiveKey="Details"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="Details" title="Details">
                      {brokerStatus == 'on' && brokerId == '4' ? <b className="d-flex mx-2 text-success">Login With :-<h6 className="mx-2">{clientCode}</h6></b> : ''}

                      <div className="profile_description">
                        <h4 className="profile_username">Name</h4>
                        {getBrokerTypeFields()}
                        <label
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >
                          Client Key
                        </label>
                        <input
                          type="text"
                          value={reandomClientKey}
                          className="form-control"
                          placeholder=""
                          readOnly
                        />
                        <p>{randomClientKeyErr}</p>
                        <br />
                        {/* <button
                          className="submit"
                          onClick={() => {
                            generateClientKey();
                            setRandomClientKeyErr("");
                          }}
                        >
                          Generate Client Key
                        </button> */}

                        <label
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",

                          }}
                        >
                          Web Url
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="web_url"
                          value="1"
                          checked={clientDeatils.web_url == 1 || clientDeatils.web_url == "1"}

                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >

                          &nbsp;Admin{" "}
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="web_url"
                          value="2"
                          checked={clientDeatils.web_url == 2 || clientDeatils.web_url == "2"}
                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >

                          &nbsp; Individual
                        </label>
                        <br />
                        {/* -------------------------------------------------------------------------------------------- */}

                        <label
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",

                          }}
                        >
                          Qty Type
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="qty_type"
                          value="0"
                          checked={clientDeatils.qty_type == 0 || clientDeatils.qty_type == "0"}

                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >

                          &nbsp;Admin
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="qty_type"
                          value="1"
                          checked={clientDeatils.qty_type == 1 || clientDeatils.qty_type == "1"}
                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >
                          &nbsp; Individual
                        </label>
                        <br />
                     

                        <label
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",

                          }}
                        >
                          Signals Execution Type
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="sig_exe_type"
                          value="1"
                          checked={clientDeatils.signal_execution == 1 || clientDeatils.signal_execution == "1"}

                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >

                          &nbsp;Web
                        </label>
                        &nbsp; &nbsp;

                        <input
                          type="radio"
                          name="sig_exe_type"
                          value="2"
                          checked={clientDeatils.signal_execution === 2 || clientDeatils.signal_execution === "2"}
                          onChange={(e) => {
                            inputChange(e);
                          }}
                        />
                        <label
                          className="radio-inline 5paisa"
                          // id="5paisa"
                          style={{
                            color: "#000",
                            fontSize: "17px",
                            fontWeight: "500",
                            marginBottom: "10px",
                          }}
                        >

                          &nbsp; App
                        </label>
                        <br />
                        {/* <hr style={{ color: "#ddd" }} />
                        <p>{webUrlErr}</p> */}
                        {/* -----------------------------------ganpat-------------------------------------------------------- */}


                        <hr style={{ color: "#ddd" }} />
                        <p>{webUrlErr}</p>
                        <div className="btn_style">
                          {/* <div className=" btn btn-color"> */}
                          {(fromadmin == null) &&
                            <button className="submit  btn btn-color" onClick={SubmitDetaials}>
                              Submit
                            </button>}
                          {/* <button className="Reset">Reset</button> */}
                        </div>
                      </div>
                    </Tab>

                    {(fromadmin == null) &&
                      <Tab eventKey="ChangePassword" title="Change Password">
                        <form>
                          <div className="password spacing1">
                            <label
                              style={{
                                color: "#000",
                                fontSize: "17px",
                                fontWeight: "500",
                                marginBottom: "10px",
                              }}
                            >
                              Old Password
                            </label>
                            <div>
                              <input
                                type={changeTypeold}
                                className="form-control"
                                onChange={(e) => {
                                  inputChange(e);
                                }}
                                name="old_password"
                                placeholder="Old Password"
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
                                  top: "281px",
                                  color: 'black'
                                }}
                              ></i>
                            </div>
                            <br />
                            <p>

                              {oldPasswordErrMsg} <br />
                            </p>

                            <label
                              style={{
                                color: "#000",
                                fontSize: "17px",
                                fontWeight: "500",
                                marginBottom: "10px",
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
                                  top: "403px",
                                  color: 'black'

                                }}
                              ></i>
                            </div>
                            <br />
                            <p>

                              {newPasswordErr} <br />
                            </p>
                            <label
                              style={{
                                color: "#000",
                                fontSize: "17px",
                                fontWeight: "500",
                                marginBottom: "10px",
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
                                  top: "524px",
                                  color: 'black'
                                }}
                              ></i>
                            </div>
                            <br />
                            <p>

                              {conformedPasswordErr}{" "}
                              <br />{" "}
                            </p>
                          </div>

                          <div className="btn_style">
                            <button
                              type="button"
                              onClick={Changepassword}
                              className="btn btn-color ms-4"
                            >
                              Submit
                            </button>
                            {/* <button className="Reset">Reset</button> */}
                          </div>
                        </form>
                      </Tab>}
                  </Tabs>
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
      </div>
    </>
  );
}
