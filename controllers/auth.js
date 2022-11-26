import mysql from 'mysql'
import {configDb} from '../configDb.js'
import bcrypt from 'bcryptjs'
import {upload,removeFromCloud} from '../myCloudinary.js'
import fs from 'fs'

const db=mysql.createConnection(configDb)

db.connect((err)=> {
    if (err) 
      return console.log('kapcsolódási hiba:' + err.message);
  });

 
const saltRounds=10

export const register=(req,res)=>{
    console.log('post....',req.body)
    const {username,email,password}=req.body
    bcrypt.hash(password,saltRounds,(err,hashedPw)=>{
        if(err)  res.send({error:err})
        else{
            db.query('insert into users (username,email,password) values (?,?,?)',
                [username,email,hashedPw],(err,result) => {
                    if(err) {
                        console.log('insert error:',err)
                        res.send({message:`Error-insert:${err}`})
                    }
                    if(result){
                        console.log('Sikeres insert!',result.insertId)
                        res.send({message:'Sikeres regisztráció!',id:result.insertId})
                    }
                })
             }  //else
    })//bcrypt
}
//ideiglenes login:
/*export const login=(req,res)=>{
    console.log('post....',req.body)
    const {username,password} = req.body
    db.query('select count(*) nr from users where username=? and password=?',[username,password],(err,result) => {
        if(err) console.log(err)
        else{
            //console.log(result[0].nr)
            res.send({rowCount:result[0].nr,username:username})
        }
            
    })

}*/


export const login=(req,res)=>{
    console.log('post....',req.body)
    const {username,password} = req.body
    db.query('select id,password,username,email,status,avatar,avatar_id from users where username=?',[username],(err,result) => {
        if(err)
            res.send({"error":err})
        //console.log(result.length)
        if(result.length==1){
            //console.log(result[0])
            bcrypt.compare(password,result[0].password,
                (error,resultCompare) => {
                    if(resultCompare)           
                            res.send({  username:username,
                                        userId:result[0].id,
                                        email:result[0].email,
                                        avatar:result[0].avatar,
                                        avatar_id:result[0].avatar_id})   
                    else
                        res.status(401).send({error:"hibás email/felhasználónév/jelszó páros!"})
                })
        }else{
            console.log(result)
            res.status(401).send({error:"nem létező email/felhasználónév cím!"})
        }
            
    })
}

export const checkUsername=(req,res)=>{
    console.log('post....',req.body)
    const {username} = req.body
    db.query('select count(*) nr from users where username=?',[username],(err,result) => {
        if(err)
            res.send({error:err})
        else
            res.send({rowCount:result[0].nr})   
        })
    }

export const checkEmail=(req,res)=>{
    console.log('post....',req.body)
    const {email} = req.body
    db.query('select count(*) nr from users where email=?',[email],(err,result) => {
        res.send({rowCount:result[0].nr})
    })
}

export const updateAvatar=async (req,res) => {
    const {username,avatar_id} = req.body;
    if(req.files){
        //console.log(req.files)
        const {selFile}=req.files
        const cloudFile = await upload(selFile.tempFilePath);
        //console.log('cloudfile:',cloudFile)
        db.query('update users set avatar=?,avatar_id=?  where username=?',[cloudFile.url,cloudFile.public_id,username],
            (err, result)=>{
                if(err){
                    res.send({message:`Nem sikerült az adat módosítása!-${err}`})
                }
                if(result){
                    removeTmp(selFile.tempFilePath)//sikeres feltöltés esetén, a temporális fájlok törlése
                    removeFromCloud(avatar_id)
                    res.send({message:`Sikeres módosítás!`,avatar:cloudFile.url,avatar_id:cloudFile.public_id})
                }
            })
    }
}


const removeTmp = path => {
    console.log('a törlendő temporális fájl:', path)
    fs.unlink(path, err => {
      if (err) throw err;
    });
  };

  export const deleteUser=async (req,res) => {
    const {username}=req.params
    console.log('szerver oldal-a törlendő felhasználó:', username)
  }