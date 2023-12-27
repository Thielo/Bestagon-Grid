declare enum GridType {
    Grid = 'grid',
    Circular = 'circular',
}
  
declare enum HexagonType {
    Flat = 'flat',
    Pointy = 'pointy',
}
  
declare enum HexagonOrder {
    Even = 'even',
    Odd = 'odd',
}
  
declare interface HexagonData {
    column: number;
    row: number;
    type: string | string[];
}