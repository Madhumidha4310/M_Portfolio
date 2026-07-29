require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();

// Vercel PORT அல்லது Local PORT
const PORT = process.env.PORT || 3000;
const PORT = 5000;

// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// SERVE FRONTEND FILES

app.use(express.static(path.join(__dirname, "public")));


// MYSQL CONNECTION POOL

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// TEST MYSQL CONNECTION

async function testDatabase() {

    try {

        const connection = await pool.getConnection();

        console.log("MySQL Connected Successfully");

        connection.release();

    } catch (error) {

        console.error(
            "MySQL Connection Failed:",
            error.message
        );

    }

}

testDatabase();


// CONTACT FORM

app.post("/contact", async (req, res) => {

    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;


    // Check required fields

    if (!name || !email || !message) {

        return res.status(400).send(`
            <h2>Please fill all required fields</h2>

            <br>

            <a href="/">
                Go Back
            </a>
        `);

    }


    try {

        // SQL Query

        const sql = `
            INSERT INTO contact
            (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)
        `;


        // Values

        const values = [
            name,
            email,
            phone || null,
            subject || null,
            message
        ];


        // Insert Data

        await pool.execute(sql, values);


        console.log(
            "Contact message saved successfully"
        );


        // Success Response

        res.send(`

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">

                <title>Message Sent</title>


                <style>

                    body {

                        font-family: Arial, sans-serif;

                        text-align: center;

                        padding-top: 100px;

                        background: #f5f5f5;

                    }


                    .success-box {

                        background: white;

                        width: 90%;

                        max-width: 500px;

                        margin: auto;

                        padding: 40px;

                        border-radius: 10px;

                        box-shadow:
                        0 5px 20px
                        rgba(0,0,0,0.1);

                    }


                    h2 {

                        color: green;

                    }


                    a {

                        display: inline-block;

                        margin-top: 20px;

                        text-decoration: none;

                        background: #333;

                        color: white;

                        padding: 12px 25px;

                        border-radius: 5px;

                    }


                    a:hover {

                        background: #555;

                    }

                </style>

            </head>


            <body>


                <div class="success-box">

                    <h2>
                        Message Sent Successfully!
                    </h2>


                    <p>
                        Thank you for contacting me.
                    </p>


                    <a href="/">
                        Go Back to Portfolio
                    </a>

                </div>


            </body>

            </html>

        `);


    } catch (error) {


        console.error(
            "Database Error:",
            error.message
        );


        res.status(500).send(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>Database Error</title>

            </head>


            <body>

                <h2>
                    Error saving message
                </h2>


                <p>
                    Please try again later.
                </p>


                <a href="/">
                    Go Back
                </a>

            </body>

            </html>

        `);

    }

});


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
