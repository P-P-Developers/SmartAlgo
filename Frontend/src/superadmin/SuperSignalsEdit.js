import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import * as Config from "../common/Config";
import DataTable from "react-data-table-component";
import { dateFormate } from "../common/CommonDateFormate";
import DataTableExtensions from "react-data-table-component-extensions";
import DatePicker from "react-datepicker";
import { set } from "date-fns";
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';


const SuperSignalsEdit = () => {

    const [params] = new useSearchParams(window.location.search);
    const [loader, setLoader] = useState(false);
    const admin_token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");
    const fileName = "Signals";
    const params_id = useParams()
    const [changePrices, setChangePrices] = useState([])
    const [updatedPrices, setUpdatedPrices] = useState([])
    // console.log("updatedPrices", updatedPrices);

    var Superadmin_name = localStorage.getItem("Superadmin_name")

    const [qrefresh, setQrefresh] = useState(window.location.search);
    const [signals, setSignals] = useState([]);
    const [symbol_filter, setSymbol_filter] = useState([]);
    const [segment_filter, setSegment_filter] = useState([]);
    const [strategy_filter, setStrategy_filter] = useState([]);
    const [fsymbol, setFsymbol] = useState("");
    const [fstrategy, setFstrategy] = useState("");
    const [fromdate, setFromdate] = useState("");
    const [todate, setTodate] = useState("");
    const [fsegment, setFsegmnet] = useState("");
    const [refresh, setRefresh] = useState(false)
    const [symbolColors, setSymbolColors] = useState("")
    const [getRowEditPrice, setGetRowEditPrice] = useState("")
    const [updatedPri, setUpdatedpri] = useState("")
    const [undoSignals, setUndoSignals] = useState([])

    const [endDate, setEndDate] = useState();
    const [endDateErr, setEndDateErr] = useState("");

    // SuperSignalsEdit.js:52:1)

    console.log("endDate", endDate);
    var panelKey = localStorage.getItem("PanelKey")
    console.log();
    // var panelKey = localStorage.getItem("panelKey").split('.')[1]
    // console.log(panelKey);

    // console.log("getrow", getRowEditPrice);

    const location = useLocation();
    console.log("location = >", location.state[2].singal_build);

    var allPanelConfig = `https://${location.state[0].url}:${location.state[1].port}/`
    if (location.state[2].singal_build == '0') {
        allPanelConfig = `https://${location.state[0].url}:${location.state[1].port}/`
    } else {
        allPanelConfig = `https://${location.state[0].url}/backend/`
    }


    const columns = [
        {
            name: "S.No.",
            selector: (row, index) => index + 1,
            width: '65px !important'
        },
        // {
        //     name: "S.No.",
        //     selector: (row) => row.id,
        //     width: '80px !important'
        // },
        {
            name: "SIG. ID",
            selector: (row) => row.signal_id,
            width: '80px !important'
        },
        {
            name: "TRADE SYMBOL",
            selector: (row) => row.trade_symbol,
            overflow: 'visible !important',
            width: '230px !important'
        },
        {
            name: "PRICE",
            cell: (row) => (
                <div>
                    <input
                        className="hidebg"
                        name="price"
                        type="number"
                        onChange={(e) => {
                            inputChangePrices(e, row.id);
                        }}
                        defaultValue={row.price}
                    />
                </div>
            )
        },
        {
            name: "STRATEGY",
            selector: (row) => row.strategy,
            // width: '120px !important'
        },
        {
            name: "CAT.",
            selector: (row) => row.cat_name,
            justifyContent: 'center !important',
            width: '60px !important'
        },
        {
            name: "SIGNALS TIME",
            selector: (row) => row.create_date,
            overflow: 'visible !important',
            width: '200px !important'
        },
        {
            name: <h6>Actions</h6>,
            width: '60px !important',
            cell: (row) => (
                <>
                    <Tooltip title="Delete">
                        <i
                            className={row.licencetype === "Live" ? 'fa-solid fa-trash fs-5 hover d-none' : "fa-solid fa-trash fs-5 hover "}
                            data-toggle="tooltip"
                            data-placement="top"
                            onClick={() => deleteSignals(row, row.id)}
                        ></i>
                    </Tooltip>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnsUndo = [
        {
            name: "S.No.",
            selector: (row, index) => index + 1,
            width: '65px !important'
        },
        // {
        //     name: "S.No.",
        //     selector: (row) => row.id,
        //     width: '80px !important'
        // },
        {
            name: "SIG. ID",
            selector: (row) => row.signal_id,
            width: '75px !important'
        },
        {
            name: "TRADE SYMBOL",
            selector: (row) => row.trade_symbol,
            overflow: 'visible !important',
            width: '230px !important'
        },
        {
            name: "PRICE",
            selector: (row) => row.price,
            // width: '120px !important'
        },
        {
            name: "STRATEGY",
            selector: (row) => row.strategy_tag,
            // width: '120px !important'
        },
        {
            name: "CAT.",
            selector: (row) => row.type,
            justifyContent: 'center !important',
            width: '60px !important'
        },
        {
            name: "SIGNALS TIME",
            selector: (row) => dateFormate(row.create_date),
            overflow: 'visible !important',
            width: '200px !important'
        },
        {
            name: <h6>UNDO SIG.</h6>,
            width: '60px !important',
            cell: (row) => (
                <>
                    <Tooltip title="Undo">
                        <Icon icon="jam:undo"
                            color="#A8006D"
                            onClick={() => redoSignals(row, row.sid)}
                            className='mx-2'
                            width="22"
                            variant="primary"
                            data-toggle="tooltip"
                            data-placement="top"
                            cursor="pointer"
                        />
                    </Tooltip>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const [tableData, settableData] = useState({
        columns,
        signals,
    });
    const navigate = useNavigate()

    var data = [];
    var addDays = function (str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate;
    };

    var todate1 = addDays(todate, 1);
    var fromdate1 = addDays(fromdate, 0);

    const getRow = (e, row) => {
        setGetRowEditPrice(row)
    }

    var updatePrice = []
    const inputChangePrices = (e, id) => {
        var updated =
        {
            "updatedId": id,
            "updatedPrice": e.target.value
        }
        updatePrice.push(updated)
        setUpdatedpri(updatePrice)
    }


    const updatePrices = () => {

        var dataArr = updatedPri.map(item => {
            return [item.updatedId, item]
        });
        var maparr = new Map(dataArr);
        var result = [...maparr.values()];
        // console.log("result", result)

        if (window.confirm("Do you want to update Signals ?")) {
            axios({
                method: "post",
                url: `${allPanelConfig}superadmin/change/signal`,
                data: {
                    Superadmin_name: Superadmin_name,
                    panelKey: params_id.id,
                    updateobj: result,
                },
                headers: {
                    // 'x-access-token': admin_token
                }

            }).then((response) => {
                if (response) {
                    setRefresh(!refresh);
                }
            });
        }
    }


    const deleteSignals = (row, id) => {

        if (window.confirm("Do you want to delete this Signal ?")) {

            axios({
                method: "post",
                url: `https://api.smartalgo.in:3001/superadmin/history-Create`,
                data: { data: '"' + Superadmin_name + '","' + panelKey + '",' + 0 + ',"Delete Signal id: ' + row.id + ' And trade symbol is' + row.trade_symbol + ' And strategy tag is : ' + row.strategy + ' And Prize is :' + row.price + '"' },

            }).then(function (response) {
                console.log("response", response);
            })


            axios({
                method: "post",
                url: `${allPanelConfig}superadmin/delete/signal`,
                data: {
                    panelKey: params_id.id,
                    row: row,
                    Superadmin_name: Superadmin_name
                },
                headers: {
                    //   'x-access-token': admin_token
                }
            }).then(function (response) {
                if (response) {
                    setRefresh(!refresh);
                }
            })
        }
    }


    const getUndoSignals = () => {

        axios({
            method: "post",
            url: `${allPanelConfig}superadmin/getundo/signals`,
            data: {
                Superadmin_name: Superadmin_name,
                panelKey: params_id.id,
            },
            headers: {
                // 'x-access-token': admin_token
            }

        }).then((response) => {
            if (response) {
                // console.log("response", response.data.signals);
                setUndoSignals(response.data.signals)
                // setRefresh(!refresh);
            }
        });

    }

    const redoSignals = (row, id) => {

        if (window.confirm("Do you want to undo this Signal ?")) {


            axios({
                method: "post",
                url: `https://api.smartalgo.in:3001/superadmin/history-Create`,
                data: { data: '"' + Superadmin_name + '","' + panelKey + '",' + 0 + ',"Undo Delete Signal : ' + row.id + ' And trade symbol is' + row.trade_symbol + ' And strategy tag is : ' + row.strategy + ' And Prize is :' + row.price + '"' },

            }).then(function (response) {
                console.log("response", response);
            })

            axios({
                method: "post",
                url: `${allPanelConfig}superadmin/signal/undo`,
                data: {
                    Superadmin_name: Superadmin_name,
                    panelKey: params_id.id,
                    id: id
                },
                headers: {
                    // 'x-access-token': admin_token
                }

            }).then((response) => {
                if (response) {
                    setRefresh(!refresh);
                }
            });
        }

    }


    const Signals = async () => {
        setLoader(true)

        axios({
            method: "post",
            url: `${allPanelConfig}superadmin/signal`,
            data: {
                panelKey: params_id.id,
                symbol: fsymbol,
                strategy: fstrategy,
                segment: fsegment,
                todate: endDate != undefined ? endDate : "",
                fromdate: fromdate && fromdate1.toISOString(),
            },
            headers: {
                'x-access-token': admin_token
            }

        }).then((res1) => {
            // console.log("res1",res1);
            setChangePrices(res1.data.tradehistory)
            //  console.log('dsadsadsad' , res1.data.tradehistory[0].created_at);
            var rr = res1.data.tradehistory;

            if (params.get("active") == 1) {
                // console.log('okkkk');
                var act_sig_index = [];
                for (var i = 0; i < rr.length - 1; i++) {

                    if (rr[i].type == 'LE') {
                        if (rr[i].trade_symbol != rr[i + 1].trade_symbol) {
                            act_sig_index.push(i);
                        }
                    }
                    if (rr[i].type == 'SE') {
                        if (rr[i].trade_symbol != rr[i + 1].trade_symbol) {
                            act_sig_index.push(i);
                        }
                    }
                }
                if (rr[rr.length - 1].type == 'LE' || rr[rr.length - 1].type == 'SE') {
                    act_sig_index.push(rr.length - 1);
                }
                rr.map((cl, index) => {
                    if (act_sig_index.includes(index))
                        data.push({
                            signal_id: cl.signal_id,
                            // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
                            create_date: dateFormate(cl.created_at),
                            cat_name: cl.type,
                            trade_symbol: cl.trade_symbol,
                            msg: signalMsg(cl),
                            price: cl.price,
                            strategy: cl.strategy_tag,
                        })
                }
                );
            }
            else if (params.get("profit") == 1) {
                var profit_sig_index = [];
                for (var i = 0; i < rr.length - 1; i++) {

                    if (rr[i].trade_symbol == rr[i + 1].trade_symbol) {
                        if (rr[i].type == 'LE' && rr[i + 1].type == 'LX') {
                            if (rr[i + 1].price - rr[i].price > 0) {
                                profit_sig_index.push(i);
                                profit_sig_index.push(i + 1);
                            }
                        }

                        if (rr[i].type == 'SE' && rr[i + 1].type == 'SX') {

                            if (rr[i].price - rr[i + 1].price > 0) {
                                profit_sig_index.push(i);
                                profit_sig_index.push(i + 1);
                            }
                        }
                    }
                }
                rr.map((cl, index) => {
                    if (profit_sig_index.includes(index))
                        data.push({
                            signal_id: cl.signal_id,
                            // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
                            create_date: dateFormate(cl.created_at),
                            cat_name: cl.type,
                            trade_symbol: cl.trade_symbol,
                            msg: signalMsg(cl),
                            price: cl.price,
                            strategy: cl.strategy_tag,
                        })
                }
                );
            }
            else if (params.get("loss") == 1) {

                var loss_sig_index = [];
                for (var i = 0; i < rr.length - 1; i++) {
                    if (rr[i].trade_symbol == rr[i + 1].trade_symbol) {
                        if (rr[i].type == 'LE' && rr[i + 1].type == 'LX') {
                            if (rr[i + 1].price - rr[i].price < 0) {
                                loss_sig_index.push(i);
                                loss_sig_index.push(i + 1);
                            }
                        }

                        if (rr[i].type == 'SE' && rr[i + 1].type == 'SX') {

                            if (rr[i].price - rr[i + 1].price < 0) {
                                loss_sig_index.push(i);
                                loss_sig_index.push(i + 1);
                            }
                        }
                    }
                }
                rr.map((cl, index) => {
                    if (loss_sig_index.includes(index))
                        data.push({
                            signal_id: cl.signal_id,
                            // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
                            create_date: dateFormate(cl.created_at),
                            cat_name: cl.type,
                            trade_symbol: cl.trade_symbol,
                            msg: signalMsg(cl),
                            price: cl.price,
                            strategy: cl.strategy_tag,
                        })
                }
                );

            }
            else if (params.get("active") != 1) {
                // console.log('if param null');
                rr.map((cl, i) =>
                    data.push({
                        // id: i + 1,
                        id: cl.id,
                        signal_id: cl.signal_id,
                        // create_date: new Date(cl.created_at).toISOString().substring(0, 10),
                        create_date: dateFormate(cl.created_at),
                        // cat_name: cl.type,
                        cat_name: cl.type,
                        trade_symbol: cl.trade_symbol,
                        msg: signalMsg(cl),
                        price: cl.price,
                        strategy: cl.strategy_tag,
                    })
                );
            }
            setSignals(rr);
            settableData({
                columns,
                data,
            });
            setLoader(false)
        });

        // axios({
        //     method: "get",
        //     url: `${Config.base_url}smartalgo/symbolsgroup`,
        //     data: {},
        //     headers: {
        //         'x-access-token': admin_token
        //     }
        // }).then((res1) => {
        //     setSymbol_filter(res1.data.symbols);
        //     setLoader(false)

        // });
        axios({
            method: "get",
            url: `${Config.base_url}smartalgo/category`,
            data: {},
            headers: {
                'x-access-token': admin_token
            }
        }).then((res1) => {
            setSegment_filter(res1.data.category);
            setLoader(false)
        });

        // axios({
        //     method: "get",
        //     url: `${Config.base_url}smartalgo/strategygroup`,
        //     data: {},
        //     headers: {
        //         'x-access-token': admin_token
        //     }
        // }).then((res1) => {
        //     setStrategy_filter(res1.data.strategy);
        //     setLoader(false)
        // });
    };

    const signalMsg = (data) => {
        if (data.type === "LX") {
            return `Buy Trade Exit At `;
        }
        if (data.type === "LE") {
            return `Buy Trade Executed At `;
        }
        if (data.type === "SX") {
            return `Sell Trade Exit At `;
        }
        if (data.type === "SE") {
            return `Sell Trade Executed At `;
        }
    };

    const filterchange = useCallback((e) => {
        if (e.target.name == "symbolname") {
            setFsymbol(e.target.value);
        }
        if (e.target.name == "strategyname") {
            setFstrategy(e.target.value);
        }
        if (e.target.name == "segmentname") {
            setFsegmnet(e.target.value);
        }
    });

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    if (window.location.search != qrefresh) {
        Signals();
        setQrefresh(window.location.search);
    }
    useEffect(() => {
        Signals();
        getUndoSignals()
    }, [fsymbol, fsegment, fstrategy, todate, fromdate, refresh, endDate]);

    const resetFilters = () => {
        setFsymbol("");
        setFstrategy("");
        setFsegmnet("");
        setTodate("");
        setFromdate("")
    }

    const conditionalRowStyles = [
        {
            when: row => row.cat_name.includes(symbolColors),
            style: row => ({ backgroundColor: row.cat_name ? '#8AFFFF' : 'pink' }),
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
                overflow: 'visible !important',
            },
        },
        rows: {
            style: {
                overflow: 'visible !important',
                // justifyContent: 'center !important',
            },
        },
        cells: {
            style: {
                overflow: 'visible !important',
                justifyContent: 'center !important',
            },
        },
    };


    const refreshpage = () => {
        setRefresh(!refresh)
        navigate('/admin/signals')
        // /admin/reports
    }

    return (
        <>
            <div className="content">
                <div className="row">
                    <Backdrop
                        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loader}
                    // onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Signals</h4>
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <button className="btn btn-success" onClick={updatePrices}>Update</button>
                                        <ExportToExcel
                                            className="export-btn btn-color ms-auto d-flex"
                                            apiData={tableData && tableData.data}
                                            fileName={fileName}
                                            style={{ backgroundColor: "#f96332" }}
                                        />
                                        {/* <button className='btn btn-color' onClick={refreshpage} >Refresh</button> */}
                                    </div>

                                </div>
                            </div>
                            <div className="card-body top_spacing ">
                                <div className="row">
                                    <div className="col-md-2">
                                        <label style={{ fontWeight: "bold", color: "black" }}>
                                            SYMBOLS
                                        </label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => {
                                                filterchange(e);
                                            }}
                                            value={fsymbol}
                                            name="symbolname"
                                        >
                                            <option value="">ALL</option>
                                            {symbol_filter.map((sm, i) => (
                                                <option key={i} value={sm.symbol}>{sm.symbol}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label style={{ fontWeight: "bold", color: "black" }}>
                                            SEGMENT
                                        </label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => {
                                                filterchange(e);
                                            }}
                                            value={fsegment}
                                            name="segmentname"
                                        >
                                            <option value="">All</option>
                                            {segment_filter.map((sm, i) => (
                                                <option key={i} value={sm.segment}>{sm.name}</option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="col-md-2">
                                        <label style={{ fontWeight: "bold", color: "black" }}>
                                            STRAT
                                        </label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => {
                                                filterchange(e);
                                            }}
                                            value={fstrategy}
                                            name="strategyname"
                                        >
                                            <option value="">All</option>
                                            {strategy_filter.map((sm, i) => (
                                                <option key={i} value={sm.name}>
                                                    {sm.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <button className="btn btn-color" onClick={resetFilters} >
                                            Reset
                                        </button>
                                    </div>


                                    <div className="col-md-2">
                                        <label style={{ fontWeight: 'bold', color: 'black' }}>From Date</label>
                                        <input type="date" value={fromdate} name="fromdatename" onChange={(e) => { setEndDate(e.target.value) }} className="form-control" />
                                    </div>



                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="table-responsive my-4">
                                        <DataTableExtensions {...tableData}
                                            export={false}
                                            print={false}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                columns={columns}
                                                data={signals}
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                customStyles={customStyles}
                                                // conditionalRowStyles={conditionalRowStyles}
                                                highlightOnHover
                                                paginationRowsPerPageOptions={[10, 50, 100]}
                                                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}

                                            />
                                        </DataTableExtensions>
                                    </div>

                                </div>

                                <div className="col-md-6">
                                    <h4 className="card-title">Deleted Signals</h4>
                                </div>

                                <div className="row d-flex justify-content-end">
                                    <div className="table-responsive my-4">
                                        <DataTableExtensions
                                            export={false}
                                            print={false}
                                            columns={columnsUndo}
                                            data={undoSignals && undoSignals}
                                        >
                                            <DataTable
                                                fixedHeader
                                                fixedHeaderScrollHeight="700px"
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                customStyles={customStyles}
                                                // conditionalRowStyles={conditionalRowStyles}
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
        </>
    );
};

export default SuperSignalsEdit;


// import React, { useEffect, useState, useCallback } from "react";
// import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
// import axios from "axios";
// import * as Config from "../common/Config";


// const SuperSignalsEdit = () => {

//     const params_id = useParams()

//     const getEditSignals = () => {
//         axios({
//             method: "post",
//             url: `${Config.base_url}smartalgo/signal`,
//             data: {
//                 panelKey: params_id.id,
//             },
//         }).then(function (response) {

//             console.log("responsesignals", response.data.tradehistory);

//         })
//     }

//     useEffect(() => {
//         getEditSignals()
//     }, [])


//     return (
//         <div>SuperSignalsEdit</div>
//     )
// }

// export default SuperSignalsEdit