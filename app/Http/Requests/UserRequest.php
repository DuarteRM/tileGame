<?php
namespace App\Http\Requests;
class UserRequest extends Request
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'name' => 'required|unique:users|string|min:2',
            'email' => 'required|string|unique:users|min:4',
            'password' => 'required|min:3|confirmed',
            'password_confirmation' => 'required|same:password',
            'type' => 'required|integer'
        ];
    }
    public function messages()
    {
        return [
            'name.required' => ' The name of the player is required',
            'name.unique' => 'The name must be unique',
            'name.min' => ' The name is too short',
            'email.required' => ' The email is required',
            'email.unique' => 'The email must be unique',
            'email.min' => 'atleast 6 chars',
            'password.required' => 'the password is required',
            'password_confirmation.required' => 'the password is required',
            'password.min' => 'the password is too short, must have alteast 6 chars/numbers/symbols'
        ];
    }
}

