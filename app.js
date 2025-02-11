//get-user-data
const axios = require('axios');
require('dotenv').config();
const cors = require('cors')
const http = require('http');
const express = require('express');
const app = express();
const WebSocket = require('ws');
//const mailgun = require('mailgun-js');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const uuid = require('uuid');
const multer = require('multer');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const time = require('node-time');
const cron = require('node-cron');
const socketIo = require('socket.io');
const server = http.createServer(app);
const { OpenAI } = require('openai');
const Chart = require('chart.js');  // For chart generation
const { format } = require('date-fns');
const io = socketIo(server);
app.use(bodyParser.json());

// app.use(express.json());
app.use(cors());

//import config
const { app_port, app_name } = require("./config")
// const { openai_key } = require('./config/index.js');
// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });
// Create a MySQL connection pool

const {pool} = require("./config/db")

// Generate a secure random key
const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomKey(32);

// Initialize session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,  // Save even if session data is not modified
  cookie: { httpOnly: true }  // Cookie settings
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  console.log('Session:', req.session);  // Debugging session
  if (!req.session || !req.session.email) {
    return res.redirect('/userlogin');  // Redirect to login if not authenticated
  }
  next();  // Proceed to the requested page if authenticated
}

const { openai_key } = require('./config/index.js'); // Importing the key
const { ifError } = require('assert');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: openai_key,  // Use your API key here
});


    // Serving static files from the 'public' directory /userlogin
    app.use(express.static(path.join(__dirname, 'public')));

    // Serving the payments file file
    app.get('/registration', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'registration.html'));
    });

    // Serving the payments file file
    app.get('/userregistration', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'userregistration.html'));
    });

    // Serving the payments file file
    app.get('/userlogin', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'userlogin.html'));
    });

    // Serving the payments file file
    app.get('/meals', isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'meals.html'));
    });

     // Serving the payments file file
     app.get('/meals2', isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'meals2.html'));
    });

    app.get('/dashboard', isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    });

    app.get('/detailconfirmation', isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'detailconfirmation.html'));
    });

    app.get('/mealschedule', isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mealschedule.html'));
    });

    app.get('/recommend', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'recommend.html'));
    });

    app.get('//', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', '/.html'));
    });


    app.get('/account', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'account.html'));
    });

    app.get('/myaccount', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'myaccount.html'));
    });


    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    app.get('/profile', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    });



let circuitOpen = false;
let failureCount = 0;

