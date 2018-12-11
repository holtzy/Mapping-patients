# --------------
# Geocoding adresses
# --------------

# This script takes 2 inputs:
#     - A list of adresses to geocode
#     - A list of adresses that have already been geocoded
# It geocodes adresses that haven't been geocoded yet using the opencage library


# setwd("/Users/y.holtz/Dropbox/QBI/18_SHOW_PATIENT_ON_MAP/NOVEMBER_2018")

# Libraries necessary:
suppressWarnings(library(dplyr)) # data manipulation
suppressWarnings(library(opencage)) # geocoding
suppressWarnings(library(jsonlite)) # json output

# Load the list of adresses to geocode
input <- read.table("DATA/input.csv", header=T, sep=",") %>%
  mutate(Address = gsub("\n", "", Address))
cat(paste(nrow(input), "addresses in the input file", "\n"))

# Load the list of adresses we already have geocoded
load("adress_with_gps.RData")
cat(paste(nrow(data), "addresses are already geolocalized", "\n"))

# List of adresses to geocode?
toGeocode <- input %>%
  filter(! Address %in% data$address)
cat(paste(nrow(toGeocode), "addresses still need to be geolocalized", "\n"))
toGeocode = toGeocode %>% head(5)

# A function that return the GPS coordinates of an adress:
geocode <- function(address){
  address <- as.character(address)
  res <- opencage_forward(placename = address, key="aa789601867b48d6a0625233e786d7e1", limit=1)$result %>%
    select(geometry.lat, geometry.lng)
  output=data.frame(address=address, lat=res$geometry.lat, lon=res$geometry.lng)
  return(output)
}
# Note: threshold of 2500 per day
# Note: try it on an adress: geocode("1/115 Indooroopilly ParadeTaringa QLD 4068Australia")

# Use this function to geocode all the necessary adresses:
addresses <- as.vector(toGeocode$Address)
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
colnames(data) <- colnames(dataWithGeo)
data <- rbind(data, dataWithGeo)
save(data, file="adress_with_gps.RData")
cat("\nGeocoding part of the pipeline has been successfull")

# Now merge all the geolocated adresses we have with the initial file
completeInfo <- merge(input, data, by.x="Address", by.y="address", all.x=TRUE)

# Now save that in a Json format for the javascript Map
completeInfo <- completeInfo %>% filter(!is.na(lat))
tosave <- paste("marker = ", toJSON(completeInfo))
fileConn<-file("data.js")
writeLines(tosave, fileConn)
close(fileConn)
