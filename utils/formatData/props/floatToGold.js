module.exports = function floatToGold(float) {
	const valueArr = float.toString().split('.');

	const gold = valueArr[0];
	let silver = '0';
	let copper = '0';

	if (valueArr[1]) {
		silver =
			valueArr[1].substr(0, 2) > '09'
				? valueArr[1].substr(0, 2)
				: valueArr[1].substr(1, 1);
		copper =
			valueArr[1].substr(2) > '09'
				? valueArr[1].substr(2)
				: valueArr[1].substr(3);
	}

	return (
		(gold > '0' ? gold + 'g ' : '') +
		(silver > '0' ? silver + 's ' : '') +
		(copper > '0' ? copper + 'c ' : '')
	).slice(0, -1);
};
