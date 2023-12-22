# Bestagon-Grid

Bestagon-Grid a ⬡ Hexagon-Grid Library built with Typescript.

Why "Bestagon"?
Explained by CGP Grey
https://www.youtube.com/watch?v=thOifuHs6eY

## Installation

```bash
npm run dev
```
or
```bash
npm run build
````

## Usage

```html
<div id="grid"></div>
```

```javascript
const grid = new Bestagon(4, '#grid');
```

## Parameters

```
size: [number, number] number - rows & columns
containerSelector? string - Query selector that will contain the Grid
gridType? - 'grid' / 'circular' ('circular' not yet implemented)
hexagonType? - 'flat' / 'pointy'
hexagonOrder? - 'even' / 'odd'
data? - Object with Data for each Hexagon Tile (in progress)
```