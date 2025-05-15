import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
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

const ClosePosition = () => {

    const [closingPositionData, setClosingPositionData] = useState([])
    const [profitAndLoss, setProfitAndLoss] = useState("")
    console.log("closingPositionData", closingPositionData);

    const navigate = useNavigate()

    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Time</h6>,
            selector: (row) => dateFormate(row.created_at),
            width: '160px !important',
        },
        {
            name: <h6>Trade Symbol</h6>,
            selector: (row) => row.tradesymbol,
            //  width: '280px !important',
        },
        {
            name: <h6>Transaction</h6>,
            selector: (row) => lxsx(row.type),
            //     width: '120px !important',
        },
        {
            name: <h6>Type</h6>,
            selector: (row) => row.type,
            //    width: '60px !important',
        },
        {
            name: <h6>Qty</h6>,
            selector: (row) => row.exit_qty == null ? row.entry_qty : row.exit_qty,
            //  width: '60px !important'
        },
        {
            name: <h6>Entry Price</h6>,
            selector: (row) => row.executed_price == 0 ? "-" : row.executed_price,
            //width: '100px !important',
        },
        {
            name: <h6>Exit Price</h6>,
            selector: (row) => row.exit_price == 0 ? "-" : row.exit_price,
            width: '80px !important',
        },
        {
            name: <h6>P/L</h6>,
            selector: (row, index) => row.type == "LX" || row.type == "SX" ? profitLoss(row, index) : "-",
            // style={profitLoss(row, index) > 0 ? { color: "#FF0000" } : { color: "#008000" }},
            // style: { profitLoss(row, index)} ? {color: "#008000" }: {color: "#FF0000"}},
            width: '90px !important',
        },
        {
            name: <h6>CPL</h6>,
            selector: (row, index) => cumulative(row, index),
            width: '90px !important',
        },

    ];



    //  Count Comedity Profit Loss 

    const CountCPl = (row, index) => {
        console.log("ComedityPL", ComedityPL);
        let sum = ComedityPL.reduce((s, f) => {
            return parseFloat(s) + parseFloat(f)
        }, 0);
        return sum
        console.log("ComedityPL", sum);


    }






    var setCumulativePrice = []
    var price = 0
    var price1 = 0
    var comulativepri = 0
    var comulativepri1 = 0
    var totalsum = 0

    const cumulative = (row, i) => {
        if (row.type == "LX") {
            let lx = setCumulativePrice.filter((item) => {
                if (item.type === "LX") {
                    return item.price
                }
            }).reduce((s, f) => {
                return s + f.price;
            }, 0);
            // console.log("lx", lx)
            return lx.toFixed(2)
        }
        else if (row.type == "SX") {
            let sx = setCumulativePrice.filter((item) => {
                if (item.type === "SX") {
                    return item.price
                }
                // return sx
            }).reduce((s, f) => {
                return s + f.price;
            }, 0);
            // console.log("sx", sx)
            return sx.toFixed(2)
        } else {
            return "test"
        }

        console.log("setCumulativePrice", setCumulativePrice);

    }

    var ComedityPL = []
    const profitLoss = (row, i) => {
        if (closingPositionData[i - 1] != undefined) {
            if (row.type == "LX") {
                price = row.exit_price - closingPositionData[i - 1].executed_price
                setCumulativePrice.push({ "type": "LX", price: price })

            } else if (row.type == "SX") {
                price = closingPositionData[i - 1].executed_price - row.exit_price
                setCumulativePrice.push({ "type": "SX", price: price })
            }
            ComedityPL.push(price.toFixed(2))
            return price.toFixed(2)

            // if (price > 0) {
            //     return "green"
            // }
            // else if (price == '-') {
            //     return "black"
            // } else {
            //     return "red"
            // }
        }
    }


    const customStyles = {
        headCells: {
            style: {
                fontWeight: '700',
                // margin:' 19px 0px',
                backgroundColor: '#000',
                color: '#fff',

                justifyContent: 'center !important',
                overflow: 'visible !important',
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

    const lxsx = (value) => {
        if (value == "LX") {
            return "SELL"
        }
        if (value == "SX") {
            return "BUY"
        }
        if (value == "LE") {
            return "BUY"
        }
        if (value == "SE") {
            return "SELL"
        }
    }

    const closingPositionApi = () => {
        var config = {
            method: 'get',
            url: `${Config.base_url}closeposition`,
            headers: {}
        };
        axios(config).then(function (response) {
            // console.log("closingposition", response.data.data);
            setClosingPositionData(response.data.data)
        })
            .catch(function (error) {
                console.log(error);
            });
    }


    useEffect(() => {
        closingPositionApi()
    }, [])


    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Closing Position</h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">

                                    </div>
                                    <div className="col-md-3"></div>
                                </div>
                                <button className='btn btn-color' onClick={() => navigate("/admin/executivetrade")}>Back</button>
                            </div>

                            <div className="row d-flex justify-content-end mx-auto">
                                <div className="card-body mx-auto">
                                    <div className="table-responsive mx-auto">
                                        <DataTableExtensions
                                            columns={columns}
                                            data={closingPositionData}
                                            export={false}
                                            print={false}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                customStyles={customStyles}
                                                highlightOnHover
                                            // pagination
                                            // paginationRowsPerPageOptions={[10, 50, 100]}
                                            // paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                            />
                                        </DataTableExtensions>
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

export default ClosePosition