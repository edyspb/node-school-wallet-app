import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Doughnut} from 'react-chartjs-2';

const Layout = styled.div`
	display: inline-block;
	margin: 20px;
	padding: 0px 70px;
	font-size: 18px;
	text-align: center;
	width: 500px;
	height: 450px;
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
				По данным
				<Doughnut
					height={400}
					data={{
						datasets: [{
							data: data.map((item) => {
								return item.sum
							}),
							backgroundColor: [
								'Red',
								'Lime',
								'DeepPink',
								'Yellow',
								'LightSeaGreen',
								'Orange',
								'Blue',
								'Green',
								'DarkKhaki',
								'Magenta'
							]
						}],
						labels: data.map((item) => {
							return item.data
						})
					}} />
			</Layout>
		);
	}
}

export default ChartData;
