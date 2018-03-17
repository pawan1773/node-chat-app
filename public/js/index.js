var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt:formattedTime
    });

    $('#messages').append(html);

   /*  var formattedTime = moment(message.createdAt).format('h:mm a')
    console.log('newMessage', message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${formattedTime} ${message.text}`);

    $('#messages').append(li); */
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        // for acknowledgment
        messageTextBox.val('');
    });
});
