import _ from 'lodash';
export default function effectiveTwitter(node, crunchbaseEntry) {
      if (_.isUndefined(node.twitter)) {
        return (crunchbaseEntry || {}).twitter;
      }
      return node.twitter;
}
