'use strict';

angular.module('insight.system').controller('TokensSearchController',
    function($scope, $rootScope, $route, gettextCatalog, ContractsRepository, lodash) {

        var self = this;

        self.init = function () {
            console.log('TokensSearchController Init');
        };

        var currentRequestUniqueId;
        var getDefaultSearchResult = function () {
            return {
                count: 0,
                items: []
            };
        };

        self.query = '';
        self.error = '';
        self.inProcess = false;
        self.searchResult = getDefaultSearchResult();


        var debounced = lodash.debounce(function (requestId) {

            if (currentRequestUniqueId !== requestId) {
                return false;
            }

            ContractsRepository.search.get({
                query: lodash.trim(self.query)
            }, function (res) {
                self.inProcess = false;
                if (currentRequestUniqueId === requestId) {
                    self.searchResult = res;
                }
            }, function () {
                self.error = 'Request Error!';
            });

        }, 550);

        self.search = function () {

            if (!lodash.trim(self.query)) {
                self.error = 'Search field is required!'
            } else {
                if (!self.inProcess) {
                    self.changeQuery();
                }

            }

        };

        self.reset = function () {

            currentRequestUniqueId = lodash.uniqueId();

            self.query = '';
            self.searchResult = {
                count: 0,
                items: []
            };

        };

        self.changeQuery = function () {

            self.error = '';
            self.inProcess = true;

            currentRequestUniqueId = lodash.uniqueId();

            if (!_.trim(self.query)) {
                self.reset();
                self.inProcess = false;
            } else {
                debounced(currentRequestUniqueId);
            }

        };

    });