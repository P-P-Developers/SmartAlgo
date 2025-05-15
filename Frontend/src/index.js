import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PanelClosePage from "./PanelClose"
import reportWebVitals from './reportWebVitals';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/css/now-ui-dashboard.css?v=1.5.0';
import $ from 'jquery';



export default function IndexMain() {

  const [PanelClose, setPanelClose] = useState(1)

  const getStatus = async () => {
    let panelHostName = window.location.hostname
    let panelPort = window.location.port
    const req = {
      "host": panelHostName,
      "port": panelPort
    }

    axios.post("https://api.smartalgo.in:3001/superadmin/panal_close_status", req).then((res) => {

      if(res.data.data?.length > 0){
        setPanelClose(res.data.data[0].close_panel)
      }
      // 1 ===> panel close

      // setPanelClose(res.data.data.close_panel)
    }).catch((err) => {
      console.log("panal_close_status ====>", err);
    })
  }
  useEffect(() => {

    getStatus()
  }, [])





  return <>
    {
      PanelClose && PanelClose === 1 || PanelClose && PanelClose === "1" ?
        <App /> : <PanelClosePage />
    }
  </>
}


ReactDOM.render(
  < React.StrictMode >
    <IndexMain />
  </React.StrictMode >,
  document.getElementById('root')
);

reportWebVitals();
