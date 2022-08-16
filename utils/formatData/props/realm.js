module.exports = async function Realm(data, self) {
  let realmData = {};
  Object.keys(data).forEach(realm => {
    if(!realm != self) realmData[realm] = data[realm].name;
  });
  return realmData;
}