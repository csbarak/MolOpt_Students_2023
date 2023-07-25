def make_it_rain(filename,predfile, features, param_learning_rate, param_max_depth, param_lambda, param_alpha, param_rate_drop,id):
    import pandas
    import os
    import pickle
    from xgboost import XGBRegressor
    from sklearn.model_selection import train_test_split
    from sklearn import metrics
    from sklearn.preprocessing import LabelEncoder
    from sklearn.preprocessing import StandardScaler
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    features=features.split(',')
    dataframe = pandas.read_csv(filename)
    X = dataframe[features]
    Y = dataframe['BOND']
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    label_encoder = LabelEncoder()
    Y_encoded = label_encoder.fit_transform(Y)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, Y_encoded, random_state=0)
    model = XGBRegressor(verbosity=2,
                         booster='gbtree',
                         learning_rate=int(param_learning_rate),
                         max_depth=int(param_max_depth),
                         reg_lambda=int(param_lambda),
                         reg_alpha=int(param_alpha),
                         rate_drop=int(param_rate_drop),
                         objective='reg:squarederror',
                         eval_metric='rmse')
    model.fit(X_train, y_train)
    y_pred=model.predict(X_test)
    r2_score = str(metrics.r2_score(y_test, y_pred))
    MeanSquaredError = str(metrics.mean_squared_error(y_test, y_pred))
    pred_data = pandas.read_csv(predfile)
    X = pred_data[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    predictions = model.predict(X_scaled)
    df=pandas.DataFrame(predictions, columns=['predictions'])
    df.loc[len(df),'predictions']=f'MSE:{MeanSquaredError}\n'
    df.loc[len(df),'predictions']=f'r2_Score:{r2_score}'
    df.to_csv(f'Predicted_Results_XG{id}.csv', header=True)