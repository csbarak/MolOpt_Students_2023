"""
This is the file which is responsible to generate csv file containing the predicted values
"""


def make_it_rain(filename, num_pred_features):
    import pandas
    import pickle
    import os
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    with open("TopFeatures.txt") as f:
        mylist = f.read().splitlines()
    SelectedFeatures = mylist[0:num_pred_features]
    X = dataframe
    X = X[SelectedFeatures]
    model = pickle.load(open('Lasso_Regression_NotInitial.pkl', "rb"))
    predictions = model.predict(X)
    pandas.DataFrame(predictions, columns=['predictions']).to_csv('Predicted_Results.csv', header=True)
