import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as Config from "../common/Config";
import * as Constant from "../common/ConstantMessage";
import AlertToast from "../common/AlertToast";
import { NavLink, useNavigate } from "react-router-dom";
const Addstrategytoclients = () => {
  const navigate = useNavigate();

  const [tableData, settableData] = useState();
  const [clientsData, setClientsData] = useState();
  const [LicenceType, setLicenceType] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [sSelectedClient, setSSelectedClient] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const g_id = useParams();
  const inputEl = useRef(null);
  const columns = [
    {
      name: "Client UserName",
      selector: (row) => row.name,
    },
  ];

  const adminId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");

  const ChangeClientType = (type) => {
    setLicenceType(type);
    if (type == "all") {
      var data1 = [];
      clientsData.client.map((cl) =>
        data1.push({ name: cl.username, id: cl.id })
      );
      return settableData({
        columns,
        data: data1,
      });
    }

    const TypeData = clientsData.client.filter((item) => {
      if (item.licence_type == type) return item.username;
    });
    var data = [];
    TypeData.map((item) => {
      data.push({ name: item.username, id: item.id });
    });
    settableData({ columns, data: data });
  };

  useEffect(() => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/clients`,
      data: {adminId: adminId, strat_id: g_id.id },
      headers:{
        'x-access-token': admin_token
      }
      
    }).then((res) => {
      var data = [];
      res.data.client.map((cl) => {
        data.push({ name: cl.username, id: cl.id });
      });
      const clientSelected = res.data.sclient.map((item) => {
        return item.username;
      });
      setSSelectedClient(clientSelected);

      setClientsData(res.data);
      settableData({
        columns,
        data,
      });
    });
  }, []);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const SelectedCheckData = (e) => {
    const client_ids = e.selectedRows.map((item) => item.id);
    inputEl.current = client_ids;
  };

  const rowSelectCritera = (row) => sSelectedClient.includes(row.name);

  const AddStrategyToClient = (e) => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/strategy/strategy-to-clients`,
      data: {adminId: adminId, strat_id: g_id.id, selectedClients: inputEl.current },
      headers:{
        'x-access-token': admin_token
      }
    }).then((res) => {
      if (res) {
        setShowAlert(true);
        setTextAlert(Constant.CLIENT_ADDED_TO_STRAITGY);
        setAlertColor("success");
      // setTimeout(()=>  navigate("/admin/strategy"),1000)
      navigate("/admin/strategy")
        // window.location.reload();
      }
    });
  };
  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Add Strategy to Clients</h4>
                <div class="row">
                  <div className="d-flex ">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label
                          className="text-dark ms-3"
                          style={{ fontSize: "14px" }}
                        >
                          Client Type
                        </label>
                        <select
                          value={LicenceType}
                          name="licenceType"
                          class="form-control"
                          onChange={(e) => ChangeClientType(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="1">Demo</option>
                          <option value="2">Live</option>
                        </select>
                      </div>
                    </div>

                    <NavLink
                      to="/admin/strategy"
                      className="btn btn-primary btn-color btn-block ms-auto mt-5"
                    >
                      <i
                        class="fa fa-arrow-left mx-1"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Back"
                      ></i>{" "}
                      Back
                    </NavLink>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <DataTableExtensions
                        {...tableData}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          pagination
                          highlightOnHover
                          selectableRowSelected={rowSelectCritera}
                          selectableRows
                          // onSelectedRowsChange={({ selectedRows }) => SelectedCheckData(selectedRows)}
                          onSelectedRowsChange={SelectedCheckData}
                        />
                      </DataTableExtensions>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          AddStrategyToClient(e);
                        }}
                        className="btn btn-primary btn-color btn-block"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </>
  );
};

export default Addstrategytoclients;
