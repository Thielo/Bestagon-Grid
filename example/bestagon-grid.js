"use strict";
var GridType;
(function (GridType) {
    GridType["Grid"] = "grid";
    GridType["Circular"] = "circular";
})(GridType || (GridType = {}));
var HexagonType;
(function (HexagonType) {
    HexagonType["Flat"] = "flat";
    HexagonType["Pointy"] = "pointy";
})(HexagonType || (HexagonType = {}));
var HexagonOrder;
(function (HexagonOrder) {
    HexagonOrder["Even"] = "even";
    HexagonOrder["Odd"] = "odd";
})(HexagonOrder || (HexagonOrder = {}));
var BestagonGrid = /** @class */ (function () {
    function BestagonGrid(size, containerSelector, gridType, hexagonType, hexagonOrder, data) {
        this.size = size;
        this.gridType = gridType || GridType.Circular;
        this.hexagonType = hexagonType || HexagonType.Flat;
        this.hexagonOrder = hexagonOrder || HexagonOrder.Odd;
        this.rows = Array.isArray(size) ? size[0] : size;
        this.columns = Array.isArray(size) ? size[1] : size;
        this.containerSelector = containerSelector;
        this.initGrid();
    }
    BestagonGrid.prototype.initGrid = function () {
        var _a;
        var container = document.querySelector(this.containerSelector);
        if (!container) {
            throw new Error("Container with selector ".concat(this.containerSelector, " not found."));
        }
        this.hexagonGridWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var classes = [
            'bestagon-grid',
            "bestagon-gType--".concat(this.gridType),
            "bestagon-hType--".concat(this.hexagonType),
            "bestagon-hOrder--".concat(this.hexagonOrder),
        ];
        (_a = this.hexagonGridWrapper.classList).add.apply(_a, classes);
        this.hexagonGridWrapper.setAttribute('viewBox', this.generateViewBox());
        this.grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.hexagonGridWrapper.appendChild(this.grid);
        if (this.hexagonType === HexagonType.Pointy) {
            this.grid.setAttribute('transform', 'rotate(-30)');
        }
        container.appendChild(this.hexagonGridWrapper);
        for (var c = 0; c < this.columns; c++) {
            for (var r = 0; r < this.rows; r++) {
                this.generateHexagon(c, r);
            }
        }
    };
    BestagonGrid.prototype.handleHexagonClick = function (event, column, row) {
        console.log("Clicked on Hexagon - Column: ".concat(column, ", Row: ").concat(row));
    };
    BestagonGrid.prototype.generateHexagon = function (column, row) {
        var _this = this;
        var offsetX = this.generateXPosition(row, column);
        var offsetY = this.generateYPosition(row, column);
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('tile');
        g.setAttribute('transform', "translate(".concat(offsetX, ",").concat(offsetY, ")"));
        var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', BestagonGrid.HEXAGON_POLYGON_POINTS);
        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.setAttribute('width', '200');
        foreignObject.setAttribute('height', '174');
        var div = document.createElement('div');
        div.addEventListener('click', function (event) {
            alert('Clicked on div');
            _this.handleHexagonClick(event, column, row);
        });
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = "".concat(column, ",").concat(row);
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
    };
    BestagonGrid.prototype.generateViewBox = function () {
        var viewboxX = this.columns *
            BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X +
            BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X / 3;
        var viewboxY = this.rows *
            (BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
            BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y;
        if (this.hexagonType === HexagonType.Pointy) {
            if (this.hexagonOrder === HexagonOrder.Odd) {
                return "-44 -75 ".concat(viewboxY, " ").concat(viewboxX);
            }
            return "42 -75 ".concat(viewboxY, " ").concat(viewboxX);
        }
        return "0 0 ".concat(viewboxX, " ").concat(viewboxY);
    };
    BestagonGrid.prototype.generateXPosition = function (row, column) {
        if (this.hexagonType === HexagonType.Pointy) {
            var posX = Math.floor(row / 2) *
                BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X *
                -1 +
                column *
                    BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X;
            return this.hexagonOrder === HexagonOrder.Odd && row % 2
                ? posX - BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X
                : posX;
        }
        return (column * BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].X);
    };
    BestagonGrid.prototype.generateYPosition = function (row, column) {
        if (this.hexagonType === HexagonType.Pointy) {
            var posY = row * BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y +
                (Math.ceil(row / 2) + column) *
                    BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y;
            return this.hexagonOrder === HexagonOrder.Odd && row % 2
                ? posY - BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y
                : posY;
        }
        var defineOffsetColumn = this.hexagonOrder === HexagonOrder.Even ? 0 : 1;
        var isOffsetColumn = column % 2 === defineOffsetColumn;
        return (row *
            (BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y * 2) +
            (isOffsetColumn
                ? BestagonGrid.HEXAGON_OFFSETS[this.hexagonType][this.hexagonOrder].Y
                : 0));
    };
    BestagonGrid.prototype.editHexagon = function (column, row, content, newClass) {
        var hexagon = this.grid.children[row * this.columns + column];
        if (!hexagon) {
            console.error("Hexagon not found - Column: ".concat(column, ", Row: ").concat(row));
            return;
        }
        var textElement = hexagon.querySelector('text');
        if (textElement) {
            textElement.textContent = content;
        }
        hexagon.setAttribute('class', "tile ".concat(newClass));
        console.log("Edited Hexagon - Column: ".concat(column, ", Row: ").concat(row));
    };
    BestagonGrid.HEXAGON_RADIUS = 100;
    BestagonGrid.HEXAGON_POLYGON_POINTS = '200,87 150,0 50,0 0,87 50,174 150,174';
    BestagonGrid.HEXAGON_OFFSETS = {
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
    return BestagonGrid;
}());
// Create a factory function for creating Bestagon instances
function createBestagonGrid(size, containerSelector, gridType, hexagonType) {
    return new BestagonGrid(size, containerSelector, gridType, hexagonType);
}
//# sourceMappingURL=bestagon-grid.js.map