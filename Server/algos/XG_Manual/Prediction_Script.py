"""
This is the file which is responsible to generate csv file containing the predicted values
"""


def make_it_rain(filename, features):
    import pandas
    import pickle
    import os
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe[features]
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model = pickle.load(open('Your_model.pkl', "rb"))
    predictions = model.predict(X_scaled)
    pandas.DataFrame(predictions, columns=['predictions']).to_csv('Results.csv',header=True)
