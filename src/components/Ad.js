import React from 'react';
import { OutboundLink } from 'react-ga';

const Ad = () => {

  const url = "https://www.lfasiallc.com/events/kubecon-cloudnativecon-china-2018/?utm_source=interactive_landscape&utm_medium=web&utm_campaign=kccncch18";
  const imgsrc = "/images/kubecon.jpg";
  const url2 = "https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/?utm_source=interactive_landscape&utm_medium=web&utm_campaign=kccncna18";
  const imgsrc2 = "/images/kubecon2.jpg";

  return <div id="kubecon">
  <OutboundLink className="sidebar-event"
    eventLabel={url}
    to={url}
    target="_blank">
    <img src={imgsrc} />
  </OutboundLink>
  <OutboundLink className="sidebar-event"
    eventLabel={url2}
    to={url2}
    target="_blank">
    <img src={imgsrc2} />
  </OutboundLink>
  </div>
}
export default Ad;
