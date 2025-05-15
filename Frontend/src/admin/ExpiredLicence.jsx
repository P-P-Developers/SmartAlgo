import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import { dateFormate } from "../common/CommonDateFormate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const ExpiredLicence = () => {
    const admin_token = localStorage.getItem("token");


    const [tableData, SetTableData] = useState([]);
    const [countLicence, setCountLicence] = useState({});
    const [loader, setloader] = useState(false);



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

    const getExpiredLicenceData = () => {
        setloader(true);


        axios({
            method: "get",
            url: `${Config.base_url}admin/expired_client`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then(function (response) {
            setloader(false);
            SetTableData(response.data.data)

            // console.log("sdsdsds", response.data.data);

        })
    }

    useEffect(() => {

        getExpiredLicenceData()
    }, [])



    const columns = [
        {
            name: "No",
            selector: (row, index) => index+1 ,
            // onClick={e => { getRowNumbers(e, row) }}
        },
        {
            name: "Full Name",
            selector: (row) => row.full_name,
        },
        {
            name: "Live/Demo",
            selector: (row) => row.licence_type == 1 ? "Demo" : "Live",
            fontWeight: "800 !important",
            color: 'red !important',
        },
        {
            name: "start_date",
            // selector: (row) => row.start_date.split("T")[0],
            selector: (row) =>  dateFormate(row.start_date).split(" ")[0],
        },
        {
            name: "end_date",
            selector: (row) => dateFormate(row.end_date).split(" ")[0],
        },
    ]







    return (
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
                                    <h4 className="card-title">Expired Soon Licence</h4>
                                </div>
                            </div>
                        </div>
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

    )
}

export default ExpiredLicence