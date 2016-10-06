<!DOCTYPE html>
<html>
<head>
    <title>Game</title>
    <meta charset="UTF-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"
          integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/normalize.css">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <script src="/angular/main/mainScript.js" type="text/javascript"></script>
    <script src="/angular/game.js" type="text/javascript"></script>
    <script src="/angular/user/userController.js" type="text/javascript"></script>
    <script src="/angular/game/gameController.js" type="text/javascript"></script>
    <script src="/angular/game/formController.js" type="text/javascript"></script>
    <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
</head>
<body ng-app="MainApplication">
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a href="{{ route('game.index') }}" class="navbar-brand">The Game</a>
        </div>
        <ul class="nav navbar-nav">
            <li><a href="{{ route('user.index') }}">My Games Info</a></li>
            <li><a href="{{ route('game.index') }}">All Games</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
            @if (Auth::check())
                <li><a href="{{ route('user.index') }}">Hi {{Auth::user()->name}}</a></li>
                <li><a href="{{ route('auth/logout') }}">Logout</a></li>
            @else
                <li><a href="{{ route('auth/login') }}">Login</a></li>
            @endif

        </ul>
    </div>
</nav>

<div>
    @yield('content')
</div>

</body>
<footer>
</footer>
</html>
