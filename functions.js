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
console.log('------getting account ');

}




function vote(vvote){
	//voting for last nomadsteem post'

  console.log('voting ');

  var voter=localstorage.username;
  var password=localStorage.PostingKey;
  var author= vvote.author;
  var permlink= vvote.permlink;
  var weight=100;
  

steem.broadcast.vote(password, voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
	//$("#vresponse").val(result);
});
}

 
function CheckVoted(){
//last post by nomadsteem
      var vfound='false';
      steem.api.getDiscussionsByAuthorBeforeDate('nomadsteem', '', '2018-03-20T20:27:30', 1, function(err, r) {
      console.log('---- last '+ err, r);
      //vfound ='false';

       for (var key in r[0].active_votes){
       	  
       	   if (r[0].active_votes[key].voter=='nomadsteem'){
             vfound='true' ;
      	   }
       }

  
  if (vfound!='true'){
  	vote(r[0]);
  	// discussions();
  } else {
    discussions();
  }
  });

//return	
}



function discussions(){
//Randomly selects one post  

    var categ = $("#Tagfilter").val().split(",");
	var vnumcateg=categ.length;
	var vcatsel=categ[Math.floor((Math.random() *vnumcateg))];
	console.log('===Categ:', vcatsel);

	var query = {tag:vcatsel, limit:"30"}; 

	steem.api.getDiscussionsByCreated(query, function(err, result) {
		var rndpost=Math.floor((Math.random() * 30) + 1);
		console.log('--- post selected :' + rndpost);
		var res=result[rndpost]
		votediscussion(res);
		return;
	});
}



function votediscussion(vpostselected){
	 console.log('----voting');
	 
   	localStorage.setItem("voter", $("#bvoter").val());
	localStorage.setItem("username", $("#busername").val());
	localStorage.setItem("PostingKey", $("#PostKey").val());
	localStorage.setItem("Tags", $("#Tagfilter").val());
	localStorage.setItem("VotingPower", $("#VoteP").val());
	localStorage.setItem("Reftime", $("#RefreshTime").val());


  if(!vpostselected){
  	console.log ('--noo hay post ');
  	var vfail=$("#votefail")[0].innerText;
  	$("#votefail")[0].innerText=parseInt(vfail)+1;
  	var d = new Date(); var ahora=d.getHours()+': '+ d.getMinutes() + ': ' + d.getSeconds();
  	document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + ahora +'</td><td>' +'--'
			+ '</td><td>'+ 'Could not find a random post to vote in ' +'</td><td>'+ '-----'+'</td><td  class="alert-danger"' +'">'+ 'error'+'</td><td >'+ 'error' +"</td>");
  	return;
  }


    var weight= $("#VoteP").val()*100 ; 
    var vres=null;
	var voteresp=null;
	var vp=0;
	
steem.broadcast.vote(localStorage.PostingKey, localStorage.username, vpostselected.author, vpostselected.permlink, weight, function(err, voteresp) {
	if (err){
			vres='-- Error : --'+err.cause.payload.error.data.message;
			console.log('----------'+vres);
			var vfail=$("#votefail")[0].innerText;$("#votefail")[0].innerText=parseInt(vfail)+1;
				vcolor='alert-danger'
						var d = new Date(); var ahora=d.getHours()+': '+ d.getMinutes() + ': ' + d.getSeconds()
			 document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + d +'</td><td>' +vpostselected.author 
					+ '</td><td>'+ $("#VoteP").val() +'</td><td>'+ vpostselected.permlink+'</td><td  class="alert ' + vcolor +'">'+ vres+'</td><td >'+ vp +"</td>");
				return
		}
	else
		{

			console.log('block',voteresp.ref_block_num);
		    vres='bloque : ' + voteresp.ref_block_num;
			vcolor='alert-success'
			var d = new Date();
			
		
	
		   steem.api.getAccounts([localStorage.username], function(err, response){
		     	console.log('---Accinfo response');
				AccInfo=response[0];

				var vp='Not Available';
				if(AccInfo){
				var old_votingPw=AccInfo.voting_power/100;  
				vp=	AccInfo.voting_power/100;
				}    
			document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + d +'</td><td>' +vpostselected.author 
					+ '</td><td>'+ $("#VoteP").val() +'</td><td>'+ vpostselected.permlink+'</td><td  class="alert ' + vcolor +'">'+ vres+'</td><td >'+ vp +"</td>");
				    
			var vsuccess=$("#votesuccess")[0].innerText;
			$("#votesuccess")[0].innerText=parseInt(vsuccess)+1;
		});
       }
        
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
console.log('----cbaaakkk',e,result);}


function callback (e,result){
	alert('ppp');
console.log('----cbaaakkk222',e,result);}

var x=steem.api.setSubscribeCallback('1', '',devuelta);
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
