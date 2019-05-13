import json
import matplotlib.pyplot as plt
import pandas as pd
from dateutil import tz
from datetime import datetime


with open("Vienna_tweet.json") as datafile:
    data = json.load(datafile)

df = pd.DataFrame(data)

# calculate the lenght of records in the file
flen = len(df)

for i in range(len(df)):
    fTime = df['features'][i]['properties']['Time']
    new_prop = df['features'][i]['properties']

    date = datetime.strptime(fTime, "%Y-%m-%d %H:%M:%S").date()
    time = datetime.strptime(fTime, "%Y-%m-%d %H:%M:%S").time()

    new_prop['year'] = date.year
    new_prop['month'] = date.month
    new_prop['day'] = date.day
    new_prop['hour'] = time.hour
    new_prop['min'] = time.minute
    new_prop['sec'] = time.second


df.to_json(r'Vienna_tweet_time.json', orient='records')
