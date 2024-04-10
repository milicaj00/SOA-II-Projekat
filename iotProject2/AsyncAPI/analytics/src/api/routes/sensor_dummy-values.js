const Router = require('hermesjs/lib/router');
const {validateMessage} = require('../../lib/message-validator');
const router = new Router();
const sensorDummyValuesHandler = require('../handlers/sensor_dummy-values');
module.exports = router;



/**
 * Receive data from dummy
 */
router.use('sensor_dummy/values', async (message, next) => {
  try {
    
    await validateMessage(message.payload,'sensor_dummy/values','','publish');
    await sensorDummyValuesHandler.PublishAsync({message});
    next();
    
  } catch (e) {
    next(e);
  }
});
