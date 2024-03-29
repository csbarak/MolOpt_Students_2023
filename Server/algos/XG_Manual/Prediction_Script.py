"""
This is the file which is responsible to generate csv file containing the predicted values
"""


def make_it_rain(filename, features,id):
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
    model = pickle.load(open(f'XG_Model_Manual{id}.pkl', "rb"))
    predictions = model.predict(X_scaled)
    df=pandas.DataFrame(predictions, columns=['predictions'])
    with open(f'stats{id}_XG.txt') as f:
        lines=f.read().splitlines()
    df.loc[len(df),'predictions']=lines[0]
    df.loc[len(df),'predictions']=lines[1]
    df.to_csv(f'Predicted_Results_XG{id}.csv', header=True)
