import { useEffect, useState } from "react"

import { ref, set, onValue } from "firebase/database";
import { db } from "./Firebase";
import Foot from "./Foot";
import { useNavigate } from "react-router-dom";



function writeUserData(soat, mn, som, blk ) {

  set(ref(db, 'maxsulotkrim'+blk+'/'+ soat), {
    narx: som+'000',
    joy:mn,
    vaqat:soat,
    name:localStorage.getItem('name'),
  });

  const starCountRef = ref(db, 'maxsulotkrimoylar');
  const dt=new Date();
  const ky=(dt.getMonth()+1)+'-'+dt.getFullYear(); 
  onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();  
  let tek=''
    if (data) {
        tek=Object.values(data);
        console.log(tek[tek.length-1].yilkun);
        if (tek[tek.length-1].yilkun!=ky || !data) {
            set(ref(db, 'maxsulotkrimoylar/'+ ky), {
                yilkun:ky
              });
          }
    }else{
        set(ref(db, 'maxsulotkrimoylar/'+ ky), {
            yilkun:ky
          });
    }

});

}





function MaxsulotKirim() {
    const [md, setMd]=useState(false)
    const [mn, setMn]=useState('');
    const [som, setSom]=useState('');
    const [mal, setMal]=useState([])
    const [somk, setUmsum]=useState()
    const [yiloy, setYiloy]=useState([])
    const [yily, setYily]=useState(false);

    const nv=useNavigate();



       useEffect(()=>{
        if (localStorage.getItem('pr')!=2345) {
            nv('/')
        }
        const dt=new Date();
        const ky=dt.getMonth()+1+''+dt.getFullYear();
        const starCountRef = ref(db, 'maxsulotkrim'+ky);
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();    
        if (data) {
            setMal(Object.values(data))
            let pl=0
            Object.values(data).map(p=>pl+=(+p.narx))
            setUmsum(pl)
            setTimeout(()=>{
                window.scrollTo(0,document.body.scrollHeight);
            }, 100)
        }
});

    }, [])

    function Boshqaoy(x){
        let ky=x.split('-');
        ky=ky.join('')
        const starCountRef = ref(db, 'maxsulotkrim'+ky);
        onValue(starCountRef,  (snapshot) => {
            const data = snapshot.val(); 
            setMal(Object.values(data))
            let pl=0
            Object.values(data).map(p=>pl+=(+p.narx))
            setUmsum(pl)
            setTimeout(()=>{
                window.scrollTo(0,document.body.scrollHeight);
            }, 100)
            
         })
         setYily(false)
    }


    function Hisobot(){
        const starCountRef = ref(db, 'maxsulotkrimoylar');
        onValue(starCountRef,  (snapshot) => {
            const data = snapshot.val(); 
            setYiloy(Object.values(data))
            
         })
         setYily(true)
    }


    function Royhat(m){
        
        function edit(k){
            localStorage.setItem('vq', k.vaqat)
            setMn(k.joy)
            setSom(k.narx.slice(0, -3))
            setMd(!md)
        }
        let edt=false;
        const dt=new Date();
        const ky=dt.getDay()+'-'+(dt.getMonth()+1)+'-'+dt.getFullYear();
        const koy=m.vaqat.split('__')[0];
        if(ky==koy){
            edt=true
        }
                  
        return(
            <div className="w-full h-[134px] bg-[#1E2139] rounded-lg text-white flex p-5 justify-between hg" key={m.vaqat}>
            <div>
                <h3>{m.joy}</h3>
                <h4>{m.vaqat.slice(0, -4)}</h4>
                <p>{(+m.narx).toLocaleString('it-IT', { style: 'decimal', currency: 'som'})}</p>
            </div>
            <div>
            <h2>{m.name}</h2>
            <button className={`mt-5 px-3 py-1 bg-blue-500 rounded-sm ${edt ? '':'hidden'}`} onClick={()=>edit(m)}>Edit</button>
            </div>
        </div>
        )
    }

    function Hendl(){
        
    
    
        const dt=new Date();
        const ky=dt.getMonth()+1+''+dt.getFullYear();
        const soat=localStorage.getItem('vq') ? localStorage.getItem('vq'):dt.getDay()+'-'+(dt.getMonth()+1)+'-'+dt.getFullYear()+'__'+dt.getHours()+':'+(dt.getMinutes()<10 ? 0+dt.getMinutes() : dt.getMinutes())+':'+(dt.getMilliseconds()<10 ? '00'+dt.getMilliseconds(): dt.getMilliseconds()< 100 ? '0'+dt.getMilliseconds():dt.getMilliseconds()) ;
        writeUserData(soat, mn, som, ky);
        setMd(!md)
        setMn('');
        setSom('')
        localStorage.setItem('vq', '')
    }
    
  return (


    <div className="w-full">

        <div className={`w-full min-h-[100vh] fixed z-50 bg-[#0000006c] ${yily ? 'block ht' : 'hidden'}`} onClick={()=>setYily(false)}>
            <div className="w-[250px] bg-slate-500 min-h-32 rounded-xl mx-auto my-10 p-6 flex flex-col gap-2" onClick={e=>e.stopPropagation()}>
              {yiloy.map(a=><h2 key={a.yilkun} className=" w-full bg-blue-500 py-2 rounded-md text-center text-white" onClick={()=>Boshqaoy(a.yilkun)}>{a.yilkun}</h2>)}
            </div>
        </div>

    <div className="flex flex-col items-center pt-24 w-full gap-2  z-[-1] px-6">


    {mal.length==0 ? '': mal.map(m=>Royhat(m))}


    </div>
    <div className="w-full h-[100px] mb-24 mx-auto mt-1 rounded-full bg-blue-500 flex text-white items-center justify-center" onClick={Hisobot}>
            {somk?.toLocaleString('it-IT', { style: 'decimal', currency: 'som'})}
        </div>
    <div className="fixed bottom-28 right-5 z-10">
        <button className="p-3 px-5 text-2xl bg-slate-500 text-white rounded-full" onClick={()=>setMd(!md)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(246,241,241,0.98)"><path d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 11H8V13H11V16H13V13H16V11H13V8H11V11Z"></path></svg></button>
    </div>


    <div className={`w-full h-[100vh] fixed bg-[#0000005b] top-0 justify-center z-30 pt-5 ${md ? 'flex ht' : 'hidden'}`} onClick={()=>setMd(!md)}>
        <div className="w-[340px] h-[260px] flex flex-col gap-8 rounded-2xl bg-slate-500 px-5 py-10" onClick={e=>e.stopPropagation()}>
            <input type="text" placeholder="Joyni " value={mn} onChange={e=>setMn(e.target.value)} className="h-10 rounded-md p-5 text-3xl" />
            <input type="number" value={som} onChange={e=>setSom(e.target.value)} placeholder="Narh"  className="h-10 rounded-md p-5 text-3xl" />
            <button className="w-full bg-blue-500 text-white py-2 text-2xl rounded-full" onClick={Hendl}>Add</button>
        </div>
    </div>
    <Foot n={3}/>
    </div>
  )
}

export default MaxsulotKirim