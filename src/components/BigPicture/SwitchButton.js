import React from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import InternalLink from '../InternalLink';
import isMobile from '../../utils/isMobile';


const SwitchButton = function({mainContentMode, changeMainContentMode, cardUrl, landscapeUrl, serverlessUrl}) {
  if (isMobile) {
    return null;
  }
  return <Tabs
          value={mainContentMode}
          indicatorColor="primary"
          textColor="primary"
          style={{marginLeft: 5}}
          onChange={(_event, value) => changeMainContentMode(value)}
        >
          <Tab label="Card Mode" component={(props) => <InternalLink to={cardUrl} {...props}></InternalLink>} value="card"/>
          <Tab label="Landscape" component={(props) => <InternalLink to={landscapeUrl} {...props}></InternalLink>} value="landscape"/>
          <Tab label="Serverless" component={(props) => <InternalLink to={serverlessUrl} {...props}></InternalLink>} value="serverless"/>
        </Tabs>
}
export default SwitchButton;
