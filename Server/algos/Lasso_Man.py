def make_it_rain(filename,predfile, features, param_alpha,id):
    from sklearn.model_selection import train_test_split
    from sklearn import metrics
    import pandas
    import os
    from sklearn.preprocessing import StandardScaler
    from sklearn import linear_model
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    features=features.split(',')
    X = dataframe
    X = X.drop('BOND', axis=1)
    X = dataframe[features]
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    clf = linear_model.Lasso(alpha=param_alpha)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    r2_score = str(metrics.r2_score(y_test, y_pred))
    MeanSquaredError = str(metrics.mean_squared_error(y_test, y_pred))
    data_pred = pandas.read_csv(predfile)
    X = data_pred[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    predictions = clf.predict(X_scaled)
    df=pandas.DataFrame(predictions, columns=['predictions'])
    df.loc[len(df),'predictions']=f'MSE:{MeanSquaredError}\n'
    df.loc[len(df),'predictions']=f'r2_Score:{r2_score}'
    df.to_csv(f'Predicted_Results_Lasso{id}.csv', header=True)