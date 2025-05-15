
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input';
import * as Config from '../common/Config';
import { NavLink, useNavigate } from "react-router-dom";
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';
// import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { dateFormate } from "../common/CommonDateFormate";
function Editgroupservice() {


  const [rpage, setrpage] = useState(true);
  // console.log("sdsadsa",rpage);
  const [selectall, setSelectall] = useState('');
  const [groupname, setgroupname] = useState('');
  const [selcategory, setselCategories] = useState([]);
  const [category, setCategories] = useState([]);
  const [cservices, setCservices] = useState([]);
  const [tags1, setTags] = useState([]);
  const [groupNameErr, setgroupNameErr] = useState("")
  const [group_qty_value, setgroup_qty_value] = useState("");
  const [state, setstate] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [serachServices, setSearchServices] = useState([])
  const g_id = useParams();

  const navigate = useNavigate();

  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const [adminlog,setAdminLogs] = useState("");
  console.log(groupname,"groupname")


  useEffect(() => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/group-services`,
      data: { 'adminId': adminId, 'id': g_id.id },
      headers: {
        'x-access-token': admin_token
      }
    })
      .then(function (response) {
        console.log("tesst", response.data);
    
        
        setgroupname(response.data.name);
        setTags(response.data.service);
        setstate(response.data.service);
      })

    axios.get(`${Config.base_url}smartalgo/category`).then(res => {
      setCategories(res.data.category);
    });
  }, []);


  useEffect(()=> {
    axios.post(`${Config.base_url}admin/get_admin_logs`,g_id).then(
    
      resp => setAdminLogs(resp.data)

    ).catch(
      err => console.log(err)
    )
  },[])


   
console.log(adminlog,"adminlog");
console.log(g_id,"g_id")

  const handleChange = (e) => {
    setselCategories(e.target.value);
    if (e.target.value == '') {

      setCservices([])
      return false;
    }
    axios({

      method: "post",
      url: `${Config.base_url}smartalgo/services`,
      data: { 'adminId': adminId, 'id': e.target.value },
      headers: {
        'x-access-token': admin_token
      }
    })
      .then(function (response) {
        setCservices(response.data.services)
        setSearchServices(response.data.services)
        setSelectall('');
      })
  }
  const handleClick = (e) => {
    var id = e.target.value;
    var append_tag = cservices.filter((tag, index) => tag.id == id);
    if (e.target.checked) {
      var pre_tag = { id: '' + append_tag[0].id + '', text: append_tag[0].service, cat_id: selcategory ,  group_qty: "0"};
      setTags(oldArray => [...oldArray, pre_tag]);
      setstate(oldArray => [...oldArray, pre_tag]);
    } else {
      setTags(tags1.filter((tag, index) => tag.id != id));
      setSelectall('');
    }
  }

  const onAlertClose = e => {
    setShowAlert(false);
  }

  const handleDelete = (i, ctag) => {
    var c_id = ctag[i].id;
    setTags(tags1.filter((tag, index) => tag.id != c_id));
    setstate(tags1.filter((tag, index) => tag.id != c_id))

  }
  const checkitem = (r) => {

    var match = tags1.map((res) => {
      if (res.length != 0) {
        if (res.id == r) {
          return res;
        } else {
          return '';
        }
      } else {
        return '';
      }
    });
    var filtered = match.filter(function (el) {
      return el != null && el != '';
    });

    // console.log("filtered" , filtered);


    if (filtered.length != 0) {
      return 'minus';
    } else {
      return '';
    }


  }
  const handleSelect = (e) => {
    if (e.target.checked) {
      var old_tags = tags1.map(tag => '' + tag.id + '');
      cservices.map(tag => {
        if (!old_tags.includes('' + tag.id + '')) {
          setTags(oldArray => ([...oldArray, { id: '' + tag.id + '', text: tag.service, cat_id: selcategory, group_qty: "0" }]))
        }
      }
      );
      setSelectall('minus');
    } else {
      var service_array = cservices.map(tag => '' + tag.id + '');

      var new_tag = tags1.filter((tag, index) => {

        if (!service_array.includes('' + tag.id + '')) {

          return tag;
        }
      });
      setSelectall('');
      setTags(new_tag);




    }
  }
  // console.log("tag" ,tags1);
   

  const setgroup_qty_value_test = (e, qty, id, servivetext, cat_id) => {

    let pre_tag1 = {
      id: "" + id + "",
      text: servivetext,
      cat_id: cat_id,
      group_qty: qty
    };

    let newArray = [...state, pre_tag1]
    setstate(newArray)

    e.target.reset();
  }


  const submitform = (e) => {


    console.log("state", state);

    // setstate(...tags1 , {group_qty: '0'} )

    let uniqueArr = Object.values(
      state && state.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {})
      );
    setstate(uniqueArr)

    // let data = { 'adminId': adminId, 'id': g_id.id, 'service': state == "" ? tags1 : state , 'name': groupname, }

    //   console.log("data" ,uniqueArr);


     

    // return
    if (groupname === "") {
      setgroupNameErr(Constant.EMPTY_GROUP_ERROR_MSG);
      return;
    }

    

    axios({
      method: "post",
      url: `${Config.base_url}admin/group-services/update`,
      data: { 'adminId': adminId, 'id': g_id.id, 'service': uniqueArr, 'name': groupname, },
      headers: {
        'x-access-token': admin_token
      }
    })
      .then(function (response) {
      
        
        setrpage(!rpage);
        setShowAlert(true);
        setTextAlert("Data Updated Successfully");
        setAlertColor('success')
        setTimeout(() => navigate("/admin/group-services"), 1000)

      })
  }

  const nameChange = (e) => {
    setgroupname(e.target.value);

  }

  const searchServices = (e) => {
    var searchServ = serachServices.filter((item) => {
      if (item.service.toString().includes(e.target.value.toString().toUpperCase())) {
        return item
      }
    })
    setCservices(searchServ)

  }

    console.log("state1",state);


  //



  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        backgroundColor: '#000',
        color: '#fff',
        // justifyContent: 'center !important',
      },
    },
    rows: {
      style: {
        // overflow:'visible !important',
        // justifyContent: 'center !important',
      },
    },
    cells: {
      style: {
        overflow: 'visible !important',
        // justifyContent: 'center !important',
      },
    },
  };



  // const columns = [
  //   {
  //     name: "S.No.",
  //     selector: (row, index) => index,
  //     width: "120px",
  //   },
  //   {
  //     name: "Service Name",
  //     selector: (row) => row.text,
  //     width: "200px",
  //     wrap: true,
  //   },
  //   // {
  //   //   name: "Lot Size",
  //   //   selector: (row) => row.Release_Date,
  //   // },
  //   {
  //     name: "Lot Size",
  //     // selector: (row) => row.Release_Date,
  //     cell: (row) => (
  //       <div>
  //         <input
  //           //    className="hidebg"
  //           name="price"
  //           type="number"
  //           onChange={(e) => {
  //             setgroup_qty_value(e.target.value);
  //           }}
  //           defaultValue={row.Group_Quantity}
  //         />
  //       </div>
  //     )

  //   },

  // ];
       


   var columns = [
  
    {
      name: "No.",
      selector: (row,index) =>   index+1,
      width: '100px !important',
      // justifyContent:'center !important'
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: '130px !important',
      justifyContent:'center !important'
    },
    {
      name:"Service Name",
      selector:(row) => row.text,
      width: '130px !important',
      justifyContent:'center !important'

    },
    {
      name:"OLD QTY",
      selector:(row)  => row.old_qty,
      width: '130px !important',
      justifyContent:'center !important'

    },
    {
      name:"NEW QTY",
      selector:(row)  => row.new_qty,
      width: '130px !important',
      justifyContent:'center !important'

    },{
      name:'TIME',
      selector:(row) => dateFormate(row.date),
      width: '200px !important',
      justifyContent:'center !important'


    }
   ]


  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">

                <div className="row d-flex align-items-center">
                  <div className="col-md-6">
                    <h5 className="title" style={{ marginBottom: "0px" }}>Edit Group</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="back-button text-right">
                      <NavLink
                        to="/admin/group-services"
                        className="btn btn-color"
                      >
                        <i class="fa fa-arrow-left mx-1" aria-hidden="true" data-toggle="tooltip"
                          data-placement="top"
                          title="Back"

                        ></i> Back
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
                        <input type="text" value={groupname} onChange={(e) => { nameChange(e) }} className="form-control" placeholder="Group Name" />
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
                        <select value={selcategory} onChange={(e) => { handleChange(e) }} className="form-control">
                          <option value="">select category</option>
                          {category.map(cat =>
                            <option value={cat.id}>{cat.name}</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {selcategory.length !== 0 && <div className="col-md-4">
                      <div className="form-group">
                        {/* <label>Search</label> */}
                        <input type="text"
                          // value={groupname}
                          onChange={(e) => { searchServices(e) }}
                          className="form-control" placeholder="Search.." />
                      </div>
                    </div>}
                    <div className="col-md-10 pr-1">
                      <div className={cservices.length == 0 ? "" : "fix-height"}>
                        <div className="row">
                          {cservices.length == 0 ? '' : <div className="col-md-4 pr-1">
                            <div className="form-check">
                              <input checked={selectall} onClick={handleSelect} className="form-check-input" type="checkbox" />
                              <label className="form-check-label">Select all</label>
                            </div>
                          </div>}
                          {
                            cservices.length == 0 ? '' : cservices.map((ser, i) =>
                              <div className="col-md-4 pr-1" key={i}>
                                <div className="form-check">
                                  <input className="form-check-input" checked={checkitem(ser.id)} id={ser.id} value={ser.id} onClick={handleClick} type="checkbox" />
                                  <label className="form-check-label" for={ser.id}>{ser.service}</label>
                                </div>
                              </div>
                            )}

                        </div>
                      </div>
                    </div>
                    {/* Table for set qty */}
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
                                      //    className="hidebg"
                                      name="price"
                                      type="number"
                                      onChange={(e) => {
                                         
                                        setgroup_qty_value(e.target.value);
                                        setgroup_qty_value_test(e, e.target.value, table.id, table.text, table.cat_id);
                                      }}
                                      
                                      // key={i}
                                      defaultValue={table.group_qty}

                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>}
                      </tbody>

                    </div>


                  </div>
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button type="button" onClick={(e) => { submitform(e) }} className="btn btn-color">Update</button>
                    </div>
                          <h5>Quantity updated details</h5>
                  
                     <DataTable  
                     data={adminlog}   
                     columns = {columns}
                     customStyles={customStyles}
                     pagination
                     paginationRowsPerPageOptions={[10, 50, 100]}
                     paginationComponentOptions={{
                       selectAllRowsItem: true,
                       selectAllRowsItemText: "All",
                     }}
                      />
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
                {
                  category.length == 0 ? '' : category.map((cat, i) => {
                    var tag2 = tags1.filter((tag, index) => tag.cat_id == cat.id)
                    // console.log("tag2", tag2);

                    return tag2.length == 0 ? '' : <><br></br><h6 key={i}>{cat.name}</h6><ReactTags
                      tags={tag2}
                      handleDelete={(e) => { handleDelete(e, tag2) }}
                      autocomplete
                    /></>
                  }
                  )}
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
        </div>
      </div>
    </>
  );
}






export default Editgroupservice;