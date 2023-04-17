"""
RDKit is released under BSD 3-Clause "New" or "Revised" License.

    ** Please read MolOptimizer License file **

RDKit library is used in MolOptimizer as is without any changes
and it has been stated in MolOptimizer license file.

Link to RDKit GitHub repository: https://github.com/rdkit/rdkit
Link to RDKit license: https://github.com/rdkit/rdkit/blob/master/license.txt

        #################################################################################################################################################################
RDKit License Statement

BSD 3-Clause License

Copyright (c) 2006-2015, Rational Discovery LLC, Greg Landrum, and Julie Penzotti and others
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                #################################################################################################################################################################

"""


def make_it_run(filename):
    from rdkit import Chem
    from rdkit.Chem.Pharm2D import Gobbi_Pharm2D
    factory = Gobbi_Pharm2D.factory
    import os
    from django.core.files.storage import FileSystemStorage
    from rdkit.Chem import Descriptors
    from rdkit.Chem import Descriptors3D
    from rdkit.Chem import GraphDescriptors
    from rdkit.Chem import Crippen
    from rdkit.Chem import Lipinski
    from rdkit.Chem import MolSurf
    from rdkit.Chem import QED
    from rdkit.Chem import rdmolops
    from rdkit.Chem import rdMolDescriptors

    fs = FileSystemStorage()
    os.chdir(fs.location)

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

    filePath = filename
    database = Mol2MolSupplier_1(filePath, sanitize=False)
    import pandas as pd
    table = pd.DataFrame()
    index = 0
    for mol in database:
        table.loc[index, 'Name'] = mol.GetProp('_Name')
        table.loc[index, 'NumAtoms'] = mol.GetNumAtoms()
        table.loc[index, 'SMILES'] = Chem.MolToSmiles(mol)
        #table.loc[index, 'SSR'] = Chem.GetSSSR(mol)
        table.loc[index, 'Num_Conformers'] = mol.GetNumConformers()
        table.loc[index, 'Bond_Type'] = mol.GetBondWithIdx(4).GetBondType()
        table.loc[index, 'Is_Aromatic'] = mol.GetBondWithIdx(4).GetIsAromatic()
        table.loc[index, 'TPSA'] = Descriptors.TPSA(mol)
        table.loc[index, 'MaxPartialCharge'] = Descriptors.MaxPartialCharge(mol)
        table.loc[index, 'MinPartialCharge'] = Descriptors.MinPartialCharge(mol)
        table.loc[index, 'ExactMolecularWeight'] = Descriptors.ExactMolWt(mol)
        table.loc[index, 'FPDensityMorgan1'] = Descriptors.FpDensityMorgan1(mol)
        table.loc[index, 'FPDensityMorgan2'] = Descriptors.FpDensityMorgan2(mol)
        table.loc[index, 'FPDensityMorgan3'] = Descriptors.FpDensityMorgan3(mol)
        table.loc[index, 'HeavyAtomWt'] = Descriptors.HeavyAtomMolWt(mol)
        table.loc[index, 'MaxAbsPartialCharge'] = Descriptors.MaxAbsPartialCharge(mol)
        table.loc[index, 'MinAbsPartialCharge'] = Descriptors.MinAbsPartialCharge(mol)
        table.loc[index, 'AverageMolWt'] = Descriptors.MolWt(mol)
        table.loc[index, 'NumRadicalElectrons'] = Descriptors.NumRadicalElectrons(mol)
        table.loc[index, 'NumValenceElectrons'] = Descriptors.NumValenceElectrons(mol)
        table.loc[index, 'RingCount'] = Descriptors.RingCount(mol)
        table.loc[index, 'MolMR'] = Descriptors.MolMR(mol)
        table.loc[index, 'MolLogP'] = Crippen.MolLogP(mol)
        table.loc[index, 'BalbanJ'] = GraphDescriptors.BalabanJ(mol)
        table.loc[index, 'BertzCT'] = GraphDescriptors.BertzCT(mol)
        table.loc[index, 'Chi0'] = GraphDescriptors.Chi0(mol)
        table.loc[index, 'Chi0n'] = GraphDescriptors.Chi0n(mol)
        table.loc[index, 'Chi0v'] = GraphDescriptors.Chi0v(mol)
        table.loc[index, 'Chi1'] = GraphDescriptors.Chi1(mol)
        table.loc[index, 'Chi1n'] = GraphDescriptors.Chi1n(mol)
        table.loc[index, 'Chi1v'] = GraphDescriptors.Chi1v(mol)
        table.loc[index, 'Chi2n'] = GraphDescriptors.Chi2n(mol)
        table.loc[index, 'Chi2v'] = GraphDescriptors.Chi2v(mol)
        table.loc[index, 'Chi3n'] = GraphDescriptors.Chi3n(mol)
        table.loc[index, 'Chi3v'] = GraphDescriptors.Chi3v(mol)
        table.loc[index, 'Chi4n'] = GraphDescriptors.Chi4n(mol)
        table.loc[index, 'Chi4v'] = GraphDescriptors.Chi4v(mol)
        table.loc[index, 'HallKierAlpha'] = GraphDescriptors.HallKierAlpha(mol)
        #table.loc[index, 'Ipc'] = GraphDescriptors.Ipc(mol)
        table.loc[index, 'Kappa1'] = GraphDescriptors.Kappa1(mol)
        table.loc[index, 'Kappa2'] = GraphDescriptors.Kappa2(mol)
        table.loc[index, 'Kappa3'] = GraphDescriptors.Kappa3(mol)
        table.loc[index, 'Asphericity'] = Descriptors3D.Asphericity(mol)
        table.loc[index, 'Eccentricity'] = Descriptors3D.Eccentricity(mol)
        table.loc[index, 'InertialShapeFactor'] = Descriptors3D.InertialShapeFactor(mol)
        table.loc[index, 'NPR1'] = Descriptors3D.NPR1(mol)
        table.loc[index, 'NPR2'] = Descriptors3D.NPR2(mol)
        table.loc[index, 'PMI1'] = Descriptors3D.PMI1(mol)
        table.loc[index, 'PMI2'] = Descriptors3D.PMI2(mol)
        table.loc[index, 'PMI3'] = Descriptors3D.PMI3(mol)
        table.loc[index, 'RadiusOfGyration'] = Descriptors3D.RadiusOfGyration(mol)
        table.loc[index, 'SpherocityIndex'] = Descriptors3D.SpherocityIndex(mol)
        table.loc[index, 'FractionalCSP3'] = Lipinski.FractionCSP3(mol)
        table.loc[index, 'HeavyAtomCount'] = Lipinski.HeavyAtomCount(mol)
        table.loc[index, 'NHOHCount'] = Lipinski.NHOHCount(mol)
        table.loc[index, 'NOCount'] = Lipinski.NOCount(mol)
        table.loc[index, 'RingCount'] = Lipinski.RingCount(mol)
        table.loc[index, 'LabuteASA'] = MolSurf.LabuteASA(mol)
        table.loc[index, 'PEOE_VSA1'] = MolSurf.PEOE_VSA1(mol)
        table.loc[index, 'PEOE_VSA10'] = MolSurf.PEOE_VSA10(mol)
        table.loc[index, 'PEOE_VSA11'] = MolSurf.PEOE_VSA11(mol)
        table.loc[index, 'PEOE_VSA12'] = MolSurf.PEOE_VSA12(mol)
        table.loc[index, 'PEOE_VSA13'] = MolSurf.PEOE_VSA13(mol)
        table.loc[index, 'PEOE_VSA14'] = MolSurf.PEOE_VSA14(mol)
        table.loc[index, 'PEOE_VSA2'] = MolSurf.PEOE_VSA2(mol)
        table.loc[index, 'PEOE_VSA3'] = MolSurf.PEOE_VSA3(mol)
        table.loc[index, 'PEOE_VSA4'] = MolSurf.PEOE_VSA4(mol)
        table.loc[index, 'PEOE_VSA5'] = MolSurf.PEOE_VSA5(mol)
        table.loc[index, 'PEOE_VSA6'] = MolSurf.PEOE_VSA6(mol)
        table.loc[index, 'PEOE_VSA7'] = MolSurf.PEOE_VSA7(mol)
        table.loc[index, 'PEOE_VSA8'] = MolSurf.PEOE_VSA8(mol)
        table.loc[index, 'PEOE_VSA9'] = MolSurf.PEOE_VSA9(mol)
        table.loc[index, 'SMR_VSA1'] = MolSurf.SMR_VSA1(mol)
        table.loc[index, 'SMR_VSA10'] = MolSurf.SMR_VSA10(mol)
        table.loc[index, 'SMR_VSA2'] = MolSurf.SMR_VSA2(mol)
        table.loc[index, 'SMR_VSA3'] = MolSurf.SMR_VSA3(mol)
        table.loc[index, 'SMR_VSA4'] = MolSurf.SMR_VSA4(mol)
        table.loc[index, 'SMR_VSA5'] = MolSurf.SMR_VSA5(mol)
        table.loc[index, 'SMR_VSA6'] = MolSurf.SMR_VSA6(mol)
        table.loc[index, 'SMR_VSA7'] = MolSurf.SMR_VSA7(mol)
        table.loc[index, 'SMR_VSA8'] = MolSurf.SMR_VSA8(mol)
        table.loc[index, 'SMR_VSA9'] = MolSurf.SMR_VSA9(mol)
        table.loc[index, 'SlogP_VSA1'] = MolSurf.SlogP_VSA1(mol)
        table.loc[index, 'SlogP_VSA11'] = MolSurf.SlogP_VSA11(mol)
        table.loc[index, 'SlogP_VSA12'] = MolSurf.SlogP_VSA12(mol)
        table.loc[index, 'SlogP_VSA2'] = MolSurf.SlogP_VSA2(mol)
        table.loc[index, 'SlogP_VSA3'] = MolSurf.SlogP_VSA3(mol)
        table.loc[index, 'SlogP_VSA4'] = MolSurf.SlogP_VSA4(mol)
        table.loc[index, 'SlogP_VSA5'] = MolSurf.SlogP_VSA5(mol)
        table.loc[index, 'SlogP_VSA6'] = MolSurf.SlogP_VSA6(mol)
        table.loc[index, 'SlogP_VSA7'] = MolSurf.SlogP_VSA7(mol)
        table.loc[index, 'SlogP_VSA8'] = MolSurf.SlogP_VSA8(mol)
        table.loc[index, 'SlogP_VSA9'] = MolSurf.SlogP_VSA9(mol)
        table.loc[index, 'TPSA'] = MolSurf.TPSA(mol)
        table.loc[index, 'pyLabuteASA'] = MolSurf.pyLabuteASA(mol, includeHs=1)
        table.loc[index, 'WeightedSumofADSProperties'] = QED.qed(mol)
        table.loc[index, 'QED_UsingMaxDescriptorWeights'] = QED.weights_max(mol)
        table.loc[index, 'QED_UsingAVGDescriptorWeights'] = QED.weights_mean(mol)
        table.loc[index, 'QED_UsingUnitWeights'] = QED.weights_none(mol)
        table.loc[index, 'FormalCharge'] = rdmolops.GetFormalCharge(mol)
        table.loc[index, 'NumSpiroAtoms'] = rdMolDescriptors.CalcNumSpiroAtoms(mol)
        table.loc[index, 'PBF'] = rdMolDescriptors.CalcPBF(mol)
        index = index + 1
    export_csv=table.to_csv('FeaturesExtracted_RDKIT.csv', header=True)