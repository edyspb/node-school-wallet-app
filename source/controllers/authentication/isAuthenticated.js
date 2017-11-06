'use strict';
const axios = require('axios');

module.exports = async (ctx) => {

    const answer = {
        isAuthenticated: false,
    };
    
    let accessToken;

    if (ctx.request.method === 'GET') {
        accessToken = ctx.cookies.get('accessToken');
    } else {
        const authData = ctx.request.body;
        accessToken = authData.accessToken;
    }

    if (accessToken === undefined) {
        return answer;
    }
 
	let userBio;

	await axios.get('https://login.yandex.ru/info?format=json&with_openid_identity=1',
     { headers: { Authorization: `OAuth ${accessToken}`}}).then((answer) => {
         userBio = answer.data;
	 }).catch((err) => {
	 	console.log('11111111err');
	 });
    
	 if (userBio === undefined) {
         return answer;
     }

     const appUser = await ctx.usersModel.get(userBio.id);

     if (!appUser) {
         return answer;
     }

    answer.isAuthenticated = true,
    answer.user = appUser;

    return answer;
};
