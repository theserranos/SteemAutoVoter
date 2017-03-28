var AccInfo=null 
var r=null;

function CleanNav(){
	$("#marcoaccinfo").hide();
	$("#gethistory").hide();$("#voting").hide();
	$("#Subscribe").hide();
	$("#votbot").hide();
	$("#accinfo").hide();
	$("#inicio").hide();
	
	
}


function showAccountInfo(){
	
      console.log($("#accsearch").val());
     
      $("#accinfo").show();
      var aux = null;

      steem.api.getAccounts([$("#accsearch").val()], function(err, response){

      nomadsteemAccInfo=response[0]; 
            
       for (var key in response[0]){
       	 
       	   if (!key.isArray){
           aux='<tr><td>' + key +'</td><td>' + response[0][key] +'</td></tr>' + aux;
       	   }
        }
       
      $("#cuerpo").html(aux);
       console.log('--------inside ShowAccountInfo');
  })
console.log('------getting account');

}




function vote(){
  console.log('voting');

  var voter="nomadsteem";
  var username="nomadsteem";
  var password=$("#PostKey").val();;
  var author= $("#vauthor").val();//"fisteganos";
  var permlink= r[0].permlink;
  var weight=100;
  

steem.broadcast.vote(password, voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
	//$("#vresponse").val(result);
});
}

 
function CheckVoted(){
//last post by nomadsteem
      steem.api.getDiscussionsByAuthorBeforeDate('nomadsteem', '', '2018-03-20T20:27:30', 1, function(err, r) {
      console.log('---- last '+ err, r);


for (var key in r[0].active_votes){
       	  
       	   if (r[0].active_votes[key].voter=='steemalf'){
           vfound='true';
       	   }
       }

  
  if (vfound!='true'){
  	vote();
  }
    discussions();
  });

	
}




function discussions(){

    

    var categ = $("#Tagfilter").val().split(",");
	var vnumcateg=categ.length;
	var vcatsel=categ[Math.floor((Math.random() *vnumcateg))];
	console.log('===Categ:', vcatsel);

	var query = {tag:vcatsel, limit:"30"}; 

	steem.api.getDiscussionsByCreated(query, function(err, result) {
		var rndpost=Math.floor((Math.random() * 30) + 1);
		console.log('--- post selected :' + rndpost);
		votediscussion(result[rndpost]);
	});
}



function votediscussion(r){
	 console.log('----voting');
	 


  var voter=$("#bvoter").val();
  var username=$("#busername").val();
  var password=$("#PostKey").val();//"";

localStorage.setItem("voter", $("#bvoter").val());
localStorage.setItem("username", $("#busername").val());
localStorage.setItem("PostingKey", $("#PostKey").val());

console.log(localStorage.voter )


  if(!r){
  	console.log ('--noo hay post ');
  	var vfail=$("#votefail")[0].innerText;
  	 $("#votefail")[0].innerText=parseInt(vfail)+1;
  	 		var d = new Date(); var ahora=d.getHours()+': '+ d.getMinutes() + ': ' + d.getSeconds();
  	  document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + ahora +'</td><td>' +'--'
			+ '</td><td>'+ '----' +'</td><td>'+ '-----'+'</td><td  class="alert-danger"' +'">'+ 'error'+'</td><td >'+ 'error' +"</td>");
  	return;
  }

  var author= r.author ;//$("#vvoteauthor").val();//"fisteganos";
  var permlink=r.permlink;// $("#vvoteperm").val();
  var weight= $("#VoteP").val()*100 ; //+Math.floor((Math.random() * 100) + 1);
  

 	wif=password;
	var vres=null;
	var voteresp=null;
	
steem.broadcast.vote(wif, voter, author, permlink, weight, function(err, voteresp) {
	if (err){
			 vres='-- Error : --',err.message;
			console.log('----------',vres);
			var vfail=$("#votefail")[0].innerText;
			   $("#votefail")[0].innerText=parseInt(vfail)+1;
				vcolor='alert-danger'
		}
	else
		{
			console.log('block',voteresp.ref_block_num);
		   vres='bloque : ' + voteresp.ref_block_num;
			vcolor='alert-success'
		}
	
		steem.api.getAccounts([voter], function(err, response){
			console.log('---Accinfo response');
				AccInfo=response[0];
		});
       
        var vp='Not Available';
        if(AccInfo){
        var old_votingPw=AccInfo.voting_power/100;  
        vp=	AccInfo.voting_power/100;
        }        
        var valert="<div class='alert " + vcolor +"'>" + vp + "</div>";
		var d = new Date(); var ahora=d.getHours()+': '+ d.getMinutes() + ': ' + d.getSeconds()
	 document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + ahora +'</td><td>' +r.author 
			+ '</td><td>'+ $("#VoteP").val() +'</td><td>'+ r.permlink+'</td><td  class="alert ' + vcolor +'">'+ vres+'</td><td >'+ vp +"</td>");


			var vsuccess=$("#votesuccess")[0].innerText;

	
	$("#votesuccess")[0].innerText=parseInt(vsuccess)+1;
});

}

 	
	
	



function regvote(){
	CheckVoted();
setTimeout(function(){ regvote(); }, $("#RefreshTime").val()*1000);
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



function Feed(){
	CleanNav();$('#Subscribe').show();
steem.api.getFeedHistory(function(err, result) {
  console.log(err, result);
});
}


function desayuno(food,drink,callback){
	console.log('desayuno '+food + " y "+ drink);
	if(callback && typeof(callback)==="function"){
		callback()
	}
}

function quedes(){
	desayuno('cafe','pan',function(){
	console.log('ya termine de desayunar')});
	if (typeof(Storage) !== "undefined") {
    console.log(' Code for localStorage/sessionStorage.');
} else {
    // Sorry! No Web Storage support..
}
}
