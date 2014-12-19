$(document).ready(function(){

	var questions = [];
	questions[0] = new Question("Who gives you your first pokemon?", 
		                       ["Mom", "Blue", "Officer Jenny", "Professor Oak"], 
		                       "Professor Oak");

	/*
	questions[1] = new Question("Who is the gym leader of Pewter City that favors Rock type pokemon? rjern erjner kfe krne knrek  kenkr enrk nwnej rntj ejrjeb", 
		                       ["Giovanni", "Misty", "Brock", "Koga"], 
		                       "Brock");
	questions[2] = new Question("What is the pokemon type of the infamous MissingNo. glitch?", 
		                       ["Ghost", "Bird", "Psychic", "Fire"], 
		                       "Bird");
	*/		                  

	var questionIndex = 0;
	var actionQueue = ["enemyAttacks", "menu", "playerAttacks", "outcome"];
	var actionIndex = 0;
	var resultsQueue = ["enemyCondition", "expGained", "quizResults", "playAgain"];
	var resultsIndex = 0;
	var gameOver = false;
	var gameStart = true;
	var userWins = false;
	var score = 0;
	var isDialogClickable = true;
	var enemyHP = 100;
	var damagePerQuestion = Math.ceil(100/questions.length);
	var currentQuestion;
	var currentAnswer;
	var userChoice;
	

	$(".dialog-section").click(function(){
		if(gameStart) {
			$("#enemy-sprite i").removeClass("fainted");
			$("#enemy-stats").removeClass("invisible");	
			setDialogText("<p class='text'>Wild <span class='stand-out'>Quiz</span> appeared!</p>");
			gameStart = false;
		} else if(!gameOver && isDialogClickable) {
			switch(actionQueue[actionIndex]) {
				case "enemyAttacks":
					setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> Used <span class='stand-out'>Question!</span></p>");
					$("#player-sprite i").effect("shake");						
					updateActionIndex();
					break;
				case "menu":
					setDialogText("");					
					$("#dialog-menu").show();					
					isDialogClickable = false;
					updateActionIndex();
					break;
				case "playerAttacks":
					currentAnswer = questions[questionIndex].qAnswer;					
					$("#dialog-answer-options").hide();
					setDialogText("<p><span class='stand-out'>Player</span> answers with <span class='stand-out'>" + userChoice + "</span>!</p>");										
					updateActionIndex();
					break;
				case "outcome":
					if(userChoice === currentAnswer) {
						$("#enemy-sprite i").effect("shake");	
						setDialogText("<p>It's super effective!</p>");
						calcEnemyHP();
						score++;
					} else {
						setDialogText("<p>But, it failed!</p>");
					}

					if(score === questions.length) {
						userWins = true;
					}

					updateQuestionIndex();
					updateActionIndex();
					break;
			}
		} else if(gameOver && isDialogClickable) {
			switch(resultsQueue[resultsIndex]) {
				case "enemyCondition":
					$("#enemy-sprite i").addClass("fainted");
					$("#enemy-stats").addClass("invisible");					
					if(userWins) {						
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> fainted!</p>");
					} else {
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> ran away!</p>");
					}
					updateResultsIndex();
					break;
				case "expGained":
					if(userWins) {
						setDialogText("<p><span class='stand-out'>Player</span> gained 120 EXP. Points!</p>");
					} else {
						setDialogText("<p><span class='stand-out'>Player</span> gained 0 EXP. Points!</p>");
					}
					updateResultsIndex();
					break;
				case "quizResults":
					setDialogText("<p><span class='stand-out'>Player</span> answered " + score + " out of " + questions.length + " correctly!</p>");
					updateResultsIndex();
					/*isDialogClickable = false;*/
					break;
				case "playAgain": 
					setDialogText("Click to play again!</p>");
					enemyHP = 100;
					$(".enemy-section .hp-remaining").css("width", "100%");
					score = 0;
					gameOver = false;
					gameStart = true;
					updateResultsIndex();
					userWins = false;
					break;
			}
			
		}
	});


	/* Extra for other menu options (optional) */
	$("#dialog-menu a").click(function(event) {
		event.preventDefault();
	});


	$("#dialog-menu #menu-answer").click(function(event){
		event.preventDefault();
		$("#dialog-menu").hide();
		$("#dialog-answer-options").empty();
		currentQuestion = questions[questionIndex].qText;		
		setDialogText(currentQuestion);
		makeQuestionOptions();
		$("#dialog-answer-options").show();		
	});

	
	$("#dialog-answer-options").on("click", "a", function(event){
		event.preventDefault();
		userChoice = event.target.text;
		isDialogClickable = true;
	});

	function Question(qText, qOptions, qAnswer) {
		this.qText = qText;
		this.qOptions = qOptions;
		this.qAnswer = qAnswer;
	}

	function updateActionIndex(){
		actionIndex++;
		if (actionIndex >= actionQueue.length) {
			actionIndex = 0;
		}
	}

	function updateQuestionIndex() {
		questionIndex++;
		if(questionIndex >= questions.length) {
			questionIndex = 0;
			gameOver = true;
		}
	}

	function updateResultsIndex() {
		resultsIndex++;
		if(resultsIndex >= resultsQueue.length) {
			resultsIndex = 0;
		}
	}

	function setDialogText(text) {
		$("#dialog-text .text").html(text);
	}

	function makeQuestionOptions() {
		var question = questions[questionIndex];
		var options = question.qOptions;
		for (var i = 0; i < options.length; i++) {
			$("#dialog-answer-options").append("<li><a href='#'>" + options[i] + "</a></li>");
		}
	}

	function calcEnemyHP() {
		enemyHP -= damagePerQuestion;
		if(enemyHP < 0) {
			enemyHP = 0;
		}
		var newWidth = enemyHP + "%";
		$(".enemy-section .hp-remaining").css("width", newWidth);
	}

});