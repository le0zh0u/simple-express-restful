/**
 * Created by zhouchunjie on 16/8/1.
 */
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