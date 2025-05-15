import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams, Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Radio from '@mui/material/Radio';
import * as Config from "../common/Config";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from "@mui/material/CircularProgress";
import ExportToExcel from "../common/ExportToExport";
import { Form } from "react-bootstrap";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../../src/common/AlertToast";
import download from 'js-file-download';
import { dateFormate } from "../common/CommonDateFormate";

const ManualTradeExecution = () => {

    const admin_token = localStorage.getItem("token");



  return (
    <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Manual Trade Execution</h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                    </div>
                                    <div className="col-md-3"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default ManualTradeExecution