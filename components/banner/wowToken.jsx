// https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-classic-us&locale=en_US&access_token={
// "_links": {
//     "self": {
//       "href": "https://us.api.blizzard.com/data/wow/token/?namespace=dynamic-classic-us"
//     }
//   },
//   "last_updated_timestamp": 1703100353000,
//   "price": 104450000
// }

import { useEffect } from 'react';

import { getWowToken } from '../../actions/getWowToken';

export default function WowToken() {
	// const wowToken = getWowToken();
	// console.log(wowToken);
	return <></>;
}
