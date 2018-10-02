import React from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import classNames from 'classnames'
import Filters from './Filters';
import Grouping from './Grouping';
import Sorting from './Sorting';
import Presets from './Presets';
import Ad from './Ad';
import AutoSizer from './CustomAutoSizer';
import {
  MainContentContainer2,
  ServerlessContentContainer,
  SwitchButtonContainer,
  ZoomButtonsContainer
} from './BigPicture';
import MainContentContainer from './MainContentContainer';
import HomePageUrlContainer from './HomePageUrlContainer';
import HomePageScrollerContainer from './HomePageScrollerContainer';
import ResetFiltersContainer from './ResetFiltersContainer';
import ItemDialogContainer from './ItemDialogContainer';
import ItemDialogButtonsContainer from './ItemDialogButtonsContainer';
import HeaderContainer from './HeaderContainer';
import SummaryContainer from './SummaryContainer';
import ExportCsvContainer from './ExportCsvContainer';
import Footer from './Footer';
import EmbeddedFooter from './EmbeddedFooter';

import isIphone from '../utils/isIphone';
import isMobile from '../utils/isMobile';
import bus from '../reducers/bus';

const state = {
  lastScrollPosition: 0
};

bus.on('scrollToTop', function() {
  document.scrollingElement.scrollTop = 0;
});

const isGoogle = true; // detect google somehow;

const HomePage = ({isEmbed, mainContentMode, ready, hasSelectedItem, filtersVisible, hideFilters, showFilters, onClose}) => {
  const isBigPicture = mainContentMode !== 'card';
  if (!ready) {
    return (
      <div>
        <HomePageUrlContainer />
      </div>
    )
  }
  if (isGoogle && !isMobile) {
    return <ItemDialogContainer />;
  }

  if (isBigPicture) {
    document.querySelector('html').classList.add('big-picture');
  } else {
    document.querySelector('html').classList.remove('big-picture');
  }

  if (isIphone) {
    if (hasSelectedItem) {
      if (!document.querySelector('.iphone-scroller')) {
        state.lastScrollPosition = document.scrollingElement.scrollTop;
      }
      document.querySelector('html').classList.add('has-selected-item');
      document.scrollingElement.scrollTop = 0;
    } else {
      document.querySelector('html').classList.remove('has-selected-item');
      if (document.querySelector('.iphone-scroller')) {
        document.scrollingElement.scrollTop = state.lastScrollPosition;
      }
    }
    //try to get a current scroll if we are in a normal mode
  }

  if (isEmbed) {
    if (window.parentIFrame) {
      if (hasSelectedItem) {
        window.parentIFrame.sendMessage({type: 'showModal'})
      } else {
        window.parentIFrame.sendMessage({type: 'hideModal'})
      }
      if (hasSelectedItem) {
        window.parentIFrame.getPageInfo(function(info) {
          var offset = info.scrollTop - info.offsetTop;
          var height = info.iframeHeight - info.clientHeight;
          var maxHeight = info.clientHeight * 0.9;
          if (maxHeight > 480) {
            maxHeight = 480;
          }
          var t = function(x1, y1, x2, y2, x3) {
            if (x3 < x1 - 50) {
              x3 = x1 - 50;
            }
            if (x3 > x2 + 50) {
              x3 = x2 + 50;
            }
            return y1 + (x3 - x1) / (x2 - x1) * (y2 - y1);
          }
          var top = t(0, -height, height, height, offset);
          if (top < 0 && info.iframeHeight <= 600) {
            top = 10;
          }
          setTimeout(function() {
            const modal = document.querySelector('.modal-body');
            if (modal) {
              modal.style.top = top + 'px';
              modal.style.maxHeight = maxHeight + 'px';
            }
          }, 10);
        });
      }
    }
    document.querySelector('body').classList.add('embed');
  }

  function handleShadowClick(e) {
    if (!(isIphone && hasSelectedItem)) {
      return;
    }
    if (window.matchMedia("(orientation: portrait)").matches) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const marginX = 0.125;
      const marginY = 0.06;
      if ( x > marginX && x < 1 - marginX && y > marginY && y < 1 - marginY ) {
        console.info('a click inside the mask, ignoring');
      } else {
        onClose();
      }
    }
    if (window.matchMedia("(orientation: landscape)").matches) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const marginX = 0.07;
      const marginY = 0.1;
      if ( x > marginX && x < 1 - marginX && y > marginY) {
        console.info('a click inside the mask, ignoring');
      } else {
        onClose();
      }
    }
  }

  const hideTopPart = isEmbed || (isMobile && isBigPicture);

  return (
    <div onClick={handleShadowClick} >
    <HomePageScrollerContainer/>
    <ItemDialogContainer/>
    { isIphone && <ItemDialogButtonsContainer/> }
    <div className={classNames('app',{'filters-opened' : filtersVisible, 'background': isIphone && hasSelectedItem})}>
      <div className={classNames({"shadow": isIphone && hasSelectedItem})} />
      <div style={{marginTop: (isIphone && hasSelectedItem) ? -state.lastScrollPosition : 0}} className={classNames({"iphone-scroller": isIphone && hasSelectedItem}, 'main-parent')} >
        { !isEmbed && <HeaderContainer/> }
        { !isEmbed && <IconButton className="sidebar-show" onClick={showFilters}><Icon>menu</Icon></IconButton> }
        { !isEmbed && <div className="sidebar">
          <div className="sidebar-scroll">
            <IconButton className="sidebar-collapse" onClick={hideFilters}><Icon>close</Icon></IconButton>
            <ResetFiltersContainer />
            <Grouping/>
            <Sorting/>
            <Filters />
            <Presets />
            <ExportCsvContainer />
            <Ad />
          </div>
        </div>
        }

        <div className="app-overlay" onClick={hideFilters}></div>

        <HomePageUrlContainer />

        <div className={classNames('main', {'embed': isEmbed})}>
          { isMobile && <SwitchButtonContainer /> }
          { !hideTopPart && <div className="disclaimer">
            <h1>CNCF Cloud Native Interactive Landscape</h1>
            CNCF&apos;s Cloud Native Trail Map (<a target="_blank" href="https://raw.githubusercontent.com/cncf/landscape/master/trail_map/CNCF_TrailMap_latest.png">png</a>, <a target="_blank" href="https://raw.githubusercontent.com/cncf/landscape/master/trail_map/CNCF_TrailMap_latest.pdf">pdf</a>) provides a good introduction. The cloud native landscape (<a target="_blank" href="/images/landscape.png">png</a>, <a target="_blank" href="/images/landscape.pdf">pdf</a>) and serverless landscape (<a target="_blank" href="/images/serverless.png">png</a>, <a target="_blank" href="/images/serverless.pdf">pdf</a>) are dynamically generated { isMobile ? 'when viewed from a larger device' : 'below' }.
            Please <a target="_blank" href="https://github.com/cncf/landscape">open</a> a pull request to
            correct any issues. Greyed logos are not open source. Last Updated: {window.lastUpdated}
          </div>
          }
          { !hideTopPart && <SummaryContainer /> }
          { !isMobile && <SwitchButtonContainer /> }
          { isBigPicture &&
              <AutoSizer>
                {({ height, width }) => (
                  <div style={{width:width, height: height, position: 'relative', background: 'rgb(134,175,188)'}}>
                    <ZoomButtonsContainer />
                    <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'scroll', padding: 10}}>
                      { mainContentMode === 'landscape' && <MainContentContainer2/> }
                      { mainContentMode === 'serverless' && <ServerlessContentContainer/> }
                    </div>
                  </div>
                )}
              </AutoSizer>

          }
          { !isBigPicture && <MainContentContainer/> }
          { !isEmbed && !isBigPicture && <Footer/> }
          { isEmbed && <EmbeddedFooter/> }
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
