

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

// RegExp Escape
RegExp.quote = function(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};


// List of HTML entities for escaping.
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

// Regex containing the keys listed immediately above.
var htmlEscaper = /[&<>"'\/]/g;

// Escape a string for HTML interpolation.
_.escape = function(string) {
  return ('' + string).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};


app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt', limit: 50},
    contentType: 'application/json',
    success: function(data) {
      for(var i = 0; i<data.results.length;i++){
        app.renderMessage(data.results[i]);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  var tweet = $('<div></div>');
  var username = _.escape(message.username).replace(/\s/g, '')
  
  var escapedText = _.escape(message.text);
  var escapedUsername = _.escape(message.username);
  var excapedRoom = _.escape(message.roomname);
  
  var escapedMessage = {};
  escapedMessage.text = escapedText;
  escapedMessage.username = escapedUsername;
  escapedMessage.roomname = excapedRoom;
  
  tweet.append('<span class=message>' + escapedText + '</span>');
  tweet.append('<span class=username> - ' + escapedUsername + '</span>');
  tweet.addClass(excapedRoom); 
  tweet.addClass(escapedUsername);  
  
  $('#chats').prepend(tweet);
  app.renderRoom(escapedMessage);
  
  tweet.click(function() {
    //fix friendslist
    //console.log('tweet', this.classList[0]);
    //var classes = $(this).parent().attr('class').split(' ');
    // console.log(classes);
    // console.log(classes[1]);
    //l
    if(!this.classList.contains('friendsList')){
      this.classList.add('friendsList');  
      $('.'+ this.username).toggleClass('friendslist');
    }else{
      this.classList.remove('friendsList');
      $('.'+ this.username).toggleClass('friendslist');
    }
  
  });
};


app.renderRoom = function(message) {
  var rooms = $('.dropdown-content').children().html();
  console.log(rooms);
  var duplicateRoomname = false;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i] === message.roomname) {
      duplicateRoomname = true;
    }
  }
  if (!duplicateRoomname) {
    $('.dropdown-content').prepend('<a href="#">' + message.roomname + '</a>');
  }
};

//Begin document functions
$(document).ready(function() {
  let $body = $('body');
  
  $('.clearMessages').on('click', function() {
    app.clearMessages();
  });
  
  // need to update roomlist to show all rooms from messages
  // need to click room and show only messages from that chatroom
  $('.add-room').on('click', function() {
    var room = {};
    var roomname = prompt("Please enter room name");
    room.roomname = roomname;
    if (room.roomname !== null) {
      app.renderRoom(room);
    }
  });

  $('#myform').submit(function(event){
      generateUserMessage();
      event.preventDefault();
  });
  
  // document.getElementById('myForm').addEventListener("Submit", testfunc());
  
  var testfunc = function(){
    console.log('test');
  }
  //need to get username
  //need to get roomname
  var generateUserMessage = function(){
    var windowData = window.location.search;
    var user = windowData.substring(windowData.indexOf('username=') + 9, windowData.length);
    var text = document.getElementById('userInput').value;
    var obj = {};
    obj.text = text;
    obj.username = user;
    obj.roomname = 'lobby';
    app.renderMessage(obj);
  }

  var generateMessages = function() {
    app.fetch(function(output) {
    });
  }; 
  
    
  // var message = {
  //   username: 'Ricardo & Steven',
  //   text: 'HR',
  //   roomname: 'hr'
  // };

  // app.send(message);
  generateMessages();    

});
