import React, { useEffect, useState, createContext ,useRef } from 'react'
// import DataTable from "../../../Utils/DataTable";
// import DataTableExtensions from "../../../Utils/DataTable";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
//import { confirm } from "react-confirm-box";
import { GetBelowAboveData,DeleteBelowAboveData ,UpdateBelowAboveData } from '../../../ApiCalls/Api.service'

import AlertToast from "../../../../common/AlertToast";

import axios from "axios";
import * as Config from "../../../../common/Config";




const Above = () => {

    const admin_token = localStorage.getItem("token");


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
  
    
    console.log("clientSegment - ",clientSegment);
  
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
              setClientSegment((res.data.msg.segment_all).split(',').map(Number));
              clientStartegyDataApi()
            }
          
          });
        
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














    const [Data, setData] = useState([])
    const [selectRowArray, setSelectRowArray] = useState([])
    const [refreshscreen, setRefreshscreen] = useState(false);
    

      // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const onAlertClose = (e) => {
    // console.log("  setShowAlert(false);");
    setShowAlert(false);
  };


    const GetStrategyDataFunction = async (e) => {

        let data = {
            "json_key": "above"
        }
        const response = await GetBelowAboveData(data, admin_token)
        if (response.data.status) {
            if (manual_dash == null) {
            const datas = response.data.data.filter((item) => item.panelKey == client_key_panel.current);
            setData(datas)
            }else{
            setData(response.data.data)
            }
            
        }

    }
   // console.log("get data", Data);
   const containerStyle = {
    width: '70px',
    height: '20px',
    backgroundColor: 'lightgray', // Example background color
  };


    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Symbol</h6>,
            selector: (row, index) =>  row.segment == "O" ?row.input_symbol+row.expiry+"_OPTION" : row.segment == "F" ? row.input_symbol+row.expiry+"FUT" : row.segment == "MF" ? row.input_symbol+row.expiry+"_MF" : row.segment == "MO" ? row.input_symbol+row.expiry+"_MO" : row.segment == "CF" ? row.input_symbol+row.expiry+"_CF" : row.segment == "CO"? row.input_symbol+row.expiry+"_CO" : row.input_symbol,
            width: '200px !important',
        },
        {
            name: <h6>Exit Time</h6>,
            selector: (row, index) => (row.exit_time).replace('-',':'),
            width: '100px !important',
        },
        {
            name: <h6>No Trade Time</h6>,
            selector: (row, index) => (row.notrade_time).replace( '-',':'),
            width: '100px !important',
        },
        {
            name: <h6> Live Price</h6>,
          
            cell: (row) => (
               
                  <span className={"live_price" + row.token}></span>
                    
            ),
           
          },
        {
            name: <h6>Price</h6>,
            // selector: (row, index) => row.above_price,
            cell: (row) => (
                <div>
                    <input
                         style={containerStyle}
                        className="hidebg"
                        name="price_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"price",row);
                        }}
                        defaultValue={row.above_price}
                    />
                </div>
            ),
            width: '80px !important',
        },
        {
            name: <h6>Strategy Tag</h6>,
            selector: (row, index) => row.strategy_tag,
            width: '130px !important',
        },
        // {
        //     name: <h6>Strike Price</h6>,
        //     selector: (row, index) => row.segment == "C" ? " - " :row.strike_price,
        //     width: '110px !important',
        // },
        {
            name: <h6>Transaction Type</h6>,
            selector: (row, index) => row.type == "LE" ? "BUY" : row.type == "SE" ? "SELL": "",
            width: '110px !important',
        },
        {
            name: <h6>Wise Type</h6>,
            selector: (row, index) => row.wisetype = "1"? "Percentage" : row.wisetype = "2" ? "Points" :" - " ,
            width: '140px !important',
        },
        {
            name: <h6>Target Price</h6>,
            // selector: (row, index) => row.TargetPrice,
            // width: '130px !important',

            cell: (row) => (
                <div>
                    <input
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"target",row);
                        }}
                        defaultValue={row.TargetPrice}
                    />
                </div>
            )
        },
        {
            name: <h6>StopLoss Price</h6>,
            // selector: (row, index) => row.StopLossPrice,
            // width: '130px !important',

            cell: (row) => (
                <div>
                    <input
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"stoploss",row);
                        }}
                        defaultValue={row.StopLossPrice}
                    />
                </div>
            )
        },
    ]
    

