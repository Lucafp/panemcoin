App.Global.controller(
    'AppCtrl',
    [
        '$scope', '$interval', '$location', '$resource', '$rootScope', 'walletDb', 'DaemonManager',
        function($scope, $interval, $location, $resource, $rootScope, walletDb, DaemonManager) {

            $scope.walletDb = walletDb;

            $scope.walletOverview = {};
            $scope.walletStakingInfo = {};

            $scope.blockHeight = 0;
            $scope.blocksSynced = false;

            $scope.ircMessages = 0;
            $scope.explorerSearch = '';

            $scope.status = {
                noErrors: "Daemon working as intended. "
            };

            $rootScope.$on('irc.message.highlight', function (event) {
                if ($scope.activeNavId == '/irc') {
                    return;
                }

                $scope.ircMessages ++;
            });

            $scope.daemon = {
                running: false
            };

            $scope.searchExplorer = function () {
                if ($scope.explorerSearch == "") {
                    return;
                }

                var url = "http://bitinfocharts.com/reddcoin/search/" + $scope.explorerSearch;
                require('nw.gui').Shell.openExternal(url);
                $scope.explorerSearch = "";
            };

            $scope.openHelp = function () {
                var url = "http://www.reddit.com/r/reddCoin/wiki/index";
                require('nw.gui').Shell.openExternal(url);
            };

            DaemonManager.getBootstrap().getPromise().then(function(message) {
                fetchOverview();
                $scope.walletDb.syncAccounts();
                $scope.daemon.running = true;

                $rootScope.$on('daemon.notifications.block', fetchOverview);
                $rootScope.$on('daemon.notifications.alert', fetchOverview);
                $rootScope.$on('daemon.notifications.wallet', fetchOverview);
            });

            function fetchOverview() {
                $scope.walletDb.updateOverview().then(
                    function (message) {
                        $scope.walletOverview = $scope.walletDb.overviewModel;
                        $scope.errors = {
                            message: $scope.walletOverview.errors
                        };
                    }
                );

                $scope.walletDb.updateStaking().then(
                    function (message) {
                        $scope.walletStakingInfo = $scope.walletDb.stakingInfoModel;
                    }
                );

                $scope.walletDb.walletRpc.getStakingInfo().then(
                    function(message) {
                        $scope.walletStaking = message.rpcInfo;
                    }
                );

                $scope.walletDb.walletRpc.getWork().then(
                    function success (message) {
                        $scope.blocksSynced = true;
                    },
                    function error (message) {
                        $scope.blocksSynced = false;
                    }
                );

                $scope.walletDb.getTransactions();
            }

            $scope.$location = $location;
            $scope.$watch('$location.path()', function(path) {
                if (path == '/irc') {
                    $scope.ircMessages = 0;
                }

                return $scope.activeNavId = path || '/';
            });

            return $scope.getClass = function(id) {
                if ($scope.activeNavId.substring(0, id.length) === id) {
                    return 'active';
                } else {
                    return '';
                }
            };

        }
    ]
);