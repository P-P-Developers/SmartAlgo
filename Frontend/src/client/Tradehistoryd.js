import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import * as Config from "../common/Config";
import "react-data-table-component-extensions/dist/index.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { dateFormate } from "../common/CommonDateFormate";

const Tradehistoryd = () => {
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [allsignals, setAllSignals] = useState([]);
  const [signals, setSignals] = useState([]);
  // console.log("signals", signals);
  const [cprofit, setCprofit] = useState(0);
  const [quantity, setquantity] = useState(1);
  const [symbol_filter, setSymbol_filter] = useState([]);
  const [segment_filter, setSegment_filter] = useState([]);
  const [strategy_filter, setStrategy_filter] = useState([]);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [fsymbol, setFsymbol] = useState("");
  const [fsegment, setFsegmnet] = useState("");
  const [fstrategy, setFstrategy] = useState("");
  const [render, setRender] = useState(false)
  const [updatedPri, setUpdatedpri] = useState([])
  const [abc, setAbc] = useState([])
  // const [priceLEOrSE,setPriceLEOrSE] = useState(0);
  // const [priceLXOrSX,setPriceLXOrSX] = useState(0);

  const [refr, setRefr] = useState(true);
  const [loader, setLoader] = useState(false);
  const priceLEOrSE = useRef();
  const priceLXOrSX = useRef();
  const qtyLEOrSE = useRef();
  const qtyLXOrSX = useRef();

  const user_id = localStorage.getItem("client_id");
  // console.log("clientid" ,user_id);
  const client_token = localStorage.getItem("client_token");

  const pathname = window.location.host
  // console.log("pathname", pathname);

  //   const location = useLocation();
  // console.log("loca", location);

  var Symbol_Array = [];
  var Type_Array = [];
  var TypeSymbolArray = [];
  var SymbolTypeArray = [];
  // console.log('okk shakir ', user_id);

  var client_price = 0;
  var client_qty = 0;
  var cpl = 0.0;
  let pl = 0;
  var tcpl = 0;
  var trade_array = [];
  var is_x;

  useEffect(() => {
    setLoader(true);
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/symbolsgroup`,
      data: {},
      headers: {
        "x-access-token": client_token,
      },
    }).then((res1) => {
      setSymbol_filter(res1.data.symbols);
      setLoader(false);
    });
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/category`,
      data: {},
      headers: {
        "x-access-token": client_token,
      },
    }).then((res1) => {
      setSegment_filter(res1.data.category);
      setLoader(false);
    });

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        "x-access-token": client_token,
      },
    }).then((res1) => {
      setStrategy_filter(res1.data.strategy);
      setLoader(false);
    });
    var dformat = new Date().toISOString().substring(0, 10);

    axios({
      method: "post",
      url: `${Config.base_url}demo/signals`,
      data: {
        client_id: user_id,
        symbol: fsymbol,
        strategy: fstrategy,
        segment: fsegment,
        todate: todate,
        fromdate: fromdate,
      },
      headers: {
        "x-access-token": client_token,
      },
    }).then((res1) => {
      var rr = res1.data.tradehistory;
      setSignals(rr);
      setLoader(false);
    });
  }, [refr, fsymbol, fsegment, fstrategy, todate, fromdate, render]);

  // delete signals id api

  const ondeletesignals = (id) => {
    if (window.confirm("Do you want to delete this Client ?")) {
      // console.log("signalid", id);
      axios({
        method: "post",
        url: `${Config.base_url}demo/delete_signals_id`,
        data: {
          client_id: user_id,
          signal_id: id,
        },
        headers: {
          "x-access-token": client_token,
        },
      }).then((res1) => {
        console.log("resqqq", res1);

        if (res1.data.status == true) {
          setRender(!render);
          alert("signals delete Successfully......")
        }
      });
    }
  };

  //  const ondeletesignals = (id) =>{
  //   alert(id)
  //  }

  // const quantitychange = (e) => {
  //   if (e.target.value == '') {
  //     setquantity(1);
  //   } else {
  //     setquantity(e.target.value);
  //   }
  // }

  const addcpl = (amt) => {
    tcpl += amt;
    return 0.0;
  };

  const filterchange = useCallback((e) => {
    if (e.target.name == "symbolname") {
      setFsymbol(e.target.value);
    }
    if (e.target.name == "strategyname") {
      setFstrategy(e.target.value);
    }
    if (e.target.name == "segmentname") {
      setFsegmnet(e.target.value);
    }
    if (e.target.name == "todatename") {
      setTodate(e.target.value);
    }
    if (e.target.name == "fromdatename") {
      setFromdate(e.target.value);
    }
  });

  const ProfitLossColor = (sig, i) => {

    var prev_price = 0;
    if (sig.type == 'LX' || sig.type == 'SX') {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price;
      } else {
        prev_price = 0;
      }
    }

    var plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
      sig.type == 'LX' ?
        ((sig.price - prev_price) * sig.quantity).toFixed(2)
        :
        ((prev_price - sig.price) * sig.quantity).toFixed(2)
      : '-'


    if (plvalue > 0) {
      return "green"
    }
    else if (plvalue == '-') {
      return "black"
    } else {
      return "red"
    }
  }

  const CommuLativeProfitLossColor = (cpl, i, trade_array, pl) => {
    var cplvalue = is_x != '-' ? cpl = trade_array[i] == trade_array[i - 1] ? Math.round((cpl + (pl * 1.0)) * 100) / 100 : 0.00 : '-'
    //console.log('cpl -',cplvalue)
    if (cplvalue > 0) {
      return "green"
    }
    else if (cplvalue == '-') {
      return "black"
    } else {
      return "red"
    }
  }

  const totalCPL = (tcpl, cpl) => {
    //var totalcplvalue =  is_x != '-' ? (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2) : tcpl.toFixed(2)
    // console.log('cpl -',totalcplvalue)
    var totalcplvalue = (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2);
    if (totalcplvalue > 0) {
      return "green";
    } else if (totalcplvalue == "-") {
      return "black";
    } else {
      return "red";
    }
  };

  var updatePrice = []
  const inputChangePrices = (e, id, clientid, signalid) => {

    const updated = {
      "updatedId": id,
      "updatedPrice": e.target.value,
      "signalid": signalid,
      "clientid": clientid,
    }

    setUpdatedpri(oldValues => {
      return oldValues.filter(item => item.updatedId !== id)
    })

    setUpdatedpri((oldArray) => [updated, ...oldArray]);









    // let dataArr = updatePrice.map(item => {
    //   return [item.updatedId, item]
    // });
    // var maparr = new Map(dataArr);
    // var result = [...maparr.values()];
    // console.log("result", result)
    // setUpdatedpri(()=>)


    // tt(result)

  }




  const updatePricesFunction = () => {

    console.log("updatedPri", updatedPri);

    // var dataArr = updatedPri.map(item => {
    //   return [item.updatedId, item]
    // });
    // var maparr = new Map(dataArr);
    // var result = [...maparr.values()];
    // // console.log("result", result)

    // if (window.confirm("Do you want to update Signals ?")) {
    //   axios({
    //     method: "post",
    //     url: `${Config.base_url}demo/update_signals_id`,
    //     data: {
    //       client_id: user_id,
    //       updateobj: result,
    //     },
    //     headers: {
    //       'x-access-token': client_token
    //     }

    //   }).then((response) => {
    //     if (response) {
    //       // setRefresh(!refresh);
    //     }
    //   });
    // }


    // ================= My Code ganpat =------- 
    if (window.confirm("Do you want to update Signals ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}demo/update_signals_id`,
        data: {
          client_id: user_id,
          updateobj: updatedPri,
        },
        headers: {
          'x-access-token': client_token
        }

      }).then((response) => {
        if (response) {
          if(response.data.status){
            setRender(!render);
            alert(response.data.msg)
          }

          console.log("dddd" , response.data.status);
          // setRefresh(!refresh);
        }
      });
    }
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#000000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row">
                <div className="col-md-9"></div>
                <div className="card-header">
                  <h4 className="card-title">&nbsp;&nbsp;Trade History</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="row trade-space">

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>Quantity</label>
                    <input type="number" value={ quantity } onChange={(e) => { quantitychange(e) }} className="form-control" />
                  </div> */}

                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      Symbol
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      value={fsymbol}
                      name="symbolname"
                    >
                      <option value="">All</option>
                      {symbol_filter.map((sm, i) => (
                        <option value={sm.symbol} key={i}>
                          {sm.symbol}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-success" onClick={(e) => updatePricesFunction()}>Update Price</button>
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      Segment
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      value={fsegment}
                      name="segmentname"
                    >
                      <option value="">All</option>
                      {segment_filter.map((sm, i) => (
                        <option value={sm.segment} key={i}>
                          {sm.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromdate}
                      name="fromdatename"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      className="form-control"
                    />
                  </div> */}

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={todate}
                      name="todatename"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      className="form-control"
                    />
                  </div> */}

                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      STRAT
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      value={fstrategy}
                      name="strategyname"
                    >
                      <option value="">All</option>
                      {strategy_filter.map((sm, i) => (
                        <option key={i} value={sm.name}>
                          {sm.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr>
                        <th className="tradehostory-w">Signal</th>
                        <th className="text-center">Signal Time</th>
                        <th className="text-center">Symbol</th>

                        <th className="text-center">STRAT</th>
                        <th className="text-center">Type</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Entry Price</th>
                        <th className="text-center">Exit Price</th>
                        <th className="text-center">P & L</th>
                        <th className="text-center">Cumulative P & L</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signals.map((sig, i) => {
                        var p = sig.average_client_price;
                        var q = sig.average_client_qty;

                        var prev_price = 0;
                        var price_s = 0;

                        if (sig.type == "LX" || sig.type == "SX") {
                          var price_ss = 0;
                          var price_sss = 0;
                          var qty_s = 0;

                          signals.map(function (item, index) {
                            if (
                              item.type == sig.type &&
                              sig.trade_symbol == item.trade_symbol
                            ) {
                              price_ss +=
                                item.average_client_price *
                                item.average_client_qty;
                              qty_s += item.average_client_qty;
                            }
                          });
                          price_sss += price_ss / qty_s;
                          priceLXOrSX.current = price_sss;
                          qtyLXOrSX.current = qty_s;
                          //  console.log('LX OR SX PRICE inside- ',priceLXOrSX.current);
                        }

                        // console.log('LX OR SX PRICE outside- ',priceLXOrSX.current);

                        if (sig.type == "LE" || sig.type == "SE") {
                          var price_le_se_s = 0;
                          var price_le_se_ss = 0;
                          var qty_le_se_s = 0;

                          signals.map(function (item, index) {
                            if (
                              item.type == sig.type &&
                              sig.trade_symbol == item.trade_symbol
                            ) {
                              price_le_se_ss +=
                                item.average_client_price *
                                item.average_client_qty;
                              qty_le_se_s += item.average_client_qty;
                            }
                          });

                          price_le_se_s += price_le_se_ss / qty_le_se_s;
                          priceLEOrSE.current = price_le_se_s;
                          qtyLEOrSE.current = qty_le_se_s;
                          //  console.log('price_le_se_inside - ',price_le_se_s);
                        }
                        // console.log('price_le_se_outside - ',priceLEOrSE.current);

                        //  console.log('LX OR SX PRICE outside- ',priceLXOrSX.current);

                        // if(sig.type == 'LX' || sig.type == 'SX'){
                        //   if(signals[i - 1]){
                        //   // prev_price = signals[i - 1].average_client_price;
                        //   signals.map(function(item, index) {
                        //     if(item.type ==  sig.type && sig.trade_symbol == item.trade_symbol){

                        //       price_le_se_ss += item.average_client_price * item.average_client_qty;
                        //       qty_le_se_s +=  item.average_client_qty;

                        //     }
                        // });

                        //   }else{
                        //    prev_price = 0;
                        //   }
                        // }

                        //  console.log('qty_le_se_s - ',qty_le_se_s);

                        //  console.log('LE OR SE PRICE - ',price_le_se_s);


                        if (sig.type == 'LX' || sig.type == 'SX') {
                          if (signals[i - 1]) {
                            prev_price = signals[i - 1].price;

                          } else {
                            prev_price = 0;
                          }
                        }

                        trade_array[i] = sig.trade_symbol;

                        // SymbolTypeArray.push(sig.symbol)
                        //console.log("TypeSymbolArray",TypeSymbolArray)
                        // if((!(Symbol_Array.includes(trade_array[i])) || ((Type_Array[Symbol_Array.lastIndexOf(trade_array[i])]!=(signals[i].type))) && (Type_Array[Symbol_Array.indexOf(trade_array[i])]!=(signals[i].type)))){

                        //if ( !TypeSymbolArray.includes(sig.type + sig.trade_symbol)) {
                        TypeSymbolArray.push(sig.type + sig.trade_symbol);

                        var qty_s;
                        if (sig.type == "LE" || sig.type == "SE") {
                          qty_s = qtyLEOrSE.current;
                        } else if (sig.type == "LX" || sig.type == "SX") {
                          qty_s = qtyLXOrSX.current;
                        }
                        //  console.log(Type_Array[Symbol_Array.lastIndexOf(trade_array[i])] )

                        // console.log("price LX or SX" ,priceLXOrSX.current ,"price LE or SE", priceLEOrSE.current ,"qty",qty_s)
                        // if (!(trade_array[i] == trade_array[i - 1] && signals[i].type == signals[i - 1].type)) {
                        cpl =
                          trade_array[i] == trade_array[i - 1]
                            ? cpl
                            : addcpl(cpl);
                        Symbol_Array.push(trade_array[i]);
                        Type_Array.push(signals[i].type);
                        return (
                          <tr key={i}>
                            <td className="text-center">{sig.signal_id}</td>
                            <td className="text-center">
                              {dateFormate(sig.created_at)}
                            </td>
                            <td className="text-center">
                              {sig.trade_symbol}
                              <b>[{sig.segment}]</b>
                            </td>
                            <td className="text-center">
                              {sig.strategy_tag}
                            </td>
                            <td className="text-center">{sig.type}</td>


                            <td className="text-center">
                              <div>
                                <input
                                  className="hidebg"
                                  name="price"
                                  type="number"
                                  onChange={(e) => {
                                    inputChangePrices(e, sig.id, sig.client_id, sig.signals_id);
                                  }}
                                  defaultValue={sig.price}
                                />
                              </div>
                            </td>


                            <td className="text-center">{sig.quantity}</td>
                            <td className="text-center">{sig.type == 'LE' || sig.type == 'SE' ? sig.price : '-'}</td>
                            <td className="text-center">{sig.type == 'LX' || sig.type == 'SX' ? sig.price : '-'}</td>
                            <td className="text-center" style={{ color: ProfitLossColor(sig, i), fontWeight: 'bold' }}>

                              {
                                is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  sig.type == 'LX' ?
                                    ((sig.price - prev_price) * sig.quantity).toFixed(2)
                                    :
                                    ((prev_price - sig.price) * sig.quantity).toFixed(2)
                                  : '-'
                              }
                            </td>
                            <td
                              className="text-center"
                              style={{
                                color: CommuLativeProfitLossColor(
                                  cpl,
                                  i,
                                  trade_array,
                                  pl
                                ),
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              {is_x != "-"
                                ? (cpl =
                                  trade_array[i] == trade_array[i - 1]
                                    ? Math.round((cpl + pl * 1.0) * 100) /
                                    100
                                    : 0.0)
                                : "-"}
                            </td>

                            <td>
                              <tr>
                                <i
                                  className="fa-solid  fa-solid fa-trash pe-3 fs-5 edit_hover"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  onClick={() => ondeletesignals(sig.id)}
                                ></i>
                              </tr>
                            </td>
                          </tr>
                        );
                        //  }
                      })}
                    </tbody>
                    {
                      <tfoot>
                        <tr>
                          <td></td>
                          <td
                            colSpan="8"
                            style={{ fontWeight: "bold", fontSize: "15px" }}
                          >
                            Total cumulative P&L
                          </td>
                          <td
                            style={{
                              color: totalCPL(tcpl, cpl),
                              fontWeight: "bold",
                              fontSize: "15px",
                            }}
                          >
                            {(parseFloat(tcpl) + parseFloat(cpl)).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    }
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tradehistoryd;
