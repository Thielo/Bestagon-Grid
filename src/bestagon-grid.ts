const { HEX_APOTHEM, HEX_POLYGON, HEX_RADIUS } = require('./constants');
// import { Hexagon } from "./Hex";

class BestagonGrid {
  private size: [number, number] | number;
  private rows: number;
  private columns: number;
  private containerSelector: string;
  private data: HexagonData[];
  private gridType: GridType;
  private hexagonType: HexagonType;
  private hexagonOrder: HexagonOrder;
  private hexagonGridWrapper!: SVGSVGElement;
  private grid!: SVGGElement;

  static DIAGONAL_LONG = HEX_RADIUS * 2;
  static DIAGONAL_SHORT = HEX_APOTHEM * 2;

  constructor(
    size: [number, number] | number,
    containerSelector: string,
    gridType?: GridType,
    hexagonType?: HexagonType,
    hexagonOrder?: HexagonOrder,
    data?: HexagonData[],
  ) {
    this.size = size;
    this.gridType = gridType || GridType.Grid;
    this.hexagonType = hexagonType || HexagonType.Flat;
    this.hexagonOrder = hexagonOrder || HexagonOrder.Odd;
    this.rows = Array.isArray(size) ? size[0] : size;
    this.columns = Array.isArray(size) ? size[1] : size;
    this.data = data || [];
    this.containerSelector = containerSelector;
    this.initGrid();
  }

  private initGrid() {
    const container = document.querySelector(this.containerSelector);
    if (!container) {
      throw new Error(
        `Container with selector ${this.containerSelector} not found.`
      );
    }

    this.hexagonGridWrapper = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );

    const classes = [
      'bestagon-grid',
      `bestagon-gType--${this.gridType}`,
      `bestagon-hType--${this.hexagonType}`,
      `bestagon-hOrder--${this.hexagonOrder}`,
    ];

    this.hexagonGridWrapper.classList.add(...classes);
    this.hexagonGridWrapper.setAttribute('viewBox', this.generateViewBox());
    container.appendChild(this.hexagonGridWrapper);

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', 'hexagon');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', HEX_POLYGON);
    clipPath.appendChild(polygon);
    defs.appendChild(clipPath);

    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `.tile foreignObject { clip-path: url(#hexagon); }`;
    defs.appendChild(style);
    
    this.hexagonGridWrapper.appendChild(defs);

    this.grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.hexagonGridWrapper.appendChild(this.grid);

    if (this.hexagonType === HexagonType.Pointy) {
      this.grid.setAttribute('transform', 'rotate(-30)');
    }

    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        this.generateHexagon(c, r);
      }
    }
  }

  generateHexagon(column: number, row: number) {
    
  }

  private generateViewBox() {
    if (this.hexagonType === HexagonType.Pointy) {
      const viewboxX =
        this.columns *
        BestagonGrid.DIAGONAL_SHORT +
        (this.rows > 1 ? HEX_APOTHEM : 0);
      const viewboxY =
        (4*200)-(3*50)
        this.rows *
        BestagonGrid.DIAGONAL_LONG -
        ((HEX_RADIUS / 2) * (this.rows - 1));
      if (this.hexagonOrder === HexagonOrder.Odd) {
        return `-44 -75 ${viewboxX} ${viewboxY}`;
      }
      return `42 -75 ${viewboxX} ${viewboxY}`;
    }

    const viewboxX =
      this.columns *
      (HEX_RADIUS * 1.5) +
      ((HEX_RADIUS * 1.5) / 3);
    const viewboxY =
      this.rows *
        (HEX_APOTHEM * 2) +
      HEX_APOTHEM;
    return `0 0 ${viewboxX} ${viewboxY}`;
  }

  /* private editHexagon(
    column: number,
    row: number,
    content: string,
    newClass: string
  ) {
    const hexagon = this.grid.children[
      row * this.columns + column
    ] as SVGGElement;

    if (!hexagon) {
      console.log(`Hexagon not found - Column: ${column}, Row: ${row}`, 'error');
      return;
    }

    const textElement = hexagon.querySelector('text');
    if (textElement) {
      textElement.textContent = content;
    }
    hexagon.setAttribute('class', `tile ${newClass}`);
    console.log(`Edited Hexagon - Column: ${column}, Row: ${row}`);
  } */
}
