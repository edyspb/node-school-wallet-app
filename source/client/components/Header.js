import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Title, UserInfo, Button} from './';
import axios from 'axios';


const StyledButton = styled.button`
height: 36px;
width: 120px;
font-size: 13px;
font-weight: 600;
border: none;
border-radius: 3px;
cursor: pointer;
background-color: ${({bgColor}) => bgColor};
color: ${({textColor}) => textColor};

&:focus,
&:hover {
	background-color: ${({bgColor}) => bgColor};
	color: ${({textColor}) => textColor};
}
`;

const HeaderLayout = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 74px;
	background: #fff;
	padding: 20px 30px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Balance = styled(Title)`
	margin: 0;
`;

const BalanceSum = styled.span`
	font-weight: bold;
`;

const Report = styled.a`
	margin: 0;
	cursor: pointer;
	font-size: 24px;
	font-weight: 600;
	color: #000;
`;

function onReport(activeCard) {
	axios
		.get(`/report/${activeCard.id}`)
		.then((response) => {
			const link = document.createElement("a");
			link.download = 'reportFile';
			link.href = `/report/${activeCard.id}`;
			link.click();
		})
		.catch((error) => {if(error) console.log('error', error)});
}

const Header = ({activeCard, user, singOut}) => (
	<HeaderLayout>
		{ activeCard ? <div><Balance>
			{`${activeCard.bankName}: `}
			<BalanceSum>{`${activeCard.balance} ₽`}</BalanceSum>
		</Balance>
		<Report onClick={() => onReport(activeCard)}>Запросить отчет</Report> </div> : <div> Нет доступных карт </div> }
		<UserInfo user={user} />
		<StyledButton onClick={singOut}>
		   Выйти
		</StyledButton>
	</HeaderLayout>
);

Header.propTypes = {
	activeCard: PropTypes.shape({
		bankName: PropTypes.string.isRequired,
		balance: PropTypes.number.isRequired
	}),
	user: PropTypes.shape({
		display_name: PropTypes.string.isRequired,
	})
};

export default Header;
