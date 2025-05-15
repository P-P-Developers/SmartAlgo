// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import axios from "axios";
// import { NavLink, useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
// import * as Config from "../common/Config";
// import Accordion from 'react-bootstrap/Accordion';
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
// import ExportToExcel from "../common/ExportToExport";
// import AlertToast from "../common/AlertToast";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { dateFormate } from "../common/CommonDateFormate";

// const TradeExecutionDetails = () => {

//     const [tradeExecutionApi, setTradeExecutionApi] = useState([])
//     const [tradeExecutionApi1, setTradeExecutionApi1] = useState([])

//     // console.log("tradeExecutionApi", tradeExecutionApi);

//     const brokerName = (id) => {
//         if (id === 0 || id == "") {
//             return "Demo";
//         } else {
//             switch (id) {
//                 case "1":
//                     return "AliceBlue";
//                     break;
//                 case "2":
//                     return "Zerodha";
//                     break;
//                 case "3":
//                     return "Zebull";
//                     break;
//                 case "4":
//                     return "Angel";
//                     break;
//                 case "5":
//                     return "5 paisa";
//                     break;
//                 case "6":
//                     return "Fyers";
//                     break;
//                 case "7":
//                     return "Indira ";
//                     break;
//                 case "8":
//                     return "TradeSmartapi";
//                     break;
//                 case "9":
//                     return "MarketHub";
//                     break;
//                 case "10":
//                     return "MasterTrust";
//                     break;
//                 case "11":
//                     return "B2C";
//                     break;
//                 case "12":
//                     return "MotilalOswal";
//                     break;
//                 case "13":
//                     return "AnandRathi";
//                     break;
//                 case "14":
//                     return "Choice";
//                     break;
//                 case "15":
//                     return "Mandot";
//                     break;
//             }
//         }
//     };

//     const executionDetails = () => {
//         var config = {
//             method: 'get',
//             url: `${Config.base_url}admin/trade/execution`,
//             headers: {
//                 // 'x-access-token': admin_token
//             }
//         };
//         axios(config)
//             .then(function (response) {
//                 // console.log("response details", response.data);
//                 setTradeExecutionApi(response.data.tradeExecution)
//                 setTradeExecutionApi1(response.data.tradeExecution1)

//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     useEffect(() => {
//         executionDetails()
//     }, [])

//     const getSymbolName = (symbol) => {
//         var splitSymbol = symbol.split(":")[2]
//         var splitSymbol2 = splitSymbol.split(",")[0]
//         var splitSymbol3 = splitSymbol2.split('"')[0]
//         return splitSymbol3
//     }

//     const getType = (type) => {
//         var gettype = type.split('"')[5]
//         var gettype1 = gettype.split(":")[1]
//         return gettype1
//     }

//     const getPrice = (price) => {
//         var getPrice = price.split(":")[4]
//         var getPrice2 = getPrice.split('"')[0]
//         return getPrice2
//     }

//     const getStrategy = (strat) => {
//         var getStrat = strat.split(":")[15]
//         var getStrat1 = getStrat.split('"')[0]
//         return getStrat1
//     }

//     const getTradingSymbol = (tradesym) => {
//         var getSym = tradesym.split('"')[5]
//         var getSym1 = getSym.split(":")[1]
//        return getSym1
//     }

//     return (
//         <>
//             <div className="content">
//                 <div className="row">
//                     <div className="col-md-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <h4 className="card-title">Trade Executive Details</h4>
//                                 <div className="row">
//                                     <div className="col-md-3"></div>
//                                 </div>
//                             </div>

//                             <div className="row d-flex justify-content-end mx-auto">
//                                 <div className="card-body mx-auto">
//                                 <table className="table">
//                                 <thead className="tablecolor py-3 traderexecutive-head">
//                 <td className="float-left col-md-1 col-sm-2 ms-2">S No.</td>
//                 <td className=" col-2 text-center">Time</td>
//                 <td className=" col-2 text-end">Trading Symbol</td>
//                 <td className=" col-2 text-end">Type</td>
//                 <td className=" col-2 text-center">Strategy Tag</td>
//                 <td className=" col-2 text-center">Price</td>
//                 <td className=" col-2 text-center">Order Status</td>
//                 <td className="text-end col-2 pe-3 ">View</td>
//             </thead>
//                                 </table>
//                                     <div className="table-responsive mx-auto">

