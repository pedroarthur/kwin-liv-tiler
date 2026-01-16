// CONFIG: you can change the margin around windows here
var margin = 2; // 0 for no margin
// TODO: theWholeScreen() uses the margin. Maybe it should not?
// TODO: margin should be set via GUI

var tilings = {};

tileWindowToTheLeftOfScreen = (window, screen, area, quadWidth, quadHeight) => {
  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight - 2 * margin,
  };

  tilings[window] = tileWindowToTheLeftOfScreen;
};

tileWindowToTheTopLeftOfScreen = (
  window,
  screen,
  area,
  quadWidth,
  quadHeight,
) => {
  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = tileWindowToTheTopLeftOfScreen;
};

tileWindowToTheBottomLeftOfScreen = (
  window,
  screen,
  area,
  quadWidth,
  quadHeight,
) => {
  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + quadHeight / 2 + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = tileWindowToTheBottomLeftOfScreen;
};

tileWindowToTheRightOfScreen = (
  window,
  screen,
  area,
  quadWidth,
  quadHeight,
) => {
  window.frameGeometry = {
    x: area.x + quadWidth / 2 + margin,
    y: area.y + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight - 2 * margin,
  };

  tilings[window] = tileWindowToTheRightOfScreen;
};

tileWindownToTheTopRightOfScreen = (
  window,
  screen,
  area,
  quadWidth,
  quadHeight,
) => {
  window.frameGeometry = {
    x: area.x + quadWidth / 2 + margin,
    y: area.y + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = tileWindownToTheTopRightOfScreen;
};

tileWindowToTheBottomRightOfScreen = (
  window,
  screen,
  area,
  quadWidth,
  quadHeight,
) => {
  window.frameGeometry = {
    x: area.x + quadWidth / 2 + margin,
    y: area.y + quadHeight / 2 + margin,
    width: quadWidth / 2 - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = tileWindowToTheBottomRightOfScreen;
};

wrappingToTheLeft = (leftTiler, rightTiler) => {
  return (window, screen, area, quadWidth, quadHeight) => {
    if (!tilings[window] || tilings[window] !== leftTiler) {
      leftTiler(window, screen, area, quadWidth, quadHeight);
    } else if (screen.geometry.x > 0) {
      let chosen = null;

      for (const candidate of workspace.screens) {
        if (candidate === screen) {
          print("Skipping current screen");
          continue;
        }

        if (candidate.geometry.x > screen.geometry.x) {
          print(
            "Skipping screen",
            candidate.geometry,
            "because it is further to the right than the current screen",
          );
          continue;
        }

        print("Checking screen", candidate.geometry);

        if (chosen === null) {
          chosen = candidate;
          print("Chose", chosen.geometry, "because chosen === null");
          continue;
        } else if (candidate.geometry.x > chosen.geometry.x) {
          chosen = candidate;
          print(
            "Chose",
            chosen.geometry,
            "because",
            candidate.geometry,
            "is further to the right",
          );
        }
      }

      if (chosen !== null) {
        print("Moving to screen", chosen.geometry);
        let chosenArea = workspace.clientArea(
          KWin.MaximizeArea,
          chosen,
          workspace.currentDesktop,
        );
        let chosenQuadWidth = Math.floor(chosenArea.width);
        let chosenQuadHeight = Math.floor(chosenArea.height);
        rightTiler(
          window,
          chosen,
          chosenArea,
          chosenQuadWidth,
          chosenQuadHeight,
        );
      }
    }
  };
};

wrappingToTheRight = (leftTiler, rightTiler) => {
  return (window, screen, area, quadWidth, quadHeight) => {
    let virtualScreenGeometry = workspace.virtualScreenGeometry;

    if (!tilings[window] || tilings[window] !== rightTiler) {
      rightTiler(window, screen, area, quadWidth, quadHeight);
    } else if (
      screen.geometry.x + screen.geometry.width <
      virtualScreenGeometry.x + virtualScreenGeometry.width
    ) {
      let chosen = null;

      for (const candidate of workspace.screens) {
        if (candidate === screen) {
          print("Skipping current screen");
          continue;
        }

        if (
          candidate.geometry.x + candidate.geometry.width <
          screen.geometry.x + screen.geometry.width
        ) {
          print(
            "Skipping screen",
            candidate.geometry,
            "because it is further to the left than the current screen",
          );
          continue;
        }

        print("Checking screen", candidate.geometry);

        if (chosen === null) {
          chosen = candidate;
          print("Chose", chosen.geometry, "because chosen === null");
          continue;
        } else if (
          candidate.geometry.x + candidate.geometry.width <
          chosen.geometry.x + chosen.geometry.width
        ) {
          chosen = candidate;
          print(
            "Chose",
            chosen.geometry,
            "because",
            candidate.geometry,
            "is further to the left",
          );
        }
      }

      if (chosen !== null) {
        print("Moving to screen", chosen.geometry);
        let chosenArea = workspace.clientArea(
          KWin.MaximizeArea,
          chosen,
          workspace.currentDesktop,
        );
        let chosenQuadWidth = Math.floor(chosenArea.width);
        let chosenQuadHeight = Math.floor(chosenArea.height);
        leftTiler(
          window,
          chosen,
          chosenArea,
          chosenQuadWidth,
          chosenQuadHeight,
        );
      }
    }
  };
};

theTop = (window, screen, area, quadWidth, quadHeight) => {
  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + margin,
    width: quadWidth - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = theTop;
};

theBottom = (window, screen, area, quadWidth, quadHeight) => {
  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + quadHeight / 2 + margin,
    width: quadWidth - 2 * margin,
    height: quadHeight / 2 - 2 * margin,
  };

  tilings[window] = theBottom;
};

var wholeScreened = {};

theWholeScreen = (window, screen, area, quadWidth, quadHeight) => {
  if (tilings[window] == theWholeScreen && wholeScreened[window]) {
    return wholeScreened[window](window, screen, area, quadWidth, quadHeight);
  }

  window.frameGeometry = {
    x: area.x + margin,
    y: area.y + margin,
    width: quadWidth - 2 * margin,
    height: quadHeight - 2 * margin,
  };

  if (tilings[window] && tilings[window] != theWholeScreen) {
    wholeScreened[window] = tilings[window];
  }

  tilings[window] = theWholeScreen;
};

setUp = (window) => {
  window.setMaximize(false, false);

  if (!tilings[window]) {
    print("Connecting closed signal of", window);
    window.closed.connect(() => {
      print("Window", window, "closed, deleting tiling data");
      delete tilings[window];
    });
  }
};

tileWindowTo = (pos, tiler) => {
  return () => {
    print("Really Tile Window to the", pos);

    let window = workspace.activeWindow;
    let screen = window.output;
    let area = workspace.clientArea(KWin.MaximizeArea, window);
    let quadWidth = area.width;
    let quadHeight = area.height;
    if (window.desktopWindow) {
      print("Window is a desktop window, ignoring");
      return;
    }

    setUp(window);
    tiler(window, screen, area, quadWidth, quadHeight);
  };
};

register = (direction, shortcut, tiler) =>
  registerShortcut(
    "Really Tile Window to the " + direction,
    "",
    shortcut,
    tileWindowTo(direction, tiler),
  );

theLeft = wrappingToTheLeft(
  tileWindowToTheLeftOfScreen,
  tileWindowToTheRightOfScreen,
);
theTopLeft = wrappingToTheLeft(
  tileWindowToTheTopLeftOfScreen,
  tileWindownToTheTopRightOfScreen,
);
theBottomLeft = wrappingToTheLeft(
  tileWindowToTheBottomLeftOfScreen,
  tileWindowToTheBottomRightOfScreen,
);

theRight = wrappingToTheRight(
  tileWindowToTheLeftOfScreen,
  tileWindowToTheRightOfScreen,
);
theTopRight = wrappingToTheRight(
  tileWindowToTheTopLeftOfScreen,
  tileWindownToTheTopRightOfScreen,
);
theBottomRight = wrappingToTheRight(
  tileWindowToTheBottomLeftOfScreen,
  tileWindowToTheBottomRightOfScreen,
);

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
