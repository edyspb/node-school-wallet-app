import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Button, ChartType, ChartData, ChartDate} from './';
import axios from 'axios';

const DivButton = styled.div`
	width: 200px;
	height: 50px;
`;

const BackButton = styled(Button)`
	width: 200px;
	height: 50px;
	font-size: 26px;
`;

const Handle = styled.div`
	display: inline-block;
	font-size: 31px;
	width: 100%;
	max-width: 1300px;
	text-align: center;
`;

class Charts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardId: 0,
			transactions: ''
		};
	}


	onReport(cardId) {
		axios
			.get(`/api/v1/report/${cardId}/screen`)
			.then((res) => {
				this.setState({cardId: cardId, transactions: res.data});
			})
			.catch((err) => {
				if (err) console.log('err', err);
			});
	}


	render() {
		const {transactions, cardId} = this.state;
		const id = this.props.cardId;
		if (id !== cardId) {
			this.onReport(id);
		}
		return (
			<div>
				<DivButton onClick={() => this.props.onCloseCharts()}>
					<BackButton bgColor='#d3292a' textColor='#fff'>Вернуться</BackButton>
				</DivButton>
				<Handle>Отчет по карте:</Handle>
				<ChartType
					transactions={transactions}
				/>
				<ChartData
					transactions={transactions}
				/>
				<ChartDate
					transactions={transactions}
				/>
			</div>
		);
	}
}

Charts.propTypes = {
	cardId: PropTypes.number.isRequired,
	onCloseCharts: PropTypes.func.isRequired
};

export default Charts;
