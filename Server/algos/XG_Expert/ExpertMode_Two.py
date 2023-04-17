def make_it_rain(filename, Num_Features):
    import pandas
    import os
    import pickle
    import xgboost as xgb
    from sklearn.model_selection import GridSearchCV
    from xgboost import XGBRegressor
    from sklearn.metrics import mean_squared_error
    from sklearn.model_selection import train_test_split
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    with open("TopFeatures.txt") as f:
        mylist = f.read().splitlines()
    SelectedFeatures = mylist[0:Num_Features]

    def algorithm_pipeline(X_train_data, X_test_data, y_train_data, y_test_data,
                           model, param_grid, cv=10, scoring_fit='neg_mean_squared_error',
                           do_probabilities=False):
        gs = GridSearchCV(
            estimator=model,
            param_grid=param_grid,
            cv=cv,
            n_jobs=-1,
            scoring=scoring_fit,
            verbose=2,
        )
        fitted_model = gs.fit(X_train_data, y_train_data)

        if do_probabilities:
            pred = fitted_model.predict_proba(X_test_data)
        else:
            pred = fitted_model.predict(X_test_data)

        return fitted_model, pred

    X = dataframe
    X = X.drop('BOND', axis=1)
    X = X[SelectedFeatures]
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    model = xgb.XGBRegressor()
    param_grid = {
        'n_estimator': [350, 650, 950],
        'colsample_bytree': [0.25, 0.65, 0.8],
        'max_depth': [8, 11, 14],
        'reg_alpha': [0.75, 1.4, 1.6],
        'reg_lambda': [0.43, 0.65, 1.3],
        'subsample': [0.6, 0.85, 0.9]
    }
    model, pred = algorithm_pipeline(X_train, X_test, y_train, y_test, model, param_grid, cv=5)
    sample = model.best_params_
    colsample_value = sample['colsample_bytree']
    maxdepth_value = sample['max_depth']
    nestimators_value = sample['n_estimator']
    regalpha_value = sample['reg_alpha']
    reglambda_value = sample['reg_lambda']
    subsample_value = sample['subsample']
    model1 = XGBRegressor(verbosity=2,
                          colsample_bytree=colsample_value,
                          max_depth=maxdepth_value,
                          objective='reg:squarederror',
                          n_estimators=nestimators_value,
                          reg_alpha=regalpha_value,
                          reg_lambda=reglambda_value,
                          subsample=subsample_value,
                          )
    model1.fit(X_train, y_train)
    preds = model1.predict(X_test)
    error_value = mean_squared_error(y_test, preds)
    value = str(error_value)
    print("Final RMSE Value: ", error_value)
    with open('Expert_Mode_NotInitial.pkl', 'wb') as file:
        pickle.dump(model1, file)
    txt_file = open("CustomModel_rmse.txt", "w")
    txt_file.write(value)
