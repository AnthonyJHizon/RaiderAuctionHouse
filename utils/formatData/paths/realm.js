module.exports = async function Realm(data) {
  let realmData = [];
  const realms = data.results;
  realms.forEach(realm => {
    realmData.push(realm.data.id.toString())
  });
  return realmData;
}