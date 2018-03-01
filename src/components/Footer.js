import React from 'react';
import { OutboundLink } from 'react-ga';

const Footer = () => {
  return <div style={{ marginTop: 10, fontSize:'9pt', width: '100%', textAlign: 'center' }}>
    Crunchbase data is used under license from Crunchbase to CNCF. For more information, please see <OutboundLink eventLabel="crunchbase-terms" to="https://data.crunchbase.com/v3.1/docs/terms">terms</OutboundLink>.
  </div>
}
export default Footer;
