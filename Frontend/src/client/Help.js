import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import * as Constant from "../common/ConstantMessage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import socketIOClient from "socket.io-client";

const Help = () => {

  // const socket = socketIOClient(Config.base_url);
  const client_id = localStorage.getItem("client_id");
  const client_token = localStorage.getItem('client_token');
  const client_name = localStorage.getItem('client_name');
  console.log("client_name", client_name);

  const [helpUserData, setHelpUserData] = useState("");
  const [msgValue, setMsgValue] = useState("");
  const [mobileNumberErr, setMobileNumberErr] = useState("");
  const [msgErr, setMsgErr] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loader, setLoader] = useState(false);
  const [d, setD] = useState(false);

  const [strategyImage, setStrategyImage] = useState("")
  const [strategyPDF, setStrategyPDF] = useState("")
  const [developmentDescription, setDevelopmentDescription] = useState("")
  const [base64Imageshow, setbase64Imageshow] = useState("")

  useEffect(() => {
    axios({
      url: `${Config.base_url}client/profile`,
      method: "POST",
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      setHelpUserData(res.data.msg);
    });

  }, [refreshscreen]);

  const getMobileNumber = (e) => {
    if (e.target.name === "mobile") {
      setHelpUserData((prevState) => ({
        ...prevState,
        ["mobile"]: e.target.value,
      }));
      setMobileNumberErr("");
    }
  };

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const submitHelpUserData = (e) => {
    e.preventDefault();
    if (helpUserData.mobile === undefined || helpUserData.mobile === "") {
      setMobileNumberErr(Constant.CLIENT_MOBILE);
      return;
    }
    if (helpUserData.mobile.length < 10) {
      setMobileNumberErr("Mobile number should be 10 digit");
      return;
    }

    if (helpUserData.mobile.match(/[a-z]/i)) {
      setMobileNumberErr("Letters are not accepted");
      return;
    }
    if (msgValue === undefined || msgValue === "") {
      setMsgErr(Constant.MESSAGE_ERROR);
      return;
    }

    setD(true);

    axios({
      url: `${Config.base_url}client/helpcenter`,
      method: "POST",
      data: {
        client_id: client_id,
        userData: helpUserData,
        message: msgValue,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      if (res) {
        // socket.emit("message_help_center", helpUserData.username);
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(res.data.msg);
        setMsgValue("");
        setLoader(false);
        setD(false);
      }
      if (res === null || res === undefined || res === "") {
        setD(false);
      }
    });
  };

  const strategyDevelopment = (e) => {
    e.preventDefault();
    // console.log("strategyImage", strategyImage);

    const file = strategyImage;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      // console.log("base64Image", base64Image);

      const pdfReader = new FileReader();
      pdfReader.onload = () => {
        const base64PDF = pdfReader.result;
        // console.log("base64PDF", base64PDF);

        axios({
          url: `${Config.base_url}client/strategy_devlopment`,
          method: "POST",
          data: {
            client_id: client_id,
            client_name: client_name,
            developmentDescription: developmentDescription,
            strategy_image64: base64Image,
            strategy_pdf: base64PDF
          },
          headers: {
            'x-access-token': client_token
          }
        }).then((res) => {
          if (res) {
            setShowAlert(true);
            setAlertColor("success");
            setTextAlert("Strategy Sended Successfully");
            window.location.reload()
          }
        }).catch((error) => {
          if (error) {
            console.log("error", error);
          }
        });
      };
      pdfReader.readAsDataURL(strategyPDF);
    };
    reader.readAsDataURL(file);
  };


  return (
    <>
      <Backdrop
        sx={{ color: "#111", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <section className="content-header">
                <h1>
                  <i />
                  Help Center
                  <small />
                </h1>
              </section>

              <section className="contact-form bg-light-white pt-100 pb-100">
                <div className="container">
                  <div className="row" style={{ marginTop: 30 }}>
                    <div id="error_file" className="text-danger" />
                    <div className="col-lg-12">
                      <form>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group relative mb-30 mb-sm-20">
                              {/* <input name="name" className="form-control input-lg input-white shadow-5" id="name" value=""  > */}
                              <b className="form-control input-lg input-white shadow-5">
                                {helpUserData.username}
                              </b>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group relative mb-30 mb-sm-20">
                              {/* <input type="email" name="email" className="form-control input-lg input-white shadow-5 r" id="email" value={helpUserData.email} /> */}
                              <b className="form-control input-lg input-white shadow-5">
                                {helpUserData.email}
                              </b>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group relative mb-30 mb-sm-20">
                              <input
                                type="text"
                                name="mobile"
                                maxLength="10"
                                className="form-control input-lg input-white shadow-5"
                                id="phone"
                                value={helpUserData.mobile}
                                onChange={(e) => getMobileNumber(e)}
                              />
                            </div>
                            <p style={{ color: "red" }}>{mobileNumberErr}</p>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group relative mb-30 mb-sm-20">
                              <textarea
                                className="form-control input-white shadow-5"
                                name="message"
                                id="message"
                                cols={30}
                                rows={144}
                                placeholder="Your Message"
                                value={msgValue}
                                style={{ height: 144 }}
                                onChange={(e) => {
                                  setMsgValue(e.target.value);
                                  setMsgErr("");
                                }}
                                onKeyPress={(evt) => {
                                  if (evt.key === "Enter") {
                                    evt.preventDefault();
                                    submitHelpUserData(evt);
                                  }
                                }}
                              />
                            </div>
                            <p style={{ color: "red" }}>{msgErr}</p>
                          </div>

                          <div className="col-lg-12 text-center mt-30">
                            <button
                              className="btn btn-color  blob-small"
                              onClick={(e) => submitHelpUserData(e)}
                              disabled={d}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>

              <section className="content-header">
                <h1>
                  <i />
                  Strategy Development
                  <small />
                </h1>
              </section>

              <section className="contact-form bg-light-white pt-100 pb-100">
                <div className="container">
                  <div className="row" style={{ marginTop: 30 }}>
                    <div id="error_file" className="text-danger" />
                    <div className="col-lg-12">
                      <form>
                        <div className="row">

                          <div className="col-md-12">
                            <div className="form-group relative mb-30 mb-sm-20">
                              <textarea
                                className="form-control input-white shadow-5"
                                name="message"
                                id="message"
                                cols={30}
                                rows={144}
                                placeholder="Your Strategy"
                                onChange={(e) => setDevelopmentDescription(e.target.value)}
                                style={{ height: 144 }}
                              />
                            </div>
                            <p style={{ color: "red" }}>{msgErr}</p>
                          </div>

                          <div className="row">
                            <div className="col-lg-5">
                              <label className="text-dark fs-6">Upload Image</label> <br />
                              <input
                                className="form-control"
                                type="file"
                                name="strategy_photo"
                                onChange={(e) => setStrategyImage(e.target.files[0])}
                              />

                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                              <label className="text-dark fs-6">Upload PDF </label> <br />
                              <input
                                className="form-control"
                                type="file"
                                name="strategy_photo"
                                onChange={(e) => setStrategyPDF(e.target.files[0])}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 text-center mt-30">
                            <button className="btn btn-color" onClick={(e) => strategyDevelopment(e)}>
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div>

                      {/* <img src={base64Imageshow} alt="Strategy Development" /> */}

                    </div>
                  </div>
                </div>
              </section>

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
      </div>
    </>
  );
};

export default Help;