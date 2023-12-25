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
    function BestagonGrid(size, containerSelector, gridType, hexagonType, hexagonOrder, data, debug) {
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
    BestagonGrid.prototype.initGrid = function () {
        var _b;
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
        (_b = this.hexagonGridWrapper.classList).add.apply(_b, classes);
        this.hexagonGridWrapper.setAttribute('viewBox', this.generateViewBox());
        container.appendChild(this.hexagonGridWrapper);
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'hexagon');
        var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', _a.HEX_POLYGON);
        clipPath.appendChild(polygon);
        defs.appendChild(clipPath);
        var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = ".tile foreignObject { clip-path: url(#hexagon); }";
        defs.appendChild(style);
        this.hexagonGridWrapper.appendChild(defs);
        this.grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.hexagonGridWrapper.appendChild(this.grid);
        if (this.hexagonType === HexagonType.Pointy) {
            this.grid.setAttribute('transform', 'rotate(-30)');
        }
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
        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.setAttribute('width', (_a.HEX_DIAGONAL_LONG).toString());
        foreignObject.setAttribute('height', (_a.HEX_DIAGONAL_SHORT).toString());
        var div = document.createElement('div');
        div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        div.addEventListener('click', function (event) {
            _this.handleHexagonClick(event, column, row);
        });
        if (this.debug) {
            div.innerHTML = "<p>".concat(column, ",").concat(row, "</p>");
        }
        var hexagonData = this.data.find(function (hexData) { return hexData.column === column && hexData.row === row; });
        if (hexagonData) {
            if (hexagonData.type instanceof Array) {
                div.classList.add(hexagonData.type.join(' '));
            }
            else {
                div.classList.add(hexagonData.type);
            }
        }
        foreignObject.appendChild(div);
        g.appendChild(foreignObject);
        this.grid.appendChild(g);
    };
    BestagonGrid.prototype.generateViewBox = function () {
        if (this.hexagonType === HexagonType.Pointy) {
            var viewboxX_1 = this.columns *
                _a.HEX_DIAGONAL_SHORT +
                (this.rows > 1 ? _a.HEX_APOTHEM : 0);
            var viewboxY_1 = (4 * 200) - (3 * 50);
            this.rows *
                _a.HEX_DIAGONAL_LONG -
                ((_a.HEX_RADIUS / 2) * (this.rows - 1));
            if (this.hexagonOrder === HexagonOrder.Odd) {
                return "-44 -75 ".concat(viewboxX_1, " ").concat(viewboxY_1);
            }
            return "42 -75 ".concat(viewboxX_1, " ").concat(viewboxY_1);
        }
        var viewboxX = this.columns *
            _a.HEX_OFFSETS.X +
            _a.HEX_OFFSETS.X / 3;
        var viewboxY = this.rows *
            (_a.HEX_OFFSETS.Y * 2) +
            _a.HEX_OFFSETS.Y;
        return "0 0 ".concat(viewboxX, " ").concat(viewboxY);
    };
    BestagonGrid.prototype.generateXPosition = function (row, column) {
        if (this.hexagonType === HexagonType.Pointy) {
            var posX = Math.floor(row / 2) *
                _a.HEX_OFFSETS.X *
                -1 +
                column *
                    _a.HEX_OFFSETS.X;
            return this.hexagonOrder === HexagonOrder.Odd && row % 2
                ? posX - _a.HEX_OFFSETS.X - column
                : posX - column;
        }
        return (column * _a.HEX_OFFSETS.X - column);
    };
    BestagonGrid.prototype.generateYPosition = function (row, column) {
        if (this.hexagonType === HexagonType.Pointy) {
            var posY = row * _a.HEX_OFFSETS.Y +
                (Math.ceil(row / 2) + column) *
                    _a.HEX_OFFSETS.Y;
            return this.hexagonOrder === HexagonOrder.Odd && row % 2
                ? posY - _a.HEX_OFFSETS.Y - row
                : posY - row;
        }
        var defineOffsetColumn = this.hexagonOrder === HexagonOrder.Even ? 0 : 1;
        var isOffsetColumn = column % 2 === defineOffsetColumn;
        return (row *
            (_a.HEX_OFFSETS.Y * 2) +
            (isOffsetColumn
                ? _a.HEX_OFFSETS.Y - row
                : 0 - row));
    };
    BestagonGrid.prototype.editHexagon = function (column, row, content, newClass) {
        var hexagon = this.grid.children[row * this.columns + column];
        if (!hexagon) {
            this.logger("Hexagon not found - Column: ".concat(column, ", Row: ").concat(row), 'error');
            return;
        }
        var textElement = hexagon.querySelector('text');
        if (textElement) {
            textElement.textContent = content;
        }
        hexagon.setAttribute('class', "tile ".concat(newClass));
        console.log("Edited Hexagon - Column: ".concat(column, ", Row: ").concat(row));
    };
    BestagonGrid.prototype.logger = function (data, type) {
        if (type === void 0) { type = 'log'; }
        if (!this.debug) {
            if (type === 'error') {
                console.error(data);
            }
            else {
                console.log(data);
            }
        }
    };
    var _a;
    _a = BestagonGrid;
    BestagonGrid.HEX_RADIUS = 100;
    BestagonGrid.HEX_DIAGONAL_LONG = _a.HEX_RADIUS * 2;
    BestagonGrid.HEX_APOTHEM = 87;
    BestagonGrid.HEX_DIAGONAL_SHORT = _a.HEX_APOTHEM * 2;
    BestagonGrid.HEX_POLYGON = "".concat(_a.HEX_DIAGONAL_LONG, ",").concat(_a.HEX_APOTHEM, " ").concat(_a.HEX_RADIUS * 1.5, ",0 ").concat(_a.HEX_RADIUS / 2, ",0 0,").concat(_a.HEX_APOTHEM, " ").concat(_a.HEX_RADIUS / 2, ",").concat(_a.HEX_DIAGONAL_SHORT, " ").concat(_a.HEX_RADIUS * 1.5, ",").concat(_a.HEX_DIAGONAL_SHORT);
    BestagonGrid.HEX_OFFSETS = {
        X: _a.HEX_RADIUS * 1.5,
        Y: _a.HEX_APOTHEM,
    };
    return BestagonGrid;
}());
// Create a factory function for creating Bestagon instances
function createBestagonGrid(size, containerSelector, gridType, hexagonType) {
    return new BestagonGrid(size, containerSelector, gridType, hexagonType);
}
//# sourceMappingURL=bestagon-grid.js.map