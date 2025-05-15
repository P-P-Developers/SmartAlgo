import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ColumnAddQuery = () => {

    const [sendQuery, setSendQuery] = useState("")
    const [closingPositionData, setClosingPositionData] = useState([])

    const [selectUpdated, setSelectUpdated] = useState(0)
    const [selectRowForUpdated, setSelectRowForUpdated] = useState([])



    const admin_token = localStorage.getItem("token");


    const sendingQuery = () => {

        if (sendQuery == "") {
            alert("Please Write Query")
            return
        }

        axios({
            method: "post",
            url: `${Config.base_url}superadmin/codeupdate`,
            data: {
                queryD: sendQuery
            },
        }).then(function (response) {
            // console.log("respp", response.data.client);
            // if (response.data.client == "true") {
            alert("Updated successfully")
            // }
        });
    }

    //

    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Panel Name</h6>,
            selector: (row) => row.url,
            // width: '110px !important',
        },

    ];

    const customStyles = {

        headCells: {
            style: {
                fontWeight: '700',
                // margin:' 19px 0px',
                backgroundColor: '#000',
                color: '#fff',
                justifyContent: 'center !important',
                overflow: 'hidden !important',

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

    const AllAdminsName = () => {

        var config = {
            method: 'get',
            url: `${Config.base_url}superadmin/all/panel`,
            headers: {}
        };
        axios(config).then(function (response) {
            console.log("closingposition", response.data.admins);
            // setClosingPositionData(response.data.admins)


            let filterData = response.data.data.filter((item) => {
                if (selectUpdated !== 3) {
                    return parseInt(item.update_select) === parseInt(selectUpdated)
                }
            })

            console.log("filter", filterData);
            if (selectUpdated !== 3) {
                setClosingPositionData(filterData)
            } else {
                setClosingPositionData(response.data.data)
            }


        })
            .catch(function (error) {
                console.log(error);
            });
    }


    useEffect(() => {
        AllAdminsName()
    }, [selectUpdated])


    const handleChange = (state) => {

        console.log("state" ,state);

        //  setSelectRowForUpdated(state)
    }


    // const selectedPanelsName = (data) => {

    //     console.log("state.selectedRows", data);

    //     //    setSelectRowForUpdated(state.selectedRows)

    // }



    const rowSelectCritera = row => row.update_select === 1


    // const selectedPanelsName1111 = () => {

    //     const selectedPanelsName = (data) => {

    //         var config = {
    //             method: 'post',
    //             url: `${Config.base_url}/updatestatus/codeupdate`,
    //             headers: {},
    //             data: data
    //         };
    //         axios(config).then(function (response) {
    //             console.log("closingposition", response);
    //         })



    //     }
        // console.log((test))


    // }



    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Add Column By Query</h4>
                            </div>
                            <div className="row d-flex justify-content-end mx-auto">
                                <div className="card-body mx-auto">
                                    <div className="table-responsive mx-auto">

                                        <div className="row d-flex align-items-center justify-content-around ">
                                            <div className="col-5 ">
                                                <form>
                                                    <div class="form-group">
                                                        <label for="exampleFormControlTextarea1">Write Query Here</label>
                                                        <textarea class="form-control" rows="50" onChange={(e) => setSendQuery(e.target.value)}></textarea>
                                                    </div>
                                                    <button className="btn btn-success" onClick={sendingQuery}>Update</button>
                                                </form>
                                            </div>
                                            <div className="col-6 ">
                                                <div className="d-flex">
                                                    <select className='form-select w-50 my-3' onChange={(e) => setSelectUpdated(e.target.value)}>
                                                        <option value={3} disabled >All</option>
                                                        <option value={1}>Update Already</option>
                                                        <option value={0} selected>Not Updated</option>
                                                    </select>
                                         {/* //           <button className="btn btn-success" onClick={() => selectedPanelsName1111()}>Update</button> */}
                                                </div>

                                                <div className="table-responsive">
                                                    <DataTable
                                                        columns={columns}
                                                        data={closingPositionData}
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="700px"
                                                        noHeader
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        // pagination
                                                        selectableRows
                                                        onSelectedRowsChange={handleChange}
                                                        selectableRowSelected={rowSelectCritera}
                                                        customStyles={customStyles}
                                                        highlightOnHover
                                                    // paginationRowsPerPageOptions={[10, 50, 100]}
                                                    // paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>






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

export default ColumnAddQuery
