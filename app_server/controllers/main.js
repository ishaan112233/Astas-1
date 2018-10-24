const mongoose = require('mongoose');
const sendTimetables = mongoose.model('sendTimetables');
const facultyAdd = mongoose.model('addFaculty');
const teacher = mongoose.model('teacher');
const hod = mongoose.model('hod');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('244087AEm1pdREMM5bced951',"Hi, your OTP is {{otp}}, please don't share it with ANYBODY!");
sendOtp.setOtpExpiry('1');
const index = function(req, res){
  res.render('index', { title: 'Routed through Controller main.js' });
};
const sendtimetable = function(req, res) 
{
  let errors = [];
  let data = [];  
    if(!req.body.Stream){
        errors.push({text: 'Please add Stream for which You made timetable'})
    }
    if(!req.body.section){
        errors.push({text:'Please add Section'});
    }
    if(!req.body.Year){
        errors.push({text:'Please add Year of Section'});
    }

    if(errors.length>0){
        res.render('showtable',{
            errors:errors,
            Stream: req.body.Stream,
            section: req.body.section,
            Year: req.body.Year,
            Day:req.body.Day
        });
    }
    else{

        const makeTable = {
          Stream: req.body.Stream,
          section: req.body.section,
          Year: req.body.Year,
          Day:req.body.Day,
          Subject: req.body.Subject,
          Venue: req.body.Venue, 
          id: req.body.section 
        }
      
        sendTimetables.create(
        makeTable,
       (err,sendTimetables) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else { 
            res.render("showtable",{
            data:makeTable
          });
        }
      });
    }
};


const facultiesList = (req,res) =>{
  let faculty = [];
  let data = [];
  const faculties = {
    Femail: req.body.mail,
    Fid:req.body.Fid,
    Fname:req.body.Fname,
    Fsubject:req.body.Fsubject,
    Fcontact:req.body.Fcontact,
    Fposition:req.body.Fposition
} 
  
    new facultyAdd(faculties)
        .save()
        .then(e=>{
          res.redirect('/moderator')
        })
     
};

const showAllFaculties = (req,res) =>{
     facultyAdd.find({})
     .sort()
     .then(staff => {
      res.render('listoffaculties',{
           staff: staff        
      })
     })
}
const otp1 = function(req,res){
  // console.log(req.body.hodmail);
  // console.log(req.params);
  req.session.user = req.body.hodmail;
  facultyAdd.findOne({
    Femail: req.body.hodmail  
  },(err,facultyAdd)=>{
    data = facultyAdd;
    console.log(data.Fposition);
    if(!facultyAdd){
      res
      .status(404)
      .redirect('error');
    }
    if(data.Fposition!=='HOD'){
      res
      .status(404)
      .redirect('error');
    }
    else if(req.session.user){
    
      // else{
          const contactNumber = data.Fcontact;
          const senderId = "KARUPS";
          sendOtp.send(contactNumber, senderId, (err, data, response) => {
          if(err) {
            console.log(err);
            return;
          }
          else{
            res
            .status(201)
            .render('otp');
          }
        });
      }
    // }
  });
};

const editFaculties = (req,res) =>{
  facultyAdd.findOne({
    _id: req.params.id
  })
  .then(faculty =>{
    res.render('editFaculty',{
      faculty:faculty
    })
  })
}

const updateFaculties = (req,res) =>{
   facultyAdd.findOne({
     _id:req.params.id
   })
   .then(faculty => {
    faculty.Femail= req.body.mail;
    faculty.Fid=req.body.Fid;
    faculty. Fname=req.body.Fname;
    faculty.Fsubject=req.body.Fsubject;
    faculty.Fcontact=req.body.Fcontact;
    faculty.Fposition=req.body.Fposition;

    faculty.save()
           .then(faculty => {
             res.redirect('/list-of-faculties')
           })

   })
}
const findtimetable = (req,res)=>{
  // console.log(req.params.id);
  sendTimetables.findOne({
    id: req.params.id
  },(err,sendTimetables)=>{
    data = sendTimetables;
    // console.log(data);
      if(!sendTimetables){
        res
        .status(404)
        .render('error');
      }
      else{
        res
        .status(201)
        .render('showtable',{data});
      }
  })
}
const removeFaculties = (req,res) => {
  facultyAdd.remove({_id:req.params.id})
             .then(()=>{
               res.redirect('/list-of-faculties')
             })
}

