var busboy = require('connect-busboy'),
    FormData = require('form-data'),
    express = require('express'),
    app = express(),
    fs = require('fs'),
    rimraf = require('rimraf'),
    crypto = require('crypto');
if (fs.existsSync('./files'))
    rimraf.sync('./files');
var storage = require('filestorage').create('./files');

app.use(busboy());

app.post('/*', function (req, res) {
    var form = {};
    req.busboy.on('field', function(fieldname, val) {
        form[fieldname] = val;
    });
    req.busboy.on('file', function(fieldname, file) {
        storage.insert(form.key, file, function (err, identifier, stat) {
            console.log('======================');
            console.log(form.key + ' stats');
            console.log('======================');
            console.log(stat);
            console.log('\n');

            res.end();
            if (form.quit)
                process.exit(0);
        });
    });

    req.pipe(req.busboy);
});

var port = process.env.PORT || 7000;
app.listen(port);

var formData = new FormData();
formData.append('key', 'correct.txt');
formData.append('file', fs.createReadStream('correct.txt'));

formData.submit('http://localhost:' + port, function (err, res) {
    var formData = new FormData();
    formData.append('quit', 'true');
    formData.append('key', 'incorrect.txt');
    formData.append('file', fs.createReadStream('incorrect.txt'));
    formData.submit('http://localhost:' + port, function (err, res) {});
});