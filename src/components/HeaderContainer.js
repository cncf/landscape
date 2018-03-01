import React from 'react';
import { OutboundLink } from 'react-ga';

const HeaderContainer = () => {
  return (
    <div className="header_container">
      <div className="header">
          <span className="landscape-logo"><img src="/images/cncf-landscape.svg" /></span>
          <OutboundLink eventLabel="cncf" to="https://www.cncf.io/" target="_blank" rel="noopener noreferrer" className="cncf-logo">
    <img src="/images/cncf.svg" />
  </OutboundLink>

      </div>
    </div>
  );
};

export default HeaderContainer;
