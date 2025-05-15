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
  const [companyDetails, setCompanyDetails] = useState("");

  const [refr, setRefr] = useState(true);
  const [loader, setLoader] = useState(false);
  const priceLEOrSE = useRef()
  const priceLXOrSX = useRef()
  const qtyLEOrSE = useRef();
  const qtyLXOrSX = useRef();

  const locationname = window.location.host


  var user_id = localStorage.getItem('client_id');
  const client_token = localStorage.getItem('client_token');
  const role_id = localStorage.getItem('roleId');
  const fromadmin = localStorage.getItem('from_admin');


  var Symbol_Array = []
  var Type_Array = []
  var TypeSymbolArray = [];
  var SymbolTypeArray = []
  // console.log('okk shakir ', user_id);

  const client_id = localStorage.getItem('client_id')

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
      url: `${Config.base_url}client/symbols`,
      method: 'post',
      data: {
        client_id: user_id,
      },
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
      method: "POST",
      url: `${Config.base_url}client/strategy`,
      data: { client_id: client_id },
      headers: {
        'x-access-token': client_token
      }
    }).then((res1) => {

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
      // console.log("res1", res1);

      var rr = res1.data.tradehistory;

      //-------LE LX ---------------
      var leType = []
      var lxType = []
      var seType = []
      var sxType = []

      // Filter signal type
      leType = rr.filter((v) => v.type == 'LE')
      lxType = rr.filter((v) => v.type == 'LX')
      seType = rr.filter((v) => v.type == 'SE')
      sxType = rr.filter((v) => v.type == 'SX')


      // console.log('leType', leType.length);
      // console.log('lxType', lxType.length);
      // console.log('seType', seType.length);
      // console.log('sxType', sxType.length);

      // time sorting
      leType.sort(function (a, b) {
        return a.created_at - b.created_at;
      });
      lxType.sort(function (a, b) {
        return a.created_at - b.created_at;
      });
      seType.sort(function (a, b) {
        return a.created_at - b.created_at;
      });
      sxType.sort(function (a, b) {
        return a.created_at - b.created_at;
      });

      var newArray = [];
      var newArrayPair = [];

      var indexArray = [];
      var arOfarr = [];

      // console.log('le ', leType.length)
      // console.log('lx ', lxType.length)

      leType.forEach(function (item) {


        lxType.forEach(function (item1) {


          if (!indexArray.includes(item1.id)) {

            if (!indexArray.includes(item.id)) {

              if (item.trade_symbol == item1.trade_symbol && item.segment == item1.segment && item.strategy_tag == item1.strategy_tag && item.created_at < item1.created_at) {

                indexArray.push(item.id);
                indexArray.push(item1.id);


                if (item.id) {
                  newArrayPair.push(item);
                }
                if (item1.id) {
                  newArrayPair.push(item1);
                }

                if (newArrayPair.length == 2) {

                  arOfarr.push({ "trade_symbol": item.trade_symbol, 'array': newArrayPair })
                  newArrayPair = [];
                }
              }
            }
          }
        });
      });

      var newArray1 = [];
      var newArrayPair1 = [];
      var indexArray1 = [];
      var arOfarr1 = [];

      seType.forEach(function (item) {

        sxType.forEach(function (item1) {


          if (!indexArray1.includes(item1.id)) {

            if (!indexArray1.includes(item.id)) {

              if (item.trade_symbol == item1.trade_symbol && item.segment == item1.segment && item.strategy_tag == item1.strategy_tag && item.created_at <= item1.created_at) {

                indexArray1.push(item.id);
                indexArray1.push(item1.id);


                if (item.id) {
                  newArrayPair1.push(item);
                }
                if (item1.id) {
                  newArrayPair1.push(item1);
                }

                if (newArrayPair1.length == 2) {

                  arOfarr1.push({ "trade_symbol": item.trade_symbol, 'array': newArrayPair1 })
                  newArrayPair1 = [];
                }
              }
            }
          }
        });
      });


      leType.forEach(function (item) {
        if (!indexArray.includes(item.id)) {
          newArray.push(item);
          arOfarr.push({ "trade_symbol": item.trade_symbol, 'array': item })
        }
      });

      lxType.forEach(function (item) {
        if (!indexArray.includes(item.id)) {
          newArray.push(item);
          arOfarr.push({ "trade_symbol": item.trade_symbol, 'array': item })
        }
      });

      seType.forEach(function (item) {
        if (!indexArray1.includes(item.id)) {
          newArray1.push(item);
          arOfarr1.push({ "trade_symbol": item.trade_symbol, 'array': item })
        }
      });

      sxType.forEach(function (item) {
        if (!indexArray1.includes(item.id)) {
          newArray1.push(item);
          arOfarr1.push({ "trade_symbol": item.trade_symbol, 'array': item })
        }
      });


      // console.log('arOfarr -', arOfarr.length)
      // console.log('arOfarr1 -', arOfarr1.length)


      var objs = arOfarr.concat(arOfarr1);
      //  var objs = arOfarr.concat(arOfarr1);
      //console.log('indexArray -',newArrayPair.concat(newArray))

      function compare(a, b) {
        if (a.trade_symbol < b.trade_symbol) {
          return -1;
        }
        if (a.trade_symbol > b.trade_symbol) {
          return 1;
        }
        return 0;
      }

      var r = objs.sort(compare);

      let arrayfind1 = [];
      r.forEach(element => {

        if (element.array.length > 0) {
          element.array.forEach(element1 => {

            arrayfind1.push(element1)
          });
        } else {

          arrayfind1.push(element.array)
        }

      });



      var firstElement = []

      arrayfind1.forEach((val) => {
        if (arrayfind1[0].type == "LX" || arrayfind1[0].type == "SX") {
          firstElement = arrayfind1.splice(0, 1);
          arrayfind1.push(firstElement[0]);
        }
      })


      if (arrayfind1.length == 1) {
        arrayfind1.forEach((val) => {
          if (arrayfind1[0].type == "LX" || arrayfind1[0].type == "SX") {

          } else {
            setSignals(arrayfind1)
            // setSearchFilter(arrayfind1)
          }
        })
      } else {
        setSignals(arrayfind1)
        // setSearchFilter(arrayfind1)
      }


      // setSignals(rr);
      setLoader(false)
    });
  }, [refr, fsymbol, fsegment, fstrategy, todate, fromdate]);

