// Main function for the submitted manuscript "Quantifying Uncertainty in High 
// Resolution Biophysical Variable Retrieval with Machine Learning"
//  https://doi.org/10.1016/j.rse.2022.113199


// It computes the selected Biophysical Variable (LAI, FAPAR, FVC, or CWC) 
// along with its associated total calibrated uncertainty (epistemic + aleatoric). 
// This function is meant to be called from a different code for improved readability.



var bioNet={};

//General function which does most of the things
bioNet.bioNetcompute = function(collection,parameter){
  var nest = function(Who,Wih){
    var computeBIO=function(img){
      var d = ee.Date(ee.Number(img.get('system:time_start')));
      var doy = d.getRelative('day', 'year');
      var m = ee.Number(d.get('month'));
      var y = ee.Number(d.get('year'));
      var  inputs=img;      
      
      var inputssclarr=inputs.select([0,2,4,6,8,10])
      .toArray().toArray(1);
      
      var errorinputssclarr=inputs.select([1,3,5,7,9,11])
      .toArray().toArray(1);
      
      //Neural network implementation
      var f=ee.Image(Wih).matrixMultiply(inputssclarr).add(ee.Image(bh).toArray().toArray(1)).tanh(); //1x4
      var estimates=f.matrixTranspose().matrixMultiply(ee.Image(Who).toArray().toArray(1)).add(bo);
      
      //Error propagation implementation in MATLAB for the tanh
      //f = tanh(input'*W_ih'+b_h');
      //a=W_ho.*(1-f.^2);
      //b=a*W_ih;
      
      var a=f.pow(2).multiply(-1).add(1)
      .arrayProject([0]).arrayFlatten([['a','b','c','d']]) //a,b,c,d, are random names, some names are needed to flatten
      .multiply(ee.Image(Who))
      
      var J=ee.Image(Wih).matrixTranspose().matrixMultiply(a.toArray().toArray(1));
      var errortrain=(J.pow(2).matrixTranspose().matrixMultiply(errorinputssclarr.pow(2))).sqrt();
      var error=ee.Image(ee.ImageCollection(errortrain.arrayProject([0]).arrayFlatten([[('prop_error').concat(parameter)]])).first()).divide(gains.get([6]))//.multiply(0.1);
      
      estimates=ee.Image(ee.ImageCollection(estimates.arrayProject([0]).arrayFlatten([[parameter]])).first()).divide(gains.get([6]))//.multiply(0.1);
      
      return estimates.addBands(error).set({'month':m, 'year':y,'day':doy,'system:time_start': d});
    };
    return computeBIO
  };
      
        
    //This functions scale the Landsat exactly like matlab
    var scaledatainputs = function(image)  {
        var d = ee.Date(ee.Number(image.get('system:time_start')));
        var doy = d.getRelative('day', 'year');
        var m = ee.Number(d.get('month'));
        var y = ee.Number(d.get('year'));
            
        var B1=image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B1_mean_post'),
              'ymin': ee.Image(xmin.get([0])),
              'ymax': ee.Image(xmax.get([0])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P1_postSD').multiply(gains.get([0])).float())
        .select([0,1],['B1scl','P1scl']);
        var B2= image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B2_mean_post'),
              'ymin': ee.Image(xmin.get([1])),
              'ymax': ee.Image(xmax.get([1])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P2_postSD').multiply(gains.get([1])).float())
        .select([0,1],['B2scl','P2scl']);
        var B3=image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B3_mean_post'),
              'ymin': ee.Image(xmin.get([2])),
              'ymax': ee.Image(xmax.get([2])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P3_postSD').multiply(gains.get([2])).float())
        .select([0,1],['B3scl','P3scl']);
        var B4=image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B4_mean_post'),
              'ymin': ee.Image(xmin.get([3])),
              'ymax': ee.Image(xmax.get([3])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P4_postSD').multiply(gains.get([3])).float())
        .select([0,1],['B4scl','P4scl']);
        var B5=image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B5_mean_post'),
              'ymin': ee.Image(xmin.get([4])),
              'ymax': ee.Image(xmax.get([4])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P5_postSD').multiply(gains.get([4])).float())
        .select([0,1],['B5scl','P5scl']);
        var B7=image.expression(
            '(xmax-xmin)*(y-ymin)/(ymax-ymin)+xmin', {
              'y': image.select('B7_mean_post'),
              'ymin': ee.Image(xmin.get([5])),
              'ymax': ee.Image(xmax.get([5])),
              'xmax': ee.Image(ymax),
              'xmin': ee.Image(ymin)
        })
        .addBands(image.select('P7_postSD').multiply(gains.get([5])).float())
        .select([0,1],['B7scl','P7scl']);
        
        return ee.Image(B1.addBands(B2).addBands(B3).addBands(B4)
        .addBands(B5).addBands(B7)).set({'month':m, 'year':y,'day':doy,'system:time_start': d});    
        };

    var compute_media = function(img){
      var media = (img.select([0]).multiply(0.9605)).add(img.select([2]).multiply(0.0097))
                  .add(img.select([3]).multiply(0.0097)).add(img.select([4]).multiply(0.0097))
                  .add(img.select([5]).multiply(0.0097));
      media = media.select([0],['mean']);
      return img.addBands(media);
    };
    
    var compute_std = function(img){
      var r1 = ((img.select([0]).subtract(img.select('mean'))).pow(2)).multiply(0.9605);
      var r2 = ((img.select([2]).subtract(img.select('mean'))).pow(2)).multiply(0.0097);
      var r3 = ((img.select([3]).subtract(img.select('mean'))).pow(2)).multiply(0.0097);
      var r4 = ((img.select([4]).subtract(img.select('mean'))).pow(2)).multiply(0.0097);
      var r5 = ((img.select([5]).subtract(img.select('mean'))).pow(2)).multiply(0.0097);
      var result = (r1.add(r2).add(r3).add(r4).add(r5)).sqrt();
      
      result = result.select([0],['STD']);
      return img.addBands(result);
    };
    
    var compute_total = function(img){
      var total = (img.select(['STD'])).add(img.select([1]));
      total = total.select([0],['Total']).multiply(cal);
      return img.addBands(total);
    };
      
  //Scaling parameters and network weights
    switch(parameter){
    case 'FAPAR':
        //Parameters for the scaling of the input and output parameters
        //The last element of the array is the output in this case the FAPAR
        var xmax=ee.Array([2539,3607,4370,7666,5692,5303,1.14]); //B1,B2....,B7,Y
        var xmin=ee.Array([53,102,64,349,333,93,0]);
        var ymax=1;
        var ymin=0;
        var gains=ee.Array((ymax-ymin)).divide(xmax.subtract(xmin)); //equivalent to the MATLAB gains
        //Arrays of the ANN parameters:
        var Who=[-0.2478056, 0.1015223, -0.1240556, -0.1361705];
        var Who_dp1=ee.Array([0,1,1,1]).multiply(Who);
        var Who_dp2=ee.Array([1,0,1,1]).multiply(Who);
        var Who_dp3=ee.Array([1,1,0,1]).multiply(Who);
        var Who_dp4=ee.Array([1,1,1,0]).multiply(Who);
        var bh=[0.3160596,	-0.3554675,	0.7130865,	1.3064803];
        var imagebh=ee.Image(bh);
        var bo=0.4721866;
        var Wih=ee.Array([[-0.1449827,	0.3911196,	0.7118666,	-0.9005224,	-0.3494371,	0.1397229],
        [-2.0969231,	-2.1408710,-0.5177902,	4.7824583,	-1.9707686,	-3.2743766],
        [2.4920461,	2.4615848,	-0.5878192,	-9.0983467,	3.0233281,	0.9925993],
        [1.1359612,4.4964061,	3.5530932,	-15.8570175,	-0.1963358,	1.0848538]]);
        var Wih_dp1 = ee.Array([0,1,1,1]).repeat(1,6).multiply(Wih);
        var Wih_dp2 = ee.Array([1,0,1,1]).repeat(1,6).multiply(Wih);
        var Wih_dp3 = ee.Array([1,1,0,1]).repeat(1,6).multiply(Wih);
        var Wih_dp4 = ee.Array([1,1,1,0]).repeat(1,6).multiply(Wih);
        var cal = 0.86; //Calibration factor for the total uncertainties
    break;
    case 'LAI':
        //Parameters for the scaling of the input and output parameters
        //The last element of the array is the output in this case the LAI
        xmax=ee.Array([2539,3607,4370,7666,5692,5303,7.8]); //B1,B2....,B7,Y
        xmin=ee.Array([53,102,64,349,333,93,0]);
        ymax=1;
        ymin=0;
        gains=ee.Array((ymax-ymin)).divide(xmax.subtract(xmin)); //equivalent to the MATLAB gains
        //Arrays of the ANN parameters:
        Who=[0.3618846, -0.2916892, 0.1618071, 0.2812164];
        Who_dp1=ee.Array([0,1,1,1]).multiply(Who);
        Who_dp2=ee.Array([1,0,1,1]).multiply(Who);
        Who_dp3=ee.Array([1,1,0,1]).multiply(Who);
        Who_dp4=ee.Array([1,1,1,0]).multiply(Who);
        bh=[-0.2452940,	0.1100446,	0.4114222,	-0.0443081];
        imagebh=ee.Image(bh);
        bo=0.3376074;
        Wih=ee.Array([[0.2589070,	-0.0823760,	-0.3414120,	1.4032732,	-0.1782579,	-0.3470968],
        [0.1986698,	0.0821062,0.2470072,	-0.6903262,	0.3860631,	-0.3922591],
        [-2.3764493,	-1.6403724,	-0.7257658,	1.7055312,	-1.3652155,	-1.8055679],
        [-0.2495868,-0.1405635,	-0.1837370,	0.5989660,	-0.4614444,	0.2812259]]);
        Wih_dp1 = ee.Array([0,1,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp2 = ee.Array([1,0,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp3 = ee.Array([1,1,0,1]).repeat(1,6).multiply(Wih);
        Wih_dp4 = ee.Array([1,1,1,0]).repeat(1,6).multiply(Wih);
        cal = 1.66;
    break;
    case 'FVC':
        //Parameters for the scaling of the input and output parameters
        //The last element of the array is the output in this case the FVC
        xmax=ee.Array([2539,3607,4370,7666,5692,5303,1.27]); //B1,B2....,B7,Y
        xmin=ee.Array([53,102,64,349,333,93,0]);
        ymax=1;
        ymin=0;
        gains=ee.Array((ymax-ymin)).divide(xmax.subtract(xmin)); //equivalent to the MATLAB gains
        //Arrays of the ANN parameters:
        Who=[0.3029480, 0.1024410, -0.1514996, -0.1027696];
        Who_dp1=ee.Array([0,1,1,1]).multiply(Who);
        Who_dp2=ee.Array([1,0,1,1]).multiply(Who);
        Who_dp3=ee.Array([1,1,0,1]).multiply(Who);
        Who_dp4=ee.Array([1,1,1,0]).multiply(Who);
        bh=[-0.3451400,	-0.5016359,	0.5849402,	1.2462612];
        imagebh=ee.Image(bh);
        bo=0.4711484;
        Wih=ee.Array([[-0.0714294,	0.0075522,	-0.8279998,	0.8550464,	0.3648874,	-0.1117095],
        [-1.3793678,	-1.5702010,-1.1849272,	4.7408314,	-1.8634131,	-4.0451698],
        [1.6740687,	0.2666900,	1.1926926,	-7.5671387,	2.7405100,	1.7918478],
        [0.4552978,4.3217425,	2.2491744,	-13.8758621,	1.0241019,	0.8558609]]);
        Wih_dp1 = ee.Array([0,1,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp2 = ee.Array([1,0,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp3 = ee.Array([1,1,0,1]).repeat(1,6).multiply(Wih);
        Wih_dp4 = ee.Array([1,1,1,0]).repeat(1,6).multiply(Wih);
        cal = 0.64;
    break;
    case 'CWC':
        //Parameters for the scaling of the input and output parameters
        //The last element of the array is the output in this case the CWC
        xmax=ee.Array([2539,3607,4370,7666,5692,5303,0.51]); //B1,B2....,B7,Y
        xmin=ee.Array([53,102,64,349,333,93,0]);
        ymax=1;
        ymin=0;
        gains=ee.Array((ymax-ymin)).divide(xmax.subtract(xmin));
        //Arrays of the ANN parameters:
        Who=[0.0018208, -0.0858932, -0.1487533, 0.1059690];
        Who_dp1=ee.Array([0,1,1,1]).multiply(Who);
        Who_dp2=ee.Array([1,0,1,1]).multiply(Who);
        Who_dp3=ee.Array([1,1,0,1]).multiply(Who);
        Who_dp4=ee.Array([1,1,1,0]).multiply(Who);
        bh=[-0.0116946,	0.0503948,	0.3406931,	-0.1925621];
        imagebh=ee.Image(bh);
        bo=0.2179050;
        Wih=ee.Array([[-0.0098830,	-0.0665969,	0.0266702,	0.0431044,	-0.0881403,	0.1445539],
        [0.1383270,	-0.0960859,-0.6158721,	-1.4471887,	1.2433628,	1.3586085],
        [-1.6520118,	1.1700398,	-1.8321425,	-4.5779395,	9.5294371,	1.0194550],
        [-0.3633006,0.0331356,	0.4607158,	1.2194963,	-1.0871177,	0.4838817]]);
        Wih_dp1 = ee.Array([0,1,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp2 = ee.Array([1,0,1,1]).repeat(1,6).multiply(Wih);
        Wih_dp3 = ee.Array([1,1,0,1]).repeat(1,6).multiply(Wih);
        Wih_dp4 = ee.Array([1,1,1,0]).repeat(1,6).multiply(Wih);
        cal = 0.69;
    break;
    default: print('Invalid parameter choice');
    break;
  }
   var all = collection.map(scaledatainputs).map(nest(Who,Wih));
   var dp1 = collection.map(scaledatainputs).map(nest(Who_dp1,Wih_dp1));
   var dp2 = collection.map(scaledatainputs).map(nest(Who_dp2,Wih_dp2));
   var dp3 = collection.map(scaledatainputs).map(nest(Who_dp3,Wih_dp3));
   var dp4 = collection.map(scaledatainputs).map(nest(Who_dp4,Wih_dp4));
   
   var compute_bands = all.combine(dp1.select([0])).combine(dp2.select([0])).combine(dp3.select([0])).combine(dp4.select([0]));
   var col =compute_bands.map(compute_media).map(compute_std).map(compute_total);
  
  return col.select([0,8],[parameter,parameter+'total']);
};

exports = {
    bioNet: bioNet
};
