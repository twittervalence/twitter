import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd


data = pd.read_csv('../Python/ExtractedCSV/Munich_tweet_time.csv') #choose file to process

#print(data)




tweets_date_hour = data.pivot_table(index=["year"], columns="month", values = "polarity", aggfunc='mean') #change for subjectivity and polarity attributes
f, ax = plt.subplots(figsize = (12,5))
sns.heatmap(tweets_date_hour, linewidths=.5, cmap="YlGnBu", annot=True)
ax.set_title('Munich Tweet Valence Heatmap') #set plot title
ax.set_xticklabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) # set x-axis label
sns.set(font_scale=20)
# plt.show()
plt.savefig('../Python/TimeHeatMap/Munich_tweet_time.png') #save file: change name here