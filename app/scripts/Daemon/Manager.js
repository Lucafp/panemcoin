App.Daemon.factory('DaemonManager',
    [
        '$q',
        '$timeout',
        '$interval',
        '$rootScope',
        'walletDb',
        function($q, $timeout, $interval, $rootScope, walletDb) {

            function Manager() {
                this.initialize();
            }

            Manager.prototype = {

                initialize: function() {
                    var self = this;

                    this.running = false;

                    this.bootstrap = new App.Daemon.Bootstrap($q, $timeout, $interval, $rootScope, walletDb);

                    /**
                     * This promise callback will set the running bool once the bootstrap has completed.
                     *
                     * @param {App.Global.Message} message
                     */
                    this.bootstrap.getPromise().then(function(message) {
                        self.running = message.result;

                        return message;
                    });

                },

                killDaemon: function () {
                    this.bootstrap.killDaemon();
                },

                getBootstrap: function() {
                    return this.bootstrap;
                },

                isRunning: function() {
                    return this.running;
                }

            };

            return new Manager();

        }

    ]
);