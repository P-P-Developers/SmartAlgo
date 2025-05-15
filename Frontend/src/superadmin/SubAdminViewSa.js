import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate, useLocation, useParams,NavLink } from 'react-router-dom';
import axios from "axios";
import { Form } from "react-bootstrap";

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const SubAdminViewSa = () => {

    const [adminClientsNames, setadminClientsNames] = useState([])

    const columns = [
        {
            name: <h6>S.No</h6>,
            // selector: (row) => row.sno,
            cell: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Name</h6>,
            selector: (row) => row.name,
            width: '180px !important',
        },
        {
            name: <h6>Mobile</h6>,
            selector: (row) => row.mobile,
            width: '180px !important',
        },
        {
            name: <h6>Email</h6>,
            selector: (row) => row.email,
            width: '270px !important',
        },
       
    
    ];


    const location = useLocation();
    const subAdminData = location.state
    console.log("adminClientData", subAdminData);

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
                                    <h3 className="card-title mx-3">Admin Client List</h3>
                                </div>
                                <div className="col-md-6">
                                    <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                                        <NavLink
                                            to="/superadmin/adminlist"
                                            className="btn btn-color"
                                        >
                                            Back
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                        
                                            <DataTableExtensions
                                                columns={columns}
                                                data={subAdminData}
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
            </div>
        </div>
    )
}

export default SubAdminViewSa