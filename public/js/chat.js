var socket = io();

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            window.location.href = '/';
        } else {
            console.log('No errors');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    $('#users').empty();
    var chipsContainer = $('<div></div>');
    users.forEach(function (user) {
        chipsContainer.append($('<div class="chip green lighten-1 chip-margin"></div>').text(user));
    });
    $('#users').html(chipsContainer);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
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
