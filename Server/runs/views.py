import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from algorithms.MCS_Module import MCS_Script
from algorithms.Chemical_Descriptor_Extraction import Mordred_Features_Script,RDKit_Features_Script
from algorithms.XGBoost_Algorithm.Manual_Mode import Model_Training_Script
from .models import Run # models is the data base?
from .serializers import *
from rdkit import Chem
from rdkit.Chem import AllChem
from django.core.files.storage import FileSystemStorage

@api_view(['GET', 'POST'])
def runs_list(request): # get all runs
    if request.method == 'GET':
        data = Run.objects.all()
        serializer = RunSerializer(data, context={'request': request}, many=True)
        
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RunSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def runs_list(request, email): # get runs of specific user
    if request.method == 'GET':
        data =  Run.objects.get(email=email)
        serializer = RunSerializer(data, context={'request': request}, many=True)
        
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RunSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def mol_align(request):
    if request.method=='POST':
        reffile = request.FILES['ref']
        dbfile = request.FILES['db']
        fs = FileSystemStorage()
        fs.save(reffile.name,reffile)
        fs.save(dbfile.name,dbfile)
        try:
            MCS_Script.make_it_run(reffile.name,dbfile.name)
        except:
            serializer = RunSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
            

def feature_extraction(request):
    if request.method=='POST':
        molfile = request.FILES['mol']
        fs = FileSystemStorage()
        fs.save(molfile.name,molfile)
        body = json.loads(request.body)
        if body["rdkit"]:
            RDKit_Features_Script.make_it_run(molfile.name)
        if body["mordred"]:
            Mordred_Features_Script.make_it_run(molfile.name)  


def feature_extraction(request):
    if request.method=='POST':
        dsfile = request.FILES['ds']
        fs = FileSystemStorage()
        fs.save(dsfile.name,dsfile)
        body = json.loads(request.body)
        if body["xgboost"]:
            Model_Training_Script.make_it_train(dsfile.name,body["xgfeatures"],body["learningrate"],body["maxdepth"],body["lambda"],body["alpha"],body["ratedrop"])
        if body["lasso"]:
            print("todo lasso")
        if body["decisiontree"]:
            print("todo decisiontree")
        if body["binding"]:
            print("todo binding")

def mol_align_ap(request):
    if request.method=='POST':
        reffile = request.FILES['ref']
        dbfile = request.FILES['db']
        fs = FileSystemStorage()
        fs.save(reffile.name,reffile)
        fs.save(dbfile.name,dbfile)
        MCS_Script.make_it_run(reffile.name,dbfile.name)
        suppl = Chem.SDMolSupplier('aligned.sdf')
        for mol in suppl:
            if mol is not None:
                AllChem.MolToMolFile(mol, 'aligned.mol2', includeStereo=True)
            body = json.loads(request.body)
            if body["rdkit"]:
                RDKit_Features_Script.make_it_run("aligned.mol2")
            if body["mordred"]:
                Mordred_Features_Script.make_it_run("aligned.mol2")    
            if body["xgboost"]:
                Model_Training_Script.make_it_train("aligned.mol2",body["xgfeatures"],body["learningrate"],body["maxdepth"],body["lambda"],body["alpha"],body["ratedrop"])
            if body["lasso"]:
                print("todo lasso")
            if body["decisiontree"]:
                print("todo decisiontree")
            if body["binding"]:
                print("todo binding")
        
def feature_extraction(request):
    body = json.loads(request.body)
    if body["rdkit"]:
        RDKit_Features_Script.make_it_run(request.FILES['file'])
    if body["mordred"]:
        Mordred_Features_Script.make_it_run(request.FILES['file']) 

@api_view(['PUT', 'DELETE'])
def runs_detail(request, email):
    try:
        run = Run.objects.get(email=email)
    except Run.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = RunSerializer(run, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        run.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)