import React, { useEffect, useState } from "react";
import axios from "axios";
import { WithContext as ReactTags } from "react-tag-input";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

function Addgroupservice() {
  const [selectall, setSelectall] = useState("");
  const [groupname, setgroupname] = useState("");
  const [category, setCategories] = useState([]);
  const [selcategory, setselCategories] = useState([]);
  const [cservices, setCservices] = useState([]);
  const [tags1, setTags] = useState([]);
  // console.log("selcategory", selcategory);

  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [serachServices, setSearchServices] = useState([]);
  const [groupNameErr, setgroupNameErr] = useState("");
  const [catagoryErr, setCatagoryErr] = useState("");
  const [group_qty_value, setgroup_qty_value] = useState("");
  // console.log("group_qty_value", group_qty_value);

  const [emptyService, setEmptyService] = useState()
  const [notempty, setNotempty] = useState()
  const navigate = useNavigate();

  const [state, setstate] = useState('');
  // console.log("state", state);
  const [searchStrategyChange, setSearchStrategyChange] = useState("1")
  const [newCservices, setNewCservices] = useState([]);


  // console.log("find service" ,tags1);
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    axios.get(`${Config.base_url}smartalgo/category`, {
      headers: {
        'x-access-token': admin_token
      }, data: {}
    }).then((res) => {
      setCategories(res.data.category);
    });

  }, [tags1]);
  // console.log("ipAddress", ipAddress);


  const handleChange = (e) => {
    setCatagoryErr("");
    setselCategories(e.target.value);
    if (e.target.value == "") {
      setCservices([]);
      return false;
    }
    axios({
      method: "post",
      url: `${Config.base_url}smartalgo/services`,
      data: { adminId: adminId, id: e.target.value },
      headers: {
        'x-access-token': admin_token
      }
    }).then(function (response) {
      setCservices(response.data.services);
      setSearchServices(response.data.services);
      setSelectall("");
    });
  };

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const handleClick = (e) => {
   
    var id = e.target.value;
 
    var append_tag = cservices.filter((tag, index) => tag.id == id);
    // console.log("append_tag", append_tag);
    if (e.target.checked) {
      var pre_tag = {
        id: "" + append_tag[0].id + "",
        text: append_tag[0].service,
        cat_id: selcategory,
        group_qty: "0"
      };
      // 
      // console.log("pre_tag ", pre_tag)
      // console.log("fffff ", group_qty_value)

      setTags((oldArray) => [...oldArray, pre_tag]);
    } else {
      setSelectall("");
      setTags(tags1.filter((tag, index) => tag.id !== id));
    }
  };


  const setgroup_qty_value_test = (e, qty, id, servivetext, cat_id) => {
    // console.log("qty", qty);

    let pre_tag1 = {
      id: "" + id + "",
      text: servivetext,
      cat_id: cat_id,
      group_qty: qty
    };

    let newArray = [...state, pre_tag1]
    setstate(newArray)
    // e.target.reset();
  }


  const handleDelete = (i, ctag) => {
    var c_id = ctag[i].id;
    setTags(tags1.filter((tag, index) => tag.id != c_id));
  };

  
  const checkitem = (r) => {
    var match = tags1.map((res) => {
      if (res.length != 0) {
        if (res.id == r) {
          return res;
        } else {
          return "";
        }
      } else {
        return "";
      }
    });
    var filtered = match.filter(function (el) {
      return el != null && el != "";
    });

    if (filtered.length != 0) {
      return "minus";
    } else {
      return "";
    }
  };


  const handleSelect = (e) => {
    if (e.target.checked) {
      var old_tags = tags1.map((tag) => "" + tag.id + "");
      // console.log("old_tags", old_tags);

      cservices.map((tag) => {
        if (!old_tags.includes("" + tag.id + "")) {
          setTags((oldArray) => [
            ...oldArray,
            {
              id: "" + tag.id + "", text: tag.service, cat_id: selcategory,
              // group_qty: group_qty_value
            },
          ]);

        }
      });
      setSelectall("minus");
    } else {
      var service_array = cservices.map((tag) => "" + tag.id + "");

      var new_tag = tags1.filter((tag, index) => {
        if (!service_array.includes("" + tag.id + "")) {
          return tag;
        }
      });
      setSelectall("");
      setTags(new_tag);
    }
  };



  const submitform = (e) => {

    const uniqueArr = Object.values(
      state.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {})
    );
    // console.log("uniqueArr", uniqueArr);  
    // return
    if (groupname === "") {
      setgroupNameErr(Constant.EMPTY_GROUP_ERROR_MSG);
      return;
    }

    if (tags1.length === 0 || tags1 === "") {
      setCatagoryErr(Constant.EMPTY_GROUP_CATAGORY_ERROR_MSG);
      return
    }
    // console.log("uniqueArr", uniqueArr.length);
    if (uniqueArr.length > 50) {
      alert("You don't have permision to select above 50 Services")
    } else {
      axios({
        method: "post",
        url: `${Config.base_url}admin/group-services/add`,
        data: { adminId: adminId, service: uniqueArr, name: groupname },
        headers: {
          'x-access-token': admin_token
        }
      }).then(function (response) {
        setgroupname("");
        setTags([]);
        setCategories([]);
        setCservices([]);
        setSelectall("");
        setEmptyService("");
        setselCategories([]);
        setShowAlert(true);
        setTextAlert(Constant.ADD_GROUP_SUCCESS_MSG);
        setAlertColor("success");
        setTimeout(() => navigate("/admin/group-services"), 1000)
      });
    }


  };

  const nameChange = (e) => {
    setgroupname(e.target.value);
    setgroupNameErr("");
  };

  const searchServices = (e) => {
    // console.log(e.target.value);
    var searchServ = serachServices.filter((item) => {
      if (item.service.toString().includes(e.target.value.toString().toUpperCase())) {
        return item;
      }
    })
    if (e.target.value == "") {
      setNewCservices([]);
    } else {
      setNewCservices(searchServ);
    }
  };


  const customStyles = {
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
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>
                      Add Group
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right">
                      <NavLink
                        to="/admin/group-services"
                        className="btn-color btn"
                      >
                        <i class="fa fa-arrow-left mx-1" aria-hidden="true" data-toggle="tooltip"
                          data-placement="top"
                          title="Back"

                        ></i>Back
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <div className="form-group">
                        <label>Enter Group Name</label>
                        <input
                          type="text"
                          value={groupname}
                          onChange={(e) => {
                            nameChange(e);
                          }}
                          className="form-control"
                          placeholder="Group Name"
                        />
                      </div>
                      <p style={{ color: "red" }}>
                        {groupNameErr && groupNameErr}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <div className="form-group">
                        <label>Select Services</label>
                        <select
                          value={selcategory}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          className="form-control"
                        >
                          <option value=''
                          >select category</option>
                          {category.map((cat, i) => (
                            <option key={i} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <p style={{ color: "red" }}>
                          {catagoryErr && catagoryErr}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {selcategory.length !== 0 && (
                      <div className="col-md-4">
                        <div className="form-group">
                          {/* <label>Search</label> */}
                          <input
                            type="text"
                            // value={groupname}
                            onChange={(e) => {
                              searchServices(e);
                            }}
                            className="form-control"
                            placeholder="Search.."
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-md-10 pr-1">
                      <div className={newCservices.length == 0 ? "" : "fix-height"}>
                        <div className="row">
                          {newCservices.length == 0 ? (
                            ""
                          ) : (
                            <div className="col-md-4 pr-1">
                              <div className="form-check">
                                <input
                                  checked={selectall}
                                  onClick={handleSelect}
                                  className="form-check-input"
                                  type="checkbox"
                                />
                                <label className="form-check-label">
                                  Select all
                                </label>
                              </div>
                            </div>
                          )}
                          {newCservices.length == 0
                            ? ""
                            : newCservices.map((ser, i) => (
                              <div className="col-md-4 pr-1" key={i}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    checked={checkitem(ser.id)}
                                    value={ser.id}
                                    onClick={handleClick}
                                    id={ser.id}
                                    type="checkbox"
                                  />
                                  <label
                                    className="form-check-label"
                                    for={ser.id}
                                  >
                                    {ser.service}
                                  </label>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="table-reponsive text-center">
                      <thead className="tablecolor">
                        <tr >
                          <th style={{ fontWeight: 'bold', color: 'white', width: '200px' }} className="ms-2">S.No.</th>
                          <th style={{ fontWeight: 'bold', color: 'white', width: '200px' }}>Service Name</th>
                          <th style={{ fontWeight: 'bold', color: 'white', width: '200px' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontWeight: 'bold', width: '100px' }} className="text-center">
                        {tags1.length == 0 ? <p className="text-center text-danger">
                          No Data Found
                        </p>
                          : <>
                            {tags1 && tags1.map((table, i) => (
                              // { console.log("dddd", table) }
                              <tr key={i} >
                                {/* <td className="ms-2">{i + 1}</td> */}
                                <td className="ms-2">{i + 1}</td>
                                <td>{table.text}</td>
                                <td>
                                  <div>
                                    <input
                                      // className="hidebg"
                                      name="price"
                                      type="number"
                                      min="0"
                                      defaultValue={0}
                                      onChange={(e) => {
                                        setgroup_qty_value(e.target.value);
                                        setgroup_qty_value_test(e, e.target.value, table.id, table.text, table.cat_id);
                                      }}
                                    // key={i}
                                    //defaultValue={row.price}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>}
                      </tbody>

                      {/* Table for set qty */}
                      {/* <div className="row d-flex justify-content-end">
                      <div className="card-body">
                        <div className="table-responsive"> */}
                      {/* <DataTableExtensions */}
                      {/* export={false} */}
                      {/* print={false}
                          > */}
                      {/* <DataTable
                            columns={columns}
                            data={tags1 && tags1}

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
                          </DataTableExtensions>
                        </div>
                      </div>
                    </div> */}
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          submitform(e);
                        }}
                        className="btn-color btn"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="title">Selected Services</h5>
              </div>
              <div className="card-body">
                {category.length == 0 ? ""
                  : category.map((cat, i) => {
                    var tag2 = tags1.filter((tag, index) => tag.cat_id == cat.id);
                    // console.log("tag2", tag2);

                    return tag2.length == 0 ? (
                      ""
                    ) : (
                      <>
                        <br></br>
                        <h6 key={i} >{cat.name}</h6>
                        <ReactTags
                          tags={tag2}
                          handleDelete={(e) => {
                            handleDelete(e, tag2);
                          }}
                          autocomplete
                        />
                      </>
                    );
                  })}
              </div>
            </div>

          </div>


          {showAlert && (
            <AlertToast
              hideAlert={onAlertClose}
              showAlert={showAlert}
              message={textAlert}
              alertColor={alertColor}
            />
          )}
        </div >
      </div >
    </>
  );
}

export default Addgroupservice;
