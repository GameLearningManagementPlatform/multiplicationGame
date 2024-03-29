var playing = false;
var score;
var timeRemaining = 60; //set game time here in seconds;
var action;
var correctAnswer;

let url = new URLSearchParams(window.location.search)
let user = url.get('user');
let id = url.get('id');
let today;

//the user clicks on the start/reset
document.getElementById("start").onclick = function(){
    startTime();

    //if the user is playing
    if (playing == true){
        //reload page
        location.reload(); 
        
    }
    //if the user is not playing
    else
    {
        //change mode to playing
        document.getElementById("startgame").pause();
        playing=true;
        score=0;        
        document.getElementById("scoreNumber").innerHTML=score;

        //show the instructions     
        document.getElementById("instruction").innerHTML="Click on the right answer";

        //show countdown box
        show("time");

        //30 seconds timer
        // timeRemaining = 5;
        document.getElementById("remainingTime").innerHTML=timeRemaining;

        //hide game over box
        hide("gameover");

        //change button to reset
        document.getElementById("start").innerHTML="Reset Game";

        //start countdown
        startCountdown();

        //generate new question and answers  
        generateQA();             
    }   
}

//the user clicks on the answer box
for(var i=1; i<5; i++){
    document.getElementById("answer"+i).onclick=function(){    
        if(playing==true){

            //if the answer is correct
            //this=document.getElementById("answer1")
            if (this.innerHTML==correctAnswer)
            { 
                //correct answer
                score++;
                document.getElementById("scoreNumber").innerHTML=score;
                //play sound
                document.getElementById("win").play();
                show("right");

                //show for 1 sec
                setTimeout(function(){
                    hide("right");
                },1000);    
                hide("wrong");
                //generate new answer and question
                generateQA();
            }
            else
            {  //play sound
                document.getElementById("lost").play();

                //wrong answer
                show("wrong");

                //show for 1 sec
                setTimeout(function(){
                    hide("wrong");
                }, 1000)
                hide("right");
            }             
        }
    }
}

//functions 

//start countdown 20sec
function startCountdown(){
    action = setInterval(function(){
        timeRemaining-=1;
        document.getElementById("remainingTime").innerHTML = timeRemaining;
        if(timeRemaining == 0)
        {//game over
            stopCountdown();
            sendScores();
            show("gameover");
            document.getElementById("gameover").innerHTML= "<p>GAME OVER!</p><p>YOUR SCORE: " + score+ "</p>"; 
            document.getElementById("final").play();
            hide("time");
            hide("right");
            hide("wrong");
            playing=false;
            document.getElementById("start").innerHTML = "Start Game";
            
        }
    },1000);
}

//generate question and answers 
function generateQA(){
    //a random digit from 0 to 10 inclusive
    var randomNumber1 = Math.round(Math.random()*10);   
    var randomNumber2 = Math.round(Math.random()*10);     

    document.getElementById("problem").innerHTML=randomNumber1+ " x " +randomNumber2;
    correctAnswer=randomNumber1*randomNumber2;  
    var answerBox= (Math.round(Math.random()*3))+1;

    //to fill on if the random answer boxes with the right answer
    document.getElementById("answer"+answerBox).innerHTML=correctAnswer; 

    //storing answer choices;    
    var answers=[correctAnswer];

    //to fill the other answer boxes with the wrong answers   

    //make sure to exclude the box with the right answer
    for (var i=1; i<5; i++)
    {if (i!==answerBox)
    { 
        var wrongAnswer;
        // check that the wrong answer is not equal to the right answer or another taken wrong answer
        //do: at least one possible answer, while: generate then a new possible answer, if the previous answer is not ok
        do{
            wrongAnswer = (Math.round(Math.random()*10))*(Math.round(Math.random()*10));
        }            
        while(answers.indexOf(wrongAnswer)>-1)  //wrongAnswer is already in the answer list, we countinue do loop   

            document.getElementById("answer"+i).innerHTML=wrongAnswer;
        //adding wrong answer to answer choices
        answers.push(wrongAnswer);
    }
    }
}

//stop counter
function stopCountdown(){
    clearInterval(action);
}
//hide an element      
function hide(id){      
    document.getElementById(id).style.display="none";      
}   
//show an element
function show(id){      
    document.getElementById(id).style.display="block";      
}    
function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

  
function startTime() {
    today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('gameTime').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function() {
        startTime()
    }, 500);
    // return today;
}

function sendScores() {
    let xhttp = new XMLHttpRequest();
    
    let stopTime = `${today.getFullYear()}-${checkTime(today.getMonth())}-${checkTime(today.getDate())} ${checkTime(today.getHours())}:${checkTime(today.getMinutes())}:${checkTime(today.getSeconds())}`;
    today.setSeconds(today.getSeconds()-timeRemaining); //subtract timer value in seconds
    let startTime = today;
    startTime = `${startTime.getFullYear()}-${checkTime(startTime.getMonth())}-${checkTime(startTime.getDate())} ${checkTime(startTime.getHours())}:${checkTime(startTime.getMinutes())}:${checkTime(startTime.getSeconds())}`;
    
    xhttp.responseType = 'json';

    xhttp.open('POST', 'https://gmlp.herokuapp.com//thirdpartyaccess/api/playerscore/')    
    let json = JSON.stringify({
        "user" : user,
        "id": id,
        "playMode": "single",
        "startTime": startTime,
        "endTime": stopTime,
        "score": score,
	    "API_KEY": "asdfghjkl"  
    })
    xhttp.send(json);

    xhttp.onload = _ => {
        console.log(xhttp.response.message);
    }

    xhttp.onerror = _ => {
        console.log(xhttp.status);
    } 
}