# https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_matrix.html#scipy.sparse.csc_matrix
from scipy.sparse import csc_matrix
from scipy.sparse.linalg import svds
from scipy.linalg import inv
import re
import nltk
from pathlib import Path
# from nltk.book import *
from nltk import FreqDist
import numpy as np


def parse_xml(filepath:str="./affectivetext_trial.xml")->list:
    """
        Returns the document list from the input xml file
    """
    with open(filepath) as file: 
        data = file.read().lower()
        return re.findall(r'>(.*)<',data) 


def tokenize(text:str, name=None)->nltk.text.Text:
    """
        Returns a nltk.text.Text object with the choosen tokenize method and some cleaning work
        See also: https://www.nltk.org/api/nltk.tokenize.html                          
    """
    tokens = nltk.word_tokenize(text)
    return nltk.Text(tokens, name)

def tokenize_all(docs:list)->list:
    """
        Returns a list of nltk.text.Text objects from the document list; 
        each item is the dj document string
    """
    return [tokenize(txt, "XML document number "+str(id+1)) for id,txt in enumerate(docs)]

def frequencies(texts:list)->list:
    """
        Returns a list of nltk.probability.FreqDist objects from the nltk.text.Text 
        list made with tokenize_all
    """
    return [text.vocab() for text in texts]

def vocabulary(texts:list):
    """
        Compute dictionary from tokens list made with tokenize_all
    """
    o : set = set()
    for text in texts:
        o = o.union(set(text))
    return sorted(o)

def tf_ij(f_ij:int)->int:
    """
        Returns the term frequency for the term frequency f_ij
    """
    return 1+np.log2(f_ij) if f_ij > 0 else 0

def TF_table(V:set, fdists:list)->np.ndarray:
    """
        Create the TF table using tf_ij, the Vocabulary and the array of FreqDist applied on texts
        FreqDist will handle missing keys for the dictionary, dj[term] rappresents fi,j
    """
    TF = []
    for term in V:
        ki_tf = []
        for dj in fdists:
            fij = dj[term]
            ki_tf.append(tf_ij(fij))
        TF.append(ki_tf)
    return np.array(TF)

def TF_IDF_table(TF:np.ndarray)->np.ndarray:
    """
        Returns the TF_IDF Table using the TF table in input:
        - N: columns (how many documents we have);
        - M: rows 
    """
    M,N = TF.shape   
    TF_IDF = TF.copy()
    for i in range(M):
        ni = sum(TF[i,:]!=0)
        for j in range(N):
            if TF[i][j]: 
                TF_IDF[i][j] = np.round(TF[i][j] * np.log2(N/ni),3)
    return TF_IDF

def sim(dj:csc_matrix, q:csc_matrix):
    """
        compute the cosine similarity between dj and the query q. The two parameters must have same length!
    """
    return np.dot(dj, q.T) / (np.sqrt(np.sum(dj.power(2)))*np.sqrt(np.sum(q.power(2))))
    
def query_process(TF:np.ndarray, V:set, query:str)->np.ndarray:
    """
        Returns the query rappresentation as IF_TDF columns, as if it was a document
    """
    _,N = TF.shape  
    q = tokenize(query)
    fdist = FreqDist(q)
    out = np.full(len(V), 0.0)
    for i,v in enumerate(V):
        ni = sum(TF[i,:]!=0) 
        if v in fdist:
            out[i] = np.round(tf_ij(fdist[v])*np.log2(N/ni),3)
    return np.array(out)

def documents_ranking(TF_IDF, U:csc_matrix, invS:csc_matrix)->list:
    m,n = TF_IDF.shape
    res = []
    for j in range(n):
        res.append(TF_IDF[:,j].T @ U @ invS)                       
    return np.array(res)


def ranking(query:str, docs:list, U:csc_matrix, invS:csc_matrix)->list:
    q = query_process(TF, V, query)
    if not sum(q):
        return []
    qk = csc_matrix(q.T @ U @ invS)                                
    
    ranks = []
    for doc in rdocs:                                              # rdocs must be in order
        ranks.append(sim(doc, qk))

    ranks = sorted(enumerate(ranks), key=lambda t: t[1], reverse=True)
    ranks = list(filter(lambda t: t[1]>0.1, ranks))
    result = []
    for id, _ in ranks:
        res : dict = {}
        res['title'] = texts[id].name
        res['uri'] = str(texts[id])
        res['content'] = ' '.join(texts[id][:42])
        result.append(res)
    return result


    
docs = parse_xml()
texts = tokenize_all(docs)
# texts.extend([text1,text2,text3,text4,text5,text6,text7,text8,text9])
fdists = frequencies(texts)
V = vocabulary(texts) 

tables_filepath = './tables.npz'
if Path(tables_filepath).is_file():
    tables = np.load(tables_filepath)
    TF = tables['tf']
    TF_IDF = tables['tf_idf']
else:
    TF = TF_table(V, fdists)
    TF_IDF = TF_IDF_table(TF)
    np.savez_compressed('./tables', tf=TF, tf_idf=TF_IDF)

# CSC for column slicing
TF_IDF = csc_matrix(TF_IDF)                                         

U, S, Vt = svds(TF_IDF, k=2*min(TF_IDF.shape)//3) 
U = csc_matrix(U)

invS = np.divide(1,S, out=np.zeros_like(S), where=S!=0)
invS = csc_matrix(np.diag(invS))
rdocs = documents_ranking(TF_IDF, U, invS)

print("\nReady")

