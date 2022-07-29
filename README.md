# ee-BioNet
The Google Earth Engine implementation of the BioNet algorithm to estimate biophysical parameters along with their uncertainties.

### Quantifying Uncertainty in High Resolution Biophysical Variable Retrieval with Machine Learning

The estimation of biophysical variables is at the core of remote sensing science, allowing a close monitoring of crops and forests. Deriving temporally resolved and spatially explicit maps of parameters of interest has been the subject of intense research. However, deriving products from optical sensors is typically hampered by cloud contamination and the trade-off between spatial and temporal resolutions. In this work we rely on the HIghly Scalable Temporal Adaptive Reflectance Fusion Model (HISTARFM) algorithm to generate long gap-free time series of Landsat surface reflectance data by fusing MODIS and
Landsat reflectances. An artificial neural network is trained on PROSAIL inversion to predict monthly biophysical variables at 30 meters spatial resolution with associated, realistic uncertainty bars. We emphasize the need for a more thorough analysis of uncertainty, and propose a general and scalable approach to combine both epistemic and aleatoric uncertainties by exploiting Monte Carlo (MC) dropout techniques from the trained artificial network and the propagation of HISTARFM uncertainties through the model, respectively. A model recalibration was performed in order to provide reliable uncertainties. We provide new high resolution products of several key variables to quantify the terrestrial biosphere: Leaf Area Index (LAI), Fraction of Absorbed Photosynthetically Active Radiation (FAPAR), Canopy Water Content (CWC) and Fractional Vegetation Cover (FVC) are at 30 m Landsat spatial resolution and over large continental areas.

An application to explore the results of BioNet without having a Google Earth Engine account can be found here:

https://ispguv.users.earthengine.app/view/high-resolution-parameter-retrieval-with-bionet

To add the GEE repository containing the scripts to your GEE accounte click below:

https://code.earthengine.google.com/?accept_repo=users/ispguv/BioNet

![image](https://user-images.githubusercontent.com/49197052/181771329-2ed4129a-e8a6-4b42-978f-654296f9ff8e.png)

Figure 1: BioNet processing chain. We exploit high-resolution cloud-free data derived from the HISTARFM. The reflectances are used for the neural network to produce high-resolution (30m) estimates of biophysical parameters (LAI, FAPAR, FVC, CWC). The neural network is trained inverting
PROSAIL. 
