const express = require('express');
const app = express();
const MercadoPago = require('mercadopago');


const getFullUrl = (req) =>{
    const url = req.protocol + '://' + req.get('host');
    console.log(url)
    return url;
}

//Public key:TEST-6ff95509-3be6-4825-b8f7-5c6767294b86
//Access token:TEST-3260321011293596-061906-6cdf2c22206e79007f91b8f5642b3cf2-267336909

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-3260321011293596-061906-6cdf2c22206e79007f91b8f5642b3cf2-267336909"
});


app.get("/olacasada",(req,res) => {
    res.send("OLÁ MUNDO!");
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
        auto_return : "all",
        external_reference : id,
        back_urls : {
          success : getFullUrl(req) + "/payments/success",
          pending : getFullUrl(req) + "/payments/pending",
          failure : getFullUrl(req) + "/payments/failure",
        }
      }
0

      try {
        const preference = await MercadoPago.preferences.create(purchaseOrder);
        return res.redirect(`${preference.body.init_point}`);
      }catch(err){
        return res.send(err.message);
      }

});

app.get("/payments/success",(req, res) => {
    res.send(JSON.stringify(req.query));
});

app.get("/payments/pending",(req, res) => {
    res.send(JSON.stringify(req.query));
});


app.get("/payments/failure",(req, res) => {
    res.send(JSON.stringify(req.query));
})

app.listen(3000, function(err){
    if(err) console.error(err);
    console.log(`API INICIADA NA PORTA 3000`) 
});