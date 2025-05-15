import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { Form } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import { dateFormate } from "../common/CommonDateFormate";
import * as Config from '../common/Config';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Signals() {
  const [signals, setSignals] = useState([]);
  const [filtersymbol, setFiltersymbol] = useState([]);
  const [filtersegment, setFiltersegment] = useState([]);
  const [fsymbol, setFsymbol] = useState("");
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [fsegment, setFsegmnet] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [loader, setLoader] = useState(false);

  const client_token = localStorage.getItem('client_token');
  var user_id = localStorage.getItem('client_id')
  var data_array = [];
  var updatedata_array = [];
  const location = useLocation();


  useEffect(() => {
    setLoader(true)
    runapi();

  }, [fsymbol, fsegment, todate, fromdate]);

  const runapi = () => {
    axios({
      url: `${Config.base_url}client/signals`,
      method: 'post',
      data: {
        client_id: user_id,
        symbol: fsymbol,
        segment: fsegment,
        todate: todate,
        fromdate: fromdate,
      },
      headers: {
        'x-access-token': client_token
       }
    }).then(res => {
      setSignals(res.data.signals);
      setLoader(false)
    });
  }

  useEffect(() => {
    setLoader(true)
    var services = [];
    axios({
      url: `${Config.base_url}client/symbols`,
      method: 'post',
      data: {
        client_id: user_id,
      },
      headers: {
        'x-access-token': client_token
       }
    }).then(res => {
      setFiltersymbol(res.data.symbols);
      setLoader(false)
    });

    axios({
      url: `${Config.base_url}client/services`,
      method: 'post',
      data: {
        client_id: user_id,
      },
      headers: {
        'x-access-token': client_token
       }
    }).then(res => {

      services = res.data.services;
      setLoader(false)
    });

    axios({
      method: 'get',
      url: `${Config.base_url}smartalgo/category`,
      data:{},
      headers: {
        'x-access-token': client_token
       }
    }).then(res => {

      setFiltersegment(res.data.category);
      setLoader(false)
    });

    // const socket = socketIOClient(`${Config.broker_url}`);
    // socket.on("refreshscreen", data => {

    //   const matched_services = services.filter(function (item) {

    //     return item.segment == data.segment && item.ser_name == data.symbol && item.strategy == data.strategy
    //   });

    //   if (matched_services.length > 0) {
    //     runapi();
    //   }

    // });


  }, [])
  const filterchange = (e) => {
    if (e.target.name == "symbolname") {
      setFsymbol(e.target.value);
    }

    if (e.target.name == "segmentname") {
      setFsegmnet(e.target.value);
    }
    if (e.target.name == "todatename") {
      setTodate(e.target.value);
    }
    if (e.target.name == "fromdatename") {
      setFromdate(e.target.value);
    }
  };

  const signalMsg = (data) => {
    if (data.type === "LX") {
      return `Buy Trade Exit At ${data.price}`;
    }
    if (data.type === "LE") {
      return `Buy Trade Executed At ${data.price}`;
    }
    if (data.type === "SX") {
      return `Sell Trade Exit At ${data.price}`;
    }
    if (data.type === "SE") {
      return `Sell Trade Executed At ${data.price}`;
    }
  };
  return (
    <>
      <Backdrop
        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Signals</h4>
              </div>

              {/* {(location.state === null) &&
            <NavLink to='/admin/clients'> <button type="button" className="btn btn-dark ms-4">Go to Admin</button></NavLink>} */}

              <div className="card-body">
                <div className="row trade-space">
                  <div className="col-md-3">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>Symbol</label>
                    <select value={fsymbol} onChange={(e) => { filterchange(e) }} className="form-control" name="symbolname">
                      <option value="">All</option>
                      {
                      filtersymbol &&  filtersymbol.map((item, index) =>
                          <option key={index}>{item.client_service}</option>
                        )
                      }
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label style={{ fontWeight: 'bold', color: 'black' }}>Segment</label>
                    <select value={fsegment} onChange={(e) => { filterchange(e) }} className="form-control" name="segmentname">
                      <option value="">All</option>
                      {
                    filtersegment &&  filtersegment.map((item, index) =>
                          <option value={item.segment} key={index}>{item.name}</option>
                        )
                      }
                    </select>
                  </div>
                  {/* <div className="col-md-3"><label style={{ fontWeight: 'bold', color: 'black' }}>From Date</label><input type="date" onChange={(e) => { filterchange(e) }} name="fromdatename" className="form-control" value={fromdate} /></div>
                  <div className="col-md-3"><label style={{ fontWeight: 'bold', color: 'black' }}>End Date</label><input type="date" onChange={(e) => { filterchange(e) }} name="todatename" className="form-control" value={todate} /></div> */}

                </div>
                <div className="table-responsive">
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr>
                        <th scope="col" className="text-center">SIGNALS ID</th>
                        <th scope="col" className="text-center">SIGNALS TIME</th>
                        {/* <th scope="col" className="text-center">TO DATE</th> */}
                        <th scope="col" className="text-center">CATEGORY</th>
                        <th scope="col" className="text-center">TRADE SYMBOL</th>
                        <th scope="col" className="text-center">MESSAGE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signals && signals.map((item, index) =>

                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{dateFormate(item.created_at)}</td>
                          {/* <td className="text-center">{dateFormate(item.created_at)}</td> */}
                          <td className="text-center">{item.cat_name}</td>
                          <td className="text-center">{item.trade_symbol}</td>
                          <td className="text-center">{signalMsg(item)}</td>
                        </tr>
                      )
                      }
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Signals;