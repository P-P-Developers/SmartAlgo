import React, { useEffect, useState, useCallback } from "react";
import "./admin.css"
import { useParams, useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Form } from "react-bootstrap";
import { TextField } from '@mui/material';
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import { dateFormate } from "../common/CommonDateFormate";



// const superadmin_token = localStorage.getItem("superadmin_token");
const Superadmin_name = localStorage.getItem("Superadmin_name");

const AdminList = () => {

    var sum = 0;

    const [minDate, setMinDate] = useState("")
    const [tableData, SetTableData] = useState([]);
    const [countLicence, setCountLicence] = useState({});
    const [filterDataLicence, setFilterDataLicence] = useState("")
    const [filterMonthLicence, setFilterMonthLicence] = useState();

    const [addTableData, setAddTableData] = useState([]);
    const [refreshscreen, setRefreshscreen] = useState(true);
    const [getViewPanal, setViewPanal] = useState([]);
    const [getViewPanal1, setViewPanal1] = useState([]);

    const [getMonthDataLicense, setMonthDataLicense] = useState([]);
    const [addLicence, setAddLicence] = useState("")
    const [getModalId, setGetModalKey] = useState("");
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [panelModalName, setPanelModalName] = useState("")
    const [panelStatus, setpanelStatus] = useState("1")
    const [match, setMatch] = useState(null);

    const [refresh, setrefresh] = useState(true);
    const handleCloseCross = () => setShow(false);
    const handleCloseCross1 = () => setShow1(false);

    const user_id = localStorage.getItem("superadminId")

    const [lic_sum, setLicsum] = useState(null);

    const fileName = "Monthly-billing";
    const { paramsId } = useParams()
    const navigate = useNavigate()
    var locationhostName = window.location.href.split("#")[0]

    const locationname = window.location

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);

    const handleClose = () => setShow(false);
    const handleClose1 = () => {
        setShow1(false)
        setMatch(null)
    };


    const [showMonthList, setShowMonthList] = useState(false);
    const handleCloseMonthList = () => setShowMonthList(false);
    const [name, setName] = useState("");





    // For Pending Amount

    const [totalPending, setTotalPending] = useState("")
    const [currentPending, setCurrentPending] = useState("")
    const [totalReceived, setReceived] = useState("")

    // Admin Information

    const [showAdminInformation, setShowAdminInformation] = useState(false);
    const [startDate, setStartDate] = useState([]);
    const [panelId, setPanelId] = useState([])
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleCloseAdminInformation = () => setShowAdminInformation(false);
    const handleShowAdminInformation = (data) => {
        const modifiedKey = data.key.slice(3);
        const formattedKey = `${modifiedKey.slice(0, 2)}-${modifiedKey.slice(2, 4)}-${modifiedKey.slice(4)}`;
        setStartDate({ data, key: formattedKey });





        let adminData = JSON.stringify({
            "panel_id": data.id
        });

        let config = {
            method: 'post',
            url: 'https://api.smartalgo.in:3001/superadmin/panle/information',
            headers: {
                'Content-Type': 'application/json'
            },
            data: adminData
        };

        axios.request(config)
            .then((response) => {
                setPanelId(response.data.data[0])
                setShowAdminInformation(true)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // UPDATE Admin Information

    const updateData = (event) => {
        event.preventDefault();

        axios.post('https://api.smartalgo.in:3001/superadmin/update/panle/information', panelId)
            .then(resp => {
                // console.log("RESP",resp.data);
            })
            .catch(err => console.log(err));
    }

    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, i) => i + 1,
            width: '60px !important'
        },
        {
            name: <h6>DOMAIN</h6>,
            selector: (row) => (
                <div onClick={() => adminDashboard(row.url)}>
                    {row.url}
                </div>
            ),
            width: '200px !important'
        },
        {
            name: <h6>Data Base</h6>,
            selector: (row) => (
                <div onClick={() => data_base(row.ip_address)}>
                    {row.ip_address + "/db"}
                </div>
            ),
            width: '230px !important'
        },
        {
            name: <h6>PORT</h6>,
            selector: (row) => row.port,
            width: '70px !important'
        },
        {
            name: <h6>CLIENT KEY</h6>,
            selector: (row) => row.key,
            width: '130px !important'
        },


        {
            name: <h6>Close Panel</h6>,
            width: '100px !important',
            cell: (row) => (
                <>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        defaultChecked={row.panel_on == 1 ? true : false}
                        onClick={(e) => PanelClose(e, row.url)}
                    />
                </>
            ),
        },

        // {
        //     name: <h6>Close Panel</h6>,
        //     width: '100px !important',
        //     cell: (row) => (
        //         <>
        //             <Form.Check
        //                 type="switch"
        //                 id="custom-switch"
        //                 defaultChecked={row.panel_on == 1 ? true : false}
        //                 onClick={(e) => PanelClose(e, row.url)}
        //             />
        //         </>
        //     ),
        // },
        {
            name: <h6>Details</h6>,
            width: '440px !important',
            selector: (row) => (
                <>


                    <Tooltip title="Licence Details">
                        <Icon icon="clarity:grid-view-line"
                            onClick={() => handleShowForMonthLicence(row.key, row.url, row.port, row.singal_build)}
                            color="#E43F47"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="modal"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>

                    <Tooltip title="Admin Information">
                        <Icon icon="mdi:information-outline"
                            onClick={() => { handleShowAdminInformation(row); { updateData(row) } }}
                            color="#b5c306"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="modal"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>

                    <Tooltip title="Clients">
                        <Icon icon="mdi:account-group-outline"
                            onClick={() => getAdminClients(row.key, row.url, row.port, row.singal_build)}
                            color="#A8006D"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>

                    <Tooltip title="Sub Admins">
                        <Icon icon="mdi:account-tie-outline"
                            onClick={() => getSubAdminClients(row.key)}
                            color="#FF822F"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>

                    <Tooltip title="Add Licence">
                        <Icon icon="ic:outline-money"
                            onClick={() => handleShowShowConfirmBox(row.key, row.url, row.port, row.singal_build)}
                            color="#40E0D0"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>

                    <Link
                        to={`/superadmin/supersignalsedit/${row.key}`}
                        state={[{ url: row.url }, { port: row.port }, { singal_build: row.singal_build }]}
                    >
                        <Tooltip title="Signals">
                            <Icon icon="material-symbols:signal-cellular-alt-rounded"
                                // onClick={() => handleShowForMonthLicence(row.id)}
                                color="#7cfc00"
                                className='mx-2'
                                width="22"
                                variant="primary"
                                data-toggle="modal"
                                data-placement="top"
                                cursor="pointer"
                            />
                        </Tooltip>
                    </Link>

                    <NavLink
                        to={`/superadmin/logs`}
                    >
                        <Tooltip title="Logs">
                            <Icon icon="icon-park-outline:log"
                                onClick={() => logsFile(row)}
                                color="#E43F47"
                                className='mx-2'
                                width="22"
                                variant="primary"
                                data-toggle="modal"
                                data-placement="top"
                                cursor="pointer"
                            />
                        </Tooltip>
                    </NavLink>

                    <NavLink
                        to={`/superadmin/helpcentre`}
                        state={[{ url: row.url }, { port: row.port }, { singal_build: row.singal_build }]}
                    >
                        <Tooltip title="Help centre">
                            <Icon icon="mdi:chat-help-outline"
                                // onClick={() => logsFile(row)}
                                color="#FFD12A"
                                className='mx-2'
                                width="22"
                                variant="dark"
                                data-toggle="modal"
                                data-placement="top"
                                cursor="pointer"
                            />
                        </Tooltip>


                        <Tooltip title="Admin Information">
                            <Icon icon="mdi:information-outline"
                                onClick={() => { handleShowAdminInformation(row); { updateData(row) } }}
                                color="#b5c306"
                                className='mx-2'
                                width="22"
                                variant="primary"
                                data-toggle="modal"
                                data-placement="top"
                                cursor="pointer"
                            />
                        </Tooltip>


                    </NavLink>

                    <Tooltip title="Licence List">
                        <Icon icon="clarity:grid-view-line"
                            onClick={() => handleShowForMonthLicence1(row.key, row.url, row.port, row.singal_build, row.id)}
                            color="#E43F47"
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="modal"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>
                </>
            ),
        },
    ];


    // console.log(getViewPanal1, "line no 399")

    const adminDashboard = (url) => {
        window.open(`https://${url}/#/admin/login`, '_blank');

        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTYsImlhdCI6MTcwNTA1MDA1NywiZXhwIjoxNzA1MTM2NDU3fQ.Q1WiH5ZYw-1jEKdGXYKdjJ65aTxZFe0RqZInMfxJErM")
        localStorage.setItem("adminId", 96)
        localStorage.setItem("roleId", 1)
        localStorage.setItem("createdBy", 0)

    }



    const data_base = (url) => {
        const newUrl = `${url}/db`;
        window.location.href = newUrl;
    }




    const handleShowShowConfirmBox = (panelkey, url, port, singal_build) => {
        setShowConfirmBox(true)
        setGetModalKey(panelkey)


        if (singal_build == '0') {
            setPanelModalName(`https://${url}:${port}/`)
        } else {
            setPanelModalName(`https://${url}/backend/`)

        }
    }



    const handleCloseShowConfirmBox = () => {


        axios({
            method: "post",
            url: `${panelModalName}superadmin/panal/licenseAdd`,
            data: {
                panelKey: getModalId,
                licence: addLicence,
                Superadmin_name: Superadmin_name
            },
            headers: {
                //   'x-access-token': admin_token
            }

        }).then(function (response) {
            console.log("response", response.data)
            if(response.data){
                
                axios({
                    method: "post",
                    url: `https://api.smartalgo.in:3001/superadmin/history-Create`,
                    data: { data: '"' + Superadmin_name + '","' + getModalId + '",0," ' + addLicence + ' License Add successful"' },
        
                }).then(function (response) {})
        
            }
        })
        setShowConfirmBox(false)
    }

    const handleCloseCrossButton = () => {
        setrefresh(!refresh);
        setShowConfirmBox(false)
        setrefresh(!refresh);
    }

    const columns1 = [
        {
            name: 'S.No',
            selector: row => row.id,
            width: '60px !important'
        },
        {
            name: 'Company Name',
            selector: row => row.Company_Name,
            width: '180px !important'
        },
        {
            name: 'Total License',
            selector: row => row.total_license,
            width: '110px !important'
        },
        {
            name: 'Total Used License',
            selector: row => row.total_used_license,
            width: '110px !important'
        },
        {
            name: 'Previous Month',
            selector: row => row.previous_month,
            width: '140px !important'
        },
        {
            name: 'Current Month',
            selector: row => row.current_month,
            width: '140px !important'
        },
    ];

    const panelOnOff = (e, key, id) => {
        axios({
            method: "post",
            url: `${Config.base_url}superadmin/panelstatus`,
            data: {
                id: id,
                key: key,
                panel_status: e.target.checked === true ? 1 : 0,
                Superadmin_name: Superadmin_name
            },
        }).then(function (response) {
            if (response) {
                setRefreshscreen(!refreshscreen);
            }
        })
    }
    const Panelon = (e, key) => {
        axios({
            method: "post",
            url: `${Config.base_url}superadmin/panelclose`,
            data: {
                key: key,
                close_panel: e.target.checked === true ? 1 : 0,
                Superadmin_name: Superadmin_name
            },
        }).then(function (response) {
            if (response) {
                setRefreshscreen(!refreshscreen);
            }
        })
    }

    const PanelClose = (e, key) => {
        axios({
            method: "post",
            url: `${Config.base_url}superadmin/panelclose`,
            data: {
                key: key,
                close_panel: e.target.checked === true ? 1 : 0,
                Superadmin_name: Superadmin_name
            },
        }).then(function (response) {
            if (response) {
                setRefreshscreen(!refreshscreen);
            }
        })
    }

    const handleShowForMonthLicence = (key, url, port, singal_build) => {

        setShow(true)
        var panelUrl
        if (singal_build == 0) {
            panelUrl = `https://${url}:${port}/`
        } else {
            panelUrl = `https://${url}/backend/`
        }
        axios({
            method: "get",
            url: `${panelUrl}superadmin/panelinfo`,
        }).then(function (response) {
            const response1 = []
            response1.push(response.data.msg)
            var data1 = []
            response1.map((add, i) => {
                data1.push({
                    id: i + 1,
                    total_license: add.total_license,
                    used_license: add.used_license,
                    reamining_licence: add.total_license - add.used_license,
                    total_live_account: add.total_live_account,
                    active_live_account: add.active_live_account,
                    expired_live_account: add.expired_live_account,
                    total_demo_account: add.total_demo_account,
                    active_demo_account: add.active_demo_account,
                    expired_demo_account: add.expired_demo_account,
                })
            })



            setViewPanal(data1[0])
        }
        )
    };

    const handleShowForMonthLicence1 = (key, url, port, singal_build, id) => {


        setName(id)

        setShow1(true)
        var panelUrl
        if (singal_build == 0) {
            panelUrl = `https://${url}:${port}/`
        } else {
            panelUrl = `https://${url}/backend/`
        }
        if (panelUrl == "https://test.smartalgo.in:3001/") {
            panelUrl = "https://api.smartalgo.in:3001/"
        }

        axios({
            method: "get",
            url: `${panelUrl}superadmin/license/list`,
        }).then(function (response) {
            if (response.data.client) {
                setViewPanal1(response.data.client)
            } else {
                setViewPanal1(response.data.client)

            }

        }
        )


    };


    const getAdminClients = (key, panelName, port, singal_build) => {
        var obj = {
            key2: key,
            name: panelName,
            port: port,
            singal_build: singal_build
        }
        localStorage.setItem("PanelKey", key)
        localStorage.setItem("Panel_name", panelName)

        navigate("/superadmin/adminclientview", { state: obj })
    }

    const getSubAdminClients = (key) => {
        axios({
            method: "get",
            url: `${Config.base_url}superadmin/all_subadmin/${key}`,
        }).then(function (response) {
            navigate("/superadmin/SubAdminViewSa", { state: response.data.subadmins })
        })
    }

    var data = []
    var panalList = []
    useEffect(() => {
        axios.get(`${Config.base_url}superadmin/admins`, {
        }).then((res) => {
            {
                res.data.admins.map((add, i) => {
                    data.push({
                        id: i + 1,
                        key: add.key,
                        url: add.url,
                        port: add.port,
                        first_three: add.first_three,
                        panel_on: add.panel_on,
                        ip_address: add.ip_address

                    })
                })


                let filterData = res.data.admins.filter((item) => {
                    if (panelStatus === "2" && item.panel_on == 1) {
                        return item.ip_address != "180.149.241.18"
                    } if (panelStatus === "3" && item.panel_on == 1) {
                        return item.ip_address === "180.149.241.18"
                    } else {
                        return item.panel_on === parseInt(panelStatus)
                    }
                })
                if (panelStatus == "null") {
                    setAddTableData(data)
                } else {
                    setAddTableData(filterData)
                }

            }
        });
        panal_licences();
    }, [refreshscreen, refresh, panelStatus]);

    const conditionalRowStyles = [
        {
            when: row => row.panel_on == 1,
            style: row => ({ color: row.panel_on ? '#46AA46' : '#FF0000' }),
        },
        {
            when: row => row.panel_on == 0,
            style: row => ({ color: row.panel_on ? '#FF0000' : '#FF0000' }),
        },
    ];

    const panal_licences = () => {
        axios.get(`${Config.base_url}superadmin/panal_licences`, {
        }).then((res) => {
            // console.log("res");
        })
    }

    const handleShowMonthList = () => {
        setShowMonthList(true)
        axios.get(`${Config.base_url}superadmin/month_licences_list1`, {
        }).then((res) => {
            {
                res.data.list.map((data, i) => {
                    panalList.push({
                        id: i + 1,
                        Company_Name: data.Company_name,
                        total_license: data.total_license,
                        total_used_license: data.total_used_license,
                        previous_month: data.previous_month,
                        current_month: data.current_month,
                    })
                })
                setMonthDataLicense(panalList)

                // console.log(panalList)
            }
        });
    }
    const logsFile = (row) => {
        const Panel_Name = row.url.split('.')[1]
        localStorage.setItem("PanelName", Panel_Name)
    }

    // Admin Information api

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
                justifyContent: 'Left !important',
            },
        },
        cells: {
            style: {
                overflow: 'visible !important',
                justifyContent: 'center !important',
            },
        },
    };

    const ResetBillingList = () => {

        axios({
            method: "get",
            url: `${Config.base_url}superadmin/allLicense1`,
            data: {},
        }).then(function (response) {
            if (response) {
                setRefreshscreen(!refreshscreen);
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
                                    <h3 className="card-title mx-3">Admin List</h3>
                                </div>
                                <div className="col-md-6">

                                    {user_id == '5' ?
                                        <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                                            <button type="button" className="btn btn-color" onClick={ResetBillingList}>
                                                Reset Billing List
                                            </button>
                                        </div>
                                        : ""

                                    }

                                    <div className=" mb-4 rounded-3 d-flex ms-auto maunt">
                                        <button type="button" className="btn btn-color" onClick={handleShowMonthList}>
                                            Month List
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label style={{ fontWeight: 'bold', color: 'black' }}>Panel Active</label>
                                    <select className="form-control" name="symbolname" onChange={(e) => { setpanelStatus(e.target.value) }}>
                                        <option value={1} selected>Active</option>
                                        <option value={0}>InActive</option>
                                        <option value='null'>All</option>
                                        <option value={2}>sapratePanel</option>
                                        <option value={3}>NosapratePanel</option>

                                    </select>
                                </div>

                                <DataTableExtensions
                                    columns={columns}
                                    data={addTableData && addTableData}
                                    export={false}
                                    print={false}
                                >
                                    <DataTable
                                        fixedHeader
                                        fixedHeaderScrollHeight="700px"
                                        highlightOnHover
                                        pagination
                                        noHeader
                                        customStyles={customStyles}
                                        conditionalRowStyles={conditionalRowStyles}
                                        defaultSortField="id"
                                        style={{ overflow: "scroll" }}
                                        paginationRowsPerPageOptions={[10, 50, 100]}
                                        paginationComponentOptions={{
                                            selectAllRowsItem: true,
                                            selectAllRowsItemText: "All",
                                        }}
                                    />
                                </DataTableExtensions>
                            </div>
                        </div>



                        <Modal show={show} onHide={handleClose} animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>panel view</Modal.Title>

                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>Total Licence </td>
                                            <td>{getViewPanal.total_license}</td>
                                            {/* <td>{getViewPanal1.id}</td> */}
                                        </tr>
                                        <tr>
                                            <td>Used Licence</td>
                                            <td>{getViewPanal.used_license}</td>
                                        </tr>
                                        <tr>
                                            <td>Remaining Licence</td>
                                            <td>{getViewPanal.reamining_licence}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Live Account</td>
                                            <td>{getViewPanal.total_live_account}</td>
                                        </tr>
                                        <tr>
                                            <td>Active Live Account</td>
                                            <td>{getViewPanal.active_live_account}</td>
                                        </tr>
                                        <tr>
                                            <td>Expired Live Account</td>
                                            <td>{getViewPanal.expired_live_account}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Demo Account</td>
                                            <td>{getViewPanal.total_demo_account}</td>
                                        </tr>
                                        <tr>
                                            <td>Active Demo Account</td>
                                            <td>{getViewPanal.active_demo_account}</td>
                                        </tr>
                                        <tr>
                                            <td>Expired Demo Account</td>
                                            <td>{getViewPanal.expired_demo_account}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        {/* License List Modal */}
                        <Modal show={show1} onHide={handleClose1} animation={false}>

                            <Modal.Header closeButton>

                                {/* <Modal.Title>Panel view</Modal.Title> */}

                                {
                                    addTableData.map(obj =>
                                        obj.id == name ? <Modal.Title>{obj.url.split(".")[1]}</Modal.Title> : ""
                                    )
                                }



                                <input
                                    type="month"
                                    min={minDate}
                                    // placeholder="MM/DD/YYYY"
                                    // max="2022-12"
                                    // value={datespliter(new Date())}
                                    onChange={(e) => setMatch(e.target.value)}
                                    style={{ marginLeft: "125px", marginTop: "25px" }}
                                />

                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>

                                    <tbody>

                                        <tr align="center">
                                            <th>ID</th>
                                            <th>MONTH LICENSE</th>
                                            <th>DATE TIME</th>
                                        </tr >

                                        {getViewPanal1.sort((a, b) => b.id - a.id).map((data, i) => {
                                            if (match == null) {
                                                sum = sum + parseInt(data.month_licence)
                                                return <tr align="center">
                                                    <td>{i + 1}</td>
                                                    <td>{data.month_licence}</td>
                                                    <td>{dateFormate(data.date_time)}</td>
                                                </tr>

                                            }

                                            else {
                                                if (match == dateFormate(data.date_time).slice(0, 7)) {
                                                    sum = sum + parseInt(data.month_licence)
                                                    return <tr>
                                                        <td>{i + 1}</td>
                                                        <td>{data.month_licence}</td>
                                                        <td>{dateFormate(data.date_time)}</td>

                                                    </tr>

                                                }
                                            }

                                        })}





                                        <tr align="center">
                                            <td></td>
                                            <td>SUM =  {sum}</td>
                                            <td></td>

                                        </tr>

                                    </tbody>

                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose1}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>



                        <Modal size="lg" show={showMonthList} onHide={handleCloseMonthList} animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Month Licence</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <ExportToExcel
                                    className="export-btn btn-color ms-auto d-flex"
                                    apiData={getMonthDataLicense && getMonthDataLicense}
                                    fileName={fileName}
                                    style={{ backgroundColor: "#f96332" }}

                                />
                                <DataTableExtensions
                                    columns={columns1}
                                    data={getMonthDataLicense && getMonthDataLicense}
                                    export={false}
                                    print={false}
                                >
                                    <DataTable
                                        fixedHeader
                                        fixedHeaderScrollHeight="700px"
                                        highlightOnHover
                                        pagination
                                        noHeader
                                        customStyles={customStyles}
                                        //   conditionalRowStyles={conditionalRowStyles}
                                        defaultSortField="id"
                                        style={{ overflow: "scroll" }}
                                        paginationRowsPerPageOptions={[10, 50, 100]}
                                        paginationComponentOptions={{
                                            selectAllRowsItem: true,
                                            selectAllRowsItemText: "All",
                                        }}
                                    />
                                </DataTableExtensions>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseMonthList}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <Modal show={showConfirmBox} onHide={handleCloseCrossButton} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Licence</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You Are Increasing <b>{panelModalName.split('.')[1]}</b> Licence
                            <br />
                            <br />
                            <TextField
                                id="outlined-required"
                                label="Add Licence"
                                defaultValue=""
                                onChange={(e) => setAddLicence(e.target.value)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" className="btn btn-color" onClick={handleCloseShowConfirmBox}>
                                Add Licence
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <>
                        <Modal
                            show={showAdminInformation}
                            onHide={handleCloseAdminInformation}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Admin Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>Panel Start Date</td>
                                            <td className="text-center">{startDate.key}</td>
                                        </tr>
                                        <tr>
                                            <td>Maintenance Charges</td>
                                            <td className="text-center"><input className="border-0 text-center" type="number" defaultValue={panelId.maintenance_charges} onChange={e => setPanelId({ ...panelId, maintenance_charges: e.target.value })} /></td>
                                        </tr>
                                        <tr>
                                            <td>Licence ID Charges</td>
                                            <td className="text-center"><input className="border-0 text-center" type="number" defaultValue={panelId.licence_id_charges} onChange={e => setPanelId({ ...panelId, licence_id_charges: e.target.value })} /></td>
                                        </tr>
                                        <tr>
                                            <td>Total Pending</td>
                                            <td className="text-center"><input className="border-0 text-center" type="number" defaultValue={panelId.total_pending}
                                                onChange={e => setPanelId({ ...panelId, total_pending: e.target.value })} /></td>
                                        </tr>
                                        <tr>
                                            <td>Current Pending</td>
                                            <td className="text-center"><input className="border-0 text-center" type="number" defaultValue={panelId.current_pending} onChange={e => setPanelId({ ...panelId, current_pending: e.target.value })} /></td>
                                        </tr>
                                        <tr>
                                            <td>Received</td>
                                            <td className="text-center"><input className="border-0 text-center" type="number" defaultValue={panelId.Received} onChange={e => setPanelId({ ...panelId, Received: e.target.value })} /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-danger" onClick={handleCloseAdminInformation}>
                                    Close
                                </Button>
                                <Button className="btn btn-success ms-2" onClick={updateData}>Update</Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                </div>
            </div>
        </div>
    )
}

export default AdminList