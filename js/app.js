angular.module('diablelog', [])
.filter('timeformat', function () {
  return function (value, short) {
    var span,
        days = Math.floor(((value / (3600)) / 24)),
        seconds = Math.floor((value) % 60),
        minutes = Math.floor(((value / (60)) % 60)),
        hours = Math.floor(((value / (3600)) % 24));

    if (short) {
      span = [
      (days != 0 ? days + '天' : ''),
      (hours != 0 ? hours + '小時' : ''),
      (minutes != 0 ? minutes + '分鐘' : ''),
      (seconds != 0 ? seconds + '秒' : '')
      ]
    } else {
      span = [
      (days > 0 ? days + '天' : ''),
      ((hours >= 10 ? hours : '0' + hours) + '小時'),
      ((minutes >= 10 ? minutes : '0' + minutes) + '分鐘'),
      ((seconds >= 10 ? seconds : '0' + seconds) + '秒')
      ]
    }

    return span.join(' ');
  };
})
.directive('timeago', function($filter){
  return function (scope, element, attrs) {
    if (attrs.timeago) {
      //var sec = attrs.timeago / 1000;
      element.html($filter('timeformat')(attrs.timeago, true));
    }
  }
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
    if (!_active) {
      _activeTime = new Date();
      _active = true;
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
      getTime: new Date(),
      spanTick: $scope.counter
    };

    $scope.items.push(new_item);
    resetTimer();
  };

  $scope.removeItem = function () {
    if ($scope.items.length) {
      $scope.items.pop();
    }
  };


  window.onbeforeunload = function() {
    if (_active) {
      return '記錄器正在使用中，確定要離開嗎？';
    }
  };

}]);
