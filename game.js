
var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var highScore = 0;
var soundEnabled = true;

$(document).keypress(function () {
  if (!started) {
    startGame();
  }
});

$("#start-button").click(function () {
  if (!started) {
    startGame();
  }
});

function startGame() {
  $("#start-button").hide();
  nextSequence();
  started = true;
}

$(".btn").click(function () {

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {

  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");

    // Update high score
    if (level > highScore) {
      highScore = level;
      $("#high-score-value").text(highScore);
      localStorage.setItem('simonHighScore', highScore);
    }

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    startOver();
  }
}


function nextSequence() {
  userClickedPattern = [];
  level++;
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  if (soundEnabled) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  $("#start-button").show();
}

// Load high score and sound preference from localStorage
$(document).ready(function () {
  highScore = localStorage.getItem('simonHighScore') || 0;
  $("#high-score-value").text(highScore);
  soundEnabled = localStorage.getItem('simonSoundEnabled') !== 'false';
  $("#sound-toggle").text(soundEnabled ? '🔊 Sound On' : '🔇 Sound Off');

  var currentTheme = localStorage.getItem('simonTheme') || 'classic';
  $("#theme-selector").val(currentTheme);
  applyTheme(currentTheme);

  // Show instructions on first load
  if (!localStorage.getItem('simonInstructionsShown')) {
    $("#instructions-modal").show();
    localStorage.setItem('simonInstructionsShown', 'true');
  }
});

// Sound toggle
$("#sound-toggle").click(function () {
  soundEnabled = !soundEnabled;
  $(this).text(soundEnabled ? '🔊 Sound On' : '🔇 Sound Off');
  localStorage.setItem('simonSoundEnabled', soundEnabled);
});

// How to Play button
$("#how-to-play").click(function () {
  $("#instructions-modal").show();
});

// Modal close
$(document).on('click', '.close', function () {
  $("#instructions-modal").hide();
});

$(window).click(function (event) {
  if (event.target == document.getElementById('instructions-modal')) {
    $("#instructions-modal").hide();
  }
});

// Theme selector
$("#theme-selector").change(function () {
  var selectedTheme = $(this).val();
  applyTheme(selectedTheme);
  localStorage.setItem('simonTheme', selectedTheme);
});

function applyTheme(theme) {
  $('body').removeClass('classic neon pastel').addClass(theme);
}
