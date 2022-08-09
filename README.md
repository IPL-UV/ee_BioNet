# ee-BioNet
The Google Earth Engine implementation of the [BioNet](https://doi.org/10.1016/j.rse.2022.113199) algorithm to estimate biophysical parameters along with their uncertainties.

### Quantifying Uncertainty in High Resolution Biophysical Variable Retrieval with Machine Learning

The estimation of biophysical variables is at the core of remote sensing science, allowing a close monitoring of crops and forests. Deriving temporally resolved and spatially explicit maps of parameters of interest has been the subject of intense research. However, deriving products from optical sensors is typically hampered by cloud contamination and the trade-off between spatial and temporal resolutions. In this work we rely on the HIghly Scalable Temporal Adaptive Reflectance Fusion Model (HISTARFM) algorithm to generate long gap-free time series of Landsat surface reflectance data by fusing MODIS and Landsat reflectances. An artificial neural network is trained on PROSAIL inversion to predict monthly biophysical variables at 30 meters spatial resolution with associated, realistic uncertainty bars. We emphasize the need for a more thorough analysis of uncertainty, and propose a general and scalable approach to combine both epistemic and aleatoric uncertainties by exploiting Monte Carlo (MC) dropout techniques from the trained artificial network and the propagation of HISTARFM uncertainties through the model, respectively. A model recalibration was performed in order to provide reliable uncertainties. We provide new high resolution products of several key variables to quantify the terrestrial biosphere at 30 m Landsat spatial resolution and over large continental areas: 
* Leaf Area Index (LAI) 
* Fraction of Absorbed Photosynthetically Active Radiation (FAPAR) 
* Canopy Water Content (CWC) 
* Fractional Vegetation Cover (FVC)

![image](https://user-images.githubusercontent.com/49197052/181771329-2ed4129a-e8a6-4b42-978f-654296f9ff8e.png)

Figure 1: BioNet processing chain. We exploit high-resolution cloud-free data derived from the [HISTARFM](https://www.sciencedirect.com/science/article/pii/S0034425720302716?via%3Dihub) algorithm. The reflectances are used for the neural network to produce high-resolution (30m) estimates of biophysical parameters (LAI, FAPAR, FVC, CWC). The neural network is trained inverting
PROSAIL. 

![image](https://user-images.githubusercontent.com/49197052/181773604-18ea4824-cc40-411d-af6a-b40079c9568e.png)

Figure 2: BioNet results of prediction and uncertainties for LAI, FAPAR and FVC (August 2016).

An application to explore the results of BioNet without having a Google Earth Engine account can be found here:

https://ispguv.users.earthengine.app/view/high-resolution-parameter-retrieval-with-bionet

To add the GEE repository containing the BioNet source code to your GEE account click the link below:

https://code.earthengine.google.com/?accept_repo=users/ispguv/BioNet

Three source codes are available:


1. **bioNet_nested.js**
This is the primary function of the BioNet algorithm. For further details, we recommend reading the main [paper](https://doi.org/10.1016/j.rse.2022.113199) published in Remote Sensing of Environment. It computes the selected Biophysical Variable (LAI, FAPAR, FVC, or CWC) along with its associated total calibrated uncertainty (epistemic + aleatoric). This function is meant to be called from a different code for improved readability.

2. **bioNet_callExample_HISTARFM_gap_free**
This code shows an example javascript code to call the main BioNet function and compute the desired biophysical parameter using the gap-filled data provided by the [HISTARFM](https://www.sciencedirect.com/science/article/pii/S0034425720302716?via%3Dihub) algorithm. Using HISTARFM fused reflectance data is the preferred input data for BioNet, as it offers continuous and reduced noise surface reflectance harmonized Landsat data. Along with the reflectance data, HISTARFM provides realistic and spatiotemporal explicit uncertainties for each band which are ideal for error propagation.

3. **bioNet_callExample_Landsat_5**
This code shows a javascript code to call the BioNet function and compute the desired biophysical parameter using standard harmonized Landsat 5, 7, and 8 collection 2 surface reflectance data. Please, check this fantastic [community tutorial](https://developers.google.com/earth-engine/tutorials/community/landsat-etm-to-oli-harmonization?hl=en) by Justin Braaten to use any Landsat sensor.

