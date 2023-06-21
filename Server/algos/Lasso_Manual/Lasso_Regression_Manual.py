def make_it_rain(filename, features, param_alpha,id):
    import numpy as np
    from sklearn.model_selection import train_test_split
    import pandas
    import os
    import pickle
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe
    X = X.drop('BOND', axis=1)
    X = dataframe[features]
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn import linear_model
    clf = linear_model.Lasso(alpha=param_alpha)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    from sklearn import metrics
 
    with open(f'Lasso_Regression_Manual{id}.pkl', 'wb') as file:
        pickle.dump(clf, file)

    r2_score = str(metrics.r2_score(y_test, y_pred))
    MeanSquaredError = str(metrics.mean_squared_error(y_test, y_pred))
    with open(f'stats{id}_Lasso.txt', 'w') as f:
        f.write(f'MSE:{MeanSquaredError}\n')
        f.write(f'r2_Score:{r2_score}')
