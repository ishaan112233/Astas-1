const express = require('express');
const router = express.Router();
const ctrlmain = require('../controllers/main');
const methodOverride = require('method-override');

router.use(methodOverride('_method'))

router.get('/',function(req,res,next){
    res.render('index');
    // next();
});
router.post('/otp',ctrlmain.otp);
router.post('/otp1',ctrlmain.otp1);
router.get('/faculty',function(req,res,next){
    res.render('Faculty_login');
    // next();
});
router.get('/logout',function(req,res){
    res.redirect('/');
    });
router.get('/stu_timetable',function(req,res,next){
    res.render('timetable');
    // next();
});
router.post('/list-of-faculties/search',ctrlmain.search);
router.post('/findtable',ctrlmain.findtable);
// router.post('/teacher_page',ctrlmain.teacher);
//     // res.render('teacher');
//     // next();
// // });
// router.post('/HOD',ctrlmain.hod);
//     // res.render('HOD');
//     // next();
// // });
router.get('/make-timetable',function(req,res,next){
    res.render('timetable');
    // next();
});

router.get('/request',function(req,res,next){
    res.render('Request');
});
router.post('/faculties',ctrlmain.verifyOtp);
router.get('/notice-upload',(req,res,next)=>{
    res.render('notice_upload');
})

router.post('/notice-data',(req,res,next)=>{
   res.send('ok');
})
router.post('/showtimetable', ctrlmain.sendtimetable);
router.get('/showtimetable/:id', ctrlmain.findtimetable);
router.get('/moderator',(req,res)=>{
     res.render('moderator');
})

router.get('/list-of-faculties',ctrlmain.showAllFaculties);

router.post('/list-of-faculties',ctrlmain.facultiesList)

router.get('/list-of-faculties/edit/:id',ctrlmain.editFaculties);

router.put('/list-of-faculties/:id',ctrlmain.updateFaculties)

router.delete('/list-of-faculties/:id',ctrlmain.removeFaculties);

module.exports = router;
