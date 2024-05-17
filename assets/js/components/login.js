import { login } from "../auth/auth.js"

export default class LoginPage extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        const loginForm = this.querySelector('form')
        loginForm?.addEventListener('submit', login)
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = `
        <div class="l-form">
            <form id="login-form" class="form">
                <h1 class="form__title">Sign In</h1>
                <p id="error-message" ></p>
                <div class="form__div">
                    <input type="text" name="login" class="form__input"  placeholder="" id="login">
                    <label for="" class="form__label">Email or Username</label>
                </div>
                <div class="form__div">
                    <input type="password" name="password" class="form__input" placeholder="" id="password">
                    <label for="" class="form__label">Password</label>
                    </div>
                <button  id="login-btn" type="submit" class="form__button" >Sign In</button>
            </form>
         </div>
        `
    }
}