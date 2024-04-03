// ==UserScript==
// @name         TradingView Widget CSS-1.Gainer and Loser
// @namespace    https://www.tradingview.com/widget-docs/widgets/watchlists/stock-market/
// @version      2024-02-19
// @description  Track all markets on TradingView CSS
// @author       You
// @match        https://*.tradingview.com/chart/*
// @icon         https://static.tradingview.com/static/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @sandbox      true
// @noframes
// ==/UserScript==






(function() {
    'use strict';

    // 创建一个函数来添加CSS2样式
    let stylesAdded = false;

    // 创建一个函数来添加CSS样式
    function addCSS(cssContent, identifier) {
        if (!stylesAdded) {
            var styleElement = document.createElement('style');
            styleElement.textContent = cssContent;
            styleElement.setAttribute('data-identifier', identifier);
            document.head.appendChild(styleElement);
            stylesAdded = true;
        }
    }


    // Add custom style using GM_addStyle 強制使用格式
    let customBackgroundColor11 = "#0b0f26";
    let customBackgroundColor12 = "#01168c";
    GM_addStyle(".tradingview-popup-script11{background-color: " + customBackgroundColor11 + " !important }");
    GM_addStyle(".tradingview-popup-script12{background-color: " + customBackgroundColor12 + " !important }");







    // Add CSS styles for the popup
    addCSS(`
        .tradingview-popup-script11 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-260%, -30%);
            background-color: #0b0f26;
            border: 1px solid #262626;
            padding: 10px;
            z-index: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            cursor: move; /* 添加拖动时的鼠标样式 */
        }
    `, 'tradingview-popup-script11 ');




    // Create a function to add the TradingView widget
    function addTradingViewWidget() {

        var container = document.createElement('div');
        container.className = 'tradingview-popup-script11';
        container.innerHTML = `



            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/widget-docs/widgets/watchlists/stock-market/" rel="noopener nofollow" target="_blank">
                        <span class="blue-text">1.Gainer and Loser</span>
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Load the TradingView widget script
        var script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
        script.async = true;
        script.innerHTML =`
        {
          "colorTheme": "dark",
  "dateRange": "12M",
  "exchange": "US",
  "showChart": true,
  "locale": "en",
  "largeChartUrl": "",
  "isTransparent": false,
  "showSymbolLogo": true,
  "showFloatingTooltip": true,
  "width": "300",
  "height": "550",
  "plotLineColorGrowing": "rgba(255, 0, 0, 1)",
  "plotLineColorFalling": "rgba(0, 255, 0, 1)",
  "gridLineColor": "rgba(42, 46, 57, 0)",
  "scaleFontColor": "rgba(134, 137, 147, 1)",
  "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
  "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
  "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
  "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
  "symbolActiveColor": "rgba(41, 98, 255, 0.12)"
        }
        `;
        container.appendChild(script);






        // Add event listeners for clicking
        container.addEventListener('click', function() {
            container.style.zIndex = getMaxZIndex() + 1;
        });

        // 獲取文檔中最高的z-index值
        function getMaxZIndex() {
            var elements = document.getElementsByTagName('*');
            var maxIndex = 0;
            for (var i = 0; i < elements.length; i++) {
                var zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
                if (!isNaN(zIndex) && zIndex > maxIndex) {
                    maxIndex = zIndex;
                }
            }
            return maxIndex;
        }









        // Add event listeners for dragging
        var offsetX, offsetY, isDragging = false;
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = e.clientX - offsetX + 'px';
                container.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });






        // Create a function to toggle the CSS window size
        function toggleCSSWindowSize() {
            if (container.style.width === '300px') {
                container.style.width = '200px';
                container.style.height = '275px';
            } else {
                container.style.width = '300px';
                container.style.height = '550px';
            }
        }

        // Create a button to toggle the CSS window size
        var toggleButton = document.createElement('button');
        toggleButton.textContent = 'T';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = 'auto';
        toggleButton.addEventListener('click', toggleCSSWindowSize);

        // Add the button to the container
        container.appendChild(toggleButton);



        // Create a function to hide the CSS window
        function hideCSSWindow() {
            container.style.display = 'none';
            document.body.appendChild(restoreButton);
        }

        // Create a button to hide the CSS window
        var hideButton = document.createElement('button');
        hideButton.textContent = 'H';
        hideButton.style.position = 'absolute';
        hideButton.style.bottom = '10px';
        hideButton.style.left = '10px';
        hideButton.style.zIndex = 'auto';
        hideButton.addEventListener('click', hideCSSWindow);
        hideButton.style.backgroundColor = customBackgroundColor12;

        // Add the button to the container
        container.appendChild(hideButton);

        // Create a function to restore the CSS window
        function restoreCSSWindow() {
            container.style.display = 'block';
            document.body.removeChild(restoreButton);
        }

        // Create a button to restore the CSS window
        var restoreButton = document.createElement('button');
        restoreButton.textContent = 'G/L';
        restoreButton.style.position = 'absolute';
        restoreButton.style.bottom = '10px';
        restoreButton.style.left = '10px';
        restoreButton.style.zIndex = '10000';
        restoreButton.addEventListener('click', restoreCSSWindow);
        restoreButton.style.borderRadius = '8px';
        restoreButton.style.backgroundColor = customBackgroundColor12;


        // Add the button to the container
        container.appendChild(restoreButton);


        // 模擬點擊隱藏按鈕
        hideButton.click();

    }



    // Call the function to add the TradingView widget
    addTradingViewWidget();



})();
