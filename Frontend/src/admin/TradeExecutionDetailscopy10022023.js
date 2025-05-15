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


const TradeExecutionDetails = () => {

    const [tradeExecutionApi, setTradeExecutionApi] = useState([])
    const [tradeExecutionApi1, setTradeExecutionApi1] = useState([])

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
                // console.log("response details", response.data);
                setTradeExecutionApi(response.data.tradeExecution)
                setTradeExecutionApi1(response.data.tradeExecution1)

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

    const getTradingSymbol = (tradesym) => {
        var getSym = tradesym.split('"')[5]
        var getSym1 = getSym.split(":")[1]
       return getSym1
    }


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
                                <div className="card-body mx-auto">
                                <table className="table">
                                <thead className="tablecolor py-3 traderexecutive-head">
                <td className="float-left col-md-1 col-sm-2 ms-2">S No.</td>
                <td className=" col-2 text-center">Time</td>
                <td className=" col-2 text-end">Trading Symbol</td>
                <td className=" col-2 text-end">Type</td>
                <td className=" col-2 text-center">Strategy Tag</td>
                <td className=" col-2 text-center">Price</td>
                <td className=" col-2 text-center">Order Status</td>
                <td className="text-end col-2 pe-3 ">View</td>
            </thead>
                                </table>
                                    <div className="table-responsive mx-auto">

                                    {/* <thead className="">
                <td className="float-left col-md-2 col-sm-2 ms-2">Trading Symbol</td>
                <td className=" col-2 text-center">Broker</td>
                <td className=" col-2 text-end">Trading Status</td>
                <td className=" col-2 text-center">Time</td>
                <td className=" col-2 text-center">Order Status</td>
                <td className="text-end col-2 pe-3 ">View</td>
            </thead> */}

            {/* <div className="row" style={{"width":"1100px !important"}}> */}
            <td style={{width:'40%'}}>
                {tradeExecutionApi.map((x, index) => {
                    const {
                        id,
                        username,
                        symbol,
                        receive_signal,
                        created_at,
                        broker,
                        order_status,
                        trading_status
                    } = x;

                    return (
                        <>
                            <Accordion className='m-0' style={{ }} >
                                <Accordion.Item eventKey={index}>
                                    <Accordion.Header>
                                        <th className="col-1">
                                            {index + 1}
                                        </th>
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
 {
    tradeExecutionApi1.map((val,index)=>{
  
  if(val.receive_signal == receive_signal){

    return  <Accordion.Item eventKey={index}>
    <Accordion.Header>
    <th className="col-1">
    {val.username}
    </th>

    <th className="col-2 text-center">
    {brokerName(broker)}
    </th>

    <th className="col-2 text-center">
    {val.trading_status}
    </th>
    <th width="55" className="test">
                  {order_status == null ? "-" : order_status}
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
                  <td colSpan="1" className="text-center">
                      Reason
                  </td>
                  <td>{val.reject_reason == null ? "-":val.reject_reason }</td>
              </tr>
  
          </tbody>
      </>
  </table>
    </Accordion.Body>
  </Accordion.Item>
  }
    })
 }
              
                                          </Accordion>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </>
                    )
                })}
            </td>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            
            {/* </div> */}
            {/* </tbody> */}
        </>

    )
}

export default TradeExecutionDetails














// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import axios from "axios";
// import { NavLink, useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
// import * as Config from "../common/Config";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
// import ExportToExcel from "../common/ExportToExport";
// import AlertToast from "../common/AlertToast";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { dateFormate } from "../common/CommonDateFormate";


// const TradeExecutionDetails = () => {

//     const [tradeExecutionApi, setTradeExecutionApi] = useState([])

//     const columns = [
//         {
//             name: <h6>S No.</h6>,
//             selector: (row, index) => index + 1,
//             width: '60px !important',
//         },
//         {
//             name: <h6>Username</h6>,
//             selector: (row) => row.username,
//             width: '120px !important',
//         },
//         {
//             name: <h6>Symbols</h6>,
//             selector: (row) => getSymbolName(row),
//             width: '120px !important',
//         },
//         // {
//         //     name: <h6>Receive Signal</h6>,
//         //     selector: (row) => row.receive_signal,
//         //     width: '400px !important',
//         //     overflow: "visible"
//         //     wordWrap: 'break-word'
//         // },
//         {
//             name: <h6>Order Status</h6>,
//             selector: (row) => row.order_status == null ? "-" : row.order_status,
//             width: '400px !important',
//         },
//         {
//             name: <h6>Reject Reason</h6>,
//             selector: (row) => row.reject_reason == null ? "-" : row.reject_reason,
//             width: '400px !important',
//             // wordWrap: 'break-word'
//         },
//     ];

//     const getSymbolName = (row) => {
//         var splitSymbol = row.receive_signal.split(":")[2]
//         var splitSymbol2 = splitSymbol.split(",")[0]
//         var splitSymbol3 = splitSymbol2.split('"')[0]
//         return splitSymbol3
//     }

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
//                 console.log("response details", response.data.tradeExecution);
//                 setTradeExecutionApi(response.data.tradeExecution)
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });

//     }

//     const customStyles = {
//         headCells: {
//             style: {
//                 fontWeight: "700",
//                 backgroundColor: '#000',
//                 color: '#fff',
//                 justifyContent: 'center !important',
//             },
//         },
//         rows: {
//             style: {
//                 // overflow:'visible !important',
//                 justifyContent: 'center !important',
//             },
//         },
//         cells: {
//             style: {
//                 overflow: 'visible !important',
//                 justifyContent: 'center !important',
//             },
//         },
//     };

//     useEffect(() => {
//         executionDetails()
//     }, [])


//     return (
//         <>
//             <div className="content">
//                 <div className="row">
//                     <div className="col-md-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <h4 className="card-title">Trade Execution Details</h4>
//                                 <div className="row">
//                                     <div className="col-md-3"></div>
//                                 </div>
//                             </div>

//                             <div className="row d-flex justify-content-end mx-auto">
//                                 <div className="card-body mx-auto">
//                                     <div className="table-responsive mx-auto">
//                                         <DataTableExtensions
//                                             export={false}
//                                             print={false}
//                                             data={tradeExecutionApi}
//                                             columns={columns}
//                                         >
//                                             <DataTable
//                                                 fixedHeader
//                                                 fixedHeaderScrollHeight="700px"
//                                                 noHeader
//                                                 defaultSortField="id"
//                                                 style
//                                                 defaultSortAsc={false}
//                                                 pagination
//                                                 customStyles={customStyles}
//                                                 highlightOnHover
//                                                 paginationRowsPerPageOptions={[10, 50, 100]}
//                                                 paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}

//                                             />
//                                         </DataTableExtensions>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default TradeExecutionDetails