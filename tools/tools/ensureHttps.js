export default function(x) {
  if (!x) {
    return x;
  }
  return x.replace('http://', 'https://');
}
