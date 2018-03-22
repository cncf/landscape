import React from 'react';
import { OutboundLink } from 'react-ga';

const Ad = () => {

  const url = "https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/?utm_source=interactive_landscape&utm_medium=web&utm_campaign=kccnceu18";
  const imgsrc = "/images/kubecon.jpg";

  return <OutboundLink className="sidebar-event"
    eventLabel={url}
    to={url}
    target="_blank">
    <img src={imgsrc} />
  </OutboundLink>
}
export default Ad;
