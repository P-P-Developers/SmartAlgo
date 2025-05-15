import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import { dateFormate } from "../common/CommonDateFormate";



const SubTradingStatus = () => {

  const [tableData, setTableData] = useState([]);
  const [loader, setloader] = useState(false);
  const [fdata, setFdata] = useState("");
  const [dataFilter, setDatafilter] = useState([]);

  // console.log("tableData", tableData);
  const admin_token = localStorage.getItem("token");

  const adminId = localStorage.getItem("adminId");


  const fileName = "TradingStatusAdmin";

  const columns = [
    {
      name: "NO.",
      selector: (row) => row.id,
    },
    {
      name: "NAME",
      selector: (row) => row.name,
    },
    {
      name: "USERNAME",
      selector: (row) => row.username,
    },
    {
      name: "TRADING",
      selector: (row) => row.trading,
    },
    {
      name: "CREATED DATE",
      selector: (row) => row.created_at,
    },
  ];

  // const setNewTime = (time) => {
  //   let currentDate = time.split("T");
  //   let currentTime = currentDate[1].split(".")[0];
  //   return `${currentDate[0]} ${currentTime}`;
  // };

  var data = []

  useEffect(() => {
    setloader(true);

    axios({
      method: "post",
      url: `${Config.base_url}admin/tradingStatusSubadmin`,
      data: {
        'adminId': adminId,
      },
      headers: {
        'x-access-token': admin_token
      }

    }).then((res) => {

      res.data.tradingStatus.map((ts, i) => {
        data.push({
          id: i + 1,
          name: ts.fname,
          username: ts.username,
          trading: ts.trading,
          created_at: dateFormate(ts.created_at),
        })
        setTableData(data)
        getFilterName(data)
        setDatafilter(data)
        // setFdata(ts.fname);
      }
      )
      setloader(false);
    });


    // axios.post(`${Config.base_url}admin/tradingStatusSubadmin`, {
    //   headers: {
    //     'x-access-token': admin_token
    //   }, data: {'adminId' :adminId}
    // }).then((res) => {

    //   res.data.tradingStatus.map((ts, i) => {
    //     data.push({
    //       id: i + 1,
    //       name: ts.fname,
    //       username: ts.username,
    //       trading: ts.trading,
    //       created_at: dateFormate(ts.created_at),
    //     })
    //     setTableData(data)
    //     setloader(false);
    //     getFilterName(data)
    //     setDatafilter(data)
    //     // setFdata(ts.fname);
    //   }
    //   )
    // });
  }, []);
  // console.log("hello",fdata)

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
        textTransform: 'uppercase !important'
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: row => row.trading.slice(-2) === "ON",
      style: {
        color: 'green',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: row => row.trading.slice(-3) === "OFF",
      style: {
        color: 'red',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const uniqueName = (value, index, self) => {
    // console.log("value",value, "index",index, "self",self)
    return self.indexOf(value) === index;
  }

  const getFilterName = (data) => {
    const filterName = data && data.map((x, i) => x.username)
    const namesFilter = filterName.filter(uniqueName)
    setFdata(namesFilter)
    // return filterName
  }
  //  console.log("hey", filterName)
  //  console.log("hey",getFilterName() )

  const filterchange = (e) => {
    var FilterData = dataFilter.filter((item) => {
      if (item.username.toString().includes(e.target.value.toString())) {
        return item
      }
    })
    setTableData(FilterData)
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
                    <h4 className="card-title">Trading Status</h4>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="col-md-3 export-btn d-flex justify-content-center">
                    <ExportToExcel
                      className="btn-color btn"
                      apiData={tableData && tableData}
                      fileName={fileName}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <label style={{ fontWeight: 'bold', color: 'black' }}>Status</label>
                  <select className="form-control" name="userdatafilter" onChange={(e) => { filterchange(e) }}>
                    <option value=''>All</option>

                    {
                      fdata && fdata.map((item, i) =>
                        (<option key={i}>{item}</option>)
                      )
                    }
                  </select>
                </div>

                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div className="table-responsive">

                      <DataTableExtensions
                        columns={columns}
                        data={tableData}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          fixedHeader
                          fixedHeaderScrollHeight="700px"
                          highlightOnHover
                          // pagination
                          noHeader
                          customStyles={customStyles}
                          conditionalRowStyles={conditionalRowStyles}
                          defaultSortField="id"
                          style={{ overflow: "scroll" }}
                          paginationRowsPerPageOptions={[10, 50, 100]}
                          paginationComponentOptions={{
                            selectAllRowsItem: false,
                            selectAllRowsItemText: "All",
                          }}
                        />
                      </DataTableExtensions>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubTradingStatus
