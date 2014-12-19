$(document).ready(function(){

	var questions = [];
	questions[0] = new Question("Who gives you your first pokemon?", 
		                       ["Mom", "Blue", "Officer Jenny", "Professor Oak"], 
		                       "Professor Oak");
	questions[1] = new Question("Who is the gym leader of Pewter City that favors Rock type pokemon? rjern erjner kfe krne knrek  kenkr enrk nwnej rntj ejrjeb", 
		                       ["Giovanni", "Misty", "Brock", "Koga"], 
		                       "Brock");
	questions[2] = new Question("What is the pokemon type of the infamous MissingNo. glitch?", 
		                       ["Ghost", "Bird", "Psychic", "Fire"], 
		                       "Bird");

	var questionIndex = 0;
	var actionQueue = ["enemyAttacks", "menu", "playerAttacks", "outcome"];
	var actionIndex = 0;
	var isGameOver = false;
	var score = 0;
	var isDialogClickable = true;
	var enemyHP = 100;
	var damagePerQuestion = Math.ceil(100/questions.length);
	var currentQuestion;
	var currentAnswer;
	var userChoice;
	

	$(".dialog-section").click(function(){
		if(isDialogClickable) {
			switch(actionQueue[actionIndex]) {
				case "enemyAttacks":
					setDialogText("<p>Enemy <span class='stand-out'>Quiz</span> Used <span class='stand-out'>Question!</span></p>");
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
					updateQuestionIndex();
					updateActionIndex();
					break;
				case "outcome":
					if(userChoice === currentAnswer) {
						setDialogText("<p>It's super effective!</p>");
						calculateHP();
					} else {
						setDialogText("<p>But, it failed!</p>");
					}
					updateActionIndex();
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
			isGameOver = true;
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

	function calculateHP() {
		enemyHP -= damagePerQuestion;
		if(enemyHP < 0) {
			enemyHP = 0;
		}
		var newWidth = enemyHP + "%";
		$(".enemy-section .hp-remaining").css("width", newWidth);
	}

});

