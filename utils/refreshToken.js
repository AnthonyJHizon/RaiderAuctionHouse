const updateAuthorization = require("./updateAuthorization");

module.exports = async () => {
  const url = "https://us.battle.net/oauth/token";
  const params = new URLSearchParams ({
    grant_type: "client_credentials"
  }).toString();
  const authOptions = {
    headers: {
      'Authorization': "Basic "+ Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  let result = null;
  try{
    const response = await axios.post(url,params,authOptions);
    result = response.data;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
  updateAuthorization(result.access_token);
  return result.acess_token;
}