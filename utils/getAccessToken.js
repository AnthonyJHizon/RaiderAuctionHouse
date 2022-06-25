const Authorization = require("../models/authorization");
const connectToDatabase = require("./dbConnect");

module.exports = async () => {
  try{
    await connectToDatabase();
    const results = await Authorization.find({})
    return results.length > 0 ? results[0].accessToken : null
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}