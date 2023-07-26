import { useEffect ,useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext'
import { db, storage } from '../src/lib/firebase'
import ResumosComApagar from '../src/components/ResumosComApagar';
import { v4 as uuidv4 } from 'uuid';
import HeaderAdm from "../src/components/HeaderAdm"

const ResumosPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [resumos, setResumos] = useState([]);

  useEffect(() => {
    const fetchResumos = db.collection('resumos').onSnapshot((snapshot) => {
      const resumosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setResumos(resumosData);
    });
  
    // cleanup function
    return () => fetchResumos();
  }, []);
  

  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);

  if (!currentUser || currentUser.uid !== "lJQm2PbwBFaoFHvOPGkoz3jU5rF3") {
    router.push('/login');
    return null; // Return null to indicate that no component should be rendered
  }

  const uploadFileToFirebase = async (file) => {
    if (file === null) {
      return null; // Retorna null se não há arquivo
    }
    const storageRef = storage.ref();
    const uniqueName = uuidv4() + '-' + file.name; // Gera um nome de arquivo único
    const fileRef = storageRef.child(uniqueName);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  };

  const handleResumoSubmit = async (event) => {
    event.preventDefault();
    
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
  
    await db.collection('resumos').add(resumoData);
  
    // Limpando todos os campos do formulário
    setNome("");
    setAssunto("");
    setValor(""); //ou setValor(0) dependendo do que faz mais sentido no seu caso
    setDescricao("");
    setThumbnail("");
    setPdf("");
  };
  

  return (

    <div>
    <HeaderAdm/>
    

    <h1>Cadastro dos resumos:</h1>

      <form onSubmit={handleResumoSubmit}>
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

    <br /><br />

    <div style={{}}>
        {resumos.map((resumo, index) => (
          <ResumosComApagar key={resumo.id} resumo={resumo} index={index}/>
          
        ))}
      </div>






    </div>

   

  );
};

export default ResumosPage;
