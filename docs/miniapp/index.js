  const flags = {};
  for (const pair of location.hash.substring(1).split(',')) {
    // Parse "values" as an array in case the value has a colon (e.g., "slide:http://...").
    const [key, ...values] = pair.split(':');
    flags[key] = values.join(':');
  }
  window.onhashchange = function() {
    location.reload();
  };

  TstSkiaInit(
    Module
    //{
    //locateFile: (file) => '/'+file,
    //}
  ).then((TstSkia) => {
    if (!TstSkia) {
      throw 'TstSkia not available.';
    }
    RunMain(TstSkia);
  });

  function RunMain(TstSkia) {
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    const config = TstSkia.GetConfig()
    const htmlCanvas = document.getElementById('tst_canvas');
    htmlCanvas.width = config.width;
    htmlCanvas.height = config.height;
    hookCanvasEvent(TstSkia, htmlCanvas)

    // For the msaa flag, only check if the key exists in flags. That way we don't need to assign it
    // a value in the location hash. i.e.,:  http://.../viewer.html#msaa
    const doMSAA = ('msaa' in flags);
    // Create the WebGL context with our desired attribs before calling MakeWebGLCanvasSurface.
    TstSkia.GetWebGLContext(htmlCanvas, {antialias: doMSAA});
    const surface = TstSkia.MakeWebGLCanvasSurface(htmlCanvas, null);
    if (!surface) {
      throw 'Could not make canvas surface';
    }
    if (doMSAA && surface.sampleCnt() <= 1) {
      // We requested antialias on the canvas but did not get MSAA. Since we don't know what type of
      // AA is in use right now (if any), this surface is unusable.
      throw 'MSAA rendering to the on-screen canvas is not supported. ' +
            'Please try again without MSAA.';
    }
    // TstSkia.TestDraw(surface)
    // surface._flush();
    TstSkia.SimulatorInit(surface);
  }

  const MOUSE_ACTION_DOWN = 1
  const MOUSE_ACTION_MOVE = 2
  const MOUSE_ACTION_UP = 3
  const KEY_ACTION_DOWN = 4
  const KEY_ACTION_UP = 5
  const KEY_TEXTINPUT = 6  // ?

  // const ACTION_DOWN = 1
  // const ACTION_UP = 2
  // const ACTION_MOVE = 3
  // const ACTION_CANCEL = 4

  // enum KeyCodes {
  const KEYCODE_BACK = 1
  const KEYCODE_NUM_0 = 7
  const KEYCODE_NUM_1 = 8
  const KEYCODE_NUM_2 = 9
  const KEYCODE_NUM_3 = 10
  const KEYCODE_NUM_4 = 11
  const KEYCODE_NUM_5 = 12
  const KEYCODE_NUM_6 = 13
  const KEYCODE_NUM_7 = 14
  const KEYCODE_NUM_8 = 15
  const KEYCODE_NUM_9 = 16

  const KEYCODE_DPAD_UP = 19
  const KEYCODE_DPAD_DOWN = 20
  const KEYCODE_DPAD_LEFT = 21
  const KEYCODE_DPAD_RIGHT = 22
  const KEYCODE_DPAD_CENTER = 23

  const KEYCODE_ENTER = 24
  const KEYCODE_DEL = 25

  function getMousePos(canvasDom, mouseEvent)
  {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }
  function hookCanvasEvent(TstSkia, canvas)
  {
    canvas.addEventListener("mousedown", function (e) {
      const pos = getMousePos(canvas, e);
      TstSkia.SimulatorKey(MOUSE_ACTION_DOWN, pos.x, pos.y, 0, false)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
      const pos = getMousePos(canvas, e);
      TstSkia.SimulatorKey(MOUSE_ACTION_UP, pos.x, pos.y, 0, false)
    }, false);
    canvas.addEventListener("mousemove", function (e) {
      const pos = getMousePos(canvas, e);
      TstSkia.SimulatorKey(MOUSE_ACTION_MOVE, pos.x, pos.y, 0, false)
    }, false);
  }

  function FPSMeter(startMs) {
    this.frames = 0;
    this.startMs = startMs;
    this.markFrameComplete = () => {
      ++this.frames;
      const ms = window.performance.now();
      const sec = (ms - this.startMs) / 1000;
      if (sec > 2) {
        console.log(Math.round(this.frames / sec) + ' fps');
        this.frames = 0;
        this.startMs = ms;
      }
      return ms;
    };
  }

