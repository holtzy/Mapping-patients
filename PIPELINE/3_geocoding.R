# --------------
# Geocoding adresses
# --------------

# This script takes 2 inputs:
#     - All patient information with their address
#     - A list of adresses that have already been geocoded
# It geocodes adresses that haven't been geocoded yet using the opencage library


# setwd("~/Desktop/Mapping-patients/PIPELINE")

# Libraries necessary:
suppressWarnings(library(dplyr)) # data manipulation
suppressWarnings(library(opencage)) # geocoding
suppressWarnings(library(jsonlite)) # json output

# Load the list of adresses to geocode
load("../DATA/mergedData.Rdata")
input <- output
cat(paste(nrow(input), "addresses in the input file", "\n"))

# Load the list of adresses we already have geocoded
load("../DATA/adress_with_gps.RData")
cat(paste(nrow(data), "addresses are already geolocalized. But perhaps not the same as the one we need", "\n"))

# List of adresses to geocode?
toGeocode <- input %>%
  filter(! address %in% data$address)
cat(paste(nrow(toGeocode), "addresses still need to be geolocalized", "\n"))
toGeocode = toGeocode %>% head(100)

# A function that return the GPS coordinates of an adress:
geocode <- function(address){
  address <- as.character(address)
  res <- opencage_forward(placename = address, key="aa789601867b48d6a0625233e786d7e1", limit=1)$res %>%
    dplyr::select(geometry.lat, geometry.lng)
  output <- data.frame(address=address, lat=res$geometry.lat, lon=res$geometry.lng)
  return(output)
}
# Note: threshold of 2500 per day
# Note: try it on an adress: geocode("1/115 Indooroopilly ParadeTaringa QLD 4068Australia")



# Use this function to geocode all the necessary adresses:
addresses <- as.vector(toGeocode$address)
i <- 0
dataWithGeo <- suppressWarnings(
  lapply(addresses, function(address) {
      i <<- i+1 ;
      print(paste("geocoding: ",i, " / ", length(addresses) )) ;
      return( geocode(address) )
  })  %>%
  bind_rows() %>%
  data.frame()
)
cat(paste(nrow(dataWithGeo), "addresses have successfully been geolocalized", "\n"))

# Add these new adresses to the original file that contains GPS coordinates
data <- rbind(data, dataWithGeo)
save(data, file="../DATA/adress_with_gps.RData")
cat("\nGeocoding part of the pipeline has been successfull")

# Now merge all the geolocated adresses we have with the initial file
completeInfo <- merge(input, data, by.x="address", by.y="address", all.x=FALSE, all.y=FALSE)

# Now save that in Several Files at Json format for the javascript Map

# ALL
completeInfo <- completeInfo %>% filter(!is.na(lat))
tosave <- paste("marker = ", toJSON(completeInfo))
fileConn <- file("../DATA/data.js")
writeLines(tosave, fileConn)
close(fileConn)

# QLD
completeInfo <- completeInfo %>% filter(!is.na(lat)) %>% filter(state=="QLD")
tosave <- paste("marker = ", toJSON(completeInfo))
fileConn <- file("../DATA/dataQLD.js")
writeLines(tosave, fileConn)
close(fileConn)
