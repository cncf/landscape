import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import isMobile from '../../utils/isMobile';


const SwitchButton = function({isBigPicture, enableBigPicture, disableBigPicture}) {
  if (isMobile) {
    return null;
  }
  return <div>
    {isBigPicture && <IconButton className="bigPicture" disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>disableBigPicture()} aria-label="Back To Normal View">
      <Icon style={{ fontSize:'1.2em'}}></Icon> Back To Normal View
    </IconButton>
    }
    {!isBigPicture && <IconButton className="bigPicture" disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>enableBigPicture()} aria-label="View Big Picture">
      <Icon style={{ fontSize:'1.2em'}}></Icon> View Big Picture
    </IconButton>
    }
  </div>
}
export default SwitchButton;
