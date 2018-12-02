import Promise from 'bluebird';
const maxAttempts = 5;
const retry  = async function (fn, attempts = maxAttempts, delay = 50000) {
  try {
    const result = await fn();
    return result;
  } catch (ex) {
    console.info('Attempt #', attempts);
    if (attempts <= 0 ) {
      throw ex;
    }
    await Promise.delay(delay);
    return await retry(fn, attempts - 1);
  }
}
export default retry;
