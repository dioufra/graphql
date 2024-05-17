import { isAuth, login, logout } from "./auth/auth.js"

console.log('howdy')
// import LevelChart from "./components/charts/level.js"
import ProgressChart from "./components/charts/progress.js"
import LoginPage from "./components/login.js"
import ProfilePage from "./components/profile.js"

// customElements.define('c-login', Login)
// customElements.define('level-chart', LevelChart)
customElements.define('c-login-page', LoginPage)
customElements.define('c-profile-page', ProfilePage)
// customElements.define('progress-chart', ProgressChart)


const app = document.getElementById('app')



const auth = await isAuth()

if (auth) {
    console.log('yes')
    document.body.innerHTML =  `<c-profile-page></c-profile-page>`
} else {
    console.log('no')
    document.body.innerHTML =  `<c-login-page></c-login-page>`
}