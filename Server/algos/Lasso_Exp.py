def make_it_rain(filename,predfile,Num_Features,id):
    import os
    import pandas
    import numpy as np
    from sklearn import metrics
    from sklearn import linear_model
    from sklearn.pipeline import Pipeline
    from sklearn.linear_model import Lasso
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split, GridSearchCV
    from django.core.files.storage import FileSystemStorage
    fs = FileSystemStorage()
    os.chdir(fs.location)
    dataframe = pandas.read_csv(filename)
    X = dataframe
    X = X.drop('BOND', axis=1)
    Y = dataframe['BOND']
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', Lasso())
    ])
    search = GridSearchCV(pipeline, {'model__alpha': np.arange(0.1, 10, 0.5)}, cv=5,
                          scoring="neg_mean_squared_error", verbose=3)
    search.fit(X_train, y_train)
    optimum_alpha = search.best_params_.get('model__alpha')
    clf = linear_model.Lasso(alpha=optimum_alpha)
    clf.fit(X_train, y_train)
    features = X.columns
    coefficients = clf.coef_
    importance = np.abs(coefficients)
    ImportantFeatures = list(np.array(features)[importance > 0])
    TopImportantFeatures = ImportantFeatures[0:Num_Features]
    arr = np.array(TopImportantFeatures)
    X = X[arr]
    X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=0)
    search.fit(X_train, y_train)
    optimum_alpha = search.best_params_.get('model__alpha')
    clf = linear_model.Lasso(alpha=optimum_alpha)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    r2_score = str(metrics.r2_score(y_test, y_pred))
    MeanSquaredError = str(metrics.mean_squared_error(y_test, y_pred))

    pred_data = pandas.read_csv(predfile)
    X = pred_data
    X = X[arr]
    predictions = clf.predict(X)
    df=pandas.DataFrame(predictions, columns=['predictions'])
    df.loc[len(df),'predictions']=f'MSE:{MeanSquaredError}\n'
    df.loc[len(df),'predictions']=f'r2_Score:{r2_score}'
    df.to_csv(f'Predicted_Results_Lasso{id}.csv', header=True)