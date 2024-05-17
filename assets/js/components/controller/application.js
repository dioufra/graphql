import { fetchData } from "../../fetch.js";
import { getXPS } from "../../helper/helper.js";

class Application {
    constructor() {
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

    async getData() {
        try {
            const response = await fetchData()
            if (response) {
                console.log(response)
            }
            return null
        } catch(error) {
            throw new Error(error)
        }
    }

    setData(data) {
        console.log(data)
        this.user = {
            id: data.user[0].id,
            login: data.user[0].login,
            email: data.user[0].attrs.email,
            campus: data.user[0].campus,
            ratio: data.user[0].auditRatio,
            firstName: data.user[0].firstName,
            lastName: data.user[0].lastName,
            level: data.user[0].level,
            xp: data.xpTotal.aggregate.sum.amount
        }
        this.xps = getXPS(result.xp, user.xp)
        this.audit = result.audits;
        this.skills = result.skills.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).slice(0, 10);
        console.log("hello", this.user)
    }
}

export const APPLICATION_CONTROLLER = new Application()