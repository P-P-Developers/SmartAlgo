import React, { useEffect, useState } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import * as Config from '../common/Config';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';

const AdminHelpCenter = () => {

    const columns = [
        {
            name: "UserName",
            selector: (row) => row.client_username,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            width: '80px !important',
        },
        {
            name: "Mobile",
            selector: (row) => row.client_mobile,
        },
        {
            name: "Message",
            selector: (row) => row.help_message,
        },
    ];


    const [loader, setLoader] = useState(false);
    const [helpCenterData, setHelpCenterData] = useState()
    const [tableData, settableData] = useState({
        columns,
        helpCenterData
    });

    const adminId = localStorage.getItem("adminId");
    const admin_token = localStorage.getItem("token");
    const AdminID = localStorage.getItem("adminId");

    const data = []

    const helpData = () => {

        axios({
            url: `${Config.base_url}client/notifications`,
            method: "post",
            data: {
                adminId: adminId,
                admin_id: AdminID,
            },
            headers: {
                "x-access-token": admin_token,
            },
        }).then((res) => {
            if (res.data.notifications) {
                // console.log("help", res.data.notifications);
                res.data.notifications.map((notify, i) => {
                    data.push({
                        // sno: ++i,
                        client_username: notify.client_username,
                        email: notify.email,
                        client_mobile: notify.client_mobile,
                        help_message: notify.help_message,
                    })
                    setHelpCenterData(data)
                    // console.log("helpc", data);
                    settableData({
                        columns,
                        data
                    });
                });
            }
        });
    }

    useEffect(() => {
        helpData()
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
                                            <h4 className="card-title">Help Center</h4>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3 d-flex flex-grow-1"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row d-flex justify-content-end">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTableExtensions
                                            {...tableData}
                                            export={false}
                                            print={false}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                columns={columns}
                                                customStyles={customStyles}
                                                style={{ overflow: 'wrap' }}
                                                noHeader
                                                // pagination
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

export default AdminHelpCenter