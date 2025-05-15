import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigate, useNavigate, useLocation, useParams, NavLink } from 'react-router-dom';
import axios from "axios";
import { Form } from "react-bootstrap";
import * as Config from "../common/Config";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import { TextField } from '@mui/material';
import Table from 'react-bootstrap/Table';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { dateFormate } from "../common/CommonDateFormate";
import ExportToExcel from "../common/ExportToExport";

import "react-data-table-component-extensions/dist/index.css";


const SuperAdminHistory = () => {

    const [superadminHistory, setSuperadminHistory] = useState("")
    const [dayfilter, setDayfilter] = useState("");
    const [getfiltervalue, setfiltervalue] = useState("");
    const [getDateTime, setDateTime] = useState("");
    const [licAdd, setLicadd] = useState(false)
    const [monthFilter, setMonthFilter] = useState("");
    const dayRef = useRef("");
    const monthRef = useRef("");

    const user_id = localStorage.getItem("superadminId")


    var handleDelete = (row) =>  {
        var res = window.confirm("Do you want delete data")
        // console.log(res)
        if(res)  {
            // console.log(row)
            axios.get(`https://api.smartalgo.in:3001/superadminhistory/delete/${row.id}`).then(
                resp => console.log("resp.data")
            ).catch(
                err => console.log(err)
            )
            window.location.reload();
        }
        
    }
    const columns = [
        {
            name: 'S.No',
            selector: 'id',
            cell: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Super Admin </h6>,
            selector: (row) => row.superadmin_name,
            width: '140px !important',

        },
        {
            name: <h6>Panel Name</h6>,
            // selector: (row) => row.panal_name,
            // selector: (row) => row.panal_name,
            // selector: (row) => row.panal_name.split(".")[1],
            selector: (row) => row.panal_name,

            width: '240px !important',
        },
        {
            name: <h6>Client Id</h6>,
            selector: (row) => row.client_id,
            width: '75px !important',
        },
        {
            name: <h6>Create Date</h6>,
            selector: (row) => row.create_date.split("T")[0],
            width: '100px !important',
        },
        {
            name: <h6>Message</h6>,
            selector: (row) => row.msg,
            width: '500px !important',
            // maxWidth: '600px',
            sortable: true,
            wrap: true,
        },{
            name:<h6>Actions</h6>,
            // selector:()=> <button  onClick={()=> handleDelete()}>Delete</button>
            selector:(row) => user_id == 5 ? 
              <i
            className={  "fa-solid fa-trash  fs-5  hover "}
            data-toggle="tooltip"
            data-placement="top"
            title="Delete Client"
            onClick={() => handleDelete(row)}
           
        ></i> 
        :
        ""
            
        }
    ];

    var data = []
    const HistorySuperAdmin = () => {
        axios({
            method: "get",
            url: `${Config.base_url}superadmin/history`,
        }).then(function (response) {
            // console.log("response", response.data.data);

            response.data.data.map((val, i) => {
                data.push(val)
            })





            if (getfiltervalue == "" && licAdd == false && monthFilter == "") {
                setSuperadminHistory(data)
            }

            else if (licAdd == true && getfiltervalue != "" && monthFilter == "") {

                setSuperadminHistory(response.data.data.filter(obj => obj.msg.includes("License Add successful") && dateFormate(obj.create_date).split(" ")[0] == getfiltervalue))



            }

            else if (licAdd == false && getfiltervalue != "" && monthFilter == "") {

                setSuperadminHistory(response.data.data.filter(obj => dateFormate(obj.create_date).split(" ")[0] == getfiltervalue))


            }

            else if (licAdd == true && getfiltervalue == "" && monthFilter == "") {
                setSuperadminHistory(response.data.data.filter(obj => obj.msg.includes("License Add successful")))
            }
            else if (licAdd == false && getfiltervalue == "" && monthFilter != "") {
                var arr1 = response.data.data.filter(obj => dateFormate(obj.create_date).split("-")[0] + "-" + dateFormate(obj.create_date).split("-")[1] == monthFilter)
                setSuperadminHistory(arr1);
            }
            else if (licAdd == true && getfiltervalue == "" && monthFilter != "") {
                var arr1 = response.data.data.filter(obj => dateFormate(obj.create_date).split("-")[0] + "-" + dateFormate(obj.create_date).split("-")[1] == monthFilter && obj.msg.includes("License Add successful"))
                setSuperadminHistory(arr1);
            }

        })
    }




    // console.log(superadminHistory)

    const customStyles = {
        headCells: {
            style: {
                fontWeight: "700",
                backgroundColor: '#000',
                color: '#fff',
                justifyContent: 'left !important',
                textAlign: 'left'

            },
        },
        cells: {
            style: {
                overflow: 'visible !important',
                justifyContent: 'left !important',
                textAlign: 'left'
            },
        },
    };


    useEffect(() => {
        HistorySuperAdmin()
    }, [getfiltervalue, licAdd, monthFilter])

    // useEffect(() => {
    //     HistorySuperAdmin()
    // }, [licAdd])

// console.log("superadminHistory :=",superadminHistory && superadminHistory)

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6 ">
                                    <h3 className="card-title mx-3">SuperAdmin History</h3>
                                    <ExportToExcel
                                        className="export-btn btn-color ms-auto d-flex"
                                        apiData={superadminHistory}
                                        // fileName={fileName}
                                        style={{ backgroundColor: "#f96332" }}

                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                                        <div className="col-3">
                                            <div className="row d-flex align-items-center">

                                                <div className="col-md-6" >
                                                    <input
                                                        style={{ position: "absolute", top: "15px", right: "300px" }}
                                                        ref={dayRef}
                                                        type="date"
                                                
                                                        onChange={(data) => {
                                                            setfiltervalue(data.target.value)
                                                            setMonthFilter("")
                                                            monthRef.current.value = ""
                                                        }
                                                        }
                                                    />

                                                    <input
                                                        ref={monthRef}
                                                        type="month"
                                                        style={{ position: "absolute", top: "15px", right: "150px" }}
                                                       
                                                        onChange={(e) => {
                                                            setMonthFilter(e.target.value)
                                                            setfiltervalue("")
                                                            dayRef.current.value = ""
                                                        }

                                                        }

                                                    />


                                                    <Form.Check
                                                        type="switch"
                                                        onClick={() => setLicadd(!licAdd)}
                                                        style={{ position: "absolute", right: "100px", top: "15px" }}
                                                    >
                                                    </Form.Check>



                                                </div>

                                                <div className="col-md-4">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <DataTableExtensions
                                                columns={columns}
                                                data={superadminHistory}
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


export default SuperAdminHistory