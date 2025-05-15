import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from "react-tag-input";
import DatePicker from 'react-datepicker';
import { useForm } from "react-hook-form";
import * as Constant from '../common/ConstantMessage';
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AlertToast from '../common/AlertToast';
import * as Config from '../common/Config';
import { NavLink, useNavigate } from "react-router-dom";
import { dateFormate } from "../common/CommonDateFormate";



const Addclient = () => {

  const [group, setGroup] = useState([]);
  const [subadmin, setSubadmin] = useState([]);
  const [strategy, setStrategy] = useState([]);
  // console.log("strategy", strategy);
  const [userdata, setUserdata] = useState({ licence_type: "1" });
  // console.log("userdata", userdata);
  const [brokerid, setBrokerId] = useState(100)
  const [cgroup, setcGroup] = useState([]);
  const [cstrategy, setcStrategy] = useState([]);
  const [addmonth, setAddmonth] = useState(1);
  // console.log("addmonth",typeof addmonth);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [toggleSwitch, setToggleSwitch] = useState(false)
  const [groupServices, setGroupServices] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [usernameOnTop, setUsernameOnTop] = useState("")
  const [showServiceMonthGiven, setShowServiceMonthGiven] = useState("");
  // console.log("showServiceMonthGiven", showServiceMonthGiven);

  const [category, setCategories] = useState([]);

  const [selcategory, setselCategories] = useState([]);
  const [cservices, setCservices] = useState([]);
  // console.log("responseedtaaa", cservices);
  const [selectall, setSelectall] = useState("");
  const [serachServices, setSearchServices] = useState([]);
  const [tags1, setTags] = useState([]);
  const [emptyService, setEmptyService] = useState()
  const [groupname, setgroupname] = useState("");
  const [groupNameErr, setgroupNameErr] = useState("");
  const [catagoryErr, setCatagoryErr] = useState("");

  const [servicePush, setServicePush] = useState("")
  // console.log("servicePush", servicePush);

  const [subadminStrategyApi, setSubadminStrategyApi] = useState([])
  // console.log("subadminStrategyApi", subadminStrategyApi);

  const [startDateError, setStartDateError] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const [liveBrokerErr, setLivebrokerErr] = useState("");
  const [strategyError, setStrategyError] = useState("");
  const [nextMonth, setNextMonth] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  // console.log("gghggg" , nextMonth)

  const roleId = localStorage.getItem('roleId');
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const navigate = useNavigate();

  var myDate = new Date();


  const handleClick = (e) => {
    var id = e.target.value;
    var append_tag = cservices.filter((tag, index) => tag.id == id);
    if (e.target.checked) {
      var pre_tag = {
        id: "" + append_tag[0].id + "",
        text: append_tag[0].service,
        cat_id: selcategory,
      };
      setTags((oldArray) => [...oldArray, pre_tag]);
    } else {
      setSelectall("");
      setTags(tags1.filter((tag, index) => tag.id !== id));
    }
  };


  const handleSelect = (e) => {

    if (e.target.checked) {

      var old_tags = tags1.map((tag) => "" + tag.id + "");
      cservices.map((tag) => {
        if (!old_tags.includes("" + tag.id + "")) {
          setTags((oldArray) => [
            ...oldArray,
            { id: "" + tag.id + "", text: tag.service, cat_id: selcategory },
          ]);
        }
      });
      setSelectall("minus");
    } else {
      var service_array = cservices.map((tag) => "" + tag.id + "");

      var new_tag = tags1.filter((tag, index) => {
        if (!service_array.includes("" + tag.id + "")) {
          return tag;
        }
      });
      setSelectall("");
      setTags(new_tag);
      // console.log("tagggg",new_tag);

    }
  };

  var updatedServices = [];

  const checkitem = (r) => {
    // console.log("r", r);
    var match = tags1.map((res) => {
      if (res.length != 0) {
        if (res.id == r) {

          updatedServices.push(res.id);
          //var serviceUpdat = res.id
          // console.log("dddd", serviceUpdat)

          return res
        } else {
          return "";
        }
      } else {
        return "";
      }
    });


    var filtered = match.filter(function (el) {
      return el != null && el != "";
    });

    if (filtered.length != 0) {
      return "minus";
    } else {
      return "";
    }
  };

  const searchServices = (e) => {
    var searchServ = serachServices.filter((item) => {
      if (item.service.toString().includes(e.target.value.toString().toUpperCase())) {
        return item;
      }
    });
    setCservices(searchServ);
  };


  var month = [];
  for (var i = 1; i <= 1; i++) {
    month.push(i);
  }

  var month1 = [];
  for (var i = 1; i <= 12; i++) {
    month1.push(i);
  }

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const checkbroker = (i) => {
    if (i == userdata.broker) {
      return 'checked';
    } else {
      return '';
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

  // const htmlEmail = "<p>Dear '" + useradata.full_name + "'</p><p>Thank you for choosing " + panel_name + " for Algo Platform. We are pleased to inform that the password of your <br> Algo Platform has been resetted as per details mentioned below:</p><p>Login Details:</p><p>User Name / User ID : <b>'" + useradata.user_name + "'</b><br>Login Password : <b>'" + rand_password + "'</b></p><p>Note : Please Change Your Login Password as per your choice.</p><p>Login Url : <a href='" + domain_url_https + "' target='_blank'>" + domain_url_https + "</a></p>";

  const Data = [
    {
      id: 100,
      HeadingTitle: `No Data`
    },
    {
      id: 1,
      HeadingTitle: `<div><h1>Alice Blue</h1><b>API Process Alice Blue: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login </br>` + `<a href='https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB' target='_blank'>https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB</a>` + ` <br><br><b>Step 2:- </b>Click below Link and Login </br>` + `<a href=${Config.broker_redirect_url}aliceblue/access_token?email=YOUR_PANEL_EMAIL target='_blank'> ${Config.broker_redirect_url}aliceblue/access_token?email=YOUR_PANEL_EMAIL</a>` + ` <br><br><b>Example </b><p>e.g -${Config.broker_redirect_url}aliceblue/access_token?email=ss@gmail.com </p><b></br> Step 3 :- Create Api </b><p>you will get Api Secret Key And App code please Update this detail in your Profile...</p></div>`
    },
    {
      id: 2,
      HeadingTitle: `<div><h1>Zerodha</h1><b>API Process Zerodha: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login </br>` + `<a href='https://kite.trade/' target='_blank'>https://kite.trade/</a>` + ` <br><br><b>Step 2:- </b>Click below Link and Login </br>` + `<a href=${Config.broker_redirect_url}zerodha/access_token?email=YOUR_PANEL_EMAIL target='_blank'> ${Config.broker_redirect_url}zerodha/access_token?email=YOUR_PANEL_EMAIL</a>` + ` <br><br><b>Example </b><p>e.g -${Config.broker_redirect_url}zerodha/access_token?email=ss@gmail.com </p><b></br> Step 3 :- Create Api </b><p>you will get Api Secret Key And App code please Update this detail in your Profile...</p></div>`
    },
    {
      id: 3,
      HeadingTitle: `<div><h1>Zebull</h1><b>API Process Zebull: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 5,
      HeadingTitle: `<div><h1>5 Paisa</h1><b>API Process 5 Paisa: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login ` + `<a href='https://invest.5paisa.com/DeveloperAPI/APIKeys' target='_blank'>https://invest.5paisa.com/DeveloperAPI/APIKeys</a><div>`
    },
    {
      id: 9,
      HeadingTitle: `<div><h1>Market Hub</h1><b>API Process Market Hub: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 4,
      HeadingTitle: `<div><h1>Angel</h1><b>API Process Angel: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login </br>` + `<a href='https://smartapi.angelbroking.com/' target='_blank'>https://smartapi.angelbroking.com/</a>` + ` <br><br><b>Step 2:- </b>Click below Link and Login </br>` + `<a href=${Config.broker_redirect_url}angelbroking/access_token?email=YOUR_PANEL_EMAIL target='_blank'> ${Config.broker_redirect_url}angelbroking/access_token?email=YOUR_PANEL_EMAIL</a>` + ` <br><br><b>Example </b><p>e.g -${Config.broker_redirect_url}angelbroking/access_token?email=ss@gmail.com </p><b></br> Step 3 :- Create Api </b><p>you will get Api Secret Key And App code please Update this detail in your Profile...</p></div>`
    },
    {
      id: 10,
      HeadingTitle: `<div><h1>Master Trust</h1><b>API Process Master Trust: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login </br>` + `<a href='https://develop-masterswift.mastertrust.co.in/' target='_blank'>https://develop-masterswift.mastertrust.co.in/</a>` + ` <br><br><b>Step 2:- </b>Click below Link and Login </br>` + `<a href=${Config.broker_redirect_url}mastertrust/access_token target='_blank'> ${Config.broker_redirect_url}mastertrust/access_token</a>` + ` <br><br><b></br> Step 3 :- Create Api </b><p>you will get Api Secret Key And App code please Update this detail in your Profile...</p></div>`
    },
    {
      id: 6,
      HeadingTitle: `<div><h1>Fyers</h1><b>API Process Fyers: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p> <b>Step 1:- </b> Click below Link and Login </br>` + `<a href='https://myapi.fyers.in/dashboard/' target='_blank'>https://myapi.fyers.in/dashboard/</a>` + ` <br><br><b>Step 2:- </b>Click below Link and Login </br>` + `<a href=${Config.broker_redirect_url}fyers/access_token target='_blank'> ${Config.broker_redirect_url}fyers/access_token</a>` + ` <br><br><b></br> Step 3 :- Create Api </b><p>you will get Api Secret Key And App code please Update this detail in your Profile...</p></div>`
    },
    {
      id: 11,
      HeadingTitle: `<div><h1>B2C</h1><b>API Process B2C: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 7,
      HeadingTitle: `<div><h1>Indira</h1><b>API Process Indira: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 8,
      HeadingTitle: `<div><h1>Trade Smart</h1><b>API Process Trade Smart: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 12,
      HeadingTitle: `<div><h1>Motilal Oswal</h1><b>API Process Motilal Oswal: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 13,
      HeadingTitle: `<div><h1>Anand Rathi</h1><b>API Process Anand Rathi: -</b> <p>Please Update SECRET KEY And APP KEY for all these details please contact with Anand Rathi broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 14,
      HeadingTitle: `<div><h1>Choice</h1><b>API Process Choice: -</b> <p>Please Update VENDOR ID, PASSWORD, VENDOR KEY, ENCRYPTION SECRET KEY And ENCRYPTION IV for all these details please contact with Choice broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 15,
      HeadingTitle: `<div><h1>Mandot</h1><b>API Process Mandot: -</b> <p>Please Update USERNAME And PASSWORD for all these details please contact with Mandot broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 16,
      HeadingTitle: `<div><h1>Kotak</h1><b>API Process Kotak: -</b> <p>Please Update ACCESS TOKEN, PASSWORD, CLIENT CODE And CONSUMER KEY for all these details please contact with Kotak broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 18,
      HeadingTitle: `<div><h1>IIFL</h1><b>API Process IIFL: -</b> <p>Please Update USERNAME And PASSWORD for all these details please contact with IIFL broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 19,
      HeadingTitle: `<div><h1>Arihant</h1><b>API Process Arihant: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 20,
      HeadingTitle: `<div><h1>Master Trsut Dealer</h1><b>API Process Master Trust Dealer: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 21,
      HeadingTitle: `<div><h1>Laxmi</h1><b>API Process Laxmi: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 22,
      HeadingTitle: `<div><h1>Kotak Neo</h1><b>API Process Kotak Neo: -</b> <p>Please Update ACCESS TOKEN, PASSWORD, CLIENT CODE And CONSUMER KEY for all these details please contact with Kotak Neo broker then Submit  And  Login With Api Trading On...</p></div>`
    },
    {
      id: 23,
      HeadingTitle: `<div><h1>Swastika</h1><b>API Process Swastika: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
  ];


  const userFilter = Data.filter(val => {
    if (val.id == brokerid && brokerid) {
      return val
    }
  })

  // console.log("userFilter", userFilter);


  const subadminChange = (e) => {
    setUserdata(prevState => ({ ...prevState, ['subadmin_id']: e.target.value }));
  }

  const onAlertClose = e => {
    setShowAlert(false);
  }

  const inputChange = (e) => {
    if (e.target.name == 'user_name') {
      setUserdata(prevState => ({ ...prevState, ['user_name']: e.target.value.replace(/\s/g, "") }));
    }
    if (e.target.name == 'full_name') {
      setUserdata(prevState => ({ ...prevState, ['full_name']: e.target.value }));
    }
    if (e.target.name == 'email') {
      setUserdata(prevState => ({ ...prevState, ['email']: e.target.value }));
    }
    if (e.target.name == 'mobile') {
      setUserdata(prevState => ({ ...prevState, ['mobile']: e.target.value }));
    }
    if (e.target.name == 'broker') {
      setBrokerId(e.target.value)
      setUserdata(prevState => ({ ...prevState, ['broker']: e.target.value }));
    }
    if (e.target.name == 'api_key') {
      setUserdata(prevState => ({ ...prevState, ['api_key']: e.target.value }));
    }
    if (e.target.name == 'api_secret') {
      setUserdata(prevState => ({ ...prevState, ['api_secret']: e.target.value }));
    }
    if (e.target.name == 'app_id') {
      setUserdata(prevState => ({ ...prevState, ['app_id']: e.target.value }));
    }
    if (e.target.name == 'client_code') {
      setUserdata(prevState => ({ ...prevState, ['client_code']: e.target.value }));
    }
    if (e.target.name == 'api_type') {
      setUserdata(prevState => ({ ...prevState, ['api_type']: e.target.value }));
    }
    if (e.target.name == 'demat_userid') {
      setUserdata(prevState => ({ ...prevState, ['demat_userid']: e.target.value }));
    }
    if (e.target.name == 'licence_type') {
      if (e.target.value == 1) {
        // setNextMonth(e.target.value)

        setUserdata(prevState => ({ ...prevState, ['broker']: '' }));
      }
      setUserdata(prevState => ({ ...prevState, ['licence_type']: e.target.value }));
    }
    if (e.target.name == 'addmonth') {
      setAddmonth(e.target.value);
    }
  }


  const brokerhtml = () => {
    switch (userdata.broker) {
      case '1':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    //  value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '2':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //  value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '3':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>DOB</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    placeholder="example:- 15-08-1947"
                    name="api_secret"
                    className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
          // <>
          //   <div className="row">
          //     <div className="col-md-3">
          //     </div>
          //     <div className="col-md-6">
          //       <div className="form-group">
          //         <label>API KEY</label>
          //         <input type="text" onChange={e => { inputChange(e) }}
          //           //   value={userdata[0].app_id}
          //           name="api_key" className="form-control" />

          //       </div>
          //     </div>
          //     <div className="col-md-3">
          //     </div>
          //   </div>
          //   <div className="row">
          //     <div className="col-md-3">
          //     </div>
          //     <div className="col-md-6">
          //       <div className="form-group">
          //         <label>APP ID</label>
          //         <input type="text" onChange={e => { inputChange(e) }}
          //           //   value={userdata[0].api_key}
          //           name="app_id" className="form-control" />
          //       </div>
          //     </div>
          //     <div className="col-md-3">
          //     </div>
          //   </div>
          // </>
        );
      case '4':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '5':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '6':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].app_id}
                    name="app_id" className="form-control" />

                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '7':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Investor ID</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT ID</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    // value={userdata.app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '10':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    // value={userdata.app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '11':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Client Code</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>2FA</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '9':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>USER</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    PASSWORD CODE</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>

            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    VERIFICATION CODE</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>

            </div>
          </>
        );
      case '12':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT CODE</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
            </div>
          </>
        );
      case '13':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '14':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Id</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input type="text" onChange={e => { inputChange(e) }}

                    name="demat_userid" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption Secret Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption IV</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_type}
                    name="api_type" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '15':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    //  value={userdata[0].app_id}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '16':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Secret</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" onChange={e => { inputChange(e) }}

                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Demat Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Trade Api Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_type}
                    name="api_type" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '18':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    //   value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    //  value={userdata[0].app_id}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '19':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User ID</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>2FA</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '20':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User ID</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>App Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_key}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Account ID</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Code</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_type}
                    name="api_type" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
      case '21':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    name="api_key" className="form-control" />
                </div>
              </div>
            </div>
          </>
        );
      case '22':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Key</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Secret</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_secret}
                    name="api_secret" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" onChange={e => { inputChange(e) }}

                    name="client_code" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            {/* <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Demat Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].app_id}
                    name="app_id" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div> */}
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Trade Api Password</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    // value={userdata[0].api_type}
                    name="api_type" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </>
        );
        case '23':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>ACCESS KEY</label>
                  <input type="text" onChange={e => { inputChange(e) }}
                    name="api_key" className="form-control" />
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text"
                    onChange={e => { inputChange(e) }}
                    name="api_secret" className="form-control" />
                </div>
              </div>
            </div>
          </>
        );
    }
  }

  const apiCalls = () => {
    const data = {}
    const header = {
      'x-access-token': admin_token
    }
    axios.get(`${Config.base_url}admin/strategy`, { headers: header, data }).then(res => {
      // console.log("responsestrat", res.data.strategy);
      // const removeFirstIndex = (res.data.strategy.shift())
      setStrategy(res.data.strategy);
      // console.log('hello',removeFirstIndex, res.data.strategy)
    });

    axios.get(`${Config.base_url}admin/sub-admins`, { headers: header, data }).then(res => {
      setSubadmin(res.data.subadmins);
    });

    axios.get(`${Config.base_url}admin/group-services`, { headers: header, data }).then(res => {
      setGroup(res.data.services);
    });
  }

  const [showAddModal, setShowAddModal] = useState(false);
  const [serUpdateModal, setSerUpdateModal] = useState([])

  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowAddModal = () => {
    var now = new Date();
    var current = new Date(now.getFullYear(), now.getMonth() + parseInt(addmonth), now.getDate());
    // console.log("next month" ,   current.toString().split(" ")[1]);

    setNextMonth(current.toString())

    if (userdata.licence_type === "1") {
      if (startDate === undefined) {
        setStartDateError(Constant.SELECT_DATE_ERROR);
        return
      }
      if (endDate === undefined) {
        setEndDateErr(Constant.SELECT_DATE_ERROR);
        return
      }

    }
    else {
      if (userdata.broker === undefined) {
        setLivebrokerErr(Constant.SELECT_BROKER_ERROR);
        return
      }
    }

    if (toggleSwitch === false) {
      setStrategyError(Constant.STRATEGY_ERROR_MESSAGE);
      return
    }

    if (userdata.broker == "") {
      userdata.broker = "0"
    }


    // if (userdata.broker === "22" && !userdata.mobile.includes("+91")) {
    //   alert("Please write country code +91 in the mobile number");
    //   return
    // }

    if (groupServices) {
      var groupServicesId = []
      // groupServicesId.push(updatedServices)
      var groupServicesId = groupServices.map((services) => {
        groupServicesId = services.id
        return groupServicesId
      })

      var servicesUpdated = updatedServices.map(str => {
        return Number(str);
      });

      var updateGroupAndServices = groupServicesId.concat(servicesUpdated)
      setSerUpdateModal(updateGroupAndServices)
      // console.log("updateGroupAndServices");
    }
    setShowAddModal(true)
  };


  const AddClientSubmit = () => {

    // console.log("updatedServices - ", updatedServices);
    // // console.log("groupServicesId",updateGroupAndServices);

    // if(groupServicesId==undefined){
    //   console.log('if');

    // }else{
    //   console.log('else');
    //   console.log('ff',updateGroupAndServices);
    // }
    // 'groupServiceid': updateGroupAndServices === undefined ? updatedServices : updateGroupAndServices,

    // setShowAddModal(true)
    // return

    if (userdata.licence_type === "2" && userdata.broker === undefined) {
      setShowAlert(true)
      setAlertColor('error');
      setTextAlert("Please Select Broker");
      setLivebrokerErr(Constant.SELECT_BROKER_ERROR);
      return
    }
    // console.log("userdata", userdata);
    axios({
      method: "post",
      url: `${Config.base_url}admin/client/add`,
      data: {
        'adminId': adminId,
        'data': userdata,
        'start_date': startDate,
        'end_date': endDate,
        'group': cgroup,
        'strategy': cstrategy,
        'addmonth': userdata.licence_type == '1' ? 0 : addmonth,
        'admin_id': localStorage.getItem('adminId'),
        'role_id': localStorage.getItem('roleId'),
        'createdBy': localStorage.getItem('createdBy'),
        'groupServiceid': serUpdateModal,
        'brokerHtml': JSON.stringify(userFilter[0].HeadingTitle),
        'showServiceMonthGiven': showServiceMonthGiven == null ? 0 : showServiceMonthGiven
        // 'service': tags1,
        // 'name': groupname
      },
      headers: {
        'x-access-token': admin_token
      }

    })
      .then(function (response) {

        // console.log("resmail", response);
        if (response) {
          if (response.data.status === 'username_error') {
            setShowAlert(true)
            setAlertColor('error');
            setTextAlert(response.data.msg);
          }
          else if (response.data.status === 'email_error') {
            setShowAlert(true)
            setAlertColor('error');
            setTextAlert(response.data.msg);
          }
          else if (response.data.status === 'remain_licence_error') {
            setShowAlert(true)
            setAlertColor('error');
            setTextAlert(response.data.msg);
          }
          else if (response.data.status === 'api_key_error') {
            setShowAlert(true)
            setAlertColor('error');
            setTextAlert(response.data.msg);
          }
          else {
            setShowAlert(true)
            setAlertColor('success');
            setTextAlert(Constant.ADD_CLIENT_SUCCESS);
            // setTimeout(() => navigate("/admin/clients"),1000);

            if (roleId == "4") {
              return navigate("/subadmin/clientlist")
            }
            else {
              navigate("/admin/clients")
            }
          }
        }
        // if (groupname === "") {
        //   setgroupNameErr(Constant.EMPTY_GROUP_ERROR_MSG);
        //   return;
        // }

        // if (tags1.length === 0 || tags1 === "") {
        //   setCatagoryErr(Constant.EMPTY_GROUP_CATAGORY_ERROR_MSG);
        //   return
        // }
      })
  }


  const selectcategory = () => {
    axios.get(`${Config.base_url}smartalgo/category`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      // console.log("category", res.data.category);
      setCategories(res.data.category);
    });
  }

  useEffect(() => {
    apiCalls()
    selectcategory()
    getSubAdminStrategy()
    // mailProcess()
  }, [])


  const setLastUserName = () => {

    var data = [];
    axios.get(`${Config.base_url}admin/client`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      // console.log("dataadcl", res.data.client[res.data.client.length-1]);
      // console.log("dataadcl", res.data.client[0].username);
      if (res.data.client[0].username) {
        setUsernameOnTop(res.data.client[0].username)
      }
    });

  }

  useEffect(() => {
    setLastUserName()
  }, [])

  const groupChange = (e) => {
    setcGroup(e.target.value)
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
          setGroupServices(response.data.service)
        })
    } else {
      setGroupServices("")
    }
  }
  // console.log("abcdefg" , cgroup)

  // cservices.map((ser, i) => (
  //     console.log("serviceid", ser.id)
  //   ))

  // const serviceFilter = cservices.filter(val => {
  //  console.log("service", val);
  // })

  const getMonthExpired = (sm) => {
    var dateToday = new Date()
    dateToday.setMonth(dateToday.getMonth() + sm)
    // console.log("check", dateToday);
    return dateToday.toString().split(" ")[1] + " " + dateToday.toString().split(" ")[2] + " " + dateToday.toString().split(" ")[3]
  }


  const getSubAdminStrategy = () => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/subadmin/strategy`,
      data: {
        SubadminId: adminId,
        // SubadminId : SubadminId
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (res) {
      // console.log("res", res);
      setSubadminStrategyApi(res.data.Strategy)
    });
  }



  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-10">
            <div className="card">
              <div className="card-header">

                <Modal show={showAddModal} onHide={handleCloseAddModal} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Client Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Your Client Username Is <b>{userdata.user_name}</b>
                    <br />
                    Your Client Email Is  <b>{userdata.email}</b>
                    <br />
                    Your Client Mobile Number is - <b>{userdata.mobile}</b>
                    <br />

                    {userdata.licence_type == '1' ?
                      <>
                        <br />
                        <b>This Is a Demo Account</b> <br /> <br />
                        <b>Start Date - {dateFormate(startDate).split(" ")[0]}</b>
                        <br />
                        <b>End Date - {dateFormate(endDate).split(" ")[0]}</b>
                      </>
                      :
                      <>
                        <br />
                        <b>This Is a Live Account</b> <br />
                        {
                          addmonth == "2-Days" ?
                            <>
                              <h4>You Have Given {addmonth} Live Licence</h4>
                            </>
                            :
                            <h4>You Have Given {addmonth + " " + "Month"} Live Licence Which will end on {nextMonth.split(" ")[1]} {nextMonth.split(" ")[2]} {nextMonth.split(" ")[3]}</h4>
                        }
                      </>
                    }

                  </Modal.Body>
                  <Modal.Footer>
                    <button className='btn btn-info' onClick={handleCloseAddModal}>
                      Edit
                    </button>
                    <button className='btn btn-success' onClick={handleSubmit((e) => AddClientSubmit(e))}>
                      Add
                    </button>
                  </Modal.Footer>
                </Modal>

                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>Add Client</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right">
                      <NavLink
                        // to="/admin/Clients"
                        to={roleId == "4" ? "/subadmin/clientlist" : "/admin/Clients"}
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
                {/* { userdata.length==0?'': */}
                <form id='form'>
                  <label style={{ color: "black" }}><b>{"Last Username  :-  " + usernameOnTop}</b></label>

                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>User Name</label>
                        <input type="text"

                          // value={userdata[0].full_name}
                          {...register("user_name", { onChange: (e) => { inputChange(e) }, required: true })}
                          name="user_name" placeholder="User Name" pattern="[a-zA-Z\s]+" className="form-control" />
                        {errors.user_name && <span style={{ color: "red" }}>* {Constant.CLIENT_USER_NAME}</span>}
                      </div>
                    </div>
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text"

                          {...register("full_name", { onChange: (e) => { inputChange(e) }, required: true })}
                          // value={userdata[0].full_name}
                          name="full_name" placeholder="Full Name" className="form-control" />
                        {errors.full_name && <span style={{ color: "red" }}>* {Constant.CLIENT_FULL_NAME}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="number"

                          {...register("mobile", {
                            onChange: (e) => { inputChange(e) }, required: true,
                            required: {
                              value: true,
                              message: "Phone number is required",
                            },

                            minLength: {
                              value: 10,
                              message: "Phone number should be minimum length of 10",
                            },

                            maxLength: {
                              value: 13,
                              message: "Phone number should be maximum length of 10",
                            },

                          })}
                          className="form-control" name="mobile" placeholder="Mobile" maxlength="13"
                        //  value={userdata[0].mobile}
                        />

                        {errors.mobile && <span style={{ color: "red" }}>* {errors.mobile.message}</span>}

                        {/* {errors.mobile && <span style={{color:"red"}}>* { Constant.CLIENT_MOBILE}</span>} */}
                      </div>
                    </div>
                    <div className="col-md-6 pl-1">
                      <div className="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email"
                          {...register("email", {
                            onChange: (e) => { inputChange(e) }, required: true, pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Invalid email address",
                            }
                          })}
                          // value={userdata[0].email}
                          name="email" className="form-control" placeholder="Email" />
                        {errors.email && <span style={{ color: "red" }}>* {Constant.CLIENT_EMAIL}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>License</label>

                        <select
                          // value={userdata[0].licence_type}
                          onChange={e => { inputChange(e) }}

                          name="licence_type"
                          className="form-control">
                          <option value="1">Demo</option>
                          <option value="2">Live</option>
                        </select>

                        {/* <select
                          // value={userdata[0].licence_type}
                          onChange={e => { inputChange(e) }}

                          name="licence_type" className="form-control" required>

                          {`${Config.panel_name}` == 'adonomist' // || `${Config.panel_name}` == 'smartalgo'

                            ? roleId != 4 ?
                              <>
                                <option value="1">Demo</option>
                                <option value="2" >Live</option>
                              </>
                              :
                              <option value="1">Demo</option>
                            :
                            <>
                              <option value="1">Demo</option>
                              <option value="2" >Live</option>
                            </>

                          }
                        </select> */}

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>To Month</label>
                        {userdata.licence_type === "1" ? (<div>
                          <div className="row">
                            <div className="col-md-6">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date)
                                  setStartDateError("")
                                }}
                                selectsStart
                                startDate={startDate}
                                className="form-control"
                                filterDate={isWeekday}
                                endDate={endDate}
                                minDate={new Date()}
                                name="fromdate"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="From Date"
                              />
                              {startDateError && <span style={{ color: "red" }}>* {startDateError}</span>}

                            </div>
                            <div className="col-md-6">
                              <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                  setEndDate(date)
                                  setEndDateErr("")
                                }}
                                selectsEnd
                                startDate={startDate}
                                className="form-control"
                                filterDate={isWeekday}
                                minDate={startDate}
                                endDate={endDate}
                                name="toDate"
                                // excludeDates={[startDate, subDays(startDate, 1)]}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="To Date"
                              />
                              {endDateErr && <span style={{ color: "red" }}>* {endDateErr}</span>}
                            </div>
                          </div>
                        </div>) :
                          (
                            <select className="form-control" value={addmonth} name="addmonth" onChange={e => { inputChange(e) }}>
                              <option>2-Days</option>
                              {month.map((sm, i) =>

                                <option value={sm} >{sm + " " + "Month Licence" + " " + "Expired on - " + getMonthExpired(sm)}</option>
                                /* <option>{sm + " " + "Expired on -" + getMonthExpired(sm)}</option> */
                              )
                              }
                            </select>
                          )
                        }
                        {/* {addmonth == 1 ? "" : addmonth} */}
                      </div>
                    </div>
                  </div>

                  {
                    userdata.licence_type === "1" ? '' :
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">

                            <input type="radio" onChange={e => { inputChange(e) }} checked={checkbroker(1)} className="form-check-input" id="aliceblue" name="broker" value="1"
                            />
                            <label className="form-check-label" for="aliceblue">Alice blue</label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(2)}
                              className="form-check-input" id="zerodha" name="broker" value="2"
                            />
                            <label className="form-check-label" for="zerodha">Zerodha</label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(3)}
                              className="form-check-input" id="z cebull" name="broker" value="3"
                            />
                            <label className="form-check-label" for="zebull">Zebull</label>
                          </div>
                        </div>

                        {/*

            <div className="col-md-2">
           <div className="form-check">
  <input type="radio"
  onChange={e=>{inputChange(e)
  setLivebrokerErr("")
  }}
checked={checkbroker(4)}
 className="form-check-input" id="angel" name="broker" value="4"
  />
  <label className="form-check-label" for="angel">Angel</label>
</div>
</div> */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")

                              }}
                              checked={checkbroker(5)}
                              className="form-check-input" id="5paisa" name="broker" value="5"
                            />
                            <label className="form-check-label" for="5paisa">5 paisa</label>
                          </div>
                        </div>


                        {/* <div className="col-md-2">
           <div className="form-check">
  <input type="radio"
  onChange={e=>{inputChange(e)
  setLivebrokerErr("")
  }}
checked={checkbroker(6)}
className="form-check-input" id="fyers" name="broker" value="6"
  />
  <label className="form-check-label" for="fyers">Fyers</label>
</div>
</div>
<div className="col-md-2">
           <div className="form-check">

  <input type="radio"
  onChange={e=>{inputChange(e)
  setLivebrokerErr("")
  }}
checked={checkbroker(7)}
className="form-check-input" id="indira" name="broker" value="7"
  />
  <label className="form-check-label" for="indira">Indira</label>
</div>

</div>
 */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(6)}
                              className="form-check-input" id="fyers" name="broker" value="6"
                            />
                            <label className="form-check-label" for="fyers">Fyers</label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(4)}
                              className="form-check-input" id="angel" name="broker" value="4"
                            />
                            <label className="form-check-label" for="angel">Angel</label>
                          </div>
                        </div>


                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(10)}
                              className="form-check-input" id="masterttrust" name="broker" value="10"
                            />
                            <label className="form-check-label" for="masterttrust">Master Trust</label>
                          </div>
                        </div>


                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(11)}
                              className="form-check-input" id="b2c" name="broker" value="11"
                            />
                            <label className="form-check-label" for="b2c">B2C</label>
                          </div>
                        </div>


                        {/*Master Hub */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(9)}
                              className="form-check-input" id="markethub" name="broker" value="9"
                            />
                            <label className="form-check-label" for="markethub">Market Hub</label>
                          </div>
                        </div>


                        {/* Anand Rathi */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(13)}
                              className="form-check-input" id="anandrathi" name="broker" value="13"
                            />
                            <label className="form-check-label" for="anandrathi">Anand Rathi</label>
                          </div>
                        </div>


                        {/* Choice */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(14)}
                              className="form-check-input" id="choice" name="broker" value="14"
                            />
                            <label className="form-check-label" for="choice">Choice</label>
                          </div>
                        </div>

                        {/* Mandot */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(15)}
                              className="form-check-input" id="mandot" name="broker" value="15"
                            />
                            <label className="form-check-label" for="mandot">Mandot</label>
                          </div>
                        </div>

                        {/* Motilal Oswal */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(12)}
                              className="form-check-input" id="motilaloswal" name="broker" value="12"
                            />
                            <label className="form-check-label" for="motilaloswal">Motilal Oswal</label>
                          </div>
                        </div>

                        {/* Kotak */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(16)}
                              className="form-check-input" id="kotak" name="broker" value="16"
                            />
                            <label className="form-check-label" for="kotak">Kotak</label>
                          </div>
                        </div>


                        {/* IIFL */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(18)}
                              className="form-check-input" id="iifl" name="broker" value="18"
                            />
                            <label className="form-check-label" for="iifl">IIFL</label>
                          </div>
                        </div>

                        {/* Arihant */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(19)}
                              className="form-check-input" id="arihant" name="broker" value="19"
                            />
                            <label className="form-check-label" for="arihant">Arihant</label>
                          </div>
                        </div>

                        {/* Master Trust Dealer */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(20)}
                              className="form-check-input" id="mastertrust_dealer" name="broker" value="20"
                            />
                            <label className="form-check-label" for="mastertrust_dealer">MasterTrust Dealer</label>
                          </div>
                        </div>

                        {/* Laxmi */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(21)}
                              className="form-check-input" id="laxmi" name="broker" value="21"
                            />
                            <label className="form-check-label" for="laxmi">Laxmi</label>
                          </div>
                        </div>

                        {/* Kotak Neo */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(22)}
                              className="form-check-input" id="kotak_neo" name="broker" value="22"
                            />
                            <label className="form-check-label" for="kotak_neo">Kotak Neo</label>
                          </div>
                        </div>

                        {/* Swastika */}

                        {/* <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(23)}
                              className="form-check-input" id="swastika" name="broker" value="23"
                            />
                            <label className="form-check-label" for="kotak_neo">Swastika</label>
                          </div>
                        </div> */}

                        {liveBrokerErr && <span style={{ color: "red" }}>* {liveBrokerErr}</span>}
                      </div>
                  }

                  {userdata.licence_type === "1" ? '' :
                    brokerhtml()}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">

                        {/* <div>
                          <input type="radio" id="html" value="Group" />
                          <label>Group</label>
                          <input type="radio" id="css" value="Stock" />
                          <label>Stock</label>
                        </div> */}

                        {/* <div className="row d-flex">
                          <div className='col-md-6'> */}

                        <div className='col-md-12'>
                          <div class="form-group">
                            <label>Group </label>
                            <select
                              //   value={cgroup}
                              // onChange={(e) => groupChange(e)}
                              name="group"
                              class="form-control"
                              {...register("group", { onChange: (e) => { groupChange(e) }, required: true })}
                            >
                              <option value="">Please Select group</option>
                              {group.map((sm, i) =>
                                <option
                                  value={sm.id}>
                                  {sm.group_name}
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
                        {/* <div class='form-group'>
                              <label>Select Services</label>
                              <select
                                value={selcategory}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                className="form-control"
                              >
                                <option value=''
                                >Select Category</option>
                                {category.map((cat, i) => (
                                  <option key={i} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div> */}

                        {selcategory.length !== 0 && (
                          <div className="col-md-4">
                            <div className="form-group">
                              {/* <label>Search</label> */}
                              <input
                                type="text"
                                // value={groupname}
                                onChange={(e) => {
                                  searchServices(e);
                                }}
                                className="form-control"
                                placeholder="Search.."
                              />
                            </div>
                          </div>
                        )}
                        <div className="col-md-10 pr-1">
                          <div className={cservices.length == 0 ? "" : "fix-height"}>
                            <div className="row">
                              {cservices.length == 0 ? (
                                ""
                              ) : (
                                <div className="col-md-4 pr-1">
                                  <div className="form-check">
                                    <input
                                      checked={selectall}
                                      onClick={handleSelect}
                                      className="form-check-input"
                                      type="checkbox"
                                    />
                                    <label className="form-check-label">
                                      Select all
                                    </label>
                                  </div>
                                </div>
                              )}
                              {cservices.length == 0
                                ? ""
                                : cservices.map((ser, i) => (
                                  <div className="col-md-6 pr-1 " key={i}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        checked={checkitem(ser.id)}
                                        value={ser.id}
                                        onClick={handleClick}
                                        id={ser.id}
                                        type="checkbox"
                                      />
                                      <label
                                        className="form-check-label"
                                        for={ser.id}
                                      >
                                        {ser.service}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/* </div>
                          </div> */}

                          {/* <div className='col-md-6'>
                            <div class="form-group">
                              <label>Select Group Services</label>
                              <select
                                //   value={cgroup}
                                onChange={(e) => groupChange(e)}
                                name="group"
                                class="form-control"
                              // {...register("group", { onChange: (e) => { groupChange(e) }, required: true })}
                              >
                                <option value="">Please Select group</option>
                                {group.map((sm, i) =>
                                  <option
                                    value={sm.id}>
                                    {sm.group_name}
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
                                    width: "30%"
                                  }}>{service.text}</div>
                              )}
                            </div>
                          </div> */}
                        </div>
                        {errors.group && <span style={{ color: "red" }}>* {Constant.CLIENT_GROUP}</span>}
                      </div>
                    </div>
                  </div>


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

                        {toggleSwitch === true ? "" : <p style={{ color: "red" }}>{strategyError}</p>}

                        <div className="col-md-12">
                          <div className="row">
                            {roleId === "4" ?
                              <>
                                {toggleSwitch === true && subadminStrategyApi.map((sm, i) =>
                                (<div className="col-md-4">
                                  <div class="form-check">
                                    <input class="form-check-input"
                                      // onChange={(e) => {strategyClick(e)}}
                                      // checked={checkstrategy(sm.name)}
                                      type="checkbox"
                                      value={sm.strategy}
                                      name="strategy"
                                      {...register("strategy", { onChange: (e) => { strategyClick(e) }, required: true })}
                                    />
                                    <label class="form-check-label">
                                      {sm.strategy}
                                    </label>
                                  </div>
                                </div>
                                ))}
                              </>
                              :
                              <>
                                {toggleSwitch === true && strategy.map((sm, i) =>
                                (<div className="col-md-4">
                                  <div class="form-check">
                                    <input class="form-check-input"
                                      // onChange={(e) => {strategyClick(e)}}
                                      // checked={checkstrategy(sm.name)}
                                      type="checkbox"
                                      value={sm.name}
                                      name="strategy"
                                      {...register("strategy", { onChange: (e) => { strategyClick(e) }, required: true })}
                                    />
                                    <label class="form-check-label">
                                      {sm.name}
                                    </label>
                                  </div>
                                </div>
                                ))}
                              </>
                            }
                            {errors.strategy && <span style={{ color: "red" }}>* {Constant.CLIENT_STRATEGY}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex">

                    {/* // <div className="row"> */}
                    <div className="col-md-6 me-1">
                      <div className="form-group">
                        <label>Service Month Given</label>
                        <select
                          name="services_month_given"
                          class="form-control"
                          onChange={(e) => { setShowServiceMonthGiven(e.target.value) }}
                        >
                          <option value="">Service Month Given</option>

                          {month1.map((sm, i) =>
                            <option value={sm} >{sm}</option>
                          )
                          }
                        </select>
                      </div>
                    </div>
                    {/* </div> */}

                    {roleId === "4" ? "" :
                      <>
                        <div className="col-md-6 mx-1">
                          <div className="form-group">
                            <label>Sub-Admin</label>
                            <select
                              name="sub2"

                              // value={csubadmin}
                              onChange={(e) => { subadminChange(e) }}
                              class="form-control"
                              {...register("sub2", { onChange: (e) => { subadminChange(e) } })}
                            >
                              <option value="">Please Select Sub-Admin</option>

                              {subadmin.map((sm, i) =>
                                <option value={sm.userId}>{sm.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    }
                  </div>
                  {/* SERVICE AMOUNT & AMOUNT RECEIVED */}

                  {/* <div className="d-flex">
                    <div className="col-md-6 me-1">
                      <div className="form-group">
                        <label>Service Amount</label><br/>
                        <input type='number' className="form-control"/>
                      </div>
                    </div>

                    <div className="col-md-6 mx-1">
                      <div className="form-group">
                        <label>Amount Received</label><br/>
                        <input type='number' className="form-control"/>
                      </div>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button type="button"
                        // onClick={handleSubmit((e) => AddClientSubmit(e))}
                        onClick={handleSubmit((e) => handleShowAddModal(e))}
                        className="btn btn-color">Next</button>
                    </div>
                  </div>

                  <div>
                    {/* {getMonthExpired(addmonth)} */}
                  </div>
                </form>
                {/* } */}

              </div>
            </div>
          </div>
          {/* <div className="col-md-2">
            <div className="card">
              <div className="card-header">
                <h6 className="title">Selected Services</h6>
              </div>
              <div className="card-body">{category.length == 0 ? "" : category.map((cat, i) => {
                var tag2 = tags1.filter((tag, index) => tag.cat_id == cat.id);

                return tag2.length == 0 ? ("") : (
                  <>
                    <br></br>
                    <h6 key={i} >{cat.name}</h6>
                    <ReactTags
                      tags={tag2}
                      handleDelete={(e) => {
                        handleDelete(e, tag2);
                      }}
                      autocomplete
                    />
                  </>
                );
              })}
              </div>
            </div>
          </div> */}
          {showAlert &&
            <AlertToast
              hideAlert={onAlertClose}
              showAlert={showAlert}
              message={textAlert}
              alertColor={alertColor}
            />
          }
        </div>
      </div>

      {/* <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="title">Selected Services</h5>
          </div>
          <div className="card-body">
            {category.length == 0
              ? ""
              : category.map((cat, i) => {
                var tag2 = tags1.filter(
                  (tag, index) => tag.cat_id == cat.id
                );

                return tag2.length == 0 ? (
                  ""
                ) : (
                  <>
                    <br></br>
                    <h6 key={i} >{cat.name}</h6>
                    <ReactTags
                      tags={tag2}
                      handleDelete={(e) => {
                        handleDelete(e, tag2);
                      }}
                      autocomplete
                    />
                  </>
                );
              })}
          </div>
        </div>
      </div> */}

    </>
  );
}

export default Addclient;