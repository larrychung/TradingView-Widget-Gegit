// ==UserScript==
// @name         TradingView Widget CSS-3.Stock Heatmap Widget
// @namespace    https://www.tradingview.com/widget-docs/widgets/heatmaps/stock-heatmap/
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
    let customBackgroundColor31 = "#121c09";
    let customBackgroundColor32 = "#155900";
    GM_addStyle(".tradingview-popup-script31{background-color: " + customBackgroundColor31 + " !important }");
    GM_addStyle(".tradingview-popup-script32{background-color: " + customBackgroundColor32 + " !important }");



    // Add CSS styles for the popup
    addCSS(`
        .tradingview-popup-script31{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: scale(1.1) translate(-53%, -33%);
            background-color: #1c0909;
            border: 1px solid #262626;
            padding: 10px;
            z-index: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            cursor: move; /* 添加拖动时的鼠标样式 */
        }
`, 'tradingview-popup-scrip31');







    // Create a function to add the TradingView widget
    function addTradingViewWidget() {
        var container = document.createElement('div');
        container.className = 'tradingview-popup-script31';
        container.innerHTML = `


            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/widget-docs/widgets/heatmaps/stock-heatmap/" rel="noopener nofollow" target="_blank">
                        <span class="blue-text">3.Stock Heatmap Widget</span>
                    </a>
                </div>
            </div>
        `;







        document.body.appendChild(container);

        // Load the TradingView widget script
        var script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.async = true;




        script.innerHTML = `
            {
  "exchanges": [
    "ADX",
    "AMEX",
    "ASX",
    "BCS",
    "BER",
    "BET",
    "BIST",
    "BMFBOVESPA",
    "BSE",
    "BVC",
    "BX",
    "CSECY",
    "DUS",
    "EGX",
    "EURONEXT",
    "FWB",
    "GPW",
    "HAM",
    "HNX",
    "IDX",
    "JSE",
    "KRX",
    "KSE",
    "MIL",
    "MUN",
    "NASDAQ",
    "NASDAQDUBAI",
    "NEO",
    "NEWCONNECT",
    "NYSE",
    "OMXCOP",
    "OMXHEX",
    "OMXICE",
    "OMXRSE",
    "OMXSTO",
    "OMXTSE",
    "OMXVSE",
    "OTC",
    "QSE",
    "SIX",
    "SSE",
    "TASE",
    "TPEX",
    "TSX",
    "TSXV",
    "UPCOM",
    "XETR"
  ],
  "dataSource": "SPX500",
  "grouping": "sector",
  "blockSize": "market_cap_basic",
  "blockColor": "change",
  "locale": "zh_TW",
  "symbolUrl": "",
  "colorTheme": "dark",
  "hasTopBar": true,
  "isDataSetEnabled": true,
  "isZoomEnabled": true,
  "hasSymbolTooltip": true,
  "width": "1250",
  "height": "550"
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
            if (container.style.width === '500px') {
                container.style.width = '1300px';
                container.style.height = '550px';
            } else {
                container.style.width = '1250px';
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
        hideButton.style.top = '10px';
        hideButton.style.right = '40px';
        hideButton.style.zIndex = 'auto';
        hideButton.addEventListener('click', hideCSSWindow);
        hideButton.style.backgroundColor = customBackgroundColor32;

        // Add the button to the container
        container.appendChild(hideButton);


        // Create a function to restore the CSS window
        function restoreCSSWindow() {
            container.style.display = 'block';
            document.body.removeChild(restoreButton);
            //hideButton.style.display = 'block'; // Add this line
        }

        // Create a button to restore the CSS window
        var restoreButton = document.createElement('button');
        restoreButton.textContent = 'MAP';
        restoreButton.style.position = 'absolute';
        restoreButton.style.bottom = '10px';
        restoreButton.style.left = '100px';
        restoreButton.style.zIndex = '10000';
        restoreButton.addEventListener('click', restoreCSSWindow);
        restoreButton.style.borderRadius = '8px';
        restoreButton.style.backgroundColor = customBackgroundColor32;


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
