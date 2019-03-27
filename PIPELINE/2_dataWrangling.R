# --------------
# Data Wrangling
# --------------

# INPUT
#     - DEMOG -> A list of adresses to geocode
#     - PRIMARY VISIT -> one row per patient, information of their first visit
#     - SUBSEQUENT VISIT -> several rows per patient, information of all their subsequent visit

# OUTPUT
#     - One file that merges the information of the 3 inputs

# setwd("~/Desktop/Mapping-patients/PIPELINE")

# Libraries necessary:
suppressWarnings(library(dplyr)) # data manipulation
suppressWarnings(library(lubridate)) # data manipulation
suppressWarnings(library(readxl)) # data manipulation



# ----------
# Load AND clean demographic data
# ----------

# Load + build complete address + select interesting fields
demog <- read_excel("../DATA/demog.xlsx") %>%
  mutate(address=paste( `Address - Thoroughfare (i.e. Street address)`, `Address - Locality (i.e. City)`, `Address - Postal code`, `Address - Administrative area (i.e. State / Province)`)) %>%
  dplyr::select( `Study ID`, `Date of Birth`, `Date of Death`, Gender, `Registration Date`, `Living Status`, address)

# Rename columns
colnames(demog) <- c("id", "birthDate", "deathDate", "gender", "registrationDate", "livingStatus", "address")

# Convert to date format
demog$registrationDate <- gsub(" UTC","",demog$registrationDate) %>% ymd()
demog$birthDate <- demog$birthDate %>% gsub("^[^, ]*, ","", .) %>% gsub(" ","-",.) %>% gsub(",","",.) %>% mdy()



# ----------
# Load AND clean Primary Visit
# ----------

# Load data + select helpful columns
primary <- read_excel("../DATA/primary.xlsx") %>%
  dplyr::select( `Study ID`, `First Visit Date`, `MND Family History`, `MND Type`, `ALSFRS Calc`, `Date of Onset of MND ALS Symptoms`, `Side of Body`, `Date of Diagnosis` )

# Rename columns
colnames(primary) <- c("id", "firstVisitDate", "familyHistory", "type", "alsfrs", "onsetDate", "side", "diagnosisDate")

# Convert to date format. NOTE -> Some date are lost because of weird formats.
primary$firstVisitDate <- primary$firstVisitDate %>% gsub(" UTC","",.) %>% ymd()
primary$onsetDate <- as.Date(as.numeric(primary$onsetDate), origin = "1899-12-30") 
primary$diagnosisDate <- as.Date(as.numeric(primary$diagnosisDate), origin = "1899-12-30") 

# Column type needs to be transformed:
primary <- primary %>%
  mutate(type = case_when( 
    type == "Bulbar" ~ "Bulbar",
    type == "Unclassified" ~ "Unclassified",
    type == "LMN_predominant" ~ "Lower",
    type == "UMN_predominant" ~ "Upper",
    type == "Classic_ALS" ~ "Classic",
    TRUE ~ "Other"
  )
)

# Column side needs to be transformed:
primary <- primary %>%
  mutate(side = case_when( 
    side == "RHS" ~ "Right",
    side == "LHS" ~ "Left",
    side == "LHS, RHS" ~ "Both",
    TRUE ~ "Unknown"
  )
  )



# ----------
# MERGE files together
# ----------

output <- merge(demog , primary, by.x="id", by.y="id", all.y=FALSE)



# ----------
# ADD VARIABLES?
# ----------

# What is the age at diagnosis?
output <- output %>%
  mutate(ageAtDiagnosis = diagnosisDate - birthDate) %>%
  mutate(ageAtDiagnosis = case_when( 
    ageAtDiagnosis < 14600 ~ "<40",
    ageAtDiagnosis >= 14600 & ageAtDiagnosis < 18250 ~ "40-50",
    ageAtDiagnosis >= 18250 & ageAtDiagnosis < 21900 ~ "50-60",
    ageAtDiagnosis >= 21900 ~ ">60",
    TRUE ~ "Unknown"
  )
  )





# ----------
# Save data in a .RData object
# ----------

save(output, file = "../DATA/mergedData.Rdata")


















