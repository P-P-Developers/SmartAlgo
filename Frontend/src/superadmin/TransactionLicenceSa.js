import React, { useEffect, useState, useCallback } from "react";
import "./admin.css"
import { useParams, useNavigate, NavLink } from "react-router-dom";
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

const TransactionLicenceSa = () => {

  const [sendPanelKey, setSendPanelKey] = useState("")
  const [getLicenceData, setGetLicenceData] = useState([])
  // console.log("getLicenceData", getLicenceData);
  const [refresh, setrefresh] = useState(true);

  var panelKey = localStorage.getItem("PanelKey")

  const columns = [
    {
      name: <h6>Client Id</h6>,
      selector: (row) => row.Client_Id ,
      width: '150px !important'
    },

    {
      name: <h6>Total License</h6>,
      selector: (row) => row.Total_License,
      width: '150px !important'
    },

    {
      name: <h6>Total Month</h6>,
      selector: (row) => row.Total_Month ,
      width: '150px !important'
    },

  ];

  const dubliLicence = () => {

    axios({
      method: "post",
      url: `${Config.base_url}superadmin/duplicate/license`,
      data: {
        key: sendPanelKey,
      },
    }).then(function (response) {
      console.log("response", response.data.data.data);
      setGetLicenceData(response.data.data.data)
      // if (response) {
      //   setrefresh(!refresh);
      // }
    })

  }


  useEffect(() => {

  }, [refresh])


  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
      },
    },
    // rows: {
    //     style: {
    //         // overflow:'visible !important', 
    //         justifyContent: 'center !important',
    //     },
    // },
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
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6 ">
                  <h3 className="card-title mx-3">Duplicate Licence</h3>
                </div>
                <div className="col-md-6">
                  <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                    {/* <NavLink
                                            to="/superadmin/adminlist"
                                            className="btn btn-color"
                                        >
                                            Back
                                        </NavLink> */}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Panel Key"
                    onChange={(e) => setSendPanelKey(e.target.value)}
                  />
                  <button className="btn btn-sm btn-success" onClick={dubliLicence}>Submit</button>
                </div>

                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div className="table-responsive">
                      <DataTableExtensions
                        columns={columns}
                        data={getLicenceData}
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
                        {/* <button>OK</button> */}
                      </DataTableExtensions>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionLicenceSa