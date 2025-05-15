import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as Config from "../common/Config";

const locationname = window.location.host

const Data = [
  {
    id: 1,
    HeadingTitle: "Alice Blue",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    // Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.
    LinkOne: "https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB",
    LinkTwo: `${Config.broker_redirect_url}aliceblue/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `${Config.broker_redirect_url}aliceblue/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get APP code and Secret Key, please Update them on your Profile in this software.',
    youTube: "https://www.youtube.com/watch?v=DEKgwveZ9eM",
    img1: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue2.png",
    img3: "",
  },
  {
    id: 2,
    HeadingTitle: "Zerodha",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    LinkOne: " https://kite.trade/",
    LinkTwo: `${Config.broker_redirect_url}zerodha/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}zerodha/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get API Secret Key and APP code and Update them on your Profile in this software.',
  },
  {
    id: 3,
    HeadingTitle: "Zebull",
    disc1: "",
    disc2: "",
    disc3: "",
    LinkOne: "https://go.mynt.in/#/",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    ZBStep2: "Click on Profile-> You can find a API Key button-> You can see your API Key",
    Apicreate: "Copy that API key and Update it on your Profile in this software.",
    youTube: "https://www.youtube.com/watch?v=wv0MpWirrVs",
    img1: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull2.png",
    img3: "http://app.smartalgo.in/assets/dist/img/Zebull/Zebull3.png",
    // LinkTwo: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
    // describtion1:""
  },
  {
    id: 4,
    HeadingTitle: "5 Paisa",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    LinkOne: "https://invest.5paisa.com/DeveloperAPI/APIKeys",
    LinkTwo: "",
    youTube: "https://www.youtube.com/watch?v=LAzzIWtp79w",
    img1: "http://app.smartalgo.in/assets/dist/img/5paisa/5paisa.png",

    // LinkTwo: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
  },
  {
    id: 5,
    HeadingTitle: "Market Hub",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Please Update CLIENT CODE , PASSWORD CODE And VERIFICATION CODE for all these details please contact with Market hub broker then Submit  And  Login With Api Trading On...",
    // LinkOne: "https://www.5paisa.com/developerapi/authorization",
    // LinkTwo: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
    // Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 6,
    HeadingTitle: "Angel",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    LinkOne: "https://smartapi.angelbroking.com/",
    LinkTwo: `${Config.broker_redirect_url}angelbroking/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}angelbroking/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get API Secret Key and APP code, please Update them on your Profile in this software.',
    youTube: "https://www.youtube.com/watch?v=zI7FX-yUgyw",
    img1: "http://app.smartalgo.in/assets/dist/img/angel/angel1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/angel/angel2.png",
    img3: "http://app.smartalgo.in/assets/dist/img/angel/angel3.png",
  },
  {
    id: 7,
    HeadingTitle: "Master Trust",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    LinkOne: "https://develop-masterswift.mastertrust.co.in/",
    LinkTwo: `${Config.broker_redirect_url}mastertrust/access_token`,
    Apicreate: 'You will get API Secret Key and APP code, please Update them on your Profile in this software.',
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na"

  },
  {
    id: 8,
    HeadingTitle: "Fyers",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    LinkOne: "https://myapi.fyers.in/dashboard/",
    LinkTwo: `${Config.broker_redirect_url}fyers/access_token`,
    Apicreate: 'You will get API Secret Key and APP code, please Update them on your Profile in this software.',
    youTube: "https://www.youtube.com/watch?v=TO2mPpqww34",
    img1: "http://app.smartalgo.in/assets/dist/img/fyers/fyers1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/fyers/fyers2.png",
    img3: "http://app.smartalgo.in/assets/dist/img/fyers/fyers3.png",
  },
  {
    id: 9,
    HeadingTitle: "B2C",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly follow these steps to link your demat account with this Algo Software.",
    B2C: "https://odinconnector.63moons.com/market-place/api?sAppToken=IndiraSecuritiesB2C1070464deef&sTwoWayToken=abc&sPartnerId=01F00F&sTenantId=15",
    youTube: "https://www.youtube.com/watch?v=dVNRHBRxCHg",
    img1: "http://app.smartalgo.in/assets/dist/img/B2C/B2C1.png",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 10,
    HeadingTitle: "Anand Rathi",
    disc1: "",
    disc2: "",
    disc3: "",
    // describtion:
    //   "Please Update SECRET KEY And APP KEY for all these details please contact with Anand Rathi broker then Submit  And Login With Api Trading On...",
    // youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    describtion: "Insert Interactive API",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...',


  },
  {
    id: 11,
    HeadingTitle: "Choice",
    // describtion: "1) Mail to the broker for the live details with the refferal code- PNPINFOTECH ",
    describtion: "",
    describtion3: `2) Subject: Request for Live API Details -------------------------------------------,

    Dear Choice,
    Kindly provide the API live details for trading and market data access from Choice. Refferal code- PNPINFOTECH.Thank you for your assistance.  -------
    Best Regards,`,
    // describtion2: "Update VENDOR ID,USER ID, PASSWORD, VENDOR KEY, ENCRYPTION SECRET KEY And ENCRYPTION KEY that you have received by broker.",
    // youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    // disc1:"1 Mail to the broker for the",
    // disc2:"live details",
    // disc3:"with the refferal code- PNPINFOTECH ",
    describtion2: "Update VENDOR ID,Demate ID, PASSWORD, VENDOR KEY, ENCRYPTION SECRET KEY And ENCRYPTION KEY that you have received by broker.",
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    disc1: "1 Mail to the broker for the",
    disc2: "live details",
    disc3: "with the refferal code- PNPINFOTECH "
  },
  {
    id: 12,
    HeadingTitle: "Mandot",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Please Update USERNAME And PASSWORD for all these details please contact with Mandot broker then Submit And  Login With Api Trading On...",
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na"

  },
  {
    id: 13,
    HeadingTitle: "Motilal Oswal ",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Kindly click on the link given below and  Go to Get Start Button And login Your Account and Next Step is create App Follow Next step and mail To motilal broker.",

    LinkOne: `https://invest.motilaloswal.com/Home/TradingAPI`,

    LinkTwo: `${Config.broker_redirect_url}motilaloswal/access_token?email=YOUR_PANEL_EMAIL`,
    link3: `e.g - ${Config.broker_redirect_url}motilaloswal/access_token?email=ss@gmail.com`,
    Apicreate: 'You will get API Key, please mail the broker(Follow below mail format) to acitvate your API key and update them on your Profile in this software.',

    describtion1: `  To :- tradingapi@motilaloswal.com
    Subject :- Motilal Api Key
    ---------------------------------------------------------------------------
    Hello Sir,

    Please Activate the given API Key for the "Enter Your Client Code" Demat Code.

    1. Api Key :- "Enter Your APIKEY"

    In Reference to "CDPL9786" ID.

    Regards & Thanks

    `,
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    img1: "http://app.smartalgo.in/assets/dist/img/motilal/motilal1.png",
    img2: "http://app.smartalgo.in/assets/dist/img/motilal/motilal2.png",
    img3: "http://app.smartalgo.in/assets/dist/img/motilal/motilal3.png",


  },
  {
    id: 14,
    // HeadingTitle: "Kotak Securities",
    HeadingTitle: locationname === "software.trustalgo.net" ? "Test" : "Kotak Securities",
    disc1: "",
    disc2: "",
    disc3: "",
    // describtion:
    //   "Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software.",
    describtion:
      "Kotak securities do not provide any API information for new clients.",


    // LinkOne: "https://tradeapi.kotaksecurities.com/devportal/apis",

    // Apicreate: 'Login account and click "default application" and next click on the production key in the sidebar and the consumer key and consumer secret update on your profile and demat password and trading API password both update on your profile. The access code generated is sent to the registered email address & mobile number. A generated access code is valid for the day (till 11:59:59 pm on the same day).',
    // img1: "http://app.smartalgo.in/assets/dist/img/kotak/kotak1.png",
    // img3: "http://app.smartalgo.in/assets/dist/img/kotak/kotak2.png",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
    youTube: "https://www.youtube.com/watch?v=DRpbvo2ku8s"
  },
  {
    id: 15,
    HeadingTitle: "IIFL",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      `Step 1: If you are using IIFL broker, fill all user information in the below sheet file and send to
      ttblazesupport@iifl.com`,
    youTube: "https://www.youtube.com/playlist?list=PL3FfWOswH_LhZAcXyiBFCsZ-1PcEzP4Na",
    iifl: "http://app.smartalgo.in/assets/dist/img/iifl/ClientMappinFormat.xls"
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 16,
    HeadingTitle: "Arihant",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion: `To get Api Key and 2FA click below link and after that click on GET API button to get keys, After clicking GET API button you will see this page Login with your User Id and Password.If you cant't login your account or your account is suspended call Arihant support and tell them to Always Activate your Odin Account for API Place Orders.`,
    LinkOne: "https://app-saas.odinconnector.co.in/market-place/api?sAppToken=ArihantB2C1906b23c8b9&sTwoWayToken=abc&sPartnerId=020019&sTenantId=25",
    // Apicreate: `After clicking GET API button you will see this page Login with your User Id and Password.If you cant't login your account or your account is suspended call Arihant support and tell them to Always Activate your Odin Account for API Place Orders.`,
    img1: "http://app.smartalgo.in/assets/dist/img/arihant/arihantgetapi.png",
    // img2: "http://app.smartalgo.in/assets/dist/img/arihant/arihantloginpage.png",
    // Apicreate: 'You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access.'
  },
  {
    id: 17,
    HeadingTitle: "MasterTrust Dealer",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Please Update USER ID, App Key, PASSWORD and Account ID and Vendor Code for all these details please contact with MasterTrust Dealer broker then Submit  And  Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 18,
    HeadingTitle: "Laxmi",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with Laxmi broker then Submit And Login With Api Trading On...",
    // LinkOne: "https://login.fyers.in/?cb=https://apidashboard.fyers.in",
    // LinkTwo: `${Config.broker_redirect_url}fyersapi`,
    //    Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
  },
  {
    id: 19,
    HeadingTitle: "Kotak Neo",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion: "Please Update CONSUMER KEY, CONSUMER SECRET, USERNAME and TRADE API PASSWORD for all these details please contact with Kotak Neo broker then Submit And Login With Api Trading On...",
    LinkOne: "https://neo.kotaksecurities.com/Login",
    img1: "http://app.smartalgo.in/assets/dist/img/kotakneo/kotakneo.png",
    img3: "http://app.smartalgo.in/assets/dist/img/kotak/kotak2.png",
    Apicreate: 'You will get Api Secret Key And App key please Update this detail in your Profile.'
  },
  {
    id: 20,
    HeadingTitle: "Indira XTS",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion:
      "Please Update SECRET KEY and APP KEY for all these details please contact with Indira XTS broker then Submit And Login With Api Trading On...",
  },
  {
    id: 21,
    HeadingTitle: "ICICI Direct",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion: `For SECRET KEY and API KEY click below given link after redirection you want to login your account with your userID and password after login you can generate Keys.`,
    LinkOne: "https://api.icicidirect.com/apiuser/home",
    LinkTwo: `${Config.broker_redirect_url}icicidirect/access_token?email=YOUR_EMAIL_HERE`,
    img1: "http://app.smartalgo.in/assets/dist/img/icicidirect/icicidirectsignup.png",
    img2: "http://app.smartalgo.in/assets/dist/img/icicidirect/iciciredirecturl.png",
    img3: "http://app.smartalgo.in/assets/dist/img/icicidirect/apisecretkey.png",
    Apicreate: 'You will get API KEY and SECRET KEY please Update this detail in your Profile.'
  },
  {
    id: 22,
    HeadingTitle: "Dhan",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion: `For CLIENT ID and ACCESS TOKEN go to your My Profile Dhan and click on "DhanHQ Trading APIs & Access" to generate ACCESS TOKEN and also select 30 days validity to expiry for token, You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access.`,
    LinkOne: "https://dhan.co/",
    // LinkTwo: `${Config.broker_redirect_url}icicidirect/access_token`,
    img1: "http://app.smartalgo.in/assets/dist/img/dhan/dhanaccestoken.png",
    // img2: "http://app.smartalgo.in/assets/dist/img/icicidirect/iciciredirecturl.png",
    // Apicreate: 'You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access.'
  },
  {
    id: 23,
    HeadingTitle: "Swastika",
    describtion:
      `Please Update CLIENT CODE, MPIN  for all these details please contact with Swastika  broker then get TOTP from google authenticator  And then Login With Api Trading On....You can use this link for get TOTP`,
    LinkOne: "https://www.swastika.co.in/",
    Swastika: "Click on Profile-> You can find a API Key button-> You can see your API Key",
    newlink: "https://totp.danhersam.com/",
    // img3:"http://app.smartalgo.in/assets/dist/img/swastika/swastika.png",

  },
  {
    id: 28,
    HeadingTitle: "Upstox",
    disc1: "",
    disc2: "",
    disc3: "",
    describtion: `Click below link to generate API KEY and SECRET KEY after login to below page you will see New App button click on that button and put your Redirect URL in url field and continue after this process you will get your API and SECRET Keys`,
    LinkOne: "https://account.upstox.com/developer/apps",
    LinkTwo: `${Config.broker_redirect_url}upstox/access_token`,
    img1: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxgenerateapikeyandsecretkey.png",
    img2: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxredirecturl.png",
    // Apicreate: 'You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access.'
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

//  For Div Style
const divStyle = {
  // height: "83vh",
  marginTop: "-30px",
  zIndex: "1",
  boxShadow: "box-shadow: 0 1px 15px 1px rgb(39 39 39 / 10%)",
};

const StyleBtn = {
  cursor: "pointer",
  color: "rgb(60, 141, 188)",
  background: "none",
  border: "none",
  fontSize: "18px",
  fontWeight: "500",
};

export default function ApiCreateInformation() {
  const [show, setShow] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getInfo = (e) => {
    const event = e.target.value;
    const Filterdata = Data.filter((item) => {
      if (item.id.toString().includes(event)) {
        return item;
      }
    });
    handleShow(true);
    setFilterValue(Filterdata);
  };

  const { id, HeadingTitle, describtion, Link, Link1, Swastika, LinkOne, LinkTwo, link3, disc1, disc2, disc3, ZBStep2, Apicreate, describtion1, describtion2, describtion3, img1, img2, img3, youTube, B2C, iifl, newlink } = filterValue && filterValue[0];

  // console.log("id", id);

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-12 d-flex flex-column">
            <div
              className=" bg-light w-100 rounded-3 p-3 d-flex flex-column"
              style={divStyle}
            >
              <h5>API Create Information</h5>
              {Data.map((x, i) => {
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="text-dark mx-3 fw-bold" style={{ fontSize: "18px" }}>{x.id}</span>

                      <button
                        key={id}
                        variant="primary"
                        className="text-decoration-Underline mb-1 hover mx-3 bg-light"
                        style={StyleBtn}
                        value={x.id}
                        onClick={(e) => getInfo(e)}
                      >
                        {x.HeadingTitle}
                      </button>
                    </div>
                  </>
                );
              })}
              {locationname == "software.trustalgo.net" && id === 14 ? "" : <>
                <iframe>
                  <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                      <Modal.Title className="my-0 ms-1">
                        {HeadingTitle} API Create Information.
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p
                        className="fw-bold mb-1"
                        style={{ fontSize: "14px", fontWeight: "900" }}
                      >
                        API Process of {HeadingTitle}: - </p>  {describtion === "" ? <><span>{disc1}</span> <b style={{ fontSize: "16px" }}>{disc2}</b> <span>{disc3}</span></> : <p>{describtion}</p>}


                      {id == 32 && (
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


                      {
                        HeadingTitle == "Swastika" ? <>
                          <b>You can use below link to get TOTP and enter YOUR SECRET KEY</b>
                          <br>
                          </br>
                          <a
                            href={newlink}
                            className=" text-decoration-none ls-1"
                            style={{ color: "#3c8dbc" }}
                            target="_blank"
                          >
                            {newlink}
                          </a>
                          

                        </> : ""
                      }

                      {
                        !LinkOne ? "" :
                          <>
                            <p className="fw-bold mb-0">
                              Step 1: &nbsp;
                              <span className="fw-bold">Click below link and Login</span>
                            </p>
                            <a
                              href={LinkOne}
                              className=" text-decoration-none ls-1"
                              style={{ color: "#3c8dbc" }}
                              target="_blank"
                            >
                              {LinkOne}
                            </a>
                            <br />
                            {img1 && (<>
                              <img className="border border-shadow" src={img1} alt="Image Not found"></img> 
                            </>)}
                          </>
                      }
                      {!LinkTwo ? '' : <>
                        <p className="fw-bold mb-0 mt-3">
                          <br></br>
                          <br></br>
                          Step 2: &nbsp;
                          <span className="fw-bold">
                            {id == 32 ? "Click this URL and log in to get the API key, vendor code, and IMEI" : "Enter your Details and the Redirect URL which is given below."}
                          </span>
                        </p>

                        <a
                          href={toString(LinkTwo)}
                          className=" text-decoration-none"
                          style={{ color: "#3c8dbc" }}
                          target="_blank"
                        >
                          {LinkTwo}
                        </a>
                        <br />
                        {img2 && (<img className="border" src={img2} alt="Image Not found"></img>)}<br></br>
                      </>}


                      {!ZBStep2 ? '' : <>
                        <p className="fw-bold mb-0 mt-3 ">
                          Step 2: &nbsp;
                          <span className="fw-Bold">How to find API?</span>
                        </p>
                        <p className="fw-light">
                          {ZBStep2 ? ZBStep2 : ''}
                        </p>
                        <img className="border" src={img2} alt="Image Not found"></img><br></br>
                      </>}
                      {
                        !B2C ? "" :
                          <>
                            <p className="fw-bold mb-0">
                              Step 1: &nbsp;
                              <span className="fw-bold">Click below link and Click on Get API</span>
                            </p>
                            <a
                              href={B2C}
                              className=" text-decoration-none ls-1"
                              style={{ color: "#3c8dbc" }}
                              target="_blank"
                            >
                              https://odinconnector.63moons.com/market-place
                            </a>
                            <img className="border" src={img1} alt="Image Not found"></img><br></br>
                          </>
                      }
                      {
                        !iifl ? "" :
                          <>
                            <p className="fw-bold mb-0">
                              Step 2: &nbsp;
                              <span className="fw-bold">Download the below file. Fill and send it to Broker</span>
                            </p>
                            <a
                              href={iifl}
                              className=" text-decoration-none ls-1 btn btn-info"
                            >
                              Download
                            </a>
                          </>
                      }

                      {!link3 ? '' : <>

                        <p className="fw-bold mb-0 mt-3" style={{ color: 'orangered' }}>
                          NOTE:&nbsp;
                          <span className="fw-light"></span>
                          Please remember to use the email ID registered on client panel at the place of "YOUR_PANEL_EMAIL".
                        </p>
                      </>}
                      {!Apicreate ? '' : <>
                        <p className="fw-bold mb-0 mt-3 ">
                          Step 3: &nbsp;
                          <span className="fw-bold">Create API</span>
                        </p>
                        <p className="light-bold">
                          {Apicreate ? Apicreate : ''}

                        </p>
                        <img className="border" src={img3} alt="Image Not found"></img><br></br>

                      </>}
                      <p> {describtion3}</p>
                      <b> {describtion1}</b>
                      <b> {describtion2}</b> <br />
                      <b>For your convenience, we have made these videos available for you to watch.</b><br />


                    </Modal.Body>
                  </Modal>
                </iframe>
              </>}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
