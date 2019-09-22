# --------------
# Updating maps
# --------------

# This script runs the pipeline and updates the html output
# See readMe.md

# Step 1: Data preparation
Rscript 1_dataWrangling.R

# Step 2: geocoding the new adresses:
Rscript 2_geocoding.R
