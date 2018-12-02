import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash';

// create a "selector creator" that uses lodash.isEqual instead of ===
export default createSelectorCreator(defaultMemoize, isEqual);
