import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import * as Config from '../common/Config';


function Footer() {

  const [footerDetails, setFooterDetails] = useState("");


  useEffect(() => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
    }).then(function (response) {
      setFooterDetails(response.data.data)
    });
  }, [])

  return (
    <>
      <footer className="footer">
        <div className="container-fluid ">
        <div className="row">
        
          <div className ="col-md-6">
          <b>Copyright © 2021-{new Date().getFullYear()} </b>
          <NavLink to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          {footerDetails && footerDetails[0].name}</NavLink>  <b>. All Rights Reserved.</b>
        </div>

          <div className="col-md-6">
          <div className="copyright" id="copyright">
            &copy; <script>
              document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()))
            </script>
            <NavLink to="/admin/dashboard" style={{ textDecoration: 'none' }}>
               {footerDetails && footerDetails[0].name}</NavLink> <b>Admin System</b>
          </div>
        </div>
        

        </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

// Coded by <a href="https://www.creative-tim.com" target="_blank">Creative Tim</a>.