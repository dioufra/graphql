import { strToDom } from "../../helper/helper.js";

export default class ProgressChart extends HTMLElement {
    constructor() {
        super();

        this.max = 100;
        this.value = parseFloat(this.getAttribute('value'));
        this.label = this.formatLabel(this.getAttribute('label').split('_')[1]);
        this.shadow = this.attachShadow({ mode: 'open' });

        const row = strToDom(`<div class="row"></div>`);

        const labelEl = document.createElement('span');
        labelEl.classList.add('tech-label');
        labelEl.textContent = this.label;

        this.svg = strToDom(`<svg viewBox="0 0 100 8" preserveAspectRatio="none" class="bar"></svg>`);

        const backgroundPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        backgroundPath.setAttribute('d', `M 2 4 L 98 4`);
        backgroundPath.classList.add('background-bar');

        const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const progressEnd = 2 + (96 * this.value) / this.max;
        progressPath.setAttribute('d', `M 2 4 L ${progressEnd} 4`);
        progressPath.classList.add('progress-bar');

        this.svg.append(backgroundPath, progressPath);
        row.append(labelEl, this.svg);

        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `${this.value}`;
        tooltip.style.position = 'fixed';
        tooltip.style.padding = '5px 8px';
        tooltip.style.backgroundColor = 'rgba(11, 16, 32, 0.92)';
        tooltip.style.border = '1px solid rgba(255,255,255,0.12)';
        tooltip.style.color = '#e8ecf3';
        tooltip.style.borderRadius = '6px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';

        const style = document.createElement('style');
        style.innerHTML = `
            .row {
                display: flex;
                align-items: center;
                gap: 0.85rem;
                width: 100%;
            }
            .tech-label {
                flex: 0 0 60px;
                font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
                font-size: 0.9rem;
                font-weight: 600;
                color: #e8ecf3;
            }
            .bar {
                flex: 1;
                height: 8px;
                overflow: visible;
                cursor: pointer;
            }
            .background-bar {
                stroke: rgba(255, 255, 255, 0.14);
                stroke-width: 5;
                stroke-linecap: round;
            }
            .progress-bar {
                stroke: #ff5d73;
                stroke-width: 5;
                stroke-linecap: round;
            }
            .tooltip {
                font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
            }
        `;

        this.shadow.append(row, style, tooltip);

        this.addEventListener('mouseover', () => this.handleMouseOver(tooltip));
        this.addEventListener('mousemove', (e) => this.handleMouseMove(e, tooltip));
        this.addEventListener('mouseout', () => this.handleMouseOut(tooltip));
    }

    formatLabel(raw = '') {
        const acronyms = new Set(['html', 'css', 'js', 'sql', 'tcp', 'ai', 'sh', 'graphql']);
        const key = raw.toLowerCase();
        return acronyms.has(key) ? raw.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1);
    }

    handleMouseOver(tooltip) {
        tooltip.style.opacity = '1';
    }

    handleMouseMove(e, tooltip) {
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY + 12}px`;
    }

    handleMouseOut(tooltip) {
        tooltip.style.opacity = '0';
    }

    connectedCallback() {}

    disconnectedCallback() {}
}

// customElements.define('progress-chart', ProgressChart);
