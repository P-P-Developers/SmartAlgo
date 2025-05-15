import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import * as Config from "../common/Config";
import DataTable from "react-data-table-component";
import { dateFormate } from "../common/CommonDateFormate";
import DataTableExtensions from "react-data-table-component-extensions";
import { Form, Button } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExportToExcel from '../common/ExportToExport';

const SuperAdminMessageBroadcast = () => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 class="card-title">Message</h4>
                </div>
                <div className="col-md-3"></div>
                {/* <div className="col-md-3 sbtn d-flex justify-content-center">
                    <ExportToExcel
                      className="export-btn"
                      apiData={tableData && tableData.data}
                      fileName={fileName}
                    />
                  </div> */}
              </div>
            </div>
            <div className="card-body">
              {/* <div className="col-md-2">
                <label style={{ fontWeight: "bold", color: "black" }}>
                  Strategy
                </label>
                <select
                  className="form-control"
                  name="strategyname"
                >
                  <option value='all' style={{ textTransform: 'lowercase' }}>all</option> */}
              {/* {strategy_filter.map((sm, i) => (
                      <option value={sm.name}>{sm.name}</option>
                    ))} */}
              {/* </select>

              </div> */}
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control as="textarea" rows={5}
                    style={{ height: '200px', width: '100%' }}
                    componentClass="textarea"
                    name='msgtext'
                    className="textarea-message"
                    placeholder="Your Message"
                  />
                </Form.Group>
              </Form>

              <Button variant="btn mb-5"
                className='btn-color'
              >Send</Button>

              <div className="row d-flex justify-content-end">
                <div className="table-responsive">
                  <DataTableExtensions
                    //   {...tableData}
                    export={false}
                    print={false}
                  >
                    <DataTable
                      // columns={columns}
                      // data={sendedMsg}
                      noHeader
                      fixedHeader
                      fixedHeaderScrollHeight="700px"
                      defaultSortField="id"
                      defaultSortAsc={false}
                      pagination
                      // customStyles={customStyles}
                      paginationRowsPerPageOptions={[10, 50, 100]}
                      paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                      highlightOnHover
                    />
                  </DataTableExtensions>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminMessageBroadcast