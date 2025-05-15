import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { WithContext as ReactTags } from "react-tag-input";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import Modal from 'react-bootstrap/Modal';
import * as Config from "../common/Config";
import { NavLink, useNavigate } from "react-router-dom";
import { dateFormate } from "../common/CommonDateFormate";
import { maskEmail, maskNumber } from "../common/HideWithStar";

function Editclient() {

  const navigate = useNavigate();
  const g_id = useParams();
  const [userdata, setUserdata] = useState("");
  const [strategy, setStrategy] = useState([]);
  const [cstrategy, setcStrategy] = useState([]);
  const [group, setGroup] = useState([]);
  const [cgroup, setcGroup] = useState([]);
  const [addmonth, setAddmonth] = useState(0);
  const [licencetype, setLicenceType] = useState('');
  const [forPermission, setForPermission] = useState([])
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const [subadmin, setSubadmin] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [groupServices, setGroupServices] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [strategyError, setStrategyError] = useState("");
  const [liveBrokerErr, setLivebrokerErr] = useState("");
  const [GroupErr, setGroupErr] = useState("");
  const [strategyClickError, setStrategyClickError] = useState("");
  const [userdataLicenceType, setUserdataLicenceType] = useState("");
  const [editBrokerId, setEditBrokerId] = useState(100)
  const [oneTimeEditEmail, setOneTimeEditEmail] = useState("")
  const [notChangeBroker, setNotChangeBroker] = useState("")
  const [nextMonth, setNextMonth] = useState("");
  const [ButtonDisabled, setButtonDisabled] = useState(false);
  const [showServiceMonthGiven, setShowServiceMonthGiven] = useState("");
  const [category, setCategories] = useState([]);
  const [selcategory, setselCategories] = useState([]);
  const [cservices, setCservices] = useState([]);
  const [selectall, setSelectall] = useState("");
  const [serachServices, setSearchServices] = useState([]);
  const [serviceData, setServiceData] = useState("")
  const [twoDaysService, setTwoDaysService] = useState("")
  const [subadminStrategyApi, setSubadminStrategyApi] = useState([])

  const handleClickDisabled = () => {
    setButtonDisabled(true);
  }


  //Not to Delete---------------------------------------
  // const [emptyService, setEmptyService] = useState()
  // const [groupname, setgroupname] = useState("");
  // const [groupNameErr, setgroupNameErr] = useState("");
  // const [catagoryErr, setCatagoryErr] = useState("");
  //-----------------------------------------------------------

  var roleId = localStorage.getItem('roleId');
  const admin_token = localStorage.getItem("token");
  const client_id = localStorage.getItem("client_id");
  const adminId = localStorage.getItem("adminId");
  const fromadmin = localStorage.getItem('from_admin');
  const fromsubadmin = localStorage.getItem('from_subadmin');
  const role_id = localStorage.getItem('roleId');

  //------------------------------------------------
  const handleChange = (e) => {
    setselCategories(e.target.value);
    if (e.target.value == "") {
      setCservices([]);
      return false;
    }
    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/services`,
      data: { adminId: adminId, id: e.target.value },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("responseedtaaa", response);
      setCservices(response.data.services);
      setSearchServices(response.data.services);
      setSelectall("");
    });
  };


  const handleClick = (e) => {
    var id = e.target.value;
    var append_tag = cservices.filter((tag, index) => tag.id == id);
    if (e.target.checked) {
      var pre_tag = {
        id: "" + append_tag[0].id + "",
        text: append_tag[0].service,
        cat_id: selcategory,
      };
      setServiceData((oldArray) => [...oldArray, pre_tag]);
    } else {
      setSelectall("");
      setServiceData(serviceData.filter((tag, index) => tag.id !== id));
    }
  };

  const handleSelect = (e) => {
    if (e.target.checked) {
      var old_tags = serviceData.map((tag) => "" + tag.id + "");
      cservices.map((tag) => {
        if (!old_tags.includes("" + tag.id + "")) {
          setServiceData((oldArray) => [
            ...oldArray,
            { id: "" + tag.id + "", text: tag.service, cat_id: selcategory },
          ]);
        }
      });
      setSelectall("minus");
    } else {
      var service_array = cservices.map((tag) => "" + tag.id + "");
      var new_tag = serviceData.filter((tag, index) => {
        if (!service_array.includes("" + tag.id + "")) {
          return tag;
        }
      });
      setSelectall("");
      setServiceData(new_tag);
      // console.log("tagggg",new_tag);

    }
  };

  var updatedServices = [];

  const checkitem = (r) => {
    // console.log("r", r);
    var match = serviceData.map((res) => {
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

    // var arrOfNum = updatedServices.map(str => {
    //   return Number(str);
    // });

    //  console.log("rrr", arrOfNum);

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
      if (
        item.service
          .toString()
          .includes(e.target.value.toString().toUpperCase())
      ) {
        return item;
      }
    });
    setCservices(searchServ);
  };

  const handleDelete = (i, ctag) => {

    var c_id = ctag[i].id;
    // console.log("c_id", c_id);
    setServiceData(serviceData.filter((tag, index) => tag.id != c_id));
  };

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
  //------------------------------------------------

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
      id: 24,
      HeadingTitle: `<div><h1>Indira XTS</h1><b>API Process Indira XTS: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 25,
      HeadingTitle: `<div><h1>ICICI Direct</h1><b>API Process ICICI Direct: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 27,
      HeadingTitle: `<div><h1>Dhan</h1><b>API Process Dhan: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 28,
      HeadingTitle: `<div><h1>Upstox</h1><b>API Process Upstox: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 29,
      HeadingTitle: `<div><h1>Sharekhan</h1><b>API Process Sharekhan: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 23,
      HeadingTitle: `<div><h1>Swastika</h1><b>API Process Swastika: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    , {
      id: 30,
      HeadingTitle: `<div><h1>SMC</h1><b>API Process SMC: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 31,
      HeadingTitle: `<div><h1>Adroit</h1><b>API Process Adroit: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 32,
      HeadingTitle: `<div><h1>Shoonya</h1><b>API Process Shoonya: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    },
    {
      id: 33,
      HeadingTitle: `<div><h1>Samco</h1><b>API Process Samco: -</b> <p>Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.</p></div>`
    }
  ];

  const editUserFilter = Data.filter(val => {
    if (val.id == editBrokerId && editBrokerId) {
      return val
    }
  })


  // --------------------------------------------   26-07-2023 ---------------------------------------
  var month = [];
  var month1 = [];

  if (userdataLicenceType == 2) {
    for (var i = 0; i <= 1; i++) {
      month.push(i);
    }
  } else if (userdataLicenceType == 1) {
    for (var i = 1; i <= 12; i++) {
      month.push(i);
    }
  }

  for (var i = 1; i <= 12; i++) {
    month1.push(i);
  }
  // --------------------------------------------   26-07-2023 ---------------------------------------

  const getPermissions = () => {
    axios({
      method: "post",
      url: `${Config.base_url}subadmins/get`,
      data: {
        userId: adminId,
      },
    }).then(function (response) {
      // console.log("response", response.data.subadmins);
      setForPermission(response.data.subadmins[0])
    });
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


  useEffect(() => {

    axios({
      method: "post",
      url: `${Config.base_url}admin/client`,
      data: { 'adminId': adminId, id: g_id.status },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      console.log("responseget", response.data.userdata[0]);
      setLicenceType(response.data.userdata[0].licence_type)
      setTwoDaysService(response.data.userdata[0].twoday_service)
      setNotChangeBroker(response.data.userdata[0].not_change_broker)
      setOneTimeEditEmail(response.data.userdata[0].email_edit)
      setUserdataLicenceType(response.data.userdata[0].licence_type);
      setUserdata(response.data.userdata[0]);
      let dateStart = new Date(response.data.userdata[0].start_date);
      setStartDate(dateStart);
      let dateEnd = new Date(response.data.userdata[0].end_date);
      setEndDate(dateEnd);
      setcStrategy(response.data.cstrategy);

      if (response.data.cgroup.length != 0) {
        setcGroup(response.data.cgroup[0].group_id);
        groupServiceApi(response.data.cgroup[0].group_id);
      }
    });

    axios.get(`${Config.base_url}admin/strategy`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      setStrategy(res.data.strategy);
    });
    axios.get(`${Config.base_url}admin/sub-admins`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      setSubadmin(res.data.subadmins);
    });
    axios.get(`${Config.base_url}admin/group-services`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      setGroup(res.data.services);
    });

    axios({
      method: "post",
      url: `${Config.base_url}admin/get-all-services`,
      data: { 'client_id': g_id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {
      setServiceData(res.data.services)
    });

    selectcategory()
    getPermissions()
    getSubAdminStrategy()
  }, []);

  const checkbroker = (i) => {
    // console.log("smartalgo checkbok ,", i)
    if (i == userdata.broker) {
      return "checked";
    } else {
      return "";
    }
  };


  const onAlertClose = (e) => {
    setShowAlert(false);
  };


  const inputChange = (e) => {


    if (e.target.name == "email") {
      setUserdata((prevState) => ({ ...prevState, ["email"]: e.target.value }));
    }


    if (e.target.name == "broker") {
      setEditBrokerId(e.target.value)
      setUserdata((prevState) => ({
        ...prevState,
        ["broker"]: e.target.value,
      }));

      // console.log("brokerid", e.target.value);
    }
    if (e.target.name == "api_key") {
      setUserdata((prevState) => ({
        ...prevState,
        ["api_key"]: e.target.value,
      }));
    }
    if (e.target.name == "api_secret") {
      setUserdata((prevState) => ({
        ...prevState,
        ["api_secret"]: e.target.value,
      }));
    }
    if (e.target.name == "app_id") {
      setUserdata((prevState) => ({
        ...prevState,
        ["app_id"]: e.target.value,
      }));
    }
    if (e.target.name == "client_code") {
      setUserdata((prevState) => ({
        ...prevState,
        ["client_code"]: e.target.value,
      }));
    }
    if (e.target.name == "api_type") {
      setUserdata((prevState) => ({
        ...prevState,
        ["api_type"]: e.target.value,
      }));
    }
    if (e.target.name == "demat_userid") {
      setUserdata((prevState) => ({
        ...prevState,
        ["demat_userid"]: e.target.value,
      }));
    }
    if (e.target.name == "licence_type") {
      if (e.target.value == 1) {
        setUserdata(prevState => ({ ...prevState, ['broker']: '' }));
        setAddmonth(0)
        // setLivebrokerErr('')
      }
      if (e.target.value == 2) {
        setAddmonth(1)
      }

      setUserdata((prevState) => ({
        ...prevState,
        ["licence_type"]: e.target.value,
      }));
    }
    if (e.target.name == "addmonth") {
      setAddmonth(e.target.value);
    }
  };

  const checkstrategy = (id) => {
    if (cstrategy.includes(id)) {
      return "minus";
    } else {
      return "";
    }
  };


  const strategyClick = (e) => {
    // console.log("e", e.target.value);
    var name = e.target.value;

    if (e.target.checked) {
      setcStrategy([...cstrategy, name]);
      setStrategyClickError("")
    } else {
      setcStrategy(cstrategy.filter((tag, index) => tag != "" + name + ""));
      setStrategyClickError("")
    }
  };

  const subadminChange = (e) => {
    setUserdata((prevState) => ({
      ...prevState,
      ["subadmin_id"]: e.target.value,
    }));
  };

  const groupServiceApi = (groupId) => {
    if (groupId !== "") {
      axios({
        method: "post",
        url: `${Config.base_url}admin/group-services`,
        data: { 'adminId': adminId, id: groupId },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {
        setGroupServices(response.data.service);
        // setServiceData(response.data.service);
      });
    }
  };

  const groupChange = (e) => {
    // console.log("e.target.value", e.target.value);
    setcGroup(e.target.value);
    groupServiceApi(e.target.value);
  };

  const brokerhtml = () => {
    switch (userdata.broker) {
      case "1":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY / APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID / USER ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>DEMATE USER ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.demat_userid}
                    name="demat_userid"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "2":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "3":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>APP Key</label>
                    <input
                      type="text"
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      value={userdata.api_key}
                      name="api_key"
                      className="form-control"
                      disabled={notChangeBroker === 0 ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>DOB</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    placeholder="example:- 15-08-1947"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
          // <>
          //   <div className="row">
          //     <div className="col-md-3"></div>
          //     <div className="col-md-6">
          //       <div className="form-group">
          //         <label>API KEY</label>
          //         <input
          //           type="text"
          //           onChange={(e) => {
          //             inputChange(e);
          //           }}
          //           value={userdata.api_key}
          //           name="api_key"
          //           className="form-control"
          //           disabled={notChangeBroker === 0 ? false : true}
          //         />
          //       </div>
          //     </div>
          //     <div className="col-md-3"></div>
          //   </div>
          //   <div className="row">
          //     <div className="col-md-3"></div>
          //     <div className="col-md-6">
          //       <div className="form-group">
          //         <label>APP ID</label>
          //         <input
          //           type="text"
          //           onChange={(e) => {
          //             inputChange(e);
          //           }}
          //           value={userdata.app_id}
          //           name="app_id"
          //           className="form-control"
          //           disabled={notChangeBroker === 0 ? false : true}
          //         />
          //       </div>
          //     </div>
          //     <div className="col-md-3"></div>
          //   </div>
          // </>
        );
      case "4":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "5":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "6":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "7":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Investor ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "9":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>USER</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>PASSWORD CODE</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>VERIFICATION CODE</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "10":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "11":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Client Code</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>2FA</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "12":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT CODE</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "13":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "14":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.demat_userid}
                    name="demat_userid"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption Secret Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Encryption IV</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "15":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "16":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Secret</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Demat Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Trade Api Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

          </>
        );
      case "18":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "19":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>2FA</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "20":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>User Id</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>App Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Account ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Code</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "21":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "22":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Key</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Consumer Secret</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            {/* <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Demat Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div> */}
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

          </>
        );
      case "23":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT CODE</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>MPIN</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "24":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "25":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "27":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CLIENT ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>ACCESS TOKEN</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "28":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "29":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CUSTOMER ID</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>API SECURE KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case "30":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>APP KEY</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );
      case '31':
        return (
          <>
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>SECRET KEY</label>
                  <input type="text"
                    value={userdata.api_secret}
                    onChange={e => { inputChange(e) }}
                    name="api_secret"
                    className="form-control" />
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
                    value={userdata.api_key}
                    onChange={e => { inputChange(e) }}
                    name="api_key" className="form-control" />
                </div>
              </div>
            </div>

          </>
        );

      case "32":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Vendor Code</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_key}
                    name="api_key"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Api Secret</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_secret}
                    name="api_secret"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Imei</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.app_id}
                    name="app_id"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Totp Secret</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.demat_userid}
                    name="demat_userid"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );

      case "33":
        return (
          <>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.client_code}
                    name="client_code"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.api_type}
                    name="api_type"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>





            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Birth Of Year</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      inputChange(e);
                    }}
                    value={userdata.demat_userid}
                    name="demat_userid"
                    className="form-control"
                    disabled={notChangeBroker === 0 ? false : true}
                  />
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </>
        );

    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };



  const [showAddModal, setShowAddModal] = useState(false);
  const [serUpdateModal, setSerUpdateModal] = useState([])


  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowAddModal = () => {
    var now = new Date();
    var current = new Date(now.getFullYear(), now.getMonth() + parseInt(addmonth), now.getDate());
    // console.log("next month" ,   current.toString().split(" ")[1]);

    setNextMonth(current.toString())


    if (
      licencetype === '0') {
      // setLivebrokerErr(Constant.SELECT_BROKER_ERROR)
      return
    }

    if (
      userdata.licence_type === 2 && userdata.broker === "0") {
      setLivebrokerErr(Constant.SELECT_BROKER_ERROR)
      // alert('hello world')
      return
    }

    if (cgroup == "") {
      // alert('hello')
      setGroupErr(Constant.SELECT_BROKER_ERROR)
      return
    }
    // if (
    //   userdata.licence_type === "2" && (userdata.broker === undefined || userdata.broker === null || userdata.broker === '')) {
    //   setLivebrokerErr(Constant.SELECT_BROKER_ERROR);
    //   return
    // }


    if (toggleSwitch === false) {
      setStrategyError(Constant.STRATEGY_ERROR_MESSAGE);
      return;
    }

    if (cstrategy.length == 0) {
      setStrategyClickError(Constant.CLIENT_STRATEGY);
      return
    }

    var groupServicesId = [];
    if (groupServices) {
      var groupServicesId = groupServices.map((services) => {
        groupServicesId = services.id;
        return groupServicesId;
      });

      // setSerUpdateModal(groupServicesId)

      // var servicesUpdated = updatedServices.map(str => {
      //   return Number(str);
      // });

      // var serviceMap = serviceData.map((sermap) => {
      //   var serviceMap = sermap.id;
      //   return serviceMap;
      // });

      // // console.log("serviceMap", serviceData);

      // var updateGroupAndServices = groupServicesId.concat(serviceMap)

      // console.log("updateGroupAndServices", updateGroupAndServices);

      // var serviceMap = serviceData.map((sermap) => {
      //   var serviceMap = sermap.id;
      //   return serviceMap;
      // });
    }
    // groupServiceid: serviceData ,
    setShowAddModal(true)
  }


  const submitform = (e) => {

    axios({
      method: "post",
      url: `${Config.base_url}admin/client/update`,
      data: {
        'adminId': adminId,
        data: userdata,
        start_date: startDate,
        end_date: endDate,
        group: cgroup,
        strategy: cstrategy,
        addmonth: addmonth,
        // addmonth: addmonth == "0" || "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9" || "10" || "11" || "12" ? addmonth.split(" ")[0] : addmonth,
        editBrokerHtml: JSON.stringify(editUserFilter[0].HeadingTitle),
        groupServiceid: serUpdateModal,
        admin_id: localStorage.getItem('adminId'),
        role_id: localStorage.getItem('roleId'),
        createdBy: localStorage.getItem('createdBy'),
        showServiceMonthGiven: showServiceMonthGiven
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("sdfsdfsdfsdfsdfgsdgsdg", response.data.status);
      if (response.data.status === 'false') {
        setButtonDisabled(false)
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert(response.data.msg);
        return
      } else if (response.data.status === 'email_error') {
        setButtonDisabled(false)
        setShowAlert(true)
        setAlertColor('error');
        setTextAlert(response.data.msg);
        return
      }
      else if (response.data.status === 'api_key_error') {
        setShowAlert(true)
        setAlertColor('error');
        setTextAlert(response.data.msg);
      }
      else {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(Constant.EDIT_CLIENT_SUCCESS);
        if (roleId == "4") {
          navigate("/subadmin/clientlist")
        }
        else {
          navigate("/admin/clients")
        }
      }
    });
  };

  const getMonthExpired = (sm) => {
    var dateToday = new Date()
    dateToday.setMonth(dateToday.getMonth() + sm)

    return dateToday.toString().split(" ")[1] + " " + dateToday.toString().split(" ")[2] + " " + dateToday.toString().split(" ")[3]
  }


  return (
    <>
      <Modal show={showAddModal} onHide={handleCloseAddModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Client Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your Client Username Is <b>{userdata.username}</b>
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
              {addmonth == "2-Days" ?
                <>
                  <h4>You Have Given {addmonth} Live Licence</h4>
                </>
                :
                <>
                  {addmonth == 0 ? " " :
                    <h4>You Have Given {addmonth + " " + "Month"} Live Licence Which will end on {nextMonth.split(" ")[1]} {nextMonth.split(" ")[2]} {nextMonth.split(" ")[3]}</h4>}
                </>
              }
            </>
          }

        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-info' onClick={handleCloseAddModal}>
            Edit
          </button>
          <button className='btn btn-success'
            disabled={ButtonDisabled}
            onClick={handleSubmit(() => { submitform(); handleClickDisabled() })}
          >
            Update
          </button>
        </Modal.Footer>
      </Modal>

      <div className="content">
        <div className="row">
          <div className="col-md-10">
            <div className="card">
              <div className="card-header">
                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>Edit Client</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right">
                      <div>
                        <span className="text-right" style={{ fontSize: 15 }}><b>Start Date - {dateFormate(userdata.start_date && userdata.start_date).split(" ")[0]}</b></span><br />
                        <span className="text-right" style={{ fontSize: 15 }}><b>Expiry Date - {dateFormate(userdata.end_date && userdata.end_date).split(" ")[0]}</b></span>
                      </div>
                      <NavLink
                        to={roleId == "4" ? "/subadmin/clientlist" : "/admin/Clients"}
                        className="btn btn-color"
                      >
                        <i class="fa fa-arrow-left me-1" aria-hidden="true" data-toggle="tooltip"
                          data-placement="top"
                          title="Back"
                        ></i> Back
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {userdata == "" ? (
                  ""
                ) : (
                  <form>
                    <div className="row">
                      <div className="col-md-6 pr-1">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            {...register("full_name", {
                              onChange: (e) => {
                                inputChange(e);
                              },
                              required: true,
                            })}
                            value={userdata.full_name}
                            name="full_name"
                            className="form-control"
                          />
                          {errors.full_name && (
                            <span style={{ color: "red" }}>
                              * {Constant.CLIENT_FULL_NAME}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 pl-1">
                        <div className="form-group">
                          <label for="exampleInputEmail1">Email</label>
                          <input
                            type="email"
                            {...register("email", {
                              onChange: (e) => {
                                inputChange(e);
                              },
                              // required: true,
                            })}
                            // value={role_id == 4 ? maskEmail(userdata.email) : userdata.email}
                            value={userdata.email}

                            name="email"
                            className="form-control bg-white"
                            placeholder="Email"
                            // readonly
                            style={{ cursor: 'text', color: 'black' }}
                            disabled={oneTimeEditEmail === 0 ? false : true}
                          />
                          {errors.email && (
                            <span style={{ color: "red" }}>
                              * {Constant.CLIENT_EMAIL}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 pr-1">
                        <div className="form-group">
                          <label>Mobile Number</label>
                          <input
                            type="text"
                            {...register("mobile", {
                              onChange: (e) => {
                                inputChange(e);
                              },
                              required: true,
                            })}
                            className="form-control"
                            name="mobile"
                            placeholder="Company"
                            // value={role_id == 4 ? maskNumber(userdata.mobile) : userdata.mobile}
                            value={userdata.mobile}

                          />
                          {errors.mobile && (
                            <span style={{ color: "red" }}>
                              * {Constant.CLIENT_MOBILE}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 pl-1">
                        <div className="form-group">
                          <label>Use License Month</label>
                          <p>{userdata.to_month}</p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Licence</label>
                          <select
                            value={userdata.licence_type}
                            onChange={(e) => {
                              inputChange(e);
                              setLivebrokerErr('')
                            }}
                            name="licence_type"
                            className="form-control"
                          >
                            {userdataLicenceType == 2 ? (
                              ""
                            ) : (
                              <option value="1">Demo</option>
                            )}

                            {role_id == 4 && forPermission.license_permission == 0 ? "" :
                              <option value="2">Live</option>}

                            {/* {
                              `${Config.panel_name}` == 'adonomist' // || `${Config.panel_name}` == 'smartalgo'
                                ?
                                roleId != 4 ?
                                  userdataLicenceType == 2 ? (
                                    <option value="2">Live</option>
                                  ) : (
                                    <>
                                      <option value="1" >Demo</option>
                                      <option value="2">Live</option>
                                    </>
                                  )
                                  :
                                  (
                                    <option value="1" >Demo</option>
                                  )
                                :
                                userdataLicenceType == 2 ? (
                                  <option value="2">Live</option>
                                ) : (
                                  <>
                                    <option value="1" >Demo</option>
                                    <option value="2">Live</option>
                                  </>
                                )

                            } */}

                          </select>
                        </div>
                        {liveBrokerErr ?
                          <span style={{ color: "red" }}>
                            {liveBrokerErr}
                          </span>
                          : ""}
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>To Month</label>
                          {userdata.licence_type == 1 ? (
                            <div>
                              <div className="row">
                                <div className="col-md-6">
                                  <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    // selectsStart
                                    startDate={startDate}
                                    className="form-control"
                                    filterDate={isWeekday}
                                    endDate={endDate}
                                    minDate={new Date()}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="From Date"
                                  />
                                </div>
                                <div className="col-md-6">
                                  <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    // selectsEnd
                                    startDate={startDate}
                                    className="form-control"
                                    filterDate={isWeekday}
                                    minDate={startDate - 2}
                                    endDate={endDate}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="To Date"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (

                            <select
                              className="form-control"
                              // disabled={role_id == 4 && forPermission.license_permission == 0 ? false : true}
                              value={addmonth}
                              name="addmonth"
                              onChange={(e) => {
                                inputChange(e);
                              }}
                            >

                              {role_id == 4 && forPermission.license_permission == 0 ? "" :
                                <>
                                  {twoDaysService == 1 || userdataLicenceType == "2" ? "" :
                                    <option>2-Days</option>}
                                  {month.map((sm, i) => (
                                    <option value={sm}>{sm + " " + "Month Licence" + " " + "Expired on - " + getMonthExpired(sm)}</option>
                                  ))}
                                </>}
                            </select>

                          )}
                        </div>
                      </div>
                    </div>
                    {/* {startDateError && <span style={{ color: "red" }}>* {startDateError}</span>} */}

                    {/* {liveBrokerErr && liveBrokerErr} */}
                    {userdata.licence_type == 1 ? (
                      ""
                    ) : (
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(1)}
                              className="form-check-input"
                              id="aliceblue"
                              name="broker"
                              value="1"
                           
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}
                            />
                            <label className="form-check-label" for="aliceblue">
                              Alice blue
                            </label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio" onChange={e => { inputChange(e) }} checked={checkbroker(2)} className="form-check-input" id="zerodha" name="broker" value="2"
                  
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}
                            />
                            <label className="form-check-label" for="zerodha">Zerodha</label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input type="radio" onChange={e => {
                              inputChange(e)
                              setLivebrokerErr('')
                            }}
                              checked={checkbroker(3)}
                              className="form-check-input" id="zebull" name="broker" value="3"
                              // disabled={notChangeBroker === 0 ? false : true} 
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}
                            />
                            <label className="form-check-label" for="zebull">Zebull</label>
                          </div>
                        </div>

                   

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(5)}
                              className="form-check-input"
                              id="5paisa"
                              name="broker"
                              value="5"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label className="form-check-label" for="5paisa">
                              5 paisa
                            </label>
                          </div>
                        </div>



                 


                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(6)}
                              className="form-check-input"
                              id="fyers"
                              name="broker"
                              value="6"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="fyers"
                            >
                              Fyers
                            </label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(4)}
                              className="form-check-input"
                              id="angel"
                              name="broker"
                              value="4"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}
                            />
                            <label className="form-check-label" for="angel">
                              Angel
                            </label>
                          </div>
                        </div>


                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')

                              }}
                              checked={checkbroker(10)}
                              className="form-check-input"
                              id="masterttrust"
                              name="broker"
                              value="10"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="masterttrust"
                            >
                              Master Trust
                            </label>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')

                              }}
                              checked={checkbroker(11)}
                              className="form-check-input"
                              id="b2c"
                              name="broker"
                              value="11"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="b2c"
                            >
                              B2C
                            </label>
                          </div>
                        </div>

                        {/* market Hub */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(9)}
                              className="form-check-input"
                              id="markethub"
                              name="broker"
                              value="9"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label className="form-check-label" for="markethub">
                              Market Hub
                            </label>
                          </div>
                        </div>

                        {/* Anand Rathi */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(13)}
                              className="form-check-input"
                              id="anandrathi"
                              name="broker"
                              value="13"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="anandrathi"
                            >
                              Anand Rathi
                            </label>
                          </div>
                        </div>

                        {/* Choice */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(14)}
                              className="form-check-input"
                              id="choice"
                              name="broker"
                              value="14"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="choice"
                            >
                              Choice
                            </label>
                          </div>
                        </div>

                        {/* Mandot */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(15)}
                              className="form-check-input"
                              id="mandot"
                              name="broker"
                              value="15"
                              // disabled={notChangeBroker === 0 ? false : true}
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : notChangeBroker === 0 ? false : true}

                            />
                            <label
                              className="form-check-label"
                              for="mandot"
                            >
                              Mandot
                            </label>
                          </div>
                        </div>

                        {/* Motilal Oswala */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(12)}
                              className="form-check-input"
                              id="motilaloswal"
                              name="broker"
                              value="12"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}

                            />
                            <label className="form-check-label" for="motilaloswal">
                              Motilal Oswal
                            </label>
                          </div>
                        </div>


                        {/* Kotak */}

                        {/* <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(16)}
                              className="form-check-input"
                              id="kotak"
                              name="broker"
                              value="16"
                            />
                            <label className="form-check-label" for="kotak">
                              Kotak
                            </label>
                          </div>
                        </div> */}


                        {/* IIFL */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(18)}
                              className="form-check-input"
                              id="iifl"
                              name="broker"
                              value="18"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="iifl">
                              IIFL
                            </label>
                          </div>
                        </div>

                        {/* Arihant */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(19)}
                              className="form-check-input"
                              id="arihant"
                              name="broker"
                              value="19"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="arihant">
                              Arihant
                            </label>
                          </div>
                        </div>

                        {/* Master Trust Dealer */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(20)}
                              className="form-check-input"
                              id="mastertrust_dealer"
                              name="broker"
                              value="20"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="mastertrust_dealer">
                              MasterTrust Dealer
                            </label>
                          </div>
                        </div>

                        {/* Laxmi */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(21)}
                              className="form-check-input"
                              id="laxmi"
                              name="broker"
                              value="21"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="laxmi">
                              Laxmi
                            </label>
                          </div>
                        </div>


                        {/* {Swatika} */}


                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(23)}
                              className="form-check-input"
                              id="swstika"
                              name="broker"
                              value="23"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="upstox">
                              Swastika
                            </label>
                          </div>
                        </div>






                        {/* Kotak Neo */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(22)}
                              className="form-check-input"
                              id="kotak_neo"
                              name="broker"
                              value="22"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="kotak_neo">
                              Kotak Neo
                            </label>
                          </div>
                        </div>

                        {/* Indira XTS */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(24)}
                              className="form-check-input"
                              id="indira_xts"
                              name="broker"
                              value="24"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="indira_xts">
                              Indira XTS
                            </label>
                          </div>
                        </div>

                        {/* ICICI Direct */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(25)}
                              className="form-check-input"
                              id="icicidirect"
                              name="broker"
                              value="25"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="icicidirect">
                              ICICI Direct
                            </label>
                          </div>
                        </div>

                        {/* Dhan */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(27)}
                              className="form-check-input"
                              id="dhan"
                              name="broker"
                              value="27"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="dhan">
                              Dhan
                            </label>
                          </div>
                        </div>

                        {/* Upstox */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={(e) => {
                                inputChange(e);
                                setLivebrokerErr('')
                              }}
                              checked={checkbroker(28)}
                              className="form-check-input"
                              id="upstox"
                              name="broker"
                              value="28"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="upstox">
                              Upstox
                            </label>
                          </div>
                        </div>


                        {/* SMC */}

                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(30)}
                              className="form-check-input"
                              id="SMC"
                              name="broker"
                              value="30"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="SMC">SMC</label>
                          </div>
                        </div>

                        {/* Adroit */}
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(31)}
                              className="form-check-input"
                              id="adroit"
                              name="broker"
                              value="31"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="adroit">Adroit</label>
                          </div>
                        </div>

                        {/* Shoonya */}
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(32)}
                              className="form-check-input"
                              id="Shoonya"
                              name="broker"
                              value="32"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="Shoonya">Shoonya</label>
                          </div>
                        </div>


                        {/* Samco */}
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              type="radio"
                              onChange={e => {
                                inputChange(e)
                                setLivebrokerErr("")
                              }}
                              checked={checkbroker(33)}
                              className="form-check-input"
                              id="Samco"
                              name="broker"
                              value="33"
                              disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}
                            />
                            <label className="form-check-label" for="Samco">Samco</label>
                          </div>
                        </div>

                      </div>
                    )}
                    {userdata.licence_type == 1 ? "" : brokerhtml()}
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">

                          {/* <div className="row d-flex">
                            <div className='col-md-6 '> */}

                          {(role_id == 4 && forPermission.group_permission == 0) ? "" :
                            <div className='col-md-12'>
                              <div class="form-group">
                                <label>Group</label>
                                <select
                                  value={cgroup}
                                  name="group"
                                  // onChange={(e) => groupChange(e)}

                                  {...register("group", { onChange: (e) => { groupChange(e); setGroupErr('') } })}
                                  class="form-control"
                                >
                                  {/* <option value="">Please select group</option> */}
                                  {group.map((sm, i) => (
                                    <option value={sm.id}>{sm.group_name}</option>
                                  ))}
                                </select>
                                <div className="row" style={{ marginTop: "10px" }}>
                                  {groupServices && groupServices.map((service, i) => (
                                    <div
                                      className="col-md-3"
                                      style={{
                                        border: "1px solid #eee",
                                        padding: "10px",
                                        textAlign: "center",
                                        borderRadius: "3px",
                                        background: "#f96332",
                                        color: "#fff",
                                        width: "20%",
                                      }}
                                    >
                                      {service.text}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>}
                          {/* <div class="form-group">
                                <label class="form-check-label" for="exampleRadios2">
                                  Services
                                </label>
                                <select
                                  value={selcategory}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  className="form-control"
                                >
                                  <option value=''
                                  >select category</option>
                                  {category.map((cat, i) => (
                                    <option key={i} value={cat.id}>{cat.name}</option>
                                  ))}
                                </select>
                              </div> */}
                          <div className="row">
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
                                      <div className="col-md-6 pr-1" key={i}>
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
                            </div>
                          </div>
                        </div>


                      </div>


                      {GroupErr ? <span style={{ color: "red" }}> * {GroupErr} </span> : ""}
                    </div>
                    {/* </div>
                    </div> */}
                    {/* {(role_id == 4 && forPermission.strategy_permission == 0) ? "" : */}
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Strategy</label>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label={toggleSwitch === true ? "Hide Strategies" : "Show Strategies"}
                            disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}

                            onClick={(e) => {
                              setToggleSwitch(e.target.checked);
                            }}
                          />
                          {toggleSwitch === true ? ("") : (<p style={{ color: "red" }}>{strategyError}</p>)}
                          <div className="col-md-12">
                            {roleId === "4" ?
                              <div className="row">
                                {toggleSwitch === true && subadminStrategyApi.map((sm, i) => (
                                  <div className="col-md-4">
                                    <div class="form-check">
                                      <input
                                        class="form-check-input"
                                        name="strategy"
                                        disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}

                                        // {...register("strategy", {
                                        //   onChange: (e) => {
                                        //     strategyClick(e);
                                        //   },
                                        //   required: true,
                                        // })}
                                        onChange={(e) => { strategyClick(e) }}
                                        checked={checkstrategy(sm.strategy)}
                                        type="checkbox"
                                        value={sm.strategy}
                                      />
                                      <label class="form-check-label">
                                        {sm.strategy}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              :
                              <div className="row">
                                {toggleSwitch === true && strategy.map((sm, i) => (

                                  <div className="col-md-4">
                                    <div class="form-check">
                                      <input
                                        class="form-check-input"
                                        name="strategy"
                                        // {...register("strategy", {
                                        //   onChange: (e) => {
                                        //     strategyClick(e);
                                        //   },
                                        //   required: true,
                                        // })}
                                        onChange={(e) => { strategyClick(e) }}
                                        checked={checkstrategy(sm.name)}
                                        type="checkbox"
                                        value={sm.name}
                                      />
                                      <label class="form-check-label">
                                        {sm.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            }
                          </div>

                          {strategyClickError && (
                            <span style={{ color: "red" }}>
                              * {Constant.CLIENT_STRATEGY}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* } */}

                    <div className="d-flex">
                      <div className="col-md-6 me-1">
                        <div className="form-group">
                          <label>Service Month Given</label>
                          <select
                            name="services_month_given"
                            class="form-control"
                            defaultValue={userdata.duration}
                            onChange={(e) => { setShowServiceMonthGiven(e.target.value) }}
                            disabled={forPermission.api_update == 1 && roleId == 4 ? true : false}

                          >
                            <option value="">Service Month Given</option>

                            {month1.map((sm, i) =>
                              <option value={sm} >{sm}</option>
                            )
                            }
                          </select>
                        </div>
                      </div>

                      {role_id == 4 ? "" :
                        <div className="col-md-6 ms-1">
                          <div className="form-group">
                            <label>Sub-Admin</label>
                            <select
                              value={userdata.subadmin_id}
                              name="sub2"
                              {...register("sub2", {
                                onChange: (e) => {
                                  subadminChange(e);
                                },
                              })}
                              class="form-control"
                            >
                              <option value="">
                                Please select sub-admin
                              </option>

                              {subadmin.map((sm, i) => (
                                <option value={sm.userId}>{sm.name}</option>
                              ))}
                            </select>
                            {errors.sub2 && (
                              <span style={{ color: "red" }}>
                                * {Constant.CLIENT_SUB_ADMIN}
                              </span>
                            )}
                          </div>
                        </div>
                      }
                    </div>
                    {/* SERVICE AMOUNT & AMOUNT RECEIVED */}

                    {/* <div className="d-flex">
                      <div className="col-md-6 me-1">
                        <div className="form-group">
                          <label>Service Amount</label><br />
                          <input type='number' className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6 mx-1">
                        <div className="form-group">
                          <label>Amount Received</label><br />
                          <input type='number' className="form-control" />
                        </div>
                      </div>
                    </div> */}

                    <div className="row">
                      <div className="col-md-10 pr-1">
                        <button
                          type="button"
                          onClick={handleSubmit(handleShowAddModal)}
                          className="btn btn-color"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* <div className="col-md-2">
            <div className="card">
              <div className="card-header">
                <h6 className="title">Selected Services</h6>
              </div>
              <div className="card-body">
                {
                  category.length == 0 ? '' : category.map((cat, i) => {
                    var tag2 = serviceData.filter((tag, index) => tag.cat_id == cat.id)
                    // console.log("tag2", tag2);

                    return tag2.length == 0 ? '' : <><br></br><h6 key={i}>{cat.name}</h6><ReactTags
                      tags={tag2}
                      handleDelete={(e) => { handleDelete(e, tag2) }}
                      autocomplete
                    /></>
                  }
                  )}
              </div>
            </div>
          </div> */}

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

      {/* <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="title">Selected Services</h5>
          </div>
          <div className="card-body">
            {
              category.length == 0 ? '' : category.map((cat, i) => {
                var tag2 = serviceData.filter((tag, index) => tag.cat_id == cat.id)
                // console.log("tag2", tag2);

                return tag2.length == 0 ? '' : <><br></br><h6 key={i}>{cat.name}</h6><ReactTags
                  tags={tag2}
                  handleDelete={(e) => { handleDelete(e, tag2) }}
                  autocomplete
                /></>
              }
              )}
          </div>
        </div>
      </div> */}

    </>
  );
}

export default Editclient;
