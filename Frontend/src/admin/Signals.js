import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import * as Config from "../common/Config";
import DataTable from "react-data-table-component";
import { dateFormate } from "../common/CommonDateFormate";
import DataTableExtensions from "react-data-table-component-extensions";
import DatePicker from "react-datepicker";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';


const Signals = () => {

  const [params] = new useSearchParams(window.location.search);
  const [loader, setLoader] = useState(false);
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const fileName = "Signals";

  // console.log('param', params.get("active"));
  // console.log('window.location.search', window.location.search);


  const columns = [
    {
      name: "S.No.",
      selector: (row) => row.id,
      width: '70px !important'
    },
    {
      name: "SIG.ID",
      selector: (row) => row.signal_id,
      width: '70px !important'
    },
    {
      name: "SIGNALS TIME",
      selector: (row) => row.create_date,
      // overflow: 'visible !important',
      width: '160px !important'
    },
    {
      name: "CAT.",
      selector: (row) => row.cat_name,
      // when: row => row.calories == 'LX',
      // style: row => ({ backgroundColor: row.cat_name ? 'pink' : '#8AFFFF' }),
      justifyContent: 'center !important',
      width: '60px !important'
    },
    {
      name: "TRADE SYMBOL",
      selector: (row) => row.trade_symbol + " " + "[" + row.segment + "]",
      overflow: 'visible !important',
      width: '280px !important'
    },
    {
      name: "MESSAGE",
      selector: (row) => row.msg,
      width: '200px !important',
      overflow: 'visible !important',
    },
    {
      name: "PRICE",
      selector: (row) => row.price,
    },
    {
      name: "STRATEGY",
      selector: (row) => row.strategy,
    },
  ];
  

  const [qrefresh, setQrefresh] = useState(window.location.search);
  const [signals, setSignals] = useState([]);
  // console.log("signals", signals);
  const [symbol_filter, setSymbol_filter] = useState([]);
  const [segment_filter, setSegment_filter] = useState([]);
  const [strategy_filter, setStrategy_filter] = useState([]);
  const [fsymbol, setFsymbol] = useState("");
  const [fstrategy, setFstrategy] = useState("");
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [fsegment, setFsegmnet] = useState("");
  const [refresh, setRefresh] = useState(false)
  const [symbolColors, setSymbolColors] = useState("")
  // console.log("symbolColors", symbolColors && symbolColors);

  const [tableData, settableData] = useState({
    columns,
    signals,
  });
  const navigate = useNavigate()
  const location = useLocation();
  // console.log("navlocation", location);
  var data = [];

  var addDays = function (str, days) {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate;
  };

  var todate1 = addDays(todate, 1);
  var fromdate1 = addDays(fromdate, 0);

  const Signals = async () => {
    setLoader(true)

    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/signals`,
      data: {
        'adminId': adminId,
        symbol: fsymbol,
        strategy: fstrategy,
        segment: fsegment,
        todate: todate && todate1.toISOString(),
        fromdate: fromdate && fromdate1.toISOString(),
      },
      headers: {
        'x-access-token': admin_token
      }

    }).then((res1) => {
      //  console.log('dsadsadsad' , res1.data.tradehistory[0].created_at);
      var rr = res1.data.signals;

      if (params.get("active") == 1) {
        // console.log('okkkk');
        var act_sig_index = [];
        for (var i = 0; i < rr.length - 1; i++) {

          if (rr[i].type == 'LE') {
            if (rr[i].trade_symbol != rr[i + 1].trade_symbol) {
              act_sig_index.push(i);
            }
          }
          if (rr[i].type == 'SE') {
            if (rr[i].trade_symbol != rr[i + 1].trade_symbol) {
              act_sig_index.push(i);
            }
          }
        }
        if (rr[rr.length - 1].type == 'LE' || rr[rr.length - 1].type == 'SE') {
          act_sig_index.push(rr.length - 1);
        }
        rr.map((cl, index) => {
          if (act_sig_index.includes(index))
            data.push({
              signal_id: cl.signal_id,
              // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
              create_date: dateFormate(cl.created_at),
              cat_name: cl.type,
              trade_symbol: cl.trade_symbol,
              msg: signalMsg(cl),
              price: cl.price,
              strategy: cl.strategy_tag,
            })
        }
        );
      }
      else if (params.get("profit") == 1) {
        var profit_sig_index = [];
        for (var i = 0; i < rr.length - 1; i++) {

          if (rr[i].trade_symbol == rr[i + 1].trade_symbol) {
            if (rr[i].type == 'LE' && rr[i + 1].type == 'LX') {
              if (rr[i + 1].price - rr[i].price > 0) {
                profit_sig_index.push(i);
                profit_sig_index.push(i + 1);
              }
            }

            if (rr[i].type == 'SE' && rr[i + 1].type == 'SX') {

              if (rr[i].price - rr[i + 1].price > 0) {
                profit_sig_index.push(i);
                profit_sig_index.push(i + 1);
              }
            }
          }
        }
        rr.map((cl, index) => {
          if (profit_sig_index.includes(index))
            data.push({
              signal_id: cl.signal_id,
              // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
              create_date: dateFormate(cl.created_at),
              cat_name: cl.type,
              trade_symbol: cl.trade_symbol,
              msg: signalMsg(cl),
              price: cl.price,
              strategy: cl.strategy_tag,
            })
        }
        );
      }
      else if (params.get("loss") == 1) {

        var loss_sig_index = [];
        for (var i = 0; i < rr.length - 1; i++) {
          if (rr[i].trade_symbol == rr[i + 1].trade_symbol) {
            if (rr[i].type == 'LE' && rr[i + 1].type == 'LX') {
              if (rr[i + 1].price - rr[i].price < 0) {
                loss_sig_index.push(i);
                loss_sig_index.push(i + 1);
              }
            }

            if (rr[i].type == 'SE' && rr[i + 1].type == 'SX') {

              if (rr[i].price - rr[i + 1].price < 0) {
                loss_sig_index.push(i);
                loss_sig_index.push(i + 1);
              }
            }
          }
        }
        rr.map((cl, index) => {
          if (loss_sig_index.includes(index))
            data.push({
              signal_id: cl.signal_id,
              // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
              create_date: dateFormate(cl.created_at),
              cat_name: cl.type,
              trade_symbol: cl.trade_symbol,
              msg: signalMsg(cl),
              price: cl.price,
              strategy: cl.strategy_tag,
            })
        }
        );

      }
      else if (params.get("active") != 1) {
        // console.log('if param null');
        rr.map((cl, i) =>
          data.push({
            id: i + 1,
            signal_id: cl.signal_id,
            // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
            create_date: dateFormate(cl.created_at),
            // cat_name: cl.type,
            cat_name: cl.type,
            trade_symbol: cl.trade_symbol,
            msg: signalMsg(cl),
            price: cl.price,
            strategy: cl.strategy_tag,
            segment: cl.segment
          })
        );
      }
      setSignals(rr);
      settableData({
        columns,
        data,
      });
      setLoader(false)
    });

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/symbolsgroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      setSymbol_filter(res1.data.symbols);
      setLoader(false)

    });
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/category`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      setSegment_filter(res1.data.category);
      setLoader(false)
    });

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      setStrategy_filter(res1.data.strategy);
      setLoader(false)
    });
  };

  const signalMsg = (data) => {
    if (data.type === "LX") {
      return `Buy Trade Exit At `;
    }
    if (data.type === "LE") {
      return `Buy Trade Executed At `;
    }
    if (data.type === "SX") {
      return `Sell Trade Exit At `;
    }
    if (data.type === "SE") {
      return `Sell Trade Executed At `;
    }
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
  });

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  if (window.location.search != qrefresh) {
    Signals();
    setQrefresh(window.location.search);
  }
  useEffect(() => {
    Signals();
  }, [fsymbol, fsegment, fstrategy, todate, fromdate, refresh]);

  const resetFilters = () => {
    setFsymbol("");
    setFstrategy("");
    setFsegmnet("");
    setTodate("");
    setFromdate("")
  }

  const conditionalRowStyles = [
    {
      when: row => row.cat_name.includes(symbolColors),
      style: row => ({ backgroundColor: row.cat_name ? '#8AFFFF' : 'pink' }),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: '700',
        // margin:' 19px 0px',
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
        overflow: 'visible !important',
      },
    },
    rows: {
      style: {
        overflow: 'visible !important',
        // justifyContent: 'center !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };


  const refreshpage = () => {
    setRefresh(!refresh)
    navigate('/admin/signals')
    // /admin/reports
  }

  return (
    <>
      <div className="content">
        <div className="row">
          <Backdrop
            sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
          // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="card-title">Signals</h4>
                  </div>

                  <div className="col-md-6 text-right">
                    <ExportToExcel
                      className="export-btn btn-color ms-auto d-flex"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                      style={{ backgroundColor: "#f96332" }}
                    />
                    <button className='btn btn-color' onClick={refreshpage} >Refresh</button>
                  </div>

                </div>
              </div>
              <div className="card-body top_spacing ">
                <div className="row">
                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      SYMBOLS
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e);
                      }}
                      value={fsymbol}
                      name="symbolname"
                    >
                      <option value="">ALL</option>
                      {symbol_filter.map((sm, i) => (
                        <option key={i} value={sm.symbol}>{sm.symbol}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      SEGMENT
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
                        <option key={i} value={sm.segment}>{sm.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="col-md-2 ">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      START DATE
                    </label>
                    <DatePicker
                      selected={fromdate}
                      onChange={(date) => setFromdate(date)}
                      selectsStart
                      startDate={fromdate}
                      className="form-control"
                      filterDate={isWeekday}
                      endDate={todate}
                      maxDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Start Date"
                    />
                  </div> */}

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      END DATE
                    </label>
                    <DatePicker
                      selected={todate}
                      onChange={(date) => setTodate(date)}
                      selectsEnd
                      startDate={fromdate}
                      className="form-control"
                      filterDate={isWeekday}
                      maxDate={new Date()}
                      endDate={todate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="End Date"
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

                  <div className="col-md-2">
                    <button className="btn btn-color" onClick={resetFilters} >
                      Reset
                    </button>

                  </div>

                </div>
                <div className="row d-flex justify-content-end">
                  <div className="table-responsive my-4">
                    <DataTableExtensions {...tableData}
                      export={false}
                      print={false}
                    >
                      <DataTable
                        fixedHeader
                        fixedHeaderScrollHeight="700px"
                        columns={columns}
                        data={signals}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        customStyles={customStyles}
                        // conditionalRowStyles={conditionalRowStyles}
                        highlightOnHover
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}

                      />
                    </DataTableExtensions>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signals;
