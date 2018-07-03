

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,

  init: function() {
    app.username = window.location.search.substr(10);

    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    app.$send.on('submit', app.handleSubmit);

    app.fetch();

    // setInterval(function() {
    //   app.fetch();
    // }, 3000);
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        if (!data.results || !data.results.length) { return; }
          app.messages = data.results;
          var mostRecentMessage = app.messages[app.messages.length - 1];
          if (mostRecentMessage.objectId !== app.lastMessageId) {
            app.renderMessages(app.messages)
          }
        },
      error: function(error) {
        console.error(error);
      }
    })
  },

  renderMessages: function(messages) {
    app.clearMessages();
    messages.forEach(app.renderMessages);
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessage: function(messages) {
      var $chat = $('<div class="chat"/>');

      var $username = $('<span class="username">' + messages.text + '</span>');
      $username.appendTo($chat);

      var $message = $('<br><span>' + messages.text + '</span>');
      $message.appendTo($chat);

      app.$chats.append($chat)
  },

  handleSubmit: function(event) {
    var message = {
        username: app.username,
        test: app.$message.val(),
        roomname: app.roomname || 'lobby'
      };

    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function() {
        app.fetch();
      },
      error: function(error) {
        console.error(error);
      }
    });
    event.preventDefault();
  },

};