var AccInfo=null 

function showAccountInfo2(){
	
      console.log($("#accsearch").val());
      $("#marcoaccinfo").show();
      $("#accinfo").show();
      var aux = null;
       steem.api.getAccounts([$("#accsearch").val()], function(err, response){
       	AccInfo=response[0];
            
       for (var key in response[0]){
       	  //$("#cuerpo").append(aux);
       	   if (!key.isArray){
           aux='<tr><td>' + key +'</td><td>' + response[0][key] +'</td></tr>' + aux;
       	   }
       }
       
      $("#cuerpo").html(aux);
  
  })
    }


function getState(){ 
  var aux = null;
  steem.api.getState('/trends/funny', function(err, result) {
	console.log(err, result['props']);
       for (var key in result['props']){
           aux='<tr><td>' + key +'</td><td>' + result['props'][key] +'</td></tr>' + aux;
          console.log('--------- aux ' +aux);;
       }
       console.log('--------- aux ' +aux);
   $("#cuerpogt").show();
   $("#cuerpogt").html(aux);
});

  
}


function getHistory(){
  var aux = null;
	steem.api.getAccountHistory($("#vhistoryccount").val(), 3000,2000 , function(err, result) {
	console.log(err, result);
      for (i = 0; i < result.length; i++){
           aux='<tr><td>' + JSON.stringify(result[i]) +'</td><td>' +'----'+'</td></tr>' + aux;
        //JSON.stringify(result[i][1].op[1]) 
       }
       console.log('--------- aux ' +aux);
   $("#cuerpogt").show();
   $("#cuerpogt").html(aux);
});

  
}





function vote(){
  console.log('voting');
//  var steem = require('steem');
  var voter="nomadsteem";
  var username="nomadsteem";
  var password="5JiZuiBkaGkAyiQxdtxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  var author= $("#vauthor").val();//"fisteganos";
  var permlink= $("#vpostlink").val();;
  var weight=50;
  
var wif = steem.auth.toWif(username, password, 'posting');

	wif=password;
//	  console.log('---pkey' + wif);
steem.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
	$("#vresponse").val(result);
});
}

  


function subscribe(){
	CleanNav();$('#Subscribe').show();

var result=null
var err = null;
var e,r = null;

var devuelta=function (r){
	alert('óoooo');
console.log('----cbaaakkk',e,r);}


function callback (e,result){
	alert('ppp');
console.log('----cbaaakkk222',e,result);}

steem.api.setSubscribeCallback('1', 'false', function(err, result) {
  console.log(err, result);
  callback(err,result);
});
;




}

function Feed(){
	CleanNav();$('#Subscribe').show();
steem.api.getFeedHistory(function(err, result) {
  console.log(err, result);
});
}




function getContentAsync(){
//	CleanNav();$('#Navpruebas').show();
	console.log('----- suth',$('#npauthor').val());
	console.log($('#nppostlink').val());
const resultP = steem.api.getContentAsync($('#npauthor').val(),$('#nppostlink').val());
resultP.then(result => 
						 $('#npresponse').val(result.body)
						
						);
}
  

function CleanNav(){
	$("#marcoaccinfo").hide();$("#gettrend").hide();$("#voting").hide();
	$("#Subscribe").hide();
	$("#votbot").hide();
	$("#accinfo").hide();
	
	
}



function discussions(){
var categ = $("#Tagfilter").val().split(",");
	var vnumcateg=categ.length;
	var vcatsel=categ[Math.floor((Math.random() *vnumcateg))];
	console.log('===Categ:', vcatsel);

	var query = {tag:vcatsel, limit:"30"}; 

steem.api.getDiscussionsByCreated(query, function(err, result) {
	console.log(Math.floor((Math.random() * 30) + 1));

	votediscussion(result[Math.floor((Math.random() * 30) + 1)]);
});
}



function votediscussion(r){
	 console.log('voting');
	 

  var voter=$("#vvoteperm").val();
  var username=$("#vvoteauth").val();
  var password=$("#PostKey").val();//"";
  var author= r.author ;//$("#vvoteauthor").val();//"fisteganos";
  var permlink=r.permlink;// $("#vvoteperm").val();
  var weight= $("#VoteP").val()*100 ; //+Math.floor((Math.random() * 100) + 1);
  
//var wif = steem.auth.toWif(username, password, 'posting');

 	wif=password;
	var vres=null;
	var voteresp=null;
	
steem.broadcast.vote(wif, voter, author, permlink, weight, function(err, voteresp) {
	if (err){
		 vres='-- Error : --',err.message;
		console.log('----------',vres);
		var vfail=$("#votefail")[0].innerText;
           $("#votefail")[0].innerText=parseInt(vfail)+1;
		}
	else
		{
	console.log('block',voteresp.ref_block_num);
   vres='bloque : ' + voteresp.ref_block_num;
		}
	
steem.api.getAccounts([voter], function(err, response){
       	AccInfo=response[0];
});
        var vp='NC';
        if(AccInfo){
        vp=	AccInfo.voting_power
        }        


		var d = new Date(); var ahora=d.getHours()+': '+ d.getMinutes() + ': ' + d.getSeconds()
	 document.getElementById("votedtable").insertRow(1).innerHTML = ('<td>' + ahora +'</td><td>' +r.author 
			+ '</td><td>'+ $("#VoteP").val() +'</td><td>'+ r.permlink+'</td><td>'+ vres+'</td><td>'+ vp +'</td>');
			var vsuccess=$("#votesuccess")[0].innerText;
	
	$("#votesuccess")[0].innerText=parseInt(vsuccess)+1;
});
	
	
	
	
}


function regvote(){
	discussions();
setTimeout(function(){ regvote(); }, $("#RefreshTime").val()*1000);
}

function getComments(){
steem.api.getDiscussionsByComments(['life'], function(err, result) {
  console.log(err, result);
});
}
