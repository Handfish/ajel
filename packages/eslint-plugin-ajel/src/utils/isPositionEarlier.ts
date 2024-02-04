import { Position } from 'estree';

export function isPositionEarlier(pos1: Position, pos2: Position): boolean {
  return (
    pos1.line < pos2.line ||
    (pos1.line === pos2.line && pos1.column < pos2.column)
  );
}
