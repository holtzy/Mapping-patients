# --------------
# Updating maps
# --------------

# This script run the pipeline and updates the html output we need to display on the web

# Step 1: geocoding the new adresses:
Rscript script_geocode.R

# Step 2: run the R markdown documents
Rscript script_runAllRmd.R











