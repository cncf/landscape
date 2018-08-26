import React from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import isMobile from '../../utils/isMobile';


const SwitchButton = function({mainContentMode, changeMainContentMode}) {
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
          <Tab label="Card Mode" value="card" />
          <Tab label="Landscape" value="landscape" />
          <Tab label="Serverless" value="serverless" />
        </Tabs>
}
export default SwitchButton;
