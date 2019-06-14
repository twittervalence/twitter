setwd("/var/www/example.com/public_html/twitter/GeoData/Code for KDE")
library(rgdal)
library(ks)

Munich<-readOGR(dsn="Data/Munich",layer="Munich")
Munich$polarity<-as.numeric(as.character(Munich$polarity))
Munich$month <-Munich$month #months -- as.factor() to see the level
#divide the data into different months
jan <- subset(Munich, Munich$month == 1)
feb <- subset(Munich, Munich$month == 2)
mar <- subset(Munich, Munich$month == 3)
apr <- subset(Munich, Munich$month == 4)
may <- subset(Munich, Munich$month == 5)
jun <- subset(Munich, Munich$month == 6)
jul <- subset(Munich, Munich$month == 7)
aug <- subset(Munich, Munich$month == 8)
sep <- subset(Munich, Munich$month == 9)
oct <- subset(Munich, Munich$month == 10)
nov <- subset(Munich, Munich$month == 11)
dec <- subset(Munich, Munich$month == 12)

Hscv = Hscv(x = jan)

kde(coordinates(subset(jan, jan$polarity > 0)), H = Hscv)


par(mfrow=c(3,4))

kde_series <- function(data){
  #calculate the bandwidth
  #plug-in method
  Hpi <- Hpi(x = data)
  #LSCV
  Hlscv <- Hlscv(x=data)
  #BCV
  Hbcv <- Hbcv(x = data)
  #SCV
  Hscv <- Hscv(x = data)
  
  #calculate the kde
  kde1<-kde(x = data, H =Hpi)
  kde2<-kde(x = data, H =Hlscv)
  kde3<-kde(x = data, H =Hbcv)
  kde4<-kde(x = data, H =Hscv)
  
  #plot the kde
  plot(kde1,xlab="X",ylab="Y",main="Plug-in",display="filled.contour2")
  plot(kde2,xlab="X",ylab="Y",main="Lscv",display="filled.contour2")
  plot(kde3,xlab="X",ylab="Y",main="BCV",display="filled.contour2")
  plot(kde4,xlab="X",ylab="Y",main="SCV",display="filled.contour2")
  
}

for (i in 10:11){
  data <- coordinates(subset(Munich, polarity > 0 & month == i))
  kde_series(data)
}


