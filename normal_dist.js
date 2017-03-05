/*
 * This file contains functions for calculating probabilities and z-scores
 * from the normal ("Gaussian") distribution.
 *
 * In particular, numerical approximations are implemented for the cumulative
 * probability density function, which are usually computed using tables.
 *
 * Summary of functions
 * ---------------------

 * inverseNormCompCDF(p):
              returns z such that P(Z > z) = p.
              Suitable for one-tailed tests.

 * sampleSizeNeeded(baserate, min_diff,alpha,beta):
              returns N, the number of trails needed to find a difference of proportions of at least min_diff.
              Assumes that one process has a rate baserate.
              Finds N so that P( reject control | two treatment rates the same ) = alpha
                         and  P( reject alternative | treatment 2 is min_diff better than treatment 1) = beta

*/

/*
 * Given a p-value p, this function will return the zscore z*
 * required so that
 * P(Z > z* ) = p  [i.e. this corresponds to a one-tailed test]
 * For example
 *  inverseNormCompCDF(0.025) returns approximately 1.96
* (5% confidence in a **2** tailed test, or 2.5% in a 1 tailed test)
 */
function inverseNormCompCDF(p){

  var rationalApprox = function(t){
    //Abramowitz and Stegun formula 26.2.23
    // t is sqrt(ln(1/p^2)); only a good approximation for p < 0.5
    var n = [2.515517, 0.802853, 0.010328];
    var d = [1.432788, 0.189269, 0.001308];
    return t - ((n[2]*t + n[1])*t + n[0])/(((d[2]*t + d[1])*t + d[0])*t + 1.0);
  }

  if (p > 0.5){
    // use symmetry
    return -inverseNormCompCDF(1-p);
  }

  return rationalApprox(Math.sqrt(-2*Math.log(p)));

}

/*
 * This is the a priori sample size calculation. It finds N such that
 *   - if p_a = p_b, the probability of rejecting the null hypothesis is alpha
 *   - if p_b = p_a + min_diff, the probability of rejecting the alternative hypothesis is beta
 */
function sampleSizeNeeded(baserate, min_diff, alpha, beta){
    var z_alpha = inverseNormCompCDF(alpha);
    var z_beta  = inverseNormCompCDF(beta);

    var Nstddev_NoDiff = Math.sqrt(2*baserate*(1 - baserate));
    var Nstddev_MinDiff= Math.sqrt(baserate*(1-baserate) + (baserate + min_diff)*(1 - (baserate + min_diff)));

    return Math.round(Math.pow( (z_alpha*Nstddev_NoDiff + z_beta*Nstddev_MinDiff) / min_diff, 2));
}
