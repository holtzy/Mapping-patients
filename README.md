# Geocoding and Mapping patients for IMB

This private repository provides code for geocoding and mapping patients for [IMB](https://imb.uq.edu.au).

<br><br>
## What it does
- **Input**:  
  - a set of addresses at .csv format (`addresses.csv`). Only one column. Each address is a row.
  - a set of addresses that have already been geocoded (`adress_with_gps.RData`). *Don't touch it*.

- **Step 1**: the script `script_geocode.R` is first going to extract the addresses that haven't been geocoded yet. It will geocode them using the `opencage` R library and update the list of geocoded addresses: `adress_with_gps.RData`.

- **Step 2**: the script `script_runAllRmd.R` will run all the `Rmd` files: one per Australian city. It will produce the `html` files we want to display online via the drupal server.

- **Output**: one `html` file per city. The file provides a map of the city with one circle per geocoded patient:
<br>

![map](img_map.png)




<br><br>
## How to use the pipeline
Start by cloning this whole repository. Then, update the `addresses.csv` file with the new set of addresses. Finally run the pipeline with:

```bash
./script_update_maps.sh
```



<br><br>
## Requirements & limitations
A few R libraries need to be installed for the pipeline to work properly
```R
library(dplyr)
library(opencage)
library(leaflet)
```
Note that the geocoding step is limited to 2500 calls / day.
