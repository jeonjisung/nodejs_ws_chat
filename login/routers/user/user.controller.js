const {User} = require('../../models');
// const { findAll } = require('../../models/user');

let join = (req,res)=>{
    res.render('./user/join.html');
}

let join_success = async (req,res)=>{
    let userid = req.body.userid
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userrrn = req.body.userrrn;
    let gender = req.body.gender;

    await User.create({
        userid, userpw, username, userrrn, gender
    })

    res.render('./user/join_success.html',{
        userid, userpw, username, userrrn, gender
    });
}

let login = (req,res)=>{
    let flag = req.query.flag;
    res.render('./user/login.html',{flag});
}

let login_check = async (req,res)=>{
    let userid = req.body.userid;
    let userpw = req.body.userpw;

    let result = await User.findOne({
        where:{userid, userpw}
    })
    console.log(result);

    if(result == null){
        res.redirect('/user/login?flag=0')
    }else{

    req.session.uid = userid;
    req.session.isLogin = true;

    req.session.save(()=>{
        res.redirect('/');
    })
    }
}

let logout = (req,res)=>{
    delete req.session.isLogin;
    delete req.session.uid;

    req.session.save(()=>{
        res.redirect('/');
    })
}

let info = async (req, res) => {
    let userid = req.query.userid;
    let result = await User.findAll({
        wher:{userid,}
    });

    console.log(result);
    res.render('./user/info.html', {result})
    console.log(result);
}

let userid_check = async (req,res)=>{
    
    let userid = req.query.userid;
    let flag = false; //default값 false

    let result = await User.findOne({  //비동기 처리 //query문 결과 받을 때까지 기다렸다가 result 변수에 넣음 
        where:{userid}
    })
        //result - undefined = 값이 없으니 userid 생성 가능 / 
        //result 값이 있으면 생성 불가능  

    if(result==undefined){
        flag = true;
    }else{               // deflaut 값이 false라서 사실 else쪽은 필요없음.
        flag = false;
    }
    res.json({
        login:flag,  //flag BOOLEAN값을 넣어 주기 
        userid,
    })
}

module.exports ={
    join, join_success, login, login_check, logout, info, userid_check,
}