import Promise from 'bluebird';
const maxAttempts = 3;
const delay = 500;
const retry  = async function (fn, attempts = maxAttempts) {
  try {
    const result = await fn();
    return result;
  } catch (ex) {
    if (attempts <= 0 ) {
      throw ex;
    }
    await Promise.delay(delay);
    return await retry(fn, attempts - 1);
  }
}
export default retry;
