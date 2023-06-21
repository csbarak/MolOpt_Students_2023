def make_it_rain(filename, num_pred_features,id):
    import pandas
    import pickle
    import os
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    with open(f"TopFeaturesXG{id}.txt") as f:
        mylist = f.read().splitlines()
    SelectedFeatures = mylist[0:num_pred_features]
    X = dataframe
    X = X[SelectedFeatures]
    model = pickle.load(open(f'Expert_Mode_NotInitial{id}.pkl', "rb"))
    predictions = model.predict(X)
    df=pandas.DataFrame(predictions, columns=['predictions'])
    with open(f'stats{id}_XG.txt') as f:
        lines=f.read().splitlines()
    df.loc[len(df),'predictions']=lines[0]
    df.loc[len(df),'predictions']=lines[1]
    df.to_csv(f'Predicted_Results_XG{id}.csv', header=True)