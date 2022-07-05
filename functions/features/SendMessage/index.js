const axios = require('axios').default;

module.exports = async function SendMessage (message) { 
  const chatIdOne = process.env.CHAT_ID_ONE
  const chatIdTwo = process.env.CHAT_ID_TWO
  const bot_token = process.env.BOT_TOKEN

  
  const TELE_URL_ONE = `https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chatIdOne}&text=${message.toString()}`
  const TELE_URL_TWO = `https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chatIdTwo}&text=${message.toString()}`

  const [firstResponse, secondResponse] = await Promise.all([
    axios.get(TELE_URL_ONE),
    axios.get(TELE_URL_TWO)
  ]);

  console.log(firstResponse, secondResponse)
}
