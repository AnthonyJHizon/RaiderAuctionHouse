module.exports = async function Realm(data) {
  let realmData = {};
  realmData["realm"] = data.realms[0].name;
  realmData["timeZone"] = data.realms[0].timezone;
  return realmData;
}