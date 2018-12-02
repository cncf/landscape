import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InternalLink from '../InternalLink';
import isEmbed from '../../utils/isEmbed';


const SwitchButton = function({mainContentMode, changeMainContentMode, cardUrl, landscapeUrl, serverlessUrl}) {
  if (isEmbed) {
    return null;
  }
  return <Tabs
          className="big-picture-switch"
          value={mainContentMode}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_event, value) => changeMainContentMode(value)}
        >
          <Tab label="Card Mode" component={(props) => <InternalLink to={cardUrl} {...props}></InternalLink>} value="card"/>
          <Tab label="Landscape" component={(props) => <InternalLink to={landscapeUrl} {...props}></InternalLink>} value="landscape"/>
          <Tab label="Serverless" component={(props) => <InternalLink to={serverlessUrl} {...props}></InternalLink>} value="serverless"/>
        </Tabs>
}
export default SwitchButton;
