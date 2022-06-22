const axios = require('axios').default;

module.exports = function SendMessage (message) { 
  const chatId = process.env.CHAT_ID
  const bot_token = process.env.BOT_TOKEN

  const TELE_URL = `https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chatId}&text=${message.toString()}`

  return axios(TELE_URL, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  })
  .then(res => {
    console.log(res, res.status, "data")
  })
  .catch(error => {
    console.error(error);
  });
}
