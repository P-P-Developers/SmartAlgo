import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import "react-data-table-component-extensions/dist/index.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { dateFormate } from "../common/CommonDateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Alert, Form, Row } from "react-bootstrap";
import "./admin.css";
import $ from "jquery";
import CryptoJS from "crypto-js";
import socketIOClient from "socket.io-client";
import Modal from "react-bootstrap/Modal";
import { TextField } from "@mui/material";
import Button from "react-bootstrap/Button";

function Tradehistory() {
  const [sockets, setSockets] = useState(null);
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
  const roleId = localStorage.getItem("roleId");
  const locationname = window.location.host;
  const [panelKey, setPanelKey] = useState("");

  // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(false);

  // const navigate = useNavigate()
  // navigate('/admin/signals', { state: signals})
  // const location = useLocation();

  var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
  var AuthorizationToken;
  var type = "API";

  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let socket;

  var TypeSymbolArray = [];
  var TypeSymbolArrayLE = [];

  const fileName = "TradeHistory";

  var cpl = 0.0;
  let pl = 0;
  var tcpl = 0;
  var trade_array = [];
  var is_x;

  useEffect(() => {
    GetBrokerKey();
    getTokenTradingApi();
    getPanelKey();
    setLoader(true);

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/symbolsgroup`,
      data: {},
      headers: {
        "x-access-token": admin_token,
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
        "x-access-token": admin_token,
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
        "x-access-token": admin_token,
      },
    }).then((res1) => {
      setStrategy_filter(res1.data.strategy);
      setLoader(false);
    });
    var dformat = new Date().toISOString().substring(0, 10);
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
      var rr = res1.data.tradehistory;

      //-------LE LX ---------------
      var leType = [];
      var lxType = [];
      var seType = [];
      var sxType = [];

      // Filter signal type
      leType = rr.filter((v) => v.type == "LE");
      lxType = rr.filter((v) => v.type == "LX");
      seType = rr.filter((v) => v.type == "SE");
      sxType = rr.filter((v) => v.type == "SX");

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

      leType.forEach(function (item) {
        lxType.forEach(function (item1) {
          if (!indexArray.includes(item1.id)) {
            if (!indexArray.includes(item.id)) {
              if (
                item.trade_symbol == item1.trade_symbol &&
                item.segment == item1.segment &&
                item.strategy_tag == item1.strategy_tag &&
                new Date(item.created_at) < new Date(item1.created_at)
              ) {
                indexArray.push(item.id);
                indexArray.push(item1.id);

                if (item.id) {
                  newArrayPair.push(item);
                }
                if (item1.id) {
                  newArrayPair.push(item1);
                }

                if (newArrayPair.length == 2) {
                  arOfarr.push({
                    trade_symbol: item.trade_symbol,
                    array: newArrayPair,
                  });
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
              if (
                item.trade_symbol == item1.trade_symbol &&
                item.segment == item1.segment &&
                item.strategy_tag == item1.strategy_tag &&
                new Date(item.created_at) < new Date(item1.created_at)
              ) {
                indexArray1.push(item.id);
                indexArray1.push(item1.id);

                if (item.id) {
                  newArrayPair1.push(item);
                }
                if (item1.id) {
                  newArrayPair1.push(item1);
                }

                if (newArrayPair1.length == 2) {
                  arOfarr1.push({
                    trade_symbol: item.trade_symbol,
                    array: newArrayPair1,
                  });
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
          arOfarr.push({ trade_symbol: item.trade_symbol, array: item });
        }
      });

      lxType.forEach(function (item) {
        if (!indexArray.includes(item.id)) {
          newArray.push(item);
          arOfarr.push({ trade_symbol: item.trade_symbol, array: item });
        }
      });

      seType.forEach(function (item) {
        if (!indexArray1.includes(item.id)) {
          newArray1.push(item);
          arOfarr1.push({ trade_symbol: item.trade_symbol, array: item });
        }
      });

      sxType.forEach(function (item) {
        if (!indexArray1.includes(item.id)) {
          newArray1.push(item);
          arOfarr1.push({ trade_symbol: item.trade_symbol, array: item });
        }
      });

      var objs = arOfarr.concat(arOfarr1);
      //  var objs = arOfarr.concat(arOfarr1);

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
      r.forEach((element) => {
        if (element.array.length > 0) {
          element.array.forEach((element1) => {
            arrayfind1.push(element1);
          });
        } else {
          arrayfind1.push(element.array);
        }
      });

      // --------------------- MY COde -----------------

      // let filteredArr = rr.slice();
      // let index = 0;

      // while (filteredArr[index].type === 'LX' || filteredArr[index].type === 'SX') {
      //   let element = filteredArr.shift();
      //   filteredArr.push(element);
      // }

      var token_string = [];

      arrayfind1.forEach((sig, i) => {
        if (
          (sig.segment == "FO" || sig.segment == "MO") &&
          sig.option_type == "PUT"
        ) {
          if (sig.type == "LE") {
            if (signals[i + 1] != undefined) {
              if (
                signals[i + 1].type == "LX" &&
                new Date(signals[i + 1].created_at) >
                  new Date(sig.created_at) &&
                signals[i + 1].trade_symbol == sig.trade_symbol
              ) {
                // return '';
              } else {
                if (
                  !token_string.includes(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  )
                ) {
                  token_string.push(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  );
                }
              }
            } else {
              if (
                !token_string.includes(
                  sig.exchange_symbol + "|" + sig.token + "#"
                )
              ) {
                token_string.push(sig.exchange_symbol + "|" + sig.token + "#");
              }
            }
          } else if (sig.type == "SE") {
            if (signals[i + 1] != undefined) {
              if (
                signals[i + 1].type == "SX" &&
                new Date(signals[i + 1].created_at) >
                  new Date(sig.created_at) &&
                signals[i + 1].trade_symbol == sig.trade_symbol
              ) {
                //  return '';
              } else {
                if (
                  !token_string.includes(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  )
                ) {
                  token_string.push(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  );
                }
              }
            } else {
              if (
                !token_string.includes(
                  sig.exchange_symbol + "|" + sig.token + "#"
                )
              ) {
                token_string.push(sig.exchange_symbol + "|" + sig.token + "#");
              }
            }
          }
        } else {
          if (sig.type == "LE") {
            if (signals[i + 1] != undefined) {
              if (
                signals[i + 1].type == "LX" &&
                new Date(signals[i + 1].created_at) >
                  new Date(sig.created_at) &&
                signals[i + 1].trade_symbol == sig.trade_symbol
              ) {
                //  return '';
              } else {
                if (
                  !token_string.includes(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  )
                ) {
                  token_string.push(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  );
                }
              }
            } else {
              if (
                !token_string.includes(
                  sig.exchange_symbol + "|" + sig.token + "#"
                )
              ) {
                token_string.push(sig.exchange_symbol + "|" + sig.token + "#");
              }
            }
          } else if (sig.type == "SE") {
            if (signals[i + 1] != undefined) {
              if (
                signals[i + 1].type == "SX" &&
                new Date(signals[i + 1].created_at) >
                  new Date(sig.created_at) &&
                signals[i + 1].trade_symbol == sig.trade_symbol
              ) {
                // return '';
              } else {
                if (
                  !token_string.includes(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  )
                ) {
                  token_string.push(
                    sig.exchange_symbol + "|" + sig.token + "#"
                  );
                }
              }
            } else {
              if (
                !token_string.includes(
                  sig.exchange_symbol + "|" + sig.token + "#"
                )
              ) {
                token_string.push(sig.exchange_symbol + "|" + sig.token + "#");
              }
            }
          }
        }
      });

      let tokenStr = token_string.join(",").replace(/,/g, "");

      // tokenStringReg(tokenStr.substring(0, tokenStr.length - 1));

      function tokenStringReg(token) {
        // alert(token);
        if (sockets == null) {
          //    runSocket(token);
          var userid = "438760";
          var usersession =
            "LGlOQjn1nmn7z4qz8VNloY6LVqVcKaoVePzuJo2k9WahSxpftt84DsPQN6ahjDAOMWv3tXtnexr1lADchRkS81x6YQftkH3I3JOc4yGvP2PzrzZSo5Xnbls1kdh3bV8V0kLuHxjJXbEae4HhXFC2DtBtE9den74Wdmv8G2411rmTDHM2kkJyonmDToFxoC78q5b1N3VKE27kWUQKmOiAoHM1Hc9fPSTFnZs6EUXrShtTEpWrI15NEOGW4kDeNo1G";

          createSession(userid, usersession, token);
        }
      }

      //------------- socket code start -------------//

      const runSocket = (token) => {
        var config = {
          method: "get",
          url: `${Config.base_url}api/alicebluetoken`,
          headers: {},
        };

        axios(config)
          .then(function (response) {
            if (response.data.status == "true") {
              // invalidateSession(
              //   response.data.data[0].client_code,
              //   response.data.data[0].access_token
              // );

              createSession(
                response.data.data[0].client_code,
                response.data.data[0].access_token,
                token
              );
            } else {
            }
          })
          .catch(function (error) {});
      };

      function createSession(userId, userSession, token) {
        //   alert('create session')
        AuthorizationToken = "Bearer " + userId + " " + userSession;

        let jsonObj = {
          loginType: type,
        };
        $.ajax({
          url: BASEURL + "api/ws/createSocketSess",
          headers: {
            Authorization: AuthorizationToken,
          },
          type: "post",
          data: JSON.stringify(jsonObj),
          contentType: "application/json",
          dataType: "json",
          async: false,
          success: function (msg) {
            var data = JSON.stringify(msg);
            if (msg.stat === "Ok") {
              connect(userId, userSession, token);
            } else {
              alert(msg);
            }
          },
        });
      }

      function connect(userId, userSession, token) {
        socket = new WebSocket(url);
        socket.onopen = function () {
          // alert("socket open");
          connectionRequest(userId, userSession);
          setSockets(socket);
        };

        socket.onmessage = function (msg) {
          var response = JSON.parse(msg.data);

          const old_val = $(".live_data" + response.tk).html();

          if (response.tk) {
            if (response.bp1 != undefined) {
              $(".bp1_price" + response.tk).html(response.bp1);
            }
            if (response.sp1 != undefined) {
              $(".sp1_price" + response.tk).html(response.sp1);
            }

            const pl_live = $(".get_pl_live" + response.tk).html();
            const pl_qty = $(".get_qty" + response.tk).html();

            if (pl_live != undefined) {
              const type = pl_live.slice(-2);
              const price = pl_live.slice(0, -2);

              if (type == "LE") {
                if (response.bp1 != undefined) {
                  $(".live_data" + response.tk).html(response.bp1);
                  const new_val = $(".live_data" + response.tk).html();

                  if (new_val > old_val) {
                    $(".live_data" + response.tk).css({ color: "green" });
                  } else if (new_val < old_val) {
                    $(".live_data" + response.tk).css({ color: "red" });
                  } else if (new_val == old_val) {
                    $(".live_data" + response.tk).css({ color: "black" });
                  }

                  const live_pl =
                    (parseFloat(response.bp1) - parseFloat(price)) * pl_qty;

                  $(".pl_live" + response.tk).html(live_pl.toFixed(2));
                  if (live_pl > 0) {
                    $(".pl_live" + response.tk).css({ color: "green" });
                  } else if (live_pl < 0) {
                    $(".pl_live" + response.tk).css({ color: "red" });
                  } else if (live_pl == 0) {
                    $(".pl_live" + response.tk).css({ color: "black" });
                  }

                  $(".cpl_single" + response.tk).html(live_pl.toFixed(2));
                  if (live_pl > 0) {
                    $(".cpl_single" + response.tk).css({ color: "green" });
                  } else if (live_pl < 0) {
                    $(".cpl_single" + response.tk).css({ color: "red" });
                  } else if (live_pl == 0) {
                    $(".cpl_single" + response.tk).css({ color: "black" });
                  }
                }
              } else if (type == "SE") {
                if (response.sp1 != undefined) {
                  $(".live_data" + response.tk).html(response.sp1);
                  const new_val = $(".live_data" + response.tk).html();

                  if (new_val > old_val) {
                    $(".live_data" + response.tk).css({ color: "green" });
                  } else if (new_val < old_val) {
                    $(".live_data" + response.tk).css({ color: "red" });
                  } else if (new_val == old_val) {
                    $(".live_data" + response.tk).css({ color: "black" });
                  }

                  const live_pl =
                    (parseFloat(price) - parseFloat(response.sp1)) * pl_qty;

                  $(".pl_live" + response.tk).html(live_pl.toFixed(2));

                  if (live_pl > 0) {
                    $(".pl_live" + response.tk).css({ color: "green" });
                  } else if (live_pl < 0) {
                    $(".pl_live" + response.tk).css({ color: "red" });
                  } else if (live_pl == 0) {
                    $(".pl_live" + response.tk).css({ color: "black" });
                  }

                  $(".cpl_single" + response.tk).html(live_pl.toFixed(2));
                  if (live_pl > 0) {
                    $(".cpl_single" + response.tk).css({ color: "green" });
                  } else if (live_pl < 0) {
                    $(".cpl_single" + response.tk).css({ color: "red" });
                  } else if (live_pl == 0) {
                    $(".cpl_single" + response.tk).css({ color: "black" });
                  }
                }
              }
            }
          }

          if (response.s == "OK") {
            let json = {
              k: token,
              t: "t",
            };
            socket.send(JSON.stringify(json));
          }
        };

        socket.onclose = function (event) {
          if (event.wasClean) {
            // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            //runSocket("", second_channel, openpositionchannel)
            //  connectionRequest(userId, userSession);
          } else {
            // runSocket("", second_channel, openpositionchannel)
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            // alert('[close] Connection died');
          }
        };

        socket.onerror = function (error) {
          // runSocket("", second_channel, openpositionchannel)
          //  alert(`[error]`);
        };
      }

      //$(".live_data3045").html("shakir");

      function connectionRequest(userId, userSession) {
        var encrcptToken = CryptoJS.SHA256(
          CryptoJS.SHA256(userSession).toString()
        ).toString();
        // alert(encrcptToken);
        var initCon = {
          susertoken: encrcptToken,
          t: "c",
          actid: userId + "_" + type,
          uid: userId + "_" + type,
          source: type,
        };
        socket.send(JSON.stringify(initCon));
      }

      //------------- socket code end -------------//

      // --------------------- MY COde -----------------

      var firstElement = [];

      arrayfind1.forEach((val) => {
        if (arrayfind1[0].type == "LX" || arrayfind1[0].type == "SX") {
          firstElement = arrayfind1.splice(0, 1);
          arrayfind1.push(firstElement[0]);
        }
      });

      console.log(arrayfind1);

      if (arrayfind1.length == 1) {
        arrayfind1.forEach((val) => {
          if (arrayfind1[0].type == "LX" || arrayfind1[0].type == "SX") {
          } else {
            setSignals(arrayfind1);
            setSearchFilter(arrayfind1);
          }
        });
      } else {
        setSignals(arrayfind1);
        setSearchFilter(arrayfind1);
      }

      //----------------------------------------------
      // setSignals(rr);
      setLoader(false);
    });

    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
    }).then(function (response) {
      setCompanyDetails(response.data.data);
      document.getElementById("title").innerText = response.data.data[0].name;
      // var withBrokerName = companyDetails.localeCompare((withbroker) => {
      //  var withBrokerNames = withbroker.withbroker

      // })
    });
  }, [refr, fsymbol, fsegment, fstrategy, todate, fromdate, refreshscreen]);

  const quantitychange = (e) => {
    if (e.target.value == "") {
      setquantity(1);
    } else {
      setquantity(e.target.value);
    }
  };

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
    if (sig.type == "LX" || sig.type == "SX") {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price;
      } else {
        prev_price = 0;
      }
    }

    var plvalue = "";

    var pl = 0;

    // if ((sig.segment.toUpperCase() == 'FO' || sig.segment.toUpperCase() == 'MO') && sig.option_type.toUpperCase() == 'PUT') {
    if (
      ["FO", "MFO", "CFO", "BFO"].includes(sig.segment.toUpperCase()) &&
      sig.option_type.toUpperCase() == "PUT"
    ) {
      if (sig.type == "LX" && i != 0) {
        if (
          signals[i - 1].type == "LE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          // pl = ((prev_price - sig.price) * (quantity)).toFixed(2);
          pl = ((prev_price - sig.price) * quantity).toFixed(2);
        } else {
          pl = 0;
        }
      } else if (sig.type == "SX" && i != 0) {
        if (
          signals[i - 1].type == "SE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((sig.price - prev_price) * quantity).toFixed(2);
        } else {
          pl = 0;
        }
      } else {
        pl = 0;
      }
    } else {
      if (sig.type == "LX" && i != 0) {
        if (
          signals[i - 1].type == "LE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((sig.price - prev_price) * quantity).toFixed(2);
        } else {
          pl = 0;
        }
      } else if (sig.type == "SX" && i != 0) {
        if (
          signals[i - 1].type == "SE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((prev_price - sig.price) * quantity).toFixed(2);
        } else {
          pl = 0;
        }
      } else {
        pl = 0;
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

    if (pl > 0) {
      return "green";
    } else if (pl == "-") {
      return "black";
    } else if (pl == 0) {
      return "black";
    } else {
      return "red";
    }
  };

  const include_td_profitLoss = (sig, i) => {
    var prev_price = 0;
    if (sig.type == "LX" || sig.type == "SX") {
      if (signals[i - 1]) {
        prev_price = signals[i - 1].price;
      } else {
        prev_price = 0;
      }
    }

    var plvalue = "";
    let istrue = true;

    var pl = 0;

    // if ((sig.segment.toUpperCase() == 'FO' || sig.segment.toUpperCase() == 'MO') && sig.option_type.toUpperCase() == 'PUT') {
    if (
      ["FO", "MFO", "CFO", "BFO"].includes(sig.segment.toUpperCase()) &&
      sig.option_type.toUpperCase() == "PUT"
    ) {
      if (sig.type == "LX" && i != 0) {
        if (
          signals[i - 1].type == "LE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((prev_price - sig.price) * quantity).toFixed(2);
        } else {
          pl = "-";
        }
      } else if (sig.type == "SX" && i != 0) {
        if (
          signals[i - 1].type == "SE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((sig.price - prev_price) * quantity).toFixed(2);
        } else {
          pl = "-";
        }
      } else {
        pl = "-";
      }
    } else {
      if (sig.type == "LX" && i != 0) {
        if (
          signals[i - 1].type == "LE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((sig.price - prev_price) * quantity).toFixed(2);
        } else {
          pl = "-";
        }
      } else if (sig.type == "SX" && i != 0) {
        if (
          signals[i - 1].type == "SE" &&
          new Date(signals[i - 1].created_at) < new Date(sig.created_at) &&
          signals[i - 1].trade_symbol == sig.trade_symbol
        ) {
          pl = ((prev_price - sig.price) * quantity).toFixed(2);
        } else {
          pl = "-";
        }
      } else {
        pl = "-";
      }
    }
    return pl;
  };

  const CommuLativeProfitLossColor = (cpl, i, trade_array, pl) => {
    var cplvalue =
      is_x != "-"
        ? (cpl =
            trade_array[i] == trade_array[i - 1]
              ? Math.round((cpl + pl * 1.0) * 100) / 100
              : 0.0)
        : "-";

    if (cplvalue > 0) {
      return "green";
    } else if (cplvalue == "-") {
      return "black";
    } else if (cplvalue == 0) {
      return "black";
    } else {
      return "red";
    }
  };

  const totalCPL = (tcpl, cpl) => {
    //var totalcplvalue = is_x != '-' ? (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2) : tcpl.toFixed(2)

    var totalcplvalue = (parseFloat(tcpl) + parseFloat(cpl)).toFixed(2);

    if (totalcplvalue > 0) {
      return "green";
    } else if (totalcplvalue == "-" || totalcplvalue == 0) {
      return "black";
    } else {
      return "red";
    }
  };

  const reset = () => {
    setFromdate("");
    setTodate("");
    setFsymbol("");
    setFsegmnet("");
    setFstrategy("");
  };

  const bgColor = {
    backgroundColor: "#000",
    color: "#fff",
  };

  // Search Filter

  const filterSymbols = (e) => {
    var filterSymbols = searchFilter.filter((filterdata) => {
      if (
        (filterdata.trade_symbol &&
          filterdata.trade_symbol
            .toLowerCase()
            .toString()
            .includes(e.toLowerCase())) ||
        (filterdata.strategy_tag &&
          filterdata.strategy_tag
            .toLowerCase()
            .toString()
            .includes(e.toLowerCase()))
      ) {
        return filterdata;
      }
    });
    setSignals(filterSymbols);
  };

  //-------------------------------------------------------------

  const token_return_entry_trade = (sig, i) => {
    if (
      (sig.segment == "FO" || sig.segment == "MO") &&
      sig.option_type == "PUT"
    ) {
      if (sig.type == "LE") {
        if (signals[i + 1] != undefined) {
          if (
            signals[i + 1].type == "LX" &&
            new Date(signals[i + 1].created_at) > new Date(sig.created_at) &&
            signals[i + 1].trade_symbol == sig.trade_symbol
          ) {
            return "";
          } else {
            return sig.token;
          }
        } else {
          return sig.token;
        }
      } else if (sig.type == "SE") {
        if (signals[i + 1] != undefined) {
          if (
            signals[i + 1].type == "SX" &&
            new Date(signals[i + 1].created_at) > new Date(sig.created_at) &&
            signals[i + 1].trade_symbol == sig.trade_symbol
          ) {
            return "";
          } else {
            return sig.token;
          }
        } else {
          return sig.token;
        }
      }
    } else {
      if (sig.type == "LE") {
        if (signals[i + 1] != undefined) {
          if (
            signals[i + 1].type == "LX" &&
            new Date(signals[i + 1].created_at) > new Date(sig.created_at) &&
            signals[i + 1].trade_symbol == sig.trade_symbol
          ) {
            return "";
          } else {
            return sig.token;
          }
        } else {
          return sig.token;
        }
      } else if (sig.type == "SE") {
        if (signals[i + 1] != undefined) {
          if (
            signals[i + 1].type == "SX" &&
            new Date(signals[i + 1].created_at) > new Date(sig.created_at) &&
            signals[i + 1].trade_symbol == sig.trade_symbol
          ) {
            return "";
          } else {
            return sig.token;
          }
        } else {
          return sig.token;
        }
      }
    }
  };
  //------ -------------------------

  // code by  ganpat 10-06-2023

  const getPanelKey = () => {
    var config = {
      method: "get",
      url: `${Config.base_url}smartalgo/panelkey`,
      headers: {
        "x-access-token": admin_token,
      },
    };
    axios(config)
      .then(function (response) {
        setPanelKey(response.data.PanelKey[0].panel_key);
      })
      .catch(function (error) {});
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows(
        signals.map((row, i) => {
          if (row.type == "LE" || row.type == "SE") {
            if (token_return_entry_trade(row, i) !== "") {
              if (row.id != undefined) {
                return row.id;
              }
            }
          }
        })
      );
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (event, rowId) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows([...selectedRows, rowId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    }
  };

  const getSelectedRowsData = () => {
    const selectedData = signals.filter((row) => selectedRows.includes(row.id));

    if (selectedData.length == 0) {
      alert("Please Select Signal FIrst");
      return;
    }

    selectedData.forEach((row) => {
      var type = "";
      if (row.type == "LE") {
        type = "LX";
      } else if (row.type == "SE") {
        type = "SX";
      }

      var price;
      if (row.type == "LE") {
        let price_get = $(".bp1_price" + row.token).html();
        if (price_get == "" || price_get == undefined) {
          price = row.price;
        } else {
          price = $(".bp1_price" + row.token).html();
        }
      } else if (row.type == "SE") {
        let price_get = $(".sp1_price" + row.token).html();
        if (price_get == "" || price_get == undefined) {
          price = row.price;
        } else {
          price = $(".sp1_price" + row.token).html();
        }
      }
      var signal_id = parseFloat(row.signal_id) + 1;

      var request =
        "id:" +
        signal_id +
        "@@@@@input_symbol:" +
        row.symbol +
        "@@@@@type:" +
        type +
        "@@@@@price:" +
        price +
        "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" +
        panelKey +
        "@@@@@exchange:" +
        row.exchange_symbol +
        "@@@@@product_type:MIS@@@@@strike:" +
        row.strike +
        "@@@@@segment:" +
        row.segment +
        "@@@@@option_type:" +
        row.option_type +
        "@@@@@expiry:" +
        row.expiry +
        "@@@@@strategy:" +
        row.strategy_tag +
        "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@demo:demo";

      var data = request;
      var config = {
        method: "post",
        url: `${Config.broker_signal_url}`,
        headers: {
          "Content-Type": "text/plain",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setShowAlert(true);
          setTextAlert("Trade Exited Successfully");
          setAlertColor("success");
          //window.location.reload();
          setRefreshscreen(!refreshscreen);
          // navigate("/admin/executivetrade")
        })
        .catch(function (error) {});
    });

    // return selectedData;
  };

  // code by  ganpat

  const getSelectedSingleRowsData = () => {};

  const [showAliceModal, setShowAliceModal] = useState(false);
  const [secretKeyAlice, setSecretKeyAlice] = useState("");
  const [appIdAlice, setAppIdAlice] = useState("");
  const [getBrokerKey, setGetBrokerKey] = useState([]);
  const [adminTradingType, setAdminTradingType] = useState("");
  const [getTokenTradingApiDetails, setGetTokenTradingApiDetails] = useState(
    []
  );

  const handleShowAliceModal = () => {
    setShowAliceModal(true);
  };

  const handleCloseAliceModal = () => {
    setSecretKeyAlice("");
    setShowAliceModal(false);
  };

  const UpdateBrokerKey = () => {
    //alert(appIdAlice)
    //  alert(secretKeyAlice)

    var data = JSON.stringify({
      app_id: appIdAlice,
      api_secret: secretKeyAlice,
    });

    var config = {
      method: "post",
      url: `${Config.base_url}updateAdminBrokerKey`,
      headers: {
        "x-access-token": admin_token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.status == true) {
          setShowAlert(true);
          setTextAlert("Data Update Successfully");
          setAlertColor("success");
          setRefreshscreen(!refreshscreen);
        }
      })
      .catch(function (error) {});
    setShowAliceModal(false);
  };

  function GetBrokerKey() {
    var config = {
      method: "get",
      url: `${Config.base_url}api/alicebluetoken/getBrokerKey`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        if (response.data.status == "true") {
          setGetBrokerKey(response.data.data[0]);
        } else {
        }
      })
      .catch(function (error) {});
  }

  const getTokenTradingApi = () => {
    var config = {
      method: "get",
      url: `${Config.base_url}api/getTokenTradingApi`,
    };
    axios(config)
      .then(function (response) {
        setGetTokenTradingApiDetails(response.data.data);
        setAdminTradingType(response.data.data[0].trading);
      })
      .catch(function (error) {});
  };

  const Brokertoggle = (e, admiintokendetails) => {
    if (e.target.checked == true) {
      if (admiintokendetails[0].broker == 1) {
        window.location.href =
          "https://ant.aliceblueonline.com/?appcode=" +
          admiintokendetails[0].app_id;
      }
    } else {
      tradingOffAdminToken();
    }
  };

  function tradingOffAdminToken() {
    var config = {
      method: "get",
      url: `${Config.base_url}api/alicebluetoken/tradingOff`,
    };

    axios(config)
      .then(function (response) {
        setRefreshscreen(!refreshscreen);
      })
      .catch(function (error) {});
  }

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
                {/* <div className="col-md-12 text-end">
                      <button type="button" onClick={() => handleShowAliceModal()} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Set Key
                      </button>
                </div>

                <div className="col-md-6">
                      <div className="navbar-wrapper text-end d-flex justify-content-end align-items-center">
                        <p className="text-secondary mb-0 pe-2">Login with Get Live Price</p>
                        <Form.Check
                          className="broker_switch mb-2"
                          size="lg"
                          type="switch"
                          name="trading"
                          checked={adminTradingType == 1 ? true : false}
                          onChange={(e) => {
                            Brokertoggle(e, getTokenTradingApiDetails);
                          }}
                        />
                      </div>
                    </div> */}

                <h6 className="text-center mt-3">
                  This results is valid for today only, We do not directly or
                  indirectly make any reference to the past or expected future
                  return/performance of the Algorithm.
                  <br />
                  <br />
                </h6>
                {/* {(locationname == 'app.nextalgo.net' || locationname == 'client.growtechitsolutions.com' || locationname == '180.149.241.128:3000') &&
                } */}

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

              {/* <div className="input-group">
                <div className="form-outline ms-3">
                  <input
                    type="search"
                    id="form1"
                    className="form-control"
                    placeholder="Search Symbols"
                    onChange={e => filterSymbols(e.target.value)} />
                </div>
              </div> */}

              <div className="card-body">
                <div className="row trade-space">
                  <div className="col-md-2">
                    <label style={{ fontWeight: "bold", color: "black" }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        quantitychange(e);
                      }}
                      min="1"
                      className="form-control"
                    />
                  </div>

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
                        <option value={sm.symbol}>{sm.symbol}</option>
                      ))}
                    </select>
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
                        <option value={sm.segment}>{sm.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
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
                  </div>

                  <div className="col-md-2">
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
                  </div>

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
                        <option value={sm.name}>{sm.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <button className="btn btn-color" onClick={() => reset()}>
                      Reset
                    </button>
                  </div>

                  {roleId == "4" ? (
                    ""
                  ) : (
                    <div className="col-md-2">
                      <ReactHTMLTableToExcel
                        className="btn btn-color"
                        table="table"
                        filename="tradeHistory"
                        sheet="tablexls"
                        buttonText="Export-Excel"
                      />
                    </div>
                  )}
                </div>

                <div className="table-responsive tableheight thistory-dark-font">
                  <table
                    className="table tbl-tradehostory"
                    id="table"
                    style={{
                      backgroundImage: `url(/images/${
                        companyDetails &&
                        companyDetails[0].tradehistory_watermark
                      })`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",

                      backgroundRepeat: "repeat-y",
                    }}
                  >
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
                          S.No5
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
                      {signals.map((sig, i) => {
                        trade_array[i] = sig.trade_symbol;

                        if (sig.type == "LE") {
                          TypeSymbolArrayLE.push(sig);
                        }

                        var prev_price = 0;
                        if (sig.type == "LX" || sig.type == "SX") {
                          if (signals[i - 1]) {
                            prev_price = signals[i - 1].price;
                          } else {
                            prev_price = 0;
                          }
                        }

                        return (
                          <>
                            <tr key={i}>
                              <td style={{ fontWeight: "800" }}>{i + 1}</td>

                              <td style={{ fontWeight: "800" }}>
                                {dateFormate(sig.created_at)}
                              </td>
                              <td style={{ fontWeight: "800" }}>
                                {sig.trade_symbol}
                                <b>[{sig.segment}]</b>
                              </td>
                              <td style={{ fontWeight: "800" }}>
                                {sig.strategy_tag}
                              </td>
                              <td style={{ fontWeight: "800" }}>{sig.type}</td>
                              <td style={{ fontWeight: "800" }}>{quantity}</td>
                              <td style={{ fontWeight: "800" }}>
                                {sig.type == "LE" || sig.type == "SE"
                                  ? sig.price
                                  : "-"}
                              </td>
                              <td style={{ fontWeight: "800" }}>
                                {sig.type == "LX" || sig.type == "SX"
                                  ? sig.price
                                  : "-"}
                              </td>

                              <td
                                style={{ display: "none" }}
                                className={
                                  "sp1_price" + token_return_entry_trade(sig, i)
                                }
                              ></td>

                              <td
                                style={{ display: "none" }}
                                className={
                                  "bp1_price" + token_return_entry_trade(sig, i)
                                }
                              ></td>

                              <td
                                style={{ display: "none" }}
                                className={
                                  "get_qty" + token_return_entry_trade(sig, i)
                                }
                              >
                                {quantity}
                              </td>

                              <td
                                style={{ display: "none" }}
                                className={
                                  "get_pl_live" +
                                  token_return_entry_trade(sig, i)
                                }
                              >
                                {sig.price + sig.type}
                              </td>

                              <td
                                style={{
                                  color: ProfitLossColor(sig, i),
                                  fontWeight: "bold",
                                }}
                              >
                                {
                                  // is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  //   sig.type == 'LX' ?
                                  //     ((sig.price && sig.price - signals[i - 1].price && signals[i - 1].price) * quantity).toFixed(2)
                                  //     :
                                  //     ((signals[i - 1].price && signals[i - 1].price - sig.price && sig.price) * quantity).toFixed(2)
                                  //   : '-'

                                  (is_x = pl = include_td_profitLoss(sig, i))

                                  // sig.segment == 'FO' && sig.option_type == 'PUT' ?

                                  //   is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  //     sig.type == 'LX' ? signals[i - 1].type == 'LE'
                                  //       ? ((prev_price - sig.price) * (quantity)).toFixed(2)
                                  //       : 0
                                  //       : signals[i - 1].type == 'SE' ? ((sig.price - prev_price) * (quantity)).toFixed(2) : 0
                                  //     : '-'

                                  //   :

                                  //   is_x = sig.type == 'LX' || sig.type == 'SX' ? pl =
                                  //     sig.type == 'LX' ? signals[i - 1].type == 'LE'

                                  //       ? ((sig.price - prev_price) * (quantity)).toFixed(2)
                                  //       : 0
                                  //       : signals[i - 1].type == 'SE' ? ((prev_price - sig.price) * (quantity)).toFixed(2) : 0
                                  //     : '-'
                                }
                              </td>

                              <td
                                className={
                                  "cpl_single" +
                                  token_return_entry_trade(sig, i)
                                }
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
                            className={"cpl"}
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
        {/* {(locationname == 'app.nextalgo.net' || locationname == 'client.growtechitsolutions.com' || locationname == '180.149.241.128:3000') &&
          } */}
        <p className="text-center h6">
          <b>
            सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और
            इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के
            उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह
            परिणाम केवल आज के लिए मान्य है।
          </b>
        </p>
      </div>

      {showAlert && (
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )}

      <Modal show={showAliceModal} onHide={handleCloseAliceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Alice Blue Keys</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <b>API Process Alice Blue - </b> Kindly click on below mention
            brokerage firm link it will redirect to your concern brokerage API
            link and generate API with this. Kindly follow instruction as your
            broker or sub broker link guide to you and update our link and
            connect your demat with our Algo software
          </p>
          <br />
          <p>
            <b>Step 1 - </b> Click blow link and Login{" "}
          </p>
          <p>https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB</p>
          <br />
          <p>
            <b>Step 2:-</b> Enter your Details and Redirect url
          </p>
          <p>{`${Config.broker_redirect_url}AliceBlue`}</p>
          <br />
          <p>
            <b>Step 3:-</b> Create Api{" "}
          </p>
          <p>you will get Api Secret Key And App code please Update</p>

          <TextField
            id="outlined-required"
            label="SECRET KEY"
            defaultValue={getBrokerKey.api_secret}
            onChange={(e) => setSecretKeyAlice(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="APP ID"
            defaultValue={getBrokerKey.app_id}
            onChange={(e) => setAppIdAlice(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAliceModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => UpdateBrokerKey()}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Tradehistory;
