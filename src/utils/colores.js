import { oroLotes, plataLotes, bronceLotes } from '../models/lote';

export function getColor(index, activeTiers) {
  if (activeTiers.oro && oroLotes.includes(index)) return '#beab47';
  if (activeTiers.plata && plataLotes.includes(index)) return '#d9d7ce';
  if (activeTiers.bronce && bronceLotes.includes(index)) return '#ad956c'; // bronce
  return 'gray';
}