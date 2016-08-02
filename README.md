# simple-express-restful
a simple restful web app with Node.js, Express and MongoDB.

Here are the goals:

* Learn what REST means in plain English
* Store and retrieve JSON data in a MongoDB collection using HTTP POST and HTTP GET
* Remove data from the collection using HTTP DELETE
* Use AJAX for all data operations
* Update the DOM with jQuery

### What is REST

Wikipedia, that infallible source, defines Representational State Transfer(REST).

We're going to borrow four basic design principles from [IBM's developerWorks website](http://www.ibm.com/developerworks/webservices/library/ws-restful/),and explain what they mean.

* Use HTTP methods explicitly.
* Be stateless.
* Expose directory structure-like URIs.
* Transfer XML, JavaScript Object Notation (JSON), or both.

##### Use HTTP Methods Explicitly
To retrieve data, use GET.
To create data, use POST.
To update or change data, use PUT.
To delete data, use DELETE.
    
##### Be Stateless
It boils down to `don't store state information on the server`.

If u must save state, save it on the client side via cookies or other methods.

##### Expose directory structure-like URIs
Good:

    http://app.com/files/video/skyrim/68

Bad:

    http://app.com/getfile.php?type=video&game=skyrim&pid=68
    
##### Transfer XML, JavaScript Object Notation (JSON), or both.

you can easily manipulate the data in your presentation layer without having to hit your servers, unless you need new data.


### Start Setup

    express simple-express-restful
    
Update `package.json`

    {
      "name": "simple-express-restful",
      "version": "0.0.0",
      "private": true,
      "scripts": {
        "start": "node ./bin/www"
      },
      "dependencies": {
        "body-parser": "~1.15.1",
        "cookie-parser": "~1.4.3",
        "debug": "~2.2.0",
        "express": "~4.13.4",
        "jade": "~1.11.0",
        "morgan": "~1.7.0",
        "serve-favicon": "~2.3.0",
        "mongodb": "^1.4.4",
        "monk": "^1.0.1"
      }
    }

Then, `npm install`

And `mkdir data `, to create folder for MongoDB data.

### Change HTML

Update layout.jade for two things. 
    
* Include jQuery.
* Include master javascript file.

So, update layout.jade like this:

    doctype html
    html
        head
            title= title
            link(rel='stylesheet', href='/stylesheets/style.css')
        body
            block content
            script(src='//cdn.bootcss.com/jquery/3.1.0/jquery.min.js')
            script(src='/javascripts/global.js')
    
And create `gloable.js` in `/publi/javascripts` directory. And update `style.css` in `/public/stylesheets` like following codes.
 
    body {
      padding: 30px;
      font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
    }
    
    h2 {
      margin:0 0 .5em 0;
    }
    
    a {
      color: #00B7FF;
    }
    
    #wrapper {
      padding-left:312px;
      position:relative;
    }
    
    #userList {
      margin:0 0 30px 0;
    }
    #userList table {
      border-collapse:separate;
      border-spacing:1px;
      background:#CCC;
    }
    #userList table th {
      background:#EEE;
      font-weight:600;
      padding:10px 20px;
      text-align:center;
    }
    #userList table tbody {
      padding:0; margin:0;
      border-collapse:collapse;
      border-spacing:0px;
    }
    #userList table td {
      background:#FFF;
      padding:5px 10px;
      text-align:center;
    }
    
    #userInfo {
      width:250px;
      position:absolute;
      top:0; left:0;
    }
    #userInfo p {
      padding:15px;
      border:1px solid #CCC;
      background:rgba(80,120,255,0.05);
    }
    
    fieldset {
      border:0;
      padding:0; margin:0;
    }
    
Then open index.jade. And update its skeleton to complex.

    extends layout
    
    block content
        h1= title
        p Welcome to #{title}
    
        //Wrapper
        #wrapper
    
            // User list
            h2 User List
            #userList
                table
                    thead
                        th UserName
                        th Email
                        th Delete?
                    tbody
             // / User list
        // / Wrapper
    
Then run it.

### Database

create database.

    use simple-express-restful
    
Insert data list.

    db.userlist.insert({'username' : 'test1','email' : 'test1@test.com','fullname' : 'Bob Smith','age' : 27,'location' : 'San Francisco','gender' : 'Male'})
    
### List Users
Change `app.js` to list users.

Need to add some hooks for Monk.

    //Database
    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('localhost:27017/simple-express-restful');
    
Add these codes above defining routers. And then, make our database accessible to our various http requests.

    //Make our db accessible to our router
    app.use(function (req, res, next) {
      req.db = db;
      next();
    });
    
Add cods above use router.

Next to move on to routing.

Find `users.js` in `/routes`, update three line under the comments.

    router.get('/userlist', function(req, res) {
      var db = req.db;
      var collection = db.get('userlist');
      collection.find({},{}, function (e, docs) {
        res.json(docs);
      });
    });
    
It means if you do an HTTP GET to /users/userlist, server will return JSON that lists all of the users in the database.

