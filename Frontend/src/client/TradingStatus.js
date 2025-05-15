import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";
import { dateFormate } from '../common/CommonDateFormate';

const TradingStatus = () => {
  
  const [tradingSData, setTradingSData] = useState({});
  const client_id = localStorage.getItem('client_id');
  const client_token = localStorage.getItem('client_token');

  const columns = [
    {
      name: <h6>No</h6>,
      width: "60px !important",
      selector: (row) => row.title,
    },
    {
      name: <h6>Time</h6>,
      selector: (row) => row.time,
       width:"165px !important"
    },
    {
      name: <h6>Service Name</h6>,
      selector: (row) => row.service_name,
      width: "130px !important",
    },
    {
      name: <h6>Quantity</h6>,
      selector: (row) => row.quantity,
      width: "94px !important",
    },
    {
      name: <h6>Strategy</h6>,
      selector: (row) => row.strategy,
      width: "350px !important",
      wrap: true,
    },
    {
      name: <h6>Trading</h6>,
      selector: (row) => row.trading,
      width: "180px !important",
      textAlign: "center !important"
    },
    {
      name: <h6>Ip Address</h6>,
      selector: (row) => row.ip_address,
      width: "130px !important",
    },
    {
      name: <h6>Order Type</h6>,
      selector: (row) => row.order_type,
    },
    {
      name: <h6>Product Type</h6>,
      selector: (row) => row.product_type,
    },
    {
      name: <h6>Updated By</h6>,
      selector: (row) => row.user_status == 1 ? "Admin" : row.user_status == 3 ? "Client" : row.user_status == 4 ? "SubAdmin" : "",
    },
  ];

  var data = [];

  const getTradingStatus = () => {
    axios({
      url: `${Config.base_url}client/trading-status`,
      method: "POST",
      data: {
        client_id: client_id
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      //  console.log("tradingStatus",res.data.tradingStatus)
      if (res) {
        const tradingStatusData = res.data.tradingStatus
        tradingStatusData.forEach((item, index) => {
          data.push({
            title: index + 1,
            time: dateFormate(item.created_at),
            service_name: item.service_name === null ? "-" : item.service_name,
            quantity: item.qty === '' ? "-" : item.qty,
            strategy: item.strategy === '' ? "-" : item.strategy,
            trading: item.trading === '' ? "-" : item.trading,
            order_type: item.order_type === null || item.order_type === "" ? "-" : item.order_type,
            product_type: item.product_type === null || item.product_type === "" ? "-" : item.product_type,
            user_status: item.user_status,
            ip_address: item.ip_address,
          })
        })
        setTradingSData({ columns: columns, data: data })
        // console.log("Data",data)
      }
    });
  }
  useEffect(() => {
    getTradingStatus()
  }, [])

  const customStyles = {
    headCells: {
      style: {
        justifyContent: 'Center !important',
        backgroundColor: '#000',
        color: '#fff',
        minWidth: 'auto !important',
        fontWeight: "700",
        justifyContent: 'center !important'
      },
    },
    cells: {
      style: {
        justifyContent: 'Center',
        minWidth: 'auto !important',
      }
    },
  }

  // ************************ Table Color Condinally Manage *****************

  const conditionalRowStyles = [
    {
      when: row => row.trading && row.trading.slice(-2) === "ON",
      style: {
        color: 'green',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: row => row.trading && row.trading.slice(-3) === "OFF",
      style: {
        color: 'red',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  return (
    <div>
      {" "}
      <div
        className="container-fluid"
        style={{ marginTop: "-25px", height: "82.7vh" }}
      >
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Trading Status</h4>
                  <div className="row">
                    <div></div>
                  </div>

                  <div>
                    <DataTableExtensions
                      {...tradingSData}
                      export={false}
                      print={false}
                    >
                      <DataTable
                        // columns={columns}
                        fixedHeader
                        // data={tradingSData}
                        customStyles={customStyles}
                        fixedHeaderScrollHeight="700px"
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "All",
                        }}
                        conditionalRowStyles={conditionalRowStyles}
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
  );
};

export default TradingStatus;
