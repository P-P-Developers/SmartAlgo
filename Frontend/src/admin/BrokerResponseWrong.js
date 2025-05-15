import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Accordion from 'react-bootstrap/Accordion';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { dateFormate } from "../common/CommonDateFormate";


const BrokerResponseWrong = () => {

  const [tradeExecutionApi, setTradeExecutionApi] = useState([])
  // console.log("tradeExecutionApi", tradeExecutionApi);

  const brokerName = (id) => {
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
      }
    }
  };

  const executionDetails = () => {
    var config = {
      method: 'get',
      url: `${Config.base_url}admin/trade/execution`,
      headers: {
        // 'x-access-token': admin_token
      }
    };
    axios(config)
      .then(function (response) {
        // console.log("response details", response.data.tradeExecution);
        setTradeExecutionApi(response.data.tradeExecution)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    executionDetails()
  }, [])

  const getSymbolName = (symbol) => {
    var splitSymbol = symbol.split(":")[2]
    var splitSymbol2 = splitSymbol.split(",")[0]
    var splitSymbol3 = splitSymbol2.split('"')[0]
    return splitSymbol3
  }

  const getType = (type) => {
    var gettype = type.split('"')[5]
    var gettype1 = gettype.split(":")[1]
    return gettype1
  }

  const getPrice = (price) => {
    var getPrice = price.split(":")[4]
    var getPrice2 = getPrice.split('"')[0]
    return getPrice2
  }

  const getStrategy = (strat) => {
    var getStrat = strat.split(":")[15]
    var getStrat1 = getStrat.split('"')[0]
    return getStrat1
  }



  return (
    <>
      <tbody >

        <div className="row">
          <td>
            {tradeExecutionApi.map((x, index) => {
              const {
                id,
                username,
                symbol,
                receive_signal,
                created_at,
                broker,
              } = x;

              return (
                <Accordion className='m-0' >
                  <Accordion.Item eventKey={index}>
                    <Accordion.Header>
                      <th className="col-2">
                        {id}
                      </th>
                      <th className="col-2 text-center">
                        {username}
                      </th>
                      <th className="col-2 text-center">
                        {getSymbolName(receive_signal)}
                      </th>
                      <th className="col-2 text-center">
                        {brokerName(broker)}
                      </th>
                      {/* <th className="col-2 text-center">
                        Order Status
                      </th>
                      <th className="col-2 text-center">
                        Order Status
                      </th> */}

                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="table-responsive mx-auto">
                        <table className=" table w-100">
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

                              <tr>
                                <td colSpan="2" className="text-center">
                                  Broker
                                </td>
                                <td>{brokerName(broker)}</td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="text-center"  >
                                  Symbol
                                </td>
                                <td width="55" className="test">
                                  {getSymbolName(receive_signal)}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="text-center">
                                  Type
                                </td>
                                <td>{getType(receive_signal)}</td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="text-center">
                                  Price
                                </td>
                                <td>{getPrice(receive_signal)}</td>
                              </tr>
                              <tr>
                                <td colSpan="2" className="text-center">
                                  Strategy
                                </td>
                                <td>{getStrategy(receive_signal)}</td>
                              </tr>
                              <tr>
                                <td colSpan="2" className="text-center">
                                  Time
                                </td>
                                <td>
                                  {created_at}
                                </td>
                              </tr>
                            </tbody>
                          </>
                        </table>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )
            })}
          </td>
        </div>
      </tbody>
    </>

  )
}

export default BrokerResponseWrong


{/* <div><div className="container">
    //   <table className='table broker-response'>
    //     <thead>
    //       <tr>
    //         <th>Trading Symbol</th>
    //         <th>Broker</th>
    //         <th>Trading Status	</th>
    //         <th>Time</th>
    //         <th>Order Status</th>
    //         <th>View</th>
    //       </tr>
    //     </thead>
    //   </table>
    //   <div className="accordion" id="accordionExample">
    //     <div className="card">
    //       <div className="card-head" id="headingOne">
    //         <h2 className="mb-0" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
    //           <table className='table'>
    //             <tbody>
    //               <tr>
    //                 <th>Trading Symbol</th>
    //                 <th>Broker</th>
    //                 <th>Trading Status	</th>
    //                 <th>Time</th>
    //                 <th>Order Status</th>
    //                 <th>View</th>
    //               </tr>
    //             </tbody>
    //           </table>
    //         </h2>
    //       </div>
    //       <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
    //         <div className="card-body">
    //           Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
    //         </div>
    //       </div>
    //     </div> */}



{/* <div className="card">
    //       <div className="card-head" id="headingTwo">
    //         <h2 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
    //           Collapsible Group Item #2
    //         </h2>
    //       </div>
    //       <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
    //         <div className="card-body">
    //           Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
    //         </div>
    //       </div>
    //     </div>
    //     <div className="card">
    //       <div className="card-head" id="headingThree">
    //         <h2 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
    //           Collapsible Group Item #3
    //         </h2>
    //       </div>
    //       <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
    //         <div className="card-body">
    //           Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
    //         </div>
    //       </div>
    //     </div> */}
{/* //   </div>
    // </div>
    // </div> */}