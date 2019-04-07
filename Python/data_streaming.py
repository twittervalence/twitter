# import packages
import config

import time
import json
import random
import tweepy
from tweepy import OAuthHandler, Stream, streaming


auth = OAuthHandler(config.api_key, config.api_secret)
auth.set_access_token(config.access_token, config.token_secret)
api = tweepy.API(auth)

print(api)


class Stdoutlistener_file_version(streaming.StreamListener):
    def on_data(self, data):
        with open('tweets.json', 'a', encoding='utf-8') as f:
            f.write(data)
    def on_error(self, status):
        print(status)



stdoutlistener = Stdoutlistener_file_version()

stream = Stream(auth = api.auth, listener = stdoutlistener, timeout = 30.0)

print(stream)

while True:
    try: 
        Vienna_boundingbox  = [16.1717, 48.1119, 16.6065, 48.3313]
        stream.filter(locations = Vienna_boundingbox, languages=['en,de']) # search using boudary box and language
        break
    except Exception as e:
        print('Sleep for 30 senconds when exception is raised')
        nsecs=random.randint(30,31)
        time.sleep(nsecs)
         