Then update `global.js` to fill user list table via javascript.

    // UserList data array for filling in info box.
    var userListData = [];
    
    //DOM ready==============
    $(document).ready(function () {
        //Populate the user table on initial page load
        populateTable();
    });
    
    //Function ===========
    
    //Fill table with data
    function populateTable() {
    
        //Empty content string
        var tableContent = '';
    
        //jQuery AJAX call for JSON
        $.getJSON('/users/userlist', function (data) {
            //For each item in our JSON, add a table row and cells to the content string
            $.each(data, function () {
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">'+this.username+'</a> </td>';
                tableContent += '<td>'+this.email+'</td>';
                tableContent += '<td><a href="#" class="linkdeleteuser" rel="' +this._id +'">delete</a></td>';
                tableContent += '</tr>';
            });
    
            //Inject the whole content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
        });
    };
  
### Show User Info

First, Stick user data array into a userlist variable in global object
Add a line above `$.each` to stick the data:

    // Stick our user data array into a userlist variable in the global object
        userListData = data;

Then, Start add codes about showing user info function.
It happens after clicking on the `username` in user list table. when click, left panel will show user info.
Need to define a function named `showUserInfo`, and put `event` as a param.

Code like this:

    // Show User Info
    function showUserInfo(event) {
    
        // Prevent Link from Firing
        event.preventDefault();
    
        // Retrieve username from link rel attribute
        var thisUserName = $(this).attr('rel');
    
        // Get Index of object based on id value
        var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
        // Get our User Object
        var thisUserObject = userListData[arrayPosition];
    
        //Populate Info Box
        $('#userInfoName').text(thisUserObject.fullname);
        $('#userInfoAge').text(thisUserObject.age);
        $('#userInfoGender').text(thisUserObject.gender);
        $('#userInfoLocation').text(thisUserObject.location);
        
        };
  
Look at the codes.

* Get user name from click item.
* Get array list only contains usernames.
* Get from the list by username for getting full user info.
* Display it.

Next, update `index.jade` to add a panel for user info. And add following codes between `#wrapper` and `h2 User List`.

    // USER INFO
            #userInfo
                h2 User Info
                p
                    strong Name:
                    |  <span id='userInfoName'></span>
                    br
                    strong Age:
                    |  <span id='userInfoAge'></span>
                    br
                    strong Gender:
                    |  <span id='userInfoGender'></span>
                    br
                    strong Location:
                    |  <span id='userInfoLocation'></span>
            // /USER INFO
            

### Add User

Add a set of form fields with which to add a new user. add following codes right below user list ,but above the closing wrapper comment:

    //Add User
            h2 Add User
            #addUser
                fieldset
                    input#inputUserName(type='text', placeholder='Username')
                    input#inputUserEmail(type='text', placeholder='Email')
                    br
                    input#inputUserFullname(type='text', placeholder='Full Name')
                    input#inputUserAge(type='text', placeholder='Age')
                    br
                    input#inputUserLocation(type='text', placeholder='Location')
                    input#inputUserGender(type='text', placeholder='gender')
                    br
                    button#btnAddUser Add User
            // /Add User 
     
Then, add POSTing for adding user in `users.js`.

    /**
     * POST to adduser.
     */
    router.post('/adduser', function (req, res) {
      var db = req.db;
      var collection = db.get('userlist');
      collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg:''}:{msg:err}
        );
      });
    });
    
Update `global.js` to make button effect.Add following codes below user list name click.

    // Add User button click
        $('#btnAddUser').on('click', addUser);
        
build `addUser` function.POST data via AJAX to addUser service.

    //Add User
    function addUser(event) {
        event.preventDefault();
    
        //Super basic validation - increase errorCount variable if any fields are blank
        var errorCount = 0;
        $('#addUser input').each(function (index, val) {
            if ($(this).val() === ''){errorCount++;}
        });
    
        //Check and make sure errorCount's still at zero
        if (errorCount === 0){
    
            //If it is, compile all user info into one object
            var newUser = {
                'username' : $('#addUser fieldset input#inputUserName').val(),
                'email' : $('#addUser fieldset input#inputUserEmail').val(),
                'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
                'age' : $('#addUser fieldset input#inputUserAge').val(),
                'location' : $('#addUser fieldset input#inputUserLocation').val(),
                'gender' : $('#addUser fieldset input#inputUserGender').val()
            }
    
            //Use AJAX to post the object to our adduser service
            $.ajax({
                type: 'POST',
                data: newUser,
                url: '/users/adduser',
                dataType: 'JSON'
            }).done(function (response) {
    
                //Check for successful response
                if (response.msg === ''){
                    //Clear the form inputs
                    $('#addUser fieldset input').val('');
    
                    //Update the table
                    populateTable();
                }else{
                    //If something goes wrong, alert the error message thatour service returned
                    alert('Error: '+ response.msg);
                }
            });
        }else{
            //If errorCount is more than 0, error out
            alert('Please fill in all fields');
            return false;
        }
    };
    
