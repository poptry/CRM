import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store =  new Vuex.Store({
        state:{
                isInDailog:false,
                isWhich:'',
                isInDailogPro:false,
                client:''
        },
        mutations:{
                inDailog(state){
                        state.isInDailog=true
                        console.log('inDailog');
                },
                isNotInDailog(state){
                        state.isInDailog=false
                        console.log('inNotDailog');

                },
                inDailogPro(state){
                        state.isInDailogPro=true
                },
                isNotInDailogPro(state){
                        state.isInDailogPro=false
                },
                changeWhich(state,value){
                        state.isWhich=value
                },
                getClient(state,id){
                        state.client = id
                }
        }
})
export default store