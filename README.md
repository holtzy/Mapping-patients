# Geocoding and Mapping patients for IMB

This private repository provides code for geocoding and mapping patients for IMB.

# What it does
- Input:  
  - a set of adresses at .csv format. Only one column. Each adress is a row. Needs to be changed with new adresses
  - a set of adresses that have already been geocoded. This is an R object called `adress_with_gps.RData`. Don't touch it.

- Step 1: the script is first going to extract the adresses that haven't been geocoded yet. It will geocode them using the `opencage` R library.

#How to use the pipeline
Start by cloning this whole repository. Then, only 1 line of code is necessary to update the html outputs:

```
./script_update_maps.sh
```
