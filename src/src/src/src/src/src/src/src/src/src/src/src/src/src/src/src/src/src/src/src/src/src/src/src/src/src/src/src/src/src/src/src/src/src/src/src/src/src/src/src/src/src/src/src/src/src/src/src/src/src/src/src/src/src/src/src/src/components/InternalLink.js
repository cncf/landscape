import React from 'react';
import isEmbed from '../utils/isEmbed';
import { NavLink } from 'react-router-dom';
const skipDefaultHandler = (e) => e.preventDefault();
const InternalLink = ({to, children, onClick, ...other}) => {
  if (onClick) {
    other.onClick = function(e) {
      skipDefaultHandler(e);
      onClick();
    };
  }
  if (isEmbed) {
    return <span {...other}>{children}</span>;
  } else {
    return <NavLink {...other} to={to}>{children}</NavLink>
  }
}
export default InternalLink;


