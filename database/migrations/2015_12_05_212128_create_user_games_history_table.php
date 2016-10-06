<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserGamesHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_games_history', function(Blueprint $table)
        {
            $table->integer('user_id')->references('id')->on('users');
            $table->integer('games_history_id')->references('id')->on('games_history');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('user_games_history');
    }
}
