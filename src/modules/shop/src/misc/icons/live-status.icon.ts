import { Component } from '@angular/core';

@Component({
  selector: 'peb-shop-live-status-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <defs>
            <filter id="maw08niy0a" width="104.2%" height="106.9%" x="-2.1%" y="-3.5%" filterUnits="objectBoundingBox">
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
            <g>
                <g filter="url(#maw08niy0a)" transform="translate(-562 -207) translate(552 104)">
                    <g transform="translate(18 110)">
                        <rect width="28" height="28" fill="#86868B" rx="7"/>
                        <g fill="#FFF">
                            <path d="M11.455 7.636c0-.703-.57-1.272-1.273-1.272s-1.273.57-1.273 1.272c0 .703.57 1.273 1.273 1.273s1.273-.57 1.273-1.273M6.625 12.742c-.23 0-.46-.08-.644-.24-1.375-1.201-2.163-2.912-2.163-4.695 0-1.813.81-3.544 2.224-4.748.396-.338 1.001-.303 1.353.077.351.38.315.96-.08 1.298-1.005.856-1.58 2.085-1.58 3.373 0 1.266.56 2.482 1.536 3.335.391.342.42.923.063 1.299-.189.2-.448.3-.709.3M13.738 12.742c-.26 0-.52-.102-.709-.301-.356-.376-.327-.957.064-1.3.976-.852 1.536-2.068 1.536-3.334 0-1.288-.576-2.517-1.58-3.373-.395-.337-.431-.919-.08-1.298.351-.38.957-.415 1.353-.077 1.413 1.204 2.223 2.935 2.223 4.748 0 1.783-.788 3.494-2.162 4.695-.184.16-.415.24-.645.24" transform="translate(3.818 6.364)"/>
                            <path d="M4.181 15.523c-.198 0-.397-.065-.564-.199C1.318 13.481 0 10.724 0 7.762 0 4.798 1.318 2.042 3.617.199c.393-.316.965-.249 1.277.15.312.397.246.976-.148 1.291C2.886 3.132 1.82 5.364 1.82 7.762c0 2.398 1.067 4.629 2.927 6.12.394.316.46.895.148 1.293-.18.229-.445.348-.713.348M16.183 15.523c-.269 0-.534-.12-.714-.348-.311-.398-.245-.977.148-1.292 1.86-1.492 2.928-3.723 2.928-6.121 0-2.398-1.067-4.63-2.928-6.122-.393-.315-.46-.894-.148-1.292.312-.398.884-.465 1.278-.149 2.298 1.843 3.617 4.6 3.617 7.563s-1.319 5.72-3.617 7.562c-.167.134-.367.2-.564.2" transform="translate(3.818 6.364)"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  `,
})
export class PebShopLiveStatusIconComponent { }
