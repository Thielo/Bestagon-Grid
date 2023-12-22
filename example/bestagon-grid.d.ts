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
    type: string;
}
declare class BestagonGrid {
    private size;
    private rows;
    private columns;
    private containerSelector;
    private gridType;
    private hexagonType;
    private hexagonOrder;
    private hexagonGridWrapper;
    private grid;
    static HEXAGON_RADIUS: number;
    static HEXAGON_POLYGON_POINTS: string;
    static HEXAGON_OFFSETS: {
        pointy: {
            even: {
                X: number;
                Y: number;
            };
            odd: {
                X: number;
                Y: number;
            };
        };
        flat: {
            even: {
                X: number;
                Y: number;
            };
            odd: {
                X: number;
                Y: number;
            };
        };
    };
    constructor(size: [number, number] | number, containerSelector: string, gridType?: GridType, hexagonType?: HexagonType, hexagonOrder?: HexagonOrder, data?: HexagonData[]);
    private initGrid;
    private handleHexagonClick;
    generateHexagon(column: number, row: number): void;
    private generateViewBox;
    private generateXPosition;
    private generateYPosition;
    private editHexagon;
}
declare function createBestagonGrid(size: [number, number] | number, containerSelector: string, gridType: GridType, hexagonType: HexagonType): BestagonGrid;
