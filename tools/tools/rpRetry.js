import retry from './retry';
import rp from 'request-promise';

const rpWithRetry = async function(args) {
  return await retry(() => rp(args), 5, 30000);
}
export default rpWithRetry;
