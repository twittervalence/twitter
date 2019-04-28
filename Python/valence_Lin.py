import csv
from textblob import TextBlob
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

#HappyEmoticons
emoticons_happy = set([
    ':-)', ':)', ';)', ':o)', ':]', ':3', ':c)', ':>', '=]', '8)', '=)', ':}',
    ':^)', ':-D', ':D', '8-D', '8D', 'x-D', 'xD', 'X-D', 'XD', '=-D', '=D',
    '=-3', '=3', ':-))', ":'-)", ":')", ':*', ':^*', '>:P', ':-P', ':P', 'X-P',
    'x-p', 'xp', 'XP', ':-p', ':p', '=p', ':-b', ':b', '>:)', '>;)', '>:-)',
    '<3'
    ])
# Sad Emoticons
emoticons_sad = set([
    ':L', ':-/', '>:/', ':S', '>:[', ':@', ':-(', ':[', ':-||', '=L', ':<',
    ':-[', ':-<', '=\\', '=/', '>:(', ':(', '>.<', ":'-(", ":'(", ':\\', ':-c',
    ':c', ':{', '>:\\', ';('
    ])
emoticons = emoticons_happy.union(emoticons_sad)
#Emoji patterns
emoji_pattern = re.compile("["
         u"\U0001F600-\U0001F64F"  # emoticons
         u"\U0001F300-\U0001F5FF"  # symbols & pictographs
         u"\U0001F680-\U0001F6FF"  # transport & map symbols
         u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
         u"\U00002702-\U000027B0"
         u"\U000024C2-\U0001F251"
         "]+", flags=re.UNICODE)

def clean_tweets(tweet):
    tweet = str(tweet)
    stop_words = set(stopwords.words('english'))
    # after tweepy preprocessing the colon symbol left remain after      #removing mentions
    tweet = re.sub(r':', '', tweet)
    tweet = re.sub(r'‚Ä¶', '', tweet)
    # replace consecutive non-ASCII characters with a space
    tweet = re.sub(r'[^\x00-\x7F]+', ' ', tweet)
    # remove emojis from tweet
    tweet = emoji_pattern.sub(r'', tweet)
    # delete the hyperlinks
    tweet = re.sub(r"http\S+", "", tweet)
    word_tokens = word_tokenize(tweet)
    # filter using NLTK library append it to a string
    filtered_tweet = []
    # looping through conditions
    for w in word_tokens:
        # check tokens against stop words , emoticons and punctuations
        if w not in stop_words and w not in emoticons and w not in string.punctuation:
            filtered_tweet.append(w)
    return ' '.join(filtered_tweet)

with open('Brussel.csv', 'r',encoding='utf-8') as csvFile:
    with open('Brussel_new.csv', 'w', encoding='utf-8') as NewFile:
        fieldnames = ['user_id','time','lang','text','arc_id','x','y','polarity','subjectivity']
        writer = csv.DictWriter(NewFile, delimiter=';',fieldnames=fieldnames,extrasaction='ignore')
        writer.writeheader()
        reader = csv.DictReader(csvFile)
        for row in reader:
            # print(row['text'])
            clean_text = clean_tweets(row['text'])
            # print (clean_text)
            blob = TextBlob(clean_text)
            Sentiment = blob.sentiment
            row['polarity'] = Sentiment.polarity
            row['subjectivity'] = Sentiment.subjectivity
            row['text'] = clean_text
            writer.writerow(dict(row))
            print(dict(row))
NewFile.close()
csvFile.close()
