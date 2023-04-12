# MolOptimizer
![alt_text](https://img.shields.io/badge/OPTIMIZATION-Fragement%20Screening-yellow?style=for-the-badge)
![alt text](https://img.shields.io/badge/LICENSE-MIT-informational?style=for-the-badge)
![alt_text](https://img.shields.io/badge/Version-1.00-yellowgreen?style=for-the-badge)

Flask based package useful for optimization of fragment screening datasets


Developed at Akabavoy Research Laboratories, Department of Chemistry, Ben Gurion University of the Negev.
Under the supervision of *Dr. Barak Akabayov*

![alt_text](https://github.com/csbarak/MolOptimizer/blob/main/BGU_logo.PNG)        
Visit Dept. of Chemistry@BGU: https://in.bgu.ac.il/teva/chem/eng/Pages/default.aspx 


![alt_text](https://github.com/csbarak/MolOptimizer/blob/main/lab_logo.png)

Please visit  our lab website: https://akabayov-lab.org/ 







        


>## Motivation: 

>MolOptimizer was developed to be used by researchers working in the field of Small Fragment based inhibitors and is intended to be helpful
in optimization of ligand databases. 

## Description:
![alt_text](https://img.shields.io/badge/-FLASK-lightgrey?style=flat-square)	![alt_text](https://img.shields.io/badge/-PYTHON-blue?style=flat-square) 		![alt_text](https://img.shields.io/badge/-HTML-orange?style=flat-square) 
![alt_text](https://img.shields.io/badge/-CSS-informational?style=flat-square)
![alt_text](https://img.shields.io/badge/-REACTJS-red?style=flat-square)

MolOptimizer is a flask based web package which can be used for Alignment of large ligand datasets, extracting large volume of Chemical Descriptors
and training Machine Learning models to predict binding scores. 


### Setting up MolOptimizer



In all of the scripts provided with MolOptimizer please kindly add the fullpaths to the mentioned required folders. 

Once the folders are created in the directory and the paths to the folders added in the scripts, MolOptimizer is ready to be run.



### How to run MolOptimizer
Download MolOptimizer from the repository and set up the YAML file ('MolOptimizer_env.yml') containing the anaconda environment required for MolOptimizer. This will enable usage of RDKit and Mordred libraries along with the Machine Learning Algorithms. Once in the provided anaconda environment, use the following command,
```
flask run 
```
MolOptimizer will start running on your local host as shown below, 
![alt_text](https://github.com/csbarak/MolOptimizer/blob/main/Flask_Message.JPG)
Copy past the URL generated in the Command Prompt/terminal in your web browser and you should see the
webpage of MolOptimizer displayed as shown below. 



* Note to user
	* MolOptimizer looks best on Chrome
	* Kindly delete uploaded and generated files from folders after running MolOptimizer so that MolOptimizer does not read from previous files.
	* If XGBoost Expert Mode model throws an error please select higher number of recommended features to train from. 
	* Please kindly make sure to add the full paths to each of the folders in the relevant scripts (mainly 'app.py' file)
	* Debuging
		* If the front end of MolOptimizer is not responding, check the terminal for any error messages. 
		* Please do make sure that you are running in the environment provided by MolOptimizer
   		* Kindly make sure that while entering the complete paths in the scripts that you use '\\'. Feel free to change it depending on the platform in which you are                       running.

* Credits

  Thanks to my supervisor Dr. Barak Akabayov and all the amazing members of the group. 
  
  * Link to GitHub Repository of Chosen:  https://github.com/harvesthq/chosen
  * Link to Chosen License Statement: https://github.com/harvesthq/chosen/blob/master/LICENSE.md
  * Link to RDKit Tethered Minimization GitHub Repository: https://github.com/Discngine/rdkit_tethered_minimization
  * Link to RDKit Tethered Minimization License File: https://github.com/Discngine/rdkit_tethered_minimization/blob/master/LICENSE
  * Link to Mordred GitHub Repository: https://github.com/mordred-descriptor/mordred
  * Link to Mordred License Statement: https://github.com/mordred-descriptor/mordred/blob/develop/LICENSE
 
* License

  MolOptimizer uses Chosen, RDKit, RDKit Tetherd Minimization and Mordred libraries in its program without any modifications. The license statements for all of the mentioned     programs is kept 'as is' in the script files. 
  
  MolOptimizer is released under MIT License.

- - -
MIT License

Copyright (c) 2021 Barak Akabayov
