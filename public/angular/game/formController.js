main.controller('GameFormController', ['$scope', function ($scope) {

    var teste = document.getElementById('name');

    $scope.name = '';
    $scope.lines = 2;
    $scope.columns = 2;
    $scope.nameError = '';
    $scope.linesError = '';
    $scope.columnsError = '';
    $scope.errors = {};
    $scope.gameType = '';
    $scope.gamePassword = '';

    $scope.lineErrorMsg = {
        id: 1,
        msg: "The Line value is invalid, the value must be between 2 and 20"
    };

    $scope.columnErrorMsg = {
        id: 2,
        msg: "The Column value is invalid, the value must be between 2 and 20 "
    };

    $scope.nameErrorMsg = {
        id: 3,
        msg: "The name is mandatory"
    };

    $scope.passwordErrorMsg = {
        id: 4,
        msg: "The password is mandatory"
    };



    var loadDefaultErrors = function(){
        $scope.errors[$scope.nameErrorMsg.id] = $scope.nameErrorMsg.msg;
    };

    $scope.validateName = function(){
        if($scope.name.length === 0){
            $scope.errors[$scope.nameErrorMsg.id] = $scope.nameErrorMsg.msg;
        }else{
            delete $scope.errors[$scope.nameErrorMsg.id];
        }
    };

    $scope.validateLines = function(){
        if($scope.lines < 2 || $scope.lines > 10 || (($scope.columns * $scope.lines) % 2 != 0)){
            $scope.errors[$scope.lineErrorMsg.id] = $scope.lineErrorMsg.msg;
        }else{
            delete $scope.errors[$scope.lineErrorMsg.id];
        }
    };

    $scope.validateColumns = function(){
        if($scope.columns < 2 || $scope.columns > 10 || (($scope.columns * $scope.lines) % 2 != 0)){
            $scope.errors[$scope.columnErrorMsg.id] = $scope.columnErrorMsg.msg;
        }else{
            delete $scope.errors[$scope.columnErrorMsg.id];
        }
    };


    $scope.validateGamePassword = function(){
        if($scope.gamePassword === ''){
            $scope.errors[$scope.passwordErrorMsg.id] = $scope.passwordErrorMsg.msg;
        }else{
            delete $scope.errors[$scope.passwordErrorMsg.id];
        }
    };

    $scope.updateType = function(gameType){
        if(gameType == 2){
            delete $scope.errors[$scope.passwordErrorMsg.id];
        }else{
            $scope.errors[$scope.passwordErrorMsg.id] = $scope.passwordErrorMsg.msg;
        }
    }

    $scope.getErrorLength = function(){
        return Object.keys($scope.errors).length
    };

    $scope.gameIsPrivate = function(){
        console.log($scope.gameType);
        if($scope.gameType === 1){ //private
            return true;
        }
        return false;
    }


    loadDefaultErrors();

}]);

