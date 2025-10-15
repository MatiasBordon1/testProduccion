export function getCameraPosition(topView) {
  return topView
    ? [0, 100, 0]  // Vista cenital
    : [0, 40, 90]; // Vista en perspectiva
}