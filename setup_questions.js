$(document).ready(
  function() {

    var mySliders = ['baserate', 'diff', 'alpha', 'beta'];

    mySliders.forEach(
      function(basename, index){
        var myCurrentSlider = $("#" + basename + "InputSlider");
        myCurrentSlider.slider(
          {
            max:   myCurrentSlider.data('max'),
            min:   myCurrentSlider.data('min'),
            value: myCurrentSlider.data('default'),
            slide: function(event, ui){$("#" + basename + "Input").val(ui.value); doSetupUpdate(); }
          }
        );
      }
    );
  }
);

function doSetupUpdate(){
  $("span[id*='alpha']").html($("#alphaInputSlider").slider("value"));
  $("span[id*='beta']").html( $("#betaInputSlider").slider("value") );
}
