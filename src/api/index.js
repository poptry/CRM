import http  from "@/util/request";


//**************用户接口***********
//用户登录请求
export const userLogin = (data)=>{
    return http.post('/login',data)
}
//获取用户信息
export const getUserInfo = (params)=>{
    return http.get('/client/getClients',params)
}

//**************客户接口***********
//添加新客户
export const addUserInfo = (data)=>{
    return http.post('/client/add',data)
}
//搜索客户
export const searchClient = (params)=>{
    return http.get('/client/getClientByName',params)
}
//更新客户信息
export const updateClient = (data)=>{
    return http.put('/client/update',data)
}
//删除客户信息
export const deleteClient = (data)=>{
    return http.delete('/client/delete',data)
}
//公海信息/getHighSeas
export const getHighSeas = (params)=>{
    return http.get('/client/getHighSeas',params)
}
//领取客户
export const pullClients = (data)=>{
    return http.put('/client/getHighSeas/convert',data)
}
//放入公海 convertHighSeas
export const convertHighSeas = (data)=>{
    return http.put('/client/convertHighSeas',data)
}

//**************线索接口***********
//获取线索
export const getClue = (params)=>{
    return http.get('/clue/get',params)
}
//新增线索
export const addClue = (data)=>{
    return http.post('/clue/add',data)
}
//删除线索
export const deleteClue = (data)=>{
    return http.delete('/clue/delete',data)
}
//修改
// update
export const updateClue = (data)=>{
    return http.put(`/clue/update`,data)
}
//转化线索为客户
export const convertClue = (data)=>{
    return http.post('/clue/convert',data)
}
//线索跟进添加
export const addClueFollow = (data)=>{
    return http.post('/clue//follow/add',data)
}
//获取线索跟进内容
export const getClueFollow = (params)=>{
    return http.get('/clue/follow/get',params)
}
//**************产品接口***********

//产品接口
export const getProduct = ()=>{
    return http.get('/pro/get')
}
// update
export const updateProduct = (data)=>{
    return http.put('/pro/update',data)
}
// delete
export const deleteProduct = (data)=>{
    return http.delete('/pro/delete',data)
}
// add
export const addProduct = (data)=>{
    return http.post('/pro/add',data)
}
// getProByName
export const searchProduct = (params)=>{
    return http.get('/pro/getProByName',params)
}

//**************商机接口***********
//opportunity
export const getOpportunity = (params)=>{
    return http.get('/opportunity/get',params)
}
// delete
export const deleteOpportunity= (data)=>{
    return http.delete('/opportunity/delete',data)
}
//update
export const updateOpportunity = (data)=>{
    return http.put('/opportunity/update',data)
}
//getOpportunityByName
export const searchOpportunity = (params)=>{
    return http.get('/opportunity/getOpportunityByName',params)
}
//add
export const addOpportunity = (data)=>{
    return http.post('/opportunity/add',data)
}
//follow/get 商机跟进获取
export const getOpportunityFollow = (params)=>{
    return http.get('/opportunity/follow/get',params)
}
//添加跟进/follow/add
export const addOpportunityFollow = (data)=>{
    return http.post('/opportunity/follow/add',data)
}
//推进商机状态
export const updateOpportunityState = (data)=>{
    return http.put('/opportunity/updateState',data)
}
//getPro
export const getOpportunityPro = (params)=>{
    return http.get('/opportunity/getPro',params)
}

//**************合同接口***********
//合同
//contract
export const getContractInfo = ()=>{
    return http.get('/contract/get')
}
//删除合同信息
export const deleteContract = (data)=>{
    return http.delete('/contract/delete',data)
}
//添加合同
export const addContractInfo = (data)=>{
    return http.post('/contract/add',data)
}
//搜索合同
export const searchContract = (params)=>{
    return http.get('/contract/getContractByName',params)
}
//合同审核接口/updateState
export const aduitContract = (data)=>{
    return http.put('/contract/updateState',data)
}
//修改合同update
export const updateContract = (data)=>{
    return http.put('/contract/update',data)
}
//getContractByState
export const getContractByState = (params)=>{
    return http.get('/contract/getContractByState',params)
}
//获取产品信息getPro
export const getContractPro = (params)=>{
    return http.get('/contract/getPro',params)
}


//**************回款接口***********
//return
//list
export const getReturn = ()=>{
    return http.get('/return/list')
}
///getByKey
export const searchReturn = (params)=>{
    return http.get('/return/getByKey',params)
}
//update
export const updateReturn = (data)=>{
    return http.put('/return/update',data)
}