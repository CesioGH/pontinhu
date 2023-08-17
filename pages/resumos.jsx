import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext'
import { db, storage } from '../src/lib/firebase'
import ResumosComEditar from '../src/components/ResumosComEditar';
import { v4 as uuidv4 } from 'uuid';
import HeaderAdm from "../src/components/HeaderAdm"
import { doc, getDoc, getFirestore, collection, getDocs } from "firebase/firestore";
import ColecaoCard from '../src/components/ColecaoCard';  
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUserAuth } from '../src/contexts/UserAuthContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#333"
    }
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: "#f5f5f5"
    }
  },
});


const ResumosPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.uid !== "lJQm2PbwBFaoFHvOPGkoz3jU5rF3") {
      router.push('/');
    }
  }, [currentUser, router]);
  

  const [resumos, setResumos] = useState([]);

  useEffect(() => {
    const fetchResumos = db.collection('resumos').onSnapshot((snapshot) => {
      const resumosData = snapshot.docs.map((doc) => ({ 
        id: doc.id,
        ...doc.data()
      }));
      setResumos(resumosData);
    });

    return () => fetchResumos();
  }, []);

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .toLowerCase();
  };

  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [showResumos, setShowResumos] = useState(false);
  const { darkMode, setDarkMode , toggleDarkMode} = useUserAuth();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
}, [darkMode]);

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const msgs = querySnapshot.docs.map(doc => doc.data());

      let count = 0;
      msgs.forEach(msg => {
        if (!msg.adminResponse) count++;
      });

      setUnreadMessagesCount(count);
    };

    fetchUnreadMessagesCount();
  }, []);


  const sanitizeId = (id) => {
    return id
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/ /g, "-")
      .toLowerCase();
  };

  const uploadFileToFirebase = async (file) => {
    if (file === null) {
      return null;
    }
    const storageRef = storage.ref();
    const uniqueName = uuidv4() + '-' + file.name;
    const fileRef = storageRef.child(uniqueName);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  };

  const handleResumoSubmit = async (event) => {
    event.preventDefault();

    const resumoId = sanitizeId(nome);

    const existingResumoDoc = doc(db, "resumos", resumoId);
    const existingResumoSnapshot = await getDoc(existingResumoDoc);

    if (existingResumoSnapshot.exists()) {
        alert('Já existe um resumo com esse nome. Por favor, escolha outro nome.');
        return;
    }

    const thumbnailUrl = await uploadFileToFirebase(thumbnail);
    const pdfUrl = await uploadFileToFirebase(pdf);

    const resumoData = {
      nome,
      assunto,
      valor,
      descricao,
      thumbnail: thumbnailUrl,
      pdf: pdfUrl,
    };

    await db.collection('resumos').doc(resumoId).set(resumoData);

    setNome("");
    setAssunto("");
    setValor("");
    setDescricao("");
    setThumbnail("");
    setPdf("");
};

const [searchTerm, setSearchTerm] = useState('');

const filteredResumos = resumos.filter(resumo => 
  normalizeString(resumo.nome).includes(normalizeString(searchTerm)) || 
  normalizeString(resumo.assunto).includes(normalizeString(searchTerm))
);

const [colecaoNome, setColecaoNome] = useState('');
const [colecaoPreco, setColecaoPreco] = useState('');
const [selectedResumos, setSelectedResumos] = useState([]);

const [selectedAssuntos, setSelectedAssuntos] = useState([]);

const handleColecaoSubmit = async (event) => {
  event.preventDefault();
  
  const colecaoData = {
    nome: colecaoNome,
    preco: colecaoPreco,
    resumos: selectedResumos
  };

  await db.collection('colecoes').add(colecaoData);

  setColecaoNome("");
  setColecaoPreco("");
  setSelectedResumos([]);
  setSelectedAssuntos([]); 
};

const [showFormResumos, setShowFormResumos] = useState(false);
const [showFormColecao, setShowFormColecao] = useState(false);

const [colecoes, setColecoes] = useState([]);
const [showColecoes, setShowColecoes] = useState(false);

