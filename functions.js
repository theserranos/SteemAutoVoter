var AccInfo = null
var r = null;
var Timer = null;

function inicio() {
    $("#inicio").show();
    $("#bvoter").val(localStorage.voter);
    $("#busername").val(localStorage.username);
    $("#PostKey").val(localStorage.PostingKey);
    $("#Tagfilter").val(localStorage.Tags);
    $("#VoteP").val(localStorage.VotingPower);
    $("#RefreshTime").val(localStorage.Reftime);

    $('#PostKey').on('change', function() {
        var isGoodWif = iswif($(this).val())
        if (isGoodWif === true) {
            $(this).attr('class', 'form-control alert alert-success')
        } else {
            $(this).attr('class', 'form-control alert alert-danger')
        }
    });
    $('#navSett').on('click', function() {
        $("#Settings").show();

    });

    $('#bvoter').on('change', function() {
        var luacc = LUAccount($("#bvoter").val())

    })
     getimg( ($("#bvoter").val()));
}

function CleanNav() {
    $('.container').hide();
}

function showAccountInfo() {

    console.log($("#accsearch").val());

    $("#accinfo").show();
    var aux = null;

    steem.api.getAccounts([$("#accsearch").val()], function(err, response) {

        nomadsteemAccInfo = response[0];

        for (var key in response[0]) {

            if (!key.isArray) {
                aux = '<tr><td>' + key + '</td><td>' + response[0][key] + '</td></tr>' + aux;
            }
        }

        $("#cuerpo").html(aux);
        console.log('--------inside ShowAccountInfo');
    })
    console.log('------getting account ');

}

function vote(vvote) {
    //voting for last nomadsteem post'

    console.log('voting ');

    var voter = localstorage.username;
    var password = localStorage.PostingKey;
    var author = vvote.author;
    var permlink = vvote.permlink;
    var weight = 100;

    steem.broadcast.vote(password, voter, author, permlink, weight, function(err, result) {
        console.log(err, result);
        //$("#vresponse").val(result);
    });
}

function CheckVoted() {
    //last post by nomadsteem
    var vfound = 'false';
    steem.api.getDiscussionsByAuthorBeforeDate('nomadsteem', '', '2018-03-20T20:27:30', 1, function(err, r) {
        console.log('---- last ' + err, r);

        for (var key in r[0].active_votes) {
            if (r[0].active_votes[key].voter == 'nomadsteem') {
                vfound = 'true';
            }
        }

        if (vfound != 'true') {
            vote(r[0]);
        } else {
            discussions();
        }
    });

    //return	
}

function discussions() {
    //Randomly selects one post  

    var categ = $("#Tagfilter").val().split(",");
    var vnumcateg = categ.length;
    var vcatsel = categ[Math.floor((Math.random() * vnumcateg))];
    console.log('===Categ:', vcatsel);

    var query = {
        tag: vcatsel,
        limit: "30"
    };

    steem.api.getDiscussionsByCreated(query, function(err, result) {
        var rndpost = Math.floor((Math.random() * result.length));
        console.log('--- post selected :' + rndpost);
        var res = result[rndpost]
        votediscussion(res, vcatsel);
        //	return;
    });
}

function votediscussion(vpostselected, categ) {
    console.log('----voting');

    if (!vpostselected) {
        console.log('--noo hay post ');
        var vfail = $("#votefail")[0].innerText;
        $("#votefail")[0].innerText = parseInt(vfail) + 1;
        var d = new Date();
        var ahora = d.getHours() + ': ' + d.getMinutes() + ': ' + d.getSeconds();
        ahora=d.format("{Month:2}-{Date:2}-{FullYear}");
        document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + ahora + '</td><td>' + '--' + '</td><td>' + $("#VoteP").val() + '</td><td>' + '-----' + '</td><td  class="alert-danger"' + '">' + 'Could not find a random post to vote in ' + categ + '</td><td >' + 'error' + "</td>");
        return;
    }

    var weight = $("#VoteP").val() * 100;
    var vres = null;
    var voteresp = null;
    var vp = 0;

    steem.broadcast.vote(localStorage.PostingKey, localStorage.username, vpostselected.author, vpostselected.permlink, weight, function(err, voteresp) {
        if (err) {
            vres = '-- Error : --' + err.cause.payload.error.data.message;
            console.log('----------' + vres);
            var vfail = $("#votefail")[0].innerText;
            $("#votefail")[0].innerText = parseInt(vfail) + 1;
            vcolor = 'alert-danger'
            var d = new Date();
            var ahora = d.getHours() + ': ' + d.getMinutes() + ': ' + d.getSeconds()
            document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + d + '</td><td>' + vpostselected.author + '</td><td>' + $("#VoteP").val() + '</td><td>' + vpostselected.permlink + '</td><td  class="alert ' + vcolor + '">' + vres + '</td><td >' + vp + "</td>");
            return
        } else {

            console.log('block', voteresp.ref_block_num);
            vres = 'bloque : ' + voteresp.ref_block_num;
            vcolor = 'alert-success'
            var d = new Date();

            steem.api.getAccounts([localStorage.username], function(err, response) {
                console.log('---Accinfo response');
                AccInfo = response[0];

                var vp = 'Not Available';
                if (AccInfo) {
                    var old_votingPw = AccInfo.voting_power / 100;
                    vp = AccInfo.voting_power / 100;
                    $("#ProgVotPow").html(vp + "%");
                    $("#ProgVotPow").width(vp + "%");
                }
                ahora=d.toISOString();
                var posturl="https://steemit.com" + vpostselected.url;
                document.getElementById("bodytabla").insertRow(0).innerHTML = ("<td>" + ahora + '</td><td>' + vpostselected.author + '</td><td>' + $("#VoteP").val() + '</td><td><a href="'+ posturl +'">' + vpostselected.permlink + '</a></td><td  class="alert ' + vcolor + '">' + vres + '</td><td >' + vp + "</td>");

                var vsuccess = $("#votesuccess")[0].innerText;
                $("#votesuccess")[0].innerText = parseInt(vsuccess) + 1;
            });
        }

    });

}

