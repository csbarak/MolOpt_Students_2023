"""
MIT License

Copyright (c) 2019 Discngine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
from django.core.files.storage import FileSystemStorage
import os


def make_it_run(ref_file, lig_db):
    from rdkit import Chem
    from rdkit.Chem import AllChem
    from rdkit.Chem import rdFMCS
    # from rdkit.Chem.rdMolTransforms import GetDihedralDeg, SetDihedralDeg

    ratioThreshold = 0.5  # minimum portion of the reference molecule that should be found as common substructure to consider it for tethered minimization: 0.0-1.0
    fs = FileSystemStorage()
    os.chdir(fs.location)
    reference = Chem.MolFromMolFile(ref_file, removeHs=True)
    ligands = Chem.SDMolSupplier(lig_db, removeHs=True)
    w = Chem.SDWriter("aligned.sdf")  # output ligands with constrained atoms
    #wnt = Chem.SDWriter("output_nontethered.sdf")  # output of ligands without constraints (no MCS with reference ligand)
    for mol in ligands:
        if mol == None:
            continue
        else:
            print(mol)
            mols = [reference, mol]
            mcsResult = rdFMCS.FindMCS(mols, threshold=0.1,
                                       completeRingsOnly=False)  # find the maximum common substructure

            if mcsResult.smartsString and len(mcsResult.smartsString) > 0:
                patt = Chem.MolFromSmarts(mcsResult.smartsString, mergeHs=True)
                # keep only the core of the reference molecule
                ref = AllChem.ReplaceSidechains(reference, patt)
                if ref:
                    core = AllChem.DeleteSubstructs(ref, Chem.MolFromSmiles('*'))
                    core.UpdatePropertyCache()
                    newmol = Chem.Mol(mol)  # create a new instance of the ligand, as we will change the coordinates
                    try:
                        AllChem.ConstrainedEmbed(newmol,
                                                 core)  # constrained minimization of newmol versus the core of the referenc
                        tethered_atom_ids = newmol.GetSubstructMatches(patt)  # that's to get the atom ids only
                        t = tethered_atom_ids[0]
                        t1 = map(lambda x: x + 1, list(t))
                        ta = ','.join(str(el) for el in t1)
                        nm = Chem.AddHs(newmol,
                                        addCoords=True)  # create a new 3D molecule  and add the TETHERED ATOMS property
                        nm.SetProp('TETHERED ATOMS', ta)
                        w.write(nm)
                    except ValueError as ve:
                        print(ve)
                        pass
                        # write to an sd file
