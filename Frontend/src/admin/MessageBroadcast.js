import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import * as Config from "../common/Config";
import { Form, Button } from 'react-bootstrap'
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useForm } from "react-hook-form";
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';
import ExportToExcel from '../common/ExportToExport';
import { dateFormate } from "../common/CommonDateFormate";



const Messagebroadcast = () => {
  const fileName = "MessageBroadcast";

  // const columns = [
  //   {
  //     name: "No.",
  //     selector: (row) => row.no,
  //   },
  //   {
  //     name: "Message",
  //     selector: (row) => row.message,
  //   },
  //   {
  //     name: "Strategy Users",
  //     selector: (row) => row.strategy_users,
  //   },
  //   {
  //     name: "Time",
  //     selector: (row) => row.time,
  //   },

  //   {
  //     name: "Action",
  //     selector: (row) => row.action,
  //   }
  // ];

  const columns = [
    {
      name: "No.",
      selector: (row, index) => index + 1,
    },
    {
      name: "Message",
      selector: (row) => row.message,
    },
    {
      name: "Strategy Users",
      selector: (row) => row.strategy,
    },
    {
      name: "Time",
      selector: (row) => dateFormate(row.created_at),
    },

    {
      name: <h6>Actions</h6>,
      cell: (row) => (
        // console.log("row", row)
        <>
          <i
            className={row.licencetype === "Live" ? 'fa-solid fa-trash fs-5 hover d-none' : "fa-solid fa-trash  fs-5  hover "}
            data-toggle="tooltip"
            data-placement="top"
            title="Delete Client"
            onClick={() => onShowClick(row.message, row.strategy)}
          ></i>
        </>
      ),

    },
  ];

  const [strategy_filter, setStrategy_filter] = useState([]);
  const [fstrategy, setFstrategy] = useState("all");
  const [message, setMessage] = useState("");
  const adminId = localStorage.getItem('adminId');
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sendedMsg, setSendedMsg] = useState([]);
  // console.log("sendedMsg", sendedMsg);
  const [tableData, settableData] = useState({
    columns,
    data,
  });

  const [rerender, setRender] = useState(false)

  const admin_token = localStorage.getItem("token");


  var data = [];

  const onAlertClose = e => {
    setShowAlert(false);
  }

  const apiCalls = () => {

    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      setStrategy_filter(res1.data.strategy);
    });


  };

  const onShowClick = (msg, strategy) => {

    if (window.confirm(Constant.DELETE_GROUP_CONFIRM_MSG)) {
      axios({
        method: "post",
        url: `${Config.base_url}smartalgo/msg-broadcast-delete`,
        data: {
          'adminId': adminId,
          'msg': msg,
          'strategy': strategy === "" ? "all" : strategy
        },
        headers: {
          'x-access-token': admin_token
        }
      })
        .then(function (response) {
          if (response) {
            setShowAlert(true)
            setAlertColor('error');
            setTextAlert(Constant.MESSAGE_BROADCAST_DELETE);
            setRender(!rerender)
          }
        })
    }
  }

  const inputChange = useCallback((e) => {

    if (e.target.name == "strategyname") {
      setFstrategy(e.target.value);
    }
    if (e.target.name == "msgtext") {
      setMessage(e.target.value);
    }

  });

  const msgAddedOnTable = () => {


    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/msg-added`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      var mm = res1.data.msg;

      mm.map((cl, index) =>
        data.push({
          no: index + 1,
          message: cl.message,
          strategy_users: cl.strategy === "" ? 'all' : cl.strategy,
          // time: setNewTime(cl.created_at),
          time: dateFormate(cl.created_at),
          action: <i
            className="fa-solid fa-trash fs-5 mx-3 hover"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            onClick={() => onShowClick(cl.message, cl.strategy)}
          ></i>
        })
      );
      settableData({
        columns,
        data,
      });
      setSendedMsg(mm)
    });
  }


  const sendMessage = () => {

    // const socket = socketIOClient(Config.base_url);
    // // console.log("nileshgandi",socket);
    // socket.emit("message_broadcast", message);
    setMessage('')
    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/message-broadcast`,
      data: {
        strategy: fstrategy,
        message: message,
        adminId: adminId
      },
      headers: {
        'x-access-token': admin_token
      }
    }).then((res1) => {
      // Object.keys(res1.data).length === 0 && res1.data.constructor === Object
      if (res1.data.messagesBroadcast.length === 0) {
        setShowAlert(true)
        setAlertColor('error');
        setTextAlert(Constant.CLIENT_NOT_AVAILABLE);
        setFstrategy("all")
        setMessage("")
      } else {
        setShowAlert(true)
        setAlertColor('success');
        setTextAlert(Constant.MESSAGE_BROADCAST);
        msgAddedOnTable()
        // sendedMsg()
      }
    });
  }

  useEffect(() => {
    apiCalls();
    msgAddedOnTable();
  }, [rerender]);


  //  style Table HEader
  const customStyles = {

    headCells: {
      style: {
        textTransform: 'uppercase !important',
        backgroundColor: '#000',
        color: '#fff',
        fontWeight: '700',
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

  // const setNewTime = (time) => {
  //   let currentDate = time.split("T");
  //   let currentTime = currentDate[1].split(".")[0];
  //   return `${currentDate[0]} ${currentTime}`;
  // };

  return (
    <>
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
                <div className="col-md-2">
                  <label style={{ fontWeight: "bold", color: "black" }}>
                    Strategy
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => { inputChange(e) }}
                    value={fstrategy}
                    name="strategyname"
                  >
                    <option value='all' style={{ textTransform: 'lowercase' }}>all</option>
                    {strategy_filter.map((sm, i) => (
                      <option value={sm.name}>{sm.name}</option>
                    ))}
                  </select>

                </div>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={5}
                      style={{ height: '200px', width: '100%' }}
                      componentClass="textarea"
                      name='msgtext'
                      value={message}
                      className="textarea-message"
                      placeholder="Your Message"
                      {...register("msgtext", { onChange: (e) => { inputChange(e) }, required: true })}
                    />
                  </Form.Group>
                  {errors.msgtext && <span style={{ color: "red" }}>* {Constant.MESSAGE_ERROR}</span>}
                </Form>

                <Button variant="btn mb-5"
                  className='btn-color'
                  onClick={handleSubmit(sendMessage)
                  }
                >Send</Button>

                <div className="row d-flex justify-content-end">
                  <div className="table-responsive">
                    <DataTableExtensions
                      {...tableData}
                      export={false}
                      print={false}
                      columns={columns}
                      data={sendedMsg}
                    >
                      <DataTable
                        noHeader
                        fixedHeader
                        fixedHeaderScrollHeight="700px"
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        customStyles={customStyles}
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
      {showAlert &&
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      }
    </>
  );
};

export default Messagebroadcast;
