
Parse.initialize("ThLiGFIjX0yQ4xfIRy0tAQfiAMTGiUKrMB2g0XeW", "bIYMVExXXn0239npxjTFO0Yk86LxvgqLgaZYGTCJ");

function save (user, msg) {
    var Chatroom = Parse.Object.extend("Chatroom");
    var chatroom = new Chatroom();
    chatroom.save({User: user, Message: msg}).then(function(object) {
      console.log("Saved msg");
    });
}

function loadMsg() {
    //Get 10 most recent chat messages.
    var Chatroom = Parse.Object.extend("Chatroom");
    query = new Parse.Query(Chatroom);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        for (var i = 9; i < results.length; i--) { 
          var object = results[i];
          var msgQuery = object.get('Message');
          var userQuery = object.get('User');
          console.log(userQuery + ' said: ' + msgQuery);
          addMessage(msgQuery, userQuery);
        }
      },
      error: function(error) {
        alert("Error when retrieving recent messages: " + error.code + " " + error.message);
      }
    });
}


$(function() {

    $('#setUp').hide();
    $('#newUserName').hide();
    $('#newPass').hide();
    $('#newEmail').hide();
    $('#sign').hide();

    $("#pseudoSet").click(function() {

        var username = $("#pseudoInput").val();
        var password = $("#pass").val();
    
        Parse.User.logIn(username, password, {
          success: function(user) {
            $('#chatControls').show();
            $('#chatEntries').show();
            $('#pseudoInput').hide();
            $('#pseudoSet').hide();
            $('#pass').hide();
            $('#signUp').hide();
            $('br').hide();

            setPseudo(username);
            console.log('success');
            loadMsg();
          },

          error: function(user, error) {
            function error() {
                $('input').addClass('error');

                $('input').click(function(){
                    $(this).removeClass('error');
                });
            };
            error();
            console.log('failed!');
          }
        });
    });

    $("#signUp").click(function(){

        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
        $('#pass').hide();
        
        $('#signUp').hide();

        $('#newUserName').show();
        $('#newPass').show();
        $('#newEmail').show();
        $('#sign').show();
    });

    $("#sign").click(function(){

        if ($('#newEmail').val() === "") {
            alert("Type in an email");
        }
        else {
            var newUsername = $("#newUserName").val();
            var newPass = $("#newPass").val();
            var newEmail = $("#newEmail").val();

            var user = new Parse.User();
            user.set("username", newUsername);
            user.set("password", newPass);
            user.set("email", newEmail);
              
            // other fields can be set just like with Parse.Object
            // user.set("school", "LBTS6");
              
            user.signUp(null, {
              success: function(user) {
                alert('You have been signed up!');
                setPseudo(newUsername);
                done();
                loadMsg();
                confirmEmail();
              },
              error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
                console.log('signup failed');
              }
            });
        }
        
    });

function confirmEmail() {
    var currentUser = Parse.User.current();
    var email = currentUser.get('email');
    var name = currentUser.get('username');

    // Create a function to log the response from the Mandrill API
    function log(obj) {
        $('#response').text(JSON.stringify(obj));
    }

    // create a new instance of the Mandrill class with your API key
    var m = new mandrill.Mandrill('7gXCx1yydMU4HbqhliUG9g');

    // create a variable for the API call parameters
    var params = {
        "message": {
            "from_email":"mowz971@gmail.com",
            "from_name": "Student Cloud",
            "to": [
                {
                    "email": email,
                    "name": "*|user|*",
                    "type": "to"
                }
            ],
            "subject": "Welcome to the Student Cloud!",
            "html": "<p>Dear *|user|*,</p><p>Please click the link below to confirm your subscription to the Student Cloud</p><img src=\"http://www.bjmlegal.co.uk/wp-content/uploads/2013/09/hello-1774.jpg\">",
            "autotext": true,
            "track_opens" : true,
            "track_clicks" : true,
            
            "merge_vars": [
                {
                    "rcpt": email,
                    "vars": [
                        {
                            "name": "user",
                            "content": name
                        }
                    ]
                }
            ]
            
        }
    };

    function sendTheMail() {
    // Send the email!
        m.messages.send(params, function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        });
    }
}

/*
    $("admin").click(function(){

        var subject = new.Array;
        subject.[];
        for(){
            //append
        }
        var school = $("#college").val();
        //var age = $("").val();
        var sub1 = $("")val();
        var sub2 = $("")val();
        var sub3 = $("")val();
        var sub4 = $("")val();

        var career1 = $("")val();
        var career2 = $("")val();
        var career3 = $("")val();


        var user = Parse.User.current();
        user.set("College", school);
        user.set("Subect 1", sub1);
        user.set("Subect 2", sub2);
        user.set("Subect 3", sub3);
        user.set("Subect 4", sub4);
        user.set("Career Choice 1", career1);
        user.set("Career Choice 1", career1);
        user.set("Career Choice 1", career1);
    });
*/
});



function done(){
    $('#newUserName').hide();
    $('#newPass').hide();
    $('#newEmail').hide();
    $('#sign').hide();
    $('br').hide();

    //$('#setUp').show();
    $('#chatControls').show();
    $('#chatEntries').show();
}

var socket = io.connect();
socket.on('connect', function() {
    console.log('connected');
});

//get n.o of users from server and log it
socket.on('nbUsers', function(msg) {
    $("#nb").html(msg.nb);
});

//get new messages from other clients
socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
    resetScroll();
    console.log(data);
});

//psuedo logged
function setPseudo(username) {
    var currentUser = Parse.User.current();
    var pseudo3 = currentUser.get('username');
    console.log(pseudo3);

    socket.emit('setPseudo', pseudo3);
}


//log message and align left or right depending on who sent the message
function addMessage(msg, pseudo) {
    var currentUser = Parse.User.current();
    var pseudo3 = currentUser.get('username');
    console.log(pseudo3);

    if (pseudo === pseudo3){
        $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
        console.log('move normal');
    }
    else {
        $("#chatEntries").append('<div class="message right"><p>' + msg + ' : ' + pseudo + '</p></div>');
        console.log('move right');
    }
    resetScroll();
}

function sentMessage(pseudo) {
    
    var currentUser = Parse.User.current();
    var pseudo3 = currentUser.get('username');
    console.log(pseudo3);

    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), pseudo3);

        //Bug Fixed. Keep save b4 clearance below!
        save($("#pseudoInput").val(), $('#messageInput').val());
        
        //empty msg box
        $('#messageInput').val('');

        
    }
    else {
        alert('No message typed!');
    }
}

function resetScroll() {
    var enter = $("#chatEntries");
    enter.scrollTop(enter.prop("scrollHeight") - enter.height());
}

$(function() {
    $("#chatControls").hide();
    /*$("#pseudoSet").click(function() {
        setPseudo();
        var pseudo = $("#pseudoInput").val();
        console.log(pseudo);
    });*/
});


function keyo() {
    sentMessage();
    resetScroll();
    //enter.animate({ scrollTop: enter.prop("scrollHeight") - enter.height() }, 3000);
}

$("#submit").click(function() {
    sentMessage();
});

window.onkeydown = function(e) {
    if(!e){
        e = window.event;
    }
    var keycode
    if(e.which){
        keycode = e.which;
    } else {
        keycode = e.keycode;
    }
    if (keycode == 13) {
    keyo();
    }
};


