main.controller('UserInfoController', ['$scope', function($scope){


    $scope.playerInfo = '';
    $scope.playerGames = '';

    $scope.loadUserInfo = function(playerInfo, gamesInfo){
        $scope.playerInfo = playerInfo;
        $scope.playerGames = gamesInfo;
        console.log($scope.playerInfo);
        console.log($scope.playerGames);
    };


}]);
