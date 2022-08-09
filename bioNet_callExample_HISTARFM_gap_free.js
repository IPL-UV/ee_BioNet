// This code shows an example javascript code to call the main BioNet function 
// and compute the desired biophysical parameter using the gap-filled data provided by the HISTARFM algorithm. 
// Using HISTARFM fused reflectance data is the preferred input data for BioNet, as it offers continuous 
// and reduced noise surface reflectance harmonized Landsat data. Along with the reflectance data, HISTARFM provides 
// realistic and spatiotemporal explicit uncertainties for each band which are ideal for error propagation purposes.

var exportarea = /* color: #d63000 */ee.Geometry.Point([-91.05746112339423, 39.582922206929005]);


//Let's include the bioNet function to compute the biophysicla parameters
var bioNet= require('users/ispguv/BioNet:Code/bioNet_nested.js').bioNet;

var scaleLandsat=function(img){
   var scaled=img.select(['P.*']).toFloat().divide(255).multiply(5000); //to scale the error of the bands
   var refl=img.select(['B.*']).toFloat();
   var y=img.get('year');
   var m=img.get('month');
   var d = ee.Date.fromYMD(y,m,15);
   var doy= d.getRelative('day', 'year');
   return refl.addBands(scaled,null,true).set({'month':m,'year':y,'DOY':doy});
};


Map.centerObject(exportarea,13)

var par='FAPAR';  //Two options so far: FAPAR or LAI
var monthnumber=8; //month to show
var year = 2011;   


var GFLandsat = ee.ImageCollection("projects/KalmanGFwork/GFLandsat_V1");
GFLandsat=GFLandsat.filterMetadata('year','equals',year);


print(GFLandsat,'test')

var imageVisParam = {"opacity":1,"bands":["B3_mean_post","B2_mean_post","B1_mean_post"],"min":0,"max":2500,"gamma":1};


Map.addLayer(GFLandsat.first(),imageVisParam,'example RGB')





//Let's scale landsat to reflectance values
var GFLandsatSCL=GFLandsat.map(scaleLandsat)






//Let's apply the created method to compute the desired parameter
var result= bioNet.bioNetcompute(GFLandsatSCL,par,'HISTARFM');

print(result)


//Color palettes and value ranges
switch(par){
    case 'FAPAR':
          var vis_vi_dp = {min: 0, max: 1, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};
    break;
    case 'LAI':
          var vis_vi_dp = {min: 0, max: 6, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};

    break;
    default: print('Invalid parameter choice');
    break;
}
 



//Color palettes and value ranges, please Laura add the rest varaibles and errors, take trhe
switch(par){
    case 'FAPAR':
          var vis_vi_dp = {min: 0, max: 1, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};
          var vis_vi_dp_err = {min: 0, max: 0.1, palette: ['fef0d9', 'fdcc8a', 'fc8d59', 'e34a33', 'b30000']};
    break;
    case 'LAI':
          var vis_vi_dp = {min: 0, max: 6, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837','004529']};
          var vis_vi_dp_err = {min: 0.0, max: 1, palette: ['fef0d9', 'fdcc8a', 'fc8d59', 'e34a33', 'b30000']};

    break;
    default: print('Invalid parameter choice');
    break;
}
 

//Results map
Map.addLayer(result.select(par).filterMetadata('month','equals',monthnumber), vis_vi_dp,  par.concat(''),true) 
Map.addLayer(result.select(par.concat('total')).filterMetadata('month','equals',monthnumber), vis_vi_dp_err,  par.concat('_err'),true) 


//Let's plot the temporal profile
// Create an image time series chart.
var chart = ui.Chart.image.series({
  imageCollection: result.select(par),
  region: exportarea,
  reducer: ee.Reducer.first(),
  scale: 30
}).setOptions({
          title: 'LAI temporal profile',
          vAxis: {title: 'LAI'},
          hAxis: {title: 'Time'},
          series: {
            0: {color: '008000', lineWidth: 2, pointSize: 4, curveType: 'function'}}
});

// Add the chart to the map.
chart.style().set({
  position: 'bottom-right',
  width: '300px',
  height: '200px'
});
Map.add(chart);
