import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Radio from '@mui/material/Radio';
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { Form } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../../src/common/AlertToast";
import download from 'js-file-download';
import { dateFormate } from "../common/CommonDateFormate";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function Clients() {

  const [refreshscreen, setRefreshscreen] = useState(true);
  const [clients, setClients] = useState([]);
  const [storeStatus, setStoreStatus] = useState("");
  const [tableData, settableData] = useState({});
  const [tradingTableData, setTradingTableData] = useState([]);
  const [dataFilter, setDatafilter] = useState([]);
  const [clientDashboardData, setClientDashboardData] = useState([])
  const [all, setAll] = useState('')
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const [modalName, setModalName] = useState("");
  const [selectedValue, setSelectedValue] = useState();
  const [strategy_filter, setStrategy_filter] = useState([]);
  const [Select_strat, setSelect_strat] = useState('');
  const [params] = new useSearchParams(window.location.search);
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [showManualPermission, setShowManualPermission] = useState(false);
  const [allPermissionType, setAllPermissionType] = useState([])
  const [allSegmentManual, setAllSegmentManual] = useState([])
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [manualClientId, setManualClientId] = useState("")
  const [showUpdateStrategies, setShowUpdateStrategies] = useState("")
  const [requestSegmentArray, setRequestSegmentArray] = useState([])
  const [requestPermissionArray, setRequestPermissionArray] = useState([])


  const handleShowManualPermission = (id) => {
    setManualClientId(id)
    setShowManualPermission(true)
  }


  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });


  const { id } = useParams()

  const dawnloadBrokerResponse = (id) => {
    axios({
      method: "post",
      url: `${Config.base_url}dawnload/data`,
      data: {
        client_id: id,
        key: 2
      },
    }).then(function (response) {
      if (response) {
        if (response.data.client.length > 0) {



          const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
          const fileExtension = ".xlsx";


          const ws = XLSX.utils.json_to_sheet(response.data.client);
          const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
          const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, "Broker Response" + fileExtension);

        }
      }
    });
  }



  const dawnloadTradingStatus = (id) => {

    axios({
      method: "post",
      url: `${Config.base_url}dawnload/data`,
      data: {
        client_id: id,
        key: 1
      },
    }).then(function (response) {
      if (response) {

        if (response.data.client.length > 0) {

          const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
          const fileExtension = ".xlsx";


          const ws = XLSX.utils.json_to_sheet(response.data.client);
          const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
          const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, "Trading Status" + fileExtension);

        }
      }
    });
  }










  const columns = [
    {
      name: <h6>No</h6>,
      selector: (row) => row.sno,
      width: '50px !important',
    },
    {
      name: <h6>Username</h6>,
      selector: (row) => row.username,
      width: '175px !important',
    },
    {
      name: <h6>Mobile</h6>,
      selector: (row) => row.mobile,
      width: '120px !important',
    },
    {
      name: <h6>Email</h6>,
      selector: (row) => row.email,
      width: '260px !important',
    },
    {
      name: <h6>Broker</h6>,
      selector: (row) => row.broker,
      width: '110px !important'
    },
    {
      name: <h6>Created On</h6>,
      selector: (row) => row.created_on,
      width: '120px !important'
    },
    {
      name: <h6>Start On</h6>,
      selector: (row) => row.start_on ? row.start_on.split(' ')[0] : row.start_on,
      width: '120px !important'
    },
    {
      name: <h6>Expired On</h6>,
      // selector: (row) => row.expired_on,
      selector: (row) => row.expired_on ? row.expired_on.split(' ')[0] : row.expired_on,
      // .includes('00:00:00')?row.expired_on.split(' ')[0]:row.expired_on ,
      width: '120px !important'
    },
    {
      name: <h6>Month</h6>,
      selector: (row) => row.broker == "Demo" ? "Demo" : row.twoday_service == 1 && row.license == 0 ? "2 Days" : row.license,
      width: '80px !important'
    },
    {
      name: <h6>Status</h6>,
      width: '80px !important',
      cell: (row) => (
        <>
          {/* <Form.Check
            type="switch"
            id="custom-switch"
            defaultChecked={row.status === '1' ? true : false}
            onClick={e => setToggleSwitch(e, row)}
          /> */}
          <BootstrapSwitchButton
            checked={row.status === '1' ? true : false}
            size="xs"
            onstyle="outline-success"
            offstyle="outline-danger"
            onChange={(e) => setToggleSwitch(e, row)}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <h6>Name</h6>,
      selector: (row) => row.name,
      width: '150px !important',
    },
    {
      name: <h6>Client Dashboard</h6>,
      width: '160px !important',
      selector: (row) => (
        <>
          <button
            className="btn btn-new-block"
            style={row.login_status === 0 ? { backgroundColor: "#FF0000" } : { backgroundColor: "#008000" }}
            onClick={() => goToDashboard(row.id, row.client_id)}
          >
            Go To Dashboard
          </button>
        </>
      ),
    },
    {
      name: <h6>Trading</h6>,
      width: '100px !important',
      selector: (row) => (
        <>
          <span style={(row.trading_type === "off" || row.trading_type === null || row.trading_type == "default_value") ? { color: "#FF0000", fontSize: "40px" } : { color: "#008000", fontSize: "40px" }}>&#9679;</span>
        </>
      ),
    },
    {
      name: <h6>Trading Status</h6>,
      width: '120px !important',
      selector: (row) => (
        <>
          <button
            className="btn btn-sm btn-color"
            onClick={() => modalTradingStatusApi(row.id, row.username)}
          >
            <i
              className="now-ui-icons gestures_tap-01 "
              style={{ fontSize: "14px" }}
            ></i>
          </button>
          {/* <i class="fa-solid fa-eye"
            cursor="pointer"
            onClick={() => modalTradingStatusApi(row.id, row.username)}
            style={{ fontSize: "15px" }}
          >
          </i> */}
        </>
      ),
    },
    {
      name: <h6>Actions</h6>,
      width: '220px !important',

      cell: (row) => (
        <>
          <NavLink
            to={`/admin/client/${Select_strat === "" ? row.id : row.client_id}`}
            style={{ marginRight: '15px' }}
          >
            <i
              className="fa-solid fa-pen-to-square pe-3 fs-5 edit_hover"
              variant="primary"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit Client"
            ></i>
          </NavLink>

          <i
            className={
              row.licencetype === "Live"
                ? 'fa-solid fa-trash fs-5 hover d-none'
                : 'fa-solid fa-trash fs-5 hover'
            }
            data-toggle="tooltip"
            data-placement="top"
            title="Delete Client"
            onClick={() => onShowClick(row.id)}
            style={{ marginRight: '15px' }}
          ></i>

          <i
            className="fa-solid fa-download"
            variant="primary"
            data-toggle="tooltip"
            data-placement="top"
            title="Trading Status"
            style={{ fontSize: '24px', marginRight: '15px' }}
            onClick={() => { dawnloadTradingStatus(row.id) }}
          ></i>
          {
            row.licencetype === "Live" ?
              <>
                <i
                  className="fa-solid fa-cloud-arrow-down"
                  variant="primary"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Broker Response"
                  style={{ fontSize: '24px', marginRight: '15px' }}
                  onClick={() => { dawnloadBrokerResponse(row.id) }}
                ></i>
              </>
              :
              ""
          }

        </>


      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const fileName = "ClientList";
  const navigate = useNavigate()


  const goToDashboard = (id, client_id) => {

    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/client/LoginStatusGet`,
      data: {
        client_id: Select_strat === "" ? id : client_id,
      },
    }).then(function (response) {
      if (response) {

        setStoreStatus(response.data.login_status)
        var loginStatus = response.data.login_status

        if (loginStatus == 0) {
          alert("Client Is Not Login Yet")
        } else {
          axios({
            method: "get",
            url: `${Config.base_url}admin/client-dashboard/${Select_strat === "" ? id : client_id}`,
            headers: {
              'x-access-token': admin_token
            }
          }).then(function (response) {

            // return
            if (response.data.success === "true") {
              navigate("/", { state: response.data.msg })
            }

          })
        }
      }
    });

  }


  // Trading Status API
  const modalTradingStatusApi = (adminId, username) => {

    var datats = []
    setShowList(true);
    axios({
      method: "post",
      url: `${Config.base_url}admin/trading-status-client`,
      data: {
        "client_id": adminId,
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res) => {

      if (res.data.tradingStatus != '') {
        setRefreshscreen(!refreshscreen);

        return res.data.tradingStatus.map((ts, i) => {
          datats.push({
            id: i + 1,
            name: ts.name,
            username: ts.username,
            trading: ts.trading,
            service_name: ts.service_name == null ? "-" : ts.service_name,
            created_at: dateFormate(ts.created_at),
          })
  
          setTradingTableData(datats)
        })
      }
    });
  }

  const modalhidelist = () => {
    setModalName("")
    setTradingTableData("")
    setShowList(false);
  };

  const conditionalRowStyles = [
    {
      when: row => row.trading.slice(-2) === "ON",
      style: {
        color: '#7CBB00',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: row => row.trading.slice(-3) === "OFF",
      style: {
        color: '#DC143C',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const setToggleSwitch = (e, row) => {

    axios({
      method: "post",
      url: `${Config.base_url}admin/client/changestatus`,
      data: {
        'adminId': adminId,
        licence_type: row.licencetype == "Demo" ? '1' : '2',
        id: row.id,
        status_term: row.status_term,
        to_month: row.to_month,
        status: e === true ? "1" : "0",
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
  
      if (response.data.status == "false") {
        alert(response.data.msg)
      }
    })
   
  }

  const onShowClick = (id) => {

    if (window.confirm("Do you want to delete this Client ?")) {
 
      axios({
        method: "post",
        url: `${Config.base_url}admin/client/delete`,
        data: {
          'adminId': adminId,
          Id: id
        },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {

        if (response.data.client == "true") {
          alert("Delete successfully")
    
          setTimeout(() => {
            setRefreshscreen(!refreshscreen);
          }, 1000);
        }
      });
    }

  };

  //  get broker name
  const brokerName = (id) => {
    if (id === 0 || id == "") {
      return "Demo";
    } else {
      switch (id) {
        case "1":
          return "AliceBlue";
          break;
        case "2":
          return "Zerodha";
          break;
        case "3":
          return "Zebull";
          break;
        case "4":
          return "Angel";
          break;
        case "5":
          return "5 paisa";
          break;
        case "6":
          return "Fyers";
          break;
        case "7":
          return "Indira";
          break;
        case "8":
          return "TradeSmartapi";
          break;
        case "9":
          return "MarketHub";
          break;
        case "10":
          return "MasterTrust";
          break;
        case "11":
          return "B2C";
          break;
        case "12":
          return "MotilalOswal";
          break;
        case "13":
          return "AnandRathi";
          break;
        case "14":
          return "Choice";
          break;
        case "15":
          return "Mandot";
          break;
        case "16":
          return "Kotak";
          break;
        case "17":
          return "Upstox";
          break;
        case "18":
          return "IIFL";
          break;
        case "19":
          return "Arihant";
          break;
        case "20":
          return "MasterTrust Dealer";
          break;
        case "21":
          return "Laxmi";
          break;
        case "22":
          return "Kotak Neo";
          break;
        case "23":
          return "Swastika";
          break;
        case "24":
          return "Indira XTS";
          break;
        case "25":
          return "ICICI Direct";
          break;
        case "27":
          return "Dhan";
          break;
        case "28":
          return "Upstox";
          break;
        case "29":
          return "Sharekhan";
          break;
        case "30":
          return "SMC";
          break;
        case "31":
          return "adroit";
          break;
        case "32":
          return "Shoonya";
          break;
        case "33":
          return "Samco";
          break;
      }
    }
  };

  const strategyFilter = () => {
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(res1 => {

      setStrategy_filter(res1.data.strategy);
      setLoader(false)
    });
  }

  var dataforstrat = []


  const getStrategyClients = (strat) => {


    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/find`,
      headers: {
        'x-access-token': admin_token
      },
      data: {
        strategy: strat,
      },
    }).then(function (response) {

      if (response) {
        response.data.data.map((cl, i) => {

          dataforstrat.push({
            sno: ++i,
            id: cl.id,
            client_id: cl.client_id,
            name: cl.full_name,
            username: cl.username,
            mobile: cl.mobile,
            broker: cl.licence_type === 2 ? brokerName(cl.broker) : "Demo",
            email: cl.email,
            licencetype: cl.licence_type === 2 ? "Live" : "Demo",
            status_term: cl.status_term,
            to_month: cl.to_month,
            status: cl.status,
            login_status: cl.login_status,
            trading_type: cl.trading_type,
            created_on: cl.created_at != null ? cl.created_at.split("T")[0] : "-",
            // expired_on: cl.end_date != null ? cl.end_date.split("T")[0] : "-",
            expired_on: cl.end_date == '0000-00-00' ? cl.end_date : dateFormate(cl.end_date),
            license: cl.to_month,
            is_ActiveClient: cl.is_ActiveClient,
            twoday_service: cl.twoday_service,
            start_on: cl.start_date == '0000-00-00' ? cl.start_date : dateFormate(cl.start_date),
            // start_on: cl.start_date != null ? cl.start_date.split("T")[0] : "-",
          })
        });
      }

      setClients(dataforstrat)

      if (strat == "all") {
        setClients(tableData.data)
      }
    });
  }


  var data = [];
  useEffect(() => {
    setLoader(true);

    axios.get(`${Config.base_url}admin/client`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {

      if (res.data) {
    
        if (params.get("client_id") == null) {
          res.data.client.map((cl, i) => {
            data.push({
              sno: ++i,
              id: cl.id,
              name: cl.full_name,
              username: cl.username,
              mobile: cl.mobile,
              broker: cl.licence_type === 2 ? brokerName(cl.broker) : "Demo",
              email: cl.email,
              licencetype: cl.licence_type === 2 ? "Live" : "Demo",
              status_term: cl.status_term,
              to_month: cl.to_month,
              status: cl.status,
              login_status: cl.login_status,
              trading_type: cl.trading_type,
              created_on: cl.created_at != null ? cl.created_at.split("T")[0] : "-",
              // expired_on: cl.end_date != null ? cl.end_date.split("T")[0] : "-",
              expired_on: cl.end_date == '0000-00-00' ? cl.end_date : dateFormate(cl.end_date),
              license: cl.to_month,
              is_ActiveClient: cl.is_ActiveClient,
              twoday_service: cl.twoday_service,
              start_on: cl.start_date == '0000-00-00' ? cl.start_date : dateFormate(cl.start_date),
              // start_on: cl.start_date != null ? cl.start_date.split("T")[0] : "-",
            })
         
          });
        } else {
          res.data.client.filter((cl, i) => {
            if (cl.id.toString().includes(params.get("client_id"))) {
              data.push({
                sno: ++i,
                id: cl.id,
                name: cl.full_name,
                username: cl.username,
                mobile: cl.mobile,
                broker: brokerName(cl.broker),
                email: cl.email,
                licencetype: cl.licence_type === 2 ? "Live" : "Demo",
                status_term: cl.status_term,
                to_month: cl.to_month,
                status: cl.status,
                login_status: cl.login_status,
                trading_type: cl.trading_type,
                created_on: cl.created_at != null ? cl.created_at.split("T")[0] : "-",
                // expired_on: cl.end_date != null ? cl.end_date.split("T")[0] : "-",
                expired_on: cl.end_date == '0000-00-00' ? cl.end_date : dateFormate(cl.end_date),
                license: cl.to_month,
                is_ActiveClient: cl.is_ActiveClient
              })
            }
          });
        }
        setClients(data);
        settableData({
          columns,
          data,
        });
        setLoader(false);
      }
    });

    strategyFilter()
    apiCalls()

  }, [refreshscreen, params.get("client_id")]);

  const apiCalls = () => {
    const data = {}
    const header = {
      'x-access-token': admin_token
    }
    axios.get(`${Config.base_url}admin/AllPermissionType`, {
    }).then((res) => {
   
      setAllPermissionType(res.data.data)
      // setCategories(res.data.category);
    });


    axios.get(`${Config.base_url}admin/AllSegment`, {
    }).then((res) => {

      setAllSegmentManual(res.data.data)
   
    });
  }



  const refreshpage = () => {
    navigate('/admin/clients')
    setRefreshscreen(!refreshscreen);
    // /admin/reports
  }

  const clientsTypeFilter = (e) => {
    var FilterData = tableData.data.filter((item) => {
      if (item.licencetype.toString().includes(e.target.value.toString())) {
        return item
      }
    })
    setClients(FilterData)
  }

  const clientsTradingOnOff = (e) => {

    var FilterData = tableData.data.filter((item) => {
      if (item.trading_type == e.target.value) {
        return item
      }
    })
    setClients(FilterData)
    if (e.target.value == "all") {
      setClients(tableData.data)
    }
  }


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
        justifyContent: 'center !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };

  const customStyles1 = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
      },
    },
    rows: {
      style: {
        // overflow:'visible !important',
        justifyContent: 'center !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };

  const manualPermissonCheck = (e) => {
    const { value, checked } = e.target;
    if (value === '2') {
      setShowCheckboxes(checked);
    }

    if (e.target.checked) {
      setShowUpdateStrategies((oldArray) => [...oldArray, parseInt(e.target.value)]);
    } else {
      setShowUpdateStrategies(showUpdateStrategies.filter((item, index) => item !== parseInt(e.target.value)));
    }

  };

  const manualSegmentCheck = (e) => {
    if (e.target.checked) {
      setRequestSegmentArray((oldArray) => [...oldArray, parseInt(e.target.value)]);
    } else {
      setRequestSegmentArray(requestSegmentArray.filter((item, index) => item !== parseInt(e.target.value)));
    }
  }


  const handleCloseManualPermission = () => {
   

    axios({
      method: "post",
      url: `${Config.base_url}admin/UpdateUserPermission`,
      data: {
        user_id: manualClientId,
        permission: showUpdateStrategies,
    
        segment: requestSegmentArray,
      },

    }).then(function (res) {
  
      window.location.reload()
    
    });
    setShowManualPermission(false)
  }

  const getUserDataManual = (id) => {
   
    axios({
      method: "post",
      url: `${Config.base_url}getUserPermission`,
      data: {
        user_id: id,
      },
    }).then(function (res) {

      setShowUpdateStrategies(res.data.data.map((x) => {
        return x.permission_type_id
      }))
      setRequestSegmentArray(res.data.segment.map((x) => {
        return parseInt(x.segment)
      }))
    });
  }

  const checkPermissionBox = (id) => {
    if (showUpdateStrategies && showUpdateStrategies.includes(id)) {


      return "minus";
    } else {
      return "";
    }
  }

  const checkPermissionSegmentBox = (id) => {

    if (requestSegmentArray && requestSegmentArray.includes(id)) {
      return "minus";
    } else {
      return "";
    }
  }

  const handleCloseManual = () => {
    setShowManualPermission(false)
    setRefreshscreen(!refreshscreen);
    window.location.reload()
  };

  return (
    <>
      <div className="content">
        <div className="row">
          <Modal show={showManualPermission} onHide={handleCloseManual}>
            <Modal.Header closeButton>
              <Modal.Title>Manual Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div>
                {allPermissionType.map((per) => {
                  const isChecked = checkPermissionBox(per.id);

                  return (
                    <div key={per.id}>
                      <input
                        type="checkbox"
                        value={per.id}
                        checked={isChecked ? true : undefined}
                        onChange={manualPermissonCheck}
                      />
                      <label>{per.label_type}</label>
                    </div>
                  );
                })}

                {showCheckboxes || (showUpdateStrategies && showUpdateStrategies.includes(2)) ? (
                  allSegmentManual.map((seg) => {
                    const isCheckedSeg = checkPermissionSegmentBox(seg.id);

                    return (
                      <div key={seg.id}>
                        <input
                          type="checkbox"
                          value={seg.id}
                          checked={isCheckedSeg ? true : undefined}
                          onChange={manualSegmentCheck}
                        />
                        <label>{seg.name}</label>
                      </div>
                    );
                  })
                ) : null}
              </div>

            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleCloseManualPermission}>
                Close
              </Button> */}
              <Button variant="primary" onClick={handleCloseManualPermission}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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
              <div className="card-header">
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="card-title">Clients</h4>
                  </div>
                  <div className="col-md-2 text-right">
                    <button class=' btn btn-color' onClick={refreshpage}>Refresh</button>
                  </div>
                  <div className="col-md-2">
                    <ExportToExcel
                      className="btn btn-color"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                    />
                  </div>
                </div>

                <div className="row d-flex align-items-center">
                  <div className="col-md-2">
                    
                    <NavLink to="/admin/client/add-client">
                      <button className="btn btn-color">Add Client</button>
                    </NavLink>
                    
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label style={{ fontWeight: 'bold', color: 'black' }}>Client Type</label>
                      <select
                        name="clienttype"
                        //   value={csubadmin}
                        onChange={(e) => { clientsTypeFilter(e) }}
                        class="form-control"
                      >
                        <option value="">All</option>
                        <option value="Demo">Demo</option>
                        <option value="Live">Live</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label style={{ fontWeight: 'bold', color: 'black' }}>Trading On/Off</label>
                      <select
                        name="clienttype"
                        //   value={csubadmin}
                        onChange={(e) => { clientsTradingOnOff(e) }}
                        class="form-control"
                      >
                        <option value="all">All</option>
                        <option value="on">ON</option>
                        <option value="off">OFF</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label style={{ fontWeight: 'bold', color: 'black' }}>Strategy Clients</label>
                      <select className="form-control" name="strategyname" onChange={(e) => { getStrategyClients(e.target.value); setSelect_strat(e.target.value) }}>
                        <option value="all">All</option>
                        {strategy_filter.map((sm, i) =>
                          <option value={sm.name}>{sm.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div class="col-2 ">
                    {/* <button class={visiablity ? "btn btn-primary" :" btn btn-primary"} >refresh</button> */}
                  </div>
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div className="table-responsive">

                      <DataTableExtensions
                        columns={columns}
                        data={clients}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          fixedHeader
                          fixedHeaderScrollHeight="700px"
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          pagination
                          customStyles={customStyles}
                          highlightOnHover
                          paginationRowsPerPageOptions={[10, 50, 100]}
                          paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                        />
                      </DataTableExtensions>

                      <Modal show={showList} onHide={modalhidelist}>
                        <Modal.Header closeButton>
                          <Modal.Title
                            style={{
                              display: "flex",
                              flexGrow: "0.8",
                              marginTop: "20px",
                            }}
                          >
                            {modalName}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <>
                            <DataTable
                              columns={[
                                // {
                                //   name: <h6>Name</h6>,
                                //   selector: (row) => row.name,
                                // },
                                {
                                  name: <h6>Username</h6>,
                                  selector: (row) => row.username,
                                  width: '120px !important',
                                },
                                {
                                  name: <h6>Trading</h6>,
                                  width: '120px !important',
                                  selector: (row) => row.trading,
                                  // width: '230px !important',
                                },
                                {
                                  name: <h6>Service Name</h6>,
                                  selector: (row) => row.service_name,
                                },
                                {
                                  name: <h6>Created At</h6>,
                                  selector: (row) => row.created_at,
                                  width: '170px !important',
                                },
                              ]}
                              data={tradingTableData}
                              fixedHeader
                              fixedHeaderScrollHeight="700px"
                              defaultSortField="id"
                              defaultSortAsc={false}
                              // pagination
                              highlightOnHover
                              // customStyle={customStyles1}
                              conditionalRowStyles={conditionalRowStyles}
                            // paginationRowsPerPageOptions={[10, 50, 100]}
                            // paginationComponentOptions={{
                            //   selectAllRowsItem: true,
                            //   selectAllRowsItemText: "All",
                            // }}
                            />
                          </>
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addservice" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <p>This is a large modal</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>

        </div>
        {showAlert &&
          <AlertToast
            hideAlert={onAlertClose}
            showAlert={showAlert}
            message={textAlert}
            alertColor={alertColor}

          />
        }
      </div>
    </>
  );
}

export default Clients;
