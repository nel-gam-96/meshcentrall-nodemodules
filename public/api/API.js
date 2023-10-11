const getMainInfo = (req,res,db) => { 
    db.file.find({type:{$in:['lastconnect','mesh','node','sysinfo','user']}},(err,docs)=>{
        if(err){
         console.log(err)
         return res.send({
             ok:false,
             message:'Ha ocurrido un error en el servidor',
             err
         })
        }              
        let devices = docs.filter(d=>d.type == 'node');
        let groups = docs.filter(d=>d.type == 'mesh');
        let users = docs.filter(d=>d.type == 'user');
        let sysinfo = docs.filter(d=>d.type == 'sysinfo');

         res.send({devices,groups,users,sysinfo})
         //mesh => Grupo 
         //node => Dispositivo
         //sysinfo => hardware/software de sistema
         //Propiedad "identifiers" tiene id de dispositivo en la prop "product_uuid"
    })
}

const getDeviceInfo = (req,res,db) => {
    const node_id = req.params.id;

    db.file.find({type:'node',_id:`node//${node_id}`},(err,docs)=>{
        if(err){
            return res.json({
                ok:false,
                message:'Ha ocurrido un error en la consulta',
                err
            })
        }
        if(docs.length == 0){
            return res.json({
                ok:false,
                message:'No se ha encontrado el Node ID'
            })
        }
        let node = docs[0]
        db.file.find({type:'sysinfo',_id:`sinode//${node_id}`},(err2,docs2)=>{
            if(err2){
                return res.json({
                    ok:false,
                    message:'Ha ocurrido un error en la consulta',
                    err
                })
            }
            if(docs2.length == 0){
                return res.json({
                    ok:false,
                    message:'No se ha encontrado información de sistema del Node ID'
                })
            }
            node['sysinfo'] = docs2[0];
            return res.json({
                ok:true,
                message:'Node ID encontrado',
                node
            })
        })
    })
}

const getDevices = (req,res,db) => {
    db.file.find({type:'node'},(err,docs)=>{
        if(err){
            return res.json({
                ok:false,
                message:'Ha ocurrido un error en la consulta',
                err
            })
        }
        return res.json({
            ok:true,
            message:'Lista de dispositivos',
            nodes:docs
        })
    })
}

const getGroups = (req,res,db) => {
    db.file.find({type:'mesh'},(err,docs)=>{
        if(err){
         console.log(err)
         return res.send({
             ok:false,
             message:'Ha ocurrido un error en el servidor',
             err
         })
        }              
        return res.json({
            ok:true,
            message:'Lista de grupos',
            meshs:docs
        })
    })
}

const getGroupInfo = (req,res,db) => {
    const mesh_id = req.params.id;

    db.file.find({type:'mesh',_id:`mesh//${mesh_id}`},(err,docs)=>{
        if(err){
            return res.json({
                ok:false,
                message:'Ha ocurrido un error en la consulta',
                err
            })
        }
        if(docs.length == 0){
            return res.json({
                ok:false,
                message:'No se ha encontrado el Mesh ID'
            })
        }
        let group = docs[0];

        group['devices'] = [];

        return res.json({
            ok:true,
            message:'Grupo encontrado',
            mesh:group
        })
        // db.file.find({type:'sysinfo',_id:`sinode//${node_id}`},(err2,docs2)=>{
        //     if(err2){
        //         return res.json({
        //             ok:false,
        //             message:'Ha ocurrido un error en la consulta',
        //             err
        //         })
        //     }
        //     if(docs2.length == 0){
        //         return res.json({
        //             ok:false,
        //             message:'No se ha encontrado información de sistema del Node ID'
        //         })
        //     }
        //     node['sysinfo'] = docs2[0];
        //     return res.json({
        //         ok:true,
        //         message:'Node ID encontrado',
        //         node
        //     })
        // })
    })
}

module.exports.getMainInfo = getMainInfo;

module.exports.getDeviceInfo = getDeviceInfo;

module.exports.getDevices = getDevices;

module.exports.getGroups = getGroups;

module.exports.getGroupInfo = getGroupInfo;



