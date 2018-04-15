export default function shortRepoName(url) {
  if (!url) {
    return '';
  }
  return url.split('/').slice(3,5).join('/');
}
