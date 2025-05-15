import React, { useEffect, useState } from "react";
import axios from 'axios';
import * as Config from '../common/Config';
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';

export default function AddService() {
  const [category, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [serviceName, setServiceName] = useState();
  const [tokenNo, setTokenNo] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const adminId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");

  const getCategories = () => {
    axios.get(`${Config.base_url}smartalgo/category`,{ headers:{
      'x-access-token': admin_token
    },data:{}}).then(res => {

      setCategories(res.data.category);
    });
  }

  const onAlertClose = e => {
    setShowAlert(false);
  }

  useEffect(() => {
    getCategories()

  }, []);

  const AddOnService = () => {
    axios({

      method: "post",
      url: `${Config.base_url}services/addservice`,
      data: {'adminId': adminId, 'categorieId': selectedCategory, 'Service': serviceName, 'Instru_Token': tokenNo },
      headers:{
        'x-access-token': admin_token
      }
    })
      .then(function (response) {
        if (response) {
          setServiceName("")
          setTokenNo("")
          setSelectedCategory("")
          setShowAlert(true);
          setTextAlert(Constant.SERVICE_ADDED_SUCESSFULLY);
          setAlertColor('success')
        }
      })
  }


  return <>
    <div className="content">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="title">Add Service</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Enter Service Name</label>
                        <input type="text"
                          value={serviceName} onChange={(e) => { setServiceName(e.target.value) }}
                          className="form-control" placeholder="Enter Service Name" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Token</label>
                        <input type="text"
                          value={tokenNo} onChange={(e) => { setTokenNo(e.target.value) }}
                          className="form-control" placeholder="Enter Token No." />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Select Category</label>
                      <select
                        value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value) }}
                        className="form-control">
                        <option value="">select category</option>
                        {category.map((cat, index) =>
                          <option key="{index}" value={cat.id}>{cat.name}</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-10 pr-1">
                    <button type="button"
                      onClick={AddOnService}
                      className="btn btn-primary btn-block">Add</button>
                  </div>
                </div>
              </form>
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
  </>;
}
