var express = require('express');
var router = express.Router();
var connection = require('../common/model.js').connection;

/* GET users listing. */
router.get('/', function(req, res, next) {
	connection.query('select count(*) as total from articles',function(error,results){
		if(error){
			console.log('查询条数失败',error);
			
		} else{
			var page={};
			page.every =3;
			page.total = results[0].total;
			
			page.pages = Math.ceil(page.total/page.every);
			console.log(page.pages);
			page.now = req.query.p ? Number(req.query.p) : 1;
			page.prev = page.now-1 <1 ? 1 : page.now-1;
			page.next = page.now+1 >page.pages ? page.pages : page.now+1;
			connection.query('select a.*,t.title as typename  from articles a,types t  where t.id=a.tid order by a.id limit '+(page.now-1)*page.every+','+page.every+'',function(error1,results1){
				if(error1){
					console.log('查询数据失败',error1);
				}else{
					var moment = require('moment');
					res.render('articles/index',{results:results1,moment:moment,page:page,admin:req.session.admin});
				}
			})
		}
	})

	
});

router.get('/insert',function(req,res){
	connection.query('select * from types',function(error,results){
		if(error){
			console.log('查询数据失败',error);
		} else {
			console.log(results);
			res.render('articles/insert',{results:results});
		}
	})
	
});

router.post('/insert',function(req,res){

	req.body.addtime = Math.floor(new Date().getTime()/1000);
	req.body.content = req.body.content.replace(/"/g,'\\"').replace(/\\/g,'/');

	connection.query('insert into articles(tid,title,intro,content,addtime) values('+req.body.tid+',"'+req.body.title+'","'+req.body.intro+'","'+req.body.content+'","'+req.body.addtime+'")',function(error,results){
		if(error){
			console.log('插入失败',error);
		}else{
			// res.send('插入成功');
			res.redirect('/articles');
		}
	})
});

//删除文章
router.get('/delete/:id',function(req,res){
	
	connection.query('delete from articles where id='+req.params.id,function(error,results){
		if(error){
			console.log('删除失败',error);
		}else{
			res.redirect('/articles');
		}
	})

});
//Ajax删除文章
router.post('/adelete',function(req,res){
	
	connection.query('delete from articles where id='+req.body.id,function(error,results){
		if(error){
			res.json({success:0});
		}else{
			res.json({success:1});
		}
	})

});
//修改文章
router.get('/update/:id',function(req,res){
	connection.query('select * from articles where id='+req.params.id,function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
			connection.query('select * from types',function(error,results1){
				if(error){
					console.log('查询数据失败',error);
				} else {
					res.render('articles/update',{data:results1,results:results[0]});
					
				}
			})
		}
	})
});

router.post('/update',function(req,res){
	req.body.content = req.body.content.replace(/"/g,'\\"').replace(/\\/g,'/');
	connection.query('update articles set title="'+req.body.title+'",intro="'+req.body.intro+'",content="'+req.body.content+'" where id='+req.body.id,function(error,results){
		if(error){
			console.log('更新失败',error);
		}else{
			res.redirect('/articles');
		}
	})
});


module.exports = router;