// const hod = function(req,res){
//         facultyAdd.findOne({
//           Femail: req.body.hod,
//           // Fposi
//         },(err,facultyAdd)=>{
//           data = facultyAdd;
//           if(!facultyAdd){
//             res
//             .status(400)
//             .redirect('/');
//           }
//           else{
//             if(data.Fposition==='HOD')
//             {
//             res
//               .status(201)
//               .render('HOD',{data:facultyAdd});
//             }
//             else{
//               res
//               .status(404)
//               .redirect('/');
//             }
//           }    
//   });
// };
// const teacher = function(req,res){
//         facultyAdd.findOne({
//           Femail: req.body.teacher
//         },(err,facultyAdd)=>{
//           data = facultyAdd;
//           // console.log(dataF);
//           if(!facultyAdd){
//             res
//             .status(404)
//             .redirect('/');
//           }
//           else{
//             if(data.Fposition!='HOD')
//             {res
//               .status(201)
//               .render('teacher',{data:facultyAdd});
//             }
//             else{
//               res
//               .status(404)
//               .redirect('/');
//             }
//           }
//   });
// };
const otp = function(req,res){
  facultyAdd.findOne({
    Femail: req.body.teacher
  },(err,facultyAdd)=>{
    data = facultyAdd;
    if(data.Fposition==='HOD'){
      res
      .status(404)
      .redirect('error');
    }
    else{
      if(!facultyAdd){
        res
        .status(404)
        .redirect('error');
      }
      else{
          const contactNumber = data.Fcontact;
          const senderId = "KARUPS";
          sendOtp.send(contactNumber, senderId, (err, data, response) => {
          if(err) {
            console.log(err);
            return;
          }
          else{
            res
            .status(201)
            .render('otp');
          }
        });
      }
    }
  });
};

const verifyOtp = function(req,res){
  // console.log(data.Fcontact);
  var contactNumber = data.Fcontact;
  const otp = req.body.otp;
  sendOtp.verify(contactNumber, otp, (err, Vdata) => {
    if(Vdata.type!='success') {
      res
      .status(404)
      .redirect('error');
    }
    else{
      // console.log(data.Fposition);
      if(data.Fposition=='HOD'){
      res
        .status(200)
        .render('HOD');
      }
      else{
        res
          .status(201)
          .render('teacher');
      }
    }
  });
};
const findtable = function(req,res){
  sendTimetables.findOne({
    // Stream: req.body.stream,
    // section: req.body.section,
    // Year: req.body.year,
    id: req.body.section
  },(err,sendTimetables)=>{
    data = sendTimetables;
    if(!data){
      res
      .status(404)
      .render('error');
    }
    else{
      res
      .status(201)
      .redirect('/showtimetable/'+data.section);
    }
  })
};
const search = function(req,res){
  var staff=[];
  // console.log(req.body.search);
  facultyAdd.find({
    Fsubject: req.body.search.toUpperCase()
  },(err,facultyAdd)=>{
    // facultyAdd.Fsubject.split
    staff = facultyAdd;
    // console.log(staff);
    if(staff.length==0){
      res
      .status(404)
      .render('error');
    }
    else{
      res
      .status(201)
      .render('listoffaculties',{staff});
    }
  })
}
module.exports = {
  index,
  sendtimetable,
  facultiesList,
  showAllFaculties,
  editFaculties,
  updateFaculties,
  removeFaculties,
  otp,
  verifyOtp,
  otp1,
  findtable,
  findtimetable,
  search
};
