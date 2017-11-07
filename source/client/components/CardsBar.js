import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Card, CardDelete, Report} from './';

const Layout = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	background-color: #242424;
	padding: 20px;
`;

const Logo = styled.div`
	width: 147px;
	height: 28px;
	margin-bottom: 55px;
	background-image: url('/assets/yamoney-logo.svg');
`;

const CardsList = styled.div`this.state.activeCard.id
	flex: 1;
`;

const Footer = styled.footer`
	color: rgba(255, 255, 255, 0.2);
	font-size: 15px;
`;

const CardsBar = ({
	activeCardIndex, cardsList, onCardChange, isCardsEditable, isCardRemoving, onChangeBarMode,
	removeCardId, deleteCard, onCreated, onDeleted, onCancelClick, onScreen
}) => {
	const onCardClick = (index) => {
		onCardChange && onCardChange(index);
	};

	if (isCardRemoving) {
		return (
			<Layout>
				<Logo />
				<CardDelete
					deleteCard={deleteCard}
					data={cardsList.filter((item) => item.id === removeCardId)[0]}
					onCancelClick={() => onCancelClick()} />
				<Footer>Yamoney Node School</Footer>
			</Layout>
		);
	}

	return (
		<Layout>
			<Logo />
			<Report onScreen={() => onScreen()} activeCard={cardsList[activeCardIndex]} />
			<CardsList>
				{cardsList
					.filter((item) => !item.hidden)
					.map((card, index) => (
						<Card
							key={index}
							data={card}
							active={index === activeCardIndex}
							isCardsEditable={isCardsEditable}
							onChangeBarMode={onChangeBarMode}
							onClick={() => onCardClick(index)}
							onDeleted={() => onDeleted()} >
						</Card>
					))
				}
				<Card type='new' onCreated={(newCard) => onCreated(newCard)} />
			</CardsList>
			<Footer>Yamoney Node School</Footer>
		</Layout>
	);
};

CardsBar.propTypes = {
	cardsList: PropTypes.arrayOf(PropTypes.object).isRequired,
	activeCardIndex: PropTypes.number.isRequired,
	removeCardId: PropTypes.number,
	onCardChange: PropTypes.func.isRequired,
	isCardsEditable: PropTypes.bool.isRequired,
	isCardRemoving: PropTypes.bool.isRequired,
	deleteCard: PropTypes.func.isRequired,
	onChangeBarMode: PropTypes.func.isRequired,
	onCreated: PropTypes.func.isRequired,
	onDeleted: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
	onScreen: PropTypes.func.isRequired
};

export default CardsBar;
