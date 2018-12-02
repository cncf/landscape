import preview from '../preview.json';
import unpack from '../utils/unpackArray';
export async function loadData() {
  const data = await (await fetch('/data.json')).json();
  return data;
}

export async function loadPreviewData() {
  return unpack(preview);
}
