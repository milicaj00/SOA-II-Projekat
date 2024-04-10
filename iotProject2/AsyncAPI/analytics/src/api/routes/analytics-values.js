const Router = require('hermesjs/lib/router');
const {validateMessage} = require('../../lib/message-validator');
const router = new Router();
const analyticsValuesHandler = require('../handlers/analytics-values');
module.exports = router;



/**
 * Publish data to check for anomalies
 */
router.useOutbound('analytics/values', async (message, next) => {
  try {
    
    await validateMessage(message.payload,'analytics/values','','subscribe');
    await analyticsValuesHandler.ApplicationMessageReceivedAsync({message});
    next();
    
  } catch (e) {
    next(e);
  }
});
