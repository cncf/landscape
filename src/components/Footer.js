import React from 'react';
import { OutboundLink } from 'react-ga';

const Footer = () => {
  return <div style={{ marginTop: 10, fontSize:'9pt', width: '100%', textAlign: 'center' }}>
    Crunchbase data is used under license from Crunchbase to CNCF. For more information, please see the <OutboundLink eventLabel="crunchbase-terms" to="https://github.com/cncf/landscape#license" target="_blank">license</OutboundLink> info.
  </div>
}
export default Footer;
