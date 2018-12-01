// generates html and atom pages from dist/funding.json
import millify from 'millify';
const result = JSON.parse(require('fs').readFileSync('dist/funding.json', 'utf-8'));
const base = `https://landscape.cncf.io`;

const page = `
<head>
  <title>Changes in funding</title>
  <style>
    table {border-spacing: 0px; min-width: 1200px; position: absolute; left: 50%; top: 40px; transform: translateX(-50%); }
    tr { line-height: 2; }
    thead { background: #ccc; font-weight: bold; }
    td { padding: 0px 3px }
  </style>
</head>
<body>
     <table>
     <thead>
       <tr>
         <td>Organization</td>
         <td>Current Funding</td>
         <td>Funding Change</td>
         <td>Date of Change</td>
         <td>Crunchbase URL</td>
       </tr>
     </thead>
         ${result.map(function(item, index) {
           const delta = item.currentAmount - (item.previousAmount || 0);
           return `
               <tr style="${index % 2 === 0 ? '' : 'background: #eee'}">
                 <td><a href="${item.link}" target="_blank">${item.name}</a></td>
                 <td>$${millify(item.currentAmount)}</td>
                 <td style="color: ${delta > 0 ? 'green' : 'red'}">$${millify(delta)}</td>
                 <td>${item.date}</td>
                 <td><a href="${item.url}" target="_blank">${item.name}</a></td>
               </tr>
           `;
         }).join('')}
      </table>
</body>
`;
require('fs').writeFileSync('dist/funding.html', page);


import { Feed } from "feed";
const feed = new Feed({
  title: "Funding changes",
  description: "That feed shows recent changes",
  id: `${base}/`,
  link: `${base}`,
  image: `${base}/favicon.png`,
  favicon: `${base}/favicon.png`,
  updated: new Date(),
  author: {
    name: "CNCF",
    email: "info@cncf.io",
    link: "https://cncf.io"
  }
});

result.forEach(item => {
  const delta = item.currentAmount - (item.previousAmount || 0);
  const text = `${item.name} got funding of $${millify(delta)}, now totalling $${millify(item.currentAmount)}, on ${item.date}`;
  feed.addItem({
    title: text,
    id: `${item.name}${item.date}`,
    link: item.url,
    description: text,
    content: text,
    date: new Date(Date.parse(item.date)),
    updated: new Date(Date.parse(item.date))
  });
});

require('fs').writeFileSync('dist/funding.atom', feed.atom1());


