
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios"
import { Base64 } from 'js-base64';
import useRazorpay from "react-razorpay";

const AddLicence = () => {
  const navigate = useNavigate();

  const Razorpay = useRazorpay();


  const getpenellkey = localStorage.getItem("key")
  const decodedKey = Base64.decode(getpenellkey)

  const [LicenceData, setLicenceData] = useState("")
  const [data, setData] = useState("")
  const [licecneQty, setLicecneQty] = useState("0")
  const [totalPrice, setTotalPrice] = useState("0")
  const [getorderData, setorderData] = useState([])


  console.log("getorderData", getorderData);
  // console.log("totalPrice", totalPrice);


  const [hasError, setHasError] = useState(false);

  const getPanelKyData = () => {
    axios.post("https://api.smartalgo.in:3001/admin/get_panel_data",
      { panelKey: decodedKey },

      {

        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setData(res.data.data[0])
      }).catch((err) => console.log("panelKey- Error", err))

  }

  useEffect(() => {
    getPanelKyData()

  }, [])




  const BuyLicence = async (e) => {
    e.preventDefault()

    if (data.min_license, data.max_license)

      if (parseInt(licecneQty) < parseInt(data.min_license) || parseInt(licecneQty) > parseInt(data.max_license)) {
        alert(`Licence Quantity Must Be Grather Then ${data.min_license} And Less Then ${data.max_license}`)
        return
      }

    let total_price = document.getElementsByClassName("total_Price")[0].innerHTML

    var order_data = {
      total_price: total_price,
      licecneQty: licecneQty,
      panelKey: data.key
    }

    // console.log("order_data",order_data);

    // const order = await createOrder(order_data); //  Create order on your backend
    // console.log("getorderData =>",getorderDat

    const axios = require('axios');

    let reqest = JSON.stringify({
      "panelKey": data.key,
      "amount": total_price,
      "quantity": licecneQty
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.smartalgo.in:3001/licence_order',
      headers: {
        'Content-Type': 'application/json'
      },
      data: reqest
    };

    axios.request(config)
      .then((response) => {
        console.log("Data1222", response.data.data.id);
console.log(parseFloat(response.data.data.amount));

        const options = {
          key: "rzp_test_EH05a5zrbXMnj5", // Enter the Key ID generated from the Dashboard
          amount: 500, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Sneh Jaiswal",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: response.data.data.id , //This is a sample Order ID. Pass the `id` obtained in the response of fcreateOrder().
          handler: function (response) {
            console.log("response", response);
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
          },
          prefill: {
            name: "Sneh jaiswal",
            email: "snehpnp@example.com",
            contact: "7049510697",
          },
          notes: {
            address: "PNP infotech ",
          },
          theme: {
            color: "#3399cc",
          },
        };
      
        const rzp1 = new Razorpay(options);
      
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      
        rzp1.open();
      



      })

  // console.log("order", order);

  
  return



}

var createOrder = async (order_data) => {
  // console.log("=>", order_data);

  const axios = require('axios');
  let data = JSON.stringify({
    "panelKey": order_data.panelKey,
    "amount": order_data.total_price,
    "quantity": order_data.licecneQty
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.smartalgo.in:3001/licence_order',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log("Data", response.data);

      setorderData(response.data)
      return response.data
    })
    .catch((error) => {
      console.log(error);
    });

}


const LicecnePrice = (value, minprice, maxprice) => {
  setLicecneQty(value)

  if (parseInt(value) < parseInt(minprice) || parseInt(value) > parseInt(maxprice)) {
    setHasError(true);
  } else {
    // setLicenceData(value)
    setHasError(false);
  }

}





let totalAmmount = 0
const totalLicenceAmount = (price_license) => {
  if (licecneQty == "") {
    return "0"
  }
  else {
    totalAmmount += (parseFloat(licecneQty) * parseFloat(price_license))
    // setTotalPrice(totalAmmount)

  }
  return totalAmmount

  console.log("totalAmmount", totalAmmount);
}

const columns = [
  {
    name: "S.No.",
    selector: (row) => row.id,
    // width: "120px",
  },
  {
    name: "Min Licence",
    selector: (row) => row.min_license,
    width: "400px",
    wrap: true,
  },
  {
    name: "Max Licence",
    selector: (row) => row.max_license,
  },
  {
    name: "Licence Price",
    selector: (row) => row.price_license,
  },
  {
    name: "Status",
    selector: (row) => row.panal_status,
  },
];

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
  <div>
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex">
              <h4 className="card-title flex-grow-1">Closing Position</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                </div>
                <div className="col-md-3"></div>
              </div>
            </div>

            <div className="row  mx-auto">
              <div className="card-body justify-content-space-between mx-auto  ">
                <div className="col-12    ">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Licence Qty</label>
                      <input type="number"
                        onChange={(e) => LicecnePrice(e.target.value, data.min_license, data.max_license)}
                        name="licence_qty" className="form-control" value={licecneQty} />
                    </div>
                    {hasError && <h6 className="text-danger"> Licence Quantity Must Be Grather Then {data.min_license} And Less Then {data.max_license}</h6>}
                  </div>
                  <div className="d-flex p-2">
                    <h6 className="flex-grow-1">Min Licence : {data.min_license} </h6>
                    <h6 className="flex-grow-1">Max Licence : {data.max_license} </h6>
                    <h6 className="flex-grow-1">Licence Price : {data.price_license} </h6>

                    <h6 >Total Price : </h6>
                    <h6 className="total_Price">{totalLicenceAmount(data.price_license)} </h6>

                  </div>
                  <button className='btn btn-color' onClick={(e) => {
                    BuyLicence(e)
                  }}>Buy Licence</button>

                </div>

                <h4 className="card-title flex-grow-1">Licence History</h4>


                <div className="col-12 ">

                  <div className="table-responsive">
                    <DataTableExtensions
                      columns={columns}
                      // data={LicenceData}
                      export={false}
                      print={false}
                    >
                      <DataTable
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



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

}

export default AddLicence