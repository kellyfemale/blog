var express = require('express');
var router = express.Router();
var connection = require('../common/model.js').connection;

/* GET users listing. */
router.get('/', function(req, res, next) {
	connection.query('select count(*) as total from users',function(error,results){
		if(error){
			console.log('查询数据失败',error);
		}else{

			var page={};
			page.every= 3;
			page.pages = Math.ceil(results[0].total/page.every);
			page.now = req.query.p ? Number(req.query.p) : 1;

			page.prev = page.now-1 <1 ? 1 : page.now-1;
			page.next = page.now+1 >page.pages ? page.pages : page.now+1;
			connection.query('select * from users limit '+(page.now-1)*page.every+','+page.every,function(error,results){
				if(error){
					console.log('查询失败',error);
				}else{
					var moment = require('moment');
					res.render('users/index',{results:results,moment:moment,page:page,admin:req.session.admin});
				}
			})
		}
	})
	
});

router.get('/insert',function(req,res){
	res.render('users/insert');
});

router.post('/insert',function(req,res){
	req.body.password = require('../common/common.js').md5(req.body.password);

	req.body.addtime = Math.floor(new Date().getTime()/1000);

	connection.query('insert into users(username,password,age,sex,phone,addtime) values("'+req.body.username+'","'+req.body.password+'",'+req.body.age+','+req.body.sex+',"'+req.body.phone+'","'+req.body.addtime+'")',function(error,results){
		if(error){
			console.log('插入失败',error);
		}else{
			// res.send('插入成功');
			res.redirect('/users');
		}
	})
});

//删除用户
router.get('/delete/:id',function(req,res){
	
	connection.query('delete from users where id='+req.params.id,function(error,results){
		if(error){
			console.log('删除失败',error);
		}else{
			res.redirect('/users');
		}
	})

});
//Ajax删除用户
router.post('/adelete',function(req,res){
	console.log(req.body.id);
	connection.query('delete from users where id='+req.body.id,function(error,results){
		if(error){
			res.json({success:0});
		}else{
			res.json({success:1});
		}
	})

});
//修改用户
router.get('/update/:id',function(req,res){
	connection.query('select * from users where id='+req.params.id,function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
			console.log(results);
			res.render('users/update',{results:results[0]});
		}
	})
});

router.post('/update',function(req,res){
	connection.query('update users set username="'+req.body.username+'", age='+req.body.age+', sex='+req.body.sex+' where id='+req.body.id,function(error,results){
		if(error){
			console.log('更新失败',error);
		}else{
			res.redirect('/users');
		}
	})
});
//添加头像
router.get('/image/:id',function(req,res){
	res.render('users/image',{id:req.params.id});
});

var multer = require('multer');

var upload = multer({
	dest:'public/upload'
})
router.post('/image',upload.single('photo'),function(req,res){
	console.log(req.file);
	/*
		{ fieldname: 'photo',
		  originalname: '641 (5).jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: 'public/upload',
		  filename: '655fad8827e4112a48ab376c53c8e877',
		  path: 'public\\upload\\655fad8827e4112a48ab376c53c8e877',
		  size: 39815 }
	*/

	if(req.file.size > 1024000){
		res.send('文件过大，请重新上传');
	}

	var arr = ['image/png','image/gif','image/jpeg'];
	if(arr.indexOf(req.file.mimetype) === -1){
		res.end('上传的文件不符合类型');
	}

	var fs= require('fs');
	var path = require('path');

	var oldname = path.join('public/upload',req.file.filename);
	var filename = req.file.filename+path.extname(req.file.originalname);

	console.log(filename);
	var newname = path.join('public/upload',filename);
	
	fs.rename(oldname,newname,function(error){
		if(error){
			console.log('修改失败',error);
		}else{
			connection.query('update users set photo="'+filename+'" where id='+req.body.id,function(error,results){
				if(error){
					console.log('修改用户头像数据失败',error);
				}else{
					res.redirect('/users');
				}
			})
		}
	})
});

module.exports = router;
