import React from 'react';
import { NavLink } from 'react-router-dom';

const presets = [{
  url: "/grouping=no&license=open-source&sort=first-commit",
  label: 'Open source by first commit'
},{
  url: "/grouping=landscape",
  label: 'Landscape categories'
},{
  url:  "/grouping=no&license=open-source&sort=stars",
  label: 'Open source by stars'
}, {
  url:   "/grouping=landscape&headquarters=beijing-china,chengdu-china,haidian-china,haikou-china,hangzhou-china,shenzhen-china,suzhou-china,taipei-china",
  label: 'Offerings from China'
}, {
  url: "/grouping=landscape&landscape=certified-kubernetes-distribution,certified-kubernetes-platform,special",
  label: 'Certified K8s and KCSPs'
}, {
  url: "/grouping=no&sort=amount",
  label: 'Sort by MCap/Funding'
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
