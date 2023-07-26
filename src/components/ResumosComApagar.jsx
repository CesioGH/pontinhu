import {db } from "../lib/firebase"


export default function ResumosComApagar ({resumo, index}){

    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que quer apagar o resumo "${resumo.nome}"?`)) {
          await db.collection('resumos').doc(resumo.id).delete();
        }
      }

      const backgroundColor = index % 2 === 0 ? "#E7D8E9" : "#C9B5D4"

    return(
        <div style={{ backgroundColor , justifyContent:"space-between" ,display:"flex", borderRadius:"5px" ,gap:"10px", margin:"10px", padding:"10px"}} >
            
        <img style={{width:"40px"}} src={resumo.thumbnail} alt={resumo.nome} />
        <h2>{resumo.nome}</h2>
        
        <h2>{resumo.assunto}</h2>
        
        <h2>{resumo.valor}</h2>
       
        <p><button onClick={handleDelete}>Apagar</button></p>

       
      
      </div>

    )
}