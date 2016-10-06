<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Games;
use DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\GameRequest;
use Illuminate\Http\Redirect;

class GameController extends Controller
{


    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $games = Games::all();
        $playerJSON = json_encode(Auth::user());
        return View('game.list', ['games' => $games, 'playerJSON' => $playerJSON]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return View('game.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GameRequest $request)
    {
        if(strlen($request->input('password')) === 0){
            $password = null;
        }else{
            $password = $request->input('password');
        }


        Games::create([
            'name' => $request->input('name'),
            'lines' => $request->input('lines'),
            'columns' => $request->input('columns'),
            'type' => $request->input('type'),
            'total_players' => $request->input('total_players'),
            'created_by' => Auth::user()->id,
            'password' => $password,
            'state' => 1
        ]);

        return redirect()->action('GameController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $game = DB::table('games')->where('id', $id)->first();
        $gameJSON = json_encode($game);
        $playerJSON = json_encode(Auth::user());
        return View('game.show', array('game' => $game, 'gameJSON' => $gameJSON, 'playerJSON' => $playerJSON));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }



    public function getDataBaseGameList(){
        $gameListJSON = json_encode(Games::all());
        return $gameListJSON;
    }

    public function getGame(Request $request){
        $game = DB::table('games')->where('id', $request->input('invisible'))->first();
        $gameJSON = json_encode($game);
        $playerJSON = json_encode(Auth::user());
        $playerModeJSON = json_encode(['mode' => $request->input('mode')]);
        return View('game.show', array('gameJSON' => $gameJSON, 'playerJSON' => $playerJSON, 'playerModeJSON' => $playerModeJSON));
    }


    public function getListOfGames(Request $request){
        $games = Games::whereIn('id', explode(',' ,$request->input('invisible')))->get();
        $gamesJSON = json_encode($games);
        $playerJSON = json_encode(Auth::user());
        $playerModeJSON = json_encode(['mode' => 'player']);
        return view('games.show')->with(['gamesJSON' => $gamesJSON])->with( 'playerJSON', $playerJSON )->with('playerModeJSON', $playerModeJSON);
    }


}
