// Length of one side
export const HEX_RADIUS = 100;

// Apothem - equal to the incircle radius
export const HEX_APOTHEM = Math.ceil(
  Math.sqrt(HEX_RADIUS ** 2 - (HEX_RADIUS / 2) ** 2)
);

export const DIAGONAL_LONG = HEX_RADIUS * 2;
export const DIAGONAL_SHORT = HEX_APOTHEM * 2;

// SVG Polygon takes points counter-clockwise
export const POLYGON_POINTS = {
    midRight: `${DIAGONAL_LONG},${HEX_APOTHEM}`,
    topRight: `${HEX_RADIUS * 1.5},0`,
    topLeft: `${HEX_RADIUS / 2},0`,
    midLeft: `0,${HEX_APOTHEM}`,
    bottomLeft: `${HEX_RADIUS / 2},${DIAGONAL_SHORT}`,
    bottomRight: `${HEX_RADIUS * 1.5},${DIAGONAL_SHORT}`,
}

// String of points for SVG Polygon
export const HEX_POLYGON = Object.values(POLYGON_POINTS).join(' ');