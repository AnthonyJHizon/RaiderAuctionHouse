const updateAuthorization = require("./updateAuthorization");
const connectToDatabase = require("./dbConnect");

module.exports = async () => {
  const url = "https://us.battle.net/oauth/token";
  let newToken = null;
  try{
    await connectToDatabase();
    const response = await fetch(url, {
      method: 'POST',
      body: "grant_type=client_credentials",
      headers: {
        'Authorization': "Basic "+ Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const result = await response.json();
    newToken = result.access_token;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
  updateAuthorization(newToken);
  return newToken;
}