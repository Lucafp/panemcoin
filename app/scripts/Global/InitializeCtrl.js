App.Global.controller(
    'InitializeCtrl',
    [
        '$scope', '$location', '$resource', '$rootScope', 'DaemonManager', 'wallet',
        function($scope, $location, $resource, $rootScope, DaemonManager, wallet) {

            var bootstrap = DaemonManager.getBootstrap();

            $scope.loadingStatus = 'Loading...';

            $scope.displayError = function (title, message) {
                $scope.loadingStatus = title;
                $scope.loadingStatusError = message;
            };

            $scope.initialize = function() {

                var promise = bootstrap.startLocal();

                promise.then(function(message) {
                    if (message.result) {
                        $location.path('/login');
                    } else {
                        $scope.displayError('Uh Oh!', message.message);
                    }
                });

            };

            $scope.initialize();

        }
    ]
);