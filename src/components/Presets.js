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
  url:   "/grouping=landscape&headquarters=beijing-china,chengdu-china,haidian-china,haikou-china,hangzhou-china,shenzhen-china,suzhou-china,taipei-china",
  label: 'Offerings from China'
}, {
  url: "/grouping=landscape&landscape=certified-kubernetes-distribution,certified-kubernetes-platform,special",
  label: 'Certified Kubernetes and KCSPs'
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
