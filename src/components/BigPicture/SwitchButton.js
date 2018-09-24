import React from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import InternalLink from '../InternalLink';
import isMobile from '../../utils/isMobile';
import isEmbed from '../../utils/isEmbed';


const SwitchButton = function({mainContentMode, changeMainContentMode, cardUrl, landscapeUrl, serverlessUrl}) {
  if (isMobile) {
    return null;
  }
  if (isEmbed) {
    return null;
  }
  return <Tabs
          className="big-picture-switch"
          value={mainContentMode}
          indicatorColor="primary"
          textColor="primary"
          style={{marginLeft: 5, fontSize: '9px', textTransform: ''}}
          onChange={(_event, value) => changeMainContentMode(value)}
        >
          <Tab label="Card Mode" style={{textTransform: '', fontSize: '9px'}} component={(props) => <InternalLink to={cardUrl} style= {{...props.style, fontSize: '8px'}} {...props}></InternalLink>} value="card"/>
          <Tab label="Landscape" style={{textTransform: '', fontSize: '9px'}} component={(props) => <InternalLink to={landscapeUrl} {...props}></InternalLink>} value="landscape"/>
          <Tab label="Serverless" style={{textTransform: '', fontSize: 9}} component={(props) => <InternalLink to={serverlessUrl} {...props}></InternalLink>} value="serverless"/>
        </Tabs>
}
export default SwitchButton;
