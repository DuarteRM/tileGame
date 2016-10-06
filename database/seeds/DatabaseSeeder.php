<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('users')->insert(['name' => 'Pedro',
            'email' => 'pedro@dad.pt',
            'password' => bcrypt('pedro'),
            'type' => 1,
            'user_history_id' => 100]);

        DB::table('users')->insert(['name' => 'Francisco',
            'email' => 'francisco@dad.pt',
            'password' =>  bcrypt('francisco'),
            'type' => 1,
            'user_history_id' => 101]);

        DB::table('users')->insert(['name' => 'Duarte',
            'email' => 'duarte@dad.pt',
            'password' => bcrypt('duarte'),
            'type' => 1,
            'user_history_id' => 102]);

        DB::table('users')->insert(['name' => 'Diogo',
            'email' => 'diogo@dad.pt',
            'password' => bcrypt('diogo'),
            'type' => 1,
            'user_history_id' => 103]);

        DB::table('games')->insert(['state' => '1',
            'created_by' => '1',
            'won_by' => null,
            'name' => 'the_game',
            'lines' => '4',
            'columns' => '4',
            'type' => '1',
            'total_players' => '2',
            'password' => 'the_game'
        ]);

        DB::table('games')->insert(['state' => '1',
            'created_by' => '1',
            'won_by' => null,
            'name' => 'the_game',
            'lines' => '4',
            'columns' => '4',
            'type' => '1',
            'total_players' => '3',
            'password' => 'the_game'
        ]);

        DB::table('games')->insert(['state' => '2',
            'created_by' => '1',
            'won_by' => null,
            'name' => 'Game1',
            'lines' => '2',
            'columns' => '2',
            'type' => '2',
            'total_players' => '2',
            'password' => null
        ]);

        DB::table('games')->insert(['state' => '1',
            'created_by' => '3',
            'won_by' => null,
            'name' => 'Game2',
            'lines' => '2',
            'columns' => '2',
            'type' => '2',
            'total_players' => '2',
            'password' => null
        ]);

        DB::table('games')->insert(['state' => '1',
            'created_by' => '3',
            'won_by' => null,
            'name' => 'Game22',
            'lines' => '2',
            'columns' => '2',
            'type' => '2',
            'total_players' => '2',
            'password' => null
        ]);

        DB::table('games')->insert(['state' => '1',
            'created_by' => '3',
            'won_by' => null,
            'name' => 'Game3',
            'lines' => '2',
            'columns' => '2',
            'type' => '1',
            'total_players' => '2',
            'password' => 'game3'
        ]);
    }
}
