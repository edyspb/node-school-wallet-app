import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import {Island, Title, Button, Input} from './';

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
`;

const InputSum = styled(Input)`
	width: 160px;
`;

class CardCreate extends Component {


	constructor(props) {
		super(props);
		this.state = {isView: false};
	}

	onClick() {
		this.setState({isView: true});
	}

	onSubmitForm(event) {
		console.log(event);
	}

	render() {
		const {isView} = this.state;
		if (!isView) {
			return (
				<NewCardLayout onClick={() => this.onClick()}/>
			);
		}
		return (
			<CreateCardLayout>
				<form onSubmit={(event) => this.onSubmitForm(event)}>
					<CreateCardTitle>Введите данные карты</CreateCardTitle>
					<InputField>
						<Label>Номер</Label>
						<InputCardNumber
							name='phoneNumber'
							value={this.state.phoneNumber}
							onChange={(event) => this.onChangeInputValue(event)} />
					</InputField>
					<InputField>
						<Label>Сумма</Label>
						<InputSum
							name='sum'
							value={this.state.sum}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<CreateButton bgColor='#fff' textColor='#108051'>Создать</CreateButton>
				</form>
			</CreateCardLayout>
		);
	}

}

CardCreate.propTypes = {
	isView: PropTypes.bool,
	onClick: PropTypes.func
};

export default CardCreate;
