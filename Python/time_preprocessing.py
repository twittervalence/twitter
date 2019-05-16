import json
import pandas as pd
from datetime import datetime


with open("Vienna_tweet.json") as datafile:
    data = json.load(datafile)

df = pd.DataFrame(data)

# calculate the length of records in the file
flen = len(df)

for i in range(len(df)):
    fTime = df['features'][i]['properties']['Time']
    new_prop = df['features'][i]['properties']

    date = datetime.strptime(fTime, "%Y-%m-%d %H:%M:%S").date()
    time = datetime.strptime(fTime, "%Y-%m-%d %H:%M:%S").time()

    new_prop['year'] = str(date.year) # converting to string
    new_prop['month'] = str(date.month) # converting to string
    new_prop['day'] = str(date.day) # converting to string
    new_prop['hour'] = str(time.hour) # converting to string
    new_prop['min'] = str(time.minute) # converting to string
    new_prop['sec'] = str(time.second) # converting to string


df.to_json(r'Vienna_tweet_time_new.json', orient='records')
