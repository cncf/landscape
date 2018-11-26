import React from 'react';
import { OutboundLink } from 'react-ga';

const Footer = () => {
  return <div style={{ marginTop: 10, fontSize:'9pt', width: '100%', textAlign: 'center' }}>
    Crunchbase data is used under license from Crunchbase to LFDL. For more information, please see the <OutboundLink eventLabel="crunchbase-terms" to="https://github.com/cncf/landscape/blob/master/README.md#license" target="_blank">license</OutboundLink> info.
  </div>
}
export default Footer;
