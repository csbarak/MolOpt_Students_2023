def make_it_rain(filename, features,id):
    import pickle
    import os
    import pandas
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe[features]
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model = pickle.load(open(f'Lasso_Regression_Manual{id}.pkl', "rb"))
    predictions = model.predict(X_scaled)
    pandas.DataFrame(predictions, columns=['predictions']).to_csv(f'Predicted_Results_Lasso{id}.csv', header=True)
