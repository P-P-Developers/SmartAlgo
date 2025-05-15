import React, { useRef, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import * as Config from "../common/Config";
import { IdleTimerProvider } from 'react-idle-timer';
import jwt_decode from "jwt-decode";
import './client.css'


// import './App.css';
function Template(props) {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("locatiiiion", location);

  const idelTimeRef = useRef(null)
  const client_id = localStorage.getItem("client_id");
  const roleId = localStorage.getItem("roleId");


  const isAuthenticated = localStorage.getItem('client_token');
  const fromadmin = 'fromadmin'
  const fromsubadmin = 'fromsubadmin'

  // var url = window.location.search;
  // const sliceUrl = url.split('=');
  // console.log("sliceUrl", window.location.href);

  // let searchParams = new URLSearchParams(window.location.search);
  // console.log(searchParams.get('id'));
  // const getUrlId = searchParams.get('id')

  // if (!isAuthenticated) {
  //       return <Navigate to="/login" />;
  //     }

  const logout = () => {
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("client_name");
    navigate("/login");
  };

  useEffect(() => {
    getLoginStatus()
  }, [])


  const getLoginStatus = (e) => {

    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/client/LoginStatusGet`,
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': isAuthenticated
      }
    }).then(function (response) {
      if (response) {
        // console.log("login", response);
        // console.log("resp",response.data.login_status.data[0])
        var loginStatus = response.data.login_status
        if (loginStatus == 0) {
          logout()
        }
      }
    });
  }

  if (location.state != null) {


    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/client/LoginStatusUpdate`,
      data: {
        client_id: location.state.user_id,
      },
      headers: {
        'x-access-token': isAuthenticated
      }
    }).then(function (response) {

      console.log("response" ,response);
      if (response) {
      }
    });
    localStorage.setItem("client_token", location.state.token);
    localStorage.setItem("client_id", location.state.user_id);
    localStorage.setItem("client_name", location.state.name);
    localStorage.setItem("from_admin", fromadmin);

    if (roleId == 4)
      localStorage.setItem("from_subadmin", fromsubadmin);
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    // setInterval(() => {
    //   getLoginStatus()
    //   // console.log("60000");
    // }, 6000);
  }


  const clientToken = localStorage.getItem('client_token');
  if (clientToken) {
    var decoded = jwt_decode(clientToken);
    if (decoded.exp * 1000 < new Date().getTime()) {
      console.log("Token Expired")
      logout()
    }
  }

  // useEffect(()=>{

  // },[])
  // goToDashboardSession()




  // Redirect data from Admin on New page

  // if (getUrlId != '') {
  //   // const goToDashboardSession = () => {
  //   console.log("getUrlId", getUrlId);
  //   axios({
  //     method: "get",
  //     url: `${Config.base_url}admin/client-dashboard/${getUrlId}`,
  //   }).then(function (response) {
  //     console.log("responsedata", response);
  //     localStorage.setItem("client_token", response.data.msg.token);
  //     localStorage.setItem("client_id", response.data.msg.user_id);
  //     localStorage.setItem("client_name", response.data.msg.name);
  //     // window.tabs.reload();
  //     // window.location.reload();
  //   }
  //   )
  //   // }
  // }
  // else {
  //   console.log("else")
  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" />;
  //   }


  //   const getLoginStatus = (e) => {

  //     axios({
  //       method: "post",
  //       url: `${Config.base_url}smartalgo/client/LoginStatusGet`,
  //       data: {
  //         client_id: client_id,
  //       },
  //       headers: {
  //         'x-access-token': isAuthenticated
  //       }
  //     }).then(function (response) {
  //       if (response) {
  //         // console.log("resp",response.data.login_status.data[0])
  //         var loginStatus = response.data.login_status
  //         if (loginStatus == 0) {
  //           logout()
  //         }
  //       }
  //     });
  //   }

  // }

  // const pageRefresh = () => {
  //   useEffect(()=>{
  //     window.location.reload()
  //   },[])
  // }





  return (
    <>
      <div className="wrapper ">
        {/* <withIdleTimer ref={idelTimeRef} timeout={1000} onIdle={getLoginStatus}   debounce={250}/> */}
        <IdleTimerProvider
          ref={idelTimeRef}
          timeout={1000}
        // onPrompt={onPrompt}
        // onIdle={getLoginStatus}
        // onActive={onActive}
        // onAction={onAction}
        >
          <Sidebar />
          <div className="main-panel" id="main-panel">
            <Header />
            {props.page}
            <Footer />
          </div>
        </IdleTimerProvider>
      </div>
    </>
  );
}

export default Template;