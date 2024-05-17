export const  easeOutExpo = (x) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}


export const getXPS = (data) =>  {
    return data.filter(p => p.path.split("/")[3] != "checkpoint").map(project => ({
      name: getResourceFromPath(project.path),
      amount: project.amount
    }))
}

  
function getResourceFromPath(path) {
    const pathParts = path.split('/');

    const resource = pathParts[pathParts.length - 1];

    return resource;
}


export const strToDom = (str) => {
    return document.createRange().createContextualFragment(str).firstChild;
};

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toSvgPath() {
        return `${this.x} ${this.y}`;
    }

    static fromAngle(angle, radius=1, cx=0, cy=0) {
        return new Point(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
}

export const toSvgArc = (start, end, radius, ratio, fill='none', strk='#A11111', strkWidth='10') => {
    const largeFlag = ratio > .5 ? '1' : '0'
    const pathString = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeFlag} 0 ${end.x} ${end.y}`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathString);
    path.setAttribute("fill", `${fill}`);
    path.setAttribute("stroke", `${strk}`);
    path.setAttribute("stroke-width", `${strkWidth}`);
    // path.setAttribute(`stroke-linecap`, `round`);

    return path
}

// export const svgPoint = () => {
//     const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//     circle.setAttribute('cx', `${point.x}`);
//     circle.setAttribute('cy', `${point.y}`);
//     circle.setAttribute('r', `${0.02}`);
//     circle.setAttribute('fill', `${this.colors[k]}`);
//     circle.addEventListener('mouseover', () => this.handlePathHover(k));
//     circle.addEventListener('mouseout', () => this.handlePathOut(k));
//     this.svg.appendChild(circle);
//     return circle;
// }


export const svgCircle = (center, radius, strk="black", strkWidth="1") => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', `${center.x}`)
    circle.setAttribute('cy', `${center.y}`)
    circle.setAttribute('r', `${radius}`)
    circle.setAttribute('fill', 'none')
    circle.setAttribute('stroke', `${strk}`)
    circle.setAttribute('stroke-width', `${strkWidth}`)
    return circle
}

export const angleToRad = (angle) => (angle  * Math.PI) / 180

export class Circle {
    constructor(x, y, r) {
        this.cx = x;
        this.cy = y;
        this.radius = r;
    }

    pointFromAngle(angle) {
        return new Point(this.cx + this.radius * Math.cos(angle), this.cy + this.radius * Math.sin(angle));
    }
}



export const  filterSkills = (skills) => {
    const technologies = skills.filter(skill => {
        const type = skill.type;
        return type === "skill_go" ||
               type === "skill_js" ||
               type === "skill_html" ||
               type === "skill_css" ||
               type === "skill_sql" ||
               type === "skill_docker" ||
               type === "skill_unix";
    });

    const technicals = skills.filter(skill => !technologies.includes(skill));

    return {technologies: technologies, technicals: technicals};
}
