import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Button, Dough} from './';
import axios from 'axios';


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
				<Button bgColor='#d3292a' textColor='#fff'>Вернуться</Button>
				<Dough
					width={300}
					height={300}
					transactions={transactions}
				/>
			</div>
		);
	}
}

Charts.propTypes = {
	cardId: PropTypes.number.isRequired
};

export default Charts;
