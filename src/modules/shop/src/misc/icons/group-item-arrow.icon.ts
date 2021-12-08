import { Component } from '@angular/core';

@Component({
  selector: 'peb-shop-group-item-arrow-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
        <defs>
            <filter id="pow9zwe0ea" width="104.2%" height="106.9%" x="-2.1%" y="-3.5%" filterUnits="objectBoundingBox">
                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
                <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"/>
                <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g fill="none" fill-rule="evenodd">
            <g fill="#969696" fill-rule="nonzero">
                <g filter="url(#pow9zwe0ea)" transform="translate(-1354 -386) translate(552 104)">
                    <path d="M809.364 288.364c.322-.323.827-.35 1.18-.08l.092.08 8 8c.323.322.35.827.08 1.18l-.08.092-8 8c-.351.352-.92.352-1.272 0-.323-.322-.35-.827-.08-1.18l.08-.092 7.363-7.364-7.363-7.364c-.323-.322-.35-.827-.08-1.18l.08-.092z"/>
                </g>
            </g>
        </g>
    </svg>
  `,
})
export class PebShopGroupItemArrowComponent { }
