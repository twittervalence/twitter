from textblob import TextBlob # package found here: https://pypi.org/project/textblob/
import csv



with open('../Data/munich.csv','r') as csvinput:
    with open('./Data/munich_new.csv', 'w') as csvoutput:
        fieldnames = ['user_id','time','lang','text','arc_id','x','y','polarity','subjectivity']

        writer = csv.writer(csvoutput, fieldnames=fieldnames, lineterminator='\n')
        reader = csv.reader(csvinput)
        text_blob = TextBlob(csvinput['text'])
        polarity = text_blob.polarity
        subjectivity = text_blob.subjectivity

        all = []
        row = next(reader)
        row.append(["polarity","subjectivity"])
        all.append(row)

        for row in reader:
            row.append(row[0])
            all.append(row)
        writer.writerows(all)