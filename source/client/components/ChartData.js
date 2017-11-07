import React, {Component} from 'react';
import styled from 'emotion/react';
import {Doughnut} from 'react-chartjs-2';

const Layout = styled.div`
	display: inline-block;
	margin: 20px 0px;
	padding: 0px 2%;
	text-align: center;
	width: 50%;
	max-width: 650px;
`;

class ChartData extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {transactions} = this.props;
		let data = [];
		if (transactions.length) {
			transactions.forEach((item) => {
				let flag = true;
				if (data.length) {
					data.forEach((itemData) => {
						if (item.data === itemData.data) {
							itemData.sum += Number(item.sum);
							flag = false;
						}
					});
				}
				if (flag) {
					data.push({data: item.data, sum: Number(item.sum)});
				}
			});
		}
		return (
			<Layout>
				<Doughnut
					height={200}
					data={{
						datasets: [{
							data: data.map((item) => {
								return item.sum
							}),
							backgroundColor: [
								'Red',
								'Lime',
								'Blue',
								'DeepPink',
								'Yellow',
								'LightSeaGreen',
								'Orange',
								'Green',
								'DarkKhaki',
								'Magenta'
							]
						}],
						labels: data.map((item) => {
							return item.data
						})
					}}
					options={{
						responsive: true,
						legend: {
							labels: {
								fontSize: 18
							},
							position: 'bottom',
						},
						title: {
							display: true,
							text: 'По Данным',
							fontSize: 22
						}
					}} />
			</Layout>
		);
	}
}

export default ChartData;
