import React from 'react';
import isEmbed from '../utils/isEmbed';
import { NavLink } from 'react-router-dom';
const InternalLink = ({to, children, ...other}) => {
  if (isEmbed) {
    return <span {...other}>{children}</span>;
  } else {
    return <NavLink {...other} to={to}>{children}</NavLink>
  }
}
export default InternalLink;


