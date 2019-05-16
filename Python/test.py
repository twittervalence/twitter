import seaborn as sns
import matplotlib.pyplot as plt
import geopandas as gpd


# read one-week tweets during the 2017 munich october fest 
one_week_gdf = gpd.read_file('Exercises_Data/tweet_201709_16_22.geojson', encoding = 'utf-8')

# visualization: heatmap of the frequency of 7 days * 24 hours tweets 
'''
dates = one_week_gdf['date'].as_matrix()
plt.hist(dates, bins= 7, range=[0,7], facecolor='#a9f971', edgecolor='black', linewidth=0.8, normed = 3)
# plt.xlim(0,10)
# plt.xticks(np.arange(0, 100, 1), size= 20)
# plt.yticks(np.arange(0, 1, 0.1), size= 20)
plt.show()
'''

# using sns to generate 7days * 24 hours visulizations
tweets_date_hour = one_week_gdf.pivot_table(index=['date'], columns='hour', values = 'id', aggfunc= 'count')
f, ax = plt.subplots(figsize = (12,5))
sns.heatmap(tweets_date_hour, linewidths=.5, cmap="YlGn")
sns.set(font_scale= 20)
plt.show()







