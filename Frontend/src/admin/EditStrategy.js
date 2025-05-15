import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import * as Config from '../common/Config';
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';

export default function EditStrategy() {

  const g_id = useParams();
  const [Qty, setQty] = useState("");
  // console.log("fffff", Qty);
  const [QtyErr, setQtyErr] = useState("");
  const [strategyName, setStrategyName] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [emptyStrategy, setEmptyStrategy] = useState("");

  const [enterDescription, setEnterDescription] = useState("")
  console.log("enterDescription", enterDescription);
  const [enterDescriptionErr, setEnterDescriptionErr] = useState("")

  const navigate = useNavigate();

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const StrategyNameById = () => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/strategyname`,
      data: { 'adminId': adminId, 'strat_id': g_id.id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {
      setStrategyName(res.data.Strat_Name)
      setQty(res.data.quantity)
      setEnterDescription(res.data.description)
    })
  }

  useEffect(() => {
    StrategyNameById()
  }, [])


  // const AddStrategy = (e) => {
  //   if (strategyName === "") {
  //     setEmptyStrategy(Constant.EMPTY_STRATEGY_ERROR_MESSAGE);
  //     return;
  //   }}

  const Updatestrategy = () => {
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
      url: `${Config.base_url}admin/strategy/update`,
      data: {
        'adminId': adminId,
        'strat_id': g_id.id,
        'StrategyName': strategyName,
        'enterDescription': enterDescription
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {
      if (res.data.status == false) {
        setShowAlert(true);
        setTextAlert(res.data.services);
        setAlertColor("error");
        return
      } else {
        setShowAlert(true);
        setTextAlert(Constant.STRATGY_UPDATED_SUCCESS);
        setAlertColor('success')
        setTimeout(() => navigate("/admin/strategy"), 1000)
      }
    })
  }

  const onAlertClose = e => {
    setShowAlert(false);
  }

  return <>
    <div className="content">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="title">Edit Strategy</h5>
            </div>
            <div className="back-button  d-flex justify-content-end mx-3" style={{ marginTop: '-53px' }}>
              <NavLink
                to="/admin/strategy"
                className="btn btn-color"
              >
                <i class="fa fa-arrow-left mx-1" aria-hidden="true" data-toggle="tooltip"
                  data-placement="top"
                  title="Back"

                ></i> Back
              </NavLink>

            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-10 pr-1">
                    <div className="form-group">
                      <label>Enter Strategy Name</label>
                      <input type="text"
                        value={strategyName}
                        onChange={(e) => { setStrategyName(e.target.value) }}
                        className="form-control" placeholder="Strategy Name" />
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
                        defaultValue={enterDescription}
                        onChange={(e) => {
                          setEnterDescription(e.target.value);
                          setEnterDescriptionErr("")
                        }}
                        className="form-control" placeholder="Strategy Name" />
                    </div>
                    <p className="text-danger">

                      {enterDescriptionErr && enterDescriptionErr}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-10 pr-1">
                    <button type="button"
                      onClick={(e) => { Updatestrategy(e) }}
                      className="btn btn-color">Update</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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
  </>;
}
