const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const axios = require("axios").default;
const SendMessage = require("../SendMessage")
const _ = require("lodash")

const PANCAKE_URL = 'https://api.pancakeswap.info/api/v2/tokens'
const MULTIPLE = 10
module.exports = async function ScheduleGetAPI () {  
  const db = getFirestore();
  const tokensRef = db.collection('tokens');

  const old_tokens_data = new Map();
  const get_old_data = async function() {
    const querySnapshot = await tokensRef.get();

    querySnapshot.forEach((doc) => {
      return old_tokens_data.set(doc.id, doc.data())
    })
    return old_tokens_data
  }

  return axios(url = PANCAKE_URL, {
    method: 'GET',
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    credentials: 'same-origin'
  })
  .then(async res => {
    res_data = res.data
    tokens_data = res_data.data

    const old_tokens_data = await get_old_data()
    if (!old_tokens_data) return
    
    keys = Object.keys(tokens_data)
    
    await keys.forEach(async token_id => {
      const token_data = tokens_data[token_id]
      const old_token_data = old_tokens_data.get(token_id)
      
      const { name, price } = token_data
      if (old_token_data) {
        const old_price = old_token_data.price
        const price_multiples = (old_price / price).toFixed()
        const check_logic = price_multiples > MULTIPLE

        if ( check_logic ) {
          // send message to telegram
          const message = `Token: ${name}, multiple: ${price_multiples}, OldPrice: ${ _.round((old_price), 5) } - Price: ${_.round((price), 5)}`
          SendMessage(message)
        }
      }
      // update data to firebase
      token_data.date = Timestamp.fromDate(new Date())
      await tokensRef.doc(token_id).set(token_data);
    });
  })
  .catch(error => {
    console.error(error);
  });
}
