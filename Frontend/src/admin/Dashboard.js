import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import * as Config from "../common/Config";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { objectOf } from "prop-types";


const Dashboard = () => {

  const [total_live_account, setTotal_live_account] = useState(0);
  const [active_live_account, setActive_live_account] = useState(0);
  const [expired_live_account, setExpired_live_account] = useState(0);
  const [total_demo_account, setTotal_demo_account] = useState(0);
  const [active_demo_account, setActive_demo_account] = useState(0);
  const [expired_demo_account, setExpired_demo_account] = useState(0);

  const [total_license, setTotal_license] = useState(0);
  const [used_license, setUsed_license] = useState(0);
  const [remaining_license, setRemaining_license] = useState(0);

  const [total_todayservice, settotal_todayservice] = useState(0);
  const [active_todayservice, setactive_todayservice] = useState(0);
  const [expire_todayservice, setexpire_todayservice] = useState(0);
  const [converted_todayservice, setconverted_todayservice] = useState(0);

  // console.log("two day",converted_todayservice);

  const [active_signals, setActivesignals] = useState(0);
  const [target_profit, setTargetprofit] = useState(0);
  const [target_loss, setTargetloss] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  // console.log("active_live_account" ,active_live_account);

  useEffect(() => {
    setLoader(true)

    axios.get(`${Config.base_url}admin/dashboard`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then(res => {

      setTotal_live_account(res.data.msg.total_live_account);
      setActive_live_account(res.data.msg.active_live_account);
      setExpired_live_account(res.data.msg.expired_live_account);

      setTotal_demo_account(res.data.msg.total_demo_account);
      setActive_demo_account(res.data.msg.active_demo_account);
      setExpired_demo_account(res.data.msg.expired_demo_account);

      setTotal_license(res.data.msg.total_license);
      setUsed_license(res.data.msg.used_license);
      setRemaining_license(res.data.msg.total_license - res.data.msg.used_license);

      settotal_todayservice(res.data.msg.total_todayservice)
      setactive_todayservice(res.data.msg.active_todayservice)
      setexpire_todayservice(res.data.msg.expire_todayservice)

      setconverted_todayservice(res.data.msg.expire_todayservice)
      setLoader(false)

    });

    // axios.get(`${Config.base_url}dashboard/signals`, {
    //   headers: {
    //     'x-access-token': admin_token
    //   }, data: {}
    // }).then(res => {
    //   const signals = res.data.signals;
    //   var profit = 0;
    //   var loss = 0;
    //   for (var i = 0; i < signals.length - 1; i++) {

    //     if (signals[i].trade_symbol == signals[i + 1].trade_symbol) {

    //       if (signals[i].type == 'LE' && signals[i + 1].type == 'LX') {

    //         if (signals[i + 1].price - signals[i].price > 0) {
    //           profit++;
    //         } else {
    //           loss++;
    //         }
    //       }

    //       if (signals[i].type == 'SE' && signals[i + 1].type == 'SX') {

    //         if (signals[i].price - signals[i + 1].price > 0) {
    //           profit++;
    //         } else {
    //           loss++;
    //         }
    //       }
    //     }
    //   }

    //   setTargetprofit(profit);
    //   setTargetloss(loss);
    //   var act_sig = 0;
    //   for (var i = 0; i < signals.length - 1; i++) {

    //     if (signals[i].type == 'LE') {
    //       if (signals[i].trade_symbol != signals[i + 1].trade_symbol) {
    //         act_sig++;
    //       }
    //     }
    //     if (signals[i].type == 'SE') {
    //       if (signals[i].trade_symbol != signals[i + 1].trade_symbol) {
    //         act_sig++;
    //       }
    //     }
    //   }
    //   if (signals.length > 0) {
    //     if (signals[signals.length - 1].type == 'LE' || signals[signals.length - 1].type == 'SE') {
    //       act_sig++;
    //     }
    //   }
    //   setActivesignals(act_sig);
    //   setLoader(false)
    // });
  }, []);

  const navigate = useNavigate()

  // const refreshChanges = () =>{
  //   setRefresh(!refresh)
  //   navigate('/admin/dashboard')
  // }



  return (
    <>
      <div className="content">
        <div className="row">
          <Backdrop
            sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <div className="col-lg-3 col-sm-4 ">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 d-inline-block text-dark">{total_live_account}</h5>
                <h4 className="card-title">Total Live Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?live=1" >
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-lg-3 col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{total_demo_account}</h5>
                <h4 className="card-title">Total Demo Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?demo=1">
                    <i className="now-ui-icons arrows-1_share-66"> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{total_license}</h5>
                <h4 className="card-title">Total Licence</h4>
              </div>

              {/* <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <i className="now-ui-icons arrows-1_share-66 "></i> View
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-3 col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{total_todayservice}</h5>
                <h4 className="card-title">Total 2 Day Service</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?two_dayTotal=4">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* <div className="row"> */}
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{active_live_account}</h5>
                <h4 className="card-title">Active Live Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?active_live=1">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{active_demo_account}</h5>
                <h4 className="card-title">Active Demo Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?active_demo=1">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{total_license - used_license}</h5>
                <h4 className="card-title">Remaining Licence</h4>
              </div>

              {/* <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <i className="now-ui-icons arrows-1_share-66 "></i> View
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{active_todayservice}</h5>
                <h4 className="card-title">Total Active 2 Day Service</h4>
              </div>


              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?two_dayActive=5">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* <div className="row"> */}
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{expired_live_account}</h5>
                <h4 className="card-title">Expired Live Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?expired_live=1">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{expired_demo_account}</h5>
                <h4 className="card-title">Expired Demo Account</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?expired_demo=1">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{used_license}</h5>
                <h4 className="card-title">Used Licence</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/transactionlicence">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3  col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{expire_todayservice}</h5>
                <h4 className="card-title">Total Converted Accounts</h4>
              </div>

              <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?Converted=3">
                    <i className="now-ui-icons arrows-1_share-66"> View</i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
