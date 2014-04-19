angular.module('diablelog', [])
.filter('timeformat', function () {
  return function (value) {

    var seconds = Math.floor((value) % 60);
    var minutes = Math.floor(((value / (60)) % 60));
    var hours = Math.floor(((value / (3600)) % 24));
    var days = Math.floor(((value / (3600)) / 24));

    var span = [
      (days > 0 ? dasy + '天' : ''),
      ((hours > 10 ? hours : '0' + hours) + '時'),
      ((minutes > 10 ? minutes : '0' + minutes) + '分鐘'),
      ((seconds > 10 ? seconds : '0' + seconds) + '秒')
    ];

    return span.join(' ');
  };
})
.directive('timeago', function(){
  return function (scope, element, attrs) {
    if (attrs.timeago) {
      var offset = Math.abs(attrs.timeago / 1000),
      raw = false,
      span = [],
      MINUTE = 60,
      HOUR = 3600,
      DAY = 86400,
      WEEK = 604800,
      MONTH = 2629744,
      YEAR = 31556926,
      DECADE = 315569260;

      if (offset <= MINUTE) span = ['', '1分鐘以內'];
      else if (offset < (MINUTE * 60)) span = [Math.round(Math.abs(offset / MINUTE)), '分鐘'];
      else if (offset < (HOUR * 24)) span = [Math.round(Math.abs(offset / HOUR)), '小時'];
      else if (offset < (DAY * 7)) span = [Math.round(Math.abs(offset / DAY)), '天'];
      else if (offset < (WEEK * 52)) span = [Math.round(Math.abs(offset / WEEK)), '星期'];
      else if (offset < (YEAR * 10)) span = [Math.round(Math.abs(offset / YEAR)), '年'];
      else span = ['', '很久很久以前'];

      //span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
      span = span.join(' ');

      element.html(span);
    };
  };
})
.controller('HomeCtrl', ['$scope', '$timeout', function($scope, $timeout) {
  //init
  var _active = false, _activeTime = new Date(), itemIndex = 1, timer, pauseTime = 0;
  $scope.timerRunning = false;
  $scope.items = [];
  $scope.item1Count = 0;
  $scope.item2Count = 0;
  $scope.counter = 0;

  //start timer
  function startTimer() {
    var onTimeout = function(){

        if (pauseTime) {
          $scope.counter = pauseTime;
          pauseTime = 0;
        }

        $scope.counter++;
        //$scope.$apply();
        timer = $timeout(onTimeout,1000);
    }
    timer = $timeout(onTimeout,1000);
  }

  //pause timer
  function pauseTimer() {
    stopTime = $scope.counter;
    $timeout.cancel(timer);
  }

  //reset timer
  function resetTimer() {
    pauseTime = 0;
    $scope.counter = 0;
    $timeout.cancel(timer);
    startTimer();
  }

  //timer start and resume
  $scope.activeTimer = function (){
    _active = true;
    if (!_active) {
      _activeTime = new Date();
    }

    if (!$scope.timerRunning) {
      startTimer();
    } else {
      //resume
      pauseTimer();
    }

    $scope.timerRunning = !$scope.timerRunning;
  };

  //add item
  $scope.addItem = function(type) {
    //new item
    var new_item = {
      index: itemIndex++,
      type: type,
      getTime: new Date()
    };

    //計算間隔時間
    var lastItem = $scope.items[$scope.items.length - 1];
    var time = lastItem ? lastItem.getTime : _activeTime;
    new_item.spanTick = new_item.getTime - time;

    $scope.items.push(new_item);
    resetTimer();
  };

  $scope.removeItem = function () {
    $scope.items.pop();
  };


  window.onbeforeunload = function() {
    if (_active) {
      return '記錄器正在使用中，確定要離開嗎？';
    }
  };

}]);
