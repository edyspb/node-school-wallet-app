import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import moment from 'moment';
import {Bar} from 'react-chartjs-2';

const Layout = styled.div`
	display: inline-block;
	margin: 20px;
	padding: 0px 50px;
	font-size: 18px;
	text-align: center;
	width: 900px;
	height: 300px;
`;

class ChartDate extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {transactions} = this.props;
		let data = [];
		if (transactions.length) {
			transactions.forEach((item) => {
				const ItemDate = moment(item.time, moment.ISO_8601).format('LL');
				let flag = true;
				if (data.length) {
					data.forEach((itemData) => {
						const itemDate = moment(itemData.time, moment.ISO_8601).format('LL');
						if (ItemDate === itemDate) {
							itemData.sum += Number(item.sum);
							flag = false;
						}
					});
				}
				if (flag) {
					data.push({time: ItemDate, sum: Number(item.sum)});
				}
			});
		}
		return (
			<Layout>
				По дате
				<Bar
					data={{
						datasets: [{
							data: data.map((item) => {
								return item.sum
							}),
							backgroundColor: 'Red'
						}],
						labels: data.map((item) => {
							return item.time
						})
					}}
					options={{
						legend: {
							display: false
						}
					}} />
			</Layout>
		);
	}
}

export default ChartDate;
