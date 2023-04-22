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
    #
    # Reading the data
    #
    dataframe = pandas.read_csv(filename)
    X = dataframe
    X = X.drop('BOND', axis=1)
    X = dataframe[features]
    #
    # This is the target variable
    #
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn.tree import DecisionTreeRegressor
    regressor = DecisionTreeRegressor(max_depth=param_max_depth, min_samples_split=param_min_samples_split,
                                      min_samples_leaf=param_min_samples_leaf,
                                      min_weight_fraction_leaf=param_min_weight_fraction_leaf)
    regressor.fit(X_train, y_train)
    y_pred = regressor.predict(X_test)
    #
    # All the error metrics which we will display to the user
    #
    from sklearn import metrics
    # print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
    # print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
    # print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(y_test, y_pred)))
    # Extracting top ten most influential features from the model
    # Writing the error metrics to the file
    #
    #
    MeanAbsoluteError = metrics.mean_absolute_error(y_test, y_pred)
    MeanSquaredError = metrics.mean_squared_error(y_test, y_pred)
    RootMeanSquaredError = np.sqrt(metrics.mean_squared_error(y_test, y_pred))
    MeanAbsoluteErrorWrite = str(MeanAbsoluteError)
    MeanSquaredErrorWrite = str(MeanSquaredError)
    RootMeanSquaredErrorWrite = str(RootMeanSquaredError)
    # print(MeanAbsoluteErrorWrite)
    # print(MeanSquaredErrorWrite)
    # print(RootMeanSquaredErrorWrite)
    with open(f'Decision_Tree_Regressor_Manual{id}.pkl','wb') as file:
        pickle.dump(regressor, file)
    # txt_file = open("CustomModel_rmse.txt", "w")
    # txt_file.write("The Mean Absolute Error is ")
    # txt_file.write(MeanAbsoluteErrorWrite)
    # txt_file.write("The Mean Squared Error is")
    # txt_file.write(MeanSquaredErrorWrite)
    # txt_file.write("The Root Mean Squared Error is")
    # txt_file.write(RootMeanSquaredErrorWrite)
