
//var socket = io.connect('http://localhost:3000');

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
function setPseudo(pseudo) {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#chatEntries').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
        pseudo = $("#pseudoInput").val();
        console.log(pseudo);
    }
    else {
        alert('Type in a username.');
    }
}


//log message and align left or right depending on who sent the message
function addMessage(msg, pseudo) {
    if (pseudo === 'You'){
        $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
        console.log('move normal');
    }
    else {
        $("#chatEntries").append('<div class="message right"><p>' + msg + ' : ' + pseudo + '</p></div>');
        console.log('move right');
    }
}

function sentMessage(pseudo) {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val()), pseudo;
        addMessage($('#messageInput').val(), 'You');
        
        //empty msg box
        $('#messageInput').val('');
    }
    else {
        alert('No message typed!');
    }
}

//
function resetScroll() {
    var enter = $("#chatEntries");
    enter.scrollTop(enter.prop("scrollHeight") - enter.height());
}

$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {
        setPseudo();
        var pseudo = $("#pseudoInput").val();
        console.log(pseudo);
    });
});


function keyo() {
    sentMessage();
    resetScroll();
    //enter.animate({ scrollTop: enter.prop("scrollHeight") - enter.height() }, 3000);
}
    $("#submit").click(function() {
        sentMessage(pseudo);
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