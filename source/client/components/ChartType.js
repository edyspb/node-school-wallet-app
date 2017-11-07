import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Pie} from 'react-chartjs-2';

const Layout = styled.div`
	display: inline-block;
	margin: 20px 0px;
	padding: 0px 2%;
	text-align: center;
	width: 50%;
	max-width: 650px;
`;

class ChartType extends Component {
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
						if (item.type === itemData.type) {
							itemData.sum += Number(item.sum);
							flag = false;
						}
					});
				}
				if (flag) {
					data.push({type: item.type, sum: Number(item.sum)});
				}
			});
		}
		return (
			<Layout>
				<Pie
					height={200}
					data={{
						datasets: [{
							data: data.map((item) => {
								return item.sum
							}),
							backgroundColor: [
								'Red',
								'Yellow',
								'Blue',
								'Green'
							]
						}],
						labels: data.map((item) => {
							return item.type
						}),
					}}
					options={{
						responsive: true,
						legend: {
							labels: {
								fontSize: 18
							},
							position: 'bottom'
						},
						title: {
							display: true,
							text: 'По типу операций',
							fontSize: 22
						}
					}} />
			</Layout>
		);
	}
}

export default ChartType;
