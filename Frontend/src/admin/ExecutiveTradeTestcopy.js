import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from '@mui/material/Backdrop';
import * as Constant from "../common/ConstantMessage";
import CircularProgress from '@mui/material/CircularProgress';
import $ from "jquery";
import CryptoJS from "crypto-js";


function ExecutiveTradeTest(e) {

  const [getSymbolsFilter, setGetSymbolsFilter] = useState([])
  const [showStrikePrice, setShowStrikePrice] = useState([])
  const [thisMonthSymbols, setThisMonthSymbols] = useState([])
  const [Bankniftyprint, setBankniftyprint] = useState('')
  const [Niftyprint, setniftyprint] = useState('')
  const [channelShow, setChannelShow] = useState("")

  const admin_token = localStorage.getItem("token");


  // console.log("channelShow", channelShow);

  const [makeChannelData, setMakeChannelData] = useState("")
  // console.log("makeChannelData", makeChannelData);

  const uniqueArr = [...new Set(getSymbolsFilter.map((item) => (item.name)))];
  const thismonthdate = new Date().toString();
  const gettingThisMonth = thismonthdate.split(" ")[1].toUpperCase()
  const [getLastDate, setGetLastDate] = useState("")


  const getDatetoken = new Date()
  const gettingdatetoken = getDatetoken.toTimeString()
  const splittime = gettingdatetoken.split(" ")[0]
  // console.log("splittime", splittime);


  const [bankNiftyToken, setBankNiftyToken] = useState("")
  const [niftyToken, setNiftyToken] = useState("")
  const [requestSiginals, setRequestSiginals] = useState([])
  
  // console.log("bankNiftyToken out", bankNiftyToken);
  // console.log("niftyToken out", niftyToken);


  const marginCalculator = () => {
    var config = {
      method: 'get',
      url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };
    var abc = []
    axios(config)
      .then(function (response) {
        var channelstr = ""
        response.data.forEach(function (element) {
          if ((element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO")) {
            if (element.name == 'BANKNIFTY' || element.name == 'NIFTY') {
              if (element.expiry.toString().includes(gettingThisMonth)) {
                setGetLastDate(element.expiry)
                channelstr += element.exch_seg + "|" + element.token + "#"
                if (element.name == "BANKNIFTY") {
                  setBankNiftyToken(element.token)
                } else if (element.name == "NIFTY") {
                  setNiftyToken(element.token)
                }
              }
            }
          }
        });

        var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
        setMakeChannelData(alltokenchannellist)

      })
      .catch(function (error_broker) {
        console.log('error_broker -', error_broker);
      });
  }

  //---------SOCKET----------------


  const [bankNiftyPriceShow, setBankNiftyPriceShow] = useState("")
  const [niftyPriceShow, setNiftyPriceShow] = useState("")
  const [bankNiftyStrikePrice, setBankNiftyStrikePrice] = useState([])
  const [niftyStrikePrice, setNiftyStrikePrice] = useState([])
  const [socketPriceShow, setSocketPriceShow] = useState([])
  const [singleStrategy, setSingleStrategy] = useState("")
  const [panelKey, setPanelKey] = useState("")
  
  
console.log("singleStrategy",singleStrategy);

  const [strategy_data, setStrategy_data] = useState([]);

  // console.log("socketPriceShow", socketPriceShow);

  const [refreshscreen, setRefreshscreen] = useState(false);


  //    Buy Sell radio buttons

  const [CallLPBuy, setCallLPBuy] = useState("")
  const [CallLPSSell, setCallLPSell] = useState("")
  const [lPutLPBuy, setPutLPBuy] = useState("")
  const [PutLPSell, setPutLPSell] = useState("")

  //    API Data States

  const [apiAllRoundToken, setApiAllRoundToken] = useState([])
  const [apiAllRoundToken2, setApiAllRoundToken2] = useState([])
  const [apiChannelList, setApiChannelList] = useState([])
  const [apiStrikePrice, setApiStrikePrice] = useState([])

  // console.log("apiAllRoundToken2", apiAllRoundToken2);
  // console.log("apiChannelList 2", apiChannelList.first_channel);
  // console.log("apiChannelList 2", apiChannelList.second_channel);
  // console.log("apiStrikePrice 3", apiStrikePrice);
  // console.log("storeChannel", storeChannel);
  // console.log("BANKNIFTYPRICE", bankNiftyStrikePrice);
  // console.log("NIFTYPRICE", niftyStrikePrice);


  var BASEURL = "https://a3.aliceblueonline.com/rest/AliceBlueAPIService/";
  let AuthorizationToken;
  let type = "API";

  const runSocket = (first_channel, second_channel) => {

    var userId = "149083";
    var userSession = "Nb3HiLXPh4gt3PdGGNJIbqEix7fEHrHcyLtUlSS3DIatd6aX0DWsl3AIN3o6jJTcON50lYskxDL0xCfXNmQIQ2jH6E0bsWYS2enBqRTIaIUHmL0zbBnojH1RguO4xaR20MLPPdmKlLPp3LZKgBAks1oFdbp7ockvFSn9clSh1IGfsm3k6Cz2dBFlBDUOfipYdcmeV43vX67p7SOeZnNXkur7xCCYJjZiFebkPOqfGHrHnhmEWPFMdCfxNBfcg0FY";

    console.log("running");
    invalidateSession(userId, userSession, first_channel, second_channel);
  }

  function invalidateSession(userId, userSession, first_channel, second_channel) {
    //alert(userId);

    AuthorizationToken = "Bearer " + userId + " " + userSession;
    //console.log('AuthorizationToken',AuthorizationToken);
    let jsonObj = {
      loginType: type,
    };
    $.ajax({
      url: BASEURL + "api/ws/invalidateSocketSess",
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
          createSession(userId, userSession, first_channel, second_channel);
        }
      },
    });
  }

  function createSession(userId, userSession, first_channel, second_channel) {
    //alert('create session')
    AuthorizationToken = "Bearer " + userId + " " + userSession;
    //console.log('AuthorizationToken cratesession',AuthorizationToken);

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
          connect(userId, userSession, first_channel, second_channel);
        } else {
          alert(msg);
        }
      },
    });
  }

  var bankniftypushaccdec = []
  var niftypushaccdec = []

  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let socket;

  function connect(userId, userSession, first_channel, second_channel) {
    // abcc(token)
    socket = new WebSocket(url);
    socket.onopen = function () {
      // alert("socket open");
      console.log("socket running");
      connectionRequest(userId, userSession, first_channel, second_channel);
      // setSockets(socket)
    };

    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

      setSocketPriceShow(response)
       console.log("response", response)
      //setBankNiftySocketPrice(response.lp)
      // setNiftySocketPrice(response.sp1)
      // console.log("bankNiftyToken", bankNiftyToken)
      // console.log("niftyToken", niftyToken)

      if ("35047" == response.tk && response.lp != undefined) {
        setBankNiftyPriceShow(response.lp)
      }

      if ("35048" == response.tk && response.lp != undefined) {
        setNiftyPriceShow(response.lp)
      }

      if (response.s === "OK") {
        console.log("inside code")
        // console.log("first_channel", first_channel)

        let json = {
          k: first_channel,
          t: "t",
        };
        socket.send(JSON.stringify(json));

        let json1 = {
          k: "NFO|55675#NFO|55676#NFO|55679#NFO|55680#NFO|55683#NFO|55684#NFO|55687#NFO|55688#NFO|55718#NFO|55720#NFO|55731#NFO|55732#NFO|55751#NFO|55752#NFO|55755#NFO|55756#NFO|55759#NFO|55760#NFO|55777#NFO|55782#NFO|55789#NFO|55790#NFO|55795#NFO|55796#NFO|55801#NFO|55804#NFO|55807#NFO|55814#NFO|55821#NFO|55826#NFO|55831#NFO|55842#NFO|55845#NFO|55846#NFO|55863#NFO|55864#NFO|55867#NFO|55868#NFO|55882#NFO|55887#NFO|55894#NFO|55895#NFO|55898#NFO|55899#NFO|55902#NFO|55903#NFO|55906#NFO|55907#NFO|55912#NFO|55913#NFO|55916#NFO|55917#NFO|55920#NFO|55921#NFO|55924#NFO|55925#NFO|55928#NFO|55930#NFO|55950#NFO|55951#NFO|55956#NFO|55957#NFO|55962#NFO|55963#NFO|55966#NFO|55967#NFO|55970#NFO|55971#NFO|55976#NFO|55980#NFO|55983#NFO|55984#NFO|55990#NFO|55995#NFO|55998#NFO|55999#NFO|56002#NFO|56003#NFO|56006#NFO|56007#NFO|55444#NFO|55445#NFO|55446#NFO|55447#NFO|55453#NFO|55454#NFO|55455#NFO|55456#NFO|55457#NFO|55459#NFO|55460#NFO|55461#NFO|55462#NFO|55463#NFO|55464#NFO|55465#NFO|55466#NFO|55467#NFO|55468#NFO|55469#NFO|55474#NFO|55475#NFO|55476#NFO|55477#NFO|55478#NFO|55480#NFO|55490#NFO|55493#NFO|55494#NFO|55495#NFO|55496#NFO|55497#NFO|55498#NFO|55499#NFO|55500#NFO|55503#NFO|55504#NFO|55506#NFO|55507#NFO|55508#NFO|55512#NFO|55513#NFO|55514#NFO|55515#NFO|55516#NFO|55517#NFO|55518#NFO|55519#NFO|55520#NFO|55521#NFO|55523#NFO|55524#NFO|55525#NFO|55526#NFO|55530#NFO|55531#NFO|55532#NFO|55533#NFO|55534#NFO|55535#NFO|55536#NFO|55537#NFO|55538#NFO|55539#NFO|55543#NFO|55544#NFO|55547#NFO|55548#NFO|55549#NFO|55550#NFO|55554#NFO|55555#NFO|55556#NFO|55557#NFO|55558#NFO|55559#NFO|55560#NFO|55561#NFO|55562#NFO|55563",
          // k: second_channel,
          t: "t",
        };
        socket.send(JSON.stringify(json1));
      }
    };
  }


  const strikefourty = (banknifty, nifty) => {

    var number = Math.round(bankNiftyPriceShow).toString().slice(0, -2) + "0" + "0"
    for (let i = 1; i <= 20; i++) {
      const resultfor = parseInt(number, 10) + 100 * i;
      const resultpre = number - 100 * i;
      bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultfor }, { "symbol": "BANKNIFTY", "strike_price": resultpre })
      setBankNiftyStrikePrice(bankniftypushaccdec)
    }

    var number = Math.round(niftyPriceShow).toString().slice(0, -2) + "0" + "0"
    for (let i = 1; i <= 20; i++) {
      const resultfor = parseInt(number, 10) + 100 * i;
      const resultpre = number - 100 * i;
      niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultfor }, { "symbol": "NIFTY", "strike_price": resultpre })
      setNiftyStrikePrice(niftypushaccdec)
    }

  }

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
    console.log('initCon', JSON.stringify(initCon));
    socket.send(JSON.stringify(initCon));
  }


  // if (bankNiftyStrikePrice.length == 40 && niftyStrikePrice.length == 40) {
  //   // const strikePriceSendApi = () => {
  //   axios({
  //     url: `${Config.base_url}smartalgo/instrument_token`,
  //     method: "post",
  //     data: {
  //       strike_prize: bankNiftyStrikePrice.concat(niftyStrikePrice),
  //       expied_symbol: getLastDate,
  //     },
  //     headers: {
  //       'x-access-token': access_token
  //     }
  //   }).then((res) => {
  //     console.log("res", res.data.channel);
  //     setStoreChannel(res.data.channel)

  //   });
  //   // }
  // }

  // let urgent = document.getElementById("call_buy");
  // let tb = document.querySelector("#toggleButton");
  // tb.addEventListener('click', function () {
  //   // Just set checked to the opposite of what it is now
  //   urgent.checked = !urgent.checked;
  //   console.log(urgent.checked);
  // });


  // const SymbolsFilter = (e) => {
  //   console.log("e.target.value" ,e.target.value);
  //   var gettingSymbolsResult = apiAllRoundToken && apiAllRoundToken.filter((item) => {
  //     if (item.symbol == e.target.value) {
  //       return item
  //     }
  //   })
  //   setApiAllRoundToken2(gettingSymbolsResult)
  // }

  const SymbolsFilter = (e) => {
    var gettingSymbolsResult = apiAllRoundToken && apiAllRoundToken.filter((item) => {
      if (item.symbol == e.target.value) {
        return item
      }
    })
    setApiAllRoundToken2(gettingSymbolsResult)
  }


  const getSocketData = () => {
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/channel/alldata`,
    }).then(res => {
      console.log("res channel", res.data);
      setApiAllRoundToken(res.data.all_round_token)

      setApiAllRoundToken2(res.data.all_round_token.filter((item) => {
        if (item.symbol == "BANKNIFTY") {
          return item
        }
      }))

      setApiChannelList(res.data.channel_list[0])
      setApiStrikePrice(res.data.strike_price)
      //console.log("first channel",res.data.channel_list[0]);
      runSocket(res.data.channel_list[0].first_channel, res.data.channel_list[0].second_channel)
    });
  }


  const strategyDataApi = () => {
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(res1 => {
      // console.log("res1", res1);
      setStrategy_data(res1.data.strategy);
    });
  }

  useEffect(() => {
    getPanelKey();
    strategyDataApi()
    marginCalculator()
    getSocketData()
    // strategyDataApi()
    // strikePriceSendApi()
    // strikeprice()
  }, [])



  useEffect(() => {
   
  }, [requestSiginals])

  



const getPanelKey = () => {

  var config = {
  method: 'get',
  url: 'https://api.smartalgo.in:3001/smartalgo/panelkey',
  headers: {
    'x-access-token': admin_token
  }
  };
  axios(config)
  .then(function (response) {
    
  //  console.log("ddddd - ", response.data);
   // console.log("ddddd iii - ", response.data.PanelKey[0].panel_key);

    setPanelKey(response.data.PanelKey[0].panel_key);



    
  })
  .catch(function (error) {
  console.log(error);
  });



}




  const executiveTrade = () =>{
     


  }

   var all_request = [];
   var mytext  = [];

  const makerequest = (option_type,type,symbol,expiry,token,ischecked) =>{
  //  alert(token)
   // alert(ischecked);

    var request = "id:"+token+"@@@@@input_symbol:"+symbol+"@@@@@type:"+type+"@@@@@price:5555.50@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:"+panelKey+"@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:42300@@@@@segment:O@@@@@option_type:"+option_type+"@@@@@expiry:"+expiry+"@@@@@strategy:"+singleStrategy+"@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@demo:"+token;


    console.log("requet -",request)
   //alert(option_type + "  -   " + type)

   all_request.push(request);

   //console.log("all_request -" ,all_request)
   
   var pre_tag = {
    request: request,
    token: token,
  };
   

 //   setRequestSiginals((oldArray) => [...oldArray, pre_tag]);

 setRequestSiginals((oldArray) => [pre_tag,...oldArray] );

  //  if("check"){
  //   setRequestSiginals((oldArray) => [...oldArray, requet]);
  //  }else{
  //   setRequestSiginals(requestSiginals.filter((val, index) => val.demo !== demo));
  //  }


  //  var ischecked = $(this).is(':checked');
  //   if(ischecked){
  //     mytext.push(text);
  //   }
  //   else{
  //   mytext = $.grep(mytext, function(value) {
  //   return value != text;
  
  //   });
  
  //   }



  }

 
  console.log("shakir -",requestSiginals)

  var real_req = [];
  var single_token = [];
  requestSiginals.forEach(element => {
  
    if(!single_token.includes(element.token)){
      single_token.push(element.token);
      real_req.push(element.request) ; 

    }
     
  });


console.log("dddddd -  ",real_req)


  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title font">Executive Trade</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <b>Symbols</b>
                    <select
                      name="symbols_filter"
                      className="form-control spacing"
                      style={{ width: "100px" }}
                      onChange={(e) => SymbolsFilter(e)}
                    >
                      {/* <option value="All" >All</option> */}
                      <option value="BANKNIFTY" selected>BANKNIFTY</option>
                      <option value="NIFTY">NIFTY</option>

                      {/* {uniqueArr && uniqueArr.map((x) => {
                        return <option value={x}>{x}</option>
                      })} */}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>STRATEGY</label>
                    <select className="form-control" name="strategyname" onChange={(e)=>setSingleStrategy(e.target.value)}>
                      <option value="">All</option>
                      {strategy_data.map((sm, i) =>
                        <option value={sm.name}>{sm.name}</option>)}
                    </select>
                  </div>
                </div>


                <div className="col-md-6">
                  {Bankniftyprint && Bankniftyprint[0].symbol}
                  <p className="ms-5"> {Niftyprint && Niftyprint[0].symbol}</p>
                </div>

                <div>
                  {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
                  <button className='btn btn-info float-end' onClick={()=>executiveTrade()}>Executive Trade</button>
                </div>
                <div>
                  <p><b>BANKNIFTY :- {bankNiftyPriceShow}</b></p>

                  <p><b>NIFTY :- {niftyPriceShow}</b></p>

                </div>

                <div className="table-responsive tableheight" >
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr className="fontbold">
                        <th className="fontbold">Buy</th>
                        <th className="fontbold">Sell</th>
                        <th>Call LP</th>
                        <th>Strike Price</th>
                        <th>Put LP</th>
                        <th>Buy</th>
                        <th>Sell</th>
                      </tr>
                    </thead>
                    <tbody>

                      {apiAllRoundToken2 && apiAllRoundToken2.map((item) => (

                        <tr>

                          <td>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="call_radio" id="call_buy" onChange={(e) => {setCallLPBuy(e.target.checked);makerequest("CALL","LE",item.symbol,item.expiry,item.call_token,e.target.checked)}} value />
                              <label class="form-check-label">
                                Buy
                              </label>
                            </div>
                          </td>

                          <td>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="call_radio" id="call_sell" onChange={(e) => {setCallLPSell(e.target.checked);makerequest("CALL","LX",item.symbol,item.expiry,item.call_token,e.target.checked)}} />
                              <label class="form-check-label" >
                                Sell
                              </label>
                            </div>
                          </td>

                          <td>{item.call_token == socketPriceShow.tk ? socketPriceShow.lp : socketPriceShow.lp}</td>
                          <td>{item.strike_price}</td>
                          <td>{item.put_token}</td>

                          <td>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="put_radio" id="put_buy" onChange={(e) => {setPutLPBuy(e.target.checked);makerequest("PUT","LE",item.symbol,item.expiry,item.put_token,e.target.checked)}} />
                              <label class="form-check-label">
                                Buy
                              </label>
                            </div>
                          </td>

                          <td>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="put_radio" id="put_sell" onChange={(e) => {setPutLPSell(e.target.checked);makerequest("PUT","LX",item.symbol,item.expiry,item.put_token,e.target.checked)}}/>
                              <label class="form-check-label">
                                Sell
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))
                      }

                      {/* bankNiftyStrikePrice.forEach((x)=> console.log("x", x.strike_price) */}

                      {/* {
                        bankNiftyStrikePrice.map((x, i) => {
                          return (
                            <tr>
                              <td>Static</td>
                              <td>Static</td>
                              <td>Static</td>
                              <td>{x.strike_price}</td>
                              <td>Static</td>
                              <td>Static</td>
                              <td>Static</td>
                            </tr>
                          )
                        })
                      } */}

                      {/* {filterStrikePrice.map((x, i) => {
                        return (
                          <>
                            <tr>
                              <td>Static</td>
                              <td>Static</td>
                              <td>Static</td>
                              <td>{x.strike_prize}</td>
                              <td>Static</td>
                              <td>Static</td>
                              <td>Static</td>
                            </tr>
                          </>
                        )
                      })
                      } */}

                    </tbody>
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

export default ExecutiveTradeTest;





  // var num1 = "18323.25"
  // const strikeprice = (num) => {
  //   var number = Math.round(num).toString().slice(0, -2) + "0" + "0"
  //   for (let i = 1; i <= 20; i++) {
  //     const resultfor = parseInt(number, 10) + 100 * i;
  //     const resultpre = number - 100 * i;
  //     pushaccdec.push(resultfor, resultpre)

  //     // console.log("sortarr", sortarr);
  //   }
  // }


    // if (bankNiftyToken == response.tk) {
  //   var number = Math.round(response.lp).toString().slice(0, -2) + "0" + "0"
  //   for (let i = 1; i <= 20; i++) {
  //     const resultfor = parseInt(number, 10) + 100 * i;
  //     const resultpre = number - 100 * i;
  //     bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultfor }, { "symbol": "BANKNIFTY", "strike_price": resultpre })
  //     setBankNiftyStrikePrice(bankniftypushaccdec)
  //   }
  //   setBankNiftyPriceShow(response.lp)
  // }

  // if (niftyToken == response.tk) {
  //   var number = Math.round(response.lp).toString().slice(0, -2) + "0" + "0"
  //   for (let i = 1; i <= 20; i++) {
  //     const resultfor = parseInt(number, 10) + 100 * i;
  //     const resultpre = number - 100 * i;
  //     niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultfor }, { "symbol": "NIFTY", "strike_price": resultpre })
  //     setNiftyStrikePrice(niftypushaccdec)
  //   }
  //   setNiftyPriceShow(response.lp)
  // }