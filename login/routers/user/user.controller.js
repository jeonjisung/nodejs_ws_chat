const {User} = require('../../models')

let join = (req,res)=>{
    res.render('./user/join.html');
}

let join_success = async(req,res)=>{
    let userid = req.body.userid
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userrrn = req.body.userrrn;
    let gender = req.body.gender;

    await User.create({
        userid,userpw,username, userrrn, gender
    })

    res.render('./user/join_success.html',{
        userid, userpw, username, userrrn, gender
    });
}

let login = (req,res)=>{
    res.render('./user/login.html');
}

let login_check = async (req,res)=>{
    let userid = req.body.userid;
    let userpw = req.body.userpw;

    let result = await User.findOne({
        where:{userid, userpw}
    })

    req.session.uid = userid;
    req.session.isLogin = true;

    req.session.save(()=>{
        res.redirect('/user/join_success.html');
    })
}

let logout = (req,res)=>{
    delete req.session.isLogin;
    delete req.session.uid;

    req.session.save(()=>{
        res.redirect('/');
    })
}

let info = async (req,res)=>{
    let result = await User.findAll({});

    res.render('./user/info.html', {
        result,
    })
    console.log(result);
}

module.exports ={
    join, join_success, login, login_check, logout, info
}