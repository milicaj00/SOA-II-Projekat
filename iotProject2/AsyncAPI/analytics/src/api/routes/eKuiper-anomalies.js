const Router = require('hermesjs/lib/router');
const {validateMessage} = require('../../lib/message-validator');
const router = new Router();
const eKuiperAnomaliesHandler = require('../handlers/eKuiper-anomalies');
module.exports = router;



/**
 * Recv data from ekuiper
 */
router.use('eKuiper/anomalies', async (message, next) => {
  try {
    
    await validateMessage(message.payload,'eKuiper/anomalies','','publish');
    await eKuiperAnomaliesHandler.WriteToDatabase({message});
    next();
    
  } catch (e) {
    next(e);
  }
});
