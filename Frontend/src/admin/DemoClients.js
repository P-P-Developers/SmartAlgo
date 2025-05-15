import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Radio from '@mui/material/Radio';
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { Form } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import download from 'js-file-download';
import { dateFormate } from "../common/CommonDateFormate";
// import { log } from "console";


const DemoClients = () => {


    const [tableData, settableData] = useState([]);
    // console.log("tableData", tableData && tableData);

    const [params] = new useSearchParams(window.location.search);
    // console.log("parms",params.get("client_id"))
    const admin_token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");



    var data = [];
    useEffect(() => {
        axios.get(`${Config.base_url}admin/client`, {
            headers: {
                'x-access-token': admin_token
            }, data: {}
        }).then((res) => {
            settableData(res.data.client)
            // console.log("res" , res.data.client);
            // var datatable = []
            // datatable.push(res.data.client)

            // datatable.map((print)=>{
            //     var name = print.full_name
            // console.log("name", print[0].full_name);

            // })

        });

    }, []);

    // var dataTable =  tableData && tableData.map((print) => {

    //     console.log("datavar", print);
    //     // var datassss = print.full_name
    // })

    return (
        <div>
            {
                tableData && tableData.map((x) => <>
                    <table>

                        <tr>
                            <th>Firstname</th>
                            <th>Username</th>
                            <th>Mobile</th>
                            <th>Email</th>
                        </tr>
                        <tr>
                            <td>{x.full_name}</td>
                            <td>{x.username}</td>
                            <td>{x.mobile}</td>
                            <td>{x.email}</td>
                        </tr>

                    </table>
                    {/* <p>{x.full_name}</p>
                    <p>{x.username}</p>
                    <p>{x.mobile}</p>
                    <p>{x.email}</p> */}
                </>
                )
            }


        </div>
    )
}

export default DemoClients