import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from 'axios';
import * as Config from '../common/Config';
import "react-data-table-component-extensions/dist/index.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { dateFormate } from "../common/CommonDateFormate";
function Tradehistory() {

  const [allsignals, setAllSignals] = useState([]);
  const [signals, setSignals] = useState([]);
  const [cprofit, setCprofit] = useState(0);
  const [quantity, setquantity] = useState(1);
  const [symbol_filter, setSymbol_filter] = useState([]);
  const [segment_filter, setSegment_filter] = useState([]);
  const [strategy_filter, setStrategy_filter] = useState([]);
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [fsymbol, setFsymbol] = useState('');
  const [fsegment, setFsegmnet] = useState('');
  const [fstrategy, setFstrategy] = useState('');
  // const [priceLEOrSE,setPriceLEOrSE] = useState(0);
  // const [priceLXOrSX,setPriceLXOrSX] = useState(0);

  const [refr, setRefr] = useState(true);
  const [loader, setLoader] = useState(false);
  const priceLEOrSE = useRef()
  const priceLXOrSX = useRef()
  const qtyLEOrSE = useRef();
  const qtyLXOrSX = useRef();

  var user_id = localStorage.getItem('client_id');
  const client_token = localStorage.getItem('client_token');
  var Symbol_Array = []
  var Type_Array = []
  var TypeSymbolArray = [];
  var SymbolTypeArray = []
  // console.log('okk shakir ', user_id);

  var client_price = 0;
  var client_qty = 0;
  var cpl = 0.00;
  let pl = 0;
  var tcpl = 0;
  var trade_array = [];
  var is_x;
  useEffect(() => {
    setLoader(true)
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/symbolsgroup`,
      data: {},
      headers: {
        'x-access-token': client_token
      }
    }).then(res1 => {
      setSymbol_filter(res1.data.symbols);
      setLoader(false)
    });
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/category`,
      data: {},
      headers: {
        'x-access-token': client_token
      }
    }).then(res1 => {
      setSegment_filter(res1.data.category);
      setLoader(false)
    });

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': client_token
      }
    }).then(res1 => {
      setStrategy_filter(res1.data.strategy);
      setLoader(false)
    });
    var dformat = new Date().toISOString().substring(0, 10);
    axios({
      method: "post",
      url: `${Config.base_url}client/tradehistory`,
      data: {
        'client_id': user_id,
        'symbol': fsymbol,
        'strategy': fstrategy,
        'segment': fsegment,
        'todate': todate,
        'fromdate': fromdate,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then(res1 => {

      var rr = res1.data.tradehistory;
      setSignals(rr);
      setLoader(false)
    });
  }, [refr, fsymbol, fsegment, fstrategy, todate, fromdate]);


  // const quantitychange = (e) => {
  //   if (e.target.value == '') {
  //     setquantity(1);
  //   } else {
  //     setquantity(e.target.value);
  //   }
  // }


  const addcpl = (amt) => {
    tcpl += amt;
    return 0.00;
  }

  const filterchange = useCallback((e) => {
    if (e.target.name == 'symbolname') {

      setFsymbol(e.target.value)
    }
    if (e.target.name == 'strategyname') {

      setFstrategy(e.target.value)
    }
    if (e.target.name == 'segmentname') {

      setFsegmnet(e.target.value)
    }
    if (e.target.name == 'todatename') {

      setTodate(e.target.value);
    }
    if (e.target.name == 'fromdatename') {

      setFromdate(e.target.value);
    }
  });


  const ProfitLossColor = (sig, i, priceLEOrSE,priceLXOrSX, qty_s) => {
    var prev_price = 0;
    // if (sig.type == 'LX' || sig.type == 'SX') {
    //   if (signals[i - 1]) {
    //     prev_price = signals[i - 1].average_client_price;
    //   } else {
    //     prev_price = 0;
    //   }
    // }


    var plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
      sig.type == 'LX' ?


        ((priceLXOrSX - priceLEOrSE) * (qty_s)).toFixed(2)

        :

        ((priceLEOrSE - priceLXOrSX) * (qty_s)).toFixed(2)
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
    var totalcplvalue = (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2)
    if (totalcplvalue > 0) {
      return "green"
    }
    else if (totalcplvalue == '-') {
      return "black"
    } else {
      return "red"
    }
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                <div className="col-md-9">
                </div>
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
                    <label style={{ fontWeight: 'bold', color: 'black' }}>Symbol</label>
                    <select className="form-control" onChange={(e) => { filterchange(e) }} value={fsymbol} name="symbolname">
                      <option value=''>All</option>
                      {symbol_filter.map((sm, i) =>
                        <option value={sm.symbol} key={i}>{sm.symbol}</option>)}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>Segment</label>
                    <select className="form-control" onChange={(e) => { filterchange(e) }} value={fsegment} name="segmentname">
                      <option value=''>All</option>
                      {segment_filter.map((sm, i) =>
                        <option value={sm.segment} key={i}>{sm.name}</option>)}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>From Date</label>
                    <input type="date" value={fromdate} name="fromdatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>End Date</label>
                    <input type="date" value={todate} name="todatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>STRAT</label>
                    <select className="form-control" onChange={(e) => { filterchange(e) }} value={fstrategy} name="strategyname">
                      <option value="">All</option>
                      {strategy_filter.map((sm, i) =>
                        <option key={i} value={sm.name}>{sm.name}</option>)}
                    </select>
                  </div>

                </div>
                <div className="table-responsive">
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr>
                        <th className="tradehostory-w">
                          Signal
                        </th>
                        <th className="text-center">
                          Signal Time
                        </th>
                        <th className="text-center">
                          Symbol
                        </th>

                        <th className="text-center">
                          STRAT
                        </th>
                        <th className="text-center">
                          Type
                        </th>
                        <th className="text-center">
                          Quantity
                        </th>
                        <th className="text-center">
                          Entry Price
                        </th>
                        <th className="text-center">
                          Exit Price
                        </th>
                        <th className="text-center">
                          P & L
                        </th>
                        <th className="text-center">
                          Cumulative P & L
                        </th>
                      </tr></thead>
                    <tbody>
                      {


                        signals.map((sig, i) => {

                          var p = sig.average_client_price;
                          var q = sig.average_client_qty;

                          var prev_price = 0;
                          var price_s = 0;


                          if (sig.type == 'LX' || sig.type == 'SX') {

                            var price_ss = 0;
                            var price_sss = 0;
                            var qty_s = 0;

                            signals.map(function (item, index) {
                              if (item.type == sig.type && sig.trade_symbol == item.trade_symbol) {
                                price_ss += item.average_client_price * item.average_client_qty;
                                qty_s += item.average_client_qty;
                              }
                            });
                            price_sss += price_ss / qty_s;
                            priceLXOrSX.current = price_sss
                            qtyLXOrSX.current = qty_s
                            //  console.log('LX OR SX PRICE inside- ',priceLXOrSX.current);

                          }

                          // console.log('LX OR SX PRICE outside- ',priceLXOrSX.current);


                          if (sig.type == 'LE' || sig.type == 'SE') {
                            var price_le_se_s = 0;
                            var price_le_se_ss = 0;
                            var qty_le_se_s = 0;

                            signals.map(function (item, index) {
                              if (item.type == sig.type && sig.trade_symbol == item.trade_symbol) {
                                price_le_se_ss += item.average_client_price * item.average_client_qty;
                                qty_le_se_s += item.average_client_qty;

                              }
                            });

                            price_le_se_s += price_le_se_ss / qty_le_se_s;
                            priceLEOrSE.current = price_le_se_s
                            qtyLEOrSE.current = qty_le_se_s
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

                          trade_array[i] = sig.trade_symbol;
                           
                         
                          // SymbolTypeArray.push(sig.symbol)
                          //console.log("TypeSymbolArray",TypeSymbolArray)
                          // if((!(Symbol_Array.includes(trade_array[i])) || ((Type_Array[Symbol_Array.lastIndexOf(trade_array[i])]!=(signals[i].type))) && (Type_Array[Symbol_Array.indexOf(trade_array[i])]!=(signals[i].type)))){

                          if (!TypeSymbolArray.includes(sig.type+sig.trade_symbol)) {
                            TypeSymbolArray.push(sig.type+sig.trade_symbol)

                            var qty_s
                            if (sig.type == 'LE' || sig.type == 'SE') {
                              qty_s = qtyLEOrSE.current
                            } else if (sig.type == 'LX' || sig.type == 'SX') {
                              qty_s = qtyLXOrSX.current
                            }
                            //  console.log(Type_Array[Symbol_Array.lastIndexOf(trade_array[i])] )

                            // console.log("price LX or SX" ,priceLXOrSX.current ,"price LE or SE", priceLEOrSE.current ,"qty",qty_s)
                            // if (!(trade_array[i] == trade_array[i - 1] && signals[i].type == signals[i - 1].type)) {
                            cpl = trade_array[i] == trade_array[i - 1] ? cpl : addcpl(cpl);
                            Symbol_Array.push(trade_array[i])
                            Type_Array.push(signals[i].type)
                            return (<tr key={i}>
                              <td className="text-center">{sig.signal_id}</td>
                              <td className="text-center">{dateFormate(sig.created_at)}</td>
                              <td className="text-center">{sig.trade_symbol}<b>[{sig.segment}]</b></td>
                              <td className="text-center">{sig.strategy_tag}</td>
                              <td className="text-center">{sig.type}</td>
                              <td className="text-center" >{qty_s}</td>
                              <td className="text-center">{sig.type == 'LE' || sig.type == 'SE' ? (priceLEOrSE.current.toFixed(2)) : '-'}</td>
                              <td className="text-center">{sig.type == 'LX' || sig.type == 'SX' ? (priceLXOrSX.current.toFixed(2)) : '-'}</td>
                              <td className="text-center" style={{ color: ProfitLossColor(sig, i, priceLEOrSE.current,priceLXOrSX.current, qty_s), fontWeight: 'bold' }}>

                                {
                                  // is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  //   sig.type == 'LX' ?
                                  //     (((sig.average_client_price) - signals[i - 1].average_client_price) * sig.average_client_qty).toFixed(2)
                                  //     :
                                  //     ((signals[i - 1].average_client_price - sig.average_client_price) * sig.average_client_qty).toFixed(2)
                                  //   : '-'



                                  is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                    sig.type == 'LX' ?


                                      ((priceLXOrSX.current - priceLEOrSE.current) * (qty_s)).toFixed(2)

                                      :

                                      ((priceLEOrSE.current - priceLXOrSX.current) * (qty_s)).toFixed(2)
                                    : '-'


                                }
                              </td>
                              <td className="text-center" style={{ color: CommuLativeProfitLossColor(cpl, i, trade_array, pl), fontWeight: 'bold' }}> {
                                is_x != '-' ? cpl = trade_array[i] == trade_array[i - 1] ? Math.round((cpl + (pl * 1.0)) * 100) / 100 : 0.00 : '-'
                              }</td>
                            </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                    {<tfoot>
                      <tr>
                        <td></td>
                        <td colSpan="8" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                          Total cumulative P&L
                        </td>
                        <td style={{ color: totalCPL(tcpl, cpl), fontWeight: 'bold', fontSize: '15px' }}>


                          {(parseFloat(tcpl) + parseFloat(cpl)).toFixed(2)}

                        </td>
                      </tr>
                    </tfoot>}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Tradehistory;