//                                     {/* <thead className="">
//                 <td className="float-left col-md-2 col-sm-2 ms-2">Trading Symbol</td>
//                 <td className=" col-2 text-center">Broker</td>
//                 <td className=" col-2 text-end">Trading Status</td>
//                 <td className=" col-2 text-center">Time</td>
//                 <td className=" col-2 text-center">Order Status</td>
//                 <td className="text-end col-2 pe-3 ">View</td>
//             </thead> */}

//             {/* <div className="row" style={{"width":"1100px !important"}}> */}
//             <td style={{width:'40%'}}>
//                 {tradeExecutionApi.map((x, index) => {
//                     const {
//                         id,
//                         username,
//                         symbol,
//                         receive_signal,
//                         created_at,
//                         broker,
//                         order_status,
//                         trading_status
//                     } = x;

//                     return (
//                         <>
//                             <Accordion className='m-0' style={{ }} >
//                                 <Accordion.Item eventKey={index}>
//                                     <Accordion.Header>
//                                         <th className="col-1">
//                                             {index + 1}
//                                         </th>
//                                         <th className="col-2 text-center">
//                                         {dateFormate(created_at)}
//                                     </th>

//                                     <th className="col-2 text-center">
//                                          {getSymbolName(receive_signal)}
//                                      </th>

//                                     <th className="col-2 text-center">
//                                          {getTradingSymbol(receive_signal)}
//                                      </th>
//                                         <th className="col-2 text-center">
//                                             {getStrategy(receive_signal)}
//                                         </th>
//                                         <th className="col-2 text-center">
//                                             {getPrice(receive_signal)}
//                                         </th>

//                                         <th className="col-2 text-center">
//                                             {order_status == null ? "-" : order_status}
//                                         </th>
//                                     </Accordion.Header>
//                                     <Accordion.Body>
//                                         <div className="table-responsive mx-auto">
//                                             <table className="table w-100 tradeexecutive-table">
//                                                 <>
//                                                     <tbody>
//                                                         <tr>
//                                                             <td colSpan="2" className="test1">
//                                                                 Received Signal
//                                                             </td>
//                                                             <td
//                                                                 width="55"
//                                                                 className="test"
//                                                             // catagory={receive_signal}
//                                                             >
//                                                                 {receive_signal}
//                                                             </td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </>
//                                             </table>

//                                             <Accordion className="mt-0">
//  {
//     tradeExecutionApi1.map((val,index)=>{

//   if(val.receive_signal == receive_signal){

//     return  <Accordion.Item eventKey={index}>
//     <Accordion.Header>
//     <th className="col-1">
//     {val.username}
//     </th>

//     <th className="col-2 text-center">
//     {brokerName(broker)}
//     </th>

//     <th className="col-2 text-center">
//     {val.trading_status}
//     </th>
//     <th width="55" className="test">
//                   {order_status == null ? "-" : order_status}
//                   </th>
//     </Accordion.Header>
//     <Accordion.Body>
//     <table className=" table w-100 tradeexecutive-table">
//       <>
//           <tbody>

//               {/* <tr>
//                   <td colSpan="2" className="text-center">
//                       Broker
//                   </td>
//                   <td>{brokerName(broker)}</td>
//               </tr> */}

//               {/* <tr>
//                   <td colSpan="2" className="text-center"  >
//                       Status
//                   </td>
//                   <td width="55" className="test">
//                   {order_status == null ? "-" : order_status}
//                   </td>
//               </tr> */}

//               <tr>
//                   <td colSpan="1" className="text-center">
//                       Reason
//                   </td>
//                   <td>{val.reject_reason == null ? "-":val.reject_reason }</td>
//               </tr>

//           </tbody>
//       </>
//   </table>
//     </Accordion.Body>
//   </Accordion.Item>
//   }
//     })
//  }

//                                           </Accordion>
//                                         </div>
//                                     </Accordion.Body>
//                                 </Accordion.Item>
//                             </Accordion>
//                         </>
//                     )
//                 })}
//             </td>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>

//             {/* </div> */}
//             {/* </tbody> */}
//         </>

//     )
// }

