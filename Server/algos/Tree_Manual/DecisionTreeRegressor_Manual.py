def make_it_train(filename, features, param_max_depth, param_min_samples_split, param_min_samples_leaf,
                  param_min_weight_fraction_leaf,id):
    # Importing the required libraries
    import pandas
    import os
    import pickle
    import numpy as np
    from sklearn.model_selection import train_test_split
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)

    dataframe = pandas.read_csv(filename)
    features=features.split(',')

    X = dataframe[features]

    Y = dataframe['BOND']

    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn.tree import DecisionTreeRegressor
    regressor = DecisionTreeRegressor(max_depth=param_max_depth, min_samples_split=param_min_samples_split,
                                      min_samples_leaf=param_min_samples_leaf,
                                      min_weight_fraction_leaf=param_min_weight_fraction_leaf)
    regressor.fit(X_train, y_train)
    y_pred = regressor.predict(X_test)

    from sklearn import metrics

    with open(f'Decision_Tree_Regressor_Manual{id}.pkl','wb') as file:
        pickle.dump(regressor, file)

    r2_score = str(metrics.r2_score(y_test, y_pred))
    MeanSquaredError = str(metrics.mean_squared_error(y_test, y_pred))
    with open(f'stats{id}_DTR.txt', 'w') as f:
        f.write(f'MSE:{MeanSquaredError}\n')
        f.write(f'r2_Score:{r2_score}')
