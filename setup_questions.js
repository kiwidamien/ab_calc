$(document).ready(
  function() {

    var controlGps = ['baserate', 'diff', 'alpha', 'beta', 'trial'];

    controlGps.forEach(
      function(basename, index){
        var myCurrentSlider = $("#" + basename + "InputSlider");
        var myCurrentInput = $("#" + basename + "Input");

        // setup the slider with defaults, and make sure changing it
        // updates the model AND the input box
        myCurrentSlider.slider(
          {
            max:   myCurrentSlider.data('max'),
            min:   myCurrentSlider.data('min'),
            value: myCurrentSlider.data('default'),
            step:  myCurrentSlider.data('step') || 1,
            slide: function(event, ui){
              myCurrentInput.val(ui.value);
              doSetupUpdate( basename == "trial");
            }
          }
        );

        // setup the input with defaults, and make sure changing it updates
        // the model AND the associated slider
        myCurrentInput.val( myCurrentSlider.slider('option','value') );
        myCurrentInput.change( function(){
          myCurrentSlider.slider('value', myCurrentInput.val());
          doSetupUpdate();
        });
      }
    );

    $('#generateData').on('click', runSimulation);
    //Make the controls consistent upon loading
    doSetupUpdate();
  }
);

function resetN(){
  var alphaRate = $("#alphaInput").val();
  var betaRate  = $("#betaInput").val();
  var baserate  = $("#baserateInput").val();
  var min_diff  = $("#diffInput").val();

  var N         = sampleSizeNeeded(baserate/100, min_diff/100, alphaRate / 100, betaRate / 100);

  $("#trialInput").val(N);
  $("#trialInputSlider").slider('value',N);

  doSetupUpdate(true);
}


function doSetupUpdate(updateN){
  var alphaRate = $("#alphaInput").val();
  var betaRate  = $("#betaInput").val();
  var baserate  = $("#baserateInput").val();
  var min_diff  = $("#diffInput").val();

  var N         = sampleSizeNeeded(baserate/100, min_diff/100, alphaRate / 100, betaRate / 100);

  $("span[id*='alpha']").html( alphaRate );
  $("span[id*='beta']").html(  betaRate  );
  $("span[id*='trials']").html( N );

  var sampleSizeInput   = $('#trialInput');
  var currentSampleSize = sampleSizeInput.val();
  var msgDiv = $("#trialNumberSuggest");

  var linkHTML = "<a onclick='resetN();' style='color:blue; text-decoration: underline;'>Click to set to recommended number.</a>";

  if (currentSampleSize < 0.95*N){
    sampleSizeInput.css('color','red');
    msgDiv.html("Warning: trials selected (" + currentSampleSize + ") less than suggested (" + N + "). " + linkHTML );
  } else if (currentSampleSize > 1.05*N){
    sampleSizeInput.css('color', 'green');
    msgDiv.html("Warning: trials selected (" + currentSampleSize + ") significantly more than suggested (" + N + "). " + linkHTML);
  } else {
    sampleSizeInput.css('color', 'black');
    msgDiv.text("");
  }
  $("span[id*='alternative_min']").text(Number(baserate)+Number(min_diff));
  $("#our_baserate").text(baserate);
  $('#generateData').text("Continue with " + currentSampleSize + " trials");
}

function runSimulation(){
  // load the data, hide this div, and look at the generated results
}
