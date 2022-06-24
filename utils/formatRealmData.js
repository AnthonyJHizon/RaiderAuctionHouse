module.exports = async function formatRealmData(data) {
    let realmData = [];
    const realms = data.results;
    realms.forEach(realm => {
        realmData.push({
        id: realm.data.id,
        name: realm.data.realms[0].name.en_US
      })
    });
    realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
    return realmData;
}