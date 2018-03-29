import _ from 'lodash';
export default function exportItems(groupedItems) {
  const elements = _.flatten(_.map(groupedItems, 'items'));
  const fields = [{
    label: 'Name',
    value: 'name'
  }];

    const Json2csvParser = require('json2csv').Parser;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(elements, { fields });


  downloadCSV(csv);
}
function downloadCSV(csv) {
  var data, filename, link;
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
