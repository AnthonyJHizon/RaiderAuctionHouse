const Authorization = require("../models/authorization");

module.exports = async () => {
  try{
    const results = await Authorization.find({})
    return results.length > 0 ? results[0].accessToken : null
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}