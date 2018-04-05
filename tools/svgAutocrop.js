import Jimp from 'jimp';
Jimp.prototype.autocropSize = function () {
  var w = this.bitmap.width;
  var h = this.bitmap.height;
  var minPixelsPerSide = 1; // to avoid cropping completely the image, resulting in an invalid 0 sized image
  var tolerance = 0.0002; // percent of color difference tolerance (default value)
  // i.e. all 4 sides have some border (default value)

  // parse arguments
  for (let a = 0, len = arguments.length; a < len; a++) {
    if (typeof arguments[a] === "number") { // tolerance value passed
      tolerance = arguments[a];
    }
  }

  /**
   * All borders must be of the same color as the top left pixel, to be cropped.
   * It should be possible to crop borders each with a different color,
   * but since there are many ways for corners to intersect, it would
   * introduce unnecessary complexity to the algorithm.
   */

  // scan each side for same color borders
  var colorTarget = this.getPixelColor(0, 0); // top left pixel color is the target color
  // for north and east sides
  var northPixelsToCrop = 0;
  var eastPixelsToCrop = 0;
  var southPixelsToCrop = 0;
  var westPixelsToCrop = 0;

  var rgba1 = Jimp.intToRGBA(colorTarget);

  north: // north side (scan rows from north to south)
  for (let y = 0; y < h - minPixelsPerSide; y++) {
    for (let x = 0; x < w; x++) {
      let colorXY = this.getPixelColor(x, y);
      let rgba2 = Jimp.intToRGBA(colorXY);

      if (Jimp.colorDiff(rgba1, rgba2) > tolerance) {
        // this pixel is too distant from the first one: abort this side scan
        break north;
      }
    }
    // this row contains all pixels with the same color: increment this side pixels to crop
    northPixelsToCrop++;
  }

  east: // east side (scan columns from east to west)
  for (let x = 0; x < w - minPixelsPerSide; x++) {
    for (let y = 0 + northPixelsToCrop; y < h; y++) {
      let colorXY = this.getPixelColor(x, y);
      let rgba2 = Jimp.intToRGBA(colorXY);

      if (Jimp.colorDiff(rgba1, rgba2) > tolerance) {
        // this pixel is too distant from the first one: abort this side scan
        break east;
      }
    }
    // this column contains all pixels with the same color: increment this side pixels to crop
    eastPixelsToCrop++;
  }

  south: // south side (scan rows from south to north)
  for (let y = h - 1; y >= northPixelsToCrop + minPixelsPerSide; y--) {
    for (let x = w - eastPixelsToCrop - 1; x >= 0; x--) {
      let colorXY = this.getPixelColor(x, y);
      let rgba2 = Jimp.intToRGBA(colorXY);

      if (Jimp.colorDiff(rgba1, rgba2) > tolerance) {
        // this pixel is too distant from the first one: abort this side scan
        break south;
      }
    }
    // this row contains all pixels with the same color: increment this side pixels to crop
    southPixelsToCrop++;
  }

  west: // west side (scan columns from west to east)
  for (let x = w - 1; x >= 0 + eastPixelsToCrop + minPixelsPerSide; x--) {
    for (let y = h - 1; y >= 0 + northPixelsToCrop; y--) {
      let colorXY = this.getPixelColor(x, y);
      let rgba2 = Jimp.intToRGBA(colorXY);

      if (Jimp.colorDiff(rgba1, rgba2) > tolerance) {
        // this pixel is too distant from the first one: abort this side scan
        break west;
      }
    }
    // this column contains all pixels with the same color: increment this side pixels to crop
    westPixelsToCrop++;
  }

  // safety checks
  var widthOfPixelsToCrop = w - (westPixelsToCrop + eastPixelsToCrop);
  widthOfPixelsToCrop >= 0 ? widthOfPixelsToCrop : 0;
  var heightOfPixelsToCrop = h - (southPixelsToCrop + northPixelsToCrop);
  heightOfPixelsToCrop >= 0 ? heightOfPixelsToCrop : 0;

  // decide if a crop is needed
  return {
    x: westPixelsToCrop,
    y: northPixelsToCrop,
    width: w - westPixelsToCrop - eastPixelsToCrop,
    height: h - southPixelsToCrop - northPixelsToCrop
  };
};
