const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const events = require('events');

 
var students = '';


const eventEmitter = new events.EventEmitter();

eventEmitter.once('register_complete',function(){
  console.log('New student registered')
students = '';
fs.readdir("./db", (err, allFiles) => {
  if (err) {
    console.log(err);
  } else {
    // console.log('Insid else out of foreach')
    allFiles.forEach(file => {
      let data = fs.readFileSync(`db/${file}`,'utf8');
      // console.log(data)
    })
    for(let i = 0; i < allFiles.length; i++){
      fs.readFile(
        `./db/${allFiles[i]}`,
        "utf8",
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var data1 = JSON.parse(data)
            students += `<tr><td>${data1.fields.name}</td><td>${data1.fields.age}</td><td>${data1.fields.department}</td><td>${data1.fields.Fees}</td><td>X</td></tr>`
          }
        }
      );
    }
  }
});
})

eventEmitter.on('update_complete', (err) => {
  if(err){
    console.log(err)
  }else {
    console.log('Student Updated')
  }
})

fs.readdir("./db", (err, allFiles) => {
    if (err) {
      console.log(err);
    } else {
      // console.log('Insid else out of foreach')
      allFiles.forEach(file => {
        let data = fs.readFileSync(`db/${file}`,'utf8');
        // console.log(data)
      })
      for(let i = 0; i < allFiles.length; i++){
        fs.readFile(
          `./db/${allFiles[i]}`,
          "utf8",
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              var data1 = JSON.parse(data)
              students += `<tr><td>${data1.fields.name}</td><td>${data1.fields.age}</td><td>${data1.fields.department}</td><td>${data1.fields.Fees}</td></tr>`
            }
          }
        );
      }
    }
});


const server = http.createServer((req, res) => {
  if (req.url === "/create" && req.method.toLowerCase() === "post") {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, image) => {
      fs.writeFile(
        `./backup/${fields.name}.txt`,
        JSON.stringify({ fields,image }, null, 2),
        err => {
          if (err) {
            console.log(err);
          }
        }
      )
      
      fs.writeFile(
        `./db/${fields.name}.txt`,
        JSON.stringify({ fields,image }, null, 2),
        err => {
          if (err) {
            console.log(err);
          } else {
            eventEmitter.emit('register_complete')
            console.log('Event Occur')
            // fs.readFile(`./db/${fields.name}.txt`,'utf8',(err,data)=>{
            //     if(err){
            //         console.log(err)
            //     }else {
            //         console.log(data)
            //     }
            // })
          }
        }
      );
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  //delete student
  if (req.url === "/delete") {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, image) => {
      
      fs.unlink(`./db/${fields.name}.txt`, err => {
        if(err){
          console.log(err)
        }else {
          eventEmitter.emit('delete_complete')
        }
      })
    });

    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(`<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/css/bootstrap.min.css" />
      <link rel="stylesheet" href="style.css" />
      <title>Assignment</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
    </head>
    <body>
      <h1>Delete Student</h1>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Student System</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/create">Create <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/update">Update</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="/delete">Delete</a>
          </li>
        </ul>
      </div>
    </nav>
      <div class="row">
        <div class="col">
          <div class="container">
            <form
              action="/delete"
              enctype="multipart/form-data"
              method="post"
            >
              <div class="form-group">
                Name: <input type="text" class="form-control" placeholder="Enter Name To Delete" name="name" />
              </div>
              <input
                class="btn btn-outline-secondary"
                type="submit"
                value="Delete"
              />
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>
  `);
  }

  //Update Student Data 
  if (req.url === "/update") {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, image) => {
      fs.writeFile(
        `./db/${fields.name}.txt`,
        JSON.stringify({ fields,image }, null, 2),
        err => {
          if (err) {
            console.log(err);
          } else {
            eventEmitter.emit('update_complete')
            console.log('Event Occur')
          }
        }
      );
     });

    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(`<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/css/bootstrap.min.css" />
      <link rel="stylesheet" href="style.css" />
      <title>Assignment</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
    </head>
    <body>
      <h1>Update Student</h1>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Student System</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/create">Create <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item active">
          <a class="nav-link" href="/update">Update</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/delete">Delete</a>
        </li>
      </ul>
    </div>
  </nav>
      <div class="row">
        <div class="col-md-8">
          <div class="container">
            <form
              action="/update"
              enctype="multipart/form-data"
              method="post"
            >
              <div class="form-group">
                Name: <input type="text" class="form-control" name="name" />
              </div>
              <div class="form-group">
                Age: <input type="text" class="form-control" name="age" />
              </div>
              <div class="form-group">
                Department:
                <input type="text" class="form-control" name="department" />
              </div>
              <div class="form-group">
                School Fees:
                <input type="number" class="form-control" name="Fees" />
              </div>
              <div class="form-group">
                Photo:
                <input
                  type="file"
                  class="form-control"
                  name="multipleFiles"
                  multiple="multiple"
                />
              </div>
              <input
                class="btn btn-primary"
                type="submit"
                value="Update"
              />
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>
  `);
  }

  // show a file upload form
  res.writeHead(200, { "Content-Type": "text/html" });
  // var myReadStream = fs.createReadStream(__dirname + "/index.html", "utf8");
  // myReadStream.pipe(res);
   res.end(`<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
    <link rel="stylesheet" href="style.css" />
    <title>Assignment</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
  </head>
  <body>
    <h1>Register System</h1>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Student System</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="/create">Create <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/update">Update</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/delete">Delete</a>
        </li>
      </ul>
    </div>
  </nav>
    <div class="row">
      <div class="col">
        <div class="container">
          <form
            action="/create"
            enctype="multipart/form-data"
            method="post"
          >
            <div class="form-group">
              Name: <input type="text" class="form-control" name="name" />
            </div>
            <div class="form-group">
              Age: <input type="text" class="form-control" name="age" />
            </div>
            <div class="form-group">
              Department:
              <input type="text" class="form-control" name="department" />
            </div>
            <div class="form-group">
              School Fees:
              <input type="number" class="form-control" name="Fees" />
            </div>
            <div class="form-group">
              Photo:
              <input
                type="file"
                class="form-control"
                name="multipleFiles"
                multiple="multiple"
              />
            </div>
            <input
              class="btn btn-outline-secondary"
              type="submit"
              value="Register"
            />
          </form>
        </div>
      </div>
      <div class="col">
        <div class="container data">
          <table class="table table-hover">
            <thead>
              <th>FullNames</th>
              <th>Age</th>
              <th>Department</th>
              <th>Fees</th>
            </thead>
            <tbody class="center">
                ${students}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>
`)

});

server.listen(8080, () => {
  console.log("Server listening on http://localhost:8080/ ...");
});
