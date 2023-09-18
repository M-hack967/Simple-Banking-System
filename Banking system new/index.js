const express = require('express');
const mysql = require('mysql');
const app = express();
app.set('view engine','ejs');
var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'mohan109',
    database: 'bank'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


app.get('/', (req, res) => {

    res.sendFile('/public/index.html')



})

app.get('/aboutus.html', (req, res) => {

    res.sendFile('/public/aboutus.html')



})


app.post('/transfer.html', (req, res) => {
    const user1 = req.body.sender;
    const user2 = req.body.receiver;
    const amount = parseFloat(req.body.amount);
    console.log(user1);
    
    db.query('SELECT balance FROM customer_details WHERE name IN (?, ?)', [user1, user2], (err, results) => {
        if (err) {
            console.error('Error fetching balances:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length !== 2) {
            return res.status(404).send('User not found');
        }

        const balance1 = parseFloat(results[0].balance);
        const balance2 = parseFloat(results[1].balance);

        if (balance1 < amount) {
            return res.status(400).send('Insufficient balance');
        }

       
        const newBalance1 = balance1 - amount;
        const newBalance2 = balance2 + amount;

        
        db.query('UPDATE customer_details SET balance = ? WHERE name = ?', [newBalance1, user1], (err) => {
            if (err) {
                console.error('Error updating balance for user1:', err);
                return res.status(500).send('Internal server error');
            }

            db.query('UPDATE customer_details SET balance = ? WHERE name = ?', [newBalance2, user2], (err) => {
                if (err) {
                    console.error('Error updating balance for user2:', err);
                    return res.status(500).send('Internal server error');
                }

                return res.send('Transfer successful');
            });
        });
    });
});

app.get('/customer/:customerId', (req, res) => {
    const customerId = req.params.customerId;

  
    const query = `SELECT * FROM CUSTOMER_DETAILS WHERE ID = ${customerId}`;

    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
           
            res.status(500).send('Error fetching customer details');
            return;
        }

        if (results.length === 0) {
          
            res.status(404).send('Customer not found');
        } else {
            
            const customer = results[0];
            res.render('customer_details', { customer });
        }
    });
});



app.listen(port, () => {
    console.log("server started at " + port);
});