function LaunchDaemon() {
    var vcheckinput = CheckInput();
    if (vcheckinput != 'correct') {
        alert(vcheckinput);
        return
    }

    if ($("#daemonbut").text() == "Launch Daemon") {
        $("#daemonbut").text('Stop Daemon');
        $("#daemonbut").attr('class', 'btn btn-danger');
        regvote();
        //var Timer=setTimeout(function(){ regvote(); }, $("#RefreshTime").val()*1000);

    } else {
        clearTimeout(Timer);
        $("#daemonbut").text('Launch Daemon');
        $("#daemonbut").attr('class', 'btn btn-success');

    }
}

function regvote() {

    var vcheckinput = CheckInput();

    if (vcheckinput != 'correct') {
        alert(vcheckinput);
        return
    }

    localStorage.setItem("voter", $("#bvoter").val());
    localStorage.setItem("username", $("#busername").val());
    localStorage.setItem("PostingKey", $("#PostKey").val());
    localStorage.setItem("Tags", $("#Tagfilter").val());
    localStorage.setItem("VotingPower", $("#VoteP").val());
    localStorage.setItem("Reftime", $("#RefreshTime").val());

    CheckVoted();
    var Timer = setTimeout(function() {
        regvote();
    }, $("#RefreshTime").val() * 1000);

}

function getState() {
    var aux = null;
    steem.api.getState('@nomadsteem', function(err, result) {
        console.log(err, result['props']);
        for (var key in result['props']) {
            aux = '<tr><td>' + key + '</td><td>' + result['props'][key] + '</td></tr>' + aux;
            console.log('--------- aux ' + aux);
            ;
        }
        console.log('--------- aux ' + aux);
        $("#cuerpogt").show();
        $("#cuerpogt").html(aux);
    });

}

function getHistory() {
    var aux = null;
    $("#cuerpogt").html('Calculating');
    steem.api.getAccountHistory($("#accsearch").val(), 10000, 2000, function(err, result) {
        //console.log(err, result);
        if (err) {
            alert('error in history');
            return
        }
        for (i = 1950; i < 2001; i++) {
            aux = '<tr><td>' + result[i][1].op[0] + '---' + result[i][1].timestamp + '</td><td>' + JSON.stringify(result[i][1].op[1]) + '</td></tr>' + aux;
            //JSON.stringify(result[i][1].op[1]) 
        }
        console.log('--------- aux ' + aux);
        $("#cuerpogt").show();
        $("#cuerpogt").html(aux);
    });

}

function iswif(privWif) {
    return ( steem.auth.isWif(privWif)) ;
}

function isValidAccount(naccount) {
    steem.api.lookupAccountNames([naccount], function(err, result) {
        if (!err) {
            console.log('correct')
        } else {
            ;console.log(err);
        }
    }).then(function() {
        console.log('despues')
    })
    console.log('mas despues')
}

function settings() {
    CleanNav();
    $("#Settings").show();
}

//-------------------------------------------------   tests 
function subscribe() {
    CleanNav();
    $('#Subscribe').show();

    var result = null
    var err = null;
    var e, r = null;

    var devuelta = function(r) {
        alert('óoooo');
        console.log('----cbaaakkk', e, result);
    }

    function callback(e, result) {
        alert('ppp');
        console.log('----cbaaakkk222', e, result);
    }

    var x = steem.api.setSubscribeCallback('1', '', devuelta);
    ;

}

function CheckInput() {
    if ($("#bvoter").val() === "") {
        return ( "Please entry a voter")
    }

    /*

    if(ValidAcc!='correct'){
    	return ("Voter account is not valid ")
    }*/

    if ($("#busername").val() === "") {
        return ( "Please entry a User name")
    }

    if (!iswif($("#PostKey").val())) {
        return ( "Posting key is not valid")
    }

    if (isNaN($("#VoteP").val()) || $("#VoteP").val() > 100) {
        return ( "Voting Power should be numeric and lower than 100!")
    }

    if (isNaN($("#RefreshTime").val()) || $("#VoteP").val() < 0) {
        return ( "Refresh Time Should be a valid number (p.e 60 secs)")
    }

    return ( 'correct') ;

}

function LUAccount(accountNames) {
    steem.api.lookupAccountNames([accountNames], function(err, result) {
        console.log(err, result);

        if (!result[0]) {
            console.log('bad name')
            $("#bvoter").attr('class', 'form-control alert alert-danger')
        } else {
            $("#bvoter").attr('class', 'form-control alert alert-success')
        }
        getimg( ($("#bvoter").val()));
        return ( result[0])
    });
}
