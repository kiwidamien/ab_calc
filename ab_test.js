"use strict";

function initBaserate(shift_size_low, shift_size_high){
  // pick a random number between shift_size_low and shift_size_high
  return shift_size_low + (shift_size_high - shift_size_low)*Math.random();
}

function generateCumSuccessRate( p, N ){
  // Make samples; success (true) with probability p
  if (N == 0){
    return [];
  }

  var samples = Array(N).fill(0).map(function(value,index){ return Math.random() <= p; });

  // Now make a cumulative sum
  var rates = [samples[0]];
  for (var index = 1; index < samples.length; index++){
    rates[index] = rates[index-1] + samples[index];
  }
  //now turn into a rate
  //console.log(rates);
  rates = rates.map( function(value, index) { return value/(index+1); });

  return rates;
}

/*
 * Returns
 */
function propDifference(propA, propB, alpha){
  if (alpha === undefined){
    alpha = 0.95;
  }

  var NA = propA.length;
  var NB = propB.length;
  var pA = propA[ NA - 1 ];
  var pB = propB[ NB - 1 ];


  // Wilson interval for proportion
  // AGRESTI and CAFFO
  // http://www.stat.ufl.edu/~aa/articles/agresti_caffo_2000.pdf

  // Suggestion is to add four to observations, half successful, half not
  var NA_mod_success = pA * NA + 2;
  var NB_mod_success = pB * NB + 2;
  var NA_mod_fail    = NA + 4 - NA_mod_success;
  var NB_mod_fail    = NB + 4 - NB_mod_success;

  var z = 1.96;
  var stddev = Math.sqrt( NA_mod_success*NA_mod_fail / Math.pow(NA + 4,3) + NB_mod_success*NB_mod_fail / Math.pow(NB + 4,3) );

  var difference = {
    'propA': pA, 'probB': pB,
    'NumA' : NA, 'NumB': NB,
    'stddev': stddev,
    'diffHigh': Math.min(1.0,pB - pA + z*stddev),
    'diffLow' : Math.max(-1.0,pB - pA - z*stddev),
  };

  difference.isImprovement = (difference.diffLow > 0);

  return difference;
}

console.log("Performing an AB/Test");

var baserate = 0.6;
var shift    = 0.2;
var new_rate = initBaserate(baserate-0.5*shift, baserate + 0.5*shift);

console.log("Baserate is " + baserate +", and the new rate is " + new_rate);
var N = 10000;

var rate = generateCumSuccessRate(new_rate, N);
var rate2= generateCumSuccessRate(baserate, N);

console.log( propDifference(rate2, rate) );
//console.log(rate);
