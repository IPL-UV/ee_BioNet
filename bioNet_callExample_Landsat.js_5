// This code shows an example javascript code to call the BioNet function and compute the desired biophysical parameter
// using standard harmonized Landsat 5, 7, and 8 collection 2 surface reflectance data.


// Please, check this fantastic community tutorial by Justin Braaten to use any Landsat sensor after 
// the harmonization process.
// https://developers.google.com/earth-engine/tutorials/community/landsat-etm-to-oli-harmonization?hl=en


var par='FAPAR';  //Four options: FAPAR, LAI, FVC, CWC
var banderrors=[100,100,100,100,100,100]; //This values are for B1,B2,B3,B4,B5,B7 respectively 
// and have been set for ilustration purposes (0.01).
// We recommend to read this paper https://www.sciencedirect.com/science/article/pii/S0034425715301188


var exportarea = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([-119.55599627964423, 43.84887574505519]),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-125.60039242843128, 49.39297447670556],
          [-125.60039242843128, 24.221743471683045],
          [-59.68242367843128, 24.221743471683045],
          [-59.68242367843128, 49.39297447670556]]], null, false);


//Let's include the bioNet function to compute the biophysicla parameters
var bioNet= require('users/ispguv/BioNet:Code/bioNet_nested.js').bioNet;



// Applies scaling factors.
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
    opticalBands = opticalBands.where(opticalBands.lt(0),0).multiply(10000).toInt16();
  return image.addBands(opticalBands, null, true);
              
}

// Removes edges from Landsat 5 scenes simple buffer 2500 m inward
var ls5edgeRemoval = function(lsImage){
  var innerBuffer = lsImage.geometry().buffer(-2500);
  return lsImage.clip(innerBuffer)
            .copyProperties(lsImage, ['system:time_start']);
};

// This is the preferred mask choice, rather restritive/conservative but reasonable
function goodLS_v2(lsm){
    var mask = lsm.select(['QA_PIXEL']).eq(5440);
    var aerosol_mask = lsm.select(['SR_ATMOS_OPACITY']).multiply(0.001).lte(0.3);
    lsm = lsm.mask(mask)
    return lsm.mask(mask.and(aerosol_mask));
}
function addErrobands(img){
 var errorbands=ee.Image.constant(banderrors[0]).rename('P1_postSD')
  .addBands(ee.Image.constant(banderrors[1]).rename('P2_postSD'))
  .addBands(ee.Image.constant(banderrors[2]).rename('P3_postSD'))
  .addBands(ee.Image.constant(banderrors[3]).rename('P4_postSD'))
  .addBands(ee.Image.constant(banderrors[4]).rename('P5_postSD'))
  .addBands(ee.Image.constant(banderrors[5]).rename('P7_postSD'));
  img=img.select(
      ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      ['B1_mean_post', 'B2_mean_post', 'B3_mean_post', 'B4_mean_post', 'B5_mean_post', 'B7_mean_post']);
  return img.addBands(errorbands).select([0,6,1,7,2,8,3,9,4,10,5,11]).copyProperties(img);
}


Map.centerObject(exportarea,7)




//Subsetting the collection for 
var dataLS5=ee.ImageCollection("LANDSAT/LT05/C02/T1_L2").filterDate('2011-08-01', '2011-08-16').filterBounds(geometry);
var v2L5=dataLS5.map(ls5edgeRemoval).map(goodLS_v2).map(applyScaleFactors).map(addErrobands);




var imageVisParam = {"opacity":1,"bands":["B3_mean_post","B2_mean_post","B1_mean_post"],"min":0,"max":2500,"gamma":1};
Map.addLayer(v2L5,imageVisParam,'example RGB')





//Let's apply the created method to compute the desired parameter
var result= bioNet.bioNetcompute(v2L5,par);


//Color palettes and value ranges, please Laura add the rest varaibles and errors, take trhe
switch(par){
    case 'FAPAR':
          var vis_vi_dp = {min: 0, max: 1, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};
          var vis_vi_dp_err = {min: 0.02, max: 0.1, palette: ['fef0d9', 'fdcc8a', 'fc8d59', 'e34a33', 'b30000']};
    break;
    case 'LAI':
          var vis_vi_dp = {min: 0, max: 6, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};
          var vis_vi_dp_err = {min: 0.4, max: 0.7, palette: ['fef0d9', 'fdcc8a', 'fc8d59', 'e34a33', 'b30000']};

    break;
    default: print('Invalid parameter choice');
    break;
}
 

//Results map
Map.addLayer(result.select(par).mosaic(), vis_vi_dp,  par.concat(''),true) 
Map.addLayer(result.select(par.concat('total')).mosaic(), vis_vi_dp_err,  par.concat('_err'),true) 




