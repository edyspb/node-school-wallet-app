import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Pie} from 'react-chartjs-2';

const Layout = styled.div`
	display: inline-block;
	margin: 20px;
	padding: 0px 70px;
	font-size: 18px;
	text-align: center;
	width: 500px;
	height: 450px;
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
				По типу операций
				<Pie
					height={400}
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
						})
					}} />
			</Layout>
		);
	}
}

export default ChartType;
