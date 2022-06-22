const refreshToken = require("../../utils/refreshToken");
const getAccessToken = require("../../utils/getAccessToken");
const connectToDatabase = require("../../utils/dbConnect");

export default async function getRealms(req,res) {
    let realmData = [];
    try{
      await connectToDatabase();
      const response = await fetch(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${await getAccessToken()}`);
      const data = await response.json();
      const realms = data.results;
      realms.forEach(realm => {
        realmData.push({
          id: realm.data.id,
          name: realm.data.realms[0].name.en_US
        })
      });
      realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
    }
    catch (error) {
      try{
        await connectToDatabase();
        const newAccessToken = await refreshToken();
        const response = await fetch(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${newAccessToken}`);
        const data = await response.json();
        const realms = data.results;
        realms && realms.forEach(realm => {
          realmData.push({
            id: realm.data.id,
            name: realm.data.realms[0].name.en_US
          })
        });
        realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
      }
      catch (err) {
        console.log(err)
      }
    }
    res.json(realmData);
};