// export default TradeExecutionDetails

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Accordion from "react-bootstrap/Accordion";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { dateFormate } from "../common/CommonDateFormate";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const TradeExecutionDetails = () => {
  
  const [tradeExecutionApi, setTradeExecutionApi] = useState([]);
  const [tradeExecutionApi1, setTradeExecutionApi1] = useState([]);
  const [LXArray, setLXArray] = useState([]);
  // console.log("LXArray", LXArray);
  const [LEArray, setLEArray] = useState([]);
  const [filterData, setFilterData] = useState("ON");
  const [refreshscreen, setRefreshscreen] = useState(true);

  //   Tab key
  const [key, setKey] = useState("home");

  const brokerName = (id) => {
    console.log("id", id);

    if (id === 0 || id == "") {
      return "Demo";
    } else {
      switch (id) {
        case "1":
          return "AliceBlue";
          break;
        case "2":
          return "Zerodha";
          break;
        case "3":
          return "Zebull";
          break;
        case "4":
          return "Angel";
          break;
        case "5":
          return "5 paisa";
          break;
        case "6":
          return "Fyers";
          break;
        case "7":
          return "Indira ";
          break;
        case "8":
          return "TradeSmartapi";
          break;
        case "9":
          return "MarketHub";
          break;
        case "10":
          return "MasterTrust";
          break;
        case "11":
          return "B2C";
          break;
        case "12":
          return "MotilalOswal";
          break;
        case "13":
          return "AnandRathi";
          break;
        case "14":
          return "Choice";
          break;
        case "15":
          return "Mandot";
          break;
        case "16":
          return "Kotak";
          break;
        case "17":
          return "Upstox";
          break;
        case "18":
          return "IIFL";
          break;
        case "19":
          return "Arihant";
          break;
        case "20":
          return "MasterTrust Dealer";
          break;
      }
    }
  };

  // const tradingStatus = (e) => {
  //   let tradingstatus = LEArray.filter((item) => {
  //     if (item.trading_status === e.target.value) {
  //       return item;
  //     }
  //   });
  //   // console.log("=>", tradingstatus);
  //   return setLEArray(tradingstatus);
  // };

  const executionDetails = () => {
    var config = {
      method: "get",
      url: `${Config.base_url}admin/trade/execution`,
      headers: {
        // 'x-access-token': admin_token
      },
      // data: {
      //   trating_type: TradingType
      // }
    };
    axios(config)
      .then(function (response) {
        var lxarr = [];
        var learr = [];
        response.data.tradeExecution.filter((item) => {
          if (item.receive_signal.includes("LX")) {
            lxarr.push(item);
            let abc = lxarr.filter((item) => {
              return item.trading_status.includes(filterData);
            });
            return setLXArray(abc);
            // return setLXArray(lxarr);
          } else if (item.receive_signal.includes("LE")) {
            learr.push(item);

            let abc = learr.filter((item) => {
              return item.trading_status.includes(filterData);
            });
            return setLEArray(abc);
          }
        });

        setTradeExecutionApi(response.data.tradeExecution);
        setTradeExecutionApi1(response.data.tradeExecution1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    executionDetails();
  }, [filterData, refreshscreen]);

  // trading ilter

  // const tradingStatus = async (e) => {
  //   //  console.log("e.target.value" ,e.target.value);

  //   let tradingstatus = LEArray.filter((item) => {
  //     return item.trading_status.includes(filterData);
  //   });

  //   console.log("hello world", tradingstatus);

  //   setLEArray(tradingstatus);
  // };

  useEffect(() => {
    // tradingStatus();
  }, [filterData]);

  const getSymbolName = (symbol) => {
    var splitSymbol = symbol.split(":")[2];
    var splitSymbol2 = splitSymbol.split(",")[0];
    var splitSymbol3 = splitSymbol2.split('"')[0];
    return splitSymbol3;
  };

  const getType = (type) => {
    var gettype = type.split('"')[5];
    var gettype1 = gettype.split(":")[1];
    return gettype1;
  };

  const getPrice = (price) => {
    var getPrice = price.split(":")[4];
    var getPrice2 = getPrice.split('"')[0];
    return getPrice2;
  };

  const getStrategy = (strat) => {
    var getStrat = strat.split(":")[15];
    var getStrat1 = getStrat.split('"')[0];
    return getStrat1;
  };

  const getTradingSymbol = (tradesym) => {
    var getSym = tradesym.split('"')[5];
    var getSym1 = getSym.split(":")[1];
    return getSym1;
  };

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Trade Executive Details</h4>
                <div className="row">
                  <div className="col-md-3"></div>
                </div>
              </div>

              <div className="row d-flex justify-content-end mx-auto">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab
                    eventKey="home"
                    title="All Entry"
                    style={{ width: "0 !important" }}
                  >
                    <div className="col-md-3">
                      <div className="form-group">
                        <label style={{ fontWeight: "bold", color: "black" }}>
                          Trading Status
                        </label>
                        <select
                          name="clienttype"
                          onChange={(e) => {
                            setFilterData(e.target.value);
                          }}
                          class="form-control"
                        >
                          <option value="ON" selected>
                            Trading On
                          </option>
                          <option value="Trading OFF">Trading Off</option>
                        </select>
                      </div>
                    </div>
                    <table className="table">
                      <thead className="tablecolor py-3 traderexecutive-head">
                        <td className="float-left col-md-1 col-sm-2 ms-2">
                          S No.
                        </td>
                        <td className="text-center" style={{ width: "16.33%" }}>Time</td>
                        <td className="text-center" style={{ width: "13%" }}>Trading Symbol</td>
                        <td className="text-center" style={{ width: "18.93%" }}>Type</td>
                        <td className="text-center" style={{ width: "16.33%" }}>Strategy Tag</td>
                        <td className="text-center" style={{ width: "12.93%" }}>Price</td>
                        <td className="text-center" style={{ width: "16.33%" }}>Order Status</td>
                        <td className="text-center col-2  pe-3 " style={{ width: "16.33%" }}>View</td>
                      </thead>
                    </table>{" "}
                    <td style={{ width: "40%" }}>
                      {LEArray?.map((x, index) => {
                        const {
                          id,
                          username,
                          symbol,
                          receive_signal,
                          created_at,
                          broker,
                          order_status,
                          trading_status,
                        } = x;

                        return (
                          <>
                            <Accordion className="m-0" style={{}}>
                              <Accordion.Item eventKey={index}>
                                <Accordion.Header>
                                  <th className="col-1">{index + 1}</th>
                                  <th className=" text-center d-block" style={{ width: "16.33%" }}>
                                    {dateFormate(created_at)}
                                  </th>

                                  <th className="text-center" style={{ width: "16.33%" }}>
                                    {getSymbolName(receive_signal)}
                                  </th>

                                  <th className="text-center" style={{ width: "16.33%" }}>
                                    {getTradingSymbol(receive_signal)}
                                  </th>
                                  <th className="text-center" style={{ width: "16.33%" }}>
                                    {getStrategy(receive_signal)}
                                  </th>
                                  <th className="text-center" style={{ width: "16.33%" }}>
                                    {getPrice(receive_signal)}
                                  </th>

                                  <th className="text-center" style={{ width: "16.33%" }}>
                                    {order_status == null ? "-" : order_status}
                                  </th>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div className="table-responsive mx-auto">
                                    <table className="table w-100 tradeexecutive-table">
                                      <>
                                        <tbody>
                                          <tr>
                                            <td colSpan="2" className="test1">
                                              Received Signal
                                            </td>
                                            <td
                                              width="55"
                                              className="test"
                                            // catagory={receive_signal}
                                            >
                                              {receive_signal}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </>
                                    </table>

                                    <Accordion className="mt-0">
                                      {tradeExecutionApi1.map((val, index) => {
                                        if (
                                          val.receive_signal == receive_signal
                                        ) {
                                          return (
                                            <Accordion.Item eventKey={index}>
                                              <Accordion.Header>
                                                <th className="col-1">
                                                  {val.username}
                                                </th>

                                                <th className="col-2 text-center">
                                                  {brokerName(val.broker)}
                                                </th>

                                                <th className="col-2 text-center">
                                                  {val.trading_status}
                                                </th>
                                                <th width="55" className="test">
                                                  {order_status == null
                                                    ? "-"
                                                    : order_status}
                                                </th>
                                              </Accordion.Header>
                                              <Accordion.Body>
                                                <table className=" table w-100 tradeexecutive-table">
                                                  <>
                                                    <tbody>
                                                      {/* <tr>
                  <td colSpan="2" className="text-center">
                      Broker
                  </td>
                  <td>{brokerName(broker)}</td>
              </tr> */}

                                                      {/* <tr>
                  <td colSpan="2" className="text-center"  >
                      Status
                  </td>
                  <td width="55" className="test">
                  {order_status == null ? "-" : order_status}
                  </td>
              </tr> */}

                                                      <tr>
                                                        <td
                                                          colSpan="1"
                                                          className="text-center"
                                                        >
                                                          Reason
                                                        </td>
                                                        <td>
                                                          {val.reject_reason ==
                                                            null
                                                            ? "-"
                                                            : val.reject_reason}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </>
                                                </table>
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          );
                                        }
                                      })}
                                    </Accordion>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </>
                        );
                      })}
                    </td>
                  </Tab>
                  <Tab
                    eventKey="profile"
                    title="All Exit"
                    style={{ width: "0 !important" }}
                  >
                    <div className="col-md-3">
                      <div className="form-group">
                        <label style={{ fontWeight: "bold", color: "black" }}>
                          Trading Status
                        </label>
                        <select
                          name="clienttype"
                          //   value={csubadmin}
                          onChange={(e) => {
                            //  tradingStatus(e);
                            setFilterData(e.target.value);

                          }}
                          class="form-control"
                        >
                          {/* <option value="">All</option> */}
                          <option value="ON">Trading On</option>
                          <option value="Trading OFF">Trading Off</option>
                        </select>
                      </div>
                    </div>
                    <table className="table">
                      <thead className="tablecolor py-3 traderexecutive-head">
                        <td className="float-left col-md-1 col-sm-2 ms-2">
                          S No.
                        </td>
                        <td className=" col-2 text-center">Time</td>
                        <td className=" col-2 text-end">Trading Symbol</td>
                        <td className=" col-2 text-end">Type</td>
                        <td className=" col-2 text-center">Strategy Tag</td>
                        <td className=" col-2 text-center">Price</td>
                        <td className=" col-2 text-center">Order Status</td>
                        <td className="text-end col-2 pe-3 ">View</td>
                      </thead>
                    </table>{" "}
                    <td style={{ width: "40%" }}>
                      {LXArray.map((x, index) => {
                        {/* { console.log("x", x) } */ }
                        const { id, username, symbol, receive_signal, created_at, broker, order_status, trading_status, } = x;

                        return (
                          <>
                            <Accordion className="m-0" style={{}}>
                              <Accordion.Item eventKey={index}>
                                <Accordion.Header>
                                  <th className="col-1">{index + 1}</th>
                                  <th className="col-2 text-center">
                                    {dateFormate(created_at)}
                                  </th>

                                  <th className="col-2 text-center">
                                    {getSymbolName(receive_signal)}
                                  </th>

                                  <th className="col-2 text-center">
                                    {getTradingSymbol(receive_signal)}
                                  </th>
                                  <th className="col-2 text-center">
                                    {getStrategy(receive_signal)}
                                  </th>
                                  <th className="col-2 text-center">
                                    {getPrice(receive_signal)}
                                  </th>

                                  <th className="col-2 text-center">
                                    {order_status == null ? "-" : order_status}
                                  </th>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div className="table-responsive mx-auto">
                                    <table className="table w-100 tradeexecutive-table">
                                      <>
                                        <tbody>
                                          <tr>
                                            <td colSpan="2" className="test1">
                                              Received Signal
                                            </td>
                                            <td
                                              width="55"
                                              className="test"
                                            // catagory={receive_signal}
                                            >
                                              {receive_signal}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </>
                                    </table>

                                    <Accordion className="mt-0">
                                      {tradeExecutionApi1.map((val, index) => {
                                        if (
                                          val.receive_signal == receive_signal
                                        ) {
                                          return (
                                            <Accordion.Item eventKey={index}>
                                              <Accordion.Header>
                                                <th className="col-1">
                                                  {val.username}
                                                </th>

                                                <th className="col-2 text-center">
                                                  {brokerName(val.broker)}
                                                </th>

                                                <th className="col-2 text-center">
                                                  {val.trading_status}
                                                </th>
                                                <th width="55" className="test">
                                                  {order_status == null
                                                    ? "-"
                                                    : order_status}
                                                </th>
                                              </Accordion.Header>
                                              <Accordion.Body>
                                                <table className=" table w-100 tradeexecutive-table">
                                                  <>
                                                    <tbody>
                                                      {/* <tr>
                  <td colSpan="2" className="text-center">
                      Broker
                  </td>
                  <td>{brokerName(broker)}</td>
              </tr> */}

                                                      {/* <tr>
                  <td colSpan="2" className="text-center"  >
                      Status
                  </td>
                  <td width="55" className="test">
                  {order_status == null ? "-" : order_status}
                  </td>
              </tr> */}

                                                      <tr>
                                                        <td
                                                          colSpan="1"
                                                          className="text-center"
                                                        >
                                                          Reason
                                                        </td>
                                                        <td>
                                                          {val.reject_reason ==
                                                            null
                                                            ? "-"
                                                            : val.reject_reason}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </>
                                                </table>
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          );
                                        }
                                      })}
                                    </Accordion>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </>
                        );
                      })}
                    </td>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* </div> */}
      {/* </tbody> */}
    </>
  );
};

export default TradeExecutionDetails;
