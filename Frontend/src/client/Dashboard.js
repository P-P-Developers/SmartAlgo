import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import ClientFundUsed from "./ClientFundUsed";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from '@mui/material/Backdrop';
import * as Constant from "../common/ConstantMessage";
import CircularProgress from '@mui/material/CircularProgress';
import $ from "jquery";
import CryptoJS from "crypto-js";

function Dashboard() {
  let navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [servicesGroupId, setServicesGroupId] = useState([]);
  const [getServicePrice, setGetServicePrice] = useState("0")
  // console.log("getServicePrice", getServicePrice);
  // console.log("servicesGroupId", servicesGroupId);
  const [strategy, setStrategy] = useState([]);
  const [getBroker, setBroker] = useState("");

  // console.log("strategy", getBroker);
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [orderTypeValue, setOrderTypeValue] = useState("");
  const [rerender, setRerender] = useState()
  const [loader, setLoader] = useState(false);
  const [clientCode, setClientCode] = useState("");
  const [tokenPrice, setTokenPrice] = useState("")
  const [price, setPrice] = useState("");
  const [match, setMatch] = useState("");
  const [qty_typeValue, setQty_typeValue] = useState("");
  const [ipAddress, setIpAddress] = useState('');
  const [stratValueChange, setstratValueChange] = useState("")
  const [fundUsed, setfundUsed] = useState("")

  // console.log("qty_typeValue", qty_typeValue);
  const socketRef = useRef(null);
  // console.log("clientCode", clientCode);
  const [aliceuserSession, setAliceuserSession] = useState("");

  const cl = useRef();
  const alices = useRef();


  const client_token = localStorage.getItem('client_token');
  const fromadmin = localStorage.getItem('from_admin');
  const fromsubadmin = localStorage.getItem('from_subadmin');
  const location = useLocation();

  const locationname = window.location.host
  // console.log("location", locationname);

  var user_id = localStorage.getItem("client_id");
  var data_array = [];
  var updatedata_array = [];



  //----------------------------------------------------------------------------------
  
  const getIpAdress = () => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data =>
        setIpAddress(data.ip)
      )
      .catch(error => console.error(error));
  }


  useEffect(() => {

    setLoader(true)
    axios({
      url: `${Config.base_url}client/services`,
      method: "post",
      data: {
        client_id: user_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      // console.log("symbols", res);
      setStrategy(res.data.strategy);
      setfundUsed(res.data.QTY_TYPE[0].fund_used)
      setServices(res.data.services);
      setServicesGroupId(res.data.groupId)
      setQty_typeValue(res.data.QTY_TYPE[0].qty_type);
      setBroker(res.data.broker[0].broker);

      // res.data.services.forEach(element => {
      //   console.log('ttt',element.id)
      // });
      //  console.log('services clieent services',services)
      //console.log('setStrategy setStrategy',strategy)

      setLoader(false)
      if (services && services) {
      }

    });

    getIpAdress()
  }, [rerender, refreshscreen]);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  // const onShowClick = (id) => {
  //   if (window.confirm(Constant.DELETE_GROUP_CONFIRM_MSG)) {
  //     axios({
  //       method: "post",
  //       url: `${Config.base_url}smartalgo/group-services/delete`,
  //       data: { id: id },
  //     }).then(function (response) {
  //       setRefreshscreen(!refreshscreen);
  //     });
  //   }
  // };
 
  const setAllToSetStrategy = (e) => {
    if (e.target.value === "all") {
      setRerender(!rerender)
    }
    setServices(
      services.map((item, index) => {
        item.strategy = e.target.value
        // setRefreshscreen(!refreshscreen);
        return item
      }
      )
    )
  }

  const checkgroupquantity = (val, id) => {
   // alert(getBroker)
   
    if(getBroker != 12){

     // alert("other")
     
      servicesGroupId.forEach((x) => {
        
        if (id == x.service_id) {
          if(parseInt(x.group_qty) == 0){
           setGetServicePrice("0"); 
          }
        else if (parseInt(val) > parseInt(x.group_qty)) {
           setGetServicePrice("1");
           val = x.group_qty;
           setShowAlert(true);
           setAlertColor("error");
           setTextAlert(`You can't update more than ${x.group_qty}`);
           // const inputField = document.getElementsByName("qty")[0];
           // inputField.value = val; // Update the input field's value directly
           return;
         } else {
           setGetServicePrice("0");
         }
       }
     });
    }else{

      
     // alert("motilal")

      servicesGroupId.forEach((x) => {
       
        

        if (id == x.service_id) {
          
        //console.log("x - ",x)
       
        const servicesget = services.filter(item => item.service_id === x.service_id);


      //  console.log("val - ",val)
       // console.log("x.group_qty - ",x.group_qty)
       // console.log("servicesget single - ",servicesget[0].lot_size_service)

       
       const new_val = parseInt(servicesget[0].lot_size_service)*(val)
       console.log("new_val - ",new_val)

          if(parseInt(x.group_qty) == 0){
           setGetServicePrice("0"); 
          }
        else if (parseInt(new_val) > parseInt(x.group_qty)) {
           setGetServicePrice("1");
           val = x.group_qty;
           setShowAlert(true);
           setAlertColor("error");
           setTextAlert(`You can't update more than ${x.group_qty}`);
           // const inputField = document.getElementsByName("qty")[0];
           // inputField.value = val; // Update the input field's value directly
           return;
         } else {
           setGetServicePrice("0");
         }
       }
     });
    }


  };

  // const checkgroupquantity = (e, id) => {
  //   servicesGroupId.forEach((x) => {
  //     if (id == x.service_id) {
  //       const val = e.target.value; // Get the input value from the event object
  //       console.log("e.target.value", e.target.value);
  //       if (parseInt(val) > parseInt(x.group_qty)) {
  //         setGetServicePrice("1");
  //         const updatedValue = x.group_qty;
  //         setShowAlert(true);
  //         setAlertColor("error");
  //         setTextAlert(`You can't update more than ${x.group_qty}`);

  //         // Update the specific input field that triggered the event
  //         e.target.value = updatedValue;

  //         return;
  //       } else {
  //         setGetServicePrice("0");
  //       }
  //     }
  //   });
  // };


  const serviceChange = (e, id, sig) => {

    // console.log("e", e.target.value);
    // console.log("sig", sig);

    //  if (e.target.value == "") {

    //     setServices(
    //       services.map(
    //         (item, index) => (item.qty = index == id ? "" : item)
    //       )
    //     );
    //     return
    //   } 

    // if (e.target.name == "qty") {
    //   //   const re = /^[0-9\b]+$/;

    //   if (sig.quantity != "0" && e.target.value > sig.quantity) {
    //     setShowAlert(true);
    //     setAlertColor("error");
    //     setTextAlert(`Can't update more than ${sig.quantity} in ${sig.ser_name}`);
    //     // e.target.value = sig.quantity;
    //     return
    //   }
    //   else {
    //     setServices(
    //       services.filter(
    //         (item, index) => {
    //           if (index == id) {
    //             item.qty = e.target.value
    //           } else {
    //             item.qty = item.qty
    //           }
    //           return item
    //         }
    //       )
    //     );
    //   }
    // }

    if (e.target.name == "qty") {
      // console.log("qtyyyyy", e.target.value);
      // checkgroupquantity(e.target.value)
      setServices(
        services.filter(
          (item, index) => {
            if (index == id) {
              item.qty = e.target.value
            } else {
              item.qty = item.qty
            }
            return item
          }
        )
      );
    }

    if (e.target.name == "cstrategy") {

      setServices(
        services.filter(
          (item, index) =>
            (item.strategy = index == id ? e.target.value : item.strategy)
        )
      );
    }

    if (e.target.name == "order_type") {
      setServices(
        services.filter(
          (item, index) =>
            (item.order_type = index == id ? e.target.value : item.order_type)
        )
      );
    }

    if (e.target.name == "product_type") {
      setOrderTypeValue(e.target.value);
      setServices(
        services.filter(
          (item, index) =>
          (item.product_type =
            index == id ? e.target.value : item.product_type)
        )
      );
    }

    if (e.target.name == "trading") {
      setServices(
        services.filter((item, index) => {
          if (index == id) {
            item.trading = item.trading == 0 ? 1 : 0;
          }
          return item;
        })
      );
    }

  };

  const handleSubmit = () => {

    const ServiceArr = services.map((item) => {
      // console.log('item.qty',item.qty);
      // var item_qty= parseInt(item.qty);
      // checkgroupquantity(item.qty)
       
      if ((locationname == 'software.goalgos.com' || locationname == 'client.algomaster.in') && item.ser_name == "BANKNIFTY" && item.qty > 100 && item.strategy == "STRAT1") {
        // item.qty = 100;
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("BANKNIFTY Can't Update More Than 100");
        return
      }

      if ((locationname == 'software.goalgos.com' || locationname == 'client.algomaster.in') && item.ser_name == "NIFTY" && item.qty > 200 && item.strategy == "STRAT1") {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("NIFTY Can't Update More Than 200");
        // item.qty = 200;
        return
      }

      // if (item.quantity != "0" && item.qty > item.quantity) {
      //   setShowAlert(true);
      //   setAlertColor("error");
      //   setTextAlert(`Can't update please check your STRATEGY quantity`);
      //   item.qty = 1;
      //   return
      // }

      if (item.qty < -1) {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("Can't update less than -1");
        // item.qty = 200;
        return
      }

      if (item.qty == 0 || item.qty == "" || item.qty == null) {
        item.qty = 1;
      }
      if (item.strategy == 'null' || strategy.length == 1) {
        item.strategy = strategy[0].strategy
      } else if (strategy.length > 0) {
        return item
      }
      return item

    })

    if (getServicePrice == 1) {
      setShowAlert(true);
      setAlertColor("error");
      setTextAlert("You have not inserted correct Quantity, Please check your Quantity again.");
      return
    }

    axios({
      method: "post",
      url: `${Config.base_url}client/updateservices`,
      data: {
        client_signal: ServiceArr,
        client_id: user_id,
        ipAddress: ipAddress
      },
      headers: {
        'x-access-token': client_token
      }
    }).then(function (response) {
      // console.log("response.data.status", response);
      if (response.data.status) {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(Constant.UPDATED_SUCCESS);
        // setRefreshscreen(!refreshscreen);
        window.location.reload()
      }
      else if (response.data.status == false) {
        response.data.message.map((item) => {
          if (stratValueChange != "") {
            alert(item.message)
            window.location.reload()
          } else {
            alert(item.message)
            // setRefreshscreen(!refreshscreen);
            window.location.reload()
          }
        })
      }

    });
  };


  // ------------------my Code ganpat -----
  // const [maxValue, setMaxValue] = useState(23);
  // const [value, setValue] = useState(0);

  // const qtyonChange = (event, straQty, actualqty) => {
  //   setMaxValue(straQty)
  //   const newValue = parseInt(event.target.value);
  //   if (newValue > maxValue) {
  //     setValue(maxValue);
  //   } else {
  //     setValue(newValue);
  //   }
  // };


  const qtyonChange = (event, straQty, actualqty) => {
    // setStraValue(straQty)

    const newValue = parseInt(event);
    if (newValue > parseInt(straQty)) {
      alert("tt")
      //setStraValue(straQty);
    } else {
      //  setStraValue(newValue);
    }
  }

  // ------------------my Code ganpat -----

  // const onKeyPressQuantity = (quantity, qty, e) => {
  //   console.log("quantity",typeof quantity);
  //   console.log("qty",typeof qty);
  //   console.log("e",typeof e.target.value);

  //   if(qty > quantity){
  //     alert(`You can't update more than ${quantity} quantity`);
  //     return e.target.value = toString(quantity)

  //   }
  // }

  // const redirectToManualTrade = () => {
  //   navigate('/client/newmessenger')
  // }


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
              <div className="card-header">
                <h4 className="card-title font">Dashboard</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <b>Set All Strategy</b>
                    <select
                      name="cstrategy"
                      // value={sig.strategy}
                      onChange={(e) => {
                        setAllToSetStrategy(e);
                      }}
                      className="form-control spacing"
                      style={{ width: "100px" }}
                    >
                      <option value="all">All</option>
                      {strategy && strategy.map((star, i) => (
                        <>
                          <option value={star.strategy} key={i}>{star.strategy}</option>
                        </>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-8">
                    <ClientFundUsed dataServices={services} qty_type={qty_typeValue} />

                    <div>
                      {/* <button className="btn btn-info" onClick={redirectToManualTrade}>Manual Trade</button> */}
                    </div>
                  </div>
                </div>

                {getBroker == 12 ? <div className="col-md-4 ">
                  <b style={{ "color": "red" }}>*** Please Enter Lot Size</b>


                </div> : ""}

                <div className="table-responsive tableheight" >
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr className="fontbold">
                        <th className="fontbold">No.</th>
                        <th className="fontbold">Symbol</th>
                        <th>{getBroker == 12 ? "Lot Size" : "Quantity1"}</th>
                        {/* <th>Price</th> */}
                        <th>Segment</th>
                        <th>Strategy</th>
                        <th>Order Type</th>
                        <th>Product Type</th>
                        <th>Trading</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services && services.map((sig, index) => (
                        <tr key={index}>
                          {/* <td>{sig.quantity}</td> */}
                          <td>{index + 1}</td>
                          <td>{sig.ser_name}</td>
                          <td>

                            {/* <input type="number" value={value} onChange={(e) => qtyonChange(e, sig.quantity, sig.qty, index)
                            } max={sig.quantity}
                             disabled
                            ={qty_typeValue && qty_typeValue == 0 || qty_typeValue == "0"}  */}
                            {/* /> */}

                            <input
                              name="qty"
                              type="number"
                              pattern=" ^[1-9]?[0-9]{1}$|^100$"
                              onChange={(e) => {
                                
                                serviceChange(e, index, sig);
                                checkgroupquantity(e.target.value, sig.service_id)
                                // qtyonChange(e, sig.quantity, sig.qty, index);
                              }}
                              disabled={
                                (qty_typeValue === 0 || qty_typeValue === "0") ||
                                ((fundUsed === 1 || fundUsed === 2) && qty_typeValue === 1 && sig.cat_name === "CASH")
                              }
                              // disabled={index ? "" :maxValue }
                              style={{ width: "150px" }}
                              defaultValue={sig.qty}
                              //   value={StraValue}
                              className="form-control"
                              min="-1"
                              max={sig.quantity == 0 ? "" : sig.quantity}
                            // max={sig.quantity}
                            />
                          </td>

                          {/* <td>
                            {console.log('tokenPrice -', price)}
                            {tokenPrice == sig.instrument_token ? price : ''}
                          </td> */}

                          <td>{sig.cat_name}</td>
                          <td>
                            <select
                              name="cstrategy"
                              value={stratValueChange == "" ? sig.strategy : stratValueChange}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}
                              className="form-control"
                              style={{ width: "100px" }}
                            >

                              {strategy && strategy.map((star, i) => (

                                sig.strategy == star.strategy ? <><option style={{ color: "green", fontWeight: "bold" }} key={i}>{star.strategy}</option></> : <><option style={{ color: "red", fontWeight: "bold" }} key={i}>{star.strategy}</option></>
                              ))}
                              {/* <option key={i} style={{ color: "green" }}>{star.strategy}</option> */}
                            </select>
                          </td>
                          <td>
                            <select
                              className="order_type form-control"
                              name="order_type"
                              value={sig.order_type}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}

                              style={{ width: "100px" }}
                            >
                              {sig.product_type == "1" ||
                                sig.product_type == "2" ? (
                                <>
                                  <option value="1">MARKET</option>
                                  <option value="2">LIMIT</option>
                                  {/* <option value="3">STOPLOSS LIMIT</option>
                                  <option value="4">STOPLOSS MARKET</option> */}
                                </>
                              ) : sig.product_type == "3" ? (
                                <>
                                  <option value="2">LIMIT</option>
                                  <option value="3">STOPLOSS LIMIT</option>
                                </>
                              ) : sig.product_type == "4" ? (
                                <>
                                  <option value="1">MARKET</option>
                                  <option value="2">LIMIT</option>
                                </>
                              ) : (
                                ""
                              )}
                            </select>
                          </td>
                          <td>
                            <select
                              className="product_type form-control"
                              name="product_type"
                              value={sig.product_type}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}

                              style={{ width: "100px" }}
                            >
                              <option value="1">CNC</option>
                              <option value="2">MIS</option>
                              {/* <option value="3">BO</option>
                              <option value="4">CO</option> */}
                            </select>
                          </td>
                          <td>
                            <Form.Check
                              type="switch"
                              name="trading"
                              checked={sig.trading == "1" ? true : false}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-md-10 pr-1">
                    {fromadmin == null &&
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-color btn-block"
                      >
                        Update
                      </button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )}
    </>
  );
}

export default Dashboard;
