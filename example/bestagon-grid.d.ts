declare enum GridType {
    Grid = "grid",
    Circular = "circular"
}
declare enum HexagonType {
    Flat = "flat",
    Pointy = "pointy"
}
declare enum HexagonOrder {
    Even = "even",
    Odd = "odd"
}
interface HexagonData {
    column: number;
    row: number;
    type: string | string[];
}
declare class BestagonGrid {
    private size;
    private rows;
    private columns;
    private containerSelector;
    private data;
    private debug;
    private gridType;
    private hexagonType;
    private hexagonOrder;
    private hexagonGridWrapper;
    private grid;
    static HEX_RADIUS: number;
    static HEX_DIAGONAL_LONG: number;
    static HEX_APOTHEM: number;
    static HEX_DIAGONAL_SHORT: number;
    static HEX_POLYGON: string;
    static HEX_OFFSETS: {
        X: number;
        Y: number;
    };
    constructor(size: [number, number] | number, containerSelector: string, gridType?: GridType, hexagonType?: HexagonType, hexagonOrder?: HexagonOrder, data?: HexagonData[], debug?: boolean);
    private initGrid;
    private handleHexagonClick;
    generateHexagon(column: number, row: number): void;
    private generateViewBox;
    private generateXPosition;
    private generateYPosition;
    private editHexagon;
    private logger;
}
declare function createBestagonGrid(size: [number, number] | number, containerSelector: string, gridType: GridType, hexagonType: HexagonType): BestagonGrid;
