import React from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import InternalLink from '../InternalLink';


const SwitchButton = function({mainContentMode, changeMainContentMode, cardUrl, landscapeUrl, serverlessUrl}) {
  return <Tabs
          value={mainContentMode}
          indicatorColor="primary"
          textColor="primary"
          style={{marginLeft: 5, fontSize: '9px', textTransform: ''}}
          onChange={(_event, value) => changeMainContentMode(value)}
        >
          <Tab label="Card Mode" style={{textTransform: '', fontSize: '9px'}} component={(props) => <InternalLink to={cardUrl} {...props}></InternalLink>} value="card"/>
          <Tab label="Landscape" style={{textTransform: '', fontSize: '9px'}} component={(props) => <InternalLink to={landscapeUrl} {...props}></InternalLink>} value="landscape"/>
          <Tab label="Serverless" style={{textTransform: '', fontSize: 9}} component={(props) => <InternalLink to={serverlessUrl} {...props}></InternalLink>} value="serverless"/>
        </Tabs>
}
export default SwitchButton;
