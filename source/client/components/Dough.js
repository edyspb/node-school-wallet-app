import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Doughnut} from 'react-chartjs-2';

class Dough extends Component {
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
			<Doughnut
				width={300}
				height={300}
				data={{
					datasets: [{
						data: data.map((item) => {return item.sum}),
						backgroundColor: [
							'Red',
							'Yellow',
							'Blue',
							'Green'
						]
					}],
					labels: data.map((item) => {return item.type})
				}} />
		);
	}
}

export default Dough;
