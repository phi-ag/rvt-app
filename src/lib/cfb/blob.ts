export const sliceUint8 = async (
  blob: Blob,
  start: number,
  end: number
): Promise<Uint8Array> => new Uint8Array(await blob.slice(start, end).arrayBuffer());

export const sliceView = async (
  blob: Blob,
  start: number,
  end: number
): Promise<DataView> => new DataView(await blob.slice(start, end).arrayBuffer());
