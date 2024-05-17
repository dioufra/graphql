import { Point, easeOutExpo, strToDom } from "../../helper/helper.js";

/**
 * @property {number[]} data
 * @property {SVGPathElememt[]} paths
 */

export class PieChart extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const colors = ['#7C0902', '#AB274F', '#FB607F', '#C51E3A', '#E23D28', '#7F1734', '#FE6F5E', '#C21E56', '#B7410E', '#C46210', '#DAA520', '#CD5700', '#FBCEB1', '#E09540', '#FF8C00'];
        const donut = this.getAttribute('donut') ?? '0';
        const labels = this.getAttribute('labels')?.split(';') ?? [];

        this.data = this.getAttribute('data').split(';').map(v => parseFloat(v));

        const svg = strToDom(`<svg viewBox="-1 -1 2 2" preserveAspectRatio="xMidYMid meet">
            <g class="pathgroup" mask="url(#graphMask)">
            </g>
            <mask id="graphMask">
                <rect fill="white" x="-1" y="-1" width="2" height="2"/>
                <circle r="${donut}" fill="black"/>
            </mask>
        </svg>`);

        const pathgroup = svg.querySelector('g');
        const maskgroup = svg.querySelector('mask');
        const gap = this.getAttribute('gap') ?? '0.015';

        this.paths = this.data.map((_, k) => {
            const color = colors[k % (colors.length - 1)];
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', color);
            pathgroup.appendChild(path);
            path.addEventListener('mouseover', () => this.handlePathHover(k));
            path.addEventListener('mouseout', () => this.handlePathOut(k));

            return path;
        });

        shadow.appendChild(svg);

        this.lines = this.data.map((_, k) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', `${gap}`);
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '0');
            maskgroup.appendChild(line);
            return line;
        });

        this.labels = labels.map((label, k) => {
            const _label = document.createElement('div');
            const value = this.data[k];
            _label.innerText = `${label}\n${value}`;
            _label.style.textAlign = `center`;
            _label.style.fontSize = `20px`;
            _label.style.width = `max-content`;
            shadow.appendChild(_label);
            return _label;
        });

        const style = document.createElement('style');
        style.innerHTML = `
            :host {
                display: block;
                position: relative;
                width: 100%;
                height: 100%;
            }

            svg {
                width: 100%;
                height: 100%;
            }

            .pathgroup {
                transform: scale(1);
            }

            path {
                cursor: pointer;
                transition: opacity .3s;
            }

            path:hover {
                opacity: .5;
            }

            div {
                position: absolute;
                top: 0;
                left: 0;
                font-size: 0.8rem;
                padding: .1em .2em;
                transform: translate(-50%, -50%);
                background-color: var(--tooltip-bg, #FFF);
                opacity: 0;
                transition: opacity .3s;
            }

            .is-active {
                opacity: 1;
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(svg);

    }

    connectedCallback() {
        const now = Date.now();
        const duration = 1000;
        const draw = () => {
            const delta = (Date.now() - now) / duration;
            if (delta < 1) {
                this.draw(easeOutExpo(delta));
                window.requestAnimationFrame(draw);
            } else
                this.draw(easeOutExpo(delta));
        }
        window.requestAnimationFrame(draw);
    }

    disconnectedCallback() {
    }

    draw(progress = 1) {
        const total = this.data.reduce((acc, v) => acc + v, 0);
        let angle = Math.PI / -2;
        let start = new Point(0, -1);
        for (let k = 0; k < this.data.length; k++) {
            this.lines[k].setAttribute('x2', start.x);
            this.lines[k].setAttribute('y2', start.y);
            const ratio = (this.data[k] / total) * progress;
            this.addLabel(this.labels[k], angle + ratio * Math.PI);
            angle += ratio * 2 * Math.PI;
            const end = Point.fromAngle(angle);
            const largeFlag = ratio > .5 ? '1' : '0';
            this.paths[k].setAttribute('d', `M 0 0 L ${start.toSvgPath()} A 1 1 0 ${largeFlag} 1 ${end.toSvgPath()} L 0 0`);
            start = end;
        }
    }

    /**
     * set label position for a given angle
     * @param {HTMLDivElement[undefined]} label 
     * @param {number} angle 
     */
    addLabel(label, angle) {
        if (!label || !angle) {
            return;
        }
        const point = Point.fromAngle(angle);
        label.style.setProperty('top', `${(point.y * 0.5 + 0.5) * 100}%`);
        label.style.setProperty('left', `${(point.x * 0.5 + 0.5) * 100}%`);
    }

    /**
     * Display label if path is hovered
     * @param {number} k 
     */
    handlePathHover(k) {
        this.labels[k]?.classList.add('is-active');
    }

    /**
     * Hide label if path is left
     * @param {number} k 
     */
    handlePathOut(k) {
        this.labels[k]?.classList.remove('is-active');
    }

    render() {
        // this.innerHTML = ``;
    }
}

// customElements.  define('pie-chart', PieChart);
