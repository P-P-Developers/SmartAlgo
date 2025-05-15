module.exports = function(app,connection1){
    var verifyToken = require('./middleware/awtJwt');
  
    const Razorpay = require("razorpay");
    const crypto = require("crypto");

    app.post("/licence_order", async (req, res) => {

        var panelKey = req.body.panelKey;

        try {

            
            connection1.query('SELECT * FROM `superadmin_url_key` WHERE `key`="' + panelKey + '"', (err, result) => {

                if (result.length > 0) {
                    const instance = new Razorpay({
                        key_id: "rzp_test_EH05a5zrbXMnj5",
                        key_secret: "RIMbDXoCRupw7vFGzOshTGuv",
                    });
        
                    const options = {
                        amount:req.body.amount,
                        currency: "INR",
                        receipt: crypto.randomBytes(10).toString("hex"),
                    };
        
                    instance.orders.create(options, (error, order) => {
                        // console.log("options",options);
                        if (error) {
                            // console.log("erroe" , error);
                            return res.status(500).json({ message: "Something Went Wrong!" });
                        }else{

                            res.status(200).json({ data: order });
                        }
        
                    });
                }


            })
      
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
            // console.log(error);
        }
    });
     
  
      }
  
    //    connection1.query("SELECT *  FROM `signals` where `dt_date`='"+dformat+"' order by `trade_symbol` ASC", (err, result) => {
    //     res.send({ signals: result });
    // });
      
    