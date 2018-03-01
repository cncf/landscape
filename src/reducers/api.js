import data from '../data.json';
export async function loadData() {
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
