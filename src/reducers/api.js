import preview from '../preview.json';
export async function loadData() {
  const data = await (await fetch('/data.json')).json();
  return data;
}

export async function loadPreviewData() {
  return preview;
}
