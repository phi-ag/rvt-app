const findMarker = (data: Uint8Array): number | undefined => {
  const imageMarker = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a];

  for (let i = 0; i < data.length - 6; i++) {
    if (
      data[i] === imageMarker[0] &&
      data[i + 1] === imageMarker[1] &&
      data[i + 2] === imageMarker[2] &&
      data[i + 3] === imageMarker[3] &&
      data[i + 4] === imageMarker[4] &&
      data[i + 5] === imageMarker[5]
    ) {
      return i;
    }
  }
};

export const parsePreview = (data: Uint8Array): Blob | undefined => {
  const marker = findMarker(data);
  if (!marker) {
    console.warn("Failed to find preview image marker");
    return;
  }

  return new Blob([data.subarray(marker)], {
    type: "image/png"
  });
};
