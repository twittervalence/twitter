setwd("/var/www/example.com/public_html/twitter/GeoData/Code for KDE")
library(rgdal)
library(ks)
library(raster)
library(geojsonio)
Vienna <- readOGR(dsn="Data/Vienna",layer="Vienna")
Vienna$polarity <- as.numeric(as.character(Vienna$polarity))
extent <- readOGR("Boundary/Vienna.json")
#Boundingbox of Vienna [16.179447, 48.116822, 16.579761, 48.3249]

#Bounding box Munich [11.360777, 48.061624,	11.722908, 48.248116]

#Bounding box Brussels [4.2078, 50.7420, 4.4874, 50.9449]


#divide the data into different months
data1 <- coordinates(subset(Vienna, polarity > 0 & month == 12))
data2 <- coordinates(subset(Vienna, polarity < 0 & month == 12))
#calculate the bandwidth
#SCV
Hscv1 <- Hscv(x = data1)
#calculate the kde
kde1<-kde(x = data1, H =Hscv1, gridsize = rep(200, 2),xmin=c(16.179447, 48.116822), xmax=c(16.579761, 48.3249))
result1 <- raster(kde1)

Hscv2 <- Hscv(x = data2)
#calculate the kde
kde2 <- kde(x = data2, H =Hscv2, gridsize = rep(200, 2),xmin=c(16.179447, 48.116822), xmax=c(16.579761, 48.3249))
result2<-raster(kde2)

raster<- result2-result1
Algebra <- crop(raster, extent)
Algebra <- mask(Algebra, extent)
fun <- function(x) { x<-abs(x); x[x<100] <- 0; x[x>=100] <- 1; return (x) }
Algebra<- calc(Algebra, fun)
pal <- colorRampPalette(c("lightgrey","yellow"))
plot(Algebra, main="December", cex.main=4, col = pal(2), legend=FALSE)

