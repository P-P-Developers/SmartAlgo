import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from '../common/Config';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';


function ReleaseUpdates() {

    const [loader, setLoader] = useState(false);
    const [helpCenterData, setHelpCenterData] = useState()
    const adminId = localStorage.getItem("adminId");
    const admin_token = localStorage.getItem("token");
    const AdminID = localStorage.getItem("adminId");
    // console.log("logadmin",AdminID );

    const Data = [
        {
            "id": 1,
            "Update": "ICICI Direct, Dhan, Upstox Broker Implemented.",
            "Release_Date": '14 / 10 / 2023',
        },
        // {
        //     "id": 2,
        //     "Update": "Client Fund on Client Dashboard.",
        //     "Release_Date": '25 / 08 / 2023'
        // },
        // {
        //     "id": 3,
        //     "Update": "Client will get OTP while singup process and admin will approve that client for demo account.",
        //     "Release_Date": '25 / 08 / 2023'
        // },
        // {
        //     "id": 4,
        //     "Update": "Group Sevices select services will show after typing service name.",
        //     "Release_Date": '25 / 08 / 2023'
        // },
    ]


    const columns = [
        {
            name: "S.No.",
            selector: (row) => row.id,
            // width: "120px",
        },
        {
            name: "Update",
            selector: (row) => row.Update,
            width: "400px",
            wrap: true,
        },
        {
            name: "Release Date",
            selector: (row) => row.Release_Date,
        },
    ];

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

    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="row">
                                <div className="col-md-9">
                                </div>
                                <div className="card-header" style={{ padding: "15px 35px 0" }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Release Updates</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTableExtensions
                                            columns={columns}
                                            data={Data}
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
export default ReleaseUpdates;



// New Updates On Algo Panel

// 1. SubAdmin permission for strategy, Group, Licence, Go To Dashboard,  Show Edit.
// 2. Trade Execution Reports to show which trades not Executed.
// 3. Trade Execution Option Change tab.
// 4. Filter for dashboard on Total 2 Day Service, Total Active 2 Day Service and Total Converted Accounts filter when admin click view button they can see this all clients.
// 5. Trading On/Off Filter on Clients.
// 6. Strategy Filter on Clients.
// 7. Expiry date of licence show when admin give licence to client.
// 8. Trade History From Date and End Date show on admin panel.
// 9. Trade History show on client when admin go to client panel with Go To Dashboard.
// 10. Watermark on TradeHistory for AdroitAlgo and AlgoBuzz.
// 11. TradeMark on footer on all panles.