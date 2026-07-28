const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML, CSS, images, PDF, etc.
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@madhu28",
    database: "portfolio"
});

// Connect Database
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed:", err.message);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

// Contact Form
app.post("/contact", (req, res) => {

    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;

    const sql = `
        INSERT INTO contact
        (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        email,
        phone,
        subject,
        message
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("Database Error:", err);
            return res.status(500).send(`
                <h2>Error saving message</h2>
                <a href="/">Go Back</a>
            `);
        }

        res.send(`
            <html>
            <head>
                <title>Success</title>
                <style>
                    body {
                        font-family: Arial;
                        text-align: center;
                        padding-top: 100px;
                    }

                    h2 {
                        color: green;
                    }

                    a {
                        text-decoration: none;
                        background: #333;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }
                </style>
            </head>

            <body>

                <h2>Message Saved Successfully!</h2>

                <p>Thank you for contacting me.</p>

                <br>

                <a href="/">Go Back to Portfolio</a>

            </body>
            </html>
        `);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});