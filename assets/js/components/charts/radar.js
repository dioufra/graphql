const strToDom = (str) => {
    return document.createRange().createContextualFragment(str).firstChild;
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toSvgPath() {
        return `${this.x} ${this.y}`;
    }

    static fromAngle(angle) {
        return new Point(Math.cos(angle), Math.sin(angle));
    }
}


class SvgPoint {
    constructor(center, color, label) {
        this.center = { x: center.x, y: center.y }
        this.color = color
        this.label = label
    }

    create() {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${this.center.x}`);
        circle.setAttribute('cy', `${this.center.y}`);
        circle.setAttribute('r', `${0.02}`);
        circle.setAttribute('fill', `${this.color}`);
        circle.addEventListener('mouseover', () => this.handlePathHover());
        circle.addEventListener('mouseout', () => this.handlePathOut());
        return circle
    }



    handlePathHover() {
        this.label?.classList.add('is-active');
    }

    handlePathOut() {
        this.label?.classList.remove('is-active');
    }
}

class Circle {
    constructor(x, y, r) {
        this.cx = x;
        this.cy = y;
        this.radius = r;
    }

    pointFromAngle(angle) {
        return new Point(this.cx + this.radius * Math.cos(angle), this.cy + this.radius * Math.sin(angle));
    }
}

export class RadarChart extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.colors = ['#7C0902', '#AB274F', '#FB607F', '#C51E3A', '#E23D28', '#7F1734', '#FE6F5E', '#C21E56', '#B7410E', '#C46210', '#DAA520', '#CD5700', '#FBCEB1', '#E09540', '#FF8C00'];
        this.center = { x: 0, y: 0 };
        this.maxRadius = 1;
        this.data = this.getAttribute('data').split(';').map(v => parseFloat(v));
        this.names = this.getAttribute('labels')?.split(';') ?? [];
        const max = Math.max(...this.data);
        this.svg = strToDom(`<svg viewBox="-1 -1 2 2"></svg>`);

        this.circles = [];
        for (let i = 1; i <= 10; i++) {
            this.circles.push(new Circle(0, 0, i / 10));
        }

        const outerCircle = new Circle(this.center.x, this.center.y, this.maxRadius);
        const size = this.data.length;

        let angle = 0;
        for (let i = 0; i < size; i++) {
            angle += 2 * Math.PI / size;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const point = outerCircle.pointFromAngle(angle);
            line.setAttribute('x1', `${this.center.x}`);
            line.setAttribute('y1', `${this.center.y}`);
            line.setAttribute('x2', `${point.x}`);
            line.setAttribute('y2', `${point.y}`);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', `${point.x}`)
            text.setAttribute('y', `${point.y}`)
            text.setAttribute('font-size', `0.07`)
            text.setAttribute('fill', `black`)
            text.textContent  = this.names[i]

            line.setAttribute('stroke-width', `0.001`);
            line.setAttribute('stroke', `blue`);
            this.svg.appendChild(text)
            this.svg.appendChild(line);
        }

    }

    normalizeData(max = 100) {
        this.data.forEach((_, k) => {
            this.data[k] /= max;
        });
    }

    drawPolygon() {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const start = `M ${this.points[0].x} ${this.points[0].y}`;
        this.lines = this.points.slice(1).map(point => {
            return `L ${point.toSvgPath()}`;
        });

        path.setAttribute('d', `${start} ${this.lines.join(' ')}Z`);
        path.setAttribute('fill', 'rgba(255, 99, 132, 0.2)');
        path.setAttribute('stroke', 'rgb(255, 99, 132)');
        path.setAttribute('stroke-width', '.01');
        path.setAttribute('fill-opacity', '.5');
        this.svg.appendChild(path);
    }

    createLines() {
        const size = this.data.length;
        this.lines = [];
        this.circles.forEach((circle) => {
            let test = [];
            let _ang = 0;
            for (let i = 0; i < size; i++) {
                _ang += 2 * Math.PI / size;
                const x = circle.cx + circle.radius * Math.cos(_ang);
                const y = circle.cy + circle.radius * Math.sin(_ang);
                test.push(new Point(x, y));
            }
            const _path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const _start = `M ${test[0].x} ${test[0].y}`;
            this._lines = test.slice(1).map(point => {
                return `L ${point.toSvgPath()}`;
            });

            _path.setAttribute('d', `${_start} ${this._lines.join(' ')}Z`);
            _path.setAttribute('fill', 'none');
            _path.setAttribute('stroke', 'blue');
            _path.setAttribute('stroke-width', '.001');
            _path.setAttribute('fill-opacity', '.5');
            // this.svg.appendChild(_path);
            this.lines.push(_path);
        });
    }

    AddLines() {
        this.lines.forEach(line => this.svg.appendChild(line));
    }

    createDataPoints() {
        const outerCircle = new Circle(this.center.x, this.center.y, this.maxRadius);
        const size = this.data.length;
        this.normalizeData();
        let _angle = 0;
        this.points = this.data.map((_, k) => {
            _angle += 2 * Math.PI / size;
            const x = outerCircle.cx + (this.data[k] * outerCircle.radius) * Math.cos(_angle);
            const y = outerCircle.cy + (this.data[k] * outerCircle.radius) * Math.sin(_angle);
            return new Point(x, y);
        });
    }

    PlaceDataPoints() {
        this.circles = this.points.map((point, k) => {
            const center = new Point(point.x, point.y)
            const circle = new SvgPoint(center, this.colors[k], this.labels[k]).create();
            this.svg.appendChild(circle);
            return circle;
        });

    }

    AddDataLabels() {
        this.labels = this.points.map((point, k) => {
            const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            labelGroup.classList.add('label')


            const label = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            label.setAttribute('points', `${point.x + 0.1},${point.y - 0.1} ${point.x + 0.42},${point.y - 0.1} ${point.x + 0.42},${point.y + 0.1} ${point.x + 0.1},${point.y + 0.1} ${point.x},${point.y}`);
            label.setAttribute('fill', 'black');

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', `${point.x + 0.25}`);
            text.setAttribute('y', `${point.y}`);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '.05');

            text.setAttribute('alignment-baseline', 'middle');
            text.setAttribute('fill', 'white');
            text.textContent = `${this.names[k]}\n${this.data[k] * 100}`;

            labelGroup.append(label, text)
            this.svg.appendChild(labelGroup)
            return labelGroup

        });
    }


    connectedCallback() {
        this.AddLines(this.createLines());
        this.createDataPoints();
        this.drawPolygon();
        this.AddDataLabels()
        this.PlaceDataPoints();
        this.shadow.appendChild(this.svg);
        this.renderStyle()
    }

    handlePathHover(k) {
        this._labels[k]?.classList.add('is-active');
    }

    handlePathOut(k) {
        this._labels[k]?.classList.remove('is-active');
    }

    // disconnectedCallback() {

    // }

    // render() {
    //     this.innerHTML = ``;
    // }

    renderStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            :host {
                display: block;
                position: absolute;
                width: 85%;
                height: 85%;
                top: 50%;
                left: 50%;
                margin: 0 auto;
                transform: translate(-50%, -50%);
            }
            svg {
                width: 100%;
                height: 100%;
            }
            circle {
                cursor: pointer;
                transition: opacity .3s;
                z-index: 1;
            }
            path {
                z-index: 0;
            }

            circle:hover {
                opacity: .5;
            }

            .label {
                opacity: 0;
            }
            
            

            .is-active {
                opacity: 1;
            }
        `;
        this.shadow.appendChild(style);
    }
}
