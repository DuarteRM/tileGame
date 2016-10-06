<!doctype html>
<html>

<head>
    <title>Socket.IO chat</title>


    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font: 13px Helvetica, Arial;
        }

        form {
            background: #000;
            padding: 3px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }

        form input {
            border: 0;
            padding: 10px;
            width: 90%;
            margin-right: .5%;
        }

        form button {
            width: 9%;
            background: rgb(130, 224, 255);
            border: none;
            padding: 10px;
        }

        #messages {
            liststyle-type: none;
            margin: 0;
            padding: 0;
        }

        #messages li {
            padding: 5px 10px;
        }

        #messages li:nth-child(odd) {
            background: #eee;
        }
    </style>



</head>

<body>
<ul id="messages">
</ul>
<form action="">
    <input id="m" autocomplete="off" />
    <button>Sends</button>
</form>

<table>
    <tbody>
    <tr>
        <td id = "1">1</td>
        <td id = "2">2</td>
    </tr>
    <tr>
        <td id = "3">3</td>
        <td id = "4">4</td>
    </tr>
    <tr>
        <td id = "5">5</td>
        <td id = "6">6</td>
    </tr>
    </tbody>
</table>

</body>

<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script>
    var socket = io('http://project3.app:8080');
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });

    $('td').on('click', function(){
        console.log(this.id);
        socket.emit('idTitle', this.id);
    });

    socket.on('change tile', function(idTile){
        $('#'+idTile).text("V");
    })

    socket.on('json teste', function(json){
        console.log(json);
        console.log(json.name);
    });

</script>

</html>