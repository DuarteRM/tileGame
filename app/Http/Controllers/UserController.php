<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\Games;
use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Redirect;
use Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $playerJSON = json_encode(Auth::user());
        $playerGamesJSON = json_encode(Games::where('created_by', Auth::user()->id)->get());
        return View('user.list', ['playerJSON' => $playerJSON, 'playerGamesJSON' => $playerGamesJSON]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return View('user.create');
    }
    /**
     * Store a newly created resource in storage.
     *
     *
     */
    public function store(UserRequest $request)
    {
        User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
            'type' => $request->input('type'),
        ]);


        $user = new User();

        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = $request->input('password');

        Auth::login($user);
            // Authentication passed...
            $playerJSON = json_encode(Auth::user());
            $playerGamesJSON = json_encode(Games::where('created_by', Auth::user()->id)->get());
            return View('user.list', ['playerJSON' => $playerJSON,'playerGamesJSON' => $playerGamesJSON]);
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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

    public function storeGuest(){

        $countUsers = User::all()->count();
        $numUsers = ($countUsers * 1000) + 1;
        $user = new User();
        $user->name = 'guest'.$numUsers;
        $user->email = 'guest'.$numUsers.'@dad.pt';
        $user->password = bcrypt($user->name);
        $user->type = 2; //guest
        $user->save();

        Auth::login($user);
        return redirect()->route('game.index');
    }
}
