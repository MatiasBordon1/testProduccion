// src/models/lote.js

export const oroLotes = [
  21, 31, 41, 51, 61, 71, 35, 36, 45, 46, 55, 56, 65, 66, 30, 40, 50, 60, 70, 80
];

export const plataLotes = [
  11, 12, 22, 32, 42, 52, 62, 72, 82, 81,
  24, 25, 26, 27, 34, 37, 44, 47, 54, 57, 64, 67, 74, 75, 76, 77,
  19, 20, 29, 39, 49, 59, 69, 79, 89, 90
];

export const bronceLotes = Array.from({ length: 100 }, (_, i) => i + 1).filter(
  i => ![...oroLotes, ...plataLotes].includes(i)
);

export function crearLotes({ colorBase, onClick, showLotes, activeTiers, reservedLots = [] }) {
  const lotes = [];
  const rows = 10;
  const cols = 10;
  const width = 91;
  const height = 55;

  const marginX = 5; // margen horizontal interno
  const marginZ = 5; // margen vertical interno

  const usableWidth = width - marginX * 2;
  const usableHeight = height - marginZ * 2;

  const lotWidth = usableWidth / cols;
  const lotHeight = usableHeight / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j + 1;
      // Determine base color or red if reserved
      let color = colorBase(index, activeTiers);
      if (reservedLots.includes(index)) {
        color = 'red';
      }

      lotes.push({
        id: index,
        position: [
          -width / 2 + marginX + lotWidth / 2 + j * lotWidth,
          0.01,
          -height / 2 + marginZ + lotHeight / 2 + i * lotHeight
        ],
        row: i,
        col: j,
        color,
        visible: showLotes,
        onClick: () => onClick(index)
      });
    }
  }

  return lotes;
}