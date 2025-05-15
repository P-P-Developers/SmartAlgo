import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import * as Constant from "../common/ConstantMessage";
import Backdrop from "@mui/material/Backdrop";
import { NavLink, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Modal } from 'react-bootstrap';

const StrategyDevelopment = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    const [strategyDevelopmentData, setStrategyDevelopmetData] = useState([])
    const admin_token = localStorage.getItem("token");


    useEffect(() => {
        getStrategyDevelopmentData()
    }, [])


    const getStrategyDevelopmentData = () => {
        axios({
            url: `${Config.base_url}client/get/strategy_development`,
            method: "GET",
            headers: {
                'x-access-token': admin_token
            }
        }).then((res) => {
            console.log("res", res.data.strategy_development);
            setStrategyDevelopmetData(res.data.strategy_development)
        }).catch((error) => {
            // Handle the error
        });
    }


    const columns = [
        {
            name: "Client Name",
            selector: (row) => row.client_name,
        },
        {
            name: "Strategy Description",
            selector: (row) => row.your_strategy,
            wrap: true
        },
        {
            name: "Strategy Image",
            selector: (row) => row.strategy_img,
            cell: (row) => (
                <div>
                    {row.strategy_img && (
                        <img src={row.strategy_img} alt="Strategy" style={{ width: "50px", height: "auto", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedImage(row.strategy_img);
                                setShowModal(true);
                            }}
                        />
                    )}
                </div>
            )

        },
        {
            name: "Strategy PDF",
            selector: (row) => row.strategy_pdf,
            cell: (row) => (
                <div>
                    {row.strategy_pdf && (
                        <a className="btn btn-danger cursor-pointer" onClick={() => {
                            setSelectedPdf(row.strategy_pdf);
                            setShowPdf(true);
                        }}>
                            View PDF
                        </a>
                    )}
                </div>
            ),
        },
        // {
        //     name: "Strategy name",
        //     selector: (row) => row.your_strategy,
        // },
    ];

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
            <div className="row" style={{ marginTop: "-25px", height: '80vh' }}>
                <div className="col-md-12">
                    <div className="card" style={{ height: '85vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6 ">
                                    <h4 className="card-title mx-3">Strategy Development</h4>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <NavLink
                                        to="/admin/strategy"
                                        className="btn btn-color"
                                        style={{ marginLeft: "330px" }}
                                    >
                                        Back
                                    </NavLink>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <DataTableExtensions
                                    columns={columns}
                                    data={strategyDevelopmentData}
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
                            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                                <Modal.Body>
                                    <img src={selectedImage} alt="Strategy" style={{ width: "100%" }} />
                                </Modal.Body>
                            </Modal>
                            <Modal show={showPdf} onHide={() => setShowPdf(false)} size="lg">
                                <Modal.Body>
                                // <iframe
                                        src={selectedPdf}
                                        title="PDF Viewer"
                                        width="100%"
                                        height="600px"
                                        style={{ border: "none" }}
                                    />
                                </Modal.Body>
                            </Modal>
                        </div>
                        <div className="card-body">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StrategyDevelopment