import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';
import {Title, Island, Button} from './';

const LandingLayout = styled.div`
display: flex;
flexDirection: column;
align-items: center;
min-height: 100%;
background-color: #fcfcfc;
`;

const HeaderLayout = styled.header`
display: flex;
justify-content: space-between;
height: 74px;
background: #242424;
padding: 20px 30px;
box-sizing: border-box;
width: 100%;
border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Logo = styled.div`
display: flex;
width: 147px;
height: 28px;
margin-bottom: 55px;
background-image: url('/assets/yamoney-logo.svg');
`;

const Jumbotron = styled(Island)`
margin-top: 100px;
width: 440px;
display: flex;
flex-direction: column;
align-items: center;
`;

const JumbotronTitle = styled(Title)`
text-align: center;
`;

const JumbotronText = styled(Title)`
text-align: center;
font-size: 12px;
color: #999;
`;

const Landing = ({children, className}) => (
	<LandingLayout>
        <HeaderLayout>
            <Logo />
        </HeaderLayout>
        <Jumbotron >
        <JumbotronTitle>"Кошелек" - приложение для управления личными финансами</JumbotronTitle>
           <JumbotronText> Для входа в личный кабинет, пожалуйста, авторизуйтесь</JumbotronText>
           <a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=3b8a4438962941d68d286f15fdeaacc2">
             <Button bgColor="#3897f0" textColor="#fff">Войти через Yandex</Button>
           </a>
        </Jumbotron>
    </LandingLayout>    
);

export default Landing;

// <NavLink to=> </NavLink>