const GetWatermark = () => {
  axios({
    method: "get",
    url: `${Config.base_url}admin/system_company`,
  }).then(function (response) {
    setCompanyDetails(response.data.data);
    document.getElementById("title").innerText = response.data.data[0].name;

  });
};
useEffect(() => {
  GetWatermark();
}, []);

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


  const ProfitLossColor = (sig, i) => {

    var prev_price = 0;
    if (sig.type == 'LX' || sig.type == 'SX') {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price;
      } else {
        prev_price = 0;
      }
    }


    var plvalue = "";

    var pl = 0

    // if ((sig.segment.toUpperCase() == 'FO' || sig.segment.toUpperCase() == 'MO') && sig.option_type.toUpperCase() == 'PUT') {

    if( ["FO", "MFO", "CFO", "BFO"].includes(sig.segment.toUpperCase()) && sig.option_type.toUpperCase() == "PUT"){


      if (sig.type == 'LX' && i != 0) {

        if (signals[i - 1].type == 'LE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          // pl = ((prev_price - sig.price) * (sig.quantity)).toFixed(2);
          pl = ((prev_price - sig.price) * (sig.quantity)).toFixed(2);

        } else {
          pl = 0;
        }

      } else if (sig.type == 'SX' && i != 0) {

        if (signals[i - 1].type == 'SE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((sig.price - prev_price) * (sig.quantity)).toFixed(2);
        } else {
          pl = 0;
        }

      } else {
        pl = 0
      }
    } else {


      if (sig.type == 'LX' && i != 0) {

        if (signals[i - 1].type == 'LE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((sig.price - prev_price) * (sig.quantity)).toFixed(2);
        } else {
          pl = 0;
        }

      } else if (sig.type == 'SX' && i != 0) {

        if (signals[i - 1].type == 'SE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((prev_price - sig.price) * (sig.quantity)).toFixed(2);
        } else {
          pl = 0;
        }

      } else {
        pl = 0
      }


    }
    if (pl > 0) {
      return "green"
    }
    else if (pl == '-') {
      return "black"
    } else {
      return "red"
    }







    // var prev_price = 0;
    // if (sig.type == 'LX' || sig.type == 'SX') {
    //   if (signals[i - 1]) {
    //     prev_price = signals[i - 1].price;
    //   } else {
    //     prev_price = 0;
    //   }
    // }

    // // var plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
    // //   sig.type == 'LX' ?
    // //     ((sig.price - prev_price) * sig.quantity).toFixed(2)
    // //     :
    // //     ((prev_price - sig.price) * sig.quantity).toFixed(2)
    // //   : '-'

    // var plvalue = "";


    // sig.segment == 'FO' && sig.option_type == 'PUT' ?

    //   plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
    //     sig.type == 'LX' ? signals[i - 1]

    //       ? ((prev_price - sig.price) * (sig.quantity)).toFixed(2)
    //       : 0
    //       : ((sig.price - prev_price) * (sig.quantity)).toFixed(2)
    //     : '-'


    //   :


    //   plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
    //     sig.type == 'LX' ? signals[i - 1]

    //       ? ((sig.price - prev_price) * (sig.quantity)).toFixed(2)
    //       : 0
    //       : ((prev_price - sig.price) * (sig.quantity)).toFixed(2)
    //     : '-'

    // if (plvalue > 0) {
    //   return "green"
    // }
    // else if (plvalue == '-') {
    //   return "black"
    // } else {
    //   return "red"
    // }
  }


  const include_td_profitLoss = (sig, i) => {

    var prev_price = 0;
    if (sig.type == 'LX' || sig.type == 'SX') {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price;
      } else {
        prev_price = 0;
      }
    }


    var plvalue = "";
    let istrue = true


    var pl = 0

    // if ((sig.segment.toUpperCase() == 'FO' || sig.segment.toUpperCase() == 'MO') && sig.option_type.toUpperCase() == 'PUT') {
      if( ["FO", "MFO", "CFO", "BFO"].includes(sig.segment.toUpperCase()) && sig.option_type.toUpperCase() == "PUT"){


      if (sig.type == 'LX' && i != 0) {

        if (signals[i - 1].type == 'LE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {

          //  pl =  ((prev_price - sig.price) * (sig.quantity)).toFixed(2);
          pl = ((prev_price - sig.price) * (sig.quantity)).toFixed(2);



        } else {
          pl = '-';
        }

      } else if (sig.type == 'SX' && i != 0) {

        if (signals[i - 1].type == 'SE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((sig.price - prev_price) * (sig.quantity)).toFixed(2);
        } else {
          pl = '-';
        }

      } else {
        pl = '-'
      }
    } else {


      if (sig.type == 'LX' && i != 0) {

        if (signals[i - 1].type == 'LE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((sig.price - prev_price) * (sig.quantity)).toFixed(2);
        } else {
          pl = '-';
        }

      } else if (sig.type == 'SX' && i != 0) {

        if (signals[i - 1].type == 'SE' && new Date(signals[i - 1].created_at) < new Date(sig.created_at) && signals[i - 1].trade_symbol == sig.trade_symbol) {
          pl = ((prev_price - sig.price) * (sig.quantity)).toFixed(2);
        } else {
          pl = '-';
        }

      } else {
        pl = '-'
      }


    }






    // sig.segment == 'FO' && sig.option_type == 'PUT' ?
    //   plvalue = is_x = sig.type == 'LX' ? pl =
    //     sig.type == 'LX' &&  i != 0 ? signals[i - 1].type == 'LE'
    //       ? ((prev_price - sig.price) * (quantity)).toFixed(2)
    //       : 0
    //       :

    //       sig.type == 'SX' &&  i != 0  ?  ((sig.price - prev_price) * (quantity)).toFixed(2) : 0


    //       : '-'
    //   :



    //   plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
    //     sig.type == 'LX' && i != 0? signals[i - 1].type == 'LE'

    //       ? ((sig.price - prev_price) * (quantity)).toFixed(2)
    //       : 0
    //       : signals[i - 1].type == 'SE' ? ((prev_price - sig.price) * (quantity)).toFixed(2) : 0
    //     : '-'

    return pl;
  }


  const CommuLativeProfitLossColor = (cpl, i, trade_array, pl) => {
    var cplvalue = is_x != '-' ? cpl = trade_array[i] == trade_array[i - 1] ? Math.round((cpl + (pl * 1.0)) * 100) / 100 : 0.00 : '-'

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
    // console.log('is_x -', is_x)
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
                  {/* {(locationname == 'app.nextalgo.net' || locationname == 'client.growtechitsolutions.com' || locationname == '180.149.241.128:3000') &&
                    } */}
                  <h6 className="text-center">This results is valid for today only, We do not directly or indirectly make any reference to the past or expected future return/performance of the Algorithm.
                    <br />
                    <br />
                  </h6>
                  <p className=" h5 text-center"><b>Trade History</b></p>
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
                        <option value={sm.client_service} key={i}>{sm.client_service}</option>)}
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

                  {(fromadmin != null && role_id == 1) ?
                    <div className="col-md-2">
                      <label style={{ fontWeight: 'bold', color: 'black' }}>From Date</label>
                      <input type="date" value={fromdate} name="fromdatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                    </div>
                    : ""}

                  {(fromadmin != null && role_id == 1) ?
                    <div className="col-md-2">
                      <label style={{ fontWeight: 'bold', color: 'black' }}>End Date</label>
                      <input type="date" value={todate} name="todatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                    </div>
                    : ""}

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>STRAT</label>
                    <select className="form-control" onChange={(e) => { filterchange(e) }} value={fstrategy} name="strategyname">
                      <option value="">All</option>
                      {strategy_filter.map((sm, i) =>
                        <option key={i} value={sm.strategy
                        }>{sm.strategy
                          }</option>)}
                    </select>
                  </div>

                </div>
                <div className="table-responsive">
                  <table className="table tbl-tradehostory"  style={{
                      backgroundImage: `url(/images/${
                        companyDetails &&
                        companyDetails[0].tradehistory_watermark
                      })`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",

                      backgroundRepeat: "repeat-y",
                    }}>
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


                          if (sig.type == 'LX' || sig.type == 'SX') {
                            if (signals[i - 1]) {
                              prev_price = signals[i - 1].price;

                            } else {
                              prev_price = 0;
                            }
                          }




                          //  console.log('LE OR SE PRICE - ',price_le_se_s);

                          trade_array[i] = sig.trade_symbol;


                          // SymbolTypeArray.push(sig.symbol)
                          //console.log("TypeSymbolArray",TypeSymbolArray)
                          // if((!(Symbol_Array.includes(trade_array[i])) || ((Type_Array[Symbol_Array.lastIndexOf(trade_array[i])]!=(signals[i].type))) && (Type_Array[Symbol_Array.indexOf(trade_array[i])]!=(signals[i].type)))){

                          // if (!TypeSymbolArray.includes(sig.type+sig.trade_symbol)) {
                          TypeSymbolArray.push(sig.type + sig.trade_symbol)

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
                            <td className="text-center" >{sig.quantity}</td>
                            <td className="text-center">{sig.type == 'LE' || sig.type == 'SE' ? sig.price : '-'}</td>
                            <td className="text-center">{sig.type == 'LX' || sig.type == 'SX' ? sig.price : '-'}</td>
                            <td className="text-center" style={{ color: ProfitLossColor(sig, i), fontWeight: 'bold' }}>

                              {
                                is_x = pl = include_td_profitLoss(sig, i)
                                // sig.segment == 'FO' && sig.option_type == 'PUT' ?


                                //   is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                //     sig.type == 'LX' ? signals[i - 1].type == 'LE'
                                //       ? ((prev_price - sig.price) * (sig.quantity)).toFixed(2)
                                //       : 0
                                //       : signals[i - 1].type == 'SE' ? ((sig.price - prev_price) * (sig.quantity)).toFixed(2) : 0
                                //     : '-'

                                //   :

                                //   is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                //     sig.type == 'LX' ? signals[i - 1].type == 'LE'

                                //       ? ((sig.price - prev_price) * (sig.quantity)).toFixed(2)
                                //       : 0
                                //       : signals[i - 1].type == 'SE' ? ((prev_price - sig.price) * (sig.quantity)).toFixed(2) : 0
                                //     : '-'






                              }
                            </td>
                            <td className="text-center" style={{ color: CommuLativeProfitLossColor(cpl, i, trade_array, pl), fontWeight: 'bold' }}> {
                              is_x != '-' ? cpl = trade_array[i] == trade_array[i - 1] ? Math.round((cpl + (pl * 1.0)) * 100) / 100 : 0.00 : '-'
                            }</td>
                          </tr>
                          )
                          // }
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

        {/* {(locationname == 'app.nextalgo.net' || locationname == 'client.growtechitsolutions.com' || locationname == '180.149.241.128:3000') &&
          } */}
        <p className="text-center h6"><b>सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह परिणाम केवल आज के लिए मान्य है।</b></p>
      </div>

    </>
  );
}
export default Tradehistory;