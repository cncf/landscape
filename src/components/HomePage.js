import React from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import classNames from 'classnames'
import Filters from './Filters';
import Grouping from './Grouping';
import Sorting from './Sorting';
import Presets from './Presets';
import Ad from './Ad';
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
import bus from '../reducers/bus';

const state = {
  lastScrollPosition: 0
};

bus.on('scrollToTop', function() {
  document.scrollingElement.scrollTop = 0;
});


const HomePage = ({isEmbed, ready, hasSelectedItem, filtersVisible, hideFilters, showFilters, onClose}) => {
  if (!ready) {
    return (
      <div>
        <HomePageUrlContainer />
      </div>
    )
  }

  if (isIphone) {
    if (hasSelectedItem) {
      if (!document.querySelector('.iphone-scroller')) {
        state.lastScrollPosition = document.scrollingElement.scrollTop;
      }
      document.scrollingElement.scrollTop = 0;
      document.querySelector('html').classList.add('has-selected-item');
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
          if (maxHeight > 640) {
            maxHeight = 640;
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

  return (
    <div onClick={handleShadowClick} >
    <HomePageScrollerContainer/>
    <ItemDialogContainer/>
    { isIphone && <ItemDialogButtonsContainer/> }
    <div className={classNames('app',{'filters-opened' : filtersVisible, 'background': isIphone && hasSelectedItem})}>
      <div className={classNames({"shadow": isIphone && hasSelectedItem})} />
      <div style={{marginTop: (isIphone && hasSelectedItem) ? -state.lastScrollPosition : 0}} className={classNames({"iphone-scroller": isIphone && hasSelectedItem})} >
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
          { !isEmbed && <div className="disclaimer">
            <h1>CNCF Cloud Native Interactive Landscape</h1>
            You can also view CNCF&apos;s static <a target="_blank" href="https://github.com/cncf/landscape#current-version">landscape</a> and <a target="_blank" href="https://github.com/cncf/landscape#serverless">serverless</a> landscapes. Please <a target="_blank" href="https://github.com/cncf/landscape">open</a> a pull request to correct any issues. Greyed logos are not open source. Last Updated: {window.lastUpdated}
          </div>
          }
          { !isEmbed && <SummaryContainer /> }
          { <MainContentContainer/> }
          { !isEmbed && <Footer/> }
          { isEmbed && <EmbeddedFooter/> }
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
