const express = require('express');
const app = express();
const MercadoPago = require('mercadopago');


const getFullUrl = (req) =>{
    const url = req.protocol + '://' + req.get('host');
    console.log(url)
    return url;
}

//{"collection_id":"26961020","collection_status":"pending","external_reference":"123","payment_type":"ticket","merchant_order_id":"1541720696","preference_id":"267336909-4b1d35cc-e26e-46cd-8347-d9da4952dc8d","site_id":"MLB","processing_mode":"aggregator","merchant_account_id":"null"}
//Public key:TEST-6ff95509-3be6-4825-b8f7-5c6767294b86
//Access token:TEST-3260321011293596-061906-6cdf2c22206e79007f91b8f5642b3cf2-267336909

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-3260321011293596-061906-6cdf2c22206e79007f91b8f5642b3cf2-267336909"
});


app.get("/olacasada",(req,res) => {
    var filters = {
        id:  26961094
      };
    
      MercadoPago.payment.search({
        qs: filters
      }).then(function (data) {
        res.send(data);
      }).catch(function (error) {
        res.send(error);
      });
});

app.get("/payments/checkout/:id/:email/:description/:amount",async (req, res) => {
    const { id, email, description, amount } = req.params;
    const purchaseOrder = {
        items: [
          item = {
            id: id,
            title: description,
            description : description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: parseFloat(amount)
          }
        ],
        payer : {
          email: email
        },
        back_urls : {
            success : getFullUrl(req) + "/payments/success",
            pending : getFullUrl(req) + "/payments/pending",
            failure : getFullUrl(req) + "/payments/failure",
        },
        auto_return : "all",
        external_reference : id,
      }


      try {
        const preference = await MercadoPago.preferences.create(purchaseOrder);
        console.log(preference);
        return res.redirect(`${preference.body.init_point}`);
      }catch(err){
        return res.send(err.message);
      }

});

//267336909-4fc55849-b73a-4cf7-97ac-1775481a751a

app.get("/payments/success",(req, res) => {
    console.log("SUCESSOU VIADO!");
    res.send(JSON.stringify(req.query));
});

app.get("/payments/pending",(req, res) => {
    console.log("PENDEU VIADO!");
    res.send(JSON.stringify(req.query));
});


app.get("/payments/failure",(req, res) => {
    console.log("FALHOU VIADO!");
    res.send(JSON.stringify(req.query));
})

app.post("/notification",(req, res) => {
  console.log(req.query);
  console.log(req.body);
  res.send("NOICE");
});

app.listen(80, function(err){
    if(err) console.error(err);
    console.log(`API INICIADA NA PORTA 3000`) 
});
