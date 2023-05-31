var http       = require('http');
var url        = require('url');
var fs         = require('fs');
var rl         = require('readline');
var nm         = require('nodemailer');
var formidable = require('formidable');

var server = new http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  var parsed_url = url.parse(req.url);
  
  if(parsed_url.pathname == "/spam") {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(err) throw err;

      var old_path = files.filetoupload.filepath;
      var new_path = "list.txt";

      fs.copyFile(old_path, new_path, function(err) {
        if(err) throw err;
      });

      console.log("[+] got list");
    });

    res.write("spammmm");

    var mail_transporter = nm.createTransport({
      service: 'gmail',
      auth: {
        user: 'gmail',
        pass: 'pass'
      }
    });

    var reader = rl.createInterface({
      input: fs.createReadStream('list.txt')
    });
  
    reader.on('line', function(row) {
      if(row != "\n") {
      var mail_opt = {
        from: 'from', 
        to: row,
        subject: 'hello', 
        text: 'whats up'
      };
      
      mail_transporter.sendMail(mail_opt, function(err, info) {
        if(err) console.log(err);

        console.log("sent to" + row + " response: " + info.response);
      });
    }
    });
  
    reader.on('close', function() {
      console.log('finished');
    });
 
    return res.end();
  } else { 
    fs.readFile('./upload.html', function(err, data) {
      if(err) throw err;
      res.write(data);


      return res.end();
    });
  }
});

server.listen(8080);