def make_it_rain(filename, Num_Features,id):
    import pandas
    import os
    import pickle
    import numpy as np
    from sklearn import metrics
    from sklearn.model_selection import train_test_split
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    
    # Reading the data
    #
    dataframe = pandas.read_csv(filename)
    with open(f"TopFeaturesDTR{id}.txt") as f:
        mylist = f.read().splitlines()
    SelectedFeatures = mylist[0:Num_Features]
    X = dataframe
    X = X.drop('BOND', axis=1)
    X = X[SelectedFeatures]
    #
    # This is the target variable
    #
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    from sklearn.tree import DecisionTreeRegressor
    regressor = DecisionTreeRegressor()
    parameters = {"splitter": ["best", "random"],
                  "max_depth": [1, 5, 10, 15],
                  "min_samples_leaf": [1, 5, 10, 15],
                  "min_weight_fraction_leaf": [0.1, 0.5, 0.9],
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
    #
    # All the error metrics which we will display to the user
    #
    # Writing the error metrics to the file
    #
    #
    # Saving the project to a file
    with open(f'Decision_Tree_Regressor_NotInitial{id}.pkl','wb') as file:
        pickle.dump(tuned_hyper_model, file)
    MeanAbsoluteError = metrics.mean_absolute_error(y_test, tuned_pred)
    MeanSquaredError = metrics.mean_squared_error(y_test, tuned_pred)
    RootMeanSquaredError = np.sqrt(metrics.mean_squared_error(y_test, tuned_pred))
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
