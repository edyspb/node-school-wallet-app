import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import axios from 'axios';


import {Title, Button, Input} from './';

const NewCardLayout = styled.div`
	position: relative;
	width: 260px;
	height: 164px;
	margin-bottom: ${({isSingle}) => (isSingle ? 0 : '15px')};
	padding: 25px 20px 20px 25px;
	border-radius: 4px;
	
	background-color: transparent;
	background-image: url('/assets/cards-add.svg');
	background-repeat: no-repeat;
	background-position: center;
	box-sizing: border-box;
	border: 2px dashed rgba(255, 255, 255, 0.2);
`;

const CreateCardLayout = styled.div`
	position: relative;
	width: 260px;
	height: 164px;
	margin-bottom: ${({isSingle}) => (isSingle ? 0 : '15px')};
	padding: 10px 10px;
	border-radius: 4px;
	background-color: transparent;
	box-sizing: border-box;
	border: 2px dashed rgba(255, 255, 255, 0.2);
`;


const CreateCardTitle = styled(Title)`
	font-size: 20px;
	margin-bottom: 5px;
	color: #fff;
`;


const InputField = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 5px;
	position: relative;
	padding-left: 55px;
`;

const Label = styled.div`
	font-size: 15px;
	color: #fff;
	position: absolute;
	left: 0;
`;


const Currency = styled.span`
	font-size: 13px;
	color: #fff;
	margin-left: 12px;
`;

const CreateButton = styled(Button)`
	height: 30px;
	width: 235;
	font-size: 18px;
	float: left;
`;

const InputCardNumber = styled(Input)`
	width: 185px;
	font-size: 18px;
`;

const InputSum = styled(Input)`
	width: 160px;
	font-size: 18px;
`;

class CardCreate extends Component {


	constructor(props) {
		super(props);
		this.state = {
			error: false,
			cardNumber: '',
			balance: '',
			isView: false
		};
	}

	onClick() {
		this.setState({isView: true});
	}

	onSubmitForm(event) {
		if (event) {
			event.preventDefault();
		}

		const {cardNumber,  balance} = this.state;

		const preValid = !isNaN(parseFloat(cardNumber)) && isFinite(cardNumber) &&
			!isNaN(parseFloat(balance)) && isFinite(balance);

		if(!preValid) {
			this.setState({error: true});
			return;
		}

		axios
			.post('/api/v1/cards/', {cardNumber, balance})
			.then((response) => {
				const newCard = response.data;
				newCard.cardNumber = Number(newCard.cardNumber);
				newCard.balance = Number(newCard.balance);
				this.props.onCreated(newCard);
				this.setState({isView: false, error: false});
			})
			.catch((error) => {if(error) this.setState({error: true});});
	}

	onChangeInputValue(event) {
		if (!event) {
			return;
		}

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	render() {
		const {isView, error} = this.state;
		if (!isView) {
			return (
				<NewCardLayout onClick={() => this.onClick()}/>
			);
		}
		return (
			<CreateCardLayout>
				<form onSubmit={(event) => this.onSubmitForm(event)}>
					<CreateCardTitle>{error ? 'Данные не верны' : 'Введите данные карты'}</CreateCardTitle>
					<InputField>
						<Label>Номер</Label>
						<InputCardNumber
							name='cardNumber'
							value={this.state.cardNumber}
							onChange={(event) => this.onChangeInputValue(event)} />
					</InputField>
					<InputField>
						<Label>Баланс</Label>
						<InputSum
							name='balance'
							value={this.state.balance}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<CreateButton bgColor='#018ca5' textColor='#fff'>{error ? 'Повторить' : 'Создать'}</CreateButton>
				</form>
			</CreateCardLayout>
		);
	}
}

CardCreate.propTypes = {
	onCreated: PropTypes.func.isRequired,
};

export default CardCreate;
