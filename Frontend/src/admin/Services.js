import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from '../common/Config';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';


function Services() {
  const columns = [
    {
      name: <h6>S No.</h6>,
      selector: row => row.sno,
    },
    {
      name: <h6>Category</h6>,
      selector: row => row.category,
    },
    {
      name: <h6>Services</h6>,
      selector: row => row.service,
    }

  ];

  var data = [];
  const [services, setServices] = useState([]);
  const [cat_id, setCat_id] = useState('');
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);

  const [tableData, settableData] = useState({
    columns,
    services
  });
  const fileName = "Services";

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  

  useEffect(() => {
   

    setLoader(true)
    var i = 0;
    axios({
      method: "post",
      data: {
        'adminId': adminId,  'cat_id': cat_id,
      },
      url: `${Config.base_url}services`,
      headers: {
        'x-access-token': admin_token
      }
    }).then(res => {
      res.data.services.map(cat =>
        data.push({ 'category': cat.name, 'service': cat.service, 'id': cat.id ,sno:++i, })
      );

      setServices(data);
      settableData({
        columns,
        data
      });
      setLoader(false)

    });

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/category`,
      data:{},
      headers: {
        'x-access-token': admin_token
      }
    }).then(res => {
      setCategories(res.data.category);
      setLoader(false)

    });

  }, [cat_id]);

  const changeCategory = (e) => {
    setCat_id(e.target.value);
  }


  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
      backgroundColor: '#000',
	color:'#fff',

        justifyContent: 'center !important',

      },
    },
    rows: {
      style: {
        // overflow:'visible !important', 
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

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <Backdrop
              sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loader}
            // onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <div className="card">
              <div className="row">
                <div className="col-md-9">

                </div>

                <div className="card-header" style={{ padding: "15px 35px 0" }}>
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="card-title">Services</h4>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 pr-1">
                      <div className="form-group">
                        <label className='text-dark ms-3' style={{ fontSize: '14px' }}>Category</label>
                        <select className="form-control" value={cat_id} onChange={(e) => changeCategory(e)}>
                          <option value="">All</option>
                          {
                            categories.map((res, i) =>
                              <option key={i} value={res.id}>{res.name}</option>
                            )
                          }
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex flex-grow-1"></div>
                    {/* <div className="col-md-3 mt-2 export-btn d-flex justify-content-end">
                  <ExportToExcel
                        className="export-btn"
                        apiData={tableData && tableData.data}
                        fileName={fileName}
                      />
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="row d-flex justify-content-end">
                <div className="card-body">
                  <div className="table-responsive">
                    <DataTableExtensions {...tableData}
                      export={false}
                      print={false}
                    >
                      <DataTable
                        fixedHeader
                        
                        fixedHeaderScrollHeight="700px"
                        columns={columns}
                        customStyles={customStyles}
                        noHeader
                        pagination
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

        <div className="modal fade" id="addservice" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title"></h4>
              </div>
              <div className="modal-body">
                <p>This is a large modal</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
export default Services;