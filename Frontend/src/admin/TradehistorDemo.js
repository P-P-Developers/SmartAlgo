import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import * as Config from '../common/Config'
import 'react-data-table-component-extensions/dist/index.css'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import ExportToExcel from '../common/ExportToExport'
import { dateFormate } from '../common/CommonDateFormate'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import './admin.css'

function Tradehistory() {
  const [allsignals, setAllSignals] = useState([])
  const [signals, setSignals] = useState([])
  const [cprofit, setCprofit] = useState(0)
  const [quantity, setquantity] = useState(1)
  const [symbol_filter, setSymbol_filter] = useState([])
  const [segment_filter, setSegment_filter] = useState([])
  const [strategy_filter, setStrategy_filter] = useState([])
  const [fromdate, setFromdate] = useState('')
  const [todate, setTodate] = useState('')
  const [fsymbol, setFsymbol] = useState('')
  const [fsegment, setFsegmnet] = useState('')
  const [fstrategy, setFstrategy] = useState('')
  const [refr, setRefr] = useState(true)
  const [loader, setLoader] = useState(false)
  const [lxLine, setLxLine] = useState('')
  const [companyDetails, setCompanyDetails] = useState('')

  const admin_token = localStorage.getItem('token')
  const adminId = localStorage.getItem('adminId')
  const locationname = window.location.host

  var TypeSymbolArray = []
  var TypeSymbolArrayLE = []
  //console.log('TypeSymbolArray -',TypeSymbolArray);
  // console.log('TypeSymbolArrayLE EE -', TypeSymbolArrayLE);

  const fileName = 'TradeHistory'

  var cpl = 0.0
  let pl = 0
  var tcpl = 0
  var trade_array = []
  var is_x

  useEffect(() => {
    setLoader(true)

    axios({
      method: 'get',
      url: `${Config.base_url}smartalgo/symbolsgroup`,
      data: {},
      headers: {
        'x-access-token': admin_token,
      },
    }).then((res1) => {
      setSymbol_filter(res1.data.symbols)
      setLoader(false)
    })
    axios({
      method: 'get',
      url: `${Config.base_url}smartalgo/category`,
      data: {},
      headers: {
        'x-access-token': admin_token,
      },
    }).then((res1) => {
      setSegment_filter(res1.data.category)
      setLoader(false)
    })

    axios({
      method: 'get',
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token,
      },
    }).then((res1) => {
      setStrategy_filter(res1.data.strategy)
      setLoader(false)
    })
    var dformat = new Date().toISOString().substring(0, 10)
    axios({
      method: 'post',
      url: `${Config.base_url}smartalgo/tradehistory`,
      data: {
        adminId: adminId,
        symbol: fsymbol,
        strategy: fstrategy,
        segment: fsegment,
        todate: todate,
        fromdate: fromdate,
      },
      headers: {
        'x-access-token': admin_token,
      },
    }).then((res1) => {
      var rr = res1.data.tradehistory
      console.log("rr",rr);

      var leType = []
      var lxType = []
    

      leType = rr.filter((v) => v.type == 'LE' || v.type == 'SE')
      lxType = rr.filter((v) => v.type == 'LX' || v.type == 'SX')
      // console.log("leType",leType);
      // console.log("lxType",leType);

      function getMatch(a, b) {
        var newArray = []
        var newArrayelse = []

        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < b.length; j++) {
            if (
              leType[i].type !== lxType[j].type &&
              leType[i].trade_symbol == lxType[j].trade_symbol 
          &&  leType[i].strategy_tag == lxType[j].strategy_tag
          &&  leType[i].option_type == lxType[j].option_type

            ) {
              newArray.push(leType[i], lxType[j])
              i++
            } else {
              // newArrayelse.push(leType[i], lxType[j])
              // console.log('newArray', newArrayelse)
            }
          }
        }
        return newArray
      }
  
      let rr5 = getMatch(leType, lxType)
      setSignals(rr5)

      // setSignals(rr)
      setLoader(false)
    })

    axios({
      method: 'get',
      url: `${Config.base_url}admin/system_company`,
    }).then(function (response) {
      // console.log("withbrokersidebar", response);
      setCompanyDetails(response.data.data)
      document.getElementById('title').innerText = response.data.data[0].name
      // var withBrokerName = companyDetails.localeCompare((withbroker) => {
      //  var withBrokerNames = withbroker.withbroker
      //   console.log("withbroker", withBrokerNames);
      // })
    })
  }, [refr, fsymbol, fsegment, fstrategy, todate, fromdate])

  const quantitychange = (e) => {
    if (e.target.value == '') {
      setquantity(1)
    } else {
      setquantity(e.target.value)
    }
  }

  const addcpl = (amt) => {
    tcpl += amt
    return 0.0
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
      setTodate(e.target.value)
    }
    if (e.target.name == 'fromdatename') {
      setFromdate(e.target.value)
    }
  })

  const ProfitLossColor = (sig, i) => {
    // console.log("Hello Data",signals[0].price );\

    var prev_price = 0
    if (sig.type == 'LX' || sig.type == 'SX') {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price
      } else {
        prev_price = 0
      }
    }

    // var plvalue = is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
    //   sig.type == 'LX' ? ((sig.price - prev_price) * (quantity)).toFixed(2)
    //     :
    //     ((prev_price - sig.price) * (quantity)).toFixed(2)
    //   : '-'

    var plvalue = ''

    sig.segment == 'FO' && sig.option_type == 'PUT'
      ? (plvalue = is_x =
          sig.type == 'LX' || sig.type == 'SX'
            ? (pl =
                sig.type == 'LX'
                  ? signals[i - 1].type == 'LE'
                    ? ((prev_price - sig.price) * quantity).toFixed(2)
                    : 0
                  : signals[i - 1].type == 'SE'
                  ? ((sig.price - prev_price) * quantity).toFixed(2)
                  : 0)
            : '-')
      : (plvalue = is_x =
          sig.type == 'LX' || sig.type == 'SX'
            ? (pl =
                sig.type == 'LX'
                  ? signals[i - 1].type == 'LE'
                    ? ((sig.price - prev_price) * quantity).toFixed(2)
                    : 0
                  : signals[i - 1].type == 'SE'
                  ? ((prev_price - sig.price) * quantity).toFixed(2)
                  : 0)
            : '-')

    if (plvalue > 0) {
      return 'green'
    } else if (plvalue == '-') {
      return 'black'
    } else {
      return 'red'
    }
  }

  const CommuLativeProfitLossColor = (cpl, i, trade_array, pl) => {
    var cplvalue =
      is_x != '-'
        ? (cpl =
            trade_array[i] == trade_array[i - 1]
              ? Math.round((cpl + pl * 1.0) * 100) / 100
              : 0.0)
        : '-'
    //console.log('cpl -',cplvalue)
    if (cplvalue > 0) {
      return 'green'
    } else if (cplvalue == '-') {
      return 'black'
    } else {
      return 'red'
    }
  }

  // const getExcelData = () => {
  //   const excelData =
  //      &&
  //     .map((item) => {
  //       delete item.action;
  //       return item;
  //     });
  //   return excelData;
  // };

  const totalCPL = (tcpl, cpl) => {
    //var totalcplvalue = is_x != '-' ? (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2) : tcpl.toFixed(2)
    // console.log('cpl -',totalcplvalue)
    var totalcplvalue = (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2)
    if (totalcplvalue > 0) {
      return 'green'
    } else if (totalcplvalue == '-') {
      return 'black'
    } else {
      return 'red'
    }
  }

  const reset = () => {
    setFromdate('')
    setTodate('')
    setFsymbol('')
    setFsegmnet('')
    setFstrategy('')
  }

  const bgColor = {
    backgroundColor: '#000',
    color: '#fff',
  }

  // setLxLine

  // var lxLines = signals.map((lx, i) => {

  //   if(lx.type == 'LX'){
  //     setLxLine("Trade history is not actual profit and loss")
  //   }

  // })

  return (
    <>
      <div className="content">
        <div className="row">
          <Backdrop
            sx={{
              color: '#000000',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-md-12">
            <div className="card">
              <div className="row">
                {(locationname == 'app.nextalgo.net' ||
                  locationname == 'client.growtechitsolutions.com' ||
                  locationname == '180.149.241.128:3000') && (
                  <h6 className="text-center mt-3">
                    This results is valid for today only, We do not directly or
                    indirectly make any reference to the past or expected future
                    return/performance of the Algorithm.
                    <br />
                    <br />
                  </h6>
                )}

                <p className=" h5 text-center">
                  <b>Trade History</b>
                </p>
                <div className="card-header d-flex">
                  {/* <ExportToExcel
                      className="export-btn"
                      apiData={signals && signals}
                      fileName={fileName}
                      style={{ backgroundColor: "#f96332" }}
                    /> */}

                  {/* <ReactHTMLTableToExcel
                    // id="test-table-xls-button"
                    className="btn btn-color px-1 mx-5  col-3 ms-auto w-15"
                    table='table'
                    filename="tradeHistory"
                    sheet="tablexls"
                    buttonText="Export-Excel"
                  /> */}
                </div>
              </div>
              <div className="card-body">
                <div className="row trade-space">
                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        quantitychange(e)
                      }}
                      min="1"
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>
                      Symbol
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e)
                      }}
                      value={fsymbol}
                      name="symbolname"
                    >
                      <option value="">All</option>
                      {symbol_filter.map((sm, i) => (
                        <option value={sm.symbol}>{sm.symbol}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>
                      Segment
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e)
                      }}
                      value={fsegment}
                      name="segmentname"
                    >
                      <option value="">All</option>
                      {segment_filter.map((sm, i) => (
                        <option value={sm.segment}>{sm.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>From Date</label>
                    <input type="date" value={fromdate} name="fromdatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                  </div> */}

                  {/* <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>End Date</label>
                    <input type="date" value={todate} name="todatename" onChange={(e) => { filterchange(e) }} className="form-control" />
                  </div> */}

                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>
                      STRAT
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        filterchange(e)
                      }}
                      value={fstrategy}
                      name="strategyname"
                    >
                      <option value="">All</option>
                      {strategy_filter.map((sm, i) => (
                        <option value={sm.name}>{sm.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <button className="btn btn-color" onClick={() => reset()}>
                      Reset
                    </button>
                  </div>

                  <div className="col-md-2">
                    <ReactHTMLTableToExcel
                      // id="test-table-xls-button"
                      className="btn btn-color"
                      table="table"
                      filename="tradeHistory"
                      sheet="tablexls"
                      buttonText="Export-Excel"
                    />
                  </div>
                </div>

                <div className="table-responsive tableheight thistory-dark-font">
                  <table
                    className="table tbl-tradehostory"
                    id="table"
                    style={
                      // locationname === '180.149.241.128:3000' ?
                      {
                        backgroundImage:
                          locationname == 'software.a1advanceinfotech.com'
                            ? `url(/images/${
                                companyDetails && companyDetails[0].image
                              })`
                            : '',

                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                      }
                      // : ""
                    }
                  >
                    {/* backgroundImage: `url(/images/${companyDetails && companyDetails[0].image})` */}

                    {/* <img
                      src={`/images/${companyDetails && companyDetails[0].image}`}
                      style={{
                        backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                      }}
                    /> */}

                    <thead
                      className="text-dark thistory-dark-font"
                      style={{ fontWeight: 'bold', color: 'white' }}
                    >
                      <tr>
                        <th
                          className="tradehostory-w"
                          style={{
                            fontWeight: 'bold',
                            color: 'black',
                            width: '100px',
                          }}
                        >
                          Signal
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black !important',
                            width: '200px',
                          }}
                        >
                          Signal Time
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '250px',
                          }}
                        >
                          Symbol
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '100px',
                          }}
                        >
                          STRAT
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '150px',
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '150px',
                          }}
                        >
                          Quantity
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '150px',
                          }}
                        >
                          Entry Price
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '150px',
                          }}
                        >
                          Exit Price
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '150px',
                          }}
                        >
                          P & L
                        </th>
                        <th
                          style={{
                            fontWeight: '900',
                            color: 'black',
                            width: '220px',
                          }}
                        >
                          Cumulative P & L
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {signals.map((sig, i) => {
                        trade_array[i] = sig.trade_symbol

                        if (sig.type == 'LE') {
                          // TypeSymbolArray.push(sig.type + sig.trade_symbol)
                          TypeSymbolArrayLE.push(sig)
                        }
                        // if (!(trade_array[i] == trade_array[i - 1] && signals[i].type == signals[i - 1].type)) {
                        cpl =
                          trade_array[i] == trade_array[i - 1]
                            ? cpl
                            : addcpl(cpl)

                        var prev_price = 0
                        if (sig.type == 'LX' || sig.type == 'SX') {
                          if (signals[i - 1]) {
                            prev_price = signals[i - 1].price
                          } else {
                            prev_price = 0
                          }
                        }
                        // {sig.type == 'LX' ? <p>Trade history is not actual profit and loss</p> : ''}

                        return (
                          <>
                            <tr>
                              <td>{sig.signal_id}</td>
                              <td>{dateFormate(sig.created_at)}</td>
                              <td>
                                {sig.trade_symbol}
                                <b>[{sig.segment}]</b>
                              </td>

                              <td>{sig.strategy_tag}</td>
                              <td>{sig.type}</td>
                              <td>{quantity}</td>
                              <td>
                                {sig.type == 'LE' || sig.type == 'SE'
                                  ? sig.price
                                  : '-'}
                              </td>
                              <td>
                                {sig.type == 'LX' || sig.type == 'SX'
                                  ? sig.price
                                  : '-'}
                              </td>
                              <td
                                style={{
                                  color: ProfitLossColor(sig, i),
                                  fontWeight: 'bold',
                                }}
                              >
                                {
                                  // is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  //   sig.type == 'LX' ?
                                  //     ((sig.price && sig.price - signals[i - 1].price && signals[i - 1].price) * quantity).toFixed(2)
                                  //     :
                                  //     ((signals[i - 1].price && signals[i - 1].price - sig.price && sig.price) * quantity).toFixed(2)
                                  //   : '-'

                                  sig.segment == 'FO' &&
                                  sig.option_type == 'PUT'
                                    ? (is_x =
                                        sig.type == 'LX' || sig.type == 'SX'
                                          ? (pl =
                                              sig.type == 'LX'
                                                ? signals[i - 1].type == 'LE'
                                                  ? (
                                                      (prev_price - sig.price) *
                                                      quantity
                                                    ).toFixed(2)
                                                  : 0
                                                : signals[i - 1].type == 'SE'
                                                ? (
                                                    (sig.price - prev_price) *
                                                    quantity
                                                  ).toFixed(2)
                                                : 0)
                                          : '-')
                                    : (is_x =
                                        sig.type == 'LX' || sig.type == 'SX'
                                          ? (pl =
                                              sig.type == 'LX'
                                                ? signals[i - 1].type == 'LE'
                                                  ? (
                                                      (sig.price - prev_price) *
                                                      quantity
                                                    ).toFixed(2)
                                                  : 0
                                                : signals[i - 1].type == 'SE'
                                                ? (
                                                    (prev_price - sig.price) *
                                                    quantity
                                                  ).toFixed(2)
                                                : 0)
                                          : '-')
                                }
                              </td>

                              <td
                                style={{
                                  color: CommuLativeProfitLossColor(
                                    cpl,
                                    i,
                                    trade_array,
                                    pl,
                                  ),
                                  fontWeight: 'bold',
                                }}
                              >
                                {' '}
                                {is_x != '-'
                                  ? (cpl =
                                      trade_array[i] == trade_array[i - 1]
                                        ? Math.round((cpl + pl * 1.0) * 100) /
                                          100
                                        : 0.0)
                                  : '-'}
                              </td>
                            </tr>

                            {locationname == 'software.adonomist.com' && (
                              <tr>
                                <td colspan="3"></td>
                                <td colspan="7">
                                  {sig.type == 'LX' || sig.type == 'SX' ? (
                                    <span>
                                      Trade history is not actual profit and
                                      loss
                                    </span>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        )
                        //   }
                      })}
                    </tbody>
                    {
                      <tfoot>
                        <tr>
                          <td></td>
                          <td
                            colspan="8"
                            style={{ fontWeight: 'bold', fontSize: '15px' }}
                          >
                            Total cumulative P&L
                          </td>
                          <td
                            style={{
                              color: totalCPL(tcpl, cpl),
                              fontWeight: 'bold',
                              fontSize: '15px',
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
        {(locationname == 'app.nextalgo.net' ||
          locationname == 'client.growtechitsolutions.com' ||
          locationname == '180.149.241.128:3000') && (
          <p className="text-center h6">
            <b>
              सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं
              और इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के
              उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह
              परिणाम केवल आज के लिए मान्य है।
            </b>
          </p>
        )}
      </div>
    </>
  )
}
export default Tradehistory
