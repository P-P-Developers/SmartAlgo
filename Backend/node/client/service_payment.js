module.exports = function (app, connection1) {

    var verifyToken = require('./middleware/awtJwt');


    const Razorpay = require("razorpay");
    const crypto = require("crypto");


    app.get("/getall_servicegroup", function (req, res) {

        connection1.query('SELECT service_group_name.*,services.service as service_name,service_id as service_id FROM service_group_name JOIN service_and_group_id ON service_group_name.id = service_and_group_id.service_group_id JOIN services ON services.id = service_and_group_id.service_id', (err, result) => {
            // console.log("get all payment result -", result);

            res.send({ services: result });

        });
    });




    // payment gatyway


    app.post("/orders", async (req, res) => {

        try {
            const instance = new Razorpay({
                key_id: "rzp_test_vAejSM6PVRil5i",
                key_secret: "eCcV0vYv3SM2bDsDuYVjQBB4",
            });

            const options = {
                amount: req.body.amount * 100,
                currency: "INR",
                receipt: crypto.randomBytes(10).toString("hex"),
            };

            instance.orders.create(options, (error, order) => {
                if (error) {
                    // console.log("erroreeeeeeeee" , error);
                    return res.status(500).json({ message: "Something Went Wrong!" });
                }
               // console.log("Kikia_____order", order);

                res.status(200).json({ data: order });
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
            // console.log(error);
        }
    });

    app.post("/verify", async (req, res) => {
     res.send("okk")
// res.send("hello",res)
        return 
        try { 
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
                req.body;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                return res.status(200).json({ message: "Payment verified successfully" });
            } else {
                return res.status(400).json({ message: "Invalid signature sent!" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
            console.log(error);
        }
    });





}
