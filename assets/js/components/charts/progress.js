import { Point, strToDom } from "../../helper/helper.js";

export default class ProgressChart extends HTMLElement {
    constructor() {
        super();

        this.max = 100;
        this.y = 4;
        this.value = parseFloat(this.getAttribute('value'));
        this.label = this.getAttribute('label').split('_')[1];
        const end = (100 * this.value) / this.max;
        this.shadow = this.attachShadow({ mode: 'open' });
        this.backgroundCoordinates = { start: new Point(50, 4), end: new Point(150, 4) };
        this.progressCoordinates = { start: new Point(50, 4), end: new Point(50 + end, 4) };
        this.textPosition = new Point(10, 7);

        this.svg = strToDom(`<svg viewBox="0 0 150 8" class="loader linear-1"></svg>`);

        const backgroundPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        backgroundPath.setAttribute('d', `M ${this.backgroundCoordinates.start.toSvgPath()} L ${this.backgroundCoordinates.end.toSvgPath()}`);
        backgroundPath.classList.add('background-bar');

        const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        progressPath.setAttribute('d', `M ${this.progressCoordinates.start.toSvgPath()} L ${this.progressCoordinates.end.toSvgPath()}`);
        progressPath.setAttribute('stroke', `#A11111`);
        progressPath.classList.add('progress-bar');

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', `${this.textPosition.x}`);
        label.setAttribute('y', `${this.textPosition.y}`);
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('font-size', `10`);
        label.setAttribute('fill', 'black');
        label.textContent = this.label;

        this.svg.append(backgroundPath, progressPath, label);

        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `${this.value}`;
        tooltip.style.position = 'absolute';
        tooltip.style.padding = '5px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = '#fff';
        tooltip.style.borderRadius = '4px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';

        const style = document.createElement('style');
        style.innerHTML = `
            .background-bar {
                stroke: grey;
                stroke-linecap: round;
            }
            .progress-bar {
                stroke: #A11111;
                stroke-linecap: round;
                stroke-width: 3%;
            }
            .loader {
                width: 80%;
            }
            .tooltip {
                font-size: 12px;
            }
        `;

        this.shadow.appendChild(this.svg);
        this.shadow.appendChild(style);
        this.shadow.appendChild(tooltip);

        this.addEventListener('mouseover', (e) => this.handleMouseOver(e, tooltip));
        this.addEventListener('mousemove', (e) => this.handleMouseMove(e, tooltip));
        this.addEventListener('mouseout', () => this.handleMouseOut(tooltip));
    }

    handleMouseOver(e, tooltip) {
        tooltip.style.opacity = '1';
    }

    handleMouseMove(e, tooltip) {
        const x = e.clientX;
        const y = e.clientY;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
    }

    handleMouseOut(tooltip) {
        tooltip.style.opacity = '0';
    }

    connectedCallback() {}

    disconnectedCallback() {}

    render() {
        this.innerHTML = ``;
    }
}

// customElements.define('progress-chart', ProgressChart);
