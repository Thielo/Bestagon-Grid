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
  type: string | string[];
}

class BestagonGrid {
  private size: [number, number] | number;
  private rows: number;
  private columns: number;
  private containerSelector: string;
  private data: HexagonData[];
  private debug: boolean;
  private gridType: GridType;
  private hexagonType: HexagonType;
  private hexagonOrder: HexagonOrder;
  private hexagonGridWrapper!: SVGSVGElement;
  private grid!: SVGGElement;

  static HEX_RADIUS = 100;
  static HEX_POLYGON = '200,87 150,0 50,0 0,87 50,174 150,174';
  static HEX_OFFSETS = {
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
    data?: HexagonData[],
    debug?: boolean
  ) {
    this.size = size;
    this.gridType = gridType || GridType.Circular;
    this.hexagonType = hexagonType || HexagonType.Flat;
    this.hexagonOrder = hexagonOrder || HexagonOrder.Odd;
    this.rows = Array.isArray(size) ? size[0] : size;
    this.columns = Array.isArray(size) ? size[1] : size;
    this.data = data || [];
    this.debug = debug || false;
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
    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    polygon.setAttribute('points', BestagonGrid.HEX_POLYGON);
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

  private handleHexagonClick(event: MouseEvent, column: number, row: number) {
    console.log(`Clicked on Hexagon - Column: ${column}, Row: ${row}`);
  }

  generateHexagon(column: number, row: number) {
    const offsetX = this.generateXPosition(row, column);
    const offsetY = this.generateYPosition(row, column);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('tile');
    g.setAttribute('transform', `translate(${offsetX},${offsetY})`);

    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );
    foreignObject.setAttribute('width', '200');
    foreignObject.setAttribute('height', '174');
    const div = document.createElement('div');
    div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    div.addEventListener('click', event => {
      this.handleHexagonClick(event, column, row)
    });

    if (this.debug) {
      div.innerHTML = `<p>${column},${row}</p>`;
    }

    const hexagonData = this.data.find((hexData) => hexData.column === column && hexData.row === row);
    if (hexagonData) {
      if (hexagonData.type instanceof Array) {
        div.classList.add(hexagonData.type.join(' '));
      } else {
        div.classList.add(hexagonData.type);
      }
    }

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    this.grid.appendChild(g);
  }

  private generateViewBox() {
    const viewboxX =
      this.columns *
        BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X +
      BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X / 3;
    const viewboxY =
      this.rows *
        (BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
      BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y;

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
          BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X *
          -1 +
        column *
          BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X;
      return this.hexagonOrder === HexagonOrder.Odd && row % 2
        ? posX - BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X
        : posX;
    }

    return (
      column * BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].X
    );
  }

  private generateYPosition(row: number, column: number) {
    if (this.hexagonType === HexagonType.Pointy) {
      const posY =
        row * BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y +
        (Math.ceil(row / 2) + column) *
          BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y;

      return this.hexagonOrder === HexagonOrder.Odd && row % 2
        ? posY - BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y
        : posY;
    }

    const defineOffsetColumn = this.hexagonOrder === HexagonOrder.Even ? 0 : 1;
    const isOffsetColumn = column % 2 === defineOffsetColumn;
    return (
      row *
        (BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
      (isOffsetColumn
        ? BestagonGrid.HEX_OFFSETS[this.hexagonType][this.hexagonOrder].Y
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
