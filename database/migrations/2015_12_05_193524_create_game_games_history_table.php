<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGameGamesHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('game_games_history', function (Blueprint $table) {
            $table->integer('game_id')->references('id')->on('games');
            $table->integer('game_history_id')->references('id')->on('games_history');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('game_games_history');
    }
}
