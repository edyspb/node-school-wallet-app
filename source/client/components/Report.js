import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

const MenuHeader = styled.span`
	text-align: center;
	height: 40px;
	cursor: pointer;
	font-size: 24px;
	font-weight: 600;
	color: #000;
`;

const LinkReport = styled.a`
	position: relative;
	display: block;
	margin: 0;
	cursor: pointer;
	font-size: 24px;
	font-weight: 600;
	color: #000;
		
	&:hover {
		background-color: ${({bgColor}) => bgColor};
		border-radius: 4px;
		color: #000;
	}
`;

const Menu = styled.ul`
	background-color: white;
	border-radius: 4px;
`;

class Report extends Component {

	constructor(props) {
		super(props);
		this.state = {isOpened: false};
	}

	toggleItems() {
		this.setState({isOpened: !this.state.isOpened});
	}

	render() {
		const items = ['txt', 'xls'];
		const {isOpened} = this.state;
		const {activeCard} = this.props;
		let menuItems;
		if (isOpened) {
			menuItems = <Menu>
				{items.map((item, key) => (
					<LinkReport
						key={key}
						href={`/api/v1/report/${activeCard.id}/${item}`}
						download='reportFile'
						bgColor='#018ca5'>
						В формате {item}
					</LinkReport>
				))}
			</Menu>
		}
		return (
			<MenuHeader onClick={() => this.toggleItems()}>
				Запросить отчет
				{menuItems}
			</MenuHeader>
		);
	}
}

Report.propTypes = {
	activeCard: PropTypes.shape({
		bankName: PropTypes.string.isRequired,
		balance: PropTypes.number.isRequired,
		id: PropTypes.number.isRequired
	})
};

export default Report;
