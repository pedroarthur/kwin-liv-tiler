Liv Tiler
=========

A KWin script to tile windows in a way similar to KWin < 6.3.

Background
----------

Some developers found the old tiling unintuitive and decide to copy the functionality of a lesser known Window Manager into KWin. This script is for those who prefer the old tiling functionality.

Installation and Usage
----------------------

Download a release and install it via the KWin script manager. After that, you get 8 new shortcuts:

| Description                            | Shortcut     |
|----------------------------------------|--------------|
| Really Tile Window to the Left         | Meta+Shift+h |
| Really Tile Window to the Top Left     | Meta+Shift+u |
| Really Tile Window to the Bottom Left  | Meta+Shift+n |
| Really Tile Window to the Right        | Meta+Shift+l |
| Really Tile Window to the Top Right    | Meta+Shift+p |
| Really Tile Window to the Bottom Right | Meta+Shift+m |
| Really Tile Window to the Top          | Meta+Shift+k |
| Really Tile Window to the Bottom       | Meta+Shift+j |

And that's it. There's no configuration dialog or anything else. Just use these shortcuts or change them in the shortcut manager and enjoy the old tiling functionality.

Configuration
-------------
You can set the margin around windows by editing `contents/code/main.js` and changing the `margin` variable.

It defaults to 2 pixels.
