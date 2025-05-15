import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import * as Config from "../common/Config";
import { Form, Button } from 'react-bootstrap'
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useForm } from "react-hook-form";
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';
import ExportToExcel from '../common/ExportToExport';
import { dateFormate } from "../common/CommonDateFormate";
import Accordion from 'react-bootstrap/Accordion';


const Faqs = () => {
    const fileName = "MessageBroadcast";

    // const columns = [
    //   {
    //     name: "No.",
    //     selector: (row) => row.no,
    //   },
    //   {
    //     name: "Message",
    //     selector: (row) => row.message,
    //   },
    //   {
    //     name: "Strategy Users",
    //     selector: (row) => row.strategy_users,
    //   },
    //   {
    //     name: "Time",
    //     selector: (row) => row.time,
    //   },

    //   {
    //     name: "Action",
    //     selector: (row) => row.action,
    //   }
    // ];

    const columns = [
        {
            name: "No.",
            selector: (row, index) => index + 1,
        },
        {
            name: "Message",
            selector: (row) => row.message,
        },
        {
            name: "Strategy Users",
            selector: (row) => row.strategy,
        },
        {
            name: "Time",
            selector: (row) => dateFormate(row.created_at),
        },

        {
            name: <h6>Actions</h6>,
            cell: (row) => (
                // console.log("row", row)
                <>
                    <i
                        className={row.licencetype === "Live" ? 'fa-solid fa-trash fs-5 hover d-none' : "fa-solid fa-trash  fs-5  hover "}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete Client"
                        onClick={() => onShowClick(row.message, row.strategy)}
                    ></i>
                </>
            ),

        },
    ];

    const [strategy_filter, setStrategy_filter] = useState([]);
    const [fstrategy, setFstrategy] = useState("all");
    const [message, setMessage] = useState("");
    const adminId = localStorage.getItem('adminId');
    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [sendedMsg, setSendedMsg] = useState([]);
    // console.log("sendedMsg", sendedMsg);
    const [tableData, settableData] = useState({
        columns,
        data,
    });

    const [rerender, setRender] = useState(false)

    const admin_token = localStorage.getItem("token");


    var data = [];

    const onAlertClose = e => {
        setShowAlert(false);
    }

    const apiCalls = () => {

        axios({
            method: "get",
            url: `${Config.base_url}smartalgo/strategygroup`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then((res1) => {
            setStrategy_filter(res1.data.strategy);
        });


    };

    const onShowClick = (msg, strategy) => {

        if (window.confirm(Constant.DELETE_GROUP_CONFIRM_MSG)) {
            axios({
                method: "post",
                url: `${Config.base_url}smartalgo/msg-broadcast-delete`,
                data: {
                    'adminId': adminId,
                    'msg': msg,
                    'strategy': strategy === "" ? "all" : strategy
                },
                headers: {
                    'x-access-token': admin_token
                }
            })
                .then(function (response) {
                    if (response) {
                        setShowAlert(true)
                        setAlertColor('error');
                        setTextAlert(Constant.MESSAGE_BROADCAST_DELETE);
                        setRender(!rerender)
                    }
                })
        }
    }

    const inputChange = useCallback((e) => {

        if (e.target.name == "strategyname") {
            setFstrategy(e.target.value);
        }
        if (e.target.name == "msgtext") {
            setMessage(e.target.value);
        }

    });

    const msgAddedOnTable = () => {


        axios({
            method: "get",
            url: `${Config.base_url}smartalgo/msg-added`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then((res1) => {
            var mm = res1.data.msg;

            mm.map((cl, index) =>
                data.push({
                    no: index + 1,
                    message: cl.message,
                    strategy_users: cl.strategy === "" ? 'all' : cl.strategy,
                    // time: setNewTime(cl.created_at),
                    time: dateFormate(cl.created_at),
                    action: <i
                        className="fa-solid fa-trash fs-5 mx-3 hover"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                        onClick={() => onShowClick(cl.message, cl.strategy)}
                    ></i>
                })
            );
            settableData({
                columns,
                data,
            });
            setSendedMsg(mm)
        });
    }


    const sendMessage = () => {

        // const socket = socketIOClient(Config.base_url);
        // // console.log("nileshgandi",socket);
        // socket.emit("message_broadcast", message);
        setMessage('')
        axios({
            method: "post",
            url: `${Config.base_url}smartalgo/message-broadcast`,
            data: {
                strategy: fstrategy,
                message: message,
                adminId: adminId
            },
            headers: {
                'x-access-token': admin_token
            }
        }).then((res1) => {
            // Object.keys(res1.data).length === 0 && res1.data.constructor === Object
            if (res1.data.messagesBroadcast.length === 0) {
                setShowAlert(true)
                setAlertColor('error');
                setTextAlert(Constant.CLIENT_NOT_AVAILABLE);
                setFstrategy("all")
                setMessage("")
            } else {
                setShowAlert(true)
                setAlertColor('success');
                setTextAlert(Constant.MESSAGE_BROADCAST);
                msgAddedOnTable()
                // sendedMsg()
            }
        });
    }

    useEffect(() => {
        apiCalls();
        msgAddedOnTable();
    }, [rerender]);


    //  style Table HEader
    const customStyles = {

        headCells: {
            style: {
                textTransform: 'uppercase !important',
                backgroundColor: '#000',
                color: '#fff',
                fontWeight: '700',
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

    // const setNewTime = (time) => {
    //   let currentDate = time.split("T");
    //   let currentTime = currentDate[1].split(".")[0];
    //   return `${currentDate[0]} ${currentTime}`;
    // };

    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 class="card-title">Frequently Asked Questions</h4>
                                    </div>
                                    <div className="col-md-3"></div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="col-md-2">
                                </div>
                                <Accordion >
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header><b>Trade Execution: Trade has not been executed ?</b></Accordion.Header>
                                        <Accordion.Body>
                                            1. Check the <b>Signals</b> are generated or not. <br />
                                            2. Check the <b>Strategy</b> you have given via <b>MT4</b> is correct or not. <br />
                                            3. <b>Check all inputs</b> when you are applying strategy <b>in MT4</b>. <br/>
                                            4. Check if the <b>trading is turned on or not</b>. And if the trading is on then it  <b>should be</b> on before the trade execution. <br/>
                                            5. <b>Do not close</b> the chart if the trade has not taken <b>exit.</b> <br/>
                                            6. If you have applied one Strategy on a chart then <b>do not </b>apply another Strategy on same <b>Symbol chart.</b>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header><b>Signals: Are Signals not showing on the panel ?</b></Accordion.Header>
                                        <Accordion.Body>
                                            1. Check if the <b>Strategy & Symbol </b>matches the Strategy & Symbol given to the client or not.<br />
                                            2. Check the settings of the client, in their profile <b>Web URL should be set on Admin.</b> <br/>
                                            3. <b>SignalOnPanel input</b> on MT4 should be true. <br />
                                            
                                        
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header><b>Broker Response: Order has been Rejected ?</b></Accordion.Header>
                                        <Accordion.Body>
                                            1. If Order ID has been generated then there is not issue from our side,<b>Contact Broker.</b> <br />
                                            2.  If you are getting a broker response <b>"success:falsemessage:Invalid TokenerrorCode:AG8001data"</b>, then turn off and turn on the trading again.
                                            
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header><b>Trade History: Prices are inaccurate?</b></Accordion.Header>
                                        <Accordion.Body>
                                            1. <b>Hide & Show</b> Banknifty, Nifty & Finnifty option chain in Market watch on MT4.<br />
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header><b>MT4: How to Hide & Show Symbols in MT4?</b></Accordion.Header>
                                        <Accordion.Body>
                                            1. Right click on <b>Market watch.</b>  <br /><br />
                                            <img src="http://app.smartalgo.in/assets/dist/img/mt4/mt4.png"></img> <br /><br />
                                            2. Select <b>Segment</b> and their symbols. <br />
                                            3. Click on <b>Hide & Show button</b> on the right side.
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    {/* <Accordion.Item eventKey="5">
                                        <Accordion.Header><b>Trade History: Prices are inaccurate?</b></Accordion.Header>
                                        <Accordion.Body><img src="http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue1.png"></img>
                                            1. If Order ID has been generated then there is not issue from our side,<b>Contact Broker.</b> <br />
                                            2. Check the settings of the client, in their profile <b>Web URL should be set on Admin.</b><br />
                                            3. SignalOnPanel input on MT4 should be true.
                                        </Accordion.Body>
                                    </Accordion.Item> */}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAlert &&
                <AlertToast
                    hideAlert={onAlertClose}
                    showAlert={showAlert}
                    message={textAlert}
                    alertColor={alertColor}
                />
            }
        </>
    );
};

export default Faqs;
