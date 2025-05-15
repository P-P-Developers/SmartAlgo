import React, {useState, useEffect}from 'react'
import { useParams, useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import axios from 'axios';
import * as Config from '../common/Config';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";



const SuperAdminHelpCentre = () => {
  const [help, setHelp] = useState([]);

  const columns = [
    {
      name: "Username",
      selector: (row) => row.client_username,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: '200px !important',
    },
    {
      name: "Mobile",
      selector: (row) => row.client_mobile,
    },
    {
      name: "Message",
      selector: (row) => row.help_message,
    },
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
    
  const location = useLocation();
  console.log("Location", location.state[2].singal_build);

  var panelURL 

  if(location.state[2].singal_build == '0'){
    panelURL = `https://${location.state[0].url}:${location.state[1].port}/`;
  }else{
    panelURL = `https://${location.state[0].url}/backend/`; 
  }




  // console.log("urlport", panelURL)
  
  // https://api.smartalgo.in:3001/
  // const allPanelURL = `https://${location.state.url}`

  
  const superHelpData = () =>{
    axios.get(`${panelURL}superadmin/help-center/msg`).then((response) => {
      console.log("Data", response.data.data);
      setHelp(response.data.data);
    })
  }
  useEffect(() => {
    superHelpData()
  }, []);

  
  return (
    <div className="content">
      <div className="row" style={{ marginTop: "-25px", height: '80vh' }}>
        <div className="col-md-12">
          <div className="card" style={{ height: '85vh', overflowY: 'scroll', overflowX: 'hidden' }}>
            <div className="card-header">
              <div className="row">
                <div className="col-md-6 ">
                  <h4 className="card-title mx-3">Help Centre</h4>
                </div>
              </div>
              <div className="table-responsive">
                                            <DataTableExtensions
                                                columns={columns}
                                                data={help}
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
            </div>
            <div className="card-body">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminHelpCentre;