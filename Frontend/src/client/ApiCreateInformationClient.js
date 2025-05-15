import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Modal } from "react-bootstrap";
import { data, event } from "jquery";
// import { Item } from "react-bootstrap/lib/Breadcrumb";


// import { Title } from "react-bootstrap/lib/Modal";

const locationname = window.location.host


const Data = [
  {
    id: 1,
    HeadingTitle: "Alice Blue",
    Link1: "https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB",
    Link2: `${Config.broker_redirect_url}aliceblue/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}aliceblue/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get Api Secret Key And App code please Update this detail in your Profile...',
    youTube: "https://www.youtube.com/watch?v=DEKgwveZ9eM",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    img1: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue2.png",
    youTube: "https://www.youtube.com/watch?v=DEKgwveZ9eM",
  },
  {
    id: 2,
    HeadingTitle: "Zerodha",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    Link1: "https://kite.trade/",
    Link2: `${Config.broker_redirect_url}zerodha/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}zerodha/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get API Secret Key and APP code and Update them on your Profile in this software.',
  },
  {
    id: 3,
    HeadingTitle: "Zebull",
    Link1: "https://go.mynt.in/#/",
    Apicreate: "This Url Use To login Demat Account And Go Profile Section And Click On Api Key Section And Generate APi Key In 10 YEAR. Page Refresh and Copy App Key And Vender Code Copy and Paste Your profile Section in Panel.Update Panel Profile on User Id And Password On Demat password And APP Key And Date Of Birth.",
    // Link2: "https://ant.aliceblueonline.com/plugin/callback",
    youTube: "https://www.youtube.com/watch?v=wv0MpWirrVs",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    img1: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull1.png",
    ZBStep2: "Click on Profile-> You can find a API Key button-> You can see your API Key",
    img2: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull2.png",
    Apicreate: "Copy that API key and Update it on your Profile in this software.",
    img3: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull3.png",
  },
  {
    id: 4,
    HeadingTitle: "Angel",
    Link1: "https://smartapi.angelbroking.com/",
    Link2: `${Config.broker_redirect_url}angelbroking/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}angelbroking/access_token?email=ss@gmail.com`,
    youTube: "https://www.youtube.com/watch?v=zI7FX-yUgyw",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    img1: "http://app.smartalgo.in/assets/dist/img/angel/angel1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/angel/angel2.png",
    Apicreate: 'You will get API Secret Key and APP code, please Update them on your Profile in this software.',
    img3: "http://app.smartalgo.in/assets/dist/img/angel/angel3.png",

  },
  {
    id: 5,
    HeadingTitle: "5 Paisa",
    Link1: "https://invest.5paisa.com/DeveloperAPI/APIKeys",
    youTube: "https://www.youtube.com/watch?v=LAzzIWtp79w",
    // Link2: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    img1: "http://app.smartalgo.in/assets/dist/img/5paisa/5paisa.png",
  },
  {
    id: 6,
    HeadingTitle: "Fyers",
    Link1: "https://myapi.fyers.in/dashboard/",
    Link2: `${Config.broker_redirect_url}fyers/access_token`,
    youTube: "https://www.youtube.com/watch?v=TO2mPpqww34",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    img1: "http://app.smartalgo.in/assets/dist/img/fyers/fyers1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/fyers/fyers2.png",
    Apicreate: 'You will get API Secret Key and APP code, please Update them on your Profile in this software.',
    img3: "http://app.smartalgo.in/assets/dist/img/fyers/fyers3.png",
  },
  {
    id: 7,
    HeadingTitle: "Indira ",
    Link1: "https://www.5paisa.com/developerapi/authorization",
    Link2: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
  },
  {
    id: 8,
    HeadingTitle: "TradeSmartapi",
    Link1: "https://www.5paisa.com/developerapi/authorization",
    Link2: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
  },
  {
    id: 9,
    HeadingTitle: "Market-Hub ",
    description: 'Please Update CLIENT CODE, PASSWORD CODE And VERIFICATION CODE for all these details please contact with Market hub broker then Submit  And  Login With Api Trading On...',
    // Link1: "https://www.5paisa.com/developerapi/authorization",
    // Link2: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
  },
  {
    id: 10,
    HeadingTitle: "Master-Trust ",
    Link1: "https://develop-masterswift.mastertrust.co.in/",
    Link2: `${Config.broker_redirect_url}mastertrust/access_token`,
    Apicreate: 'you will get Api Secret Key And App id please Update this detail in your Profile...',
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
  },
  {
    id: 11,
    HeadingTitle: "B2C",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    // Link1: "https://odinconnector.63moons.com/market-place",
    youTube: "https://www.youtube.com/watch?v=dVNRHBRxCHg",
    B2C: "https://odinconnector.63moons.com/market-place/api?sAppToken=IndiraSecuritiesB2C1070464deef&sTwoWayToken=abc&sPartnerId=01F00F&sTenantId=15",
    img1: "http://app.smartalgo.in/assets/dist/img/B2C/B2C1.png",
  },
  {
    id: 14,
    HeadingTitle: "Choice",
    // describtionChoice:
    //   "Please Update VENDOR ID, USER ID, PASSWORD, VENDOR KEY, ENCRYPTION SECRET KEY And ENCRYPTION IV for all these details please contact with Choice broker then Submit And  Login With Api Trading On...",
    // desChoiceStep1: "Step 1- Get the live details from broker and update it on profile.",
    // choiceNote: "Note- Firstly you will get the UAT details then kindly contact the broker to get the live details.",
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...',
    describtion: "1) Mail to the broker for the live details with the refferal code- PNPINFOTECH ",
    describtion3: `2) Subject: Request for Live API Details -------------------------------------------,

    Dear Choice,
    Kindly provide the API live details for trading and market data access from Choice. Refferal code- PNPINFOTECH.Thank you for your assistance.  -------
    Best Regards,`,
    describtionChoice: "Update VENDOR ID,Demate ID, PASSWORD, VENDOR KEY, ENCRYPTION SECRET KEY And ENCRYPTION KEY that you have received by broker.",


  },
  {
    id: 12,
    HeadingTitle: "Motilal Oswal ",
    describtion:
      "Kindly click on the link given below and  Go to Get Start Button And login Your Account and Next Step is create App Follow Next step and mail To motilal broker.",

    Link1: `https://invest.motilaloswal.com/Home/TradingAPI`,

    Link2: `${Config.broker_redirect_url}motilaloswal/access_token?email=YOUR_PANEL_EMAIL`,
    Link3: `e.g - ${Config.broker_redirect_url}motilaloswal/access_token?email=ss@gmail.com`,
    link3: `e.g - ${Config.broker_redirect_url}motilaloswal/access_token?email=ss@gmail.com`,
    // Apicreate: 'you will get Api Secret Key And App code please Update this detail in your Profile... And Send Mail This Formate',
    Apicreate: 'You will get API Key, please mail the broker(Follow below mail format) to acitvate your API key and update them on your Profile in this software.',
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    describtion1: `  To :- tradingapi@motilaloswal.com
    Subject :- Motilal Api Key
    --------------------------------------------------------
    Hello Sir,

    Please Activate the given API Key for the
    Demat Code "Enter Your Client Code" .

    1. Api Key :- Enter Your APIKEY

    In Reference to "CDPL9786" ID

    Regards & Thanks

    `,
    img1: "http://app.smartalgo.in/assets/dist/img/motilal/motilal1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/motilal/motilal2.png",
    img3: "http://app.smartalgo.in/assets/dist/img/motilal/motilal3.png",
  },
  {
    id: 13,
    HeadingTitle: "Anand Rathi",
    // description:
    //   "Please Update SECRET KEY And APP KEY for all these details please contact with Anand Rathi broker then Submit And Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your describtionProfile...'.
    describtion: "Insert Interactive API",
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na"
  },
  {
    id: 15,
    HeadingTitle: "Mandot",
    describtion:
      "Please Update USERNAME And PASSWORD for all these details please contact with Mandot broker then Submit  And  Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...',
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na"
  },
  {
    id: 16,
    HeadingTitle: locationname === "software.trustalgo.net" ? "Test" : "Kotak Securities",
    // describtion:
    //   "Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your dmat with our Algo software.",

    describtion:
      "Kotak securities do not provide any API information for new clients.",
    // Link1: "hhttps://tradeapi.kotaksecurities.com/devportal/apis",
    // Link1: "https://tradeapi.kotaksecurities.com/devportal/applications",
    youTube: "https://www.youtube.com/watch?v=DRpbvo2ku8s",


    describtion2: 'Login Account  And Click "DefaultApplication" and next click on Production Key in Sidebar And Consumer Key And Consumer Secret Update on Your Profile And Demat Password And TradingApi Password Both Of Update on Your Profile . The access code generated is sent to the registered email address & mobile number.A generated Access Code is valid for the day (till 11:59:59 PM on the same day).',
  },
  {
    id: 18,
    HeadingTitle: "IIFL",
    // describtion:
    //   "Please Update USERNAME And PASSWORD for all these details please contact with IIFL broker then Submit  And  Login With Api Trading On. If you are using IIFL broker it is mandatory to have IIFL Blaze App.",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...',
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    describtion:
      `Step 1: If you are using IIFL broker, fill all user information in the below sheet file and send to
    ttblazesupport@iifl.com`,
    iifl: "http://app.smartalgo.in/assets/dist/img/iifl/ClientMappinFormat.xls",
  },
  {
    id: 19,
    HeadingTitle: "Arihant ",
    describtion:
      "To get Api Key and 2FA click below link and after that click on GET API button to get keys, After clicking GET API button you will see this page Login with your User Id and Password.If you cant't login your account or your account is suspended call Arihant support and tell them to Always Activate your Odin Account for API Place Orders",
    Link1: "https://app-saas.odinconnector.co.in/market-place/api?sAppToken=ArihantB2C1906b23c8b9&sTwoWayToken=abc&sPartnerId=020019&sTenantId=25",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
    img1: "http://app.smartalgo.in/assets/dist/img/arihant/arihantgetapi.png",
  },
  {
    id: 20,
    HeadingTitle: "MasterTrust Dealer",
    describtion:
      "Please Update USER ID, App Key, PASSWORD and Account ID and Vendor Code for all these details please contact with MasterTrust Dealer broker then Submit  And  Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 21,
    HeadingTitle: "Laxmi",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with Laxmi broker then Submit And Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 22,
    HeadingTitle: "Kotak Neo",
    describtion:
      "Please Update CONSUMER KEY, CONSUMER SECRET, USERNAME and TRADE API PASSWORD for all these details please contact with Kotak Neo broker then Submit And Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
    img1: "http://app.smartalgo.in/assets/dist/img/kotakneo/kotakneo.png",
    LinkOne: "https://neo.kotaksecurities.com/Login",
    Link1: "https://neo.kotaksecurities.com/Login",
    Apicreate: 'You will get Api Secret Key And App key please Update this detail in your Profile.',
    img3: "http://app.smartalgo.in/assets/dist/img/kotak/kotak2.png",
  },
  {
    id: 23,
    HeadingTitle: "Swastika",
    describtion:
      "Please Update CLIENT CODE, MPIN  for all these details please contact with Swastika  broker then get TOTP from google authenticator  And then Login With Api Trading On...",
    Link1: "https://www.swastika.co.in/",
    Swastika: "Click on Profile-> You can find a API Key button-> You can see your API Key",
    newlink: "https://totp.danhersam.com/",
    // img3:"http://app.smartalgo.in/assets/dist/img/swastika/swastika.png",

  },
  {
    id: 24,
    HeadingTitle: "Indira XTS",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with Indira XTS broker then Submit And Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 25,
    HeadingTitle: "ICICI Direct",
    describtion:
      "For SECRET KEY and API KEY click below given link after redirection you want to login your account with your userID and password after login you can generate Keys",
    // Link1: `${Config.broker_redirect_url}icicidirect/access_token?email=YOUR_EMAIL_HERE`,
    LinkOne: "https://api.icicidirect.com/apiuser/home",
    Link1: "https://api.icicidirect.com/apiuser/home",
    img1: "http://app.smartalgo.in/assets/dist/img/icicidirect/icicidirectsignup.png",
    img2: "http://app.smartalgo.in/assets/dist/img/icicidirect/iciciredirecturl.png",
    LinkTwo: `${Config.broker_redirect_url}icicidirect/access_token?email=YOUR_EMAIL_HERE`,
    Apicreate: 'You will get API KEY and SECRET KEY please Update this detail in your Profile.',
    img3: "http://app.smartalgo.in/assets/dist/img/icicidirect/apisecretkey.png",
  },
  {
    id: 27,
    HeadingTitle: "Dhan",
    describtion:
      "For CLIENT ID and ACCESS TOKEN go to your My Profile Dhan and click on DhanHQ Trading APIs & Access to generate ACCESS TOKEN and also select 30 days validity to expiry for token, You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access",
    Link1: "https://dhan.co/",
    img1: "http://app.smartalgo.in/assets/dist/img/dhan/dhanaccestoken.png",
  },
  {
    id: 28,
    HeadingTitle: "Upstox",
    describtion:
      "Click below link to generate API KEY and SECRET KEY after login to below page you will see New App button click on that button and put your Redirect URL in url field and continue after this process you will get your API and SECRET Keys",
    // Link1: "account.upstox.com/developer/apps",
    Link1: "https://account.upstox.com/developer/apps",
    Link2: `${Config.broker_redirect_url}upstox/access_token`,
    img1: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxgenerateapikeyandsecretkey.png",
    img2: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxredirecturl.png",
  },
  {
    id: 30,
    HeadingTitle: "Smc",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with SMC broker then Submit And Login With Api Trading On...",
  },
  {
    id: 31,
    HeadingTitle: "Adroit",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with Adroit broker then Submit And Login With Api Trading On...",
  },
  {
    id: 32,
    HeadingTitle: "Shoonya",
    describtion: "Please Update all these details please contact with Shoonya broker then Submit And Login With Api Trading On...",

    LinkOne: "https://trade.shoonya.com/#/",
    LinkTwo: `https://prism.shoonya.com/`,
  },
];


