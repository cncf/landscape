export default function exportItems(items) {
  downloadCSV();
}
function downloadCSV(args) {
  var data, filename, link;
  var csv = 'a, b, c';
  filename = 'interactive_landscape.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}
