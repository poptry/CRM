import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store =  new Vuex.Store({
        state:{
                isInDailog:false,
                isWhich:'',
                isInDailogPro:false,
        },
        mutations:{
                inDailog(state){
                        state.isInDailog=true
                },
                isNotInDailog(state){
                        state.isInDailog=false
                },
                inDailogPro(state){
                        state.isInDailogPro=true
                },
                isNotInDailogPro(state){
                        state.isInDailogPro=false
                },
                changeWhich(state,value){
                        state.isWhich=value
                }
        }
})
export default store