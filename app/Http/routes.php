<?php


Route::get('/', ['as' => 'default', 'uses' => 'Auth\AuthController@presentLogin']);


//External Logins
Route::get('auth/facebook', 'Auth\AuthController@redirectToProvider');
Route::get('auth/facebook/callback', 'Auth\AuthController@handleProviderCallback');

Route::resource('game', 'GameController');

Route::resource('user', 'UserController');


Route::get('/gameList', ['as' => 'game.dbList', 'uses' => 'GameController@getDataBaseGameList']);

Route::post('/game/load', ['uses' => 'GameController@getGame']);

Route::post('/games/load', ['uses' => 'GameController@getListOfGames']);

Route::post('/user/guest', ['as' => 'user.create.guest', 'uses' => 'UserController@storeGuest']);



//LOGIN ROUTES
Route::get('login', array('as' => 'auth/login','uses' => 'Auth\AuthController@getLogin'));
Route::post('login', array('as' => 'auth/login','uses' => 'Auth\AuthController@authenticate'));
Route::post('login/guest', ['as' => 'login/guest', 'uses' => 'UserController@authenticate']);
Route::get('auth/logout', array('as' => 'auth/logout', 'uses' => 'Auth\AuthController@getLogout'));


