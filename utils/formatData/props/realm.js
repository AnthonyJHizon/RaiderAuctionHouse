module.exports = async function Realm(data) {
  let realmData = {};
  Object.keys(data).forEach(realm => {
    realmData[realm] = data[realm].name;
  });
  return realmData;
}