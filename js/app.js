$(document).ready(function(){

	$("#battle-music")[0].load();

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
	var questionIndex = 0; 
	var userWins = false;
	var gameOver = false;
	var score = 0;	
	var enemyHP = 100;
	var playerHP = 100;
	var enemyDamagePerQuestion = Math.ceil(100/questions.length);	
	var playerDamagePerQuestion =  Math.floor(100/ (questions.length * 2) );
	var isDialogClickable = true;
	var currentQuestion;
	var currentAnswer;
	var userChoice;		
	var nextAction = "gameStart"; 

	function Question(qText, qOptions, qAnswer) {
		this.qText = qText;
		this.qOptions = qOptions;
		this.qAnswer = qAnswer;
	}

	var setDialogText = function(text) {
		$("#dialog-text .text").html(text);
	};

	var showMessage = function(msg) {
		$("#message").show();
		$("#message").html(msg);
	};

	var makeQuestionOptions = function() {
		var question = questions[questionIndex];
		var options = question.qOptions;
		for (var i = 0; i < options.length; i++) {
			$("#dialog-answer-options").append("<li><a href='#'>" + options[i] + "</a></li>");
		}
	};
	
	var calcHP = function(unit, damage) {
		var newWidth;
		
		if(unit === "PLAYER") {
			playerHP -= playerDamagePerQuestion;
			if(playerHP <= 0) {
				playerHP = 5;
			}	
			newWidth = playerHP + "%";
			$(".player-section").find(".hp-remaining").css("width", newWidth);
			$(".player-section").find(".hp-text").html(playerHP + "/100");
		}
		else if(unit === "ENEMY") {
			enemyHP -= enemyDamagePerQuestion;
			if(enemyHP < 0) {
				enemyHP = 0;
			}
			newWidth = enemyHP + "%";
			$(".enemy-section").find(".hp-remaining").css("width", newWidth);
		}
	};

	var toggleMusic = function(audio) { 
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
	};

	var resetGameVariables = function() {
		questionIndex = 0;
		userWins = false;
		gameOver = false;	
		score = 0;	
		enemyHP = 100;
		playerHP = 100;		
		nextAction = "gameStart";
		$(".enemy-section").find(".hp-remaining").css("width", "100%");
		$(".player-section").find(".hp-remaining").css("width", "100%");
		$(".player-section").find(".hp-text").html("100/100");		 
	};
	
	var gameControlFlow = function() {
		if(!gameOver && isDialogClickable) {
			switch(nextAction) {
				case "gameStart":
					$("#message").hide();
					$(".player-section").removeClass("invisible");
					$(".enemy-section").removeClass("invisible");
					$("#enemy-sprite-icon").removeClass("fainted");
					$("#enemy-stats").removeClass("invisible");	
					toggleMusic( {music: $("#victory-music")[0], volume: 0.3, load: true, toPlay: false} );
					toggleMusic( {music: $("#battle-music")[0], volume: 0.3, load: false, toPlay: true} );						
					setDialogText("<p class='text'>Wild <span class='stand-out'>Quiz</span> appeared!</p>");
					nextAction = "enemyAttacks";
					break;	
				case "enemyAttacks":					
					$("#enemy-sprite-icon").effect("bounce", function(){
						$("#player-sprite-icon").effect("shake", function(){
							calcHP("PLAYER", playerDamagePerQuestion);
						});
					});		
					setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> used <span class='stand-out'>Question!</span></p>");					
					nextAction = "menu";
					break;
				case "menu":										
					$("#dialog-menu").show();		
					setDialogText("");			
					isDialogClickable = false;
					nextAction = "playerAttacks";
					break;
				case "playerAttacks":
					$("#dialog-answer-options").hide();
					currentAnswer = questions[questionIndex].qAnswer;										
					setDialogText("<p><span class='stand-out'>Player</span> answers with <span class='stand-out'>" + userChoice + "</span>!</p>");
					nextAction = "outcome";
					break;
				case "outcome":
					if(userChoice === currentAnswer) {
						$("#player-sprite-icon").effect("bounce", function(){
							$("#enemy-sprite-icon").effect("shake", function(){
								calcHP("ENEMY", enemyDamagePerQuestion);
							});
						});
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
						nextAction = "enemyCondition";
					} else {					
						nextAction = "enemyAttacks";
					}
					break;
			}
		} else if(gameOver) {
			switch(nextAction) {
				case "enemyCondition":
					$("#enemy-sprite-icon").addClass("fainted");
					$("#enemy-stats").addClass("invisible");													
					if(userWins) {						
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> fainted!</p>");
					} else {
						setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> ran away!</p>");
					}
					nextAction = "expGained";
					break;
				case "expGained":
					toggleMusic( {music: $("#battle-music")[0], volume: 0.3, load: true, toPlay: false} );
					toggleMusic( {music: $("#victory-music")[0], volume: 0.3, load: false, toPlay: true} );
					if(userWins) {
						setDialogText("<p><span class='stand-out'>Player</span> gained 120 EXP. Points!</p>");
					} else {
						setDialogText("<p><span class='stand-out'>Player</span> gained 0 EXP. Points!</p>");
					}
					nextAction = "quizResults";
					break;
				case "quizResults":
					setDialogText("<p><span class='stand-out'>Player</span> answered " + score + " out of " + questions.length + " correctly!</p>");
					nextAction = "playAgain";
					break;
				case "playAgain": 	
					$(".player-section").addClass("invisible");				
					showMessage("<p>Pokemon Red Version Quiz!</p>");
					setDialogText("Click this box or press enter to play again!</p>");
					resetGameVariables();														
					break;
			}			
		}
	};
	
	
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
		switch(option) {
			case "menu-item":
				showMessage("<p>You left your backpack at home!</p>");
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
});