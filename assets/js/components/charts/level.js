import { angleToRad, Point, toSvgArc, strToDom, svgCircle } from "../../helper/helper.js";

export default class LevelChart extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this.level = parseFloat(this.getAttribute('level')) || 0;
        this.maxLevel = parseFloat(this.getAttribute('maxLevel')) || 100; // Provide a default value if attribute is missing
        this.createChart();
        const style = document.createElement('style')
        style.innerHTML = `
            * {
                box-sizing: border-box;
            }
        
            svg {
                width: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                overflow: hidden;
                position: absolute;
                filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.2));
            }
            .container {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            
            .infos{
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                color: var(--grey90);
                font-family: 'IBM Plex Mono', monospace;
            }

            .level, .value {
                font-size: 1.5rem;
            }

            @keyframes drawArc {
                from {
                    stroke-dasharray: 0 220; /* Start with a stroke-dasharray of 0 */
                }
                to {
                    stroke-dasharray: 220 0; /* End with a stroke-dasharray of 220 */
                }
            }
        `
        this.shadow.appendChild(style)
    }

    createChart() {
        const container = this.createContainer();
        this.shadow.appendChild(container);
    }

    createContainer() {
        const container = strToDom(`<div class="container"></div>`);
        const innerCircleRadius = 30;
        const innerCircleCenter = new Point(50, 50);
        const innerCircle = strToDom(`<svg viewBox="0 0 100 100"></svg>`);
        // innerCircle.appendChild(svgCircle(innerCircleCenter, innerCircleRadius));
        const infos = this.createInfos();
        container.append(this.createProgressSvg(), innerCircle, infos);
        return container;
    }

    createProgressSvg() {
        const progressSvg = strToDom(`<svg class="progress" viewBox="0 0 100 100"></svg>`);
        // const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const pathString = this.calculatePathString();
        // console.log(pathString)
        // path.setAttribute("d", `${pathString}`);
        // path.setAttribute("fill", "none");
        // path.setAttribute("stroke", "lightblue");
        pathString.style.animation = "drawArc 1s forwards"; // 1s is the duration of the animation
        progressSvg.appendChild(pathString);
        return progressSvg;
    }

    calculatePathString() {
        const start = -60;
        const startAngle = angleToRad(start);
        const startPt = Point.fromAngle(startAngle, 35, 50, 50);
        const end = (-this.level / this.maxLevel * 360) + start;
        const endAngle = angleToRad(end);
        const endPt = Point.fromAngle(endAngle, 35, 50, 50);
        return toSvgArc(startPt, endPt, 35, this.level / this.maxLevel);
    }

    createInfos() {
        const infos = strToDom(
            `<div class="infos">
                <div class="level">Level</div>
                <div class="value">${this.level}</div>
            </div>
            `
        );
        return infos;
    }
}

// Usage:
// <level-chart maxLevel="100"></level-chart>