const getDietRecommendations = async (userInput) => {
  if (circuitOpen) {
    console.log('Circuit is open. Try again later.');
    return "Service unavailable due to high load.";
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Provide a balanced diet for a child with the following conditions: ${userInput}.` }
      ],
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    failureCount = 0; // Reset on success
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error details:', error);
    if (error.response && error.response.status === 429) {
      failureCount++;
      if (failureCount >= 3) { // Open circuit after 3 failures
        circuitOpen = true;
        console.log('Circuit opened due to repeated failures. Will resume in 1 minute.');
        setTimeout(() => { circuitOpen = false; failureCount = 0; }, 60000); // Reset circuit after 1 minute
      }
    }
    // return "Error fetching diet recommendations.";
    return "Sorry we are unable to get your diet suggestions right now. Please try again later.";
  }
};


// API Route to get diet recommendations
app.post('/api/diet-recommendation', async (req, res) => {
  const { conditions } = req.body;
  if (!conditions) {
    return res.status(400).json({ error: 'Conditions are required.' });
  }

  const recommendation = await getDietRecommendations(conditions);
  res.json({ recommendation });
});

// Endpoint to fetch the username and account type
app.get('/get-user', (req, res) => {
  const email = req.session.email;
  const getUserInfoQuery = 'SELECT username, email, contact FROM dietmaster_members WHERE email = ?';

  pool.promise().execute(getUserInfoQuery, [email])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          email: results[0].email,
          contact: results[0].contact,                
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/individualregistration', async (req, res) => {
  const { individual_email, individual_password } = req.body;

  // Check if the email already exists
  const validateEmail = `SELECT * FROM personal_diet WHERE email = ?`;
  const [emailResults] = await pool.promise().execute(validateEmail, [individual_email]);

  if (emailResults.length > 0) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(individual_password, 10);

  const insertQuery = `INSERT INTO personal_diet (email, password) VALUES (?, ?)`;

  try {
    await pool.promise().execute(insertQuery, [individual_email, hashedPassword]);
    return res.status(200).json({ message: 'Registration successful! Redirecting...' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});



app.post('/update-details', async (req, res) => {
  const { allergies, health, favorites, age } = req.body; // Receive the data via POST body
  const userEmail = req.session.email; // Assuming email is stored in session

  if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized: Session expired or user not logged in.' });
  }

  try {
      const updates = [];
      const values = [];

      // Check for each field and only add to query if it's not empty or 'NO' (the user input)
      if (allergies && allergies !== 'NO') {
          updates.push('allergies = ?');
          values.push(allergies); // Add allergies value
      }
      if (health && health !== 'NO') {
          updates.push('health_conditions = ?');
          values.push(health); // Add health conditions value
      }
      if (favorites && favorites !== 'NO') {
          updates.push('favorite_meals = ?');
          values.push(favorites); // Add favorite meals value
      }
      if (age && age !== 'NO') {
          updates.push('child_age = ?');
          values.push(age); // Add child age value
      }

      // If we have any fields to update
      if (updates.length > 0) {
          // Build the dynamic query to update only the fields with values
          const query = `UPDATE dietmaster_members SET ${updates.join(', ')} WHERE email = ?`;
          values.push(userEmail); // Add email to the query parameters to target the correct user

          // Execute the query
          const [result] = await pool.promise().execute(query, values);

          return res.status(200).json({ message: 'Details updated successfully!', updatedRows: result.affectedRows });
      } else {
          res.status(400).json({ error: 'No valid data to update.' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the details. Please try again later.' });
  }
});


app.post('/delete-details', async (req, res) => {
  const deletionupdate = "No data";
  const userEmail = req.session.email; // Assuming email is stored in session

  if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized: Session expired or user not logged in.' });
  }

  try {
     
          // Build the dynamic query to update only the fields with insert into
          const deletequery = `UPDATE dietmaster_members SET allergies = ?, health_conditions = ?, favorite_meals = ?, child_age = ? WHERE email = ?`;
          await pool.promise().execute(deletequery, [deletionupdate, deletionupdate, deletionupdate, deletionupdate, userEmail]);
          return res.status(200).json({ message: 'Data successfully deleted!'});
     
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting data. Please try again later.' });
  }
});


app.get('/get-user-data', async (req, res) => {
  const userEmail = req.session.email; // Assume the email is stored in the session

  try {
      const [rows] = await pool.promise().query(
          'SELECT allergies, health_conditions, favorite_meals, child_age FROM dietmaster_members WHERE email = ?',
          [userEmail]
      );

      if (rows.length > 0) {
          const allergiesList = rows[0].allergies
              ? rows[0].allergies.split(',').map(item => item.trim())
              : [];
          const healthConditionsList = rows[0].health_conditions
          ? rows[0].health_conditions.split(',').map(item => item.trim())
          : [];

          const favoriteMealsList = rows[0].favorite_meals
              ? rows[0].favorite_meals.split(',').map(item => item.trim())
              : [];

          const ageList = rows[0].child_age
              ? rows[0].child_age.split(',').map(item => item.trim())
              : [];

          res.status(200).json({ allergies: allergiesList, health_conditions: healthConditionsList, favoriteMeals: favoriteMealsList, child_age: ageList });
      } else {
          res.status(200).json({ allergies: [], health_conditions: [], favoriteMeals: [], child_age: [] });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching user data' });
  }
});


app.get('/get-usersubscription', (req, res) => {
  const { subscryption } = req.query; // Make sure you get the subscription type from the query parameter
  const email = req.session.email; // Get the email from session

  if (!email) {
    return res.status(400).json({ error: 'Email is required to check subscription.' });
  }

  if (subscryption !== 'Monthly' && subscryption !== 'Yearly') {
    return res.status(400).json({ error: 'Invalid subscription type. Must be "monthly" or "yearly".' });
  }

  // Define the query based on the subscription type
  let query;
  if (subscryption === 'Monthly') {
    query = `
      SELECT monthy_payment AS ballance
      FROM dietmaster_subscriptions
      WHERE email = ?;
    `;
  } else if (subscryption === 'Yearly') {
    query = `
      SELECT yearly_payment AS ballance
      FROM dietmaster_subscriptions
      WHERE email = ?;
    `;
  }

  // Execute the query using the connection pool
  pool.promise().execute(query, [email])
    .then(([results]) => {
      if (results.length > 0) {
        res.json({ ballance: results[0].ballance }); // Return the correct balance depending on subscription
      } else {
        res.status(404).json({ error: 'Subscription details could not be found for this email.' });
      }
    })
    .catch(error => {
      console.error('Error querying balance:', error);
      res.status(500).json({ error: 'Internal server error.' });
    });
});




// app.post('/generate-diet', async (req, res) => {
//   const { allergies, likedFoods, dislikedFoods, healthConditions, otherDetails } = req.body;

//   if (!allergies || !likedFoods || !dislikedFoods || !healthConditions) {
//     return res.status(400).json({ error: 'All fields are required!' });
//   }

//   try {
//     // Generate recommendation using OpenAI
//     const prompt = `Generate a weekly diet recommendation for a child under 5 years old based on these details:
//     - Allergies: ${allergies}
//     - Liked Foods: ${likedFoods}
//     - Disliked Foods: ${dislikedFoods}
//     - Health Conditions: ${healthConditions}
//     - Other Details: ${otherDetails}`;

//     const aiResponse = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // Use the model your account supports
//       messages: [{ role: 'system', content: prompt }],
//       max_tokens: 500,
//     });

//     const dietPlan = aiResponse.choices[0].message.content.trim();

//     // Save result to database
//     const [result] = await pool.query(
//       `INSERT INTO diet_master (allergies, likedFoods, dislikedFoods, healthConditions, otherDetails, dietPlan, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
//       [allergies, likedFoods, dislikedFoods, healthConditions, otherDetails, dietPlan]
//     );

//     // Retrieve the stored record
//     const [rows] = await pool.query('SELECT * FROM diet_master WHERE id = ?', [result.insertId]);

//     res.status(200).json({ success: true, data: rows[0] });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to generate diet recommendation. Please try again later.' });
//   }
// });

app.post('/generate-diet', async (req, res) => {
  const { allergies, likedFoods, dislikedFoods, healthConditions, otherDetails } = req.body;

  if (!allergies || !likedFoods || !dislikedFoods || !healthConditions) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    // Mock diet response for testing
    const dietPlan = `Mock Diet Plan for:
    Allergies: ${allergies}, Liked Foods: ${likedFoods}, Disliked Foods: ${dislikedFoods},
    Health Conditions: ${healthConditions}, Other Details: ${otherDetails}.`;

    // Save result to database
    const [result] = await pool.query(
      `INSERT INTO diet_master (allergies, likedFoods, dislikedFoods, healthConditions, otherDetails, dietPlan, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [allergies, likedFoods, dislikedFoods, healthConditions, otherDetails, dietPlan]
    );

    // Retrieve the stored record
    const [rows] = await pool.query('SELECT * FROM diet_master WHERE id = ?', [result.insertId]);

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate diet recommendation. Please try again later.' });
  }
});



app.post('/familyregistration', async (req, res) => {
  const { members, family_email, family_password } = req.body;

  // Check if the email already exists
  const validateEmail = `SELECT * FROM family_diet WHERE email = ?`;
  const [emailResults] = await pool.promise().execute(validateEmail, [family_email]);

  if (emailResults.length > 0) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(family_password, 10);

  const insertQuery = `INSERT INTO family_diet (members, email, password) VALUES (?, ?, ?)`;

  try {
    await pool.promise().execute(insertQuery, [members, family_email, hashedPassword]);
    return res.status(200).json({ message: 'Registration successful! Redirecting...' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});



//registration will email confirmation

app.post('/userregistration', async (req, res) => {
  const { fullname, email, contact, password } = req.body;

  try {
    // Check if the email already exists
    const validateEmail = `SELECT * FROM dietmaster_members WHERE email = ?`;
    const [emailResults] = await pool.promise().execute(validateEmail, [email]);

    if (emailResults.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Validate contact
    const validateContact = `SELECT * FROM dietmaster_members WHERE contact = ?`;
    const [contactResults] = await pool.promise().execute(validateContact, [contact]);

    if (contactResults.length > 0) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Prepare the email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'onlinelearningclas@gmail.com',
        pass: 'fjaxelsjzejciyhp',
      },
      connectionTimeout: 60000, // 60 seconds timeout for email connections
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'DIET MASTER Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <h2 style="color: #007BFF; margin-bottom: 20px;">Welcome to DIET MASTER.</h2>
          <p style="font-size: 16px;">Please click the button below to verify your email address:</p>
          <a href="http://192.168.130.103:3000/activate/${verificationToken}"
             style="
               display: inline-block;
               padding: 10px 20px;
               margin: 20px auto;
               color: #fff;
               background-color: #28a745;
               text-decoration: none;
               font-size: 16px;
               border-radius: 5px;
             ">
            Activate your account
          </a>
          <p style="font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    };

    // Function to retry email sending
    async function sendEmailWithRetry(mailOptions, retries = 3) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await transporter.sendMail(mailOptions);
          return; // Email sent successfully
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);
          if (attempt === retries) throw error; // Rethrow after max retries
        }
      }
    }

    // Send the email with retry logic
    await sendEmailWithRetry(mailOptions);

    // Insert the user into the database only if email sending succeeds
    const insertQuery = `INSERT INTO dietmaster_members (username, email, contact, password, verification_token) VALUES (?, ?, ?, ?, ?)`;
    await pool.promise().execute(insertQuery, [fullname, email, contact, hashedPassword, verificationToken]);

    // Insert the user into the database only if email sending succeeds
    const insertSubscriptions = `INSERT INTO dietmaster_subscriptions (email) VALUES (?)`;
    await pool.promise().execute(insertSubscriptions, [email]);

    res.status(200).json({ message: 'Registration successful! Please check your email for an activation link.' });
  } catch (error) {
    console.error('Detailed error during registration:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({ error: 'Could not complete registration due to a technical issue. Please try again later.' });
  }
});



app.post('/login', async (req, res) => {
  try {
  
    // Destructure the request body
    const { login_email, login_password } = req.body;

    // Validate input fields
    if (!login_email || !login_password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Get a database connection
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection error:', err);
        return res.status(500).json({ error: 'Database connection error.' });
      }

      // Query the database
      const sql = `SELECT * FROM dietmaster_members WHERE email = ?`;
      connection.query(sql, [login_email], async (err, results) => {
        connection.release(); // Ensure connection is released

        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Database query error.' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const user = results[0];

        // // Check email verification
        // if (!user.isVerified) {
        //   return res.status(400).json({ error: 'Please verify your email address first.' });
        // }

        // Validate password
        const match = await bcrypt.compare(login_password, user.password);
        if (!match) {
          return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Store email in session
        req.session.email = login_email;
        // console.log('Session created:', req.session);

        res.status(200).json({ message: 'Login successful!' });
      });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});




     // Endpoint to fetch the username and account type
app.get('/get-user', (req, res) => {
  const email = req.session.email;
  const getUserInfoQuery = 'SELECT username, email, contact, alergies, dislikes, healthconditions, likes FROM dietmaster_members WHERE email = ?';

  pool.promise().execute(getUserInfoQuery, [email])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          email: results[0].email,
          contact: results[0].contact,
          alergies: results[0].alergies,
          dislikes: results[0].dislikes,
          healthconditions: results[0].healthconditions,
          likes: results[0].likes,
                            
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('There was an error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

const { generateMealPlan } = require("./ai");

// Route to handle form submissions and generate meal plans
app.post("/generate-meal-plan", async (req, res) => {
  const { preferences } = req.body;

  try {
      // Insert user preferences into the meal_type
      const [result] = await pool.execute(
          `INSERT INTO user_preferences (health_conditions, allergies, favorite_meals) VALUES (?, ?, ?)`,
          [preferences.health_conditions, preferences.allergies, preferences.favorite_meals]
      );

      const userId = result.insertId; // Get the newly created user ID
      const mealPlan = await generateMealPlan(userId); // Generate meal plan

      res.json({
          success: true,
          message: "Meal plan generated successfully!",
          mealPlan,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "An error occurred: " + error.message,
      });
  }
});


// Function to generate a balanced meal recommendation
async function generateDynamicMealWithAnalysis(email, mealType) {
  try {
    // Fetch user details
    const [userDetails] = await pool.promise().query(
      `SELECT child_age, allergies, health_conditions, favorite_meals FROM dietmaster_members WHERE email = ?`,
      [email]
    );

    if (!userDetails.length) {
      return { message: "User details not found." };
    }

    const { child_age, allergies, health_conditions, favorite_meals } = userDetails[0];

    if (child_age === "No data") {
      return { message: "Please update your child's details first to get meal recommendations." };
    }

    // Analyze the last week's recommendations
    const [pastRecommendations] = await pool.promise().query(
      `SELECT meal_name, meal_type, recommendation_date 
       FROM recommendations 
       WHERE email = ? 
       AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      [email]
    );

    // Prepare filtering conditions
    let allergyConditions = "1=1"; // Allow all by default
    if (allergies !== "No data" && allergies) {
      allergyConditions = allergies
        .split(",")
        .map((allergy) => `nutrition_info NOT LIKE '%${allergy.trim().replace(" ", "_")}%'`)
        .join(" AND ");
    }

    let healthConditionConditions = "1=1"; // Allow all by default
    if (health_conditions !== "No data" && health_conditions) {
      healthConditionConditions = health_conditions
        .split(",")
        .map((condition) => `nutrition_info LIKE '%${condition.trim().replace(" ", "_")}%'`)
        .join(" OR ");
    }

    let favoriteCondition = "1=1"; // Allow all by default
    if (favorite_meals !== "No data" && favorite_meals) {
      favoriteCondition = favorite_meals
        .split(",")
        .map((meal) => `meal_name LIKE '%${meal.trim().replace(" ", "_")}%'`)
        .join(" OR ");
    }

    let ageCondition = "1=1"; // Default for all ages
    if (child_age === "Less than 1 Year old") {
      ageCondition = "meal_type = 'breakfast'";
    } else if (child_age === "1 Year old") {
      ageCondition = "meal_type IN ('breakfast', 'lunch')";
    }

    // Check for previously recommended meals for today
    const [recommendedMealsToday] = await pool.promise().query(
      `SELECT meal_name, meal_type FROM recommendations WHERE email = ? AND DATE(recommendation_date) = CURDATE()`,
      [email]
    );

    const recommendedMealNames = recommendedMealsToday.map((meal) => meal.meal_name);

    // Handle the case when no meals are recommended yet today
    let query;
    let params;

    // If we have meals already recommended today, exclude those meals for each meal type
    if (recommendedMealNames.length > 0) {
      query = `
        SELECT * FROM meals
        WHERE meal_type = ?
        AND meal_name NOT IN (${recommendedMealNames.map(() => '?').join(',')})
        AND ${allergyConditions}
        AND ${healthConditionConditions}
        AND ${favoriteCondition}
        AND ${ageCondition}
        ORDER BY 
          CASE 
            WHEN ${favoriteCondition} THEN 1
            ELSE 2
          END,
          RAND()
        LIMIT 1
      `;
      params = [mealType, ...recommendedMealNames];
    } else {
      // If no recommended meals, just apply the filters
      query = `
        SELECT * FROM meals
        WHERE meal_type = ?
        AND ${allergyConditions}
        AND ${healthConditionConditions}
        AND ${favoriteCondition}
        AND ${ageCondition}
        ORDER BY 
          CASE 
            WHEN ${favoriteCondition} THEN 1
            ELSE 2
          END,
          RAND()
        LIMIT 1
      `;
      params = [mealType];
    }

    // Execute the dynamic query
    const [meals] = await pool.promise().query(query, params);

    if (!meals.length) {
      return { message: "Sorry! We could not find any suitable meal for you right now. This could be as a result of having several allergies or health conditions." };
    }

    // Parse nutrition_info JSON
    let generalInfo = "Sorry I could not load this data for now.";
    let ingredients = "Sorry I could not load this data for now.";

    if (meals[0].nutrition_info) {
      try {
        const nutritionInfo = JSON.parse(meals[0].nutrition_info);
        generalInfo = nutritionInfo.general_info || "Sorry I could not load this data for now.";
        ingredients = Array.isArray(nutritionInfo.ingredients)
          ? nutritionInfo.ingredients.join(", ")
          : "Sorry I could not load this data for now.";
      } catch (err) {
        console.error("Error parsing nutrition_info JSON:", err);
      }
    }

    // Return the selected meal with additional info
    return {
      mealName: meals[0].meal_name,
      generalInfo,
      ingredients,
      nutritionInfo: meals[0].nutrition_info,
    };
  } catch (err) {
    console.error(err);
    return { message: "Error generating recommendation." };
  }
}


//Initial and latest recommendations



// Function to generate a balanced meal recommendation
async function generateDynamicMealWithAnalysis(email, mealType) {
  try {
    // Fetch user details
    const [userDetails] = await pool.promise().query(
      `SELECT child_age, allergies, health_conditions, favorite_meals FROM dietmaster_members WHERE email = ?`,
      [email]
    );

    if (!userDetails.length) {
      return { message: "User details not found." };
    }

    const { child_age, allergies, health_conditions, favorite_meals } = userDetails[0];

    if (child_age === "No data") {
      return { message: "Please update your child's details first to get meal recommendations." };
    }

    // Analyze the last week's recommendations
    const [pastRecommendations] = await pool.promise().query(
      `SELECT meal_name, meal_type, recommendation_date 
       FROM recommendations 
       WHERE email = ? 
       AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      [email]
    );

    // Prepare filtering conditions
    let allergyConditions = "1=1"; // Allow all by default
    if (allergies !== "No data" && allergies) {
      allergyConditions = allergies
        .split(",")
        .map((allergy) => `nutrition_info NOT LIKE '%${allergy.trim().replace(" ", "_")}%'`)
        .join(" AND ");
    }

    let healthConditionConditions = "1=1"; // Allow all by default
    if (health_conditions !== "No data" && health_conditions) {
      healthConditionConditions = health_conditions
        .split(",")
        .map((condition) => `nutrition_info LIKE '%${condition.trim().replace(" ", "_")}%'`)
        .join(" OR ");
    }

    let favoriteCondition = "1=1"; // Allow all by default
    if (favorite_meals !== "No data" && favorite_meals) {
      favoriteCondition = favorite_meals
        .split(",")
        .map((meal) => `meal_name LIKE '%${meal.trim().replace(" ", "_")}%'`)
        .join(" OR ");
    }

    let ageCondition = "1=1"; // Default for all ages
    if (child_age === "Less than 1 Year old") {
      // Infants should only get lighter foods like porridge, etc.
      ageCondition = "meal_type IN ('breakfast', 'lunch') AND nutrition_info NOT LIKE '%sima%' AND nutrition_info NOT LIKE '%githeri%'";
    } else if (child_age === "1 Year old") {
      // 1-year-olds can have lighter meals, but avoid heavy foods
      ageCondition = "meal_type IN ('breakfast', 'lunch') AND nutrition_info NOT LIKE '%sima%' AND nutrition_info NOT LIKE '%githeri%'";
    }

    // Check for previously recommended meals for today
    const [recommendedMealsToday] = await pool.promise().query(
      `SELECT meal_name, meal_type FROM recommendations WHERE email = ? AND DATE(recommendation_date) = CURDATE()`,
      [email]
    );

    const recommendedMealNames = recommendedMealsToday.map((meal) => meal.meal_name);

    // Handle the case when no meals are recommended yet today
    let query;
    let params;

    // If we have meals already recommended today, exclude those meals for each meal type
    if (recommendedMealNames.length > 0) {
      query = `
        SELECT * FROM meals
        WHERE meal_type = ?
        AND meal_name NOT IN (${recommendedMealNames.map(() => '?').join(',')})
        AND ${allergyConditions}
        AND ${healthConditionConditions}
        AND ${favoriteCondition}
        AND ${ageCondition}
        ORDER BY 
          CASE 
            WHEN ${favoriteCondition} THEN 1
            ELSE 2
          END,
          RAND()
        LIMIT 1
      `;
      params = [mealType, ...recommendedMealNames];
    } else {
      // If no recommended meals, just apply the filters
      query = `
        SELECT * FROM meals
        WHERE meal_type = ?
        AND ${allergyConditions}
        AND ${healthConditionConditions}
        AND ${favoriteCondition}
        AND ${ageCondition}
        ORDER BY 
          CASE 
            WHEN ${favoriteCondition} THEN 1
            ELSE 2
          END,
          RAND()
        LIMIT 1
      `;
      params = [mealType];
    }

    // Execute the dynamic query
    const [meals] = await pool.promise().query(query, params);

    if (!meals.length) {
      return { message: "Sorry! We could not find any suitable meal for you right now. This could be as a result of having several allergies or health conditions." };
    }

    // Parse nutrition_info JSON
    let generalInfo = "Sorry I could not load this data for now.";
    let ingredients = "Sorry I could not load this data for now.";

    if (meals[0].nutrition_info) {
      try {
        const nutritionInfo = JSON.parse(meals[0].nutrition_info);
        generalInfo = nutritionInfo.general_info || "Sorry I could not load this data for now.";
        ingredients = Array.isArray(nutritionInfo.ingredients)
          ? nutritionInfo.ingredients.join(", ")
          : "Sorry I could not load this data for now.";
      } catch (err) {
        console.error("Error parsing nutrition_info JSON:", err);
      }
    }

    // Return the selected meal with additional info
    return {
      mealName: meals[0].meal_name,
      generalInfo,
      ingredients,
      nutritionInfo: meals[0].nutrition_info,
    };
  } catch (err) {
    console.error(err);
    return { message: "Error generating recommendation." };
  }
}


// // Function to generate a balanced meal recommendation
// async function generateDynamicMealWithAnalysis(email, mealType) {
//   try {
//     // Fetch user details
//     const [userDetails] = await pool.promise().query(
//       `SELECT child_age, allergies, health_conditions, favorite_meals FROM dietmaster_members WHERE email = ?`,
//       [email]
//     );

//     if (!userDetails.length) {
//       return { message: "User details not found." };
//     }

//     const { child_age, allergies, health_conditions, favorite_meals } = userDetails[0];

//     if (child_age === "No data") {
//       return { message: "Please update your child's details first to get meal recommendations." };
//     }

//     // Fetch meals recommended in the last 7 days
//     const [pastRecommendations] = await pool.promise().query(
//       `SELECT meal_name FROM recommendations WHERE email = ? AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
//       [email]
//     );

//     // Meals already recommended today
//     const [recommendedMealsToday] = await pool.promise().query(
//       `SELECT meal_name FROM recommendations WHERE email = ? AND DATE(recommendation_date) = CURDATE()`,
//       [email]
//     );

//     const recommendedMealNames = recommendedMealsToday.map((meal) => meal.meal_name);

//     // Filtering conditions
//     let allergyConditions = "1=1";
//     if (allergies !== "No data" && allergies) {
//       allergyConditions = allergies
//         .split(",")
//         .map((allergy) => `nutrition_info NOT LIKE '%${allergy.trim().replace(" ", "_")}%'`)
//         .join(" AND ");
//     }

//     let healthConditionConditions = "1=1";
//     if (health_conditions !== "No data" && health_conditions) {
//       healthConditionConditions = health_conditions
//         .split(",")
//         .map((condition) => `nutrition_info LIKE '%${condition.trim().replace(" ", "_")}%'`)
//         .join(" OR ");
//     }

//     let favoriteCondition = "1=1";
//     if (favorite_meals !== "No data" && favorite_meals) {
//       favoriteCondition = favorite_meals
//         .split(",")
//         .map((meal) => `meal_name LIKE '%${meal.trim().replace(" ", "_")}%'`)
//         .join(" OR ");
//     }

//     let ageCondition = "1=1";
//     if (child_age === "Less than 1 Year old" || child_age === "1 Year old") {
//       ageCondition = "meal_type IN ('breakfast', 'lunch') AND nutrition_info NOT LIKE '%sima%' AND nutrition_info NOT LIKE '%githeri%'";
//     }

//     // Base query
//     let query = `
//       SELECT * FROM meals
//       WHERE meal_type = ?
//       ${recommendedMealNames.length > 0 ? `AND meal_name NOT IN (${recommendedMealNames.map(() => '?').join(',')})` : ""}
//       AND ${allergyConditions}
//       AND (${healthConditionConditions})
//       AND ${favoriteCondition}
//       AND ${ageCondition}
//       ORDER BY 
//         CASE 
//           WHEN ${favoriteCondition} THEN 1
//           WHEN (${healthConditionConditions}) THEN 2
//           ELSE 3
//         END,
//         RAND()
//       LIMIT 1
//     `;

//     let params = recommendedMealNames.length > 0 ? [mealType, ...recommendedMealNames] : [mealType];

//     // Execute query
//     let [meals] = await pool.promise().query(query, params);

//     // **Retry logic with relaxed conditions**
//     if (!meals.length) {
//       console.log("No exact match found. Relaxing conditions...");

//       query = `
//         SELECT * FROM meals
//         WHERE meal_type = ?
//         AND ${ageCondition}
//         AND ${allergyConditions}
//         ORDER BY 
//           CASE 
//             WHEN (${healthConditionConditions}) THEN 1
//             ELSE 2
//           END,
//           RAND()
//         LIMIT 1
//       `;

//       [meals] = await pool.promise().query(query, [mealType]);
//     }

//     // **Final fallback: return any meal of the correct type**
//     if (!meals.length) {
//       console.log("Still no match found. Returning any available meal.");
//       query = `SELECT * FROM meals WHERE meal_type = ? ORDER BY RAND() LIMIT 1`;
//       [meals] = await pool.promise().query(query, [mealType]);
//     }

//     if (!meals.length) {
//       return { message: "No meals available at this time. Please try again later." };
//     }

//     // Parse nutrition_info JSON
//     let generalInfo = "N/A";
//     let ingredients = "N/A";

//     if (meals[0].nutrition_info) {
//       try {
//         const nutritionInfo = JSON.parse(meals[0].nutrition_info);
//         generalInfo = nutritionInfo.general_info || "N/A";
//         ingredients = Array.isArray(nutritionInfo.ingredients)
//           ? nutritionInfo.ingredients.join(", ")
//           : "N/A";
//       } catch (err) {
//         console.error("Error parsing nutrition_info JSON:", err);
//       }
//     }

//     return {
//       mealName: meals[0].meal_name,
//       generalInfo,
//       ingredients,
//       nutritionInfo: meals[0].nutrition_info,
//     };
//   } catch (err) {
//     console.error(err);
//     return { message: "Error generating recommendation." };
//   }
// }



// Endpoint to get meal recommendations
app.get("/recommend/:mealType", async (req, res) => {
  const { mealType } = req.params;
  const email = req.session.email;

  try {
    // Fetch today's recommendation
    const [existingRecommendation] = await pool.promise().query(
      `SELECT meal_name, general_info, ingredients 
       FROM recommendations 
       WHERE email = ? AND meal_type = ? AND DATE(recommendation_date) = CURDATE()`,
      [email, mealType]
    );

    if (existingRecommendation.length) {
      const { meal_name, general_info, ingredients } = existingRecommendation[0];
      return res.json({
        mealType,
        mealName: meal_name,
        generalInfo: general_info || "Sorry I could not load this data for now.",
        ingredients: ingredients || "Sorry I could not load this data for now.",
        description: `I suggest you feed your child ${meal_name} for ${mealType} today.`,
        description2: `${general_info || "Sorry I could not load this data for now."}`,
        description3: `${ingredients || "Sorry I could not load this data for now."}`,
      });
    }

    // Generate a new recommendation if none exists
    const meal = await generateDynamicMealWithAnalysis(email, mealType);

    if (meal.message) {
      return res.json({ message: meal.message });
    }

    // Insert the new recommendation into the database
    await pool.promise().query(
      `INSERT INTO recommendations (email, meal_type, meal_name, general_info, ingredients, recommendation_date) 
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [email, mealType, meal.mealName, meal.generalInfo, meal.ingredients]
    );

    res.json({
      mealType,
      mealName: meal.mealName,
      generalInfo: meal.generalInfo,
      ingredients: meal.ingredients,
      nutritionInfo: meal.nutritionInfo,
      description: `I suggest you feed your child ${meal.mealName} for ${mealType} today.`,
      description2: `${meal.generalInfo}`,
      description3: `${meal.ingredients}`,
    });
  } catch (err) {
    console.error("Error in /recommend/:mealType:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// Helper function to parse meals from comma-separated data
const parseMealData = (rawMeals) => {
  if (!rawMeals || rawMeals === 'No data') return [];
  return rawMeals.split(',').map(meal => meal.trim().replace(/_/g, ' '));
};  



app.get('/analysis/weekly', async (req, res) => {
  const email = req.session.email;
  const keywords = ["Carbohydrates", "Proteins", "Vitamins", "Fats", "Energy", "Sugar", "Omega"];
  const rdi = { Carbohydrates: 50, Proteins: 20, Vitamins: 20, Fats: 10 }; // Mock RDI percentages
  
  try {
    const [mealData, analysisData] = await Promise.all([
      pool.promise().query(
        `SELECT 
           meal_name, 
           recommendation_date, 
           COUNT(*) AS meal_count
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
         GROUP BY meal_name, recommendation_date
         ORDER BY recommendation_date DESC`,
        [email]
      ),
      pool.promise().query(
        `SELECT general_info, recommendation_date
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
         ORDER BY recommendation_date DESC`,
        [email]
      ),
    ]);

    if (mealData[0].length === 0 || analysisData[0].length === 0) {
      return res.json({ noData: true });
    }

    // Meal Data Processing
    mealData[0].forEach(row => {
      row.meal_name = parseMealData(row.meal_name); // Apply your function here
    });

    const mealGroupedByDate = mealData[0].reduce((acc, row) => {
      const { meal_name, meal_count, recommendation_date } = row;
      const formattedDate = formatDate(recommendation_date); // Format the date here
      if (!acc[formattedDate]) acc[formattedDate] = {};
      acc[formattedDate][meal_name] = meal_count;
      return acc;
    }, {});

    const dates = Object.keys(mealGroupedByDate);
    const mealNames = [...new Set(mealData[0].map(item => item.meal_name))];
    const mealCounts = mealNames.map(meal =>
      dates.map(date => (mealGroupedByDate[date][meal] || 0))
    );

    const chartData = {
      labels: dates, // Use the formatted dates here
      datasets: mealCounts.map((counts, index) => ({
        label: mealNames[index],
        data: counts,
        backgroundColor: `hsl(${(index * 50) % 360}, 70%, 60%)`, // Different colors for bars
      })),
    };

    // Nutrition Data Processing (analysisData)
    const nutritionStats = keywords.reduce((acc, nutrient) => {
      acc[nutrient] = 0;
      return acc;
    }, {});

    analysisData[0].forEach(row => {
      keywords.forEach(nutrient => {
        if (row.general_info.includes(nutrient)) {
          nutritionStats[nutrient] += 1;
        }
      });
    });

    const totalMeals = analysisData[0].length;
    const nutritionPercentages = Object.keys(nutritionStats).map(nutrient => ({
      nutrient,
      percentage: ((nutritionStats[nutrient] / totalMeals) * 100).toFixed(2),
      target: rdi[nutrient] || 0,
    }));

    res.json({ chartData, nutritionPercentages });

  } catch (err) {
    console.error('Error fetching weekly analysis:', err);
    res.status(500).json({ message: 'Error fetching data for weekly analysis' });
  }
});

// Helper function to format the date in 'Day dd/yyyy' format
const formatDate = (date) => {
  const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('en-US', options);
};






app.get('/analysis/monthly', async (req, res) => {
  const email = req.session.email;
  const keywords = ["Carbohydrates", "Proteins", "Vitamins", "Fats", "Energy", "Sugar", "Omega"];
  const rdi = { Carbohydrates: 50, Proteins: 100, Vitamins: 120, Fats: 10 }; // Mock RDI percentages
  
  try {
    const [mealData, analysisData] = await Promise.all([
      pool.promise().query(
        `SELECT 
           meal_name, 
           COUNT(*) AS meal_count, 
           DATE_FORMAT(recommendation_date, '%Y-%m') AS month
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
         GROUP BY meal_name, month
         ORDER BY month DESC`,
        [email]
      ),
      pool.promise().query(
        `SELECT general_info, DATE_FORMAT(recommendation_date, '%Y-%m') AS month
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
         ORDER BY month DESC`,
        [email]
      ),
    ]);

    if (mealData[0].length === 0 || analysisData[0].length === 0) {
      return res.json({ noData: true });
    }

    // Meal Data Processing
    mealData[0].forEach(row => {
      row.meal_name = parseMealData(row.meal_name); // Apply your function here
    });

    const mealGroupedByMonth = mealData[0].reduce((acc, row) => {
      const { meal_name, meal_count, month } = row;
      const formattedMonth = formatMonthYear(month); // Convert to 'Month Year'
      if (!acc[formattedMonth]) acc[formattedMonth] = {};
      acc[formattedMonth][meal_name] = meal_count;
      return acc;
    }, {});

    const months = Object.keys(mealGroupedByMonth);
    const mealNames = [...new Set(mealData[0].map(item => item.meal_name))];
    const mealCounts = mealNames.map(meal =>
      months.map(month => (mealGroupedByMonth[month][meal] || 0))
    );

    const chartData = {
      labels: months, // Use the formatted months here
      datasets: mealCounts.map((counts, index) => ({
        label: mealNames[index],
        data: counts,
        backgroundColor: `hsl(${(index * 50) % 360}, 70%, 60%)`, // Different colors for bars
      })),
    };

    // Nutrition Data Processing (analysisData)
    const nutritionStats = keywords.reduce((acc, nutrient) => {
      acc[nutrient] = 0;
      return acc;
    }, {});

    analysisData[0].forEach(row => {
      keywords.forEach(nutrient => {
        if (row.general_info.includes(nutrient)) {
          nutritionStats[nutrient] += 1;
        }
      });
    });

    const totalMeals = analysisData[0].length;
    const nutritionPercentages = Object.keys(nutritionStats).map(nutrient => ({
      nutrient,
      percentage: ((nutritionStats[nutrient] / totalMeals) * 100).toFixed(2),
      target: rdi[nutrient] || 0,
    }));

    res.json({ chartData, nutritionPercentages });

  } catch (err) {
    console.error('Error fetching monthly analysis:', err);
    res.status(500).json({ message: 'Error fetching data for monthly analysis' });
  }
});

// Helper function to convert 'YYYY-MM' to 'Month Year'
const formatMonthYear = (monthYear) => {
  const [year, month] = monthYear.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};





app.get('/analysis/yearly', async (req, res) => {
  const email = req.session.email;
  const keywords = ["Carbohydrates", "Proteins", "Vitamins", "Fats", "Energy", "Sugar", "Omega"];
  const rdi = { Carbohydrates: 50, Proteins: 20, Vitamins: 20, Fats: 10 }; // Mock RDI percentages
  
  try {
    const [mealData, analysisData] = await Promise.all([
      pool.promise().query(
        `SELECT 
           meal_name, 
           COUNT(*) AS meal_count, 
           YEAR(recommendation_date) AS year
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
         GROUP BY meal_name, year
         ORDER BY year DESC`,
        [email]
      ),
      pool.promise().query(
        `SELECT general_info, YEAR(recommendation_date) AS year
         FROM recommendations
         WHERE email = ?
         AND recommendation_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
         ORDER BY year DESC`,
        [email]
      ),
    ]);

    if (mealData[0].length === 0 || analysisData[0].length === 0) {
      return res.json({ noData: true });
    }

    // Meal Data Processing
    mealData[0].forEach(row => {
      row.meal_name = parseMealData(row.meal_name); // Applying the function here
    });

    const mealGroupedByYear = mealData[0].reduce((acc, row) => {
      const { meal_name, meal_count, year } = row;
      if (!acc[year]) acc[year] = {};
      acc[year][meal_name] = meal_count;
      return acc;
    }, {});

    const years = Object.keys(mealGroupedByYear);
    const mealNames = [...new Set(mealData[0].map(item => item.meal_name))];
    const mealCounts = mealNames.map(meal =>
      years.map(year => (mealGroupedByYear[year][meal] || 0))
    );

    const chartData = {
      labels: years,
      datasets: mealCounts.map((counts, index) => ({
        label: mealNames[index],
        data: counts,
        backgroundColor: `hsl(${(index * 50) % 360}, 70%, 60%)`, // Bars will have different colors
      })),
    };

    // Nutrition Data Processing (analysisData)
    const nutritionStats = keywords.reduce((acc, nutrient) => {
      acc[nutrient] = 0;
      return acc;
    }, {});

    analysisData[0].forEach(row => {
      keywords.forEach(nutrient => {
        if (row.general_info.includes(nutrient)) {
          nutritionStats[nutrient] += 1;
        }
      });
    });

    const totalMeals = analysisData[0].length;
    const nutritionPercentages = Object.keys(nutritionStats).map(nutrient => ({
      nutrient,
      percentage: ((nutritionStats[nutrient] / totalMeals) * 100).toFixed(2),
      target: rdi[nutrient] || 0,
    }));

    res.json({ chartData, nutritionPercentages });

  } catch (err) {
    console.error('Error fetching yearly analysis:', err);
    res.status(500).json({ message: 'Error fetching data for yearly analysis' });
  }
});







// History endpoint
app.get("/history", async (req, res) => {
  const email = req.session.email;

  try {
    const [history] = await pool.promise().query(
      `SELECT meal_type, meal_name, recommendation_date 
       FROM recommendations WHERE email = ? ORDER BY recommendation_date DESC`,
      [email]
    );

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.post("/schedule-meals", async (req, res) => {
  if (!req.session.email) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { meals } = req.body; // Expecting an array of meals
  const email = req.session.email; // Get email from session

  if (!meals || meals.length === 0) {
      return res.status(400).json({ message: "No meals provided" });
  }

  try {
      const values = meals.map(meal => [email, meal.date, meal.meal_type, meal.meal_name]);

      const sql = "INSERT INTO meal_schedule (email, meal_date, meal_type, meal_name) VALUES ?";
      await pool.promise().query(sql, [values]);

      res.json({ message: "Meals scheduled successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database error" });
  }
});


app.get("/scheduled-meals", async (req, res) => {
  if (!req.session.email) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const email = req.session.email; // Get email from session

  try {
      const [meals] = await pool.promise().query(
          "SELECT id, meal_date, meal_type, meal_name FROM meal_schedule WHERE email = ? ORDER BY meal_date ASC",
          [email]
      );

      res.json(meals);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database error" });
  }
});


app.post("/delete-scheduled-meal", async (req, res) => {
  if (!req.session.email) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { meal_id } = req.body;
  const email = req.session.email; // Get email from session

  if (!meal_id) {
      return res.status(400).json({ message: "Meal ID is required" });
  }

  try {
      const [result] = await pool.promise().query(
          "DELETE FROM meal_schedule WHERE id = ? AND email = ?",
          [meal_id, email]
      );

      if (result.affectedRows > 0) {
          res.json({ message: "Meal deleted successfully!" });
      } else {
          res.status(404).json({ message: "Meal not found!" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database error" });
  }
});




// Add a new meal to the database
app.post('/add-meal', async (req, res) => {
  const { meal_name, meal_type, nutrition_info } = req.body;

  try {
     // Check if the email already exists
    const getavailableMeals = `SELECT * FROM meals WHERE meal_name = ?`;
    const [availablemealresults] = await pool.promise().execute(getavailableMeals, [meal_name]);

    if (availablemealresults.length > 0) {
      return res.status(400).json({ error: 'This meal already exists.' });
    }
    // Insert new meal into the database Your fresh recommendation
    await pool.promise().query(
      `INSERT INTO meals (meal_name, meal_type, nutrition_info) VALUES (?, ?, ?)`,
      [meal_name, meal_type, nutrition_info]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding meal:", err);
    res.json({ success: false });
  }
});



// Route to handle the form submission
app.post('/add-meal2', async (req, res) => {
  const { meal_name, meal_type, nutrition_info } = req.body;

  // Ensure nutrition_info is a valid JSON object (just in case)
  let nutritionInfo;
  try {
    nutritionInfo = JSON.parse(nutrition_info);
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid nutrition info format.' });
  }

  const { general_info, ingredients } = nutritionInfo;

  try {
    // Insert the data into the meals table
    const query = `
      INSERT INTO meals (meal_name, meal_type, nutrition_info)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.promise().query(query, [meal_name, meal_type, JSON.stringify(nutritionInfo)]);

    // Return a success response
    res.json({ success: true, message: 'Meal added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding meal to database.' });
  }
});

// Delete a meal from the database
app.delete('/delete-meal', async (req, res) => {
  const { meal_name } = req.body;

  try {
    // Delete meal from the database
    const [result] = await pool.promise().query(
      `DELETE FROM meals WHERE meal_name = ?`,
      [meal_name]
    );

    if (result.affectedRows === 0) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.json({ success: false });
  }
});


// Notifications

app.get('/unreadNotificationsCount', (req, res) => {
  // const { username } = req.query;
  const email = req.session.email;

  pool.query(
      'SELECT COUNT(*) AS unreadCount FROM notifications WHERE recipient_username = ? AND is_read = 0',
      [email],
      (error, results) => {
          if (error) {
              console.error('Error fetching unread notifications count:', error);
              return res.status(500).json({ success: false, message: 'Error fetching unread notifications count' });
          }
          res.json({ success: true, unreadCount: results[0].unreadCount });
      }
  );
});


app.get('/getNotifications', (req, res) => {
  // const { username } = req.query;
  const email = req.session.email;

  pool.query(
      'SELECT id, message, is_read, timestamp FROM notifications WHERE recipient_username = ? ORDER BY timestamp DESC',
      [email],
      (error, results) => {
          if (error) {
              console.error('Error fetching notifications:', error);
              return res.status(500).json({ success: false, message: 'Error fetching notifications' });
          }
          res.json({ success: true, notifications: results });
      }
  );
});

app.get('/getGeneralNotifications', (req, res) => {
  pool.query(
      'SELECT id, message, is_read, timestamp FROM general_notifications ORDER BY timestamp DESC',
      (error, results) => {
          if (error) {
              console.error('Error fetching general notifications:', error);
              return res.status(500).json({ success: false, message: 'Error fetching general notifications' });
          }
          res.json({ success: true, notifications: results });
      }
  );
});

app.post('/markAsRead', (req, res) => {
  const { notificationId, isGeneral } = req.body;
  const table = isGeneral ? 'general_notifications' : 'notifications';
  
  pool.query(
      `UPDATE ${table} SET is_read = 1 WHERE id = ?`,
      [notificationId],
      (error, results) => {
          if (error) {
              console.error('Error marking notification as read:', error);
              return res.status(500).json({ success: false, message: 'Error marking notification as read' });
          }
          res.json({ success: true, message: 'Notification marked as read' });
      }
  );
});







    

    app.get('/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          return res.send('Error logging out.');
        }
        res.redirect('/userlogin');
      });
    });
    // Start the server ELECT username, email, health_conditions,
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
