def make_it_rain(filename):
    import pandas
    import os
    import numpy as np
    from sklearn.model_selection import train_test_split
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe
    X = X.drop('BOND', axis=1)
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn.tree import DecisionTreeRegressor
    regressor = DecisionTreeRegressor()
    parameters = {"splitter": ["best", "random"],
                  "max_depth": [1, 5, 10, 15],
                  "min_samples_leaf": [1, 5, 10, 15],
                  "min_weight_fraction_leaf": [0.1, 0.5],
                  "max_features": ["auto", "log2", "sqrt", None],
                  "max_leaf_nodes": [None, 10, 30, 50, 70, 90]}
    from sklearn.model_selection import GridSearchCV
    tuning_model = GridSearchCV(regressor, param_grid=parameters, scoring='neg_mean_squared_error', cv=3, verbose=3)
    tuning_model.fit(X_train, y_train)
    best_parameters = tuning_model.best_params_
    max_depth_value = best_parameters['max_depth']
    max_features_value = best_parameters['max_features']
    max_leaf_nodes_value = best_parameters['max_leaf_nodes']
    min_samples_leaf_value = best_parameters['min_samples_leaf']
    min_weight_fraction_leaf_value = best_parameters['min_weight_fraction_leaf']
    splitter_selected = best_parameters['splitter']
    tuned_hyper_model = DecisionTreeRegressor(max_depth=max_depth_value, max_features=max_features_value,
                                              max_leaf_nodes=max_leaf_nodes_value,
                                              min_samples_leaf=min_samples_leaf_value,
                                              min_weight_fraction_leaf=min_weight_fraction_leaf_value,
                                              splitter=splitter_selected)
    tuned_hyper_model.fit(X_train, y_train)
    tuned_pred = tuned_hyper_model.predict(X_test)
    # All the error metrics which we will display to the user
    #
    from sklearn import metrics
    print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, tuned_pred))
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, tuned_pred))
    print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(y_test, tuned_pred)))
    # Extracting top ten most influential features from the model
    features = dataframe.drop('BOND', axis=1).columns
    importances = tuned_hyper_model.feature_importances_
    indices = np.argsort(importances)
    important_feature = []
    for i in range(len(indices)):
        for i in indices:
            important_feature.append(features[i])
    top_important_features = important_feature[0:10]
    arr = np.array(top_important_features)
    with open("TopFeatures.txt", "w") as txt_file:
        for line in arr:
            txt_file.write("".join(line) + "\n")  # works with any number of elements in a line
    # Writing the error metrics to the file
    #
    #
    MeanAbsoluteError = metrics.mean_absolute_error(y_test, tuned_pred)
    MeanSquaredError = metrics.mean_squared_error(y_test, tuned_pred)
    RootMeanSquaredError = np.sqrt(metrics.mean_squared_error(y_test, tuned_pred))
    MeanAbsoluteErrorWrite = str(MeanAbsoluteError)
    MeanSquaredErrorWrite = str(MeanSquaredError)
    RootMeanSquaredErrorWrite = str(RootMeanSquaredError)

    txt_file = open("CustomModel_rmse.txt", "w")
    txt_file.write("The Mean Absolute Error is ")
    txt_file.write(MeanAbsoluteErrorWrite)
    txt_file.write("The Mean Squared Error is")
    txt_file.write(MeanSquaredErrorWrite)
    txt_file.write("The Root Mean Squared Error is")
    txt_file.write(RootMeanSquaredErrorWrite)
