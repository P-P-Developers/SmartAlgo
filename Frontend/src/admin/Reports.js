import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import * as Config from "../common/Config";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { dateFormate } from "../common/CommonDateFormate";

function Reports() {
  const fileName = "Reports";

  // const useParamss = useParams()

  var columns = [
    {
      name: <h6>S No.</h6>,
      selector: (row) => row.sno,
      width: '70px !important',
    },
    {
      name: <h6>Name</h6>,
      selector: (row) => row.full_name,
      width: '150px !important',
    },
    {
      name: <h6>Username</h6>,
      selector: (row) => row.username,
      width: '150px !important',
    },
    {
      name: <h6>Strategy/Services</h6>,
      width: '180px !important',
      selector: (row) => (
        <>
          <button
            onClick={(e) => {
              modalShow(row.id, row.full_name);
            }}
            className="btn btn-new-block btn-color"
          >
            <i
              style={{ fontSize: "18px" }}
              class="now-ui-icons gestures_tap-01"
            ></i>
          </button>
        </>
      ),
    },
    {
      name: <h6>Broker</h6>,
      selector: (row) => row.broker,
      width: '110px !important',
    },
    {
      name: <h6>Live/Demo</h6>,
      selector: (row) => row.licence_type,
    },
    // {
    //   name: <h6>Services</h6>,
    //   selector: (row) => "test2",
    // },
    {
      name: <h6>Expiry Date</h6>,
      selector: (row) => dateFormate(row.expirydate).split(" ")[0],
      width: '180px !important',

    },
  ];

  var columnss = [
    {
      name: "Services",
      selector: (row) => row.services,
    },
    {
      name: "Strategy",
      selector: (row) => row.strategy,
    },
    {
      name: "Segment",
      selector: (row) => row.segment,
    },
  ];
  const [show, setShow] = useState(false);
  const [modal_name, setModalname] = useState(false);
  const [license_type, setLicense_type] = useState("");
  const [live_type, setLive_type] = useState("");
  const [demo_type, setDemo_type] = useState("");
  const [total_license, setTotal_license] = useState([]);
  const [demo_license, setDemo_license] = useState([]);
  const [expiredemo_license, setExpiredemo_license] = useState([]);
  const [activedemo_license, setActivedemo_license] = useState([]);
  const [live_license, setLive_license] = useState([]);
  const [expirelive_license, setExpirelive_license] = useState([]);
  const [activelive_license, setActivelive_license] = useState([]);
  const [convertedData, setConvertedData] = useState([]);
  // console.log("convertedData", convertedData);

  const [params] = new useSearchParams(window.location.search);

  var windowloca = window.location.hash
  // console.log("windowloca", windowloca);
  const navigate = useNavigate()

  // console.log("activedemo_license" ,params);

  const [tableData, settableData] = useState({
    columns,
    total_license,
  });
  const [st, setSt] = useState([]);
  const [loader, setLoader] = useState(false);
  // const [visiablity, setVisiablity] = useState()
  const [refresh, setRefresh] = useState(false)
  const [tableData1, settableData1] = useState({
    columnss,
    st,
  });

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  // console.log('param', params.get("live"));
  // console.log('window.location.search', window.location.search);


  useEffect(() => {
    setLoader(true);

    axios({
      method: "get",
      url: `${Config.base_url}admin/reports`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {

      // console.log("res1", res1);

      var data = [];
      var data1 = []
      setDemo_license(res1.data.total_demo);
      setExpiredemo_license(res1.data.expire_demo);
      setActivedemo_license(res1.data.active_demo);
      setLive_license(res1.data.total_live);
      setExpirelive_license(res1.data.expire_live);
      setActivelive_license(res1.data.active_live);
      // setConvertedData(res1.data.two_dayconvert)


      if (params.get("live") == 1) {

        res1.data.total_live.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
      }

      else if (params.get("active_live") == 1) {
        res1.data.active_live.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
      }

      else if (params.get("expired_live") == 1) {
        res1.data.expire_live.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );

      }

      else if (params.get("demo") == 1) {
        res1.data.total_demo.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );

      }

      else if (params.get("active_demo") == 1) {
        res1.data.active_demo.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );

      }

      else if (params.get("expired_demo") == 1) {
        res1.data.expire_demo.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );

      }


      else if (params.get("live") != 1) {

        // console.log('lvie else');
        res1.data.total.map((item, i) =>
          data.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
      }

      if (params.get("Converted") == 3) {

        res1.data.two_dayconvert.map((item, i) =>
          data1.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
        setConvertedData(data1)
      }
      if (params.get("two_dayTotal") == 4) {

        res1.data.two_dayTotal.map((item, i) =>
          data1.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
        setConvertedData(data1)
      }

      if (params.get("two_dayActive") == 5) {

        res1.data.two_dayActive.map((item, i) =>
          data1.push({
            full_name: item.full_name,
            username: item.username,
            broker: brokerName(item.broker),
            licence_type: licencType(item.licence_type),
            id: item.id,
            sno: ++i,
            expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
          })
        );
        setConvertedData(data1)
      }



      setTotal_license(data);
      if (window.location.search == "") {
        settableData({
          columns,
          data,
        });
      }
      // else if (windowloca == "#/admin/reports?Converted=3") {
      //   settableData({
      //     columns,
      //     convertedData,
      //   });
      // }
      //  console.log("aaaaa" ,params.get("live"));

      // if(params.get('live') === null || params.get('demo') === null ){
      //   setVisiablity("d-none")
      // }
      // else{
      //   setVisiablity("d-block")
      // }

      if (window.location.search == "?live=1") {
        changeLicensefunction("2", res1.data.total_live);
      } else if (window.location.search == "?demo=1") {
        changeLicensefunction("1", res1.data.total_demo);
      } else if (window.location.search == "?active_live=1") {
        setLicense_type("2");
        livefunction("1", res1.data.active_live);
      } else if (window.location.search == "?expired_live=1") {
        setLicense_type("2");
        livefunction("2", res1.data.expire_live);
      } else if (window.location.search == "?active_demo=1") {
        setLicense_type("1");
        demofunction("1", res1.data.active_demo);
      } else if (window.location.search == "?expired_demo=1") {
        setLicense_type("1");
        demofunction("2", res1.data.expire_demo);
      } else if (window.location.search == "?Converted=3") {
        setLicense_type("2");
        demofunction("3", res1.data.two_dayconvert);
      }
      setLoader(false);
    });
  }, [refresh]);

  const changeLicense = (e) => {
    var map_array = [];
    if (e.target.value == "1") {
      map_array = demo_license;
    }
    if (e.target.value == "2") {
      map_array = live_license;
    }
    changeLicensefunction(e.target.value, map_array);
  };

  const demoChange = (e) => {
    var map_array = [];
    if (e.target.value == "1") {
      map_array = activedemo_license;
    } else if (e.target.value == "2") {
      map_array = expiredemo_license;
    } else {
      map_array = demo_license;
    }
    demofunction(e.target.value, map_array);
  };

  const liveChange = (e) => {
    var map_array = [];
    if (e.target.value == "1") {
      map_array = activelive_license;
    } else if (e.target.value == "2") {
      map_array = expirelive_license;
    } else {
      map_array = live_license;
    }
    livefunction(e.target.value, map_array);
  };

  const changeLicensefunction = (v, map_array) => {
    var data = [];

    setLicense_type(v);
    map_array.map((item, i) =>
      data.push({
        full_name: item.full_name,
        username: item.username,
        broker: brokerName(item.broker),
        licence_type: licencType(item.licence_type),
        id: item.id,
        sno: ++i,
        expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
      })
    );
    settableData({
      columns,
      data,
    });
  };

  const demofunction = (v, map_array) => {
    setDemo_type(v);
    var data = [];
    map_array.map((item, i) =>
      data.push({
        full_name: item.full_name,
        username: item.username,
        broker: brokerName(item.broker),
        licence_type: licencType(item.licence_type),
        id: item.id,
        sno: ++i,
        expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
      })
    );
    settableData({
      columns,
      data,
    });
  };

  const livefunction = (v, map_array) => {
    var data = [];
    setLive_type(v);
    map_array.map((item, i) =>
      data.push({
        full_name: item.full_name,
        username: item.username,
        broker: brokerName(item.broker),
        licence_type: licencType(item.licence_type),
        id: item.id,
        sno: ++i,
        expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
      })
    );
    settableData({
      columns,
      data,
    });
  };
  const reset = (e) => {
    setLicense_type("");
    setLive_type("");
    setDemo_type("");
    var data = [];
    total_license.map((item, i) =>
      data.push({
        full_name: item.full_name,
        username: item.username,
        broker: brokerName(item.broker),
        licence_type: licencType(item.licence_type),
        id: item.id,
        sno: ++i,
        expirydate: item.end_date != null ? dateFormate(item.end_date).split(" ")[0] : "-",
      })
    );
    settableData({
      columns,
      data,
    });
  };

  const modalShow = (id, name) => {
    setModalname(name);
    axios({
      method: "post",
      url: `${Config.base_url}reports/strategies`,
      data: { 'adminId': adminId, user_id: id },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      // console.log("abcvbcvbcvbc" ,res1);
      var data = [];

      res1.data.response.map((item, i) =>
        data.push({
          services: item.ser_name,
          strategy: item.strategy,
          segment: item.cat_name,
          id: item.id,
          sno: ++i,
        })
      );

      setSt(data);

      setShow(true);
    });
  };

  const modalhide = () => {
    setShow(false);
  };

  //Broker Name

  const brokerName = (item) => {
    if (item == 0 || item == "") {
      return "-";
    } else {
      switch (item) {
        case "1":
          return "Alice Blue";
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
          return "5 Paisa";
          break;
        case "6":
          return "Fyers";
          break;
        case "7":
          return "Indira ";
          break;
        case "8":
          return "Trade Smart API";
          break;
        case "9":
          return "Market Hub";
          break;
        case "10":
          return "Master Trust";
          break;
        case "11":
          return "SMC";
          break;
        case "12":
          return "Motilal Oswal";
          break;
        case "13":
          return "Anand Rathi";
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
      }
    }
  };

  // Licence Name

  const licencType = (item) => {
    if (item == 0 || item == "") {
      return "-";
    } else {
      switch (item) {
        case 1:
          return "Demo";
          break;
        case 2:
          return "Live";
          break;
      }
    }
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

  // End Date
  const endDate = (item) => { };

  const scrollTable = {
    height: "450px",
    overflowY: 'auto',    /* Trigger vertical scroll    */
    overflowX: 'auto',  /* Hide the horizontal scroll */
  }

  // window.location.reload(false);
  const refreshpage = () => {
    navigate('/admin/reports')
    setRefresh(!refresh)
    // /admin/reports
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
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6">
                    <h4 class="card-title">Reports</h4>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="col-md-3 d-flex justify-content-center">
                    <ExportToExcel
                      className="btn btn-color"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                    />
                  </div>
                  <div class="col-2 ">
                    <button class='visiablity btn btn-color' onClick={refreshpage}>Refresh</button>
                    {/* <button class={visiablity ? "btn btn-primary" :" btn btn-primary"} >refresh</button> */}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="r-btn">
                      <label class="radio-inline" id="d_status">
                        <input
                          type="radio"
                          name="licence_type"
                          onClick={(e) => {
                            changeLicense(e);
                          }}
                          checked={license_type === "1"}
                          value="1"
                          class="demo_status lictype"
                        />
                        Demo
                      </label>
                      <label class="radio-inline" id="d_status">
                        <input
                          type="radio"
                          name="licence_type"
                          checked={license_type === "2"}
                          onClick={(e) => {
                            changeLicense(e);
                          }}
                          value="2"
                          class="demo_status lictype"
                        />
                        Live
                      </label>
                    </div>
                  </div>
                </div>
                {license_type != "" ? (
                  <div>
                    <strong class="d-heading">
                      {license_type == "1" ? "Demo" : "Live"} Clients
                    </strong>
                    <div class="row d-flex">
                      {license_type == "1" ? (
                        <div class="col-md-3">
                          <select
                            name="demo_clients"
                            onChange={(e) => demoChange(e)}
                            value={demo_type}
                            class="form-control"
                          >
                            <option value="">All Demo Clients</option>
                            <option value="1">Active Demo Clients</option>
                            <option value="2">Expired Demo Clients</option>
                          </select>
                        </div>
                      ) : (
                        ""
                      )}
                      {license_type == "2" ? (
                        <div class="col-md-3">
                          <select
                            name="live_clients"
                            onChange={(e) => liveChange(e)}
                            value={live_type}
                            class="form-control"
                          >
                            <option value="">All Live Clients</option>
                            <option value="1">Active Live Clients</option>
                            <option value="2">Expired Live Clients</option>
                          </select>
                        </div>
                      ) : (
                        ""
                      )}
                      <div class="col-md-9">
                        <div class="form-group">
                          <input
                            type="reset"
                            onClick={(e) => reset(e)}
                            class="btn btn-primary btn-new"
                            value="Reset"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="card-body">
                  <div className="row d-flex justify-content-end">
                    <div className="col-md-3 export-btn d-flex justify-content-center">
                    </div>
                    <div className="table-responsive">
                      {(windowloca == "#/admin/reports?Converted=3" || windowloca == "#/admin/reports?two_dayTotal=4" || windowloca == "#/admin/reports?two_dayActive=5") ?
                        <DataTableExtensions
                          export={false}
                          print={false}
                          columns={columns}
                          data={convertedData}
                        >
                          <DataTable
                            fixedHeader
                            fixedHeaderScrollHeight="600px"
                            className={scrollTable}
                            defaultSortField="id"
                            defaultSortAsc={false}
                            pagination
                            highlightOnHover
                            customStyles={customStyles1}
                            paginationRowsPerPageOptions={[10, 50, 100]}
                            paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                          />
                        </DataTableExtensions>
                        :
                        <DataTableExtensions
                          {...tableData}
                          export={false}
                          print={false}
                        >
                          <DataTable
                            fixedHeader
                            fixedHeaderScrollHeight="600px"
                            className={scrollTable}
                            defaultSortField="id"
                            defaultSortAsc={false}
                            pagination
                            highlightOnHover
                            customStyles={customStyles1}
                            paginationRowsPerPageOptions={[10, 50, 100]}
                            paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                          />
                        </DataTableExtensions>
                      }

                      <Modal show={show} onHide={modalhide}>
                        <Modal.Header closeButton>
                          <Modal.Title
                            style={{
                              display: "flex",
                              flexGrow: "0.8",
                              marginTop: "20px",
                            }}
                          >
                            {modal_name}
                          </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <>
                            <DataTable
                              columns={[
                                {
                                  name: <h6>Services</h6>,
                                  selector: (row) => row.services,
                                },
                                {
                                  name: <h6>Strategy</h6>,
                                  selector: (row) => row.strategy,
                                },
                                {
                                  name: <h6>Segment</h6>,
                                  selector: (row) => row.segment,
                                },
                              ]}
                              data={st}
                              defaultSortField="id"
                              defaultSortAsc={false}
                              pagination
                              highlightOnHover
                              customStyles={customStyles1}
                              paginationRowsPerPageOptions={[10, 50, 100]}
                              paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
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
    </>
  );
}

export default Reports;
