import { fetchData } from "../fetch.js"
import { filterSkills, getXPS } from "../helper/helper.js"
import LevelChart from "./charts/level.js"
import ProgressChart from "./charts/progress.js"
import { PieChart } from "./charts/pie.js"
import { RadarChart } from "./charts/radar.js"
import { BarChart } from "./charts/bar.js"
import { logout } from "../auth/auth.js"

customElements.define('level-chart', LevelChart)
customElements.define('radar-chart', RadarChart)
customElements.define('progress-bar', ProgressChart)
customElements.define('pie-chart', PieChart)
customElements.define('bar-chart', BarChart)


export default class ProfilePage extends HTMLElement {
    constructor() {
        super()
        // APPLICATION_CONTROLLER.getData()
        // console.log('hello')
        this.data = null
        this.user = {
            id: null,
            login: null,
            email: null,
            nationality: null,
            campus: null,
            ratio: null,
            firstName: null,
            lastName: null,
            level: null,
            xp: null
        };
		this.groups = null
        this.xps = null
        this.audit = null
        this.skills = null;
    }

   

    async connectedCallback() {
        // console.log(APPLICATION_CONTROLLER.user)
        const response  = await fetchData()
        this.data = response.data
        this.setData()
        this.render()
        console.log(this.data)
        this.logoutBtn?.addEventListener('click', logout)
        // ${this.skills.technologies.map(skill => `<progress-bar value=${skill.amount} label=${skill.type}></progress-bar>`).join('')}

        // xpFragment.innerHTML = `<pie-chart data="${this.skills.technicals.map(skill => skill.amount).join(';')}" labels="${this.skills.technicals.map(skill =>  skill.type.split('_')[0]).join(';')}"></pie-chart>`


        const graphContainer = this.querySelector('.graph-container')
        console.log(graphContainer)

        this.xpBtn?.addEventListener('click', (e)=> {
            e.preventDefault()
            graphContainer.innerHTML = ''
            graphContainer.innerHTML = `<radar-chart data="${this.skills.technicals.map(skill => skill.amount).join(';')}" labels="${this.skills.technicals.map(skill =>  skill.type.split('_')[1]).join(';')}"></radar-chart>`
        })

        this.skillBtn?.addEventListener('click', (e)=> {
            console.log("clicked")
            e.preventDefault()
            graphContainer.innerHTML = ''
            graphContainer.innerHTML = `<bar-chart data="${this.xps.map(skill => skill.amount).join(';')}" labels="${this.xps.map(skill => skill.name).join(';')}"></bar-chart>`
        })
    }

    setData() {
        console.log(this.data.user[0].events[0].level)
    
        this.user = {
            id: this.data.user[0].id,
            login: this.data.user[0].login,
            email: this.data.user[0].email,
            campus: this.data.user[0].campus,
            ratio: this.data.user[0].auditRatio,
            firstName: this.data.user[0].firstName,
            lastName: this.data.user[0].lastName,
            level: this.data.user[0].events[0]?.level,
            xp: this.data.user[0].xpTotal.aggregate.sum.amount
        }
        this.xps = getXPS(this.data.user[0].xp)
        this.audit = this.data.user[0].audits;
        const skills  = this.data.user[0].skills.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        this.skills = filterSkills(skills)
        this.finishedProject = this.data.user[0].finished_projects
        console.log(this.finishedProject)
    }

    disconnectedCallback() {
        this.logoutBtn?.removeEventListener('click', logout)
    }

    render() {
        this.innerHTML = `
            <section class="header">
                <a href="">GraphQL</a>
                <a class="logout" href="">Logout</a>
            </section>
            <section class="left-aside">
                <div class="level">
                    <level-chart maxLevel="50" level=${this.user.level}></level-chart>
                    <div class="user_infos">${this.user.firstName} ${this.user.lastName} - ${this.user.login}</div>
                </div>
                <div class="technologies">
                    <h3>Technologies</h3>
                    ${this.skills.technologies.map(skill => `<progress-bar value=${skill.amount} label=${skill.type}></progress-bar>`).join('')}
                </div>
            </section>
            <section class="attributes">
                <div class="infos">
                    <div class="name">campus</div>
                    <div class="value">${this.user.campus}</div>
                </div>
                <div class="infos">
                    <div class="name">xp</div>
                    <div class="value">${this.user.xp / 1000}</div>
                </div>
                <div class="infos">
                    <div class="name">projects</div>
                    <div class="value">${this.finishedProject.length}</div>
                </div>
                <div class="infos">
                    <div class="name">Ratio</div>
                    <div class="value">${parseFloat(this.user.ratio).toFixed(2)}</div>
                </div>
            </section>
            <section class="right-aside">
                <div class="navigation">
                    <button id="xp">Technical skill</button>
                    <button id="skills">xp per project</button>
                </div>
                <div class="graph-container">
                    <bar-chart data="${this.xps.map(skill => skill.amount).join(';')}" labels="${this.xps.map(skill => skill.name).join(';')}"></bar-chart>
                </div>
            </section>
            <section class="footer" style="text-align: center;">made with a lot of pressure</section>
        `
    }

    get logoutBtn() {
        return this.querySelector('.logout')
    }


    get xpBtn() {
        return this.querySelector('#xp')
    }

    get skillBtn() {
        return this.querySelector('#skills')
    }
}