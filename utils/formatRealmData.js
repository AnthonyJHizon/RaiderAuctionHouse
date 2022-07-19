module.exports = async function formatRealmData(data) {
    let realmData = [];
    const realms = data.results;
    realms.forEach(realm => {
      if(realm.data.population.name.en_US != "Low") {
        realmData.push({
          id: realm.data.id,
          name: realm.data.realms[0].name.en_US,
          timeZone: realm.data.realms[0].timezone,
        })
      }
    });
    realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
    return realmData;
}