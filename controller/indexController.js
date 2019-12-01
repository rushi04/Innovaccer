var jwt = require('jsonwebtoken');
var config = require('../config/dbconnection')
const nodemailer = require("nodemailer");
var conn = config.emsdb;

// conn.connect();

var ems_app = {

    //function to add a visitor to the db
     addvisitor :function (req,callback){
         var hostid = req.body.hostid;
         var name = req.body.name;
         var email = req.body.email;
         var mobile = req.body.mobile;
         var checkintime = req.body.checkintime;
         var checkouttime = req.body.checkouttime;
         var ischeckedin = 1;
         var ischeckedout = 0;
         var address = "innoavccer noida";

         console.log(email);
         let sql = "SELECT * FROM visitor_tbl WHERE email = ?";
         let result = conn.query(sql,[email]);
         console.log(result.length);
         conn.query(sql,[email], function (err, rows, fields) {
            if (err) throw err
            console.log(rows[0]);
            if(rows[0])
            {
                if(rows[0].ischeckedout==0)
                    {
                        let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"true",Result:"visitor didn't check out"};
                        conn.end();
                        callback(done);
                        return true;
                        console.log("het")
                    }

                    //else we will update his details
                    //can handle with a promise
                    let sql1 = "UPDATE visitor_tbl set checkintime = ?, hostid = ?, ischeckedin = 1, ischeckedout = 0 WHERE email = ?";
                    let result1 = conn.query(sql1,[checkintime,hostid,email]);
                    let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"false",Result:"visitor updated"};
                    callback(done);
                    return true;
            }
            else{
                let sql1 = "INSERT INTO visitor_tbl (hostid, name, email, mobile, checkintime,checkouttime,ischeckedin,ischeckedout,address) VALUES (?,?,?,?,?,?,?,?,?)";
                let result1 = conn.query(sql1,[hostid, name, email, mobile, checkintime,checkouttime,ischeckedin,ischeckedout,address]);
                let done = {Status: true, Error_Code:0,Error_Desc:"No errorr",Exist:"false",Result:"visitor inserted"};
                callback(done);
                return true;

            }
          })

        
     },

     addhost :function (req,callback){
        var hostid = req.body.hostid;
        var name = req.body.name;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var checkintime = req.body.checkintime;
        var checkouttime = req.body.checkouttime;
        var ischeckedin = 1;
        var ischeckedout = 0;
        var address = "innoavccer noida";

        console.log(email);
        let sql = "SELECT * FROM host_tbl WHERE email = ?";
        let result = conn.query(sql,[email]);
        console.log(result.length);
        conn.query(sql,[email], function (err, rows, fields) {
           if (err) throw err
           console.log(rows[0]);
           if(rows[0])
           {
               if(rows[0].ischeckedout==0)
                   {
                       let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"true",Result:"visitor didn't check out"};
                       conn.end();
                       callback(done);
                       return true;
                       console.log("het")
                   }

                   //else we will update his details
                   //can handle with a promise
                   let sql1 = "UPDATE host_tbl set checkintime = ?, hostid = ?, ischeckedin = 1, ischeckedout = 0 WHERE email = ?";
                   let result1 = conn.query(sql1,[checkintime,hostid,email]);
                   let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"false",Result:"visitor updated"};
                   callback(done);
                   return true;
           }
           else{
               let sql1 = "INSERT INTO host_tbl (hostid, name, email, mobile, checkintime,checkouttime,ischeckedin,ischeckedout,address) VALUES (?,?,?,?,?,?,?,?,?)";
               let result1 = conn.query(sql1,[hostid, name, email, mobile, checkintime,checkouttime,ischeckedin,ischeckedout,address]);
               let done = {Status: true, Error_Code:0,Error_Desc:"No errorr",Exist:"false",Result:"visitor inserted"};
               callback(done);
               return true;

           }
         })

       
    },

    checkoutvisitor:function(req,callback)
    {
        var email = req.body.email;
        let sql = "SELECT * from visitor_tbl WHERE email = ?";
        conn.query(sql,[email], function (err, rows, fields) {
            if (err) throw err
            console.log(rows[0]);
            if(rows[0])
            {
                //send email and msg
                let hostid = rows[0].hostid;
                var visitoremail = rows[0].email;
                let xyz = sendemail(visitoremail); 
                let sql0 = "SELECT * from host_tbl WHERE hostid = ?";
                conn.query(sql0,[hostid], function (err, row, fields) {
                    if (err) throw err
                    console.log(row[0]);
                    var hostemail = row[0].email;
                })
                let sql1 = "UPDATE visitor_tbl set checkouttime = ?, ischeckedout = 1 WHERE email = ?";
                var date = new Date();
                var timestamp = date.getTime();
                let result1 = conn.query(sql1,[timestamp,email]);
                let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"false",Result:"visitor checkedout"};
                callback(done);
                return true;
            }
            else
            {
                let done = {Status: true, Error_Code:0,Error_Desc:"No error",Exist:"false",Result:"visitor not found"};
                callback(done);
                return true;
            }

        })
    },
    
}
module.exports = ems_app;

async function sendemail(email) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <rushirocks2136@gmal.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return info;
  }
  
  sendemail().catch(console.error);