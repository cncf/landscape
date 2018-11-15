import _extends from "@babel/runtime/helpers/extends";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
// @inheritedComponent Transition
import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { duration } from '@material-ui/core/styles/transitions';
import withTheme from '@material-ui/core/styles/withTheme';
import { reflow, getTransitionProps } from '@material-ui/core/transitions/utils';
const styles = {
  entering: {
    transform: 'rotateY(0deg) '
  },
  entered: {
    transform: 'rotateY(0deg) '
  }
};
/**
 * The Fade transition is used by the [Modal](/utils/modal/) component.
 * It uses [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */

class HorizontalFlipTransition extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleEnter = node => {
      const {
        theme
      } = this.props;
      reflow(node); // So the animation always start from the start.

      const transitionProps = getTransitionProps(this.props, {
        mode: 'enter'
      });
      node.style.webkitTransition = theme.transitions.create('transform', transitionProps);
      node.style.transition = theme.transitions.create('transform', transitionProps);

      if (this.props.onEnter) {
        this.props.onEnter(node);
      }
    };

    this.handleExit = node => {
      const {
        theme
      } = this.props;
      const transitionProps = getTransitionProps(this.props, {
        mode: 'exit'
      });
      node.style.webkitTransition = theme.transitions.create('transform', transitionProps);
      node.style.transition = theme.transitions.create('transform', transitionProps);

      if (this.props.onExit) {
        this.props.onExit(node);
      }
    };
  }

  render() {
    const _this$props = this.props,
          {
      children,
      style: styleProp
    } = _this$props,
          other = _objectWithoutProperties(_this$props, ["children", "onEnter", "onExit", "style", "theme"]);

    const style = _objectSpread({}, styleProp, React.isValidElement(children) ? children.props.style : {});

    return React.createElement(Transition, _extends({
      appear: true,
      onEnter: this.handleEnter,
      onExit: this.handleExit
    }, other), (state, childProps) => {
      return React.cloneElement(children, _objectSpread({
        style: _objectSpread({
          transform: 'rotateY(180deg)',
          willChange: 'transform'
        }, styles[state], style)
      }, childProps));
    });
  }

}

HorizontalFlipTransition.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * A single child content element.
   */
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  /**
   * If `true`, the component will transition in.
   */
  in: PropTypes.bool,

  /**
   * @ignore
   */
  onEnter: PropTypes.func,

  /**
   * @ignore
   */
  onExit: PropTypes.func,

  /**
   * @ignore
   */
  style: PropTypes.object,

  /**
   * @ignore
   */
  theme: PropTypes.object.isRequired,

  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    enter: PropTypes.number,
    exit: PropTypes.number
  })])
} : {};
HorizontalFlipTransition.defaultProps = {
  timeout: {
    enter: duration.enteringScreen,
    exit: duration.leavingScreen
  }
};
export default withTheme()(HorizontalFlipTransition);
