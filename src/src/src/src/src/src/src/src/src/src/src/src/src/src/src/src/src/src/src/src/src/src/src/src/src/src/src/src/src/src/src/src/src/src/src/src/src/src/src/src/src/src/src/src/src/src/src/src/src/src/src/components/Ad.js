import React from 'react';
import { OutboundLink } from 'react-ga';

const Ad = () => {

  const url = "https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/?utm_source=interactive_landscape&utm_medium=web&utm_campaign=kccncna18";
  const imgsrc = "/images/kccncna18.jpg";
  const url2 = "https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019//?utm_source=interactive_landscape&utm_medium=web&utm_campaign=kccnceu19";
  const imgsrc2 = "/images/kccnceu19.jpg";

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
