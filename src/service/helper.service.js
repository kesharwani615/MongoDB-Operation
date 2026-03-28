export const checkDataIsString=(arg)=>{
   let temp = {check:false,field:""};
   for (const [key,element] of Object.entries(arg)) {
     if(!(typeof [element] ==="string")){
       temp = {check:false,field:key};
       break;
     }
   }
   return temp;
}