const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const axios = require("axios").default;

const PANCAKE_URL = 'https://api.pancakeswap.info/api/v2/tokens'
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
    keys.forEach(async token_id => {
      const token_data = tokens_data[token_id]
      const old_token_data = old_tokens_data.get(token_id)
      
      const { name, symbol, price, price_BNB } = token_data
      if (old_token_data) {
        const old_price = old_token_data.price
        
        if ( price / old_price > 10 ) {
          // send notification to telegram
          console.log(price, old_price)
        }
      }
      token_data.date = Timestamp.fromDate(new Date())

      await tokensRef.doc(token_id).set(token_data);
    });
  })
  .catch(error => {
    console.error(error);
  });
}
