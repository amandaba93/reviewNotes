const express = require('express');
const app = express();
var cors = require('cors');
const port = 5000;
const fs = require('fs');

app.use(cors())

let reviewNotesData = fs.readFileSync('dummy-data-reviewnotes.json');
let usersData = fs.readFileSync('dummy-data-users.json');

let reviewNotes = JSON.parse(reviewNotesData);
let users = JSON.parse(usersData);

//merging the two files
let mergedReviewNotes = reviewNotes.map(note  => {

    //updating assignees with info matching with user id
    note.assignees = note.assignees.map(assignee => {
        let userInfo = users.find(user => user.id === assignee.$oid);
        return {... assignee, name: userInfo.name, photo: userInfo.photo};
    })

    //mapping info of user with reporter 
    let reporterInfo = users.find(user => user.id === note.reporterId.$oid);
    return {... note, 
        reporterId: {...note.reporterId, name: reporterInfo.name, photo: reporterInfo.photo}
    };
})

app.get('/', function (req, res) {
    res.send(mergedReviewNotes);
  })

  app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

