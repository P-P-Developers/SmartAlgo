import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate, useLocation, useParams, NavLink, Link } from 'react-router-dom';
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
import "react-data-table-component-extensions/dist/index.css";
import dateTime from 'node-datetime'

const check = (a) => {
    alert(a)
}

const AdminClientView = () => {

    const [adminClientsNames, setadminClientsNames] = useState([])
    const [getAdminClientView, setAdminClientView] = useState([])
    const [storeStatus, setStoreStatus] = useState("");
    const [createdDateClient, setCreatedDateClient] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [showClientLicence, setShowClientLicence] = useState("")
    const [showRemainnglicense, serRemainnglicense] = useState("")
    const [showRemainnglicense11, serRemainnglicense11] = useState([])
    const [getUpdateData, setUpdateData] = useState(1)
    // console.log("getUpdateData-", getUpdateData);
    const [RowId, setRowId] = useState("")


    const [RemaiLicence, setRemaiLicence] = useState("")

    // console.log("showRemainnglicense", showRemainnglicense);
    const [startDateClient, setStartDateClient] = useState("")
    const [refresh, setrefresh] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    // const panelName = location.state
    // console.log("location", location.state);
    var panelKey = localStorage.getItem("PanelKey")
    var Panel_name = localStorage.getItem("Panel_name")
    var Superadmin_name = localStorage.getItem("Superadmin_name")

    const locationname = window.location.host
    console.log("location url", location.state);

    var allPanelConfig
    if (location.state.singal_build == '0') {
        allPanelConfig = `https://${location.state.name}:${location.state.port}/`
    } else {
        allPanelConfig = `https://${location.state.name}/backend/`
    }

    console.log("allPanelConfig", allPanelConfig);


    const deleteClient = (id, username) => {

        let value = prompt('Please Enter Your User Name "' + username + '"',);
        if (value == username) {
            let value1 = prompt('Please Enter Your Password',);
            if (value1 == '654321') {

                axios({
                    method: "post",
                    url: `${allPanelConfig}superadmin/client/delete`,
                    data: {
                        id: id,
                        panelKey: panelKey,
                        Superadmin_name: Superadmin_name
                    },
                    headers: {
                        //   'x-access-token': admin_token
                    }
                }).then(function (response) {
                    if (response) {
                        setrefresh(!refresh);
                    }
                })
                // alert("True")
            } else {
                alert("False")
            }
        } else {
            alert("False")
        }
    }

    const deleteClientDate = (startDate) => {
        var startDate = new Date(startDate);
        // console.log("Superadmin_name", Superadmin_name);

        if (Superadmin_name == "Developer") {
            return "Running"
        } else {

            var today = new Date();
            startDate.setDate(startDate.getDate() + 7); //number of days to add, e.x. 15 days
            var StartdateFormated = dateTime.create(startDate).format('Y-m-d')
            var TodaydateFormated = dateTime.create(today).format('Y-m-d')
            if (StartdateFormated < TodaydateFormated) {
                return "Expired"
            } else {
                return "Running"
            }
        }

    }

    const columns = [
        {
            name: 'S.No',
            selector: 'id',
            cell: (row, index) => index + 1,
            width: '130px !important',
        },
        {
            name: <h6>Username</h6>,
            selector: (row) => row.username,
            width: '150px !important',
        },
        {
            name: <h6>Mobile</h6>,
            selector: (row) => row.mobile,
            width: '110px !important',
        },
        {
            name: <h6>Email</h6>,
            selector: (row) => row.email,
            width: '270px !important',
        },
        {
            name: <h6>Status</h6>,
            selector: (row) => (row.licence_type == 1 ? "Demo" : "Live"),
            width: '75px !important',
        },
        {
            name: <h6>Broker Status</h6>,
            width: '60px !important',
            cell: (row) => (
                <>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        defaultChecked={row.not_change_broker == 1 ? true : false}
                        //   onClick={e => { check(row.not_change_broker) }}
                        onClick={e => { notChangeBroker(e, row) }}
                    />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        // {
        //     name: <h6>Client Dashboard</h6>,
        //     width: '160px !important',
        //     selector: (row) => (
        //         <>
        //             <button
        //                 className="btn btn-new-block"
        //                 style={{ backgroundColor: "#008000" }}
        //                 onClick={() => goToDashboard(row.id, row.client_id)}
        //             >
        //                 Go To Dashboard
        //             </button>
        //         </>
        //     ),
        // },
        {
            name: <h6>Actions</h6>,
            width: '100px !important',
            cell: (row) => (
                <>
                    <Tooltip title="View Details">
                        <Icon icon="clarity:grid-view-line"
                            onClick={() => handleShowForMonthLicence(row.id)}
                            data-target="#exampleModal1"
                            color="#E43F47"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="modal"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>
                    <Link
                        to={`/superadmin/editfromsuperclient/${row.id}`}
                        state={[{ url: allPanelConfig }]}
                    >
                        <i
                            className="fa-solid fa-pen-to-square pe-3 fs-5 edit_hover"
                            variant="primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Edit Client"
                        ></i>
                    </Link>

                    {deleteClientDate(row.created_at) == 'Running' && row.licence_type == 2 ?
                        <i
                            className={row.licencetype === "Live" ? 'fa-solid fa-trash fs-5 hover d-none' : "fa-solid fa-trash  fs-5  hover "}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete Client"
                            onClick={() => deleteClient(row.id, row.username)}
                        ></i> : ""}
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const goToDashboard = (id, client_id) => {

        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/client/LoginStatusGet`,
            data: { client_id },
        }).then(function (response) {
            if (response) {
                // console.log("login", response);
                console.log("resp", response.data.login_status)
                setStoreStatus(response.data.login_status)
                var loginStatus = response.data.login_status
                axios({
                    method: "get",
                    url: `${Config.base_url}admin/client-dashboard/${client_id}`,
                    headers: {
                        //   'x-access-token': admin_token
                    }
                }).then(function (response) {
                    console.log("test", response);

                    if (response.data.success === "true") {
                        navigate("/", { state: response.data.msg })
                    }
                })
            }
        });

    }

    useEffect(() => {
        ClintListData(panelKey)

    }, [refresh])

    const handleShowForMonthLicence = (clientId) => {
        setRowId(clientId)
        setShow(true)
        axios({
            method: "post",
            url: `${allPanelConfig}superadmin/client/license-view`,
            data: {
                panelKey: panelKey,
                clientId: clientId
            },
            headers: {
                //   'x-access-token': admin_token
            }
        }).then(function (response) {
            // console.log("clientlicence", response.data.licenseView);
            setShowClientLicence(response.data.licenseView)
            var todayDate1 = dateTime.create(response.data.licenseView.Start_Date).format('Y-m-d')
            var stateRemaingLicense = []
            var arrLicense = []
            var sumWithInitial = ""

            for (var i = 1; i <= response.data.licenseView.Total_License; i++) {
                arrLicense.push(1)
            }

            var past_date = new Date(todayDate1);
            var current_date = new Date();

            var difference = (current_date.getDate() - past_date.getDate()) / 30 +
                current_date.getMonth() - past_date.getMonth() +
                (12 * (current_date.getFullYear() - past_date.getFullYear()));

            difference = Math.ceil(difference)

            // console.log("difference",difference);
            // console.log("arrLicense",arrLicense);

            for (var i = difference; i < arrLicense.length; i++) {
                // console.log("Reamaing licence",i,":", arrLicense[i]);
                stateRemaingLicense.push(arrLicense[i])
                // console.log("stateRemaingLicense",stateRemaingLicense);
                const initialValue = 0;
                sumWithInitial = stateRemaingLicense.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );
            }
            // console.log("sumWithInitial", sumWithInitial);

            var Aarry_Num = []
            for (i = 1; i <= sumWithInitial; i++) {
                // console.log("i", i);
                Aarry_Num.push(i)
            }

            serRemainnglicense11(Aarry_Num)
            serRemainnglicense(sumWithInitial)
        })
    };

    const handleShowShowConfirmBox = () => {
        setShowConfirmBox(true)
    }

    const handleCloseShowConfirmBox = () => {
        setShowConfirmBox(false)
    }

    const ClintListData = (panelKey) => {
        axios({
            method: "get",
            url: `${allPanelConfig.includes("undefined") ? location.state : allPanelConfig}superadmin/client`,
        }).then(function (response) {
            // console.log("respp", response.data.client);
            setAdminClientView(response.data.client)
            setCreatedDateClient(response.data.client[0].created_at.split("T")[0])
        })
    }


    const notChangeBroker = (e, row) => {

        window.confirm("Are you sure you want to change broker");
        var history_data = '"' + Superadmin_name + '","' + panelKey + '",' + row.id + ',"Permission Change Broker On Status :' + e.target.checked === true ? "ON" : "OFF" + '"'

        axios({
            method: "post",
            url: `https://api.smartalgo.in:3001/superadmin/history-Create`,
            data: history_data,
        }).then(function (response) {
        })


        axios({
            method: "post",
            url: `${allPanelConfig}superadmin/brokerStatus/changestatus`,
            data: {
                //   'adminId': adminId,
                id: row.id,
                not_change_broker: e.target.checked === true ? "1" : "0",
                panal: panelKey,
                Superadmin_name: Superadmin_name
            },
            headers: {
                //   'x-access-token': admin_token
            }

        }).then(function (response) {
            alert("Do you want to change status")
        })

    }

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

    const removeLicence = (value) => {

        if (showClientLicence && showRemainnglicense === "") {

            alert(" Licence Is Already  0")
            //   return
        }
        else if (parseInt(value) >= parseInt(showClientLicence && showRemainnglicense)) {
            alert("you have To Give At Least One Licence")
            //   return
        } else if (parseInt(value) > parseInt(showClientLicence && showRemainnglicense)) {
            alert("you have Not enugh Licence To Remove")
            // return
        } else {

            console.log("value", value);
        }
    }

    const UpdateLicence = (value) => {
        if (showClientLicence && showRemainnglicense === "") {
            alert(" Licence Is Already  0")
            //   return
        }
        else if (parseInt(RemaiLicence) >= parseInt(showClientLicence && showRemainnglicense)) {
            alert("you have To Give At Least One Licence")
            //   return
        } else if (parseInt(RemaiLicence) > parseInt(showClientLicence && showRemainnglicense)) {
            alert("you have Not enugh Licence To Remove")
            // return
        }

        // console.log("value", RowId);
        // console.log("getUpdateData",getUpdateData);

        axios({
            method: "post",
            url: `${allPanelConfig}superadmin/remove_licence`,
            data: {
                id: RowId,
                getUpdateData: getUpdateData,
                panelKey: panelKey,
                Panel_name: Panel_name.split(".")[1],
                Superadmin_name: Superadmin_name

            },
            headers: {
                //   'x-access-token': admin_token
            }
        }).then(function (response) {
            // console.log("response",response.data);
            if (response.data.status == false) {
                alert(response.data.data)
            } else {
                window.location.reload()
                // setrefresh(!refresh);
            }
        })


    }

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6 ">
                                    <h3 className="card-title mx-3">Admin Client List <h5>{Panel_name.split(".")[1]}</h5></h3>
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
                                                data={getAdminClientView}
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
                                <Modal show={showConfirmBox} onhide={handleCloseShowConfirmBox}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirm Box</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Please Enter This UserName
                                        <br />
                                        <br />
                                        <TextField
                                            id="outlined-required"
                                            label="User Name"
                                            defaultValue=""
                                        />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="primary" onClick={handleCloseShowConfirmBox}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <Modal show={show} onHide={handleClose} animation={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Licence View</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Table striped bordered hover>
                                        <tbody>
                                            <tr>
                                                <td>Create Date </td>
                                                <td>{dateFormate(showClientLicence.created_at)}</td>
                                            </tr>
                                            <tr>
                                                <td>Start Date </td>
                                                <td>{dateFormate(showClientLicence.Start_Date)}</td>
                                            </tr>
                                            <tr>
                                                <td>End Date</td>
                                                <td>{dateFormate(showClientLicence.End_Date)}</td>
                                            </tr>
                                            <tr>
                                                <td>To Month</td>
                                                <td>{showClientLicence.To_Month}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Licence</td>
                                                <td>{showClientLicence.Total_License == null ? "0" : showClientLicence.Total_License}</td>
                                            </tr>

                                            <tr>
                                                <td>Remaining Licence</td>
                                                <td>
                                                    0
                                                    {showRemainnglicense && showRemainnglicense}
                                                    {/* {showRemainnglicense && showRemainnglicense.length -1} */}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Minus Licence</td>
                                                <td>
                                                    <select defaultValue={1} onChange={(e) => {
                                                        setUpdateData(e.target.value)

                                                    }}>
                                                        {showRemainnglicense11.map((val) => {
                                                            return <option value={val}>{val}</option>
                                                        })}
                                                    </select>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={handleClose}>
                                        Close
                                    </Button>
                                    {showClientLicence.Total_License != 1 || 0 ? <Button variant="success" onClick={(e) => UpdateLicence(e.target.value)}>
                                        Update
                                    </Button> : ""}

                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminClientView
