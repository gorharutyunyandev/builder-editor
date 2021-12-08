import { Component } from '@angular/core';

@Component({
  selector: 'peb-shop-password-protection-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
        <defs>
            <filter id="h29ujdrc9a" width="104.2%" height="106.9%" x="-2.1%" y="-3.5%" filterUnits="objectBoundingBox">
                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
                <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"/>
                <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <path id="nylebv32gb" d="M0 0L16.969 0 16.969 19.378 0 19.378z"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
            <g>
                <g filter="url(#h29ujdrc9a)" transform="translate(-562 -560) translate(552 104)">
                    <g transform="translate(18 463)">
                        <rect width="28" height="28" fill="#86868B" rx="7"/>
                        <g transform="translate(5.09 3.818)">
                            <mask id="ycdqonfi8c" fill="#fff">
                                <use xlink:href="#nylebv32gb"/>
                            </mask>
                            <path fill="#FFF" d="M12.121 6.449H4.848c0-2.774 1.629-4.025 3.637-4.025 2.004 0 3.636 1.301 3.636 4.025m-3.109 6.627v1.929c0 .278-.236.518-.527.518-.283 0-.527-.233-.527-.518v-1.93c-.615-.217-1.056-.802-1.056-1.492 0-.874.71-1.582 1.583-1.582.874 0 1.583.708 1.583 1.582 0 .69-.44 1.275-1.056 1.493m5.533-6.627C14.545 2.5 11.825 0 8.485 0 5.138 0 2.424 2.134 2.424 6.45 1.144 6.449 0 7.53 0 8.88v8.066c0 1.343 1.087 2.432 2.431 2.432h12.107c1.343 0 2.431-1.08 2.431-2.432V8.88c0-1.34-1.14-2.431-2.424-2.431" mask="url(#ycdqonfi8c)"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  `,
})
export class PebShopPasswordProtectionComponent { }
