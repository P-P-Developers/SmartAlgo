import React, { useEffect, useState, useCallback } from "react";
import "./admin.css"
import { useParams, useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Form } from "react-bootstrap";
import { TextField } from '@mui/material';
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import { dateFormate } from "../common/CommonDateFormate";

// const superadmin_token = localStorage.getItem("superadmin_token");
const Superadmin_name = localStorage.getItem("Superadmin_name");

const AdminList = () => {

  const [addTableData, setAddTableData] = useState([]);
  // console.log("addTableData", addTableData);
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [getMonthDataLicense, setMonthDataLicense] = useState([]);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(true);
  const fileName = "Monthly-billing";
  const { paramsId } = useParams()
  const navigate = useNavigate()
  var locationhostName = window.location.href.split("#")[0]

  const [minLicence, setMinLicence] = useState("")
  const [maxLicence, setMaxLicence] = useState("")
  const [licencePrice, setLicencePrice] = useState("")

  const locationname = window.location
  // console.log('locationname -', locationname);

  // console.log("location" ,window.location.href.split("#")[0].replace(panelModalName));
  // For Modal

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [showMonthList, setShowMonthList] = useState(false);
  const handleCloseMonthList = () => setShowMonthList(false);

  // For Pending Amount

  const [totalPending, setTotalPending] = useState("")
  const [currentPending, setCurrentPending] = useState("")
  const [totalReceived, setReceived] = useState("")


  const columns = [
    {
      name: <h6>S.No</h6>,
      selector: (row) => row.id,
      width: '60px !important'
    },
    {
      name: <h6>DOMAIN</h6>,
      selector: (row) => (
        <div onClick={() => adminDashboard(row.url)}>
          {row.url}
        </div>
      ),
      width: '240px !important'
    },
    {
      name: "MIN",
      selector: (row) => (
        <div>
          <input
            className="hidebg"
            name="min_price"
            type="number"
            onChange={(e) => inputChangePrices(e, row.id, 'min', row)}
            min={row.min_license}
            defaultValue={row.min_license}
          />
        </div>
      )
    },
    {
      name: "MAX",
      selector: (row) => (
        <div>
          <input
            className="hidebg"
            name="max_price"
            type="number"
            onChange={(e) => inputChangePrices(e, row.id, 'max', row)}
            max={row.max_license}
            defaultValue={row.max_license}
          />
        </div>
      )
    },
    {
      name: "L PRICE",
      selector: (row) => (
        <div>
          <input
            className="hidebg"
            name="licence_price"
            type="number"
            onChange={(e) => inputChangePrices(e, row.id, 'license', row)}
            defaultValue={row.price_license}
          />
        </div>
      )
    },
    {
      name: "UPDATE",
      cell: (row) => (
        <button className="btn btn-success btn-sm" onClick={() => updatePrices(row)}>Update</button>
      )
    }
  ];

  const updatePrice = [];

  const inputChangePrices = (e, id, field, row) => {

    const existingIndex = updatePrice.findIndex((item) => item.updatedId === id);
    if (existingIndex !== -1) {
      updatePrice[existingIndex][field] = e.target.value;
    } else {
      const updated = {
        updatedId: id,
        min_price: field === 'min' ? e.target.value : undefined,
        max_price: field === 'max' ? e.target.value : undefined,
        licence_price: field === 'license' ? e.target.value : undefined,
      };
      updatePrice.push(updated);
      // console.log("updatePrice", updatePrice);
    }

  };

  const updatePrices = (row) => {
    setLoader(true);

    // console.log("row", row);
    axios({
      method: "post",
      url: `${Config.base_url}superadmin/update_price`,
      data: {
        updatePrice: updatePrice
      },
      // headers: {
      //   'x-access-token': admin_token
      // }
    }).then(function (res) {
      console.log("res", res);
      setRefreshscreen(!refreshscreen);
    });
    setLoader(false);

  };

  const adminDashboard = (url) => {
    window.open(`https://${url}/#/admin/login`, '_blank');
  }


  var data = []
  var panalList = []
  useEffect(() => {
    axios.get(`${Config.base_url}superadmin/admins`, {
    }).then((res) => {
      // console.log("hellosuper", res.data.admins)
      {
        res.data.admins.map((add, i) => {
          data.push({
            id: i + 1,
            key: add.key,
            url: add.url,
            port: add.port,
            first_three: add.first_three,
            panal_status: add.panal_status,
            max_license: add.max_license,
            min_license: add.min_license,
            price_license: add.price_license,
          })
        })
        setAddTableData(data)
      }
    });
    panal_licences();
  }, [refreshscreen, refresh]);

  const conditionalRowStyles = [
    {
      when: row => row.panal_status == 1,
      style: row => ({ color: row.panal_status ? '#46AA46' : '#FF0000' }),
    },
    {
      when: row => row.panal_status == 0,
      style: row => ({ color: row.panal_status ? '#FF0000' : '#FF0000' }),
    },
  ];

  const panal_licences = () => {
    axios.get(`${Config.base_url}superadmin/panal_licences`, {
    }).then((res) => {
      // console.log("res");
    })
  }


  const handleShowMonthList = () => {
    setShowMonthList(true)
    axios.get(`${Config.base_url}superadmin/month_licences_list`, {
    }).then((res) => {
      // console.log("data", res)
      {
        res.data.list.map((data, i) => {
          panalList.push({
            id: i + 1,
            Company_Name: data.Company_name,
            total_license: data.total_license,
            total_used_license: data.total_used_license,
            previous_month: data.previous_month,
            current_month: data.current_month,
          })
        })
        setMonthDataLicense(panalList)
      }
    });
  }


  const customStyles = {
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
        justifyContent: 'Left !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };


  return (
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
                <div className="col-md-6 ">
                  <h3 className="card-title mx-3">Licence Payments</h3>
                </div>
                <div className="col-md-6">
                  <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                    <button type="button" className="btn btn-color" onClick={updatePrices}>
                      Update
                    </button>
                  </div>
                </div>

                <DataTableExtensions
                  columns={columns}
                  data={addTableData && addTableData}
                  export={false}
                  print={false}
                >
                  <DataTable
                    fixedHeader
                    fixedHeaderScrollHeight="700px"
                    highlightOnHover
                    pagination
                    noHeader
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    defaultSortField="id"
                    style={{ overflow: "scroll" }}
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    paginationComponentOptions={{
                      selectAllRowsItem: true,
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
  )
}

export default AdminList