export default function ApiCreateInformationClient() {


  const client_id = localStorage.getItem("client_id");
  const [show, setShow] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const client_token = localStorage.getItem('client_token');

  //  broker id
  const [userBrokerDetail, setUserBrokerDetail] = useState("");
  console.log("userBrokerDetail", userBrokerDetail);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios({
      url: `${Config.base_url}client/profile/broker_detail`,
      method: "POST",
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      console.log("res", res.data.msg);
      setUserBrokerDetail(res.data.msg.broker);
    });
  }, []);

  const getInfo = (e) => {
    const btnValue = e.target.value;
    const filterData = Data.filter((item) => {

      if (item.id.toString().includes(btnValue)) {
        return item;
      }

    });


    handleShow(true);
    setFilterValue(filterData);
  };



  // Css for styling button


  const StyleBtn = {
    cursor: "pointer",
    color: "rgb(60, 141, 188)",
    background: "none",
    border: "none",
    fontSize: "18px",
    fontWeight: "500",
  };
  //  For Div Style
  const divStyle = {
    height: "70vh",
    zIndex: "1",
    boxShadow: "box-shadow: 0 1px 15px 1px rgb(39 39 39 / 10%)",
  };

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title"> API Create Details</h4>
                <div className="row">
                  {Data.map((item, i) =>
                    item.id == userBrokerDetail && userBrokerDetail ? (
                      <>
                        {console.log("inside item", item)}
                        <div className="d-flex flex-column" style={divStyle} key={i}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-decoration-Underline mb-1 hover mx-3 bg-light"
                            style={StyleBtn}
                            value={item.id}
                            onClick={(e) => getInfo(e)}
                          >
                            {item.HeadingTitle}
                          </Button>
                        </div>
                        {locationname == "software.trustalgo.net" && item.id === 16 ? "" : <>
                          <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                            size={"lg"}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>
                                <p > {item.HeadingTitle} API Create Information
                                </p>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="d-flex flex-column">
                                <p className="fw-bold">
                                  Api Process &nbsp;
                                  {item.HeadingTitle}: -
                                  {item.id == 14 ? "" :
                                    <>
                                      <br /> <br />
                                      {item.description ? item.description : <span className="fw-light">{item.describtion}</span>}

                                    </>}
                                </p>

                                {item.HeadingTitle === "Choice" ? <><p>{item.describtion}</p> <p>{item.describtion3}</p> </> : ""}

                                {!item.iifl ? "" :
                                  <>
                                    <p className="fw-bold mb-0">
                                      Step 2: &nbsp;
                                      <span className="fw-bold">Download the below file. Fill and send it to Broker</span>
                                    </p>
                                    <a
                                      href={item.iifl}
                                      className=" text-decoration-none ls-1 btn btn-info"
                                    >
                                      Download
                                    </a>
                                  </>
                                }


                                {!item.B2C ? "" :
                                  <>
                                    <p className="fw-bold mb-0">
                                      Step 1: &nbsp;
                                      <span className="fw-bold">Click below link and Click on Get API</span>
                                    </p>
                                    <a
                                      href={item.B2C}
                                      className=" text-decoration-none ls-1"
                                      style={{ color: "#3c8dbc" }}
                                      target="_blank"
                                    >
                                      https://odinconnector.63moons.com/market-place
                                    </a>
                                    <img className="border" src={item.img1} alt="Image Not found"></img><br></br>
                                  </>
                                }



                                {item.HeadingTitle == "Swastika" ? <>
                                  <b>You can use below link to get TOTP and enter YOUR SECRET KEY</b>
                                  <a
                                    href={item.newlink}
                                    className=" text-decoration-none ls-1"
                                    style={{ color: "#3c8dbc" }}
                                    target="_blank"
                                  >
                                    {item.newlink}
                                  </a>
                                  <br></br>
                                  <br></br>

                                </> : ""
                                }

                                {item.id == 32 && (
                                  <>
                                    <p>1. Update all the information including username, password, and demat password.</p>
                                    <p>2. Log in to the demat account.</p>
                                    <p>3. Go to the profile section.</p>
                                    <p>4. In the profile section, find and copy the Yoke from the securities section.</p>
                                    <p>5. Update the TOTP Secret with the copied Yoke.</p>
                                    <p>6. Log in to the client's account.</p>
                                    <p>7. Click on the "Trading On" button to enable trading.</p>
                                  </>
                                )}


                                {!item.Link1 ? '' : <>
                                  <p className="mb-2" style={{ fontWeight: "bold" }}>
                                    Step 1: Click below link and Login
                                  </p>
                                  <a className="mb-2" href={item.Link1} target="_blank">
                                    {item.Link1}
                                  </a>
                                </>}

                                {item.HeadingTitle === "B2C" ? "" : <img src={item.img1} ></img>}

                                {!item.LinkOne ? '' : <>
                                  <p className="fw-bold mb-0 mt-3">
                                    <br></br>
                                    <br></br>
                                    Step 2: &nbsp;
                                    <span className="fw-bold">
                                      Click below link and Login.
                                    </span>
                                  </p>

                                  <a
                                    href={toString(item.LinkOne)}
                                    className=" text-decoration-none"
                                    style={{ color: "#3c8dbc" }}
                                    target="_blank"
                                  >
                                    {item.LinkOne}
                                  </a>
                                  <br />
                                  <img className="border" src={item.img2}></img>
                                </>}




                                {!item.LinkTwo ? '' : <>
                                  <p className="fw-bold mb-0 mt-3">
                                    <br></br>
                                    <br></br>
                                    Step 2: &nbsp;
                                    <span className="fw-bold">
                                      Enter your Details and the Redirect URL which is given below.
                                    </span>
                                  </p>

                                  <a
                                    href={toString(item.LinkTwo)}
                                    className=" text-decoration-none"
                                    style={{ color: "#3c8dbc" }}
                                    target="_blank"
                                  >
                                    {item.LinkTwo}
                                  </a>
                                  <br />
                                  <img className="border" src={item.img2}></img>
                                </>}




                                {!item.ZBStep2 ? '' : <>
                                  <p className="fw-bold mb-0 mt-3 ">
                                    Step 2: &nbsp;
                                    <span className="fw-Bold">How to find API?</span>
                                  </p>
                                  <p className="fw-light">
                                    {item.ZBStep2 ? item.ZBStep2 : ''}
                                  </p>
                                  <img className="border" src={item.img2} ></img><br></br>
                                </>}

                                {!item.Link2 ? ""
                                  : <>
                                    <p className="mb-2" style={{ fontWeight: "bold" }}>

                                      Step 2: Enter your Details and Redirect url which is given below
                                    </p>
                                    <a className="mb-2" href={item.Link2} target="_blank">
                                      {item.Link2}
                                    </a>
                                  </>
                                }
                                {
                                  item.HeadingTitle === "ICICI Direct" || item.HeadingTitle === "Zebull" ? "" : <img src={item.img2} />
                                }


                                {/* <img src={item.img2} /> */}



                                {!item.link3 ? '' : <>

                                  <p className="fw-bold mb-0 mt-3" style={{ color: 'orangered' }}>
                                    NOTE:&nbsp;
                                    <span className="fw-light"> </span>
                                    {/* {link3 ? link3 : ''} */}
                                    Please remember to use the email ID registered on client panel at the place of "YOUR_PANEL_EMAIL".
                                  </p>
                                </>}

                                {!item.link3 ? "" : <>

                                  <p> Example :- </p>
                                  <p>{item.link3 ? item.link3 : ''}</p>
                                </>}

                                {!item.Apicreate ? "" : <>

                                  <p style={{ fontWeight: "bold" }}> Step 3: Create API </p>
                                  <p>{item.Apicreate ? item.Apicreate : ''}</p>
                                </>}


                                <img className="border" src={item.img3}></img><br></br>

                                {!item.describtion1 ? '' : <pre><b>{item.describtion1}</b></pre>}

                                {!item.describtionChoice ? '' : <b>{item.describtionChoice}</b>}<br />
                                {!item.desChoiceStep1 ? '' : <b>{item.desChoiceStep1}</b>}<br />
                                {!item.choiceNote ? '' : <b>{item.choiceNote}</b>}<br />


                                {/* <img className="border" src={item.img3}></img><br></br> */}


                                {/* <p style={{ fontWeight: "bold" }}>For your convenience, we have made these video available for you to watch. </p> */}

                                {!item.youTube ? "" :
                                  <>
                                    <p style={{ fontWeight: "bold" }}>For your convenience, we have made these video available for you to watch. </p>
                                    <a
                                      href={item.youTube}
                                      className=" text-decoration-none ls-1 fw-bold btn btn-danger"
                                      target="_blank"
                                    >

                                      YouTube
                                    </a>
                                  </>
                                }

                              </div>
                            </Modal.Body>
                          </Modal>


                        </>}
                      </>
                    ) : (
                      " "
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
