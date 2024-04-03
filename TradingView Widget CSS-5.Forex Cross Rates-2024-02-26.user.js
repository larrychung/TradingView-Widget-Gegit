// ==UserScript==
// @name         TradingView Widget CSS-5.Forex Cross Rates
// @namespace    https://www.tradingview.com/widget-docs/widgets/heatmaps/forex-cross-rates/
// @version      2024-02-26
// @description  Track all markets on TradingView CSS
// @author       You
// @match        https://*.tradingview.com/chart/*
// @icon         https://static.tradingview.com/static/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @sandbox      true

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
    let customBackgroundColor51 = "#29002b"; //darker
    let customBackgroundColor52 = "#74007a"; //lighter
    GM_addStyle(".tradingview-popup-script51{background-color: " + customBackgroundColor51 + " !important }");
    GM_addStyle(".tradingview-popup-script52{background-color: " + customBackgroundColor52 + " !important }");



    // Add CSS styles for the popup
    addCSS(`
        .tradingview-popup-script51{
            position: absolute;
            top: 65%;
            left: 45%;
            transform: translate(-50%, -50%);
            background-color: #1c0909;
            border: 1px solid #262626;
            padding: 10px;
            z-index: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-Radius: 8px;
            cursor: move; /* 添加拖动时的鼠标样式 */

        }
`, 'tradingview-popup-scrip51');







    // Create a function to add the TradingView widget
    function addTradingViewWidget() {
        var container = document.createElement('div');
        container.className = 'tradingview-popup-script51';
        container.innerHTML = `

        <style>
       .tradingview-widget-container4 .blue-text {
        font-size: 16px; /* 調整字體大小為 16 像素 */
        }
       </style>

            <div class="tradingview-widget-container4">
                <div class="tradingview-widget-container__widget"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/widget-docs/widgets/heatmaps/forex-cross-rates/" rel="noopener nofollow" target="_blank">
                        <span class="blue-text">5.Forex Cross Rates</span>
                        <span class="green-text">-Track all markets on TradingView</span>
                    </a>
                </div>
            </div>
        `;





        document.body.appendChild(container);

        // Load the TradingView widget script
        var script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
        script.async = true;




        script.innerHTML = `
           {
  "width": "770",
  "height": "400",
  "currencies": [
    "TWD",
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "CHF",
    "AUD",
    "NZD"

  ],
  "isTransparent": true,
  "colorTheme": "dark",
  "locale": "en"
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
            if (e.button === 0) { // 檢查滑鼠左鍵是否被按下
                isDragging = true;
                offsetX = e.clientX - container.offsetLeft;
                offsetY = e.clientY - container.offsetTop;
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = e.clientX - offsetX + 'px';
                container.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                offsetX = 0;
                offsetY = 0;
            }
        });












        // Create a function to toggle the CSS window size
        function toggleCSSWindowSize() {
            if (container.style.width === '600px') {
                container.style.width = '700px';
                container.style.height = '400px';
            } else {
                container.style.width = '700px';
                container.style.height = '400px';
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
        hideButton.style.top = '10px';
        hideButton.style.right = '40px';
        hideButton.style.zIndex = 'auto';
        hideButton.addEventListener('click', hideCSSWindow);
        hideButton.style.backgroundColor = customBackgroundColor52;

        // Add the button to the container
        container.appendChild(hideButton);


        // Create a function to restore the CSS window
        function restoreCSSWindow() {
            container.style.display = 'block';
            document.body.removeChild(restoreButton);

        }

        // Create a button to restore the CSS window
        var restoreButton = document.createElement('button');
        restoreButton.textContent = 'FORX';
        restoreButton.style.position = 'absolute';
        restoreButton.style.bottom = '10px';
        restoreButton.style.left = '192px';
        restoreButton.style.zIndex = '10000';
        restoreButton.addEventListener('click', restoreCSSWindow);
        restoreButton.style.borderRadius = '8px';
        restoreButton.style.backgroundColor = customBackgroundColor52;


        // Add the button to the container
        container.appendChild(restoreButton);





        // 模擬點擊隱藏按鈕
        //hideButton.click();


        // Hide the CSS window when it's created
        hideCSSWindow();

    }



    // Call the function to add the TradingView widget
    addTradingViewWidget();

})();
