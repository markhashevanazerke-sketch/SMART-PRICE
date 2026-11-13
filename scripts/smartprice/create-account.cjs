// Password is read from a process environment variable, never a command line argument.
const e=require('../../lib/smartprice/engine.cjs'),x=require('../../lib/smartprice/extended.cjs');
const [email,role,name]=process.argv.slice(2),password=process.env.SMARTPRICE_ACCOUNT_PASSWORD;
if(!email||!role||!name||!password){console.error('Set SMARTPRICE_ACCOUNT_PASSWORD (12+ characters), then: node scripts/smartprice/create-account.cjs email monitor|analyst|manager "Name"');process.exit(1);}
const db=e.openDatabase();e.seed(db);try{console.log(x.provision(db,{email,password,name,role}));}finally{db.close();}
