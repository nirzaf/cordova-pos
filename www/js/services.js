angular.module('starter.services', [])

  .service('bluetooth', function ($q, $window) {
    var _this = this;
    var serviceUUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455";// IOS ONLY
    var writeCharacteristic = "49535343-8841-43F4-A8D4-ECBE34729BB3"; //IOS ONLY
    var readCharacteristic = "49535343-1E4D-4BD9-BA61-23C647249616"; //IOS ONLY
    this.isEnabled = function () {
      var d = $q.defer();
      function successCallback(success) {
        d.resolve(true);
      }
      function errorCallback(error) {
        d.resolve(false);
      }
      if (ionic.Platform.isIOS()) {
        $window.ble.isEnabled(successCallback, errorCallback);
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.isEnabled(successCallback, errorCallback);
      }
      return d.promise;
    }
    this.enable = function () {
      var d = $q.defer();
      if (ionic.Platform.isIOS()) {
        d.reject("not support");
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.enable(function (success) {
          d.resolve(success);
        }, function (error) {
          d.reject(error);
        })
      }
      return d.promise;
    }
    this.startScan = function () {
      var d = $q.defer();
      if (ionic.Platform.isIOS()) {
        $window.ble.startScan([], function (device) {
          d.notify(device);
        }, function (error) {
          d.reject(error);
        });
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.setDeviceDiscoveredListener(function (device) {
          d.notify(device);
        });
        $window.bluetoothSerial.discoverUnpaired(function (devices) {
          d.resolve(devices);
        }, function (error) {
          d.reject(error);
        });
      }
      return d.promise;
    }
    this.stopScan = function () {
      var d = $q.defer();
      if (ionic.Platform.isIOS()) {
        $window.ble.stopScan(function (success) {
          d.resolve(success);
        }, function (error) {
          d.reject(error);
        })
      }
      return d.promise;
    }
    this.isConnected = function (deviceId) {
      var d = $q.defer();
      function successCallback(success) {
        d.resolve(true);
      }
      function errorCallback(error) {
        d.resolve(false);
      }
      if (ionic.Platform.isIOS()) {
        $window.ble.isConnected(deviceId, successCallback, errorCallback);
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.isConnected(successCallback, errorCallback);
      }
      return d.promise;
    }
    this.connect = function (deviceId) {
      var d = $q.defer();
      function successCallback(success) {
        d.notify({ status: "connected" });
      }
      function errorCallback(error) {
        d.notify({ status: "disconnected" });
      }
      if (ionic.Platform.isIOS()) {
        $window.ble.stopScan(null, null);
        $window.ble.connect(deviceId, function (deviceInfo) {
          for (var index = 0; index < deviceInfo.services.length; index++) {
            var service = deviceInfo.services[index];
            if (service == serviceUUID) {
              d.notify({ status: "connected" });
              $window.ble.startNotification(deviceId, serviceUUID, readCharacteristic, null, null);
              return;
            }
          }
        }, errorCallback);
      } else {
        // without bond
        $window.bluetoothSerial.connectInsecure(deviceId, successCallback, errorCallback);
      }
      return d.promise;
    }
    this.disconnect = function (deviceId) {
      var d = $q.defer();
      function successCallback(success) {
        d.resolve(success);
      }
      function errorCallback(error) {
        d.reject(error);
      }
      if (ionic.Platform.isIOS()) {
        $window.ble(deviceId, successCallback, errorCallback);
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.disconnect(successCallback, errorCallback);
      }
      return d.promise;
    }
    this.write = function (buffer, deviceId) {
      var d = $q.defer();
      function successCallback(success) {
        d.resolve(success);
      }
      function errorCallback(error) {
        d.reject(error);
      }
      if (ionic.Platform.isIOS()) {
        $window.ble.write(deviceId, serviceUUID, writeCharacteristic, buffer, successCallback, errorCallback);
      } else if (ionic.Platform.isAndroid()) {
        $window.bluetoothSerial.write(buffer, successCallback, errorCallback);
      }
      return d.promise;
    }
  }); 
