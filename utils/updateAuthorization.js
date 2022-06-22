const Authorization = require("../models/authorization");

module.exports = async function updateAuthorization(newAccessToken) {
  try{
    const results = await Authorization.find({}) //find everything
    if(results.length > 0)
    {
      //update
      await Authorization.updateOne(results[0], {
        accessToken: newAccessToken
      })
    }
    else
    {
      await Authorization.create({
        accessToken: newAccessToken
      })
    }      
  }
  catch (error) {
    console.log(error);
  }
}