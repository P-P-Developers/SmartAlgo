import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import "react-data-table-component-extensions/dist/index.css";
import * as Config from '../common/Config';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';
import { dateFormate } from "../common/CommonDateFormate";

const SignupClients = () => {

    var data = [];
    const [services, setServices] = useState([]);
    const [cat_id, setCat_id] = useState('');
    const [getSignupClients, setgetSignupClients] = useState([]);
    const [getgetSignupUser, setgetSignupUser] = useState([]);

    console.log("getSignupClients", getSignupClients);
    const [loader, setLoader] = useState(false);

    const admin_token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");

    const columns = [
        {
            name: <h6>S No.</h6>,
            selector: (row, index) => index + 1,
            width: '70px !important',
        },

        {
            name: <h6>Username</h6>,
            selector: row => row.username,
            width: '270px !important',
        },
        {
            name: <h6>Mobile</h6>,
            selector: row => row.mobile,
            width: '110px !important',
        },
        {
            name: <h6>Email</h6>,
            selector: row => row.email,
            width: '270px !important',
        },
        {
            name: <h6>Created At</h6>,
            selector: row => dateFormate(row.created_at).split(" ")[0],
            width: '110px !important',
        },
        {
            name: <h6>Expired At</h6>,
            selector: row => dateFormate(row.end_date).split(" ")[0],
            width: '110px !important',
        },
    ];

    const columns1 = [
        {
            name: <h6>S No.</h6>,
            selector: (row, index) => index + 1,
            width: '70px !important',
        },

        {
            name: <h6>Username</h6>,
            selector: row => row.userName,
            width: '180px !important',
        },
        {
            name: <h6>Mobile</h6>,
            selector: row => row.mobileNumber,
            width: '180px !important',
        },
        {
            name: <h6>Email</h6>,
            selector: row => row.email,
            width: '180px !important',
        },
        {
            name: <h6>Created At</h6>,
            selector: row => dateFormate(row.created_at).split(" ")[0],
            width: '180px !important',
        },
        {
            name: <h6>Active</h6>,
            width: '180px !important',
            cell: (row) => (
                <>
                    <BootstrapSwitchButton
                        checked={row.status === '1' ? true : false}
                        size="xs"
                        onstyle="outline-success"
                        offstyle="outline-danger"
                        onChange={(e) => approveDemo(e, row)}
                    />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: <h6>Actions</h6>,
            width: '180px !important',
            cell: (row) => (
                <>

                    <i
                        className="fa-solid fa-pen-to-square pe-3 fs-5 edit_hover"
                        variant="primary"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Edit Client"
                    ></i>

                    <i
                        className={row.licencetype === "Live" ? 'fa-solid fa-trash fs-5 hover d-none' : "fa-solid fa-trash fs-5 hover"}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete Client"
                    //   onClick={() => onShowClick(row.id)}
                    ></i>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const SignupClients = () => {
        setLoader(true)
        axios({
            method: "get",
            url: `${Config.base_url}admin/get/signupClients`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then(res => {
            if (res) {
                setgetSignupClients(res.data.data);
            }
        });
        setLoader(false)
    }
    const GetSignupClients = () => {
        setLoader(true)
        axios({
            method: "get",
            url: `${Config.base_url}admin/get/signup_user`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then(res => {
            if (res) {
                console.log("res.data.data", res.data.data);
                setgetSignupUser(res.data.data);
            }
        });
        setLoader(false)
    }
    useEffect(() => {
        SignupClients()
        GetSignupClients()
    }, []);

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


    const approveDemo = (e, row) => {
        console.log("row", row);
        axios({
            method: "post",
            url: `${Config.base_url}admin/client/signup`,
            data: {
                "userName":row.userName,
                "fullName":row.fullName,
                "mobileNumber":row.mobileNumber,
                "email":row.email,
                "status":row.status
            },

        }).then(function (response) {
            console.log("response", response.data);
            if (response.data.status == false) {
                alert(response.data.msg)
            }
        })

    }

    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <Backdrop
                            sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loader}
                        // onClick={handleClose}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <div className="card">
                            <div className="row">
                                <div className="col-md-9">
                                </div>
                                <div className="card-header" style={{ padding: "15px 35px 0" }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Signup Clients</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 pr-1">
                                        </div>
                                        <div className="col-md-3 d-flex flex-grow-1"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row d-flex justify-content-end">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTableExtensions
                                            data={getgetSignupUser && getgetSignupUser}
                                            columns={columns1}
                                            export={false}
                                            print={false}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                customStyles={customStyles}
                                                noHeader
                                                pagination
                                                highlightOnHover
                                                paginationRowsPerPageOptions={[10, 50, 100]}
                                                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="row">
                                <div className="col-md-9">
                                </div>
                                <div className="card-header" style={{ padding: "15px 35px 0" }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Active Signup Clients</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 pr-1">
                                        </div>
                                        <div className="col-md-3 d-flex flex-grow-1"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row d-flex justify-content-end">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTableExtensions
                                            data={getSignupClients && getSignupClients}
                                            columns={columns}
                                            export={false}
                                            print={false}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                customStyles={customStyles}
                                                noHeader
                                                pagination
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

export default SignupClients