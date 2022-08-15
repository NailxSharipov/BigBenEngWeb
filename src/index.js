// okay, so we have an animation and a renderer; how do we play an animation?
// First, let's set up our animation loop with requestFrameAnimation
function draw(time) {
    // work out how many seconds have passed since a previous frame was drawn
    if (!lastTime) {
        lastTime = time;
    }
    const elapsedTime = (time - lastTime) / 1000;
    lastTime = time;

    // advance our animation by the elapsed time
    vibrationInstance.advance(elapsedTime);
    // apply the animation to the artboard
    vibrationInstance.apply(artboard, 1.0);
    // advance the artboard
    artboard.advance(elapsedTime);

    // render the animation frame
    // first, clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let's resize it to fit the canvas
    ctx.save();
    renderer.align(rive.Fit.contain, rive.Alignment.center, {
        minX: 0,
        minY: 0,
        maxX: canvas.width,
        maxY: canvas.height
    }, artboard.bounds);
    // and now we can draw our frame to our canvas
    artboard.draw(renderer);
    ctx.restore();

    // and kick off the next frame
    requestAnimationFrame(draw);
}

function onFileLoad(rive, artboard) {
  // now we can access the animations; let's get one called 'vibration'
  const vibrationAnim = artboard.animation('Animation 1');
  const vibrationInstance = new rive.LinearAnimationInstance(vibrationAnim);
  // let's grab our canvas
  const canvas = document.getElementById('riveCanvas');
  const ctx = canvas.getContext('2d');
  // nw we can create a Rive renderer and wire it up to our 2D context
  const renderer = new rive.CanvasRenderer(ctx);
  // advance the artboard to render a frame
  artboard.advance(0);
  // Let's make sure our frame fits into our canvas
  ctx.save();
  renderer.align(rive.Fit.contain, rive.Alignment.center, {
      minX: 0,
      minY: 0,
      maxX: canvas.width,
      maxY: canvas.height
  }, artboard.bounds);
  // and now we can draw our frame to our canvas
  artboard.draw(renderer);
  ctx.restore();

  // track the last time a frame was rendered
let lastTime = 0;

  // with the draw function ready, now we kick off the animation
  requestAnimationFrame(draw);
}

function onRiveReady(rive) {
  // Rive engine is ready
  // Load up a Rive animation file, typically ending in '.riv'
  const req = new Request('src/bigbeneng.riv');
  fetch(req).then((res) => {
    return res.arrayBuffer();
  }).then((buf) => {
    const file = rive.load(new Uint8Array(buf)); // the Rive engine loads a Rive asset via raw bytes
    const artboard = file.defaultArtboard();
    onFileLoad(rive, artboard);
  });
}

(function () {
    // first, instantiate the Rive engine and load the WASM file(s)
    Rive({
      locateFile: (file) => 'https://unpkg.com/rive-canvas@0.0.10/' + file,
    }).then((rive) => {
        onRiveReady(rive);
    });
})();