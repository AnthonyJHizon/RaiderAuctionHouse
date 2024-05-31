import floatToGold from '../utils/formatData/props/floatToGold';

test('convert float value to gold/silver/copper representation', () => {
	expect(floatToGold(999.9999)).toBe('999g 99s 99c');
	expect(floatToGold(99.9909)).toBe('99g 99s 09c');
	expect(floatToGold(9.0909)).toBe('9g 09s 09c');
	expect(floatToGold(0.0909)).toBe('9s 09c');
	expect(floatToGold(0.0009)).toBe('9c');
	expect(floatToGold(99.09)).toBe('99g 9s 00c');
	expect(floatToGold(99.0009)).toBe('99g 00s 09c');
	expect(floatToGold(99)).toBe('99g 00s 00c');
});
