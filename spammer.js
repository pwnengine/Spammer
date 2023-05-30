var http       = require('http');
var url        = require('url');
var fs         = require('fs');
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

    /*
    *  read file
    *  nodemailer emails
    */

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