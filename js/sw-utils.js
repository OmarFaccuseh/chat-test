//guarda en cache dinamico
function guardaDinamico(cDinamico, req, res){

    if(res.ok){
        return caches.open(cDinamico).then(cache => {
            cache.put(req, res.clone());
            return res;
        });
    }
    else{
        return res;
    }

}