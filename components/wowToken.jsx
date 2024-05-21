'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('./LineChart'), {
	loading: () => <p className="animate-pulse text-header-1">Loading</p>,
	ssr: false,
});

export default function WowToken() {
	const [currentToken, setCurrentToken] = useState({});
	const [days, setDays] = useState('1D');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getInitialData = async () => {
			const currentTokenRes = await fetch('/api/wowToken/latest');
			const currentTokenData = await currentTokenRes.json();

			const dayParams = new URLSearchParams({
				days,
			}).toString();
			const gteRes = await fetch(`/api/wowToken/gte?${dayParams}`);
			const gteData = await gteRes.json();

			setCurrentToken(currentTokenData);
			setData(gteData);
		};
		getInitialData();
	}, []);

	useEffect(() => {
		let running = true;
		const getInitialData = async () => {
			setLoading(true);
			const dayParams = new URLSearchParams({
				days,
			}).toString();
			const rangeRes = await fetch(`/api/wowToken/gte?${dayParams}`);
			const rangeData = await rangeRes.json();

			if (running) {
				setData(rangeData);
				setLoading(false);
			}
		};
		getInitialData();

		return () => ((running = false), setLoading(false));
	}, [days]);

	const currentTokenPrice = currentToken.price;
	const chartData = data.map((d) => [d.date, d.price]);

	return (
		<div className="relative flex min-h-[350px] h-3/5 w-full items-center justify-center z-10 bg-gradient-to-r from-[#431407] via-[#171717] to-black text-white text-normal-1">
			<img
				src="/wowToken/wow-token-cata.webp"
				alt=""
				className="absolute z-[-10] h-full w-full object-cover mix-blend-overlay"
				draggable={false}
			/>
			<LineChart
				data={chartData}
				title={`1 Wow Token = ${currentTokenPrice ?? '???'} Gold`}
				yAxisName="Price (Gold)"
				xAxisName="Date"
				days={days}
				setDays={setDays}
				loading={loading}
			/>
		</div>
	);
}
