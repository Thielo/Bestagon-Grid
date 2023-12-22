enum GridType {
  Grid = 'grid',
  Circular = 'circular',
}

enum HexagonType {
  Flat = 'flat',
  Pointy = 'pointy',
}

enum HexagonOrder {
  Even = 'even',
  Odd = 'odd',
}

interface HexagonData {
  column: number;
  row: number;
  type: string;
}

class BestagonGrid {
  private size: [number, number] | number;
  private rows: number;
  private columns: number;
  private containerSelector: string;
  private gridType: GridType;
  private hexagonType: HexagonType;
  private hexagonOrder: HexagonOrder;
  private hexagonGridWrapper!: SVGSVGElement;
  private grid!: SVGGElement;

  static HEXAGON_RADIUS = 100;
  static HEXAGON_POLYGON_POINTS = '200,87 150,0 50,0 0,87 50,174 150,174';
  static HEXAGON_OFFSETS = {
    pointy: {
      even: {
        X: 150,
        Y: 87,
      },
      odd: {
        X: 150,
        Y: 87,
      },
    },
    flat: {
      even: {
        X: 150,
        Y: 87,
      },
      odd: {
        X: 150,
        Y: 87,
      },
    },
  };

  constructor(
    size: [number, number] | number,
    containerSelector: string,
    gridType?: GridType,
    hexagonType?: HexagonType,
    hexagonOrder?: HexagonOrder,
    data?: HexagonData[]
  ) {
    this.size = size;
    this.gridType = gridType || GridType.Circular;
    this.hexagonType = hexagonType || HexagonType.Flat;
    this.hexagonOrder = hexagonOrder || HexagonOrder.Odd;
    this.rows = Array.isArray(size) ? size[0] : size;
    this.columns = Array.isArray(size) ? size[1] : size;
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

    this.grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.hexagonGridWrapper.appendChild(this.grid);

    if (this.hexagonType === HexagonType.Pointy) {
      this.grid.setAttribute('transform', 'rotate(-30)');
    }
    container.appendChild(this.hexagonGridWrapper);

    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        this.generateHexagon(c, r);
      }
    }
  }

  private handleHexagonClick(event: MouseEvent, column: number, row: number) {
    console.log(`Clicked on Hexagon - Column: ${column}, Row: ${row}`);
  }

  generateHexagon(column: number, row: number) {
    const offsetX = this.generateXPosition(row, column);
    const offsetY = this.generateYPosition(row, column);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('tile');
    g.setAttribute('transform', `translate(${offsetX},${offsetY})`);

    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    polygon.setAttribute('points', BestagonGrid.HEXAGON_POLYGON_POINTS);

    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );
    foreignObject.setAttribute('width', '200');
    foreignObject.setAttribute('height', '174');
    const div = document.createElement('div');
    div.addEventListener('click', event => {
      alert('Clicked on div');
      this.handleHexagonClick(event, column, row)
    });

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = `${column},${row}`;

    text.setAttribute('x', '90');
    text.setAttribute('y', '90');
    if (this.hexagonType === HexagonType.Pointy) {
      text.setAttribute('transform', 'rotate(30)');
      text.setAttribute('x', '120');
      text.setAttribute('y', '30');
    }

    foreignObject.appendChild(div);
    g.appendChild(polygon);
    g.appendChild(foreignObject);
    g.appendChild(text);
    this.grid.appendChild(g);
  }

  private generateViewBox() {
    const viewboxX =
      this.columns *
        BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X +
      BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X / 3;
    const viewboxY =
      this.rows *
        (BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
      BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y;

    if (this.hexagonType === HexagonType.Pointy) {
      if (this.hexagonOrder === HexagonOrder.Odd) {
        return `-44 -75 ${viewboxY} ${viewboxX}`;
      }
      return `42 -75 ${viewboxY} ${viewboxX}`;
    }
    return `0 0 ${viewboxX} ${viewboxY}`;
  }

  private generateXPosition(row: number, column: number) {
    if (this.hexagonType === HexagonType.Pointy) {
      const posX =
        Math.floor(row / 2) *
          BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X *
          -1 +
        column *
          BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X;
      return this.hexagonOrder === HexagonOrder.Odd && row % 2
        ? posX - BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X
        : posX;
    }

    return (
      column * BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X
    );
  }

  private generateYPosition(row: number, column: number) {
    if (this.hexagonType === HexagonType.Pointy) {
      const posY =
        row * BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y +
        (Math.ceil(row / 2) + column) *
          BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y;

      return this.hexagonOrder === HexagonOrder.Odd && row % 2
        ? posY - BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y
        : posY;
    }

    const defineOffsetColumn = this.hexagonOrder === HexagonOrder.Even ? 0 : 1;
    const isOffsetColumn = column % 2 === defineOffsetColumn;
    return (
      row *
        (BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
      (isOffsetColumn
        ? BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y
        : 0)
    );
  }

  private editHexagon(
    column: number,
    row: number,
    content: string,
    newClass: string
  ) {
    const hexagon = this.grid.children[
      row * this.columns + column
    ] as SVGGElement;

    if (!hexagon) {
      console.error(`Hexagon not found - Column: ${column}, Row: ${row}`);
      return;
    }

    const textElement = hexagon.querySelector('text');
    if (textElement) {
      textElement.textContent = content;
    }
    hexagon.setAttribute('class', `tile ${newClass}`);
    console.log(`Edited Hexagon - Column: ${column}, Row: ${row}`);
  }
}

// Create a factory function for creating Bestagon instances
function createBestagonGrid(
  size: [number, number] | number,
  containerSelector: string,
  gridType: GridType,
  hexagonType: HexagonType
) {
  return new BestagonGrid(size, containerSelector, gridType, hexagonType);
}
