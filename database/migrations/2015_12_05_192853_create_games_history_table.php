<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamesHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games_history', function (Blueprint $table) {
            $table->increments('id');
            $table->time('user_time');
            $table->time('game_time');
            $table->integer('user_moves')->unsigned()->default(0);
            $table->integer('user_score')->unsigned()->default(0);
            $table->integer('user_tiles')->unsigned()->default(0);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games_history');
    }
}
