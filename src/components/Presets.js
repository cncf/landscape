import React from 'react';
import { NavLink } from 'react-router-dom';

const presets = [{
  url: "/grouping=no&license=open-source&sort=first-commit",
  label: 'Open source projects by first commit'
},{
  url: "/grouping=landscape",
  label: 'Landscape categories'
},{
  url:  "/grouping=no&license=open-source&sort=stars",
  label: 'Open source projects by stars'
}, {
  url:   "/grouping=headquarters&headquarters=new-york-new-york",
  label: 'Offerings from New York'
}, {
  url: "/grouping=landscape&license=apache-2-0&sort=stars",
  label: 'Apache-licensed projects by category and stars'
}];
const Presets = () => {
  return (
    <div className="sidebar-presets">
      <h4>Example filters:</h4>{presets.map( entry => (
      <div><NavLink key={entry.url} className="preset" activeClassName="active" to={entry.url}>{entry.label}</NavLink></div>
    ))}
    </div>
  )
};
export default Presets;
