# Geocoding and Mapping patients for IMB

This private repository provides code for geocoding and mapping patients for [IMB](https://imb.uq.edu.au).

<br>

## Input files

  - **Demographic information**: a set of addresses at .csv format (`addresses.csv`). Only one column. Each address is a row.
  - a set of addresses that have already been geocoded (`adress_with_gps.RData`). *Don't touch it*.
  - **Primary Visit**: one row per patient, observations made during the first visit (baseline)
  - **Subsequent Visit**: several row per patient: one per subsequent visit

Files can be linked using the patient IDs. Every ~month, these files are updated on the drupal server. The following pipeline allows to re-build the according dataviz.

<br>

## What it does

- **Step 1**: Transform the Excel files to clean `.txt` files readable by computers.

- **Step 2**: Compute additional variables. Merge files together. Find the most recent observation in the Subsequent visit file.  

- **Step 3**: Extract the addresses that haven't been geocoded yet. Geocode them. script:`script_geocode.R`. Use the `opencage` R library and update the list of geocoded addresses: `adress_with_gps.RData`.

- **Step 4**: Build Json object containing all the necessary data. These object are stored in .js files that will be read by the HTML final output

- **Output**: one `HTML` file called `index.html` is available. It is the final output of this pipeline.

<br>

![map](img_map.png)




<br>

## How to use the pipeline
Start by cloning this whole repository. Then, update the `addresses.csv` file with the new set of addresses. Finally run the pipeline with:

```bash
./script_update_maps.sh
```



<br>

## Requirements & limitations
A few R libraries need to be installed for the pipeline to work properly
```R
library(dplyr)
library(opencage)
library(leaflet)
```
Note that the geocoding step is limited to 2500 calls / day.




<br>

## Note on MND
Motor Neurone Disease (MND) is a disease that causes the death of neurons controling voluntaring muscles. It is also known under the name Amyotrophic lateral sclerosis (ALS).
