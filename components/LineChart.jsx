'use client';

import moment from 'moment';
import { graphic } from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default function LineChart({
	data,
	title,
	yAxisName,
	xAxisName,
	days,
	setDays,
	loading,
}) {
	const option = {
		title: [
			{
				left: 'center',
				text: title,
				top: '3%',
				textStyle: {
					color: 'white',
				},
			},
		],
		grid: {
			containLabel: true,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			formatter: function (params) {
				return `
				<div style="font-size: 16px;color:black;font-weight:600;line-height:1;text-decoration: underline;">${moment(
					params[0].value[0]
				)
					.local()
					.format('MMM Do, h:mm a')}</div>
				<div style="text-shadow: 0px 0px 1px white;">
				<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#04729e;"></span>
				<span style="float:right;margin-left:5px;font-size:14px;color:black;font-weight:400">
				Price: ${params[0].value[1]} Gold</span>
				</div>
			    `;
			},
		},
		xAxis: {
			scale: true,
			type: 'time',
			name: xAxisName,
			nameLocation: 'middle',
			nameTextStyle: {
				align: 'center',
				padding: [35, 35, 35, 35],
				fontSize: 16,
				fontWeight: 'bold',
				fontStyle: 'normal',
				color: 'rgba(255, 255, 255)',
			},
			axisLabel: {
				hideOverlap: true,
				fontSize: 16,
				formatter: function (value) {
					return (
						moment(value).local().format('MMM Do') +
						'\n' +
						moment(value).local().format('h:mm a')
					);
				},
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(255, 255, 255)',
					width: 2,
					cap: 'square',
				},
			},
			axisTick: {
				alignWithLabel: true,
			},
		},
		yAxis: {
			type: 'value',
			name: yAxisName,
			nameLocation: 'middle',
			nameTextStyle: {
				padding: [50, 50, 50, 50],
				fontSize: 16,
				fontWeight: 'bold',
				fontStyle: 'normal',
				color: 'rgba(255, 255, 255)',
			},
			axisLabel: {
				hideOverlap: true,
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(255, 255, 255)',
					width: 2,
					cap: 'square',
				},
			},
			splitLine: {
				lineStyle: {
					type: 'solid',
					color: 'rgba(255, 255, 255, .6)',
				},
			},
			axisLabel: {
				hideOverlap: true,
				fontSize: 16,
			},
			axisTick: {
				alignWithLabel: true,
			},
			scale: true,
		},
		series: [
			{
				type: 'line',
				data: data,
				symbolSize: 20,
				showSymbol: false,
				itemStyle: {
					emphasis: {
						color: 'white',
						borderWidth: 0,
					},
				},
				lineStyle: {
					width: 3,
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 1,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: '#04729e',
							},
							{
								offset: 0.5,
								color: '#058fc5',
							},
							{
								offset: 1,
								color: '#24a2d4',
							},
						],
					},
				},
				areaStyle: {
					color: new graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'rgb(77, 119, 255)',
						},
						{
							offset: 1,
							color: 'rgb(0, 221, 255)',
						},
					]),
				},
			},
		],
		dataZoom: [
			{
				type: 'inside',
				filterMode: 'none',
			},
		],
		animationThreshold: 10000,
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center pt-5 pb-5">
			{loading ? (
				<>
					<p className="absolute z-40 animate-pulse text-header-1">Loading</p>
					<ReactEcharts
						option={{ ...option, animation: false }}
						style={{ height: '100%', width: '100%' }}
					/>
				</>
			) : (
				<ReactEcharts
					option={option}
					style={{ height: '100%', width: '100%' }}
				/>
			)}
			<Options days={days} setDays={setDays} />
		</div>
	);
}

function Options({ days, setDays }) {
	const optionArr = ['1D', '7D', '1M', '6M'];
	return (
		<div className="hidden md:flex flex-row gap-x-6 items-center justify-center">
			{optionArr.map((option) => {
				if (option !== days)
					return <OptionButton option={option} setDays={setDays} />;
				else return <SelectedButton option={option} />;
			})}
		</div>
	);
}

function OptionButton({ option, setDays }) {
	return (
		<button
			className="bg-left-bottom bg-gradient-to-r from-primary to-secondary bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] hover:text-secondary transition-all duration-500 ease-out"
			onClick={() => setDays(option)}
		>
			{option}
		</button>
	);
}

function SelectedButton({ option }) {
	return (
		<button className="text-secondary bg-left-bottom bg-gradient-to-r from-primary to-secondary bg-no-repeat bg-[length:100%_2px]">
			{option}
		</button>
	);
}
