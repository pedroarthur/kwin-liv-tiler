var tilings = {};

tileWindowToTheLeftOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height
  };
}

tileWindowToTheTopLeftOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheBottomLeftOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheRightOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height
  };
}

tileWindownToTheTopRightOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheBottomRightOfScreen = function(window, screen) {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileToTheLeftWith = function(leftTiler, rightTiler) {
  print("Really Tile Window to the Left");

  let window = workspace.activeWindow;
  let screen = window.output;

  print("Screen geometry is", screen.geometry);
  print("Window geometry is", window.clientGeometry);

  if (!tilings[window]) {
    print("Connecting closed signal of", window);
    window.closed.connect(function() {
      print("Window", window, "closed, deleting tiling data");
      delete tilings[window];
    })
  }

  if (!tilings[window] || tilings[window] !== leftTiler) {
    tilings[window] = leftTiler;
    leftTiler(window, screen);
  } else if (screen.geometry.x > 0) {
    let chosen = null;

    for (const candidate of workspace.screens) {
      if (candidate === screen) {
        print("Skipping current screen");
        continue;
      }

      if (candidate.geometry.x > screen.geometry.x) {
        print("Skipping screen", candidate.geometry, "because it is further to the right than the current screen");
        continue;
      }

      print("Checking screen", candidate.geometry);

      if (chosen === null) {
        chosen = candidate;
        print("Chose", chosen.geometry, "because chosen === null");
        continue;
      } else if (candidate.geometry.x > chosen.geometry.x) {
        chosen = candidate;
        print("Chose", chosen.geometry, "because", candidate.geometry, "is further to the right");
      }
    }

    if (chosen !== null) {
      print("Moving to screen", chosen.geometry);
      tilings[window] = rightTiler;
      rightTiler(window, chosen);
    }
  }
}

tileToTheRightWith = function(leftTiler, rightTiler) {
  print("Really Tile Window to the Right");

  let window = workspace.activeWindow;
  let screen = window.output;
  let virtualScreenGeometry = workspace.virtualScreenGeometry;

  print("Read window and screen");

  print("Screen geometry is", screen.geometry);
  print("Window geometry is", window.clientGeometry);

  if (!tilings[window]) {
    print("Connecting closed signal of", window);
    window.closed.connect(function() {
      print("Window", window, "closed, deleting tiling data");
      delete tilings[window];
    })
  }

  if (!tilings[window] || tilings[window] !== rightTiler) {
    tilings[window] = rightTiler;
    rightTiler(window, screen);
  } else if (screen.geometry.x + screen.geometry.width < virtualScreenGeometry.x + virtualScreenGeometry.width) {
    let chosen = null;

    for (const candidate of workspace.screens) {
      if (candidate === screen) {
        print("Skipping current screen");
        continue;
      }

      if (candidate.geometry.x + candidate.geometry.width < screen.geometry.x + screen.geometry.width) {
        print("Skipping screen", candidate.geometry, "because it is further to the left than the current screen");
        continue;
      }

      print("Checking screen", candidate.geometry);

      if (chosen === null) {
        chosen = candidate;
        print("Chose", chosen.geometry, "because chosen === null");
        continue;
      } else if (candidate.geometry.x + candidate.geometry.width < chosen.geometry.x + chosen.geometry.width) {
        chosen = candidate;
        print("Chose", chosen.geometry, "because", candidate.geometry, "is further to the left");
      }
    }

    if (chosen !== null) {
      print("Moving to screen", chosen.geometry);
      tilings[window] = leftTiler;
      leftTiler(window, chosen);
    }
  }

  print("Done");
}

tileToTheTop = function() {
  print("Really Tile Window to the Top");

  let window = workspace.activeWindow;
  let screen = window.output;

  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width,
    height: screen.geometry.height / 2
  };

  print("Done");
}

tileToTheBottom = function() {
  print("Really Tile Window to the Bottom");

  let window = workspace.activeWindow;
  let screen = window.output;

  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width,
    height: screen.geometry.height / 2
  };
}

tileToTheLeft = function() { tileToTheLeftWith(tileWindowToTheLeftOfScreen, tileWindowToTheRightOfScreen); }
tileToTheTopLeft = function() { tileToTheLeftWith(tileWindowToTheTopLeftOfScreen, tileWindownToTheTopRightOfScreen); }
tileToTheBottomLeft = function() { tileToTheLeftWith(tileWindowToTheBottomLeftOfScreen, tileWindowToTheBottomRightOfScreen); }
tileToTheRight = function() { tileToTheRightWith(tileWindowToTheLeftOfScreen, tileWindowToTheRightOfScreen); }
tileToTheTopRight = function() { tileToTheRightWith(tileWindowToTheTopLeftOfScreen, tileWindownToTheTopRightOfScreen); }
tileToTheBottomRight = function() { tileToTheRightWith(tileWindowToTheBottomLeftOfScreen, tileWindowToTheBottomRightOfScreen); }

registerShortcut("Really Tile Window to the Left", "", "Meta+Shift+h", tileToTheLeft);
registerShortcut("Really Tile Window to the Top Left", "", "Meta+Shift+u", tileToTheTopLeft);
registerShortcut("Really Tile Window to the Bottom Left", "", "Meta+Shift+n", tileToTheBottomLeft);

registerShortcut("Really Tile Window to the Right", "", "Meta+Shift+l", tileToTheRight);
registerShortcut("Really Tile Window to the Top Right", "", "Meta+Shift+p", tileToTheTopRight);
registerShortcut("Really Tile Window to the Bottom Right", "", "Meta+Shift+m", tileToTheBottomRight);

registerShortcut("Really Tile Window to the Top", "", "Meta+Shift+k", tileToTheTop);
registerShortcut("Really Tile Window to the Bottom", "", "Meta+Shift+j", tileToTheBottom);

print("kwin-liv-tiler is ready");
