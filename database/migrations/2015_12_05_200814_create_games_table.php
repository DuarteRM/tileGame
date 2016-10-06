<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('state'); // 1 - Pending, 2 - active
            $table->integer('created_by')->unsigned();
            $table->integer('won_by')->nullable();
            $table->string('name',70);
            $table->integer('lines');
            $table->integer('columns');
            $table->integer('type'); // 1 - Private, 2 - Public
            $table->integer('total_players');
            $table->string('password')->nullable(); //private game password
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users');

        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games');
    }
}
