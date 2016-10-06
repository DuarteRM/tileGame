<?php

namespace App\Http\Requests;

class GameRequest extends Request
{
  public function authorize()
  {
    return true;
  }


  public function rules()
  {
    return [
      'name' => 'required|string|min:5',
      'lines' => 'required|integer|max:10|min:2',
      'columns' => 'required|integer|max:10|min:2',
      'type' => 'required|integer',
      'total_players' => 'required|integer|max:10|min:1'
    ];
  }

  public function messages()
  {
    return [
      'name.required' => ' The name of Game is required',
      'lines.max' => 'The game can only have lines between 2 and 10',
      'lines.min' => 'The game can only have lines between 2 and 10',
      'columns.max' => 'The game can only have columns between 2 and 10',
      'columns.min' => 'The game can only have columns between 2 and 10'
    ];
  }
}
