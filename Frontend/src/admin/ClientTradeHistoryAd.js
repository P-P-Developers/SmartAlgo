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
import Select from "react-select";

const ClientTradeHistoryAd = () => {

    const [getClientNames, setGetClientNames] = useState([])
    const [getSignals, setGetSignal] = useState([])
    const admin_token = localStorage.getItem("token");


    const columns = [
        {
            name: <h6>NO</h6>,
            selector: (row, index) => index + 1,
            width: '75px !important',
        },
        {
            name: <h6>Trade Symbol</h6>,
            selector: (row) => row.trade_symbol,
            width: '230px !important',
        },
        {
            name: <h6>Type</h6>,
            selector: (row) => row.signal_type,
            width: '100px !important',
        },
        {
            name: <h6>Strategy Tag</h6>,
            selector: (row) => row.strategy_tag,
            width: '190px !important',
        },
        {
            name: <h6>Option Type</h6>,
            selector: (row) => row.option_type,
            width: '160px !important',
        },
        {
            name: <h6>Date</h6>,
            selector: (row) => row.dt_date.split("T")[0],
            width: '160px !important',
        },
    ];


    const getClientApi = () => {
        axios.get(`${Config.base_url}smartalgo/client-names`, {
            headers: {
                'x-access-token': admin_token
            },
            data: {}
        }).then((res) => {
            // console.log("res", res.data.clientName);
            setGetClientNames(res.data.clientName)
        });
    }

    const postClientId = (client_id) => {
        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client-tradehistory`,
            data: {
                client_id: client_id.value
            },
            headers: {
                'x-access-token': admin_token
            }
        })
            .then(function (response) {
                // console.log("response", response.data.signals);
                setGetSignal(response.data.signals)
            })
    }

    useEffect(() => {
        getClientApi()
    }, [])


    const customStyles = {
        headCells: {
            style: {
                width: '100% !important',
                fontWeight: "700",
                backgroundColor: '#000',
                color: '#fff',
                justifyContent: 'center !important',
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

    const options = getClientNames && getClientNames.map(user =>{
        return {label: user.username, value: user.id}
      })

    
    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Client Trade History</h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                    </div>
                                    <div className="col-md-3"></div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label style={{ fontWeight: 'bold', color: 'black' }}>Client Names</label>
                                        <Select
                                            options={options}
                                            placeholder="Search Clients"
                                            // filterOption={filterOptions}
                                            // value={selectedOptions}
                                            onChange={postClientId}
                                            isSearchable={true}
                                        />
                                        {/* <select
                                            name="clienttype"
                                            //   value={csubadmin} 
                                            onChange={(e) => { postClientId(e.target.value) }}
                                            class="form-control"
                                        >
                                            <input type="text" id="filter" />
                                            <option value="">All</option>
                                            {getClientNames.map((cl, i) =>
                                                <option value={cl.id}>{cl.username}</option>)}
                                        </select> */}
                                    </div>
                                </div>
                            </div>

                            <div className="row d-flex justify-content-end mx-auto">
                                <div className="card-body mx-auto">
                                    <div className="table-responsive mx-auto">
                                        <DataTableExtensions
                                            export={false}
                                            print={false}
                                            columns={columns}
                                            data={getSignals}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                noHeader
                                                defaultSortField="id"
                                                style
                                                defaultSortAsc={false}
                                                pagination
                                                customStyles={customStyles}
                                                highlightOnHover
                                                paginationRowsPerPageOptions={[10, 50, 100]}
                                                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                            />
                                        </DataTableExtensions>
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

export default ClientTradeHistoryAd