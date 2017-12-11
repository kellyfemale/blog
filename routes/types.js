var express = require('express');
var router = express.Router();
var connection = require('../common/model.js').connection;

/* GET users listing. */
router.get('/', function(req, res, next) {
	connection.query('select * from types',function(error,results){
		if(error){
			console.log('查询数据失败',error);
		}else{
			var moment = require('moment');
			res.render('types/index',{results:results,moment:moment,admin:req.session.admin});
		}
	})
	
});

router.get('/insert',function(req,res){
	res.render('types/insert',{admin:req.session.admin});
});

router.post('/insert',function(req,res){

	req.body.addtime = Math.floor(new Date().getTime()/1000);

	connection.query('insert into types(title,addtime) values("'+req.body.title+'","'+req.body.addtime+'")',function(error,results){
		if(error){
			console.log('插入失败',error);
		}else{
			// res.send('插入成功');
			res.redirect('/types');
		}
	})
});

//删除类型
router.get('/delete/:id',function(req,res){
	
	connection.query('delete from types where id='+req.params.id,function(error,results){
		if(error){
			console.log('删除失败',error);
		}else{
			res.redirect('/types');
		}
	})

});
//Ajax删除类型
router.post('/adelete',function(req,res){
	
	connection.query('delete from types where id='+req.body.id,function(error,results){
		if(error){
			res.json({success:0});
		}else{
			res.json({success:1});
		}
	})

});
//修改类型
router.get('/update/:id',function(req,res){
	connection.query('select * from types where id='+req.params.id,function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
			console.log(results);
			res.render('types/update',{results:results[0],admin:req.session.admin});
		}
	})
});

router.post('/update',function(req,res){
	connection.query('update types set title="'+req.body.title+'" where id='+req.body.id,function(error,results){
		if(error){
			console.log('更新失败',error);
		}else{
			res.redirect('/types');
		}
	})
});


module.exports = router;
