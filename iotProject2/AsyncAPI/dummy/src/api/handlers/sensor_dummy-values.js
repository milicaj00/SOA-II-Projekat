
const handler = module.exports = {};

/**
 * Publish data read from the csv file
 * @param {object} options
 * @param {object} options.message
 * @param {string} options.message.payload.created_at
 * @param {string} options.message.payload.entry_id
 * @param {string} options.message.payload.TEMPERATURE
 * @param {string} options.message.payload.TURBIDITY
 * @param {string} options.message.payload.DISOLVED OXYGEN
 * @param {string} options.message.payload.pH
 * @param {string} options.message.payload.AMMONIA
 * @param {string} options.message.payload.NITRATE
 * @param {string} options.message.payload.Population
 * @param {string} options.message.payload.Length
 * @param {string} options.message.payload.Weight
 */
handler.sendRow = async ({message}) => {
  // Implement your business logic here...
};
