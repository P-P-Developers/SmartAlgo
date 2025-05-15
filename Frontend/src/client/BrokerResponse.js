import React, { useState, useEffect } from "react";
import _ from 'lodash';
import axios from "axios";
import { dateFormate } from "../common/CommonDateFormate";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";

const BrokerResponse = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");


  const ClientId = localStorage.getItem("client_id");
  const client_token = localStorage.getItem('client_token');

  const [brokerDetails, setBrokerDetails] = useState([]);

   console.log("brokerDetails",brokerDetails  && brokerDetails)
  // console.log("ClientId",ClientId)

  const [serchfilter, setSerchfilter] = useState("");

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  useEffect(() => {
    axios({
      method: "post",
      url: `${Config.base_url}client/broker-response`,
      data: { client_id: ClientId },
      headers: {
        'x-access-token': client_token
      }
    }).then(function (response) {
     
      const groups = _.groupBy(response.data.msg, 'signals_broker_response_id');
      // console.log('groups   -', groups);
      var brokerResponseArray = [];
      // for(var x in groups){
      Object.values(groups).map((val, v) => {

         //console.log("inner", val);
        val.map((item, index) => {
          brokerResponseArray.push({
            id: `${v + 1}.${index}`,
            symbol: item.symbol,
            send_request: item.send_request,
            order_id: item.order_id,
            order_status: item.order_status,
            reject_reason: item.reject_reason,
            created_at: item.created_at,
            status: item.status
          })
        })
      })

      // }
      //console.log("brokerResponseArray", brokerResponseArray);

      setBrokerDetails(response.data.msg);
      setSerchfilter(response.data.msg);
    });
  }, []);

  const filterData = (e) => {
    var searchData = serchfilter.filter((item) => {
      if (
        item.symbol
          .toLowerCase()
          .toString()
          .includes(e.toLowerCase().toString()) ||
        item.order_status
          .toLowerCase()
          .toString()
          .includes(e.toLowerCase().toString()) ||
        item.send_request
          .toLowerCase()
          .toString()
          .includes(e.toLowerCase().toString()) ||
        item.order_id
          .toLowerCase()
          .toString()
          .includes(e.toLowerCase().toString()) ||
        item.reject_reason
          .toLowerCase()
          .toString()
          .includes(e.toLowerCase().toString())
      ) {
        return item;
      }
    });

    setBrokerDetails(searchData);
  };

  var count = 1;

  const getAllOrderHistoryStatus = (e) => {
    
    axios({
      method: "post",
      url: `${Config.base_url}client/broker-response/getHistoryOrder`,
      data: { client_id: ClientId },
      headers: {
        'x-access-token': client_token
      }
    }).then(function (response) {

       console.log('response   -', response.data.status);
       if(response.data.status){
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(response.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 1500); // 2000 milliseconds = 2 seconds delay
      
       }else{
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert(response.data.msg);
      
       }

   
    });
    

  }




  return (
    <>
    <div>
      <div
        className="container-fluid"
        style={{ marginTop: "-25px", height: "82.9vh" }}
      >
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex ">
                  <h4 className="card-title">Broker Response</h4>
                  <input
                    type="text"
                    placeholder="Filter Table"
                    className="mt-5 mx-4 form-control"
                    onChange={(e) => filterData(e.target.value)}
                    style={{ width: "200px" }}
                  />      
                     
                     {
                      brokerDetails.length !== 0?
                      brokerDetails[0].broker_enter == "ANGEL"? 
                      brokerDetails.find(val => val.status === 0)?
                      <button
                      className="btn btn-color  blob-small float-end"
                      style={{
                        marginRight:'50px'
                      }}
                      onClick={(e) => getAllOrderHistoryStatus(e)}
                     >
                      Refresh
                     </button>
                      :""
                      :""
                      :""
                     }

                 </div>

                  <div className="row">

                    <div className="d-flex ">
                      {brokerDetails.length !== 0 ? (
                        <>
                          <div className="table-responsive mx-auto mt-5">
                            <table class="table-responsive table">
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    colSpan="2"
                                    className="text-center"
                                  >
                                    Title
                                  </th>
                                  <th
                                    scope="col"
                                    colSpan="3"
                                    className="text-center"
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>

                              {brokerDetails.map((x) => {
                                const {
                                  created_at,
                                  order_status,
                                  reject_reason,
                                  send_request,
                                  order_id,
                                  symbol,
                                  receive_signal,
                                  trading_status,
                                  broker_enter,
                                  token_symbol,
                                  open_possition_qty
                                } = x;
                                return (
                                  <>
                                    <tbody>
                                      <tr style={{ backgroundColor: "green", color: "white" }}>
                                        <th
                                          scope="row"
                                          colSpan="2"
                                          className="text-center"
                                          width="55"
                                        >
                                          {count++}
                                        </th>

                                        <td width="55" colSpan="2">
                                          {symbol}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="test1">
                                          Received Signal
                                        </td>
                                        <td
                                          width="55"
                                          className="test"
                                          catagory={receive_signal}
                                        >
                                          {receive_signal}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Trading Status
                                        </td>
                                        <td>{trading_status}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Broker
                                        </td>
                                        <td>{broker_enter}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Token Symbol
                                        </td>
                                        <td>{token_symbol}</td>
                                      </tr>

                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Open Position Quantity
                                        </td>
                                        <td>{open_possition_qty}</td>
                                      </tr>

                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Broker Request
                                        </td>
                                        <td>{send_request}</td>
                                      </tr>

                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Order Id
                                        </td>
                                        <td>{order_id}</td>
                                      </tr>

                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Broker Status
                                        </td>
                                        <td>{order_status}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Broker Reason
                                        </td>
                                        <td>{reject_reason}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="text-center">
                                          Time
                                        </td>
                                        <td>{dateFormate(created_at)}</td>
                                      </tr>
                                    </tbody>
                                  </>
                                );
                              })}
                            </table>
                          </div>
                        </>
                      ) : (
                        <h5
                          className="mx-auto align-items-center d-flex"
                          style={{ height: "50vh" }}
                        >
                          {" "}
                          No Data{" "}
                        </h5>
                      )}
                    </div>
                  </div>
                
              </div>
            </div>
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
    </>
  );
};

export default BrokerResponse;
