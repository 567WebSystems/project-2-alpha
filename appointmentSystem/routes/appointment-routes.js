const router = require('express').Router();
const mongoose = require('mongoose');

const gcalFunction = require('../controllers/gcalendar');
const Event = require('../models/event_model');

var calendarData = {};
var startDateObj = "text";
var endDateObj = "text";


const authCheck = (req,res, next) =>{
    if(!req.user){
        // if user is not logged in
        res.redirect('/');
    }else{
        next();
    }
};

router.get('/',authCheck,(req,res)=>{
    res.render('appointment',{user:req.user.userName});
    gcalFunction.listEvent();
});

    // return gapi.client.calendar.calendarList.list({})
    //   .then(function(response) {
    //           // Handle the results here (response.result has the parsed body).
    //           console.log("Response", response);
    //         },
    //         function(err) { console.error("Execute error", err); });
});

router.get('/view-appointment',authCheck,(req,res)=>{
  gcalFunction.listEvent();
  res.render('view-appointment',{user:req.user.userName});
});

router.post("/", function(req, res){
    let rb = req.body;
  
    startDateObj = new Date(rb.startDate + " " + rb.startTime);
    endDateObj = new Date(rb.endDate + " " + rb.endTime);

  
    //console.log("startDateObj is: " + startDateObj);
    //console.log("endDateObj is: " + endDateObj);
  
    const event = new Event({ // parse event
      _id: mongoose.Types.ObjectId(),
      summary: rb.summary,
      location: rb.location,
      description: rb.description,
      start: startDateObj,
      end: endDateObj,
      recurrence: rb.recurrence,
      attendees: rb.attendees,
      reminders: rb.reminders,
    });
  
    console.log("event is: " + event)
    console.log("Attempting to store in db...")
    return event.save() // store event in db
  
    .then(result => {
      console.log(result); // display stored event
     // res.status(201).json({
      var status = {
        message: 'Event stored to DB.',
      }
  
     console.log("status: " + status.message)
  
   calendarData = {
      _id: mongoose.Types.ObjectId(),
      'summary': rb.summary,
      'location': rb.location,
      'description': rb.description,
      'start': startDateObj,
      'end': endDateObj,
      'recurrence': rb.recurrence,
      'attendees': rb.attendees,
      'reminders': rb.reminders
   }
  
    console.log(calendarData);
    gcalFunction.insEvent(calendarData);
    res.render('appointment');  
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
    });
  
      
  });

router.delete('/',authCheck,(req,res)=>{
  console.log("On delete route...")
  // return gapi.client.calendar.calendarList.delete({})
  // .then(function(response) {
  //         // Handle the results here (response.result has the parsed body).
  //         console.log("Response", response);
  //     },
  //     function(err) { console.error("Execute error", err); });
});

module.exports = router;