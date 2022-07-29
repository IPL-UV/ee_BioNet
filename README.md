# ee-BioNet
## The Google Earth Engine implementation of the BioNet algorithm to estimate biophysical parameters along with their uncertainties.


To add the GEE repository containing the scripts to your GEE accounte click below:

https://code.earthengine.google.com/?accept_repo=users/ispguv/BioNet

![image](https://user-images.githubusercontent.com/49197052/181771329-2ed4129a-e8a6-4b42-978f-654296f9ff8e.png)

Figure 1: BioNet processing chain. We exploit high-resolution cloud-free data derived from the HISTARFM. The reflectances are used for the neural network to produce high-resolution (30m) estimates of biophysical parameters (LAI, FAPAR, FVC, CWC). The neural network is trained inverting
PROSAIL. 
