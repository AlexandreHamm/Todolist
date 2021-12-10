const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb");
// const axios = require('axios');
// const { createSimpleExpression } = require('@vue/compiler-core');

// TEMPLATE
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


// POINT TOWARDS PUBLIC
app.use(express.static('public'));

//CONNEXION CLIENT MONGODB
MongoClient.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false", { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('todo');
        const prjct = db.collection('projects');
        const tasks = db.collection('tasks');
        let getPrjct = [];
        let getTasks = [];


        //AFFICHAGE LISTES
        //PROJECTS + TASKS

        app.get('/', (req, res) => {



            db.collection('projects').find().sort({ name: 1 }).toArray().then(results => {
                // console.log(results);
                for (i = 0; i < results.length; i++) {
                    getPrjct[i] = results[i];
                }
                // res.render('index.ejs', { prjct: results });



                if (getPrjct.length > 0) {

                    setTimeout(async function() {

                        await db.collection('tasks').find().toArray().then(results => {
                                // console.log(results);
                                for (i = 0; i < results.length; i++) {
                                    getTasks[i] = results[i];
                                }
                                // res.render('index.ejs', { tasks: results });
                            })
                            .catch(error => console.error(error));
                        res.render('index.ejs', {
                            getPrjct: JSON.stringify(getPrjct),
                            getTasks: JSON.stringify(getTasks)
                        });
                    });



                }
            })


        });

        // ADD NEW PROJECT TO DATABASE
        app.post('/newprjct', (req, res) => {
            if (req.body.name != '' && req.body.category != null) {
                prjct.insertOne(req.body)
                    .then(result => {
                        console.log('project test');
                        res.redirect('/')
                    })
                    .catch(error => console.error(error))
                console.log('Nouveau projet créé')
            } else {
                res.json();
            }
        });
        // ADD NEW TASKS TO DATABASE
        app.post('/newtask', (req, res) => {
            tasks.insertOne(req.body)
                .then(result => {
                    console.log('task test');
                    res.redirect('/')
                })
                .catch(error => console.error(error))
            console.log('Nouvelle task créée')
        });

        // UPDATE TASKS

        app.post('/updatetask', (req, res) => {
            let values = {
                    task: req.body.task,
                    prjctID: req.body.prjctID,
                    type: req.body.type
                },
                test = { $set: values };

            tasks.updateOne({ _id: new mongodb.ObjectId(req.body._id.toString()) }, test, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                })
        });


    })
    .catch(error => console.error(error))

// PORT : 3000
app.listen(3000, function() {
        console.log('listening on 3000');
    })
    // npm run dev