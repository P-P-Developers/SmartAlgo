import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import * as Config from '../common/Config';

function Footer() {

  const [footerClientDetails, setFooterClientDetails] = useState("");
 
  useEffect(() => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
      data:{},
   
    }).then(function (response) {
      setFooterClientDetails(response.data.data)
    });
  }, [])

  return (
    <>
<footer className="footer">
        <div className=" container-fluid ">
        <div className="row">
        <div className="col-md-6">
          <div className="ms-4">
          <b>Copyright © 2021-{new Date().getFullYear()} </b>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
          {footerClientDetails && footerClientDetails[0].name}</NavLink> <b>.All Rights Reserved.&#8482;</b>
        </div>
        </div>

        <div className="col-md-6">
          <div className="copyright" id="copyright">
            &copy; <script>
              document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()))
            </script>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
            {footerClientDetails && footerClientDetails[0].name}</NavLink> <b>Client System</b>
          </div>
          </div>

           
        

        </div>
        </div>

        
      </footer>    
    </>
  );
}

export default Footer;