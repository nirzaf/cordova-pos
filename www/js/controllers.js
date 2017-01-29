angular.module('starter.controllers', ['starter.services'])

  .controller('WiFiCtrl', function ($scope) {
    var socketId = null;
    $scope.ip = "192.168.1.103";
    $scope.port = 9100;
    function print(socketId, content) {
      if (socketId == null) {
        return;
      }
      var uint8array = new TextEncoder('gb18030', { NONSTANDARD_allowLegacyEncoding: true }).encode(content);
      chrome.sockets.tcp.send(socketId,
        uint8array.buffer,
        function (result) {
          console.log(angular.toJson(result));
        }
      )
    }
    $scope.connect = function (ip, port) {
      console.log(ip + " " + port);
      chrome.sockets.tcp.create(function (createInfo) {
        chrome.sockets.tcp.connect(createInfo.socketId, ip,
          port ? port : 9100,
          function (result) {
            if (!result) {
              console.log("connect success!");
              socketId = createInfo.socketId;
            } else {
              socketId = null;
            }
          });
      })
    }
    $scope.disconnect = function () {
      if (socketId) {
        chrome.sockets.tcp.disconnect(socketId);
        socketId = null;
      }
    }
    $scope.print = function () {
      print(socketId, "cordova-posprinter-sample");
    }
    $scope.printEscCommand = function () {
      var escCommand = Esc.InitializePrinter +
        Esc.TextAlignRight + "HelloWorld!" +
        Esc.TextAlignCenter + "HelloWorld!" +
        Esc.TextAlignLeft + "HelloWorld!" +
        Esc.BoldOn + "HelloWorld" + Esc.BoldOff +
        Esc.DoubleHeight + "HelloWorld!" + Esc.DoubleOff +
        Esc.DoubleWidth + "HelloWorld!" + Esc.DoubleOff +
        Esc.DoubleOn + "HelloWorld!" + Esc.DoubleOff +
        PrintAndFeedMaxLine;
      print(socketId, escCommand);
    }
    $scope.printTscCommand = function () {
      var tscCommand = Tsc.text(100, 100, "4", 0, 1, 1, "DEMO FOR TEXT") + Tsc.print(1);
      console.log(tscCommand);
      print(socketId, tscCommand);
    }
  })
  .controller('BluetoothCtrl', function ($scope, bluetooth) {
    $scope.bluetoothDevices = [];
    bluetooth.isEnabled()
      .then(function (isEnabled) {
        if (!isEnabled) {
          bluetooth.enable();
        }
      });
    $scope.refresh = function (params) {
      $scope.bluetoothDevices.splice(0, $scope.bluetoothDevices.length);
      bluetooth.startScan()
        .then(function (success) {
          console.log("success:" + angular.toJson(success));
        }, function (err) {
          console.log(err);
        }, function (device) {
          $scope.bluetoothDevices.push(device);
          console.log(angular.toJson(device));
        })
        .finally(function () {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    }
  })
  .controller('BluetoothDetailCtrl', function ($scope, $stateParams, bluetooth) {
    $scope.deviceId = $stateParams.deviceId;
    $scope.connect = function (params) {
      bluetooth.connect($scope.deviceId)
        .then(null, null, function (res) {
          alert(angular.toJson(res));
        });
    }
    $scope.disconnect = function () {
      if ($scope.deviceId) {
        bluetooth.disconnect($scope.deviceId);
      }
    }
    function print(content) {
      var uint8array = new TextEncoder('gb18030', { NONSTANDARD_allowLegacyEncoding: true }).encode(content);
      bluetooth.write(uint8array.buffer, $scope.deviceId);
    }
    $scope.print = function () {
      var content = "HelloWorld!";
      print(content);
    }
    $scope.printEscCommand = function () {
      var escCommand = Esc.InitializePrinter +
        Esc.TextAlignRight + "HelloWorld!" +
        Esc.TextAlignCenter + "HelloWorld!" +
        Esc.TextAlignLeft + "HelloWorld!" +
        Esc.BoldOn + "HelloWorld" + Esc.BoldOff +
        Esc.DoubleHeight + "HelloWorld!" + Esc.DoubleOff +
        Esc.DoubleWidth + "HelloWorld!" + Esc.DoubleOff +
        Esc.DoubleOn + "HelloWorld!" + Esc.DoubleOff +
        Esc.PrintAndFeedMaxLine + Esc.CutAndFeedLine();
      print(escCommand);
    }
    $scope.printTscCommand = function () {
      var tscCommand = Tsc.text(100, 100, "4", 0, 1, 1, "DEMO FOR TEXT") + Tsc.print(1);
      print(tscCommand);
    }
  })
  .controller('USBCtrl', function ($scope) { })