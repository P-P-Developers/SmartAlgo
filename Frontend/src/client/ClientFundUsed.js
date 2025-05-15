import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from '@mui/material/Backdrop';
import * as Constant from "../common/ConstantMessage";
import CircularProgress from '@mui/material/CircularProgress';
import $ from "jquery";
import CryptoJS from "crypto-js";

const ClientFundUsed = ({ dataServices, qty_type }) => {

    // console.log("dataServices", dataServices);
    // console.log("qty_type", qty_type);

    const [showModal, setShowModal] = useState(false);
    const [option, setOption] = useState("");
    const [fund, setFund] = useState('');
    const [percentage, setPercentage] = useState('');
    const [refreshscreen, setRefreshscreen] = useState(true);
    const [getScriptWiseData, setGetScriptWiseData] = useState([])
    // console.log("getScriptWiseData", getScriptWiseData);

    // Alert Box
    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const onAlertClose = (e) => {
        setShowAlert(false);
    };

    var user_id = localStorage.getItem("client_id");
    const client_token = localStorage.getItem('client_token');

    const handleCloseModal = () => {
        // setRefreshscreen(!refreshscreen);
        setShowModal(false)
        // window.location.reload()
    }

    const handleOptionChange = (e) => {
        setOption(e.target.value);
        // setFund('');
        // setPercentage('');
    };

    const handleFundChange = (e) => {
        setFund(e.target.value);
    };

    const handlePercentageChange = (e) => {
        setPercentage(e.target.value);
    };

    useEffect(() => {
        getFundApi()
    }, [refreshscreen]);

    const getFundApi = () => {
        axios({
            url: `${Config.base_url}client/get/fund-used`,
            method: "post",
            data: {
                client_id: user_id,
            },
            headers: {
                'x-access-token': client_token
            }
        }).then((res) => {
            // console.log("getFund", res.data.data);
            setGetScriptWiseData(res.data.data[0])

            if (res.data.data[0].fund_used === 0) {
                setOption('no_selected')
            }
            else if (res.data.data[0].fund_used === 1) {
                setOption('over_all_fund')
                setFund(res.data.data[0].overall_fund)
                setPercentage(res.data.data[0].overall_fund_percent)
            }
            else if (res.data.data[0].fund_used === 2) {
                setOption('script_wise')
            }

        });
    }

    const handleSubmit = () => {
        let apiData;

        if (option === 'no_selected') {
            apiData = {
                fundKey: 0,
            };
            // console.log("no_selected", apiData);
        } else if (option === 'over_all_fund') {
            apiData = {
                fundKey: 1,
                data: {
                    fund: fund,
                    percentage: percentage
                }
            };
            // console.log("over_all_fund", apiData);
        } else if (option === 'script_wise') {
            apiData = {
                fundKey: 2,
                data: dataServices
                    .filter((x) => x.cat_name === 'CASH')
                    .map((x) => ({
                        symbol: x.ser_name,
                        segment: x.segment,
                        fund: document.getElementById(`${x.ser_name}_${x.segment}`).value
                    }))
            };
        }

        // console.log("apiData outside", apiData);
        axios({
            url: `${Config.base_url}client/fund-used`,
            method: "post",
            data: {
                client_id: user_id,
                fundData: apiData
            },
            headers: {
                'x-access-token': client_token
            }
        }).then((res) => {
            // console.log("res fund", res);
            if (res) {
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Quantity Updated");
                setRefreshscreen(!refreshscreen);
                window.location.reload()
            }
        });
        setShowModal(false);
    };

    const getFundName = (number) => {
        // console.log("number", number);
        switch (number) {
            case 0:
                return "None"
                break;
            case 1:
                return "Over All Fund"
                break;
            case 2:
                return "Script Wise"
                break;
        }
    }

    // className="col-md-4 mb-3"
    return (
        <>
            <div className="row">
                <div>
                    <div className="d-flex">
                        <h6>Quantity Selection <i class="fa-duotone fa-arrow-right ms-1"> </i></h6><br /><p style={getScriptWiseData.fund_used === 0 ? { color: "#FF0000" } : { color: "#008000" }}><b className="ms-1"> {getFundName(getScriptWiseData.fund_used)} </b><i class="fa-duotone fa-arrow-right"></i></p>
                        <Button
                            variant="primary"
                            className="ms-2"
                            disabled={qty_type == 0}
                            onClick={() => setShowModal(true)}>
                            Select Input
                        </Button>

                        {qty_type == 0 ?
                            <div className=" mt-3 text-bold text-info ms-1"><b> (Set Quantity type as Individual from Client Profile to use this feature.)</b></div>
                            : ""}

                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Quantity Selection</Modal.Title>
                            </Modal.Header>
                            <div className="mt-3 mx-3">You have selected <b className="text-larger text-info">{getFundName(getScriptWiseData.fund_used)}</b></div>
                            <Modal.Body>
                                <Form.Group controlId="optionSelect">
                                    <Form.Label>Select an Option:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        // defaultValue={option == "" ? getFundName(getFundData.fund_used) : option}
                                        onChange={handleOptionChange}
                                        value={option && option}
                                    >
                                        <option value="no_selected">No Selected</option>
                                        <option value="over_all_fund">Overall Fund</option>
                                        <option value="script_wise">Script Wise</option>
                                    </Form.Control>
                                </Form.Group>
                                <>
                                    {(option === 'over_all_fund') && (
                                        <>
                                            <Form.Group controlId="fundInput">
                                                <Form.Label className="mt-2">Fund:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    defaultValue={fund || 0}
                                                    onChange={handleFundChange}
                                                // required
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="percentageInput">
                                                <Form.Label className="mt-2">Percentage:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    defaultValue={percentage || 0}
                                                    onChange={handlePercentageChange}
                                                // required
                                                />
                                            </Form.Group>
                                        </>
                                    )}

                                    {(option === 'script_wise') && (
                                        <>
                                            {dataServices
                                                .filter((x) => x.cat_name === 'CASH')
                                                .map((x, index) => (
                                                    <Form.Group controlId={`${x.ser_name}_${x.segment}`} key={index}>
                                                        <Form.Label className="mt-2">{x.ser_name + " " + x.cat_name}</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            defaultValue={x.script_percentage || 0}
                                                        />
                                                    </Form.Group>
                                                ))
                                            }
                                        </>
                                    )}
                                </>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                                <Button variant="success" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            {showAlert && (
                <AlertToast
                    hideAlert={onAlertClose}
                    showAlert={showAlert}
                    message={textAlert}
                    alertColor={alertColor}
                />
            )}
        </>
    );
};

export default ClientFundUsed;


// value={getFundData.fund_used == 0 ? "no_selected" : getFundData.fund_used == 1 ? "over_all_fund" : getFundData.fund_used == 2 ? "script_wise" : ""}