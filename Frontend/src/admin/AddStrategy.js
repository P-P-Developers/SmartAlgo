import React, { useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { NavLink, useNavigate } from "react-router-dom";

const Addstrategy = () => {
  const [strategyName, setStrategyName] = useState("");
  const [Qty, setQty] = useState("");
  const [QtyErr, setQtyErr] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [emptyStrategy, setEmptyStrategy] = useState();
  const [enterDescription, setEnterDescription] = useState("")
  const [enterDescriptionErr, setEnterDescriptionErr] = useState("")
  console.log("enterDescription", enterDescription);

  const navigate = useNavigate();

  const adminId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const onchange = () => {
    setEmptyStrategy(" ");
    setEnterDescriptionErr(" ")
  };

  const AddStrategy = (e) => {
    if (strategyName === "") {
      setEmptyStrategy(Constant.EMPTY_STRATEGY_ERROR_MESSAGE);
      return;
    }

    if (enterDescription === "") {
      setEnterDescriptionErr("Please Enter Description");
      return;
    }

    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/add`,
      data: {
        adminId: adminId,
        strategy: strategyName,
        enterDescription: enterDescription
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("response", response);
      if (response.data.status == false) {
        setShowAlert(true);
        setTextAlert(response.data.services);
        setAlertColor("error");
        return
      } else {
        setShowAlert(true);
        setTextAlert(Constant.STRATGY_ADDED_SUCCESS);
        setAlertColor("success");
        setTimeout(() => navigate("/admin/strategy"), 1000)
      }
    });
  };

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              {/* <div className="row">  */}
              <div className="card-header">
                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>
                      Add Strategy
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right d-flex justify-content-end">
                      <NavLink
                        to="/admin/strategy"
                        className="btn btn-color d-flex justify-content-end"
                      ><i class="fa fa-arrow-left mx-1" aria-hidden="true" data-toggle="tooltip"
                        data-placement="top"
                        title="Back"
                      ></i> Back
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* </div> */}
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <div className="form-group">
                        <label>Enter Strategy Name</label>
                        <input
                          type="text"
                          onChange={(e) => {
                            setStrategyName(e.target.value);
                            onchange(e);
                          }}
                          className="form-control"
                          placeholder="Strategy Name"
                          autoComplete="off"
                        />
                      </div>
                      <p className="text-danger">
                        {emptyStrategy && emptyStrategy}
                      </p>
                    </div>

                    <div className="col-md-10 pr-1">
                      <div className="form-group">
                        <label>Enter Description</label>
                        <textarea
                          type="text"
                          rows="4"
                          cols="50"
                          onChange={(e) => {
                            setEnterDescription(e.target.value);
                            setEnterDescriptionErr("")
                          }}
                          className="form-control"
                          // placeholder="Strategy Name"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <p className="text-danger"> {enterDescriptionErr && enterDescriptionErr} </p>
                  </div>


                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          AddStrategy(e);
                        }}
                        className="btn btn-color btn-block"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
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
};

export default Addstrategy;
