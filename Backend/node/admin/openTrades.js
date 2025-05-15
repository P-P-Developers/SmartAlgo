module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');

    var fs = require('fs-extra')

    var d = new Date,
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':');



    app.get("/admin/open_trades", (req, res) => {

      

        connection1.query('SELECT * FROM `signals` WHERE `dt_date`="2023-05-25" AND (`type`="LE" OR `type`="SE")', (err, result) => {
            res.send({ data: result });
            // console.log("result",result);

        });
    });
    // SELECT *  FROM `signals` WHERE `dt_date` = '2023-05-25' AND (`type` = 'LE' OR `type` = 'SE')

}