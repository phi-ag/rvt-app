export type Boundary = [start: number, end: number];

export type BoundaryWithOffset = [start: number, end: number, offset: number];

export class Boundaries {
  readonly items: BoundaryWithOffset[] = [];

  add([start, end]: Boundary) {
    const previous = this.items[this.items.length - 1];
    if (previous === undefined) {
      this.items.push([start, end, 0]);
      return;
    }

    const [prevStart, prevEnd, prevOffset] = previous;

    if (prevEnd !== start) {
      const offset = prevEnd - prevStart + prevOffset;
      this.items.push([start, end, offset]);
    } else {
      previous[1] = end;
    }
  }

  size(): number {
    const last = this.items[this.items.length - 1];
    if (last === undefined) return 0;

    const [start, end, offset] = last;
    return end - start + offset;
  }
}
