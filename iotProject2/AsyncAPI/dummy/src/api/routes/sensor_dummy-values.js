const Router = require('hermesjs/lib/router');
const {validateMessage} = require('../../lib/message-validator');
const router = new Router();
const sensorDummyValuesHandler = require('../handlers/sensor_dummy-values');
module.exports = router;



/**
 * Publish data read from the csv file
 */
router.useOutbound('sensor_dummy/values', async (message, next) => {
  try {
    
    await validateMessage(message.payload,'sensor_dummy/values','','subscribe');
    await sensorDummyValuesHandler.sendRow({message});
    next();
    
  } catch (e) {
    next(e);
  }
});
