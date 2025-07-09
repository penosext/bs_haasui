
  var Module = typeof Module !== 'undefined' ? Module : {};

  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }

  Module.expectedDataFileDownloads++;
  (function() {
    // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
    // fetch the .data bundle on the worker
    if (Module['ENVIRONMENT_IS_PTHREAD']) return;
    var loadPackage = function(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'device/simulator_wasm/dist/appx.data';
      var REMOTE_PACKAGE_BASE = 'appx.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;

      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];

      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };

      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);

    function runWithFS() {

      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
Module['FS_createPath']("/", "etc", true, true);
Module['FS_createPath']("/etc", "miniapp", true, true);
Module['FS_createPath']("/etc/miniapp", "resources", true, true);
Module['FS_createPath']("/etc/miniapp/resources", "framework", true, true);
Module['FS_createPath']("/etc/miniapp/resources", "presetpkgs", true, true);
Module['FS_createPath']("/etc/miniapp/resources", "fonts", true, true);
Module['FS_createPath']("/etc/miniapp/resources", "ime_res", true, true);
Module['FS_createPath']("/etc/miniapp/resources/ime_res", "lib", true, true);
Module['FS_createPath']("/", "data", true, true);
Module['FS_createPath']("/data", "miniapp", true, true);
Module['FS_createPath']("/data/miniapp", "resources", true, true);
Module['FS_createPath']("/data/miniapp", "haas-ui-demo", true, true);
Module['FS_createPath']("/data/miniapp/haas-ui-demo", ".falcon_", true, true);
Module['FS_createPath']("/data/miniapp/haas-ui-demo/.falcon_", "images", true, true);
Module['FS_createPath']("/data/miniapp/haas-ui-demo/.falcon_", "assets", true, true);
Module['FS_createPath']("/data/miniapp/haas-ui-demo/.falcon_/assets", "lotties", true, true);
Module['FS_createPath']("/data/miniapp/haas-ui-demo/.falcon_/assets", "movies", true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
          // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true);
          Module['removeRunDependency']('fp ' + that.name);
          this.requests[this.name] = null;
        }
      };

      var files = metadata['files'];
      for (var i = 0; i < files.length; ++i) {
        new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
      }

      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }          Module['removeRunDependency']('datafile_device/simulator_wasm/dist/appx.data');

      };
      Module['addRunDependency']('datafile_device/simulator_wasm/dist/appx.data');

      if (!Module.preloadResults) Module.preloadResults = {};

      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }

    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/etc/miniapp/resources/.DS_Store", "start": 0, "end": 6148}, {"filename": "/etc/miniapp/resources/local_deviceinfo.json", "start": 6148, "end": 6240}, {"filename": "/etc/miniapp/resources/env.json", "start": 6240, "end": 6244}, {"filename": "/etc/miniapp/resources/cfg.json", "start": 6244, "end": 6693}, {"filename": "/etc/miniapp/resources/.gitignore", "start": 6693, "end": 6871}, {"filename": "/etc/miniapp/resources/local_packages.json", "start": 6871, "end": 7233}, {"filename": "/etc/miniapp/resources/framework/jsfm-nvue.js", "start": 7233, "end": 143139}, {"filename": "/etc/miniapp/resources/presetpkgs/8080251822789980.amr", "start": 143139, "end": 767059}, {"filename": "/etc/miniapp/resources/presetpkgs/8001641807316750.amr", "start": 767059, "end": 782012}, {"filename": "/etc/miniapp/resources/fonts/falcon-icons.ttf", "start": 782012, "end": 837968}, {"filename": "/etc/miniapp/resources/fonts/Alibaba-PuHuiTi-Regular.otf", "start": 837968, "end": 8129796}, {"filename": "/etc/miniapp/resources/fonts/fonts.xml", "start": 8129796, "end": 8130121}, {"filename": "/etc/miniapp/resources/ime_res/lib/dict_pinyin.dat", "start": 8130121, "end": 8311035}, {"filename": "/data/miniapp/resources/.holder", "start": 8311035, "end": 8311035}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/uihome.js", "start": 8311035, "end": 8316777}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/scroller.js", "start": 8316777, "end": 8320758}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/layout.js", "start": 8320758, "end": 8332602}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/popup.js", "start": 8332602, "end": 8340102}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/qrcode.js", "start": 8340102, "end": 8342383}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/index-4c1c1f59.js", "start": 8342383, "end": 8461846}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/switch.js", "start": 8461846, "end": 8469046}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/lottie.js", "start": 8469046, "end": 8472807}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/cases.js", "start": 8472807, "end": 8539920}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/lottie_canvas.min-b192a94d.js", "start": 8539920, "end": 8743100}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/icon.js", "start": 8743100, "end": 8746271}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/image1-0d2434dc.js", "start": 8746271, "end": 8746406}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/dialog.js", "start": 8746406, "end": 8752854}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/div.js", "start": 8752854, "end": 8755319}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/index.js", "start": 8755319, "end": 8768579}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/ThemeMixin-d6eff119.js", "start": 8768579, "end": 8772796}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/drv.js", "start": 8772796, "end": 8779594}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/progress.js", "start": 8779594, "end": 8782397}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/checkbox.js", "start": 8782397, "end": 8784815}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/canvas.js", "start": 8784815, "end": 8792942}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/image.js", "start": 8792942, "end": 8796383}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/seekbar.js", "start": 8796383, "end": 8799660}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/button.js", "start": 8799660, "end": 8804426}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/slider.js", "start": 8804426, "end": 8808583}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/radio.js", "start": 8808583, "end": 8810993}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/toast.js", "start": 8810993, "end": 8813602}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/app.js", "start": 8813602, "end": 8820424}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/text.js", "start": 8820424, "end": 8827707}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/be310940696ad9dcaf303149164002c2.png", "start": 8827707, "end": 8919760}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/4d30a1d26d195f1f1b1c758efe0aeced.png", "start": 8919760, "end": 8922067}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/83e03c7247132775b4ccde911f505299.png", "start": 8922067, "end": 9019597}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/1a8f044b264c9810d98b1b897fc22360.png", "start": 9019597, "end": 9020229}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/ecd5221ac43c3ace3a75c63fa7c68259.png", "start": 9020229, "end": 9039191}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/1077df633f996c02670a460a92579942.png", "start": 9039191, "end": 9047539}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/24fe4688ef04c7b63c0a372d5897950c.png", "start": 9047539, "end": 9048530}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/18c297e8f576fbb5865f6a9ca2c098fa.png", "start": 9048530, "end": 9052334}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/13cf49a9469032dfab5813fdd02086c9.png", "start": 9052334, "end": 9052799}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/f40225045150dd774735de9bcb269cab.png", "start": 9052799, "end": 9061381}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/95c89eef3a8894c9ebca36748b3920e1.png", "start": 9061381, "end": 9062809}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/d07182d5dda27271bff596eda6da2f3f.png", "start": 9062809, "end": 9074273}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/a0ac6f495e444c298551b2582c2e197e.png", "start": 9074273, "end": 9079816}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/d6467426f67d78d923487587612b2f28.png", "start": 9079816, "end": 9083648}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/c7b063cba3392353505b877b71ba6bdd.gif", "start": 9083648, "end": 9175336}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/f761045590c8b5d0f78ff8718856d876.png", "start": 9175336, "end": 9176264}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/dacaa4caec87b8c5ccb63f31fdbee8b8.png", "start": 9176264, "end": 9176553}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/f54aa1b0d26ca2bb12b4c7692798e45d.png", "start": 9176553, "end": 9182152}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/9e490439e0bdf4fcc260b779c0bfedde.png", "start": 9182152, "end": 9192066}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/0fb80be9922c89b73ed05b95bd5e516b.png", "start": 9192066, "end": 9193382}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/d244a7346d9fb4b2840381582424d95e.png", "start": 9193382, "end": 9301740}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/images/394901bb1d7c9966904fb8e5a17a3cf9.png", "start": 9301740, "end": 9312457}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie6.json", "start": 9312457, "end": 9320490}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie3.json", "start": 9320490, "end": 9328741}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie2.json", "start": 9328741, "end": 9335832}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie5.json", "start": 9335832, "end": 9354526}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie4.json", "start": 9354526, "end": 9484090}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/lotties/lottie.json", "start": 9484090, "end": 9629232}, {"filename": "/data/miniapp/haas-ui-demo/.falcon_/assets/movies/sunshine.json", "start": 9629232, "end": 9635955}], "remote_package_size": 9635955, "package_uuid": "c06a14ae-0803-49c0-95f6-b28f31dd76c9"});

  })();
