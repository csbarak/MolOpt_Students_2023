def make_it_rain(filename, features,id):
    import pickle
    import os
    import pandas
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe[features]
    model = pickle.load(
        open(f'Decision_Tree_Regressor_Manual{id}.pkl',"rb"))
    predictions = model.predict(X)
    pandas.DataFrame(predictions, columns=['predictions']).to_csv(f'Predicted_Results_dtr{id}.csv', header=True)