useEffect(() => {
  const fetchColecoes = db.collection('colecoes').onSnapshot((snapshot) => {
    const colecoesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setColecoes(colecoesData);
  });

  return () => fetchColecoes();
}, []);


  return (
    <div >
      <HeaderAdm unreadCount={unreadMessagesCount} />

      <h2 style={{marginLeft:"3px", color:"grey"}} onClick={() => setShowFormResumos(!showFormResumos)}>
        Cadastrar resumos:
      </h2>

      {showFormResumos &&
      <form style={{marginLeft:"3px", color:"grey"}} onSubmit={handleResumoSubmit}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>
        <br />
        <label>
          Assunto:
          <input type="text" value={assunto} onChange={(e) => setAssunto(e.target.value)} required />
        </label>
        <br />
        <label>
          Preço:
          <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} required />
        </label>
        <br />
        <label>
          Descrição:
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </label>
        <br />
        <label>
          Thumbnail:
          <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} required />
        </label>
        <br />
        <label>
          PDF:
          <input type="file" onChange={(e) => setPdf(e.target.files[0])} required />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      }

      

      <h2 style={{marginLeft:"3px", color:"grey"}} onClick={() => setShowFormColecao(!showFormColecao)}>
        Cadastrar Coleção:
      </h2>
      {showFormColecao &&
      <form style={{marginLeft:"3px", color:"grey"}} onSubmit={handleColecaoSubmit}>
        <label>
          Nome da Coleção:
          <input type="text" value={colecaoNome} onChange={(e) => setColecaoNome(e.target.value)} required />
        </label>
        <br />
        <label>
          Preço da Coleção:
          <input type="number" value={colecaoPreco} onChange={(e) => setColecaoPreco(e.target.value)} required />
        </label>
        <br />
        
            Selecione os Resumos:

            <div style={{ display:"flex", height: '200px',width:'500px', overflowY: 'auto', border: '1px solid gray', padding: '8px', borderRadius: '4px' }}>
             <div >
              <div style={{}}>
                <input 
                  type="checkbox" 
                  id="Todos" 
                  checked={selectedAssuntos.length === [...new Set(resumos.map(resumo => resumo.assunto))].length}
                  onChange={() => {
                    if (selectedAssuntos.length < [...new Set(resumos.map(resumo => resumo.assunto))].length) {
                      setSelectedAssuntos([...new Set(resumos.map(resumo => resumo.assunto))]);
                    } else {
                      setSelectedAssuntos([]);
                    }
                  }} 
                />
                <label htmlFor="Todos">Ver todos os resumos</label>
              </div>
              
              {[...new Set(resumos.map(resumo => resumo.assunto))].map(assunto => (
                <div style={{}} key={assunto}>
                  <input 
                    type="checkbox" 
                    id={assunto} 
                    checked={selectedAssuntos.includes(assunto)}
                    onChange={() => {
                      if (selectedAssuntos.includes(assunto)) {
                        setSelectedAssuntos(prev => prev.filter(a => a !== assunto));
                      } else {
                        setSelectedAssuntos(prev => [...prev, assunto]);
                      }
                    }} 
                  />
                  <label htmlFor={assunto}>{assunto}</label>
                </div>
              ))}
              
              </div>
              <div style={{borderStyle:"solid", borderRight:"0px", borderBottom:"0px", marginTop:"2px" ,marginLeft:"2px"}}>
                {resumos.filter(resumo => selectedAssuntos.length === 0 || selectedAssuntos.includes(resumo.assunto)).map((resumo) => (
                <div style={{}} key={resumo.id}>
                  <input 
                    type="checkbox" 
                    id={`resumo-${resumo.id}`} 
                    value={resumo.id} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedResumos(prev => [...prev, resumo.id]);
                      } else {
                        setSelectedResumos(prev => prev.filter(id => id !== resumo.id));
                      }
                    }} 
                  />
                  <label htmlFor={`resumo-${resumo.id}`}>{resumo.assunto} - {resumo.nome}</label>
                </div>
              ))}
             </div>
            </div>


        <button type="submit">Adicionar Coleção</button>

      </form>
      }

      <br />
      <div  style={{display:"flex", justifyContent:"space-evenly"}}>
          <button onClick={() => setShowColecoes(!showColecoes)}>Ver Coleções</button>
          <button onClick={() => setShowResumos(!showResumos)}>Ver Resumos</button>
      </div>
      {showColecoes && 
        colecoes.map(colecao => (
          <ColecaoCard key={colecao.id} colecao={colecao} />
        ))
      }

              {showResumos && 
                <div>
                  <input style={{marginLeft:"8px", marginTop:"8px"}} type="text" placeholder="Pesquisar resumos ..." onChange={e => setSearchTerm(e.target.value)} />
                  <div style={{display:"flex", flexWrap:"wrap"}}>
                  {filteredResumos.map((resumo, index) => (
                    <ResumosComEditar key={resumo.id} resumo={resumo} index={index} />
                  ))}
                </div>
                </div>
              }

    </div>
  );
};

export default ResumosPage;
