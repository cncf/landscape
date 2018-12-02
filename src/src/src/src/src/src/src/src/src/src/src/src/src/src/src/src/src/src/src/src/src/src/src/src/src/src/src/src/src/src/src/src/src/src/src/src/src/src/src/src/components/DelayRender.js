import { Component } from 'react';

export default class DelayRender extends Component {
  constructor() {
    super();
    this.state = { ready: true };
  }

  componentWillMount() {
    const delay = this.props.delay || 1000;
    const d = parseInt(delay, 10);
    if (d && d > 0) {
      this.setState({ ready: false });
      this.timeout = setTimeout(() => {
        this.setState({ ready: true });
      }, delay);
    } else {
      this.setState({ ready: true });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    if (this.state.ready) {
      const content = this.props.content();
      return content;
    }
    return null;
  }
}
