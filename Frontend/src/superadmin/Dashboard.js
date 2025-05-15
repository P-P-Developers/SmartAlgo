import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import * as Config from "../common/Config";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { objectOf } from "prop-types";




const Dashboard = () => {
  // console.log("TOTAL_PANALS",TOTAL_PANALS);

  const [TOTAL_PANALS, setTOTAL_PANALS] = useState(0);
  const [ACTIVE_PANALS, setACTIVE_PANALS] = useState(0);
  const [DEACTIVE_PANALS, setDEACTIVE_PANALS] = useState(0);

  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate()


  useEffect(() => {
    axios.get(`${Config.base_url}superadmin/dashboard`, {
    }).then((res) => {
      // console.log("hellosuper", res.data.data)
  
      setTOTAL_PANALS(res.data.data.TOTAL_PANALS)
      setACTIVE_PANALS(res.data.data.ACTIVE_PANALS)
      setDEACTIVE_PANALS(res.data.data.DEACTIVE_PANALS)
    });

  }, []);

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
                <h5 className="card-category fs-1 fw-2 d-inline-block text-dark"> {TOTAL_PANALS}</h5>
                <h4 className="card-title">TOTAL PANEL</h4>
              </div>

              {/* <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?live=1" >
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div> */}
            </div>
          </div>
          <div className=" col-lg-3 col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{ACTIVE_PANALS}</h5>
                <h4 className="card-title">TOTAL ACTIVE PANEL</h4>
              </div>

              {/* <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <NavLink to="/admin/reports?demo=1">
                    <i className="now-ui-icons arrows-1_share-66 "> View</i>
                  </NavLink>
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-3 col-sm-4">
            <div className="card card-chart hover-card">
              <div className="card-header">
                <h5 className="card-category fs-1 fw-2 text-dark">{DEACTIVE_PANALS}</h5>
                <h4 className="card-title">TOTAL DEACIVE PANEL</h4>
              </div>

              {/* <div className="card-footer">
                <div className="stats" style={{ position: 'absolute', bottom: '21px' }}>
                  <i className="now-ui-icons arrows-1_share-66 "></i> View
                </div>
              </div> */}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
