def make_it_rain(filename, Num_Features,id):
    import pandas
    import pickle
    import os
    import numpy as np
    from sklearn import metrics
    from sklearn import linear_model
    from sklearn.pipeline import Pipeline
    from sklearn.linear_model import Lasso
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split, GridSearchCV
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    with open(f"TopFeaturesLasso{id}.txt") as f:
        mylist = f.read().splitlines()
    SelectedFeatures = mylist[0:Num_Features]
    X = dataframe
    X = X.drop('BOND', axis=1)
    X = X[SelectedFeatures]
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', Lasso())
    ])
    search = GridSearchCV(pipeline, {'model__alpha': np.arange(0.1, 10, 0.5)}, cv=5,
                          scoring="neg_mean_squared_error", verbose=3)
    search.fit(X_train, y_train)
    optimum_alpha = search.best_params_.get('model__alpha')
    clf = linear_model.Lasso(alpha=optimum_alpha)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    with open(f'Lasso_Regression_NotInitial{id}.pkl', 'wb') as file:
        pickle.dump(clf, file)
    MeanAbsoluteError = metrics.mean_absolute_error(y_test, y_pred)
    MeanSquaredError = metrics.mean_squared_error(y_test, y_pred)
    RootMeanSquaredError = np.sqrt(metrics.mean_squared_error(y_test, y_pred))
    MeanAbsoluteErrorWrite = str(MeanAbsoluteError)
    MeanSquaredErrorWrite = str(MeanSquaredError)
    RootMeanSquaredErrorWrite = str(RootMeanSquaredError)
    # txt_file = open("CustomModel_rmse.txt", "w")
    # txt_file.write("The Mean Absolute Error is ")
    # txt_file.write(MeanAbsoluteErrorWrite)
    # txt_file.write("The Mean Squared Error is")
    # txt_file.write(MeanSquaredErrorWrite)
    # txt_file.write("The Root Mean Squared Error is")
    # txt_file.write(RootMeanSquaredErrorWrite)
