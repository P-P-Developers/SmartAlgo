import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import * as Config from "../common/Config";
import "react-data-table-component-extensions/dist/index.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { dateFormate } from "../common/CommonDateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./admin.css";

function TradeHistoryNew() {
  const [allsignals, setAllSignals] = useState([]);
  const [signals, setSignals] = useState([]);
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
  const [refr, setRefr] = useState(true);
  const [loader, setLoader] = useState(false);
  const [lxLine, setLxLine] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [search, setSearch] = useState([]);

  const [searchFilter, setSearchFilter] = useState([]);

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const locationname = window.location.host;

  var TypeSymbolArray = [];
  var TypeSymbolArrayLE = [];

  var cpl = 0.0;
  let pl = 0;
  var tcpl = 0;
  var trade_array = [];
  var is_x;

  const getTradeHistoryData = () => {
    axios({
      method: "post",
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
        "x-access-token": admin_token,
      },
    }).then((res1) => {
      setAllSignals(res1.data.tradehistory)
      var singalData = res1.data.tradehistory

      singalData.filter((item) => {
        if (item.trade_symbol && item.type == "LE") {
          console.log("LE", item);
        } else if (item.trade_symbol && item.type == "LX") {
          console.log("LX", item);

        } else if (item.trade_symbol && item.type == "SE") {
          console.log("SE", item);

        }
        else if (item.trade_symbol && item.type == "SX") {
          console.log("SX", item);

        }
      })

    })
  }

  useEffect(() => {
    getTradeHistoryData()

  }, [])

  return (
    <>
      <div className="content">
        <div className="row">
          <Backdrop
            sx={{
              color: "#000000",
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
                <p className=" h5 text-center">
                  <b>Trade History</b>
                </p>
                <div className="card-header d-flex"></div>
              </div>

              <div className="card-body">
                <div className="table-responsive tableheight thistory-dark-font">
                  <table className="table tbl-tradehostory" id="table">
                    <thead
                      className="text-dark thistory-dark-font"
                      style={{ fontWeight: "bold", color: "white" }}
                    >
                      <tr>
                        <th
                          className="tradehostory-w"
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            width: "100px",
                          }}
                        >
                          S.No
                        </th>
                        <th
                          className="tradehostory-w"
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            width: "100px",
                          }}
                        >
                          Signal Id
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black !important",
                            width: "200px",
                          }}
                        >
                          Signal Time
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "250px",
                          }}
                        >
                          Symbol
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "100px",
                          }}
                        >
                          STRAT
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "150px",
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "150px",
                          }}
                        >
                          Quantity
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "150px",
                          }}
                        >
                          Entry Price
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "150px",
                          }}
                        >
                          Exit Price
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "150px",
                          }}
                        >
                          P & L
                        </th>
                        <th
                          style={{
                            fontWeight: "900",
                            color: "black",
                            width: "220px",
                          }}
                        >
                          Cumulative P & L
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allsignals.map((sig, i) => {


                        return (
                          <>
                            <tr key={i}>
                              <td>{i + 1}</td>
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
                                {sig.type == "LE" || sig.type == "SE"
                                  ? sig.price
                                  : "-"}
                              </td>
                              <td>
                                {sig.type == "LX" || sig.type == "SX"
                                  ? sig.price
                                  : "-"}
                              </td>

                              <td
                                style={{
                                  //   color: ProfitLossColor(sig, i),
                                  fontWeight: "bold",
                                }}
                              >

                              </td>
                            </tr>

                            {locationname == "software.adonomist.com" && (
                              <tr>
                                <td colspan="3"></td>
                                <td colspan="7">
                                  {sig.type == "LX" || sig.type == "SX" ? (
                                    <span>
                                      Trade history is not actual profit and
                                      loss
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        );
                        //   }
                      })}
                    </tbody>
                    {
                      <tfoot>
                        <tr>
                          <td></td>
                          <td
                            colspan="9"
                            style={{ fontWeight: "bold", fontSize: "15px" }}
                          >
                            Total cumulative P&L
                          </td>
                          <td
                            style={{
                              //   color: totalCPL(tcpl, cpl),
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
}
export default TradeHistoryNew;
