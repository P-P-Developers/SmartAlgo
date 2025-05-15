import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Radio from '@mui/material/Radio';
import * as Config from "../../../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../../../common/ExportToExport";
import { Form } from "react-bootstrap";
import * as Constant from "../../../common/ConstantMessage";
import AlertToast from "../../../common/AlertToast";
import download from 'js-file-download';
import { dateFormate } from "../../../common/CommonDateFormate";

const ClosePosition = () => {


    const manual_dash = localStorage.getItem("manual_dash");
    const client_token = localStorage.getItem('client_token');
    const client_id = localStorage.getItem("client_id");
    const [clientDetailsStatus, setClientDetailsStatus] = useState(0);
  
    const [clientClientKey, setClientClientKey] = useState("");
    
    const client_key_panel = useRef("");
  
    const [clientDeatils, setClientDetails] = useState("");
  
  const [stretegydata, SetStretegydata] = useState('')
  
  
    const [userPermissionType, setUserPermissionType] = useState([]);
  
    const [clientSegment, setClientSegment] = useState([]);

    const CheckOneTimeOpenPositionRef = useRef(1);
  
    console.log("clientSegment - ",clientSegment);


    const closingPositionApi = () => {
        var config = {
            method: 'get',
            url: `${Config.base_url}closeposition`,
            headers: {}
        };
        axios(config).then(function (response) {

          // console.log("response.data.data",response.data.data);
           setClosingPositionData(response.data.data)


     
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    const closingPositionApiClient = (panelKey) => {
        var config = {
            method: 'post',
            url: `${Config.base_url}closepositionClient`,
            data: {
                panelKey: panelKey,
              },
            headers: {}
        };
        axios(config).then(function (response) {

           setClosingPositionData(response.data.data)
     
        })
            .catch(function (error) {
                console.log(error);
            });
    }





  
    if(manual_dash == null){
        // console.log("insideeeeeeeeeeeeeee   client");
        if(clientDetailsStatus == 0){
        setClientDetailsStatus(1)
        axios({
          url: `${Config.base_url}client/profile`,
          method: "POST",
          data: {
            client_id: client_id,
          },
          headers: {
            'x-access-token': client_token
          }
        })
          .then((res) => {
            if (res.data) {
             // alert('client')
             // console.log("daaaaata client", res.data.msg.client_key);
              setClientDetails(res.data.msg);
              setClientClientKey(res.data.msg.client_key);
              client_key_panel.current = res.data.msg.client_key
              closingPositionApiClient(res.data.msg.client_key)
              setClientSegment((res.data.msg.segment).split(',').map(Number));
              clientStartegyDataApi()
            }
          
          });
        
        }
        
      }else{

        if(CheckOneTimeOpenPositionRef.current == 1){
        CheckOneTimeOpenPositionRef.current = 0
        closingPositionApi();
        }
      }
    
      const clientStartegyDataApi = () => {
        axios({
          url: `${Config.base_url}client/services`,
          method: "post",
          data: {
            client_id: client_id,
          },
          headers: {
            'x-access-token': client_token
          }
        }).then((res) => {
           //console.log("strtegyyyyyy", res.data.strategy);
           SetStretegydata(res.data.strategy);
           UserPermissionApi()
          
        });
      }
    
      const UserPermissionApi = () => {
        axios({
          url: `${Config.base_url}getUserPermission`,
          method: "POST",
          data: {
            user_id: client_id,
          },
          // headers: {
          //   'x-access-token': client_token
          // }
        })
          .then((res) => {
          //  console.log("res.data sidebaar",res.data);
            if (res.data.status) {
              setUserPermissionType(res.data.data);
            }
          
          });
      } 
    
    
        /// All Permissio Type set //
      
      const makeCall_condition = userPermissionType.filter((number) => number.permission_type_id ==1);
      
      const Segment_condition = userPermissionType.filter((number) => number.permission_type_id ==2);
      
      const optionChain_condition = userPermissionType.filter((number) => number.permission_type_id ==3);
      
      const stocks_option_condition = userPermissionType.filter((number) => number.permission_type_id ==4);
      
      const stock_index = userPermissionType.filter((number) => number.permission_type_id ==5);
    
      /// All Segment Condition
    
      const c_condition = clientSegment.filter((number) => number ==24);
      
      const f_condition = clientSegment.filter((number) => number ==25);
      
      const o_condition = clientSegment.filter((number) => number ==26);
      
      const mf_condition = clientSegment.filter((number) => number ==34);
      
      const mo_condition = clientSegment.filter((number) => number ==35);
      
      const co_condition = clientSegment.filter((number) => number ==36);
      
      const cf_condition = clientSegment.filter((number) => number ==37);
      
      const fo_condition = clientSegment.filter((number) => number ==39);
     
      const cb_condition = clientSegment.filter((number) => number ==40);
    
    //   console.log("f_condition",f_condition);
    //   console.log("clientClientKey",clientClientKey);
    //////////////
    



    const [closingPositionData, setClosingPositionData] = useState([])
    const [profitAndLoss, setProfitAndLoss] = useState("")
    console.log("closingPositionData", closingPositionData);

    const navigate = useNavigate()

    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Time</h6>,
            selector: (row) => dateFormate(row.created_at),
            width: '160px !important',
        },
        {
            name: <h6>Trade Symbol</h6>,
            selector: (row) => row.tradesymbol,
            //  width: '280px !important',
        },
        {
            name: <h6>Transaction</h6>,
            selector: (row) => lxsx(row.type),
            //     width: '120px !important',
        },
        {
            name: <h6>Type</h6>,
            selector: (row) => row.type,
            //    width: '60px !important',
        },
        {
            name: <h6>Qty</h6>,
            selector: (row) => row.exit_qty == null ? row.entry_qty : row.exit_qty,
            //  width: '60px !important'
        },
        {
            name: <h6>Entry Price</h6>,
            selector: (row) => row.executed_price == 0 ? "-" : row.executed_price,
            //width: '100px !important',
        },
        {
            name: <h6>Exit Price</h6>,
            selector: (row) => row.exit_price == 0 ? "-" : row.exit_price,
            width: '80px !important',
        },
        {
            name: <h6>P/L</h6>,
            selector: (row, index) => row.type == "LX" || row.type == "SX" ? profitLoss(row, index) : "-",
            // style={profitLoss(row, index) > 0 ? { color: "#FF0000" } : { color: "#008000" }},
            // style: { profitLoss(row, index)} ? {color: "#008000" }: {color: "#FF0000"}},
            width: '90px !important',
        },
        // {
        //     name: <h6>CPL</h6>,
        //     selector: (row, index) => cumulative(row, index),
        //     width: '90px !important',
        // },

    ];



    //  Count Comedity Profit Loss 

    const CountCPl = (row, index) => {
        console.log("ComedityPL", ComedityPL);
        let sum = ComedityPL.reduce((s, f) => {
            return parseFloat(s) + parseFloat(f)
        }, 0);
        return sum
        console.log("ComedityPL", sum);


    }






    var setCumulativePrice = []
    var price = 0
    var price1 = 0
    var comulativepri = 0
    var comulativepri1 = 0
    var totalsum = 0

    const cumulative = (row, i) => {
        if (row.type == "LX") {
            let lx = setCumulativePrice.filter((item) => {
                if (item.type === "LX") {
                    return item.price
                }
            }).reduce((s, f) => {
                return s + f.price;
            }, 0);
            // console.log("lx", lx)
            return lx.toFixed(2)
        }
        else if (row.type == "SX") {
            let sx = setCumulativePrice.filter((item) => {
                if (item.type === "SX") {
                    return item.price
                }
                // return sx
            }).reduce((s, f) => {
                return s + f.price;
            }, 0);
            // console.log("sx", sx)
            return sx.toFixed(2)
        } else {
            return "test"
        }

        console.log("setCumulativePrice", setCumulativePrice);

    }

    var ComedityPL = []
    const profitLoss = (row, i) => {
        if (closingPositionData[i - 1] != undefined) {
            if (row.type == "LX") {
                price = row.exit_price - closingPositionData[i - 1].executed_price
                setCumulativePrice.push({ "type": "LX", price: price })

            } else if (row.type == "SX") {
                price = closingPositionData[i - 1].executed_price - row.exit_price
                setCumulativePrice.push({ "type": "SX", price: price })
            }
            ComedityPL.push(price.toFixed(2))
            return price.toFixed(2)

            // if (price > 0) {
            //     return "green"
            // }
            // else if (price == '-') {
            //     return "black"
            // } else {
            //     return "red"
            // }
        }
    }


    const customStyles = {


        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: "#e9ecf0",
            },
        },
        headCells: {
            style: {
                fontWeight: '400',
                fontSize: "12px",
                // margin:' 19px 0px',
                background: '#d9ecff',

                color: '#607D8B',
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#e9ecf0',
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    fontWeight: '400',
                    fontSize: "12px",

                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#e9ecf0',
                },
            },
        },
    };


    const lxsx = (value) => {
        if (value == "LX") {
            return "SELL"
        }
        if (value == "SX") {
            return "BUY"
        }
        if (value == "LE") {
            return "BUY"
        }
        if (value == "SE") {
            return "SELL"
        }
    }

   


    useEffect(() => {
      //  closingPositionApi()
    }, [])


    return (
        <>

            <div className='manual'>
                <div className='content'>
                    <div className='card-dark'>

                        <div className="card-header">
                            <h4 className="card-title text-secondary">Closing Position</h4>
                            <div className="row">
                                <div className="col-md-6 mb-3">

                                </div>
                                <div className="col-md-3"></div>
                            </div>
                       {/* //     <button className='btn btn-secondary' onClick={() => navigate("/manual/optionchain")}>Back</button> */}
                        </div>

                        <div className="row d-flex justify-content-end mx-auto">
                            <div className="card-body mx-auto">
                                <div className="table-responsive">

                                    <DataTableExtensions
                                        columns={columns}
                                        data={closingPositionData}
                                        export={false}
                                        print={false}
                                    >
                                        <DataTable
                                            fixedHeader
                                            fixedHeaderScrollHeight="700px"
                                            noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            // pagination
                                            selectableRows
                                            //     onSelectedRowsChange={selectSquareOffSignal}
                                            customStyles={customStyles}
                                            highlightOnHover
                                        // paginationRowsPerPageOptions={[10, 50, 100]}
                                        // paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                        />
                                    </DataTableExtensions>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ClosePosition