$(document).ready(function(){

	var questions = [];
	questions[0] = new Question("Who gives you your first pokemon?", 
		                       ["Mom", "Blue", "Officer Jenny", "Professor Oak"], 
		                       "Professor Oak");	
	questions[1] = new Question("Who is the gym leader of Pewter City that favors Rock type pokemon?", 
		                       ["Giovanni", "Misty", "Brock", "Koga"], 
		                       "Brock");
	questions[2] = new Question("What is the pokemon type of the infamous MissingNo. glitch?", 
		                       ["Bird", "Ghost", "Psychic", "Fire"], 
		                       "Bird");	                  	                  
	var actionQueue = ["enemyAttacks", "menu", "playerAttacks", "outcome"];	
	var resultsQueue = ["enemyCondition", "expGained", "quizResults", "playAgain"];
	var actionIndex = 0;
	var questionIndex = 0;
	var resultsIndex = 0;	
	var gameStart = true;
	var userWins = false;
	var gameOver = false;
	var score = 0;	
	var enemyHP = 100;
	var damagePerQuestion = Math.ceil(100/questions.length);
	var isDialogClickable = true;
	var currentQuestion;
	var currentAnswer;
	var userChoice;	

	/* Move forward through game */
	$(".dialog-section").click(gameControlFlow);	
	$(document).keydown(function(event){
		if(event.keyCode === 13) {	
			gameControlFlow();
		} 
	});

	/* Handle invalid menu options */
	$("#dialog-menu .invalid-option").click(function(event) {
		event.preventDefault();
		var option = $(this).attr('id');
		$(this).blur();
		switch(option) {
			case "menu-item":
				showMessage("<p>Your left your backpack at home!</p>");
				break;
			case "menu-pkmn":
				showMessage("<p>You forgot your pokemon!</p>");
				break;
			case "menu-run":
				showMessage("</p>You cannot escape!</p>");
				break;
		}
	});

	/* User chooses to answer question */
	$("#dialog-menu #menu-answer").click(function(event){
		event.preventDefault();
		$("#message").hide();
		$("#dialog-menu").hide();
		$("#dialog-answer-options").empty();					
		makeQuestionOptions();
		$("#dialog-answer-options").show();	
		currentQuestion = questions[questionIndex].qText;	
		setDialogText(currentQuestion);				
	});

	/* User selects an answer */
	$("#dialog-answer-options").on("click", "a", function(event){
		event.preventDefault();
		userChoice = event.target.text;		
		isDialogClickable = true;
	});

	function gameControlFlow() {
		if(gameStart) {
			$("#message").hide();
			$(".player-section").removeClass("invisible");
			$(".enemy-section").removeClass("invisible");
			$("#enemy-sprite-icon").removeClass("fainted");
			$("#enemy-stats").removeClass("invisible");	
			toggleMusic( {music: $("#victory-music")[0], volume: 0.3, load: true, toPlay: false} );
			toggleMusic( {music: $("#battle-music")[0], volume: 0.3, load: false, toPlay: true} );						
			setDialogText("<p class='text'>Wild <span class='stand-out'>Quiz</span> appeared!</p>");
			gameStart = false;			
		} else if(!gameOver && isDialogClickable) {
			switch(actionQueue[actionIndex]) {
				case "enemyAttacks":					
					$("#enemy-sprite-icon").effect("bounce");	
					$("#player-sprite-icon").delay(400).effect("shake");	
					setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> used <span class='stand-out'>Question!</span></p>");					
					updateActionIndex();
					break;
				case "menu":										
					$("#dialog-menu").show();		
					setDialogText("");			
					isDialogClickable = false;
					updateActionIndex();
					break;
				case "playerAttacks":
					$("#dialog-answer-options").hide();
					currentAnswer = questions[questionIndex].qAnswer;										
					setDialogText("<p><span class='stand-out'>Player</span> answers with <span class='stand-out'>" + userChoice + "</span>!</p>");										
					updateActionIndex();
					break;
				case "outcome":
					if(userChoice === currentAnswer) {
						$("#player-sprite-icon").effect("bounce");
						$("#enemy-sprite-icon").delay(400).effect("shake");	
						calcEnemyHP();
						setDialogText("<p>It's super effective!</p>");						
						score++;
					} else {
						setDialogText("<p>But, it failed!</p>");
					}

					questionIndex++;
					if(questionIndex >= questions.length) {
						if(score === questions.length) {
							userWins = true;
						}
						gameOver = true;
					}
					
					updateActionIndex();
					break;
			}
		} else if(gameOver) {
			switch(resultsQueue[resultsIndex]) {
				case "enemyCondition":
					$("#enemy-sprite-icon").addClass("fainted");
					$("#enemy-stats").addClass("invisible");													
					if(userWins) {						
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> fainted!</p>");
					} else {
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> ran away!</p>");
					}
					resultsIndex++;
					break;
				case "expGained":
					toggleMusic( {music: $("#battle-music")[0], volume: 0.3, load: true, toPlay: false} );
					toggleMusic( {music: $("#victory-music")[0], volume: 0.3, load: false, toPlay: true} );
					if(userWins) {
						setDialogText("<p><span class='stand-out'>Player</span> gained 120 EXP. Points!</p>");
					} else {
						setDialogText("<p><span class='stand-out'>Player</span> gained 0 EXP. Points!</p>");
					}
					resultsIndex++;
					break;
				case "quizResults":
					setDialogText("<p><span class='stand-out'>Player</span> answered " + score + " out of " + questions.length + " correctly!</p>");
					resultsIndex++;
					break;
				case "playAgain": 	
					$(".player-section").addClass("invisible");				
					showMessage("<p>Pokemon Red Version Quiz!</p>");
					setDialogText("Click to play again!</p>");
					resetGameVariables();														
					break;
			}			
		}
	}

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

	function setDialogText(text) {
		$("#dialog-text .text").html(text);
	}

	function showMessage(msg) {
		$("#message").show();
		$("#message").html(msg);
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

	function toggleMusic(audio) { 
		var defaultOptions = {
			music: $("#battle-music")[0], 
			volume: 0.3,
			load: false,
			toPlay: false
		};

		audio = $.extend({}, defaultOptions, audio);
				
		if(audio["toPlay"]) {
			audio["music"].volume = audio["volume"];
			audio["music"].play();
		} else {
			audio["music"].pause();			
			if(audio["load"]) {
				audio["music"].load();
			}
		}
	}

	function resetGameVariables() {
		questionIndex = 0;
		resultsIndex = 0;
		gameStart = true;
		gameOver = false;					
		userWins = false;
		enemyHP = 100;
		$(".enemy-section .hp-remaining").css("width", "100%");
		score = 0;	
	}

});