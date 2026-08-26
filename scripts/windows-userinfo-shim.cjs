const os=require("node:os");
const original=os.userInfo;
os.userInfo=(options)=>{
    try{return original(options);}catch{return{username:process.env.USERNAME||"user",uid:-1,gid:-1,shell:null,homedir:process.env.USERPROFILE||process.cwd()};}
};
