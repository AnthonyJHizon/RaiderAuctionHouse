module.exports = async function AuctionHouse(data) {
  let auctionHouses = [];
  data.auctions.forEach(auctionHouse => {
    auctionHouses.push({
      "id": auctionHouse.id,
      "name": auctionHouse.name.toLowerCase().replace(/\s+/g, '-'),
    })
  })
  return auctionHouses;
}