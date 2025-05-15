import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios";
import DatePicker from "react-datepicker";
import Backdrop from "@mui/material/Backdrop";
import * as Config from "../common/Config";
import CircularProgress from "@mui/material/CircularProgress";
import { dateFormate } from "../common/CommonDateFormate";
import Picker from 'react-month-picker'
import { useTable } from 'react-table'
import './admin.css'


const admin_token = localStorage.getItem("token");
const adminId = localStorage.getItem("adminId");

const TransactionLicence = () => {

  var data = [];
  const [transactionLicence, setTransactionLicence] = useState([]);
  const [getDate, setGetDate] = useState();
  const [tableData, SetTableData] = useState([]);
  const [countLicence, setCountLicence] = useState({});
  const [first, setfirst] = useState([]);
  const [loader, setloader] = useState(false);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  // console.log("startDate", startDate.toLocaleString().split("/",","));
  const [refresh, setRefresh] = useState(false)
  const [countAllLi, setCountAllLi] = useState(0)
  const [count, setCount] = useState(0)
  const [currentMonthLicense, setCurrentMonthLicense] = useState("")
  const [totalCountLicense, setTotalCountLicense] = useState("")
  const [filterDataLicence, setFilterDataLicence] = useState("")
  const [filterMonthLicence, setFilterMonthLicence] = useState();
  const [monthLicence, setMonthLicence] = useState("")
  const [minDate, setMinDate] = useState("")
  const [ShowCurrentMonthLicenceCount, setShowCurrentMonthLicenceCount] = useState("")

  // console.log("mindate", minDate);


  const columns = [
    {
      name: "No",
      selector: (row, index) => row.index,
      // onClick={e => { getRowNumbers(e, row) }}
    },
    {
      name: "Time",
      selector: (row) => row.time,
    },
    {
      name: "Client Name",
      selector: (row) => row.client_name,
      fontWeight: "800 !important",
      color: 'red !important',
    },
    {
      name: "Client Username",
      selector: (row) => row.client_username,
    },
    {
      name: "Licence",
      selector: (row) => row.licence,
    },
  ];


  useEffect(() => {
    setloader(true);
    axios({
      method: "get",
      url: `${Config.base_url}admin/transaction_all_licence`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      // console.log("transaction_all_licence", response.data.data);
      setTransactionLicence(response.data.data[0]);
      setGetDate(response.data.data[0]);
      setCurrentMonthLicense(response.data.data[0].modifydate_licence)
      setTotalCountLicense(response.data.data[0].licence)
      setloader(false);
    });

    axios({
      method: "get",
      url: `${Config.base_url}admin/count_licence`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      console.log("response.data.data", response.data.data);
      setMinDate(response.data.data[response.data.data.length - 1].date_time.split("-")[0] + "-" + response.data.data[response.data.data.length - 1].date_time.split("-")[1])
      response.data.data.map((a, index) => {
        if (a.licence != null) {
          setCount((prev) => prev + parseInt(a.licence))
        }
        data.push({
          index: index + 1,
          client_name: a.client_name == null ? "Admin" : a.client_name,
          client_username: a.client_username,
          time: dateFormate(a.date_time),
          licence: a.licence == null ? a.month_licence : a.licence,
        });
      });
      console.log(data);

      setloader(false);
      SetTableData(data);
      setfirst(data);
      setMonthLicence(data)

      setCountLicence({
        columns,
        data,
      });
    });
  }, [refresh]);

  const getRemainingLicence = () => {
    const remaingLicence = transactionLicence && transactionLicence.licence - count;
    // console.log("remaingLicence", remaingLicence)
    return remaingLicence
  };
  const { licence, modifydate_licence, this_month_licence } = transactionLicence;

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',

        justifyContent: 'center !important',
        textTransform: 'uppercase !important'
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        justifyContent: 'center !important',
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: row => row.client_name === "Admin",
      style: {
        color: 'green',
        fontWeight: '800',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }]
  //  from to date filter

  var addDays = function (str, days) {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate;
  };

  var todate1 = addDays(todate, 1);
  var fromdate1 = addDays(fromdate, 0);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  useEffect(() => {
    // axios({
    //   method: "post",
    //   url: `${Config.base_url}admin/getfromtodate`,
    //   data: {
    //     todate: todate && todate1.toISOString(),
    //     fromdate: fromdate && fromdate1.toISOString(),
    //   },
    //   headers: {
    //     'x-access-token': admin_token
    //   }
    // }).then(function (response) { });
  }, [fromdate, todate]);

  // set Date
  const resetDate = (event) => {
    // setFromdate("");
    // setTodate("");
    // setStartDate({columns , tableData})
  };

  const callMe = () => {
    // console.log("Some text");
    setRefresh(!refresh)
  }

  const filtervalue = (e) => {

    setStartDate(e)

    var datepickermonth = e.target.value
    let data = tableData && tableData.filter((x) => {
      if (x.time.split("-")[0] + "-" + x.time.split("-")[1] == datepickermonth) {
        return x
      }
    });
    setCountLicence({ columns, data });
    setFilterDataLicence({ columns, data })

    //---------------Month Data Show--------------------------------------



    var mapOfDataa = [];
    var mapOfData = data.map((currdata) => {

      if (currdata.client_name != "Admin") {
        mapOfDataa.push(currdata.licence)
      }
      // console.log("currdata", currdata);
      return mapOfDataa
    })



    //  For Show This Month Licence Count

    let abc = data.filter((currdata) => {
      if (currdata.client_name === "Admin") {
        return currdata.licence
      }
    }
    ).reduce((accum, curr) => {
      return parseInt(accum) + parseInt(curr.licence)
    }, 0)



    //  For Show This Month Licence Count


    var servicesUpdated = mapOfDataa.map(str => {
      return Number(str);
    });

    let sumOfData = servicesUpdated.reduce((accum, curr) => {
      return accum + curr
    })


    setFilterMonthLicence(sumOfData)
    setShowCurrentMonthLicenceCount(abc)

  };

  //----------------------------------------------------------------------

  const changeDate = (e) => {
    setStartDate(e.target.value)
    // var monthdatedatepicker = dateFormate(startDate).split("-")[0] + "-" + dateFormate(startDate).split("-")[1]
    var data = tableData && tableData.filter((x) => {
      var monthdatefilter = x.time.split("-")[0] + "-" + x.time.split("-")[1]
      if (monthdatefilter === startDate) {
        // console.log("x", x);
        return x
      }
    })
  }

  const datespliter = (date) => {
    var convertdate = date.toLocaleString()
    var splitdate = convertdate.split(",")[0]
    var splitjoin = splitdate.split("/")[2] + "-" + splitdate.split("/")[0]
    return splitjoin
  }

  return (
    <>
      <Backdrop
        sx={{
          color: "#000000",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="card-title">Licence List</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <div
                      className=" col-md-12 "
                      style={{ justifyContent: "space-around", display: "inline-block" }}
                      id="totalLicence"
                    >
                      {/* <div className="d-flex flex-column "> */}
                      {/* <h5 className="col-sm-12  my-4">
                Total Licence <span className="fw-bold"> =  {licence}</span>
              </h5> */}
                      <table class="table_width">
                        <tr>
                          <th class="back_color"> <p className=" my-3 new_font">
                            Start Date</p></th>
                          <th class="back_color"><p className=" my-3 new_font">
                            Total Licence</p></th>
                          <th class="back_color"><p className=" my-3 new_font">
                            Used Licence</p></th>
                          <th class="back_color"> <p className=" my-3 new_font" >
                            Remaining Licence</p></th>
                          <th class="back_color">
                            <p className=" my-3 new_font">
                              Current Month Used Licence</p>
                          </th>
                          <th class="back_color">
                            <p className=" my-3 new_font">
                              Current Month Issued Licence</p>
                          </th>
                        </tr>
                        <tr>
                          <td><span className="fw-bold new_font"> {dateFormate(currentMonthLicense)}</span></td>
                          <td><span className="fw-bold new_font"> {totalCountLicense}</span></td>

                          <td><span className="fw-bold new_font"> {count}</span></td>

                          <td><span className="fw-bold new_font">{getRemainingLicence()}</span> </td>

                          <td><span className="fw-bold new_font ">  {filterMonthLicence == undefined ? "Please Select Month" : filterMonthLicence}</span></td>
                          <td><span className="fw-bold new_font ">  {ShowCurrentMonthLicenceCount == "" ? "Please Select Month" : ShowCurrentMonthLicenceCount}</span></td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <div class="col-1"></div>
                  <div className="col-3">
                    <div className="row d-flex align-items-center">
                      <div className="col-md-6">
                        <input
                          type="month"
                          min={minDate}
                          // placeholder="MM/DD/YYYY"
                          // max="2022-12"
                          // value={datespliter(new Date())}
                          onChange={(data) => filtervalue(data)}
                        />
                      </div>
                      <div className="col-md-4">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className=" table-responsive">
                  <DataTableExtensions
                    {...countLicence}
                    export={false}
                    print={false}
                  >
                    <DataTable
                      // columns={columns}
                      // data={tableData}
                      fixedHeader
                      fixedHeaderScrollHeight="700px"
                      highlightOnHover
                      pagination
                      noHeader
                      conditionalRowStyles={conditionalRowStyles}
                      defaultSortField="id"
                      style={{ overflow: "scroll" }}
                      paginationRowsPerPageOptions={[10, 50, 100]}
                      paginationComponentOptions={{
                        selectAllRowsItem: true,
                        selectAllRowsItemText: "All",
                      }}
                      customStyles={customStyles}
                    />
                  </DataTableExtensions>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionLicence;
