import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import { useToast } from 'vue-toast-notification'
const toast= useToast()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landingpage',
      meta:{
        isRequiredAuth:false
      },
      component: LandingView
    },
    // {
    //   path: '/file/:filename',
    //   props:true,
    //   name: 'file',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/FileView.vue')
    // },
    {
      path:"/home",
      name:"home",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/HomeView.vue")
    },
    {
      path:"/verify",
      name:"verify",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/verifyEmail.vue")
    },
    {
      path:"/signin",
      name:"signin",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/SigninView.vue")
    },
    {
      path:"/signup",
      name:"signup",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/SignupView.vue")
    },
    {
      path:"/storage",
      name:"storage",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/StorageView.vue")
    },
    {
      path:"/peers",
      name:"peers",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/PeersView.vue")
    },
    {
      path:"/upgrade",
      name:"upgrade",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/UpgradeView.vue")
    },
    {
      path:"/notifications",
      name:"notifications",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/NotificationView.vue")
    },
    {
      path:"/settings",
      name:"settings",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/SettingsView.vue")
    },
    {
      path:"/shared",
      name:"shared",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/SharedView.vue")
    },
    {
      path:"/guide",
      name:"guide",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/GuideView.vue")
    },
    {
      path:"/:pathMatch(.*)*",
      name:"404",
      component:()=>import("../views/NotFoundView.vue")
    }
  ]
})

router.beforeEach((to,from,next)=>{
  const data:any=localStorage.getItem("userdata")
  let isUserAuthenticated=data?JSON.parse(data).token:null;
  
  const isRequiredAuth=to.matched.some(
    (record)=>record.meta.isRequiredAuth
  );
  //check for protected route
  if(isUserAuthenticated!==null){
    if(!isRequiredAuth&&isUserAuthenticated!==null){
        next("/home")
      }else{
        next()
    }
  }else{
    if(isRequiredAuth&&isUserAuthenticated===null){
      toast.error("Not Authenticated!!",{
        position:'top-right',
        duration:5000
      })
      next("/signin")
    }else{
        next()
    }
  }
})

export default router
