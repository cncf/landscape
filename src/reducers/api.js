import preview from '../preview.json';
function processData(data) {
  return data.map(function(entry) {
    if (!entry.latestCommitDate) {
      return entry;
    }
    if (new Date().getTime() - new Date(entry.latestCommitDate).getTime() < 86400 * 1000) {
      return { ...entry, latestCommitDate: '$TODAY$'};
    }
    return entry;
  });
}
export async function loadData() {
  const data = await (await fetch('/data.json')).json();
  return processData(data);
}

export async function loadPreviewData() {
  return processData(preview);
}
