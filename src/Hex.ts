import { HEX_APOTHEM, HEX_RADIUS } from "./constants";
export class Hexagon {
  private row: number;
  private column: number;
  private HexType: HexagonType;
  private HexOrder: HexagonOrder;
  private GridType: GridType;
  private data: HexagonData[];


  static DIAGONAL_LONG = HEX_RADIUS * 2;
  static DIAGONAL_SHORT = HEX_APOTHEM * 2;

  static OFFSETS = {
    X: HEX_RADIUS*1.5,
    Y: HEX_APOTHEM,
  };

  constructor(
    row: number,
    column: number,
    hexType: HexagonType,
    hexOrder: HexagonOrder,
    gridType: GridType,
    data?: HexagonData[]
  ) {
    this.row = row;
    this.column = column;
    this.HexType = hexType;
    this.HexOrder = hexOrder;
    this.GridType = gridType;
    this.data = data || [];
  }
    

  private drawHexagon() {
    const offsetX = this.generateXPosition();
    const offsetY = this.generateYPosition();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('tile');
    g.setAttribute('transform', `translate(${offsetX},${offsetY})`);

    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );
    foreignObject.setAttribute('width', (Hexagon.DIAGONAL_LONG).toString());
    foreignObject.setAttribute('height', (Hexagon.DIAGONAL_SHORT).toString());
    const div = document.createElement('div');
    div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    div.addEventListener('click', event => {
      // this.handleHexagonClick(event, column, row)
    });
    div.innerHTML = `<p>${this.column},${this.row}</p>`;

    const hexagonData = this.data.find((hexData) => hexData.column === this.column && hexData.row === this.row);
    if (hexagonData) {
      if (hexagonData.type instanceof Array) {
        div.classList.add(hexagonData.type.join(' '));
      } else {
        div.classList.add(hexagonData.type);
      }
    }

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    // Todo: Add append child to other class.
    // this.grid.appendChild(g);
  }

  private editHexagon() {
  }

  private generateXPosition() {
    if (this.HexType === HexagonType.Pointy) {
      const posX =
        Math.floor(this.row / 2) *
        Hexagon.OFFSETS.X *
        -1 +
        this.column *
        Hexagon.OFFSETS.X;

      return this.HexOrder === HexagonOrder.Odd && this.row % 2
        ? posX - Hexagon.OFFSETS.X - this.column
        : posX - this.column;
    }
    
    return this.column * Hexagon.OFFSETS.X - this.column;
  }
    
  private generateYPosition() {
    if (this.HexType === HexagonType.Pointy) {
    const posY =
      this.row * Hexagon.OFFSETS.Y +
      (Math.ceil(this.row / 2) + this.column) *
      Hexagon.OFFSETS.Y;

    return this.HexOrder === HexagonOrder.Odd && this.row % 2
      ? posY - Hexagon.OFFSETS.Y - this.row
      : posY - this.row;
    }

    const defineOffsetColumn = this.HexOrder === HexagonOrder.Even ? 0 : 1;
    const isOffsetColumn = this.column % 2 === defineOffsetColumn;
    return (
      this.row * (Hexagon.OFFSETS.Y * 2) +
      (isOffsetColumn ? Hexagon.OFFSETS.Y - this.row : 0 - this.row)
    );
  }

  private handleHexagonClick(event: MouseEvent) {
    console.log(`Clicked on Hexagon - Column: ${this.column}, Row: ${this.row}`);
  }
}