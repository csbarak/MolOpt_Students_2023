def make_it_rain(filename, features, param_alpha,id):
    # Importing the required libraries
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
    # This is the target variable
    #
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn import linear_model
    clf = linear_model.Lasso(alpha=param_alpha)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    #
    # All the error metrics which we will display to the user
    #
    from sklearn import metrics
    print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
    print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(y_test, y_pred)))
    MeanAbsoluteError = metrics.mean_absolute_error(y_test, y_pred)
    MeanAbsoluteErrorWrite = str(MeanAbsoluteError)
    MeanSquaredError = metrics.mean_squared_error(y_test, y_pred)
    MeanSquaredErrorWrite = str(MeanSquaredError)
    RootMeanSquaredError = np.sqrt(metrics.mean_squared_error(y_test, y_pred))
    RootMeanSquaredErrorWrite = str(RootMeanSquaredError)
    print(MeanSquaredErrorWrite)
    print(MeanAbsoluteErrorWrite)
    print(RootMeanSquaredErrorWrite)
    with open(f'Lasso_Regression_Manual{id}.pkl', 'wb') as file:
        pickle.dump(clf, file)
    # txt_file = open("CustomModel_rmse.txt", "w")
    # txt_file.write("The Mean Absolute Error is ")
    # txt_file.write(MeanAbsoluteErrorWrite)
    # txt_file.write("The Mean Squared Error is")
    # txt_file.write(MeanSquaredErrorWrite)
    # txt_file.write("The Root Mean Squared Error is")
    # txt_file.write(RootMeanSquaredErrorWrite)
