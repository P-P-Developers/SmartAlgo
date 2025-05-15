import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import AlertToast from "../common/AlertToast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Strategy() {

  const [tableData, settableData] = useState();
  // console.log("tableData" ,tableData);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [show, setShow] = useState(false);
  const [showStratClient, setShowStratClient] = useState([]);
  // console.log("showStratClient", showStratClient);


  const handleClose = () => setShow(false);

  const [rerender, setRerender] = useState(false)
  const fileName = "Strategy";
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const columns = [
    {
      name: <h6>NO</h6>,
      selector: (row) => row.no,
      width: '270px !important',
    },
    {
      name: <h6>Strategy Name</h6>,
      selector: (row) => row.name,
      width: '220px !important',
    },
    // {
    //   name: <h6>Quantity</h6>,
    //   selector: (row) => row.quantity,
    //   width: '200px !important',
    // },
    {
      name: <h6>Actions</h6>,
      width: '450px !important',
      cell: (row) => (
        <>
          {row.id == 1 ? ' ' : (<>
            <i
              className="fa fa-users fs-5 edit_hover "
              variant="primary"
              data-toggle="tooltip"
              data-placement="top"
              title="Stratagy ClientList "
              onClick={() => ShowStrategyClient(row.name)}
            ></i>
            <NavLink
              to={"/admin/edit-strategy/" + row.id}
            >
              <i
                className="fa-solid fa-pen-to-square fs-5  mx-3 edit_hover "
                variant="primary"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              ></i>

            </NavLink>
            <i
              className="fa-solid fa-trash fs-5  hover me-3 "
              data-toggle="tooltip"
              data-placement="top"
              title="Delete"
              onClick={() => onShowClick(row)}
            ></i>

            <NavLink
              to={"/admin/add-strategy-toclients/" + row.id}
              className="btn-block"
            >
              <i class="fa-solid fa-square-plus fa-2x mx-1 addhover" data-toggle="tooltip"
                data-placement="top"
                title="add Strategy to client"></i>
            </NavLink>
          </>)}
        </>
      ),
      allowOverflow: true,
      button: true,
    },
  ];

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const customStyles = {
    headCells: {
      style: {
        width: '100% !important',
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'center !important',
      },
    },
    rows: {
      style: {
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


  const ShowStrategyClient = (statname) => {
    setShow(true)
    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/clientlist`,
      data: {
        'strategy_name': statname
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      setShowStratClient(response.data.data);
    })
  }


  const onShowClick = (row) => {
    if (window.confirm("Do you want to delete this strategy ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}admin/strategy/delete`,
        data: {
          'adminId': adminId,
          id: row.id,
          name: row.name
        },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {
        if (response.data.status === 'strtegy_error') {
          setShowAlert(true)
          setAlertColor('error');
          setTextAlert(response.data.msg);
        } else {
          setShowAlert(true)
          setAlertColor('success');
          setTextAlert(response.data.msg);
          setRerender(!rerender)
        }
      });
    }
  };

  useEffect(() => {
    setLoader(true);
    axios.get(`${Config.base_url}admin/strategy`, {
      headers: {
        'x-access-token': admin_token
      },
      data: {}
    }).then((res) => {
      var data = [];
      res.data.strategy.map((cat, index) =>
        data.push({ no: index + 1, name: cat.name, id: cat.id , quantity :cat.quantity})
      );

      settableData({
        columns,
        data,
      });
      setLoader(false);
    });
  }, [rerender]);




  const customStyles1 = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
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
          <Backdrop
            sx={{
              color: "#000000",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Strategy</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <NavLink
                      to="/admin/add-strategy/"
                      className="btn  btn-color"
                      style={{ marginBottom: "-18px" }}
                    >
                      Add Strategy
                    </NavLink>
                    <NavLink
                      to="/admin/strategydevelopment"
                      className="btn btn-color"
                      style={{ marginBottom: "-18px" }}
                    >
                      Requested Strategies
                    </NavLink>
                  </div>
                  {/* <div className="col-md-6 mb-3">
                    
                  </div> */}
                  <div className="col-md-3"></div>
                  {/* <div className="col-md-3 export-btn d-flex justify-content-center">
                    <ExportToExcel
                      className="export-btn"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                    />
                  </div> */}
                </div>
              </div>

              <div className="row d-flex justify-content-end mx-auto">
                <div className="card-body mx-auto">
                  <div className="table-responsive mx-auto">
                    <DataTableExtensions
                      {...tableData}
                      export={false}
                      print={false}
                    >
                      <DataTable
                        columns={columns}
                        fixedHeader
                        fixedHeaderScrollHeight="700px"
                        noHeader
                        defaultSortField="id"
                        style
                        defaultSortAsc={false}
                        pagination
                        customStyles={customStyles}
                        highlightOnHover
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                      />
                    </DataTableExtensions>
                  </div>
                </div>
              </div>
            </div>
            <>              
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Strategy ClientList </Modal.Title>
              </Modal.Header>
              <Modal.Body><>
                <DataTable
                  columns={[
                    {
                      name: <h6>id</h6>,
                      selector: (row, index) => index + 1,
                    },
                    {
                      name: <h6>Username</h6>,
                      selector: (row) => row.username,
                    },
                    {
                      name: <h6>License Type</h6>,
                      selector: (row) => row.licence_type == 1 ? "Demo" : "Live",
                    },
                  ]}
                  data={showStratClient && showStratClient}
                  fixedHeader
                  fixedHeaderScrollHeight="300px"
                  defaultSortField="id"
                  defaultSortAsc={false}
                  pagination
                  highlightOnHover
                  customStyles={customStyles1}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  paginationComponentOptions={{
                    selectAllRowsItem: true,
                    selectAllRowsItemText: "All",
                  }}
                />
              </></Modal.Body>

            </Modal>
            </>
          </div>
          {showAlert &&
            <AlertToast
              hideAlert={onAlertClose}
              showAlert={showAlert}
              message={textAlert}
              alertColor={alertColor}
            />
          }
        </div>
      </div>
    </>
  );
}
