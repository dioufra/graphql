import { Point, strToDom } from "../../helper/helper.js";


export class BarChart extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.svg = strToDom(`<svg viewBox="-1 -1 4 4"></svg>`);
        this.shadow.appendChild(this.svg);

        this.data = this.getAttribute('data').split(';').map(v => parseFloat(v));

        this.names = this.getAttribute('labels')?.split(';') ?? [];
        this.max = Math.max(...this.data);
        this.barWidth = (2 / this.data.length);
        const maxHeight = 3;

        this.AddDataLabel();

        let xPos = -1;
        this.points = this.data.map((data, k) => {
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const height = (data / this.max) * maxHeight;
            const yPos = maxHeight - height;
            bar.setAttribute('x', `${xPos}`);
            bar.setAttribute('y', `${yPos - 0.02}`);
            bar.setAttribute('width', `${this.barWidth}`);
            bar.setAttribute('height', `${height + 0.02}`);
            bar.setAttribute('fill', `#A11111`);
            bar.addEventListener('mouseover', (e) => this.handlePathHover(e, bar, k));
            bar.addEventListener('mouseout', () => this.handlePathOut(bar));
            this.svg.appendChild(bar);

            const point = new Point(xPos, yPos);

            xPos += (this.barWidth + 0.009);
            return point;
        });

        this.addXAxis();
        this.addYAxis()

        this.createTooltip();
    }

    AddDataLabel() {
        const width = 2 * this.barWidth;
        const height = 0.15;
        let boxY = 1.03;
        let boxX = 2;

        this.label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.label.classList.add('label');

        const labelBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBox.setAttribute('x', `${boxX}`);
        labelBox.setAttribute('y', `${boxY}`);
        labelBox.setAttribute('width', `${width}`);
        labelBox.setAttribute('height', `${height}`);
        labelBox.setAttribute('fill', '#A11111');
        this.label.appendChild(labelBox);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', `${boxX + width + 0.05}`);
        label.setAttribute('y', `${boxY + (height / 2) }`);
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('font-size', `0.08`);
        label.setAttribute('fill', 'black');
        this.label.appendChild(label);

        this.svg.appendChild(this.label);
    }

    addYAxis() {
        const yLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yLine.setAttribute('x1', '-1');
        yLine.setAttribute('y1', '-1');
        yLine.setAttribute('x2', '-1');
        yLine.setAttribute('y2', '3');
        yLine.setAttribute('stroke', 'black');
        yLine.setAttribute('stroke-width', '0.02');
        this.svg.appendChild(yLine);

        // Add y axis labels
        
    }

    addXAxis() {
        const xLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xLine.setAttribute('x1', '-1');
        xLine.setAttribute('y1', '3');
        xLine.setAttribute('x2', '3');
        xLine.setAttribute('y2', '3');
        xLine.setAttribute('stroke', 'black');
        xLine.setAttribute('stroke-width', '0.02');
        this.svg.appendChild(xLine);

    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.padding = '5px';
        this.tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.tooltip.style.color = '#fff';
        this.tooltip.style.borderRadius = '4px';
        this.tooltip.style.pointerEvents = 'none';
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transition = 'opacity 0.3s';
        document.body.appendChild(this.tooltip);
    }

    handlePathHover(event, bar, k) {
        bar.setAttribute('fill', `#555555`);
        const labelText = `${this.names[k]}: ${this.data[k] * 100}kb`;
        this.tooltip.textContent = labelText;
        this.tooltip.style.opacity = '1';
        this.updateTooltipPosition(event);
    }

    handlePathOut(bar) {
        bar.setAttribute('fill', `#A11111`);
        this.tooltip.style.opacity = '0';
    }

    updateTooltipPosition(event) {
        const x = event.clientX;
        const y = event.clientY;
        this.tooltip.style.left = `${x + 10}px`;
        this.tooltip.style.top = `${y + 10}px`;
    }

    connectedCallback() {
        this.renderStyle();
    }

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
            .label-active {
                opacity: 1;
            }
            .is-active {
                opacity: 1;
            }
            .tooltip {
                font-size: 12px;
            }
        `;
        this.shadow.appendChild(style);
    }
}

// customElements.define('bar-chart', BarChart);