const [updateTargetStoploss, setUpdateTargetStoploss] = useState([])
  

   const inputChangeTargetStoplos = (e,type,row) =>{
     
   // console.log("type",type);
   // console.log("e",e.target.value);
  //  console.log("e",e.target.name);
  //  console.log("row",row);
    let set_target = 0;
    let set_stoploss = 0;
    let set_price = 0;
    if(type == "target"){
      set_target = parseFloat(e.target.value);
    }
    else if(type == "stoploss"){
        set_stoploss = parseFloat(e.target.value);
    }
    else{
      //  console.log("input price",e.target.value);
        set_price = parseFloat(e.target.value);
    }


    var pre_tag = {
        id: row.id,
        TargetPrice: set_target,
        StopLossPrice: set_stoploss,
        Price: set_price,
      };

    
      
      const filteredItems = updateTargetStoploss.filter(item => item.id == row.id);
     
      //console.log("filteredItems",filteredItems);

     if(filteredItems.length > 0){


    const updatedObject = { ...filteredItems[0]};

    // Step 2: Update the value of the object property
    if(type == "target"){
     updatedObject.TargetPrice =set_target;
    }else if(type == "stoploss"){
        updatedObject.StopLossPrice =set_stoploss;
    }else{
        updatedObject.Price =set_price;
    }
    
    
    //console.log("filteredItems[0].id",filteredItems[0].id);


    setUpdateTargetStoploss(oldValues => {
        return oldValues.filter(item => item.id !== filteredItems[0].id)
      })

    setUpdateTargetStoploss((oldArray) => [updatedObject, ...oldArray]);
   
    

  //  console.log("iff");
    }else{
     //    console.log("eleee");
      //   console.log("pre_tag",pre_tag);
         updateTargetStoploss.push(pre_tag)
        // console.log("updateTargetStoploss 1",updateTargetStoploss);
      }


   }


 //console.log("updateTargetStoploss",updateTargetStoploss);

  
const selectAboveROw = ({ selectedRows }) => {
        setSelectRowArray(selectedRows);
      };

  //console.log("setSelectRowArray",selectRowArray);
 
  const delete_data = async () => {
    if(selectRowArray.length <= 0){
      alert("please select any signal");
      return
    }  

   // alert("okkk")

   let text = "Are you sure you want delete signal ?";
   if (window.confirm(text) == true) {
    let data = {
        "json_key": "above",
        "delete_data": selectRowArray
       }
        const response = await DeleteBelowAboveData(data, admin_token);
        setShowAlert(true);
        setTextAlert("Signal delete successfully...");
        setAlertColor("success");
        setSelectRowArray([]);
        setRefreshscreen(!refreshscreen);
   } 

 }

 const update_data = async () => {
 
    if(updateTargetStoploss.length <= 0){
        alert("please select any signal");
        return;
    }

    let data = {
        "json_key": "above",
        "update_data": updateTargetStoploss
       }

  
    const response = await UpdateBelowAboveData(data, admin_token);
    setShowAlert(true);
    setTextAlert("Signal update successfully...");
    setAlertColor("success");
    setUpdateTargetStoploss([]);
    setRefreshscreen(!refreshscreen);

 }


    useEffect(() => {
        GetStrategyDataFunction()
    }, [refreshscreen])

    return (

    

  <div>
<button className='btn btn-success float-end' onClick={() => delete_data()}>DELETE</button>
 <button className='btn btn-success float-end' onClick={() => update_data()}>UPDATE</button>
    
                   <DataTableExtensions
                        columns={columns}
                        data={Data && Data} 
                        export={false}
                        print={false}
                        
                      >
                        <DataTable
                        fixedHeader
                        fixedHeaderScrollHeight="700px"
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        selectableRows
                        onSelectedRowsChange={selectAboveROw}
                        pagination
                        highlightOnHover
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                        />
                      </DataTableExtensions>

                      {showAlert &&
                  <AlertToast
              hideAlert={onAlertClose}
              showAlert={showAlert}
              message={textAlert}
              alertColor={alertColor}
            />
              }
        </div>
       
        
    )
    
}

export default Above