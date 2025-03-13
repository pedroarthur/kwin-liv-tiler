var tilings = {};

tileWindowToTheLeftOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height
  };
}

tileWindowToTheTopLeftOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheBottomLeftOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheRightOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height
  };
}

tileWindownToTheTopRightOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

tileWindowToTheBottomRightOfScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x + screen.geometry.width / 2,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width / 2,
    height: screen.geometry.height / 2
  };
}

wrappingToTheLeft = (leftTiler, rightTiler) => {
  return (window, screen) => {
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
}

wrappingToTheRight = (leftTiler, rightTiler) => {
  return (window, screen) => {
    let virtualScreenGeometry = workspace.virtualScreenGeometry;

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
  }
}

theTop = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width,
    height: screen.geometry.height / 2
  };

  tilings[window] = theTop;
}

theBottom = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y + screen.geometry.height / 2,
    width: screen.geometry.width,
    height: screen.geometry.height / 2
  };

  tilings[window] = theBottom;
}

theWholeScreen = (window, screen) => {
  window.frameGeometry = {
    x: screen.geometry.x,
    y: screen.geometry.y,
    width: screen.geometry.width,
    height: screen.geometry.height
  };

  tilings[window] = theWholeScreen;
}

setUp = (window) => {
  window.setMaximize(false, false);

  if (!tilings[window]) {
    print("Connecting closed signal of", window);
    window.closed.connect(() => {
      print("Window", window, "closed, deleting tiling data");
      delete tilings[window];
    })
  }
}

tileWindowTo = (pos, tiler) => {
  return () => {
    print("Really Tile Window to the", pos);

    let window = workspace.activeWindow;
    let screen = window.output;

    if (window.desktopWindow) {
      print("Window is a desktop window, ignoring");
      return;
    }

    setUp(window);
    tiler(window, screen);
  };
}

register = (direction, shortcut, tiler) => registerShortcut("Really Tile Window to the " + direction, "", shortcut, tileWindowTo(direction, tiler));

theLeft = wrappingToTheLeft(tileWindowToTheLeftOfScreen, tileWindowToTheRightOfScreen);
theTopLeft = wrappingToTheLeft(tileWindowToTheTopLeftOfScreen, tileWindownToTheTopRightOfScreen);
theBottomLeft = wrappingToTheLeft(tileWindowToTheBottomLeftOfScreen, tileWindowToTheBottomRightOfScreen);

theRight = wrappingToTheRight(tileWindowToTheLeftOfScreen, tileWindowToTheRightOfScreen);
theTopRight = wrappingToTheRight(tileWindowToTheTopLeftOfScreen, tileWindownToTheTopRightOfScreen);
theBottomRight = wrappingToTheRight(tileWindowToTheBottomLeftOfScreen, tileWindowToTheBottomRightOfScreen);

register("Whole Screen", "Meta+Shift+i", theWholeScreen);

register("Left", "Meta+Shift+h", theLeft);
register("Top Left", "Meta+Shift+u", theTopLeft);
register("Bottom Left", "Meta+Shift+n", theBottomLeft);

register("Right", "Meta+Shift+l", theRight);
register("Top Right", "Meta+Shift+p", theTopRight);
register("Bottom Right", "Meta+Shift+m", theBottomRight);

register("Top", "Meta+Shift+k", theTop);
register("Bottom", "Meta+Shift+j", theBottom);

print("kwin-liv-tiler is ready");
