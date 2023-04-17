def make_it_train(filename, features, param_learning_rate, param_max_depth, param_lambda, param_alpha, param_rate_drop):
    import pandas
    import os
    import pickle
    from xgboost import XGBRegressor
    from sklearn.model_selection import train_test_split
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe[features]
    Y = dataframe['BOND']
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    from sklearn.preprocessing import LabelEncoder
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
    eval_metric = ["rmse"]
    print(eval_metric)
    model.fit(X_train, y_train, eval_metric=eval_metric)
    with open('Your_model.pkl', 'wb') as file:
        pickle.dump(model, file)
