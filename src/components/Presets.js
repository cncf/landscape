import React from 'react';
import { NavLink } from 'react-router-dom';

const presets = [{
  url: "/grouping=no&license=open-source&sort=first-commit",
  label: 'Open source by age'
},{
  url: "/grouping=landscape",
  label: 'Landscape categories'
},{
  url:  "/grouping=no&license=open-source&sort=stars",
  label: 'Open source by stars'
}, {
  url:   "/grouping=landscape&headquarters=beijing-china,changsha-china,chengdu-china,haidian-china,haikou-china,hangzhou-china,jinan-china,shanghai-china,shenzhen-china,suzhou-china,taipei-china",
  label: 'Offerings from China'
}, {
  url: "/grouping=landscape&landscape=certified-kubernetes-distribution,certified-kubernetes-hosted,certified-kubernetes-installer,special",
  label: 'Certified K8s/KCSP/KTP'
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
