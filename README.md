# Geocoding and Mapping patients for IMB

This private repository provides code for geocoding and mapping patients for [IMB](https://imb.uq.edu.au).

<br>

## Input files
This project is based on 3 input files that must be in the `DATA/INPUT/` folder:

  - **Demographic information**: a set of addresses and personal patient information format (`demog.xlsx`). Only one column. Each address is a row.
  - **Primary Visit**: one row per patient, observations made during the first visit (baseline)
  - **Subsequent Visit**: several row per patient: one per subsequent visit

Files can be linked using the patient IDs. Every ~month, these files are updated on the Drupal server. Running the pipeline re-build the according Dataviz.

<br>

## What the pipeline does

- **Step 1: Data wrangling**: Read data, Clean it, Compute additional variables. Merge files together. Find the most recent observation in the Subsequent visit file for each patient.

- **Step 2: Geocoding**: Extract the addresses that haven't been geocoded yet. Geocode them. Use the `opencage` R library and update the list of geocoded addresses.

- **Step 3: Webpage input creation**: Build Json object containing all the necessary data. These object are stored in `.js` files that will be read by the HTML final output

- **Output**: one `HTML` file called `index.html` is available. It is the final output of this pipeline.

<br>

![map](img_map.png)




<br>

## How to use the pipeline
- Start by cloning this whole repository.
- Update the input file of the `DATA/INPUT` folder with the new dataset if needed
- Run the pipeline to create the output. Must be done in the `PIPELINE` folder

```bash
./script_update_maps.sh
```

- Open `index.html` to check the webpage works properly



<br>

## Requirements & limitations
A few R libraries need to be installed for the pipeline to work properly
```R
library(dplyr)
library(lubridate)
library(readxl)
library(tidyr)
library(opencage)
library(jsonlite)
```
Note that the geocoding step is limited to 2500 calls / day.




<br>

## Note on MND
Motor Neurone Disease (MND) is a disease that causes the death of neurons controling voluntaring muscles. It is also known under the name Amyotrophic lateral sclerosis (ALS).
