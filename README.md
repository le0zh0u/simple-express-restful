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
It u must save state, save it on the client side via cookies or other methods.

##### Expose directory structure-like URIs
Good:

    http://app.com/files/video/skyrim/68

Bad:

    http://app.com/getfile.php?type=video&game=skyrim&pid=68
    
##### Transfer XML, JavaScript Object Notation (JSON), or both.

you can easily manipulate the data in your presentation layer without having to hit your servers, unless you need new data.