def make_it_run(filename,id,isAuto):
    from mordred import Calculator, descriptors
    from rdkit import Chem
    from rdkit.Chem.Pharm2D import Gobbi_Pharm2D
    from django.core.files.storage import FileSystemStorage
    import os
    import pandas as pd
    
    factory = Gobbi_Pharm2D.factory
    fs = FileSystemStorage()
    os.chdir(fs.location)
    if isAuto:
        def SDFMolSupplier(file=None, sanitize=False):
            mols = []
            suppl = Chem.SDMolSupplier(file)
            for mol in suppl:
                if mol is not None:
                    if sanitize:
                        Chem.SanitizeMol(mol)
                    mols.append(mol)
            return mols
        database=SDFMolSupplier(filename, sanitize=False)
    else:
        def Mol2MolSupplier_1(file=None, sanitize=False):
            mols = []
            with open(file, 'r') as f:
                line = f.readline()
                while not f.tell() == os.fstat(f.fileno()).st_size:
                    if line.startswith("@<TRIPOS>MOLECULE"):
                        mol = []
                        mol.append(line)
                        line = f.readline()
                        while not line.startswith("@<TRIPOS>MOLECULE"):
                            mol.append(line)
                            line = f.readline()
                            if f.tell() == os.fstat(f.fileno()).st_size:
                                mol.append(line)
                                break
                        mol[-1] = mol[-1].rstrip()  # removes blank line at file end
                        block = ",".join(mol).replace(',', '')
                        m = Chem.MolFromMol2Block(block, sanitize=sanitize)
                    mols.append(m)
            return (mols)
        database = Mol2MolSupplier_1(filename, sanitize=False)
    calc = Calculator(descriptors, ignore_3D=False)
    table = pd.DataFrame(columns=['Name'] + list(calc(database[0]).keys()))
    index = 0
    for mol in database:
        MordredFeatures = calc(mol)
        row_data = [mol.GetProp('_Name')] + list(MordredFeatures.values())
        table.loc[index] = row_data
        index+=1
    table.to_csv('FeaturesExtracted_MORDRED'+str(id)+'.csv',header=True)
