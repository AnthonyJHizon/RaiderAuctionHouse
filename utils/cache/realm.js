import cache from "memory-cache"
import getAccessToken from '../../utils/db/getAccessToken'
import pathsFormatRealmData from '../../utils/formatData/paths/realm'

module.exports = async function Realm() {
  console.log("fetching");
  const accessToken = await getAccessToken();
  const realmRes = await fetch(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let realmData = await realmRes.json();
  realmData = await pathsFormatRealmData(realmData);
  cache.put("realms", realmData);
  return realmData;
}