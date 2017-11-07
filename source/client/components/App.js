import React, {Component} from 'react';
import styled from 'emotion/react';
import {injectGlobal} from 'emotion';
import CardInfo from 'card-info';
import axios from 'axios';
import Cookies from 'universal-cookie';

import {
	CardsBar,
	Header,
	History,
	Prepaid,
	MobilePayment,
	Withdraw,
	Charts
} from './';

import './fonts.css';

injectGlobal([`
	html,
	body {
		margin: 0
	}

	#root {
		height: 100%
		font-family: 'Open Sans'
		color: #000
	}
`]);

const Wallet = styled.div`
	display: flex;
	min-height: 100%;
	background-color: #fcfcfc;
`;

const CardPane = styled.div`
	flex-grow: 1;
`;

const Workspace = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 970px;
	padding: 15px;
`;

/**
 * Приложение
 */
class App extends Component {
	/**
	 * Подготавливает данные карт
	 *
	 * @param {Object} cards данные карт
	 * @returns {Object[]}
	 */
	static prepareCardsData(cards) {
		return cards.map((card) => {
			const cardInfo = new CardInfo(card.cardNumber, {
				banksLogosPath: '/assets/',
				brandsLogosPath: '/assets/'
			});

			return {
				id: card.id,
				balance: card.balance,
				number: cardInfo.numberNice,
				bankName: cardInfo.bankName,
				theme: {
					bgColor: cardInfo.backgroundColor,
					textColor: cardInfo.textColor,
					bankLogoUrl: cardInfo.bankLogoSvg,
					brandLogoUrl: cardInfo.brandLogoSvg,
					bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`
				}
			};
		});
	}

	static prepareHistory(cardsList, transactionsData) {
		return transactionsData.map((data) => {
			const card = cardsList.find((item) => item.id === Number(data.cardId));
			return card ? Object.assign({}, data, {card}) : data;
		});
	}

	/**
	 * Конструктор
	 */
	constructor(props) {
		super();

		const cookies = new Cookies();
		console.log('accessToken', cookies.get('accessToken'));

		const data = props.data;
		const cardsList = App.prepareCardsData(data.cards);
		const cardHistory = App.prepareHistory(cardsList, data.transactions);

		this.state = {
			cardsList,
			cardHistory,
			activeCardIndex: 0,
			removeCardId: 0,
			isCardRemoving: false,
			isCardsEditable: false,
			isCharts: false,
			user: data.user,
			accessToken: cookies.get('accessToken'),
		};

		this.onTransaction = this.onTransaction.bind(this);
		this.onCreated = this.onCreated.bind(this);
	}

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} activeCardIndex индекс выбранной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});
	}

	/**
	* Обработчик события редактирования карт
	* @param {Boolean} isEditable Признак редактируемости
	*/
	onEditChange(isEditable) {
		const isCardsEditable = !isEditable;
		this.setState({
			isCardsEditable,
			isCardRemoving: false
		});
	}

	/**
	* Функция вызывает при успешной транзакции
	*/
	onTransaction() {
		const { accessToken } = this.state;


		axios.get('api/v1/cards', {headers: {AccessToken: accessToken}}).then(({data}) => {
			const cardsList = App.prepareCardsData(data);
			this.setState({cardsList});

			axios.get('api/v1/transactions').then(({data}) => {
				const cardHistory = App.prepareHistory(cardsList, data);
				this.setState({cardHistory});
			});
		});
	}

	/**
	 * Обработчик события переключения режима сайдбара
	 * @param {String} mode Режим сайдбара
	 * @param {String} index Индекс выбранной карты
	 */
	onChangeBarMode(event, removeCardId) {
		event.stopPropagation();
		this.setState({
			isCardRemoving: true,
			removeCardId
		});
	}

	/**
	 * Удаление карты
	 * @param {Number} index Индекс карты
	 */
	deleteCard(id) {
		axios
			.delete(`/api/v1/cards/${id}`)
			.then(() => {
				axios.get('api/v1/cards').then(({data}) => {
					const cardsList = App.prepareCardsData(data);
					this.setState({
						cardsList,
						activeCardIndex: 0,
						isCardRemoving: false
					});
				});
			});
	}

	onCreated() {
		this.onTransaction();
	}

	onDeleted() {
		const {cardsList, activeCardIndex} = this.state;
		this.setState({
			removeCardId: cardsList[activeCardIndex].id,
			isCardRemoving: true
		});
	}

	onCancelClick() {
		this.setState({isCardRemoving: false});
	}


	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const { isAuthenticated } = this.props.data;
		const { singOut } = this.props;
		const {cardsList, activeCardIndex, cardHistory, isCardsEditable, isCardRemoving, removeCardId, isCharts, user} = this.state;
		const activeCard = cardsList[activeCardIndex];

		const inactiveCardsList = cardsList.filter((card, index) => (index === activeCardIndex ? false : card));
		const filteredHistory = cardHistory.filter((data) => {
			// TODO: изменить генерацию id карт
			if (activeCard === undefined) return false;

			return Number(data.cardId) == activeCard.id;
		});

		if (!isAuthenticated) {
			return <div />;
		}

		let pane;
		if (isCharts) {
			pane = (
				<div>
					<Header activeCard={activeCard} user={user} singOut={singOut} />
					<Charts
						cardId={activeCard.id}
						onCloseCharts={() => this.setState({isCharts: false})} />
				</div>
			);
		} else {
			pane = (
				<CardPane>
					<Header activeCard={activeCard} user={user} singOut={singOut} />
					{activeCard ?
						<Workspace>
							<History cardHistory={filteredHistory}/>
							{cardsList.length > 1 ?
								<Prepaid
									activeCard={activeCard}
									inactiveCardsList={inactiveCardsList}
									onCardChange={(newActiveCardIndex) => this.onCardChange(newActiveCardIndex)}
									onTransaction={() => this.onTransaction()}/> : <div/>}
							<MobilePayment activeCard={activeCard} onTransaction={() => this.onTransaction()}/>
							{cardsList.length > 1 ? <Withdraw
								activeCard={activeCard}
								inactiveCardsList={inactiveCardsList}
								onTransaction={() => this.onTransaction()}/> : <div/>}
						</Workspace>
						: <div/>}
				</CardPane>
			);
		}
		return (
			<Wallet>
				<CardsBar
					activeCardIndex={activeCardIndex}
					removeCardId={removeCardId}
					cardsList={cardsList}
					onCardChange={(index) => this.onCardChange(index)}
					isCardsEditable={isCardsEditable}
					isCardRemoving={isCardRemoving}
					deleteCard={(index) => this.deleteCard(index)}
					onChangeBarMode={(event, index) => this.onChangeBarMode(event, index)}
					onCreated={this.onCreated}
					onDeleted={() => this.onDeleted()}
					onCancelClick={() => this.onCancelClick()}
					onScreen={() => this.setState({isCharts: true})} />
				{pane}
			</Wallet>
		);
	}
}

export